import { searchActiveListings } from "./search-active-listings.mjs";
import { getSession, updateSession } from "./session-memory.mjs";

function extractCity(message) {
  const cities = ["Irvine", "Anaheim", "Los Angeles", "Riverside", "San Diego"];

  for (const city of cities) {
    if (message.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }

  return null;
}

function extractPrice(message) {
  const lowerMessage = message.toLowerCase();

  const millionMatch = lowerMessage.match(/(\d+(\.\d+)?)\s*m/);

  if (millionMatch) {
    return Number(millionMatch[1]) * 1000000;
  }

  const thousandMatch = lowerMessage.match(/(\d+(\.\d+)?)\s*k/);

  if (thousandMatch) {
    return Number(thousandMatch[1]) * 1000;
  }

  const regularNumber = lowerMessage.match(/\$?([\d,]+)/);

  if (regularNumber) {
    return Number(regularNumber[1].replaceAll(",", ""));
  }

  return null;
}

function extractBeds(message) {
  const match = message.toLowerCase().match(/(\d+)\s*(bed|bedroom)/);

  return match ? Number(match[1]) : null;
}

function extractBaths(message) {
  const match = message.toLowerCase().match(/(\d+)\s*(bath|bathroom)/);

  return match ? Number(match[1]) : null;
}

function extractType(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("condo")) {
    return "Condominium";
  }

  if (lowerMessage.includes("townhouse")) {
    return "Townhouse";
  }

  if (lowerMessage.includes("single family") || lowerMessage.includes("single-family")) {
    return "Single Family Residence";
  }

  return null;
}

function extractPool(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("with a pool") || lowerMessage.includes("with pool")) {
    return true;
  }

  if (lowerMessage.includes("no pool") || lowerMessage.includes("without a pool")) {
    return false;
  }

  return null;
}

export async function handlePropertyConversation(userId, message) {
  const session = getSession(userId);

  const updates = {};

  const city = extractCity(message);
  const maxPrice = extractPrice(message);
  const beds = extractBeds(message);
  const baths = extractBaths(message);
  const type = extractType(message);
  const pool = extractPool(message);

  if (city) updates.city = city;
  if (maxPrice) updates.maxPrice = maxPrice;
  if (beds) updates.beds = beds;
  if (baths) updates.baths = baths;
  if (type) updates.type = type;
  if (pool !== null) updates.pool = pool;

  const updatedSession = updateSession(userId, {
    ...updates,
    conversationStep: session.conversationStep + 1,
  });

  if (!updatedSession.city) {
    return {
      reply: "Which city would you like to search in?",
      session: updatedSession,
    };
  }

  if (!updatedSession.maxPrice) {
    return {
      reply: "What is your maximum budget?",
      session: updatedSession,
    };
  }

  if (!updatedSession.type) {
    return {
      reply: "Do you prefer a condo, townhouse, or single-family home?",
      session: updatedSession,
    };
  }

  if (!updatedSession.beds) {
    return {
      reply: "How many bedrooms do you need?",
      session: updatedSession,
    };
  }

  const results = await searchActiveListings({
    city: updatedSession.city,
    maxPrice: updatedSession.maxPrice,
    beds: updatedSession.beds,
    baths: updatedSession.baths,
    type: updatedSession.type,
    pool: updatedSession.pool,
    limit: 5,
  });

  updateSession(userId, {
    lastResults: results,
  });

  if (results.length === 0) {
    return {
      reply:
        "I could not find any matching properties. Would you like to increase your budget or change another preference?",
      results: [],
      session: updatedSession,
    };
  }

  const formattedResults = results.map((property) => ({
    address: property.UnparsedAddress || property.StreetAddress || "Address unavailable",
    price: property.ListPrice,
    beds: property.BedroomsTotal,
    baths: property.BathroomsTotalInteger,
    photoCount: property.PhotosCount ?? 0,
  }));

  return {
    reply: `I found ${formattedResults.length} matching properties.`,
    results: formattedResults,
    session: updatedSession,
  };
}

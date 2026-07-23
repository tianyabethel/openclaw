import {
  getCityMarketSummary,
  getCityMarketTrend,
  calculateTrendChange,
} from "./market-statistics.mjs";

/*
Add more California cities here when needed.
*/
const californiaCities = [
  "Irvine",
  "Anaheim",
  "Pasadena",
  "Los Angeles",
  "San Diego",
  "Riverside",
  "Sacramento",
  "Fresno",
  "Oakland",
  "San Francisco",
  "Long Beach",
  "Santa Ana",
  "Ontario",
  "Corona",
  "Glendale",
  "Burbank",
];

function extractCity(message) {
  const lowerMessage = message.toLowerCase();

  for (const city of californiaCities) {
    if (lowerMessage.includes(city.toLowerCase())) {
      return city;
    }
  }

  return null;
}

function extractMonths(message) {
  const match = message.toLowerCase().match(/(\d+)\s*(month|months)/);

  if (match) {
    return Number(match[1]);
  }

  if (message.toLowerCase().includes("year") || message.toLowerCase().includes("annual")) {
    return 12;
  }

  return 12;
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Unavailable";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Unavailable";
  }

  return Number(value).toFixed(decimals);
}

/*
Formats the summary into a user-friendly response.
*/
function formatMarketSummary(summary, trendChange) {
  let trendSentence = "There was not enough monthly data to calculate a trend.";

  if (trendChange !== null) {
    const direction =
      trendChange > 0 ? "increased" : trendChange < 0 ? "decreased" : "remained unchanged";

    trendSentence =
      `Average prices ${direction} by ` +
      `${Math.abs(trendChange).toFixed(1)}% ` +
      `during the available period.`;
  }

  return [
    `${summary.city} market summary for the last ${summary.months} months:`,
    "",
    `Homes sold: ${summary.soldCount.toLocaleString()}`,
    `Average close price: ${formatCurrency(summary.averageClosePrice)}`,
    `Median close price: ${formatCurrency(summary.medianClosePrice)}`,
    `Average price per square foot: ${formatCurrency(summary.averagePricePerSqFt)}`,
    `Average days on market: ${formatNumber(summary.averageDaysOnMarket)} days`,
    `List-to-close ratio: ${formatNumber(summary.listToClosePercent)}%`,
    "",
    trendSentence,
  ].join("\n");
}

/*
Main Week 5 agent function.
*/
export async function handleMarketQuestion(message) {
  const city = extractCity(message);
  const months = extractMonths(message);

  if (!city) {
    return {
      reply: "Which California city would you like market statistics for?",
      summary: null,
      trend: [],
    };
  }

  const summary = await getCityMarketSummary(city, months);

  if (!summary) {
    return {
      reply:
        `I could not find residential sales data for ${city} ` +
        `during the last ${months} months.`,
      summary: null,
      trend: [],
    };
  }

  const trend = await getCityMarketTrend(city, months);

  const trendChange = calculateTrendChange(trend);

  return {
    reply: formatMarketSummary(summary, trendChange),
    summary,
    trend,
  };
}

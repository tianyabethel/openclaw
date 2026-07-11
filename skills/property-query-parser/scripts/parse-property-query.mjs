export function parsePropertyQuery(query) {
  const cityMatch = query.match(
    /\bin\s+([A-Za-z\s]+?)(?=\s+(?:under|below|with|at least|over|having|$)|[,.]|$)/i,
  );

  const priceMatch = query.match(
    /(?:under|below|max(?:imum)?(?: price)?(?: of)?)\s*\$?\s*([\d,.]+)\s*(k|m|million|thousand)?/i,
  );

  const bedsMatch = query.match(/(\d+(?:\.\d+)?)\s*[- ]?\s*(?:bed|beds|bedroom|bedrooms)/i);

  const bathsMatch = query.match(/(\d+(?:\.\d+)?)\s*[- ]?\s*(?:bath|baths|bathroom|bathrooms)/i);

  const sqftMatch = query.match(/(\d[\d,]*)\s*(?:sqft|sq ft|square feet)/i);

  const hoaMatch = query.match(
    /(?:hoa|association fee)\s*(?:under|below|max(?:imum)?(?: of)?)?\s*\$?\s*([\d,.]+)/i,
  );

  const poolMatch = /\bpool\b/i.test(query);
  const viewMatch = /\bview\b/i.test(query);

  const typeMap = {
    condo: "Condominium",
    condominium: "Condominium",
    townhouse: "Townhouse",
    townhome: "Townhouse",
    "single family": "SingleFamilyResidence",
    house: "SingleFamilyResidence",
    home: "SingleFamilyResidence",
    land: "UnimprovedLand",
  };

  const lowerQuery = query.toLowerCase();

  const typeKey = Object.keys(typeMap).find((key) => lowerQuery.includes(key));

  let maxPrice = null;

  if (priceMatch) {
    maxPrice = Number(priceMatch[1].replace(/,/g, ""));

    const suffix = priceMatch[2]?.toLowerCase();

    if (suffix === "k" || suffix === "thousand") {
      maxPrice *= 1000;
    }

    if (suffix === "m" || suffix === "million") {
      maxPrice *= 1000000;
    }
  }

  return {
    city: cityMatch?.[1]?.trim() || null,
    maxPrice,
    beds: bedsMatch ? Number(bedsMatch[1]) : null,
    baths: bathsMatch ? Number(bathsMatch[1]) : null,
    sqft: sqftMatch ? Number(sqftMatch[1].replace(/,/g, "")) : null,
    type: typeKey ? typeMap[typeKey] : null,
    pool: poolMatch ? "True" : null,
    hasView: viewMatch ? "True" : null,
    maxHoa: hoaMatch ? Number(hoaMatch[1].replace(/,/g, "")) : null,
  };
}

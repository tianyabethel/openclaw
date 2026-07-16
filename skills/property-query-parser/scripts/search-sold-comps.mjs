import { query } from "./db.mjs";

export async function getSoldComps(city, months = 12, limit = 50) {
  if (!city || typeof city !== "string") {
    throw new Error("A city is required.");
  }

  const safeMonths = Math.min(120, Math.max(1, Number(months) || 12));
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));

  const sql = `
    SELECT
      ListingKey,
      UnparsedAddress,
      City,
      CloseDate,
      ClosePrice,
      OriginalListPrice,
      ListPrice,
      DaysOnMarket,
      BedroomsTotal,
      BathroomsTotalInteger,
      LivingArea,
      PropertyType,
      PropertySubType,
      YearBuilt,
      ListAgentFullName,
      ListOfficeName,
      BuyerOfficeName
    FROM california_sold
    WHERE City = ?
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ${safeMonths} MONTH)
      AND PropertyType = 'Residential'
    ORDER BY CloseDate DESC
    LIMIT ${safeLimit}
  `;

  return query(sql, [city]);
}

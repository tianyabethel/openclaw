import { query } from "./db.mjs";

export async function searchActiveListings(filters = {}, page = 1, limit = 10) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  let sql = `
    SELECT
      L_ListingID AS listingId,
      L_DisplayId AS displayId,
      L_Address AS address,
      L_City AS city,
      L_Zip AS zip,
      L_SystemPrice AS price,
      L_Keyword2 AS beds,
      LM_Dec_3 AS baths,
      LM_Int2_3 AS sqft,
      L_Type_ AS propertyType,
      L_Status AS status,
      LMD_MP_Latitude AS latitude,
      LMD_MP_Longitude AS longitude,
      YearBuilt,
      AssociationFee,
      DaysOnMarket,
      PoolPrivateYN,
      ViewYN,
      FireplaceYN,
      PhotoCount,
      LA1_UserFirstName AS agentFirstName,
      LA1_UserLastName AS agentLastName,
      LO1_OrganizationName AS listingOffice
    FROM rets_property
    WHERE L_Status = 'Active'
  `;

  const params = [];

  if (filters.city) {
    sql += " AND L_City = ?";
    params.push(filters.city);
  }

  if (filters.maxPrice != null) {
    sql += " AND L_SystemPrice <= ?";
    params.push(Number(filters.maxPrice));
  }

  if (filters.beds != null) {
    sql += " AND L_Keyword2 >= ?";
    params.push(Number(filters.beds));
  }

  if (filters.baths != null) {
    sql += " AND LM_Dec_3 >= ?";
    params.push(Number(filters.baths));
  }

  if (filters.sqft != null) {
    sql += " AND LM_Int2_3 >= ?";
    params.push(Number(filters.sqft));
  }

  if (filters.type) {
    sql += " AND L_Type_ = ?";
    params.push(filters.type);
  }

  if (filters.pool != null) {
    sql += " AND PoolPrivateYN = ?";
    params.push(filters.pool);
  }

  if (filters.hasView != null) {
    sql += " AND ViewYN = ?";
    params.push(filters.hasView);
  }

  if (filters.maxHoa != null) {
    sql += " AND AssociationFee <= ?";
    params.push(Number(filters.maxHoa));
  }

  sql += ` ORDER BY L_SystemPrice ASC LIMIT ${safeLimit} OFFSET ${offset}`;

  return query(sql, params);
}

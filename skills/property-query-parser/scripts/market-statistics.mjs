import { query } from "./db.mjs";

/*
This function calculates the median of a list of numbers.
*/
function calculateMedian(values) {
  const cleanValues = values
    .map(Number)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (cleanValues.length === 0) {
    return null;
  }

  const middle = Math.floor(cleanValues.length / 2);

  if (cleanValues.length % 2 === 0) {
    return (cleanValues[middle - 1] + cleanValues[middle]) / 2;
  }

  return cleanValues[middle];
}

/*
Returns overall market statistics for one California city.
*/
export async function getCityMarketSummary(city, months = 12) {
  const safeMonths = Math.max(1, Math.min(Number(months) || 12, 120));

  const summarySql = `
    SELECT
      City,
      COUNT(*) AS sold_count,
      ROUND(AVG(ClosePrice), 0) AS avg_close_price,
      ROUND(
        AVG(
          CASE
            WHEN LivingArea > 0
            THEN ClosePrice / LivingArea
            ELSE NULL
          END
        ),
        2
      ) AS avg_price_per_sqft,
      ROUND(AVG(DaysOnMarket), 1) AS avg_dom,
      ROUND(
        AVG(
          CASE
            WHEN ListPrice > 0
            THEN ClosePrice / ListPrice
            ELSE NULL
          END
        ) * 100,
        1
      ) AS list_to_close_pct
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate >= DATE_SUB(
        CURDATE(),
        INTERVAL ${safeMonths} MONTH
      )
      AND ClosePrice > 0
    GROUP BY City
  `;

  const summaryRows = await query(summarySql, [city]);

  if (!summaryRows || summaryRows.length === 0) {
    return null;
  }

  /*
  MySQL does not have a simple MEDIAN() function,
  so we retrieve the prices and calculate the median
  in JavaScript.
  */
  const pricesSql = `
    SELECT ClosePrice
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate >= DATE_SUB(
        CURDATE(),
        INTERVAL ${safeMonths} MONTH
      )
      AND ClosePrice > 0
  `;

  const priceRows = await query(pricesSql, [city]);

  const medianClosePrice = calculateMedian(priceRows.map((row) => row.ClosePrice));

  return {
    city: summaryRows[0].City,
    soldCount: Number(summaryRows[0].sold_count),
    averageClosePrice: Number(summaryRows[0].avg_close_price),
    medianClosePrice,
    averagePricePerSqFt: Number(summaryRows[0].avg_price_per_sqft),
    averageDaysOnMarket: Number(summaryRows[0].avg_dom),
    listToClosePercent: Number(summaryRows[0].list_to_close_pct),
    months: safeMonths,
  };
}

/*
Returns monthly trends for one California city.
*/
export async function getCityMarketTrend(city, months = 12) {
  const safeMonths = Math.max(1, Math.min(Number(months) || 12, 120));

  const trendSql = `
    SELECT
      DATE_FORMAT(CloseDate, '%Y-%m') AS month,
      COUNT(*) AS sales,
      ROUND(AVG(ClosePrice), 0) AS avg_price,
      ROUND(AVG(DaysOnMarket), 1) AS avg_dom,
      ROUND(
        AVG(
          CASE
            WHEN LivingArea > 0
            THEN ClosePrice / LivingArea
            ELSE NULL
          END
        ),
        2
      ) AS avg_price_per_sqft,
      ROUND(
        AVG(
          CASE
            WHEN ListPrice > 0
            THEN ClosePrice / ListPrice
            ELSE NULL
          END
        ) * 100,
        1
      ) AS list_to_close_pct
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate >= DATE_SUB(
        CURDATE(),
        INTERVAL ${safeMonths} MONTH
      )
      AND ClosePrice > 0
    GROUP BY DATE_FORMAT(CloseDate, '%Y-%m')
    ORDER BY month
  `;

  const rows = await query(trendSql, [city]);

  return rows.map((row) => ({
    month: row.month,
    sales: Number(row.sales),
    averagePrice: Number(row.avg_price),
    averageDaysOnMarket: Number(row.avg_dom),
    averagePricePerSqFt: Number(row.avg_price_per_sqft),
    listToClosePercent: Number(row.list_to_close_pct),
  }));
}

/*
Calculates the price change between the first and
last month in the trend.
*/
export function calculateTrendChange(trendRows) {
  if (!trendRows || trendRows.length < 2) {
    return null;
  }

  const firstPrice = trendRows[0].averagePrice;
  const lastPrice = trendRows[trendRows.length - 1].averagePrice;

  if (!firstPrice || firstPrice === 0) {
    return null;
  }

  return ((lastPrice - firstPrice) / firstPrice) * 100;
}

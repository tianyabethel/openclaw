import { handleMarketQuestion } from "./market-statistics-agent.mjs";

async function runTests() {
  console.log("\nUSER: What is the average price per square foot in Pasadena?");

  let response = await handleMarketQuestion(
    "What is the average price per square foot in Pasadena?",
  );

  console.log("\nAGENT:");
  console.log(response.reply);

  if (response.trend.length > 0) {
    console.log("\n12-MONTH TREND:");
    console.table(response.trend);
  }

  console.log("\nUSER: How is the housing market in Irvine over the last 12 months?");

  response = await handleMarketQuestion(
    "How is the housing market in Irvine over the last 12 months?",
  );

  console.log("\nAGENT:");
  console.log(response.reply);

  if (response.trend.length > 0) {
    console.log("\n12-MONTH TREND:");
    console.table(response.trend);
  }

  console.log("\nUSER: What is the average home price?");

  response = await handleMarketQuestion("What is the average home price?");

  console.log("\nAGENT:");
  console.log(response.reply);
}

runTests().catch((error) => {
  console.error("Market agent test failed:", error.message);
});

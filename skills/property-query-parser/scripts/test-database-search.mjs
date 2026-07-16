import { testConnection, closeDatabase } from "./db.mjs";
import { searchActiveListings } from "./search-active-listings.mjs";
import { getSoldComps } from "./search-sold-comps.mjs";

async function runTests() {
  try {
    console.log("Testing database connection...");

    const connected = await testConnection();
    console.log("Database connected:", connected);

    const filters = {
      city: "Irvine",
      maxPrice: 1500000,
      beds: 3,
      type: "Condominium",
      pool: "True",
    };

    console.log("\nTesting active listing search...");
    const activeListings = await searchActiveListings(filters, 1, 10);

    console.log(`Active listings returned: ${activeListings.length}`);
    console.table(activeListings.slice(0, 5));

    console.log("\nTesting sold comps search...");
    const soldComps = await getSoldComps("Irvine", 12, 10);

    console.log(`Sold comps returned: ${soldComps.length}`);
    console.table(soldComps.slice(0, 5));

    console.log("\nAll tests completed.");
  } catch (error) {
    console.error("\nTest failed:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

runTests();
console.log("Test file is running");

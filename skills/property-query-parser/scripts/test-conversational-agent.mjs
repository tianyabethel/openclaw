import { handlePropertyConversation } from "./conversational-property-agent.mjs";
import { clearSession } from "./session-memory.mjs";

const userId = "test-user-1";

async function runTest() {
  clearSession(userId);

  console.log("\nUSER: Find homes in Irvine");

  let response = await handlePropertyConversation(userId, "Find homes in Irvine");

  console.log("AGENT:", response.reply);

  console.log("\nUSER: Under $1.2M");

  response = await handlePropertyConversation(userId, "Under $1.2M");

  console.log("AGENT:", response.reply);

  console.log("\nUSER: Single family with at least 3 bedrooms");

  response = await handlePropertyConversation(userId, "Single family with at least 3 bedrooms");

  console.log("AGENT:", response.reply);

  if (response.results) {
    console.table(response.results);
  }
}

runTest().catch((error) => {
  console.error("Test failed:", error.message);
});

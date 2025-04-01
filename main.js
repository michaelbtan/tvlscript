require("dotenv").config();
const { formatTVL } = require("./utils");
const { fetchAllMercataData } = require("./fetchMercataData");
const appendToAirtable = require("./appendToAirtable");

(async () => {
  try {
    const { mercataEscrowData } = await fetchAllMercataData();
    const sum = mercataEscrowData?.[0]?.sum || 0;
    const formattedSum = formatTVL(sum);

    await appendToAirtable({
      Timestamp: new Date().toISOString().split('T')[0],
      "Total Value Locked": formattedSum,
    });
  
  } catch (err) {
    console.error("Job failed:", err);
  }
})();

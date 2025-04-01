require('dotenv').config();
const { fetchAllMercataData } = require('./fetchMercataData');
const appendToAirtable = require('./appendToAirtable');

  const formatTVL = (sum) => {
    const formattedValue = (sum / Math.pow(10, 18)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
    return formattedValue;
  };

  (async () => {
    try {
      const { mercataEscrowData } = await fetchAllMercataData();
      const sum = mercataEscrowData?.[0]?.sum || 0;
        const formattedSum = formatTVL(sum);
  
      await appendToAirtable({
        Date: new Date().toISOString(),
        EscrowSum: formattedSum
      });
    } catch (err) {
      console.error('Job failed:', err);
    }
  })();


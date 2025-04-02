const getBearerToken = require('./getBearerToken');

const BASE_URL = "https://marketplace.mercata.blockapps.net/cirrus/search";

async function fetchWithRetry(endpoint, queryParams = {}, retries = 3, token) {
  let lastError = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed for ${endpoint}:`, error);

      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error(`Failed to fetch data for ${endpoint} after ${retries} attempts`);
}

async function fetchMercataData(endpoint, queryParams = {}) {
  const token = await getBearerToken();
  return fetchWithRetry(endpoint, queryParams, 3, token);
}

async function fetchAllMercataData() {
  try {
    const token = await getBearerToken();

    const [mercataEscrowData] = await Promise.all([
      fetchWithRetry("BlockApps-Mercata-Escrow", {
        creator: "in.(BlockApps,mercata_usdst)",
        isActive: "eq.true",
        select: "collateralValue.sum()"
      }, 3, token)
    ]);

    return { mercataEscrowData };
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchMercataData, fetchAllMercataData };

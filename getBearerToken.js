let cachedToken = null;
let tokenExpiry = null;
const TOKEN_BUFFER = 60 * 1000; // 1 minute buffer

async function getBearerToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - TOKEN_BUFFER) {
    console.log('Using cached token');
    return cachedToken;
  }

  const realmName = process.env.MERCATA_RELM || 'mercata';
  const clientId = process.env.MERCATA_CLIENT_ID || 'localhost';
  const clientSecret = process.env.MERCATA_CLIENT_SECRET;

  if (!realmName || !clientId || !clientSecret) {
    throw new Error('Missing required environment variables for Mercata authentication');
  }

  const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = `https://keycloak.blockapps.net/auth/realms/${realmName}/protocol/openid-connect/token`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${basicToken}`
  };

  const payload = new URLSearchParams({ 'grant_type': 'client_credentials' });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: payload
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token request failed: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();

    if (response.status === 200) {
      cachedToken = responseData.access_token;
      tokenExpiry = Date.now() + (responseData.expires_in * 1000);
      return responseData.access_token;
    } else {
      throw new Error(`Failed to obtain bearer token: ${JSON.stringify(responseData)}`);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = getBearerToken;

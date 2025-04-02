const Airtable = require("airtable");

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function appendToAirtable(data) {
  try {
    const createdRecords = await base(AIRTABLE_TABLE_NAME).create([
      {
        fields: data,
      },
    ]);

    return createdRecords;

  } catch (error) {
    throw error;
  }
}

module.exports = appendToAirtable;

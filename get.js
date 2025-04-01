const Airtable = require('airtable');

const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function readFromAirtable({ sortBy = 'Timestamp', sortDirection = 'desc' } = {}) {
  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        sort: [{ field: sortBy, direction: sortDirection }],
      })
      .all();

    const data = records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    console.log('Read from Airtable:', data);
    return data;
  } catch (error) {
    console.error('Error reading from Airtable:', error);
    throw error;
  }
}

module.exports = readFromAirtable;

const Airtable = require('airtable');

const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function appendToAirtable(data) {
  try {
    const createdRecords = await base(AIRTABLE_TABLE_NAME).create([
      {
        fields: data
      }
    ]);

    console.log('Appended to Airtable:', createdRecords);
    return createdRecords;

//     const records = await base(AIRTABLE_TABLE_NAME).select().firstPage();
// console.log(records);
  } catch (error) {
    console.error('Error appending to Airtable:', error);
    throw error;
  }
}

module.exports = appendToAirtable;

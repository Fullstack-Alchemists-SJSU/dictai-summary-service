import { VapiService } from './services/vapiService';
import { SummaryService } from './services/summaryService';
import dotenv from 'dotenv';

dotenv.config();

async function testSummaryFlow() {
  console.log('Starting Summary Service Test Flow...\n');

  const vapiService = new VapiService();
  const summaryService = new SummaryService();

  try {
    // Set the end date to December 8, 2024
    const endDate = new Date('2024-12-08');
    const days = 7; // Get entries from the past 7 days

    // 1. Fetch calls from Vapi
    console.log('1. Fetching calls from Vapi...\n');
    const calls = await vapiService.getCalls();
    console.log(`Found ${calls.length} calls\n`);

    // 2. Transform to journal entries
    console.log('2. Transforming to journal entries...\n');
    const journalEntries = calls.map(call => vapiService.transformToJournalEntry(call));
    console.log(`Transformed ${journalEntries.length} entries\n`);

    // 3. Filter valid entries from last 7 days
    console.log('3. Filtering valid entries from last 7 days...\n');
    const validEntries = summaryService.extractValidTranscripts(journalEntries, days, endDate);
    console.log(`Found ${validEntries.length} valid entries\n`);

    // 4. Generate weekly summary
    console.log('4. Generating weekly summary...\n');
    const summary = await summaryService.createWeeklySummary(days, endDate);
    console.log('Summary Result:', JSON.stringify(summary, null, 2));

  } catch (error) {
    console.error('\nTest failed with error:');
    console.error(error);
  }
}

testSummaryFlow(); 
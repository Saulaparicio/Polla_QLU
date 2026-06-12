const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'WCup_2026_4.2.5_en.xlsx');

try {
  const workbook = XLSX.readFile(excelPath);
  const matchesSheet = workbook.Sheets['Matches'];
  const rows = XLSX.utils.sheet_to_json(matchesSheet, { header: 1 });
  
  console.log("Rows 108 to 125:");
  rows.slice(108, 125).forEach((row, i) => {
    console.log(`Row ${i + 108}:`, row);
  });
} catch (error) {
  console.error('Error:', error);
}

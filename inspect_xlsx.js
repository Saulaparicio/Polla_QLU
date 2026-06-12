const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'WCup_2026_4.2.5_en.xlsx');

try {
  const workbook = XLSX.readFile(excelPath);
  const groupsSheet = workbook.Sheets['Groups'];
  const rows = XLSX.utils.sheet_to_json(groupsSheet, { header: 1 });
  
  rows.forEach((row, i) => {
    if (row && row.length > 0) {
      console.log(`Row ${i}:`, row);
    }
  });
} catch (error) {
  console.error('Error:', error);
}

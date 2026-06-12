const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'WCup_2026_4.2.5_en.xlsx');

try {
  const workbook = XLSX.readFile(excelPath);
  const groupsSheet = workbook.Sheets['Groups'];
  const rows = XLSX.utils.sheet_to_json(groupsSheet, { header: 1 });
  
  const teams = [];
  rows.forEach((row) => {
    if (!row || row.length === 0) return;
    const code = row[1];
    if (code && typeof code === 'string' && /^[A-L][1-4]$/.test(code)) {
      teams.push({
        code,
        name: row[3]
      });
    }
  });
  
  console.log(JSON.stringify(teams, null, 2));
} catch (error) {
  console.error('Error:', error);
}

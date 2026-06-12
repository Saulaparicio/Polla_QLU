const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'WCup_2026_4.2.5_en.xlsx');

try {
  const workbook = XLSX.readFile(excelPath);
  
  // 1. Get teams from Groups sheet
  const groupsSheet = workbook.Sheets['Groups'];
  const groupRows = XLSX.utils.sheet_to_json(groupsSheet, { header: 1 });
  const groupsTeams = new Set();
  groupRows.forEach((row) => {
    if (!row || row.length === 0) return;
    const code = row[1];
    if (code && typeof code === 'string' && /^[A-L][1-4]$/.test(code)) {
      groupsTeams.add(row[3]);
    }
  });

  // 2. Get teams from Matches sheet (first 72 matches)
  const matchesSheet = workbook.Sheets['Matches'];
  const matchRows = XLSX.utils.sheet_to_json(matchesSheet, { header: 1 });
  const matchesTeams = new Set();
  matchRows.forEach((row) => {
    if (!row || row.length === 0) return;
    const matchNo = row[1];
    if (typeof matchNo === 'number' && matchNo >= 1 && matchNo <= 72) {
      if (row[8]) matchesTeams.add(row[8]);
      if (row[9]) matchesTeams.add(row[9]);
    }
  });

  console.log(`Groups teams count: ${groupsTeams.size}`);
  console.log(`Matches teams count: ${matchesTeams.size}`);

  const diff1 = [...groupsTeams].filter(x => !matchesTeams.has(x));
  const diff2 = [...matchesTeams].filter(x => !groupsTeams.has(x));

  console.log("Teams in Groups but not in Matches:", diff1);
  console.log("Teams in Matches but not in Groups:", diff2);
} catch (error) {
  console.error(error);
}

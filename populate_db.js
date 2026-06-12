const { initializeApp } = require('firebase/app');
const { getFirestore, writeBatch, doc } = require('firebase/firestore');
const XLSX = require('xlsx');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyBFQ3W6Zu8btd6r8-G8Q0m9d_O9-4immPA",
  authDomain: "qlupolla.firebaseapp.com",
  projectId: "qlupolla",
  storageBucket: "qlupolla.firebasestorage.app",
  messagingSenderId: "154565954993",
  appId: "1:154565954993:web:f95c3ff65b694f93590190"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const excelPath = path.join(__dirname, 'WCup_2026_4.2.5_en.xlsx');

const TEAMS_MAP = {
  "Mexico": { code: "MEX", flag: "🇲🇽", nameEs: "México", nameEn: "Mexico", group: "A" },
  "South Africa": { code: "RSA", flag: "🇿🇦", nameEs: "Sudáfrica", nameEn: "South Africa", group: "A" },
  "Rep. of Korea": { code: "KOR", flag: "🇰🇷", nameEs: "Corea del Sur", nameEn: "Rep. of Korea", group: "A" },
  "Czech Rep.": { code: "CZE", flag: "🇨🇿", nameEs: "República Checa", nameEn: "Czech Rep.", group: "A" },
  "Canada": { code: "CAN", flag: "🇨🇦", nameEs: "Canadá", nameEn: "Canada", group: "B" },
  "Bosnia/Herzeg.": { code: "BIH", flag: "🇧🇦", nameEs: "Bosnia y Herzegovina", nameEn: "Bosnia/Herzeg.", group: "B" },
  "Qatar": { code: "QAT", flag: "🇶🇦", nameEs: "Catar", nameEn: "Qatar", group: "B" },
  "Switzerland": { code: "SUI", flag: "🇨🇭", nameEs: "Suiza", nameEn: "Switzerland", group: "B" },
  "Brazil": { code: "BRA", flag: "🇧🇷", nameEs: "Brasil", nameEn: "Brazil", group: "C" },
  "Morocco": { code: "MAR", flag: "🇲🇦", nameEs: "Marruecos", nameEn: "Morocco", group: "C" },
  "Haiti": { code: "HAI", flag: "🇭🇹", nameEs: "Haití", nameEn: "Haiti", group: "C" },
  "Scotland": { code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", nameEs: "Escocia", nameEn: "Scotland", group: "C" },
  "USA": { code: "USA", flag: "🇺🇸", nameEs: "Estados Unidos", nameEn: "USA", group: "D" },
  "Paraguay": { code: "PAR", flag: "🇵🇾", nameEs: "Paraguay", nameEn: "Paraguay", group: "D" },
  "Australia": { code: "AUS", flag: "🇦🇺", nameEs: "Australia", nameEn: "Australia", group: "D" },
  "Turkey": { code: "TUR", flag: "🇹🇷", nameEs: "Turquía", nameEn: "Turkey", group: "D" },
  "Germany": { code: "GER", flag: "🇩🇪", nameEs: "Alemania", nameEn: "Germany", group: "E" },
  "Curaçao": { code: "CUW", flag: "🇨🇼", nameEs: "Curazao", nameEn: "Curaçao", group: "E" },
  "Ivory Coast": { code: "CIV", flag: "🇨🇮", nameEs: "Costa de Marfil", nameEn: "Ivory Coast", group: "E" },
  "Ecuador": { code: "ECU", flag: "🇪🇨", nameEs: "Ecuador", nameEn: "Ecuador", group: "E" },
  "Netherlands": { code: "NED", flag: "🇳🇱", nameEs: "Países Bajos", nameEn: "Netherlands", group: "F" },
  "Japan": { code: "JPN", flag: "🇯🇵", nameEs: "Japón", nameEn: "Japan", group: "F" },
  "Sweden": { code: "SWE", flag: "🇸🇪", nameEs: "Suecia", nameEn: "Sweden", group: "F" },
  "Tunisia": { code: "TUN", flag: "🇹🇳", nameEs: "Túnez", nameEn: "Tunisia", group: "F" },
  "Belgium": { code: "BEL", flag: "🇧🇪", nameEs: "Bélgica", nameEn: "Belgium", group: "G" },
  "Egypt": { code: "EGY", flag: "🇪🇬", nameEs: "Egipto", nameEn: "Egypt", group: "G" },
  "IR Iran": { code: "IRN", flag: "🇮🇷", nameEs: "Irán", nameEn: "IR Iran", group: "G" },
  "New Zealand": { code: "NZL", flag: "🇳🇿", nameEs: "Nueva Zelanda", nameEn: "New Zealand", group: "G" },
  "Spain": { code: "ESP", flag: "🇪🇸", nameEs: "España", nameEn: "Spain", group: "H" },
  "Cape Verde": { code: "CPV", flag: "🇨🇻", nameEs: "Cabo Verde", nameEn: "Cape Verde", group: "H" },
  "Saudi Arabia": { code: "KSA", flag: "🇸🇦", nameEs: "Arabia Saudita", nameEn: "Saudi Arabia", group: "H" },
  "Uruguay": { code: "URU", flag: "🇺🇾", nameEs: "Uruguay", nameEn: "Uruguay", group: "H" },
  "France": { code: "FRA", flag: "🇫🇷", nameEs: "Francia", nameEn: "France", group: "I" },
  "Senegal": { code: "SEN", flag: "🇸🇳", nameEs: "Senegal", nameEn: "Senegal", group: "I" },
  "Iraq": { code: "IRQ", flag: "🇮🇶", nameEs: "Irak", nameEn: "Iraq", group: "I" },
  "Norway": { code: "NOR", flag: "🇳🇴", nameEs: "Noruega", nameEn: "Norway", group: "I" },
  "Argentina": { code: "ARG", flag: "🇦🇷", nameEs: "Argentina", nameEn: "Argentina", group: "J" },
  "Algeria": { code: "ALG", flag: "🇩🇿", nameEs: "Argelia", nameEn: "Algeria", group: "J" },
  "Austria": { code: "AUT", flag: "🇦🇹", nameEs: "Austria", nameEn: "Austria", group: "J" },
  "Jordan": { code: "JOR", flag: "🇯🇴", nameEs: "Jordania", nameEn: "Jordan", group: "J" },
  "Portugal": { code: "POR", flag: "🇵🇹", nameEs: "Portugal", nameEn: "Portugal", group: "K" },
  "DR Congo": { code: "COD", flag: "🇨🇩", nameEs: "R. D. del Congo", nameEn: "DR Congo", group: "K" },
  "Uzbekistan": { code: "UZB", flag: "🇺🇿", nameEs: "Uzbekistán", nameEn: "Uzbekistan", group: "K" },
  "Colombia": { code: "COL", flag: "🇨🇴", nameEs: "Colombia", nameEn: "Colombia", group: "K" },
  "England": { code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nameEs: "Inglaterra", nameEn: "England", group: "L" },
  "Croatia": { code: "CRO", flag: "🇭🇷", nameEs: "Croacia", nameEn: "Croatia", group: "L" },
  "Ghana": { code: "GHA", flag: "🇬🇭", nameEs: "Ghana", nameEn: "Ghana", group: "L" },
  "Panama": { code: "PAN", flag: "🇵🇦", nameEs: "Panamá", nameEn: "Panama", group: "L" }
};

function translateSlot(slot) {
  if (!slot) return "";
  slot = slot.trim();
  if (slot.startsWith("W")) {
    return "Ganador " + slot.substring(1);
  }
  if (slot.startsWith("RU")) {
    return "Perdedor " + slot.substring(2);
  }
  if (/^[12][A-L]$/.test(slot)) {
    const num = slot[0] === '1' ? 'Primero' : 'Segundo';
    const group = slot[1];
    return `${num} Grupo ${group}`;
  }
  if (slot.startsWith("3-")) {
    const groups = slot.substring(2).split("").join("/");
    return `Mejor 3° Grupo ${groups}`;
  }
  return slot;
}

function parseExcelDate(serial) {
  if (typeof serial !== 'number') return { date: 'TBD', time: 'TBD' };
  const utcMs = Math.round((serial - 25569) * 86400 * 1000);
  const dateObj = new Date(utcMs);
  
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
}

function getStageName(matchNumber) {
  if (matchNumber <= 72) return 'Fase de Grupos';
  if (matchNumber <= 88) return 'Dieciseisavos de Final';
  if (matchNumber <= 96) return 'Octavos de Final';
  if (matchNumber <= 100) return 'Cuartos de Final';
  if (matchNumber <= 102) return 'Semifinales';
  if (matchNumber === 103) return 'Tercer Puesto';
  if (matchNumber === 104) return 'Final';
  return 'Fase Desconocida';
}

async function populate() {
  try {
    console.log("Reading workbook...");
    const workbook = XLSX.readFile(excelPath);

    // 1. Process Teams
    console.log("Processing teams from Groups sheet...");
    const groupsSheet = workbook.Sheets['Groups'];
    const groupRows = XLSX.utils.sheet_to_json(groupsSheet, { header: 1 });
    const teams = [];
    
    groupRows.forEach((row) => {
      if (!row || row.length === 0) return;
      const slotCode = row[1];
      if (slotCode && typeof slotCode === 'string' && /^[A-L][1-4]$/.test(slotCode)) {
        const excelName = row[3];
        const teamInfo = TEAMS_MAP[excelName];
        if (teamInfo) {
          teams.push({
            id: teamInfo.code,
            name: teamInfo.nameEs,
            nameEn: teamInfo.nameEn,
            nameEs: teamInfo.nameEs,
            flag: teamInfo.flag,
            group: teamInfo.group,
            slot: slotCode,
            points: 0,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0
          });
        } else {
          console.warn(`Warning: No mapping found for team name "${excelName}"`);
        }
      }
    });

    console.log(`Found ${teams.length} teams. Preparing Firestore batch...`);
    const teamsBatch = writeBatch(db);
    teams.forEach((team) => {
      const docRef = doc(db, 'teams', team.id);
      teamsBatch.set(docRef, team);
    });
    await teamsBatch.commit();
    console.log("Successfully uploaded all 48 teams to Firestore!");

    // 2. Process Matches
    console.log("Processing matches from Matches sheet...");
    const matchesSheet = workbook.Sheets['Matches'];
    const matchRows = XLSX.utils.sheet_to_json(matchesSheet, { header: 1 });
    const matches = [];

    matchRows.forEach((row) => {
      if (!row || row.length === 0) return;
      const matchNo = row[1];
      if (typeof matchNo !== 'number') return; // Skip headers or non-match rows

      const homeSlot = row[2];
      const awaySlot = row[3];
      const dateSerial = row[4];
      const venue = row[7] || 'TBD';
      
      const { date, time } = parseExcelDate(dateSerial);
      const stage = getStageName(matchNo);
      
      let homeTeam = '';
      let awayTeam = '';
      let homeTeamId = '';
      let awayTeamId = '';
      
      // Determine if it's a team name or placeholder slot
      const excelHomeTeamName = row[8];
      const excelAwayTeamName = row[9];

      if (excelHomeTeamName && excelHomeTeamName.trim() !== '') {
        const teamInfo = TEAMS_MAP[excelHomeTeamName.trim()];
        if (teamInfo) {
          homeTeam = teamInfo.nameEs;
          homeTeamId = teamInfo.code;
        } else {
          homeTeam = excelHomeTeamName;
          homeTeamId = excelHomeTeamName.toUpperCase().slice(0, 3);
        }
      } else {
        homeTeam = translateSlot(homeSlot);
        homeTeamId = homeSlot;
      }

      if (excelAwayTeamName && excelAwayTeamName.trim() !== '') {
        const teamInfo = TEAMS_MAP[excelAwayTeamName.trim()];
        if (teamInfo) {
          awayTeam = teamInfo.nameEs;
          awayTeamId = teamInfo.code;
        } else {
          awayTeam = excelAwayTeamName;
          awayTeamId = excelAwayTeamName.toUpperCase().slice(0, 3);
        }
      } else {
        awayTeam = translateSlot(awaySlot);
        awayTeamId = awaySlot;
      }

      const isGroupStage = matchNo <= 72;
      const groupName = isGroupStage ? `Grupo ${homeSlot[0]}` : '';

      matches.push({
        id: String(matchNo),
        matchNumber: matchNo,
        homeTeam,
        awayTeam,
        homeTeamId,
        awayTeamId,
        date,
        time,
        venue,
        group: groupName,
        stage,
        status: 'scheduled',
        result: {
          homeScore: null,
          awayScore: null,
          winner: null
        }
      });
    });

    console.log(`Found ${matches.length} matches. Preparing Firestore batches...`);
    // Standard Firestore batch limit is 500, but we have 104 matches, which fits in a single batch.
    const matchesBatch = writeBatch(db);
    matches.forEach((match) => {
      const docRef = doc(db, 'matches', match.id);
      matchesBatch.set(docRef, match);
    });
    await matchesBatch.commit();
    console.log("Successfully uploaded all 104 matches to Firestore!");

    console.log("Database successfully populated with official groups, teams, and matches!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
}

populate();

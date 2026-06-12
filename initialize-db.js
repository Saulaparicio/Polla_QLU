const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// 1. Firebase Admin SDK Initialization
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✔ Firebase Admin SDK initialized using serviceAccountKey.json');
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log('✔ Firebase Admin SDK initialized using Application Default Credentials');
  } catch (error) {
    console.error('❌ Error: Could not initialize Firebase Admin SDK.');
    console.error('\nTo run this script locally:');
    console.error('1. Go to Firebase Console > Project Settings > Service Accounts.');
    console.error('2. Click "Generate New Private Key" and download the JSON file.');
    console.error('3. Place the file in the root of this project and rename it to "serviceAccountKey.json".');
    console.error('Note: This file is already ignored in git to protect your credentials.\n');
    process.exit(1);
  }
}

const db = admin.firestore();

// 2. Helper functions for parsing and cleaning
const cleanRow = (row) => {
  const cleaned = {};
  for (let key in row) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      // Clean up headers and cell values from Excel whitespace
      const cleanKey = key.trim().replace(/^\uFEFF/, ''); // Remove BOM if present
      cleaned[cleanKey] = row[key] ? row[key].trim() : '';
    }
  }
  return cleaned;
};

const isEmptyRow = (row) => {
  // Check if all fields are empty strings
  return Object.values(row).every(val => val === '');
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found at: ${filePath}`));
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// 3. Batch Saving Helper for Firestore
const saveToFirestoreInBatches = async (collectionName, dataArray, docIdKey) => {
  const collectionRef = db.collection(collectionName);
  let batch = db.batch();
  let count = 0;
  let totalSaved = 0;

  for (const item of dataArray) {
    const docId = docIdKey && item[docIdKey] ? String(item[docIdKey]) : null;
    const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();
    
    // Merge or set document data
    batch.set(docRef, item, { merge: true });
    count++;

    if (count === 500) {
      await batch.commit();
      totalSaved += count;
      console.log(`  ➡ Batch of ${count} saved to "${collectionName}"...`);
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    totalSaved += count;
    console.log(`  ➡ Final batch of ${count} saved to "${collectionName}".`);
  }

  return totalSaved;
};

// 4. Main Execution function
const run = async () => {
  try {
    const groupsPath = path.join(__dirname, 'Groups.csv');
    const matchesPath = path.join(__dirname, 'Matches.csv');

    console.log('🔄 Loading and processing data...');

    // A. Process Groups / Teams
    let teams = [];
    if (fs.existsSync(groupsPath)) {
      console.log(`Parsing ${groupsPath}...`);
      const groupsRaw = await parseCSV(groupsPath);
      
      groupsRaw.forEach((row, index) => {
        const clean = cleanRow(row);
        if (isEmptyRow(clean)) return;

        let groupVal = '';
        let teamVal = '';

        // Dynamically find values mapping to Group and Team headers (handling Spanish / English)
        for (const [key, val] of Object.entries(clean)) {
          if (/group|grupo/i.test(key)) groupVal = val;
          if (/team|equipo|nombre/i.test(key)) teamVal = val;
        }

        if (!teamVal) return; // Skip if no team name found

        // Create standard team code (e.g. Argentina -> ARG, Mexico -> MEX)
        // Feel free to adapt this if you have explicit country codes in your file
        const teamId = teamVal.toUpperCase()
          .normalize('NFD') // Normalize Spanish accents (México -> Mexico)
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^A-Z0-9]/g, '')
          .slice(0, 3) || `T_${index + 1}`;

        teams.push({
          id: teamId,
          name: teamVal,
          group: groupVal || 'TBD',
          points: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      console.log(`Parsed ${teams.length} teams.`);
    } else {
      console.warn(`⚠ Warning: Groups.csv not found. Skipping teams initialization.`);
    }

    // B. Process Matches
    let matches = [];
    if (fs.existsSync(matchesPath)) {
      console.log(`Parsing ${matchesPath}...`);
      const matchesRaw = await parseCSV(matchesPath);

      matchesRaw.forEach((row, index) => {
        const clean = cleanRow(row);
        if (isEmptyRow(clean)) return;

        let matchId = '';
        let homeTeamVal = '';
        let awayTeamVal = '';
        let dateVal = '';
        let timeVal = '';
        let stadiumVal = '';
        let groupVal = '';
        let stageVal = '';

        // Dynamically map headers (handles case insensitivity, Spanish, English, spaces)
        for (const [key, val] of Object.entries(clean)) {
          if (/id|match_number|partido|n.*?mero/i.test(key)) matchId = val;
          if (/home_team|team_a|equipo_a|equipo\s*1|local/i.test(key)) homeTeamVal = val;
          if (/away_team|team_b|equipo_b|equipo\s*2|visitante/i.test(key)) awayTeamVal = val;
          if (/date|fecha/i.test(key)) dateVal = val;
          if (/time|hora/i.test(key)) timeVal = val;
          if (/stadium|stadium_name|estadio|sede|venue/i.test(key)) stadiumVal = val;
          if (/group|grupo/i.test(key)) groupVal = val;
          if (/stage|fase|ronda/i.test(key)) stageVal = val;
        }

        // Filter out headers that repeated in the CSV, empty rows, or row dividers
        if (!homeTeamVal || !awayTeamVal || /equipo|team/i.test(homeTeamVal)) {
          return;
        }

        const numericId = parseInt(matchId, 10) || (index + 1);
        const finalMatchId = String(numericId);

        // Normalize team IDs for mapping
        const homeTeamId = homeTeamVal.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '').slice(0, 3);
        const awayTeamId = awayTeamVal.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '').slice(0, 3);

        matches.push({
          id: finalMatchId,
          matchNumber: numericId,
          homeTeam: homeTeamVal,
          awayTeam: awayTeamVal,
          homeTeamId,
          awayTeamId,
          date: dateVal || 'TBD',
          time: timeVal || 'TBD',
          venue: stadiumVal || 'TBD',
          group: groupVal || '',
          stage: stageVal || 'Group Stage',
          status: 'scheduled', // status can be: scheduled, live, finished
          result: {
            homeScore: null,
            awayScore: null,
            winner: null
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      console.log(`Parsed ${matches.length} matches.`);
    } else {
      console.warn(`⚠ Warning: Matches.csv not found. Skipping matches initialization.`);
    }

    // C. Upload data to Firestore
    if (teams.length > 0) {
      console.log('📤 Uploading teams to Firestore...');
      const savedTeams = await saveToFirestoreInBatches('teams', teams, 'id');
      console.log(`✔ Successfully initialized ${savedTeams} teams.`);
    }

    if (matches.length > 0) {
      console.log('📤 Uploading matches to Firestore...');
      const savedMatches = await saveToFirestoreInBatches('matches', matches, 'id');
      console.log(`✔ Successfully initialized ${savedMatches} matches.`);
    }

    console.log('🎉 Data initialization finished successfully!');
    process.exit(0);
  } catch (error) {
    if (error.message && (
      error.message.includes('credential') || 
      error.message.includes('auth') || 
      error.message.includes('key') || 
      error.message.includes('projectId') || 
      error.message.includes('Could not load the default credentials')
    )) {
      console.error('\n❌ Authentication Error: Could not connect to Google Cloud/Firestore.');
      console.error('Please ensure you have configured your environment credentials or provided a service account key.');
      console.error('To run this script locally:');
      console.error('1. Go to your Firebase Console > Project Settings > Service Accounts.');
      console.error('2. Click "Generate New Private Key" and download the JSON file.');
      console.error('3. Place the file in the root of this project and rename it to "serviceAccountKey.json".');
      console.error('Note: This file is already configured in .gitignore to protect your credentials.\n');
    } else {
      console.error('❌ Error during database population:', error);
    }
    process.exit(1);
  }
};

run();

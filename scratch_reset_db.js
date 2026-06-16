const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');

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

async function reset() {
  try {
    // 1. Delete all predictions
    console.log("Fetching predictions...");
    const predsSnap = await getDocs(collection(db, "predictions"));
    console.log(`Found ${predsSnap.size} predictions. Deleting...`);
    
    let batch = writeBatch(db);
    let count = 0;
    for (const docSnap of predsSnap.docs) {
      batch.delete(docSnap.ref);
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    console.log("All predictions deleted successfully.");

    // 2. Reset user rankings / points
    console.log("Fetching users...");
    const usersSnap = await getDocs(collection(db, "users"));
    console.log(`Found ${usersSnap.size} users. Resetting points and stats...`);
    
    batch = writeBatch(db);
    count = 0;
    for (const docSnap of usersSnap.docs) {
      const userRef = doc(db, "users", docSnap.id);
      batch.update(userRef, {
        points: 0,
        correctScores: 0,
        predictionsCount: 0,
        globalErrorMargin: 0
      });
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    console.log("All user scores, correct scores, predictions count, and error margin reset to 0.");

    // 3. Reset all matches status and results
    console.log("Fetching matches...");
    const matchesSnap = await getDocs(collection(db, "matches"));
    console.log(`Found ${matchesSnap.size} matches. Resetting status and scores...`);
    
    batch = writeBatch(db);
    count = 0;
    for (const docSnap of matchesSnap.docs) {
      const matchRef = doc(db, "matches", docSnap.id);
      batch.update(matchRef, {
        status: 'scheduled',
        result: {
          homeScore: null,
          awayScore: null,
          winner: null
        }
      });
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    console.log("All matches reset to scheduled and scores cleared.");

    // 4. Reset all teams points and stats
    console.log("Fetching teams...");
    const teamsSnap = await getDocs(collection(db, "teams"));
    console.log(`Found ${teamsSnap.size} teams. Resetting points and stats...`);
    
    batch = writeBatch(db);
    count = 0;
    for (const docSnap of teamsSnap.docs) {
      const teamRef = doc(db, "teams", docSnap.id);
      batch.update(teamRef, {
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      });
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    console.log("All teams statistics and points reset to 0.");
    console.log("🎉 Database reset completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

reset();

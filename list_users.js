const admin = require('firebase-admin');
const fs = require('fs');

if (fs.existsSync('./serviceAccountKey.json')) {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

async function listUsers() {
  console.log("Listing Auth Users:");
  const listUsersResult = await admin.auth().listUsers();
  listUsersResult.users.forEach((userRecord) => {
    console.log(`- UID: ${userRecord.uid}, Email: ${userRecord.email}, Name: ${userRecord.displayName}`);
  });

  console.log("\nListing Firestore Users:");
  const db = admin.firestore();
  const usersSnap = await db.collection('users').get();
  usersSnap.forEach(doc => {
    console.log(`- ID: ${doc.id} =>`, doc.data());
  });
}

listUsers().then(() => process.exit(0)).catch(console.error);

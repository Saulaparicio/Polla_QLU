const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function test() {
  try {
    console.log("Querying all users from Firestore:");
    const snapshot = await getDocs(collection(db, "users"));
    console.log("Found users:", snapshot.size);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Email: ${data.email}, Alias: ${data.displayName}, isAdmin: ${data.isAdmin}`);
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
test();

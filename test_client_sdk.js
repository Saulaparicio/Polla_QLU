const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, where, query } = require('firebase/firestore');

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
    console.log("Querying users...");
    const q = query(collection(db, "users"), where("email", "==", "sapaser@gmail.com"));
    const snapshot = await getDocs(q);
    console.log("Found users:", snapshot.size);
    snapshot.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
test();

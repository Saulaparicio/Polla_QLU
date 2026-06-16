importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBFQ3W6Zu8btd6r8-G8Q0m9d_O9-4immPA",
  authDomain: "qlupolla.firebaseapp.com",
  projectId: "qlupolla",
  storageBucket: "qlupolla.firebasestorage.app",
  messagingSenderId: "154565954993",
  appId: "1:154565954993:web:f95c3ff65b694f93590190"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || "Polla Mundialista";
  const notificationOptions = {
    body: payload.notification?.body || "Nueva actualización en la polla",
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

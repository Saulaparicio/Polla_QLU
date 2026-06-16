"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, app } from "@/lib/firebase";

export function usePushNotifications(user) {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || !user) {
      return;
    }

    // Wrap in try-catch in case some mobile browsers restrict permission reading
    try {
      setPermission(Notification.permission);

      if (Notification.permission === "granted") {
        getAndRegisterToken();
      }
    } catch (e) {
      console.warn("Could not read Notification.permission:", e);
    }
  }, [user]);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones push. En iOS, debes instalar la app agregándola a la pantalla de inicio (PWA).");
      return false;
    }

    const checkPermission = async (status) => {
      setPermission(status);
      if (status === "granted") {
        await getAndRegisterToken();
      }
    };

    try {
      // Modern Promise-based requestPermission
      const result = Notification.requestPermission();
      if (result && typeof result.then === "function") {
        const status = await result;
        await checkPermission(status);
        return status === "granted";
      } else {
        // Fallback callback for older mobile Safari/Chrome
        Notification.requestPermission((status) => {
          checkPermission(status);
        });
        return true;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      // Final fallback to callback syntax if promise syntax threw an error
      try {
        Notification.requestPermission((status) => {
          checkPermission(status);
        });
        return true;
      } catch (innerErr) {
        alert("No se pudo solicitar permisos de notificación en este dispositivo: " + innerErr.message);
        return false;
      }
    }
  };

  const getAndRegisterToken = async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.warn("Service workers are not supported by this browser.");
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { getMessaging, getToken } = await import("firebase/messaging");
      const messaging = getMessaging(app);

      // Register service worker explicitly
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      // Retrieve device token from FCM
      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || "BHrP7nJ0r3mPjWjD9k2mJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmJmI" // Generic placeholder if not set
      });

      if (currentToken) {
        setToken(currentToken);

        // Save token to Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          pushTokens: arrayUnion(currentToken)
        });
        console.log("FCM device token registered successfully:", currentToken);
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
    }
  };

  return { token, permission, requestPermission };
}

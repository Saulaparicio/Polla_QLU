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

    setPermission(Notification.permission);

    if (Notification.permission === "granted") {
      getAndRegisterToken();
    }
  }, [user]);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones push.");
      return false;
    }

    try {
      const status = await Notification.requestPermission();
      setPermission(status);
      if (status === "granted") {
        await getAndRegisterToken();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const getAndRegisterToken = async () => {
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

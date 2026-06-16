import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const { title, body } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Faltan los campos título o cuerpo." }, { status: 400 });
    }

    if (!adminDb || !adminMessaging) {
      return NextResponse.json({ 
        error: "El SDK de administración de Firebase no está inicializado. Asegúrate de configurar las variables de entorno FIREBASE_PRIVATE_KEY y FIREBASE_CLIENT_EMAIL en tu panel de Vercel, o subir el archivo serviceAccountKey.json a la raíz del proyecto para autorizar el envío de notificaciones push." 
      }, { status: 500 });
    }

    // Get all user tokens from Firestore
    const usersSnap = await adminDb.collection("users").get();
    const tokens = [];
    
    usersSnap.forEach((doc) => {
      const data = doc.data();
      if (data.pushTokens && Array.isArray(data.pushTokens)) {
        tokens.push(...data.pushTokens);
      }
    });

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, message: "No hay tokens de dispositivos registrados." });
    }

    // Deduplicate tokens
    const uniqueTokens = [...new Set(tokens)];

    const message = {
      notification: {
        title,
        body
      },
      tokens: uniqueTokens
    };

    // Send using sendEachForMulticast
    const response = await adminMessaging.sendEachForMulticast(message);

    console.log(`Multicast push sent. Success: ${response.successCount}, Failure: ${response.failureCount}`);

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error("Error sending push notification multicast:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

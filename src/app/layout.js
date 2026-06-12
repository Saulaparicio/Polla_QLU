import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";
import MobileNavbar from "@/components/MobileNavbar";
import MainWrapper from "@/components/MainWrapper";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QLU MatchPredict - Copa Mundial 2026",
  description: "Pronostica los resultados del mundial de fútbol 2026 y compite con tus amigos.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('user_theme') || 'dark';
                  document.documentElement.className = document.documentElement.className.replace(/\\b(light|dark)\\b/g, '') + ' ' + theme;
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full text-foreground font-sans selection:bg-primary/30 selection:text-primary">
        <AuthProvider>
          <ThemeProvider>
            <div className="flex min-h-screen">
              {/* Sidebar (desktop only) wrapped in Suspense for useSearchParams usage */}
              <Suspense fallback={null}>
                <Sidebar />
              </Suspense>

              {/* Main content area */}
              <div className="flex-1 flex flex-col min-w-0 relative">
                <TopAppBar />
                <MainWrapper>
                  {children}
                </MainWrapper>
                {/* Mobile bottom navigation bar wrapped in Suspense */}
                <Suspense fallback={null}>
                  <MobileNavbar />
                </Suspense>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

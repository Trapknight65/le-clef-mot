import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le Mot Clef | Visual Etymology",
  description: "Uncover the soul of French words. AI-powered etymology that reveals the history, visual origins, and semantic journey of words.",
  keywords: ["etymology", "french", "history", "linguistics", "AI", "visual dictionary"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://le-mot-clef.com",
    title: "Le Mot Clef | Visual Etymology",
    description: "Uncover the soul of French words with AI-powered visual etymology.",
    siteName: "Le Mot Clef"
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Mot Clef | Visual Etymology",
    description: "Uncover the soul of French words with AI-powered visual etymology.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-50 min-h-screen flex flex-col`}>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le Clef Mot | Visual Etymology",
  description: "Unlock the soul of words. AI-powered etymology revealing the history, visual roots, and semantic evolution of language.",
  keywords: ["etymology", "french", "history", "linguistics", "AI", "visual dictionary", "word origins"],
  authors: [{ name: "Allan Deschamps" }, { name: "Redbrush Agency" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://le-clef-mot.vercel.app",
    title: "Le Clef Mot | Visual Etymology",
    description: "Unlock the soul of words with AI-powered visual etymology.",
    siteName: "Le Clef Mot",
    images: [{
      url: "/brand/le_clef_mot_logo_neon_1770421909869.png",
      width: 1200,
      height: 630,
      alt: "Le Clef Mot - Visual Etymology with AI"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Clef Mot | Visual Etymology",
    description: "Unlock the soul of words with AI-powered visual etymology.",
    images: ["/brand/le_clef_mot_logo_neon_1770421909869.png"]
  },
  alternates: {
    canonical: "https://le-clef-mot.vercel.app",
    languages: {
      'fr': 'https://le-clef-mot.vercel.app',
      'en': 'https://le-clef-mot.vercel.app?lang=en'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: In production, read language from cookies for dynamic lang attribute
  // const lang = cookies().get('language')?.value || 'fr';
  const lang = 'fr'; // Default for now

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Le Clef Mot",
    "url": "https://le-clef-mot.vercel.app",
    "description": "AI-powered visual etymology for French and English words",
    "inLanguage": ["fr", "en"],
    "creator": {
      "@type": "Organization",
      "name": "Redbrush Agency",
      "founder": {
        "@type": "Person",
        "name": "Allan Deschamps"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://le-clef-mot.vercel.app/mot/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={lang} className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LanguageProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

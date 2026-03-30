'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/app/i18n/en.json';
import fr from '@/app/i18n/fr.json';

type Language = 'en' | 'fr';
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    t: Translations;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [t, setT] = useState<Translations>(en);

    useEffect(() => {
        // Load persisted language
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'en' || saved === 'fr')) {
            setLanguageState(saved);
            setT(saved === 'fr' ? fr : en);
            document.documentElement.lang = saved;
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setT(lang === 'fr' ? fr : en);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    };

    return (
        <LanguageContext.Provider value={{ language, t, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

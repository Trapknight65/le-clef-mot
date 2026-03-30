'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="neon-button-cyan flex items-center gap-2 text-sm"
            aria-label={language === 'en' ? 'Switch to French' : 'Basculer en anglais'}
        >
            <Globe className="w-4 h-4" />
            <span className="font-medium">{language.toUpperCase()}</span>
        </button>
    );
}

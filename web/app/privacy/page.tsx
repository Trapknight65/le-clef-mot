import React from 'react';
import { Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-900 selection:text-white relative overflow-hidden">

            {/* Simple Header */}
            <div className="relative z-20 p-6 flex items-center justify-between">
                <a href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                        <Shield size={16} className="text-slate-400" />
                    </div>
                </a>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12 max-w-3xl">

                <header className="mb-12 border-b border-slate-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
                    <p className="text-slate-500">Last Updated: February 6, 2026</p>
                </header>

                <div className="prose prose-invert prose-lg">
                    <p>
                        <strong>Le Mot Clef</strong> ("we", "our", or "us") respects your privacy. This policy explains how we handle your data, specifically regarding our AI-powered features.
                    </p>

                    <h3>1. Data Collection & AI Processing</h3>
                    <p>
                        Our service utilizes Artificial Intelligence to generate content. When you engage with <strong>Le Mot Clef</strong> (e.g., searching for a word), the following occurs:
                    </p>
                    <ul>
                        <li><strong>Inputs</strong>: The text you enter (e.g., a word like "Amour") is transmitted to our AI partners for processing.</li>
                        <li><strong>Processors</strong>: We use <strong>Groq</strong> (for text generation) and <strong>Fal.ai</strong> (for image synthesis). These third-party processors receive your input to generate the response.</li>
                        <li><strong>No Personal Storage</strong>: We do not store your search history or personal identifiers in our own databases. The interaction is ephemeral.</li>
                    </ul>

                    <h3>2. Cookies & Local Storage</h3>
                    <p>
                        We use minimal local storage to enhance your experience (e.g., remembering your last theme preference). We do not use invasive tracking cookies for advertising purposes.
                    </p>

                    <h3>3. Third-Party Links</h3>
                    <p>
                        Our site may contain links to external sites (e.g., LinkedIn). We are not responsible for the privacy practices of those sites.
                    </p>

                    <h3>4. Your Rights (GDPR)</h3>
                    <p>
                        Under the GDPR, you have the right to access, rectify, or erase personal data. Since we do not store personal profiles, there is usually no data to "delete." However, if you have concerns, please contact us.
                    </p>

                    <div className="mt-12 p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Lock size={18} /> Contact</h4>
                        <p className="text-sm">
                            For any privacy-related inquiries, please contact: <br />
                            <span className="text-cyan-400">redbrush.agency@example.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

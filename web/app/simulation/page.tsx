"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    ChevronDown,
    ChevronUp,
    Download,
    RefreshCw,
    FlaskConical,
    Layers,
    BookOpen,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { CledorResponse, ChronologyEra } from "@/lib/types";

/* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface SimMeta {
    timestamp: string | null;
    api_base?: string;
    total_words: number;
    successful: number;
    failed: number;
    success_rate: string;
    avg_latency_ms: number;
    total_duration_ms: number;
}

interface SimResult {
    word: string;
    status: "success" | "error";
    latency_ms: number;
    data: CledorResponse | null;
    error: string | null;
}

interface SimData {
    meta: SimMeta;
    results: SimResult[];
    error?: string;
}

/* ━━━ Stat Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatCard({
    icon: Icon,
    label,
    value,
    accent,
    delay = 0,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    accent: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="relative group"
        >
            <div
                className="absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"
                style={{
                    background: `linear-gradient(135deg, ${accent}, transparent)`,
                }}
            />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-2 text-center">
                <Icon size={24} style={{ color: accent }} />
                <span className="text-3xl font-black tracking-tight text-white">
                    {value}
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    {label}
                </span>
            </div>
        </motion.div>
    );
}

/* ━━━ Latency Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LatencyBar({ ms, maxMs }: { ms: number; maxMs: number }) {
    const pct = Math.min((ms / maxMs) * 100, 100);
    const color =
        ms < 2000 ? "#00ffab" : ms < 5000 ? "#facc15" : "#ef4444";
    return (
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}

/* ━━━ Word Result Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function WordCard({
    result,
    maxLatency,
    index,
}: {
    result: SimResult;
    maxLatency: number;
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const ok = result.status === "success";
    const d = result.data;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group"
        >
            <div
                className={`relative bg-slate-900/70 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${
                    ok
                        ? "border-white/5 hover:border-emerald-500/30"
                        : "border-red-500/20 hover:border-red-500/40"
                }`}
            >
                {/* Glow accent top */}
                <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                        background: ok
                            ? "linear-gradient(90deg, transparent, #00ffab, transparent)"
                            : "linear-gradient(90deg, transparent, #ef4444, transparent)",
                    }}
                />

                {/* Header row */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full p-5 flex items-center gap-4 text-left cursor-pointer"
                >
                    {/* Status badge */}
                    <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                            ok ? "bg-emerald-500/10" : "bg-red-500/10"
                        }`}
                    >
                        {ok ? (
                            <CheckCircle2
                                size={20}
                                className="text-emerald-400"
                            />
                        ) : (
                            <XCircle size={20} className="text-red-400" />
                        )}
                    </div>

                    {/* Word + root */}
                    <div className="flex-grow min-w-0">
                        <h3 className="text-xl font-black text-white tracking-tight">
                            {result.word}
                        </h3>
                        {ok && d?.root_analysis && (
                            <p className="text-sm text-slate-400 truncate mt-0.5">
                                <span className="text-amber-400/80 font-mono">
                                    {d.root_analysis.root}
                                </span>{" "}
                                — {d.root_analysis.concept}
                            </p>
                        )}
                        {!ok && result.error && (
                            <p className="text-sm text-red-400/70 truncate mt-0.5">
                                {result.error}
                            </p>
                        )}
                    </div>

                    {/* Latency + chevron */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="text-right">
                            <span className="text-sm font-mono text-slate-300">
                                {(result.latency_ms / 1000).toFixed(1)}s
                            </span>
                        </div>
                        <div className="text-slate-500">
                            {expanded ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </div>
                    </div>
                </button>

                {/* Latency bar */}
                <div className="px-5 pb-3">
                    <LatencyBar ms={result.latency_ms} maxMs={maxLatency} />
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                    {expanded && ok && d && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5 pt-2 border-t border-white/5 space-y-5">
                                {/* Meta row */}
                                <div className="flex flex-wrap gap-3">
                                    {d.meta && (
                                        <>
                                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
                                                {d.meta.part_of_speech}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-white/5">
                                                {d.meta.ipa}
                                            </span>
                                        </>
                                    )}
                                    {d.cora && (
                                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
                                            {d.cora.curator_comment}
                                        </span>
                                    )}
                                </div>

                                {/* Chronology Timeline */}
                                {d.narrative_chronology &&
                                    d.narrative_chronology.length > 0 && (
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-amber-400/70 font-semibold mb-3 flex items-center gap-2">
                                                <Layers size={14} />
                                                Narrative Chronology
                                            </h4>
                                            <div className="space-y-3 relative pl-4 border-l border-amber-500/20">
                                                {d.narrative_chronology.map(
                                                    (
                                                        era: ChronologyEra,
                                                        i: number
                                                    ) => (
                                                        <div
                                                            key={i}
                                                            className="relative"
                                                        >
                                                            <div className="absolute -left-[calc(1rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500/50 border border-amber-400" />
                                                            <p className="text-xs text-amber-300/60 font-semibold uppercase tracking-wider">
                                                                {era.era}
                                                            </p>
                                                            <p className="text-sm text-white font-medium">
                                                                <span className="font-mono text-amber-300">
                                                                    {era.form}
                                                                </span>{" "}
                                                                — {era.meaning}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                                {era.story}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Semantic Soul */}
                                {d.semantic_soul && (
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                                        <h4 className="text-xs uppercase tracking-widest text-cyan-400/70 font-semibold mb-2 flex items-center gap-2">
                                            <Sparkles size={14} />
                                            Semantic Soul
                                        </h4>
                                        <p className="text-sm text-slate-200 italic leading-relaxed">
                                            &ldquo;{d.semantic_soul.description}
                                            &rdquo;
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2 font-mono">
                                            {d.semantic_soul.mnemonic}
                                        </p>
                                    </div>
                                )}

                                {/* Image */}
                                {d.image_url &&
                                    d.image_url !== "/placeholder.jpg" && (
                                        <div className="rounded-xl overflow-hidden border border-white/5">
                                            <img
                                                src={d.image_url}
                                                alt={`Visual origin of ${result.word}`}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    )}

                                {/* Link to full page */}
                                <Link
                                    href={`/mot/${result.word
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]/g, "-")}`}
                                    className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                    <BookOpen size={14} />
                                    View Full Etymology →
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* ━━━ Main Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SimulationPage() {
    const [data, setData] = useState<SimData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/simulation");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExport = () => {
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `simulation_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const maxLatency = data
        ? Math.max(...data.results.map((r) => r.latency_ms), 1)
        : 1;

    return (
        <main className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Background ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
                <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <FlaskConical
                                size={20}
                                className="text-amber-400"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Pipeline{" "}
                            <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                                Simulation
                            </span>
                        </h1>
                    </div>
                    <p className="text-slate-400 text-lg ml-[52px]">
                        Batch analysis results from the Cledor → Cora pipeline
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-6 ml-[52px]">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all disabled:opacity-40"
                        >
                            <RefreshCw
                                size={14}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={!data || data.results.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-sm font-medium transition-all disabled:opacity-40"
                        >
                            <Download size={14} />
                            Export JSON
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                        >
                            ← Back to Search
                        </Link>
                    </div>
                </motion.div>

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Activity
                            size={32}
                            className="text-amber-400 animate-pulse"
                        />
                    </div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <div className="text-center py-20 text-red-400">
                        <XCircle size={48} className="mx-auto mb-4" />
                        <p className="text-lg font-medium">
                            Failed to load results
                        </p>
                        <p className="text-sm text-red-400/60 mt-1">
                            {error}
                        </p>
                    </div>
                )}

                {/* Results */}
                {data && !loading && (
                    <>
                        {/* Info banner if no results */}
                        {data.error && data.results.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 text-center mb-8"
                            >
                                <FlaskConical
                                    size={32}
                                    className="text-amber-400 mx-auto mb-3"
                                />
                                <p className="text-amber-200 font-medium">
                                    No simulation data yet
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Run{" "}
                                    <code className="text-xs bg-slate-800 px-2 py-0.5 rounded font-mono">
                                        node scripts/simulate-pipeline.mjs
                                    </code>{" "}
                                    with the dev server running.
                                </p>
                            </motion.div>
                        )}

                        {/* Stats Grid */}
                        {data.results.length > 0 && (
                            <>
                                {/* Timestamp */}
                                {data.meta.timestamp && (
                                    <p className="text-xs text-slate-500 font-mono mb-6">
                                        Last run:{" "}
                                        {new Date(
                                            data.meta.timestamp
                                        ).toLocaleString()}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                    <StatCard
                                        icon={Zap}
                                        label="Words Tested"
                                        value={data.meta.total_words}
                                        accent="#facc15"
                                        delay={0}
                                    />
                                    <StatCard
                                        icon={CheckCircle2}
                                        label="Successful"
                                        value={data.meta.successful}
                                        accent="#00ffab"
                                        delay={0.1}
                                    />
                                    <StatCard
                                        icon={XCircle}
                                        label="Failed"
                                        value={data.meta.failed}
                                        accent="#ef4444"
                                        delay={0.2}
                                    />
                                    <StatCard
                                        icon={Clock}
                                        label="Avg Latency"
                                        value={`${(
                                            data.meta.avg_latency_ms / 1000
                                        ).toFixed(1)}s`}
                                        accent="#38bdf8"
                                        delay={0.3}
                                    />
                                </div>

                                {/* Success Rate Gauge */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mb-10"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                                            Success Rate
                                        </span>
                                        <span className="text-sm font-mono text-emerald-400">
                                            {data.meta.success_rate}
                                        </span>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: data.meta.success_rate,
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                ease: "easeOut",
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                                        />
                                    </div>
                                </motion.div>

                                {/* Results list */}
                                <div>
                                    <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4 flex items-center gap-2">
                                        <Activity size={14} />
                                        Word Results
                                    </h2>
                                    <div className="space-y-3">
                                        {data.results.map((r, i) => (
                                            <WordCard
                                                key={r.word}
                                                result={r}
                                                maxLatency={maxLatency}
                                                index={i}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

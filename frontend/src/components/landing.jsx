import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Settings,
  Award,
  Sparkles,
  Clock,
  ChevronRight,
  Search,
  Settings2,
  Zap,
  Calendar,
  User,
  BookOpen,
  Code,
  Palette,
  ArrowUpRight,
  ShieldCheck,
  Timer
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

// Format helper for user statistics
const formatCompact = (value) => {
  if (value >= 100000) return `${Math.floor(value / 1000)}k+`;
  if (value >= 10000) return `${(value / 1000).toFixed(0)}k+`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`;
  return `${value}+`;
};

const leaderboardRows = [
  ["01", "Maya", "4h 32m", "21d"],
  ["02", "Aarav", "3h 48m", "16d"],
  ["03", "Sam", "2h 55m", "9d"],
];

const heatCells = [
  15, 40, 72, 24, 88, 53, 31, 61, 95, 48, 22, 76, 64, 38, 83, 28, 58, 91,
  46, 67, 34, 79, 55, 18,
];

// ----------------------------------------------------
// 1. Bento Timer Widget (Interactive & Light Theme)
// ----------------------------------------------------
function BentoTimerWidget() {
  const [timeLeft, setTimeLeft] = useState(165); // 02:45
  const [isRunning, setIsRunning] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [timerTheme, setTimerTheme] = useState("dark"); // dark (neutral-950), indigo, rose

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(165);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (!showSeconds) return `${m}m`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / 165) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const accentColors = {
    dark: "#0a0a0a",
    indigo: "#4f46e5",
    rose: "#e11d48",
  };

  const activeColor = accentColors[timerTheme];

  return (
    <div className="relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-neutral-200/80 bg-white text-neutral-900 transition-all duration-300 shadow-sm md:col-span-2 group overflow-hidden">

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-neutral-400" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-400">Deep Work Timer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            id="theme-btn-dark"
            aria-label="Dark Theme"
            onClick={() => setTimerTheme("dark")}
            className={`w-3.5 h-3.5 rounded-full bg-neutral-950 border transition cursor-pointer ${timerTheme === 'dark' ? 'ring-2 ring-offset-2 ring-neutral-950 scale-105' : 'hover:scale-105'}`}
          />
          <button
            id="theme-btn-indigo"
            aria-label="Indigo Theme"
            onClick={() => setTimerTheme("indigo")}
            className={`w-3.5 h-3.5 rounded-full bg-indigo-500 border transition cursor-pointer ${timerTheme === 'indigo' ? 'ring-2 ring-offset-2 ring-neutral-950 scale-105' : 'hover:scale-105'}`}
          />
          <button
            id="theme-btn-rose"
            aria-label="Rose Theme"
            onClick={() => setTimerTheme("rose")}
            className={`w-3.5 h-3.5 rounded-full bg-rose-500 border transition cursor-pointer ${timerTheme === 'rose' ? 'ring-2 ring-offset-2 ring-neutral-950 scale-105' : 'hover:scale-105'}`}
          />
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[9px] text-neutral-600 font-bold ml-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-neutral-950 ${isRunning ? 'animate-ping' : ''}`} />
            {isRunning ? 'active' : 'paused'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 z-10">
        {/* SVG Progress Circle in light theme */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64" cy="64" r={radius}
              className="stroke-neutral-100" strokeWidth="5" fill="transparent"
            />
            <motion.circle
              cx="64" cy="64" r={radius}
              strokeWidth="5" fill="transparent"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset,
                stroke: activeColor
              }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>
          <div className="absolute font-sans text-xl sm:text-2xl font-black tracking-tight text-neutral-950">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <h4 className="font-sans text-base font-bold text-neutral-900">Try the focus clock.</h4>
          <p className="font-sans text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed font-medium">
            Start a micro countdown session to preview the clean layout, formats, and accent tints.
          </p>
          <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
            <button
              id="bento-toggle-sec"
              onClick={() => setShowSeconds(!showSeconds)}
              className="text-[10px] font-bold px-2 py-1 rounded bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-600 transition cursor-pointer"
            >
              {showSeconds ? "Hide Seconds" : "Show Seconds"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 z-10 font-sans">
        <button
          id="bento-timer-play"
          onClick={handleStartPause}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-white py-2 text-xs font-bold transition cursor-pointer shadow shadow-neutral-950/10"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          id="bento-timer-reset"
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        <Link
          to="/login"
          id="bento-timer-save"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-2 text-xs font-bold hover:bg-neutral-100 transition cursor-pointer text-neutral-855 text-neutral-800"
          style={{
            borderColor: timerTheme !== 'dark' ? `${activeColor}20` : '#e5e5e5',
            color: timerTheme !== 'dark' ? activeColor : '#262626',
            backgroundColor: timerTheme !== 'dark' ? `${activeColor}08` : '#f5f5f5',
          }}
        >
          Save
        </Link>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Bento Streak Widget (Light Theme & Glowing Flame)
// ----------------------------------------------------
function BentoStreakWidget() {
  const [streak, setStreak] = useState(14);
  const [checkedIn, setCheckedIn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setStreak((prev) => prev + 1);
    setCheckedIn(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[260px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-neutral-900" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">Momentum</span>
        </div>
        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full transition-colors ${checkedIn ? 'bg-orange-50 text-orange-655 text-orange-600 border-orange-200/50' : 'bg-neutral-50 text-neutral-600 border-neutral-200/60'
          }`}>
          daily streak
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4 text-center">
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.25, 1],
            rotate: [0, -15, 15, -15, 0]
          } : {
            scale: [1, 1.05, 1]
          }}
          transition={isAnimating ? { duration: 0.6 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative cursor-pointer"
          onClick={handleCheckIn}
        >
          <Flame className={`w-16 h-16 transition-colors duration-300 ${checkedIn
            ? 'text-orange-500 fill-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.45)]'
            : 'text-neutral-300 hover:text-neutral-500'
            }`} />
          {checkedIn && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-16 h-16 rounded-full bg-orange-450 bg-orange-400/20"
            />
          )}
        </motion.div>

        <div className="mt-4">
          <span className="font-sans text-4xl font-extrabold tracking-tight text-neutral-900">{streak}</span>
          <span className="font-sans text-xs text-neutral-450 ml-1 font-bold">days consistency</span>
        </div>
      </div>

      <button
        id="bento-claim-streak"
        onClick={handleCheckIn}
        disabled={checkedIn}
        className={`w-full py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${checkedIn
          ? 'bg-orange-50/50 border-orange-100 text-orange-655 text-orange-500 cursor-not-allowed'
          : 'bg-neutral-950 border-neutral-950 text-white hover:bg-neutral-850 shadow shadow-neutral-950/10'
          }`}
      >
        {checkedIn ? 'Claimed for today!' : 'Claim Streak Badge'}
      </button>
    </div>
  );
}

// ----------------------------------------------------
// 3. Bento Heatmap Widget (Light Theme & Emerald Cells)
// ----------------------------------------------------
function BentoHeatmapWidget() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const cells = [
    { date: "May 20", mins: 120 }, { date: "May 21", mins: 45 }, { date: "May 22", mins: 0 }, { date: "May 23", mins: 180 },
    { date: "May 24", mins: 90 }, { date: "May 25", mins: 60 }, { date: "May 26", mins: 15 }, { date: "May 27", mins: 210 },
    { date: "May 28", mins: 75 }, { date: "May 29", mins: 0 }, { date: "May 30", mins: 110 }, { date: "May 31", mins: 130 },
    { date: "Jun 01", mins: 45 }, { date: "Jun 02", mins: 90 }, { date: "Jun 03", mins: 160 }, { date: "Jun 04", mins: 240 },
    { date: "Jun 05", mins: 0 }, { date: "Jun 06", mins: 30 }, { date: "Jun 07", mins: 80 }, { date: "Jun 08", mins: 120 },
    { date: "Jun 09", mins: 150 }, { date: "Jun 10", mins: 95 }, { date: "Jun 11", mins: 190 }, { date: "Jun 12", mins: 70 },
  ];

  return (
    <div className="group relative rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neutral-500" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">Activity Heatmap</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold font-sans">24 days</span>
      </div>

      <div className="my-auto py-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5 relative">
          {cells.map((cell, idx) => {
            const opacity = cell.mins === 0 ? 0.08 : 0.2 + (cell.mins / 240) * 0.8;
            const color = cell.mins === 0 ? 'bg-neutral-105 bg-neutral-200' : 'bg-emerald-500';
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCell({ ...cell, index: idx })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`aspect-square rounded transition-all duration-150 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-neutral-950 ${color}`}
                style={{ opacity }}
              />
            );
          })}

          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-20 flex flex-col items-center min-w-[110px]"
              >
                <span className="font-bold">{hoveredCell.date}</span>
                <span className="text-neutral-400 mt-0.5">{hoveredCell.mins} mins study</span>
                <div className="w-2 h-2 bg-neutral-900 transform rotate-45 mt-1 -mb-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-neutral-450 border-t border-neutral-100 pt-3 mt-1 font-bold">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100 border border-neutral-200" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-55" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-90" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. Bento Leaderboard Widget (Light Theme & Active status)
// ----------------------------------------------------
function BentoLeaderboardWidget() {
  const rows = [
    { rank: 1, name: "Maya", time: "4h 32m", streak: "21d", active: true },
    { rank: 2, name: "Aarav", time: "3h 48m", streak: "16d", active: false },
    { rank: 3, name: "Sam", time: "2h 55m", streak: "9d", active: true },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-neutral-900" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">Live Rankings</span>
        </div>
        <span className="text-[10px] font-bold text-neutral-600 bg-neutral-50 border border-neutral-200/60 px-2 py-0.5 rounded-full font-sans">
          top ranks
        </span>
      </div>

      <div className="space-y-2 my-auto py-1">
        {rows.map((row) => (
          <div
            key={row.rank}
            className="flex items-center justify-between p-2 rounded-xl bg-neutral-50/55 hover:bg-neutral-100/70 border border-neutral-200/50 transition duration-205 group/row"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-extrabold border ${row.rank === 1 ? 'bg-yellow-50 text-yellow-805 text-yellow-800 border-yellow-250 border-yellow-200' :
                row.rank === 2 ? 'bg-neutral-100 text-neutral-800 border-neutral-200' :
                  'bg-orange-50 text-orange-850 border-orange-200'
                }`}>
                #{row.rank}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  {row.name}
                  {row.active && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </span>
                <span className="text-[9px] text-neutral-450 font-semibold">{row.streak} streak</span>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-600 group-hover/row:text-neutral-900 transition-colors">
              {row.time}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[9px] text-center text-neutral-400 mt-1 font-semibold">
        Real-time ranking sync.
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. Bento Settings Widget (Live Customizer)
// ----------------------------------------------------
function BentoSettingsWidget() {
  const [showSec, setShowSec] = useState(true);
  const [colorTint, setColorTint] = useState("dark");
  const [glowEnabled, setGlowEnabled] = useState(true);

  const themeColors = {
    dark: "text-neutral-955 text-neutral-950 bg-neutral-950",
    indigo: "text-indigo-600 bg-indigo-600",
    amber: "text-amber-600 bg-amber-600",
  };

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-neutral-500" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">Customizer</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold">live preview</span>
      </div>

      <div className="my-auto py-1.5">
        {/* Real-time preview card */}
        <div className="border border-neutral-200/60 rounded-xl p-2.5 bg-neutral-50/50 flex flex-col items-center shadow-inner">
          <div className="text-[9px] text-neutral-400 uppercase tracking-widest font-black">Mock Widget</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`text-xl font-black tracking-tight ${themeColors[colorTint].split(" ")[0]}`}>
              12:00{showSec ? ":00" : ""}
            </span>
            {glowEnabled && (
              <span className={`w-2 h-2 rounded-full animate-pulse ${themeColors[colorTint].split(" ")[1]}`} />
            )}
          </div>
        </div>

        {/* Setting Toggles */}
        <div className="space-y-2 mt-3.5 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">Show seconds</span>
            <button
              id="bento-setting-toggle-sec"
              onClick={() => setShowSec(!showSec)}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${showSec ? 'bg-neutral-900' : 'bg-neutral-200'}`}
            >
              <span className={`w-3 h-3 rounded-full bg-white absolute transition-transform ${showSec ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">Status glow</span>
            <button
              id="bento-setting-toggle-glow"
              onClick={() => setGlowEnabled(!glowEnabled)}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${glowEnabled ? 'bg-neutral-900' : 'bg-neutral-200'}`}
            >
              <span className={`w-3 h-3 rounded-full bg-white absolute transition-transform ${glowEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">Theme Tint</span>
            <div className="flex gap-1.5">
              {['dark', 'indigo', 'amber'].map((t) => (
                <button
                  id={`theme-select-${t}`}
                  aria-label={`${t} tint`}
                  key={t}
                  onClick={() => setColorTint(t)}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${t === 'dark' ? 'bg-neutral-950' :
                    t === 'indigo' ? 'bg-indigo-500' :
                      'bg-amber-500'
                    } ${colorTint === t ? 'border-neutral-900 scale-110 shadow-sm ring-1 ring-neutral-950 ring-offset-1' : 'border-transparent hover:scale-105'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. AppShowcase Component (Tabbed SaaS Mockup - Light Theme & Responsive)
// ----------------------------------------------------
function AppShowcase() {
  const [activeTab, setActiveTab] = useState("timer");

  // Timer tab states
  const [timerVal, setTimerVal] = useState(1500); // 25:00
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusTag, setFocusTag] = useState("Coding");

  // Leaderboard tab states
  const [searchQuery, setSearchQuery] = useState("");
  const [lbFilter, setLbFilter] = useState("Weekly");

  useEffect(() => {
    let t;
    if (timerRunning && timerVal > 0) {
      t = setInterval(() => {
        setTimerVal(prev => prev - 1);
      }, 1000);
    } else if (timerVal === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(t);
  }, [timerRunning, timerVal]);

  const handleStartStop = () => setTimerRunning(!timerRunning);
  const handleReset = () => {
    setTimerRunning(false);
    setTimerVal(1500);
  };

  const formatShowcaseTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const tagColor = {
    Coding: {
      accent: "text-indigo-600",
      bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      hover: "hover:bg-indigo-100",
      pulse: "bg-indigo-500",
      stroke: "#4f46e5"
    },
    Design: {
      accent: "text-rose-600",
      bg: "bg-rose-55 bg-rose-50 text-rose-600 border-rose-200",
      hover: "hover:bg-rose-100",
      pulse: "bg-rose-500",
      stroke: "#e11d48"
    },
    Study: {
      accent: "text-emerald-600",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      hover: "hover:bg-emerald-100",
      pulse: "bg-emerald-500",
      stroke: "#059669"
    }
  };

  const currentTheme = tagColor[focusTag];
  const progress = (timerVal / 1500) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const weeklyRankings = [
    { rank: 1, name: "Maya", time: "28h 12m", streak: "21d", active: true },
    { rank: 2, name: "Aarav", time: "24h 45m", streak: "16d", active: false },
    { rank: 3, name: "Sam", time: "21h 10m", streak: "9d", active: true },
    { rank: 4, name: "Liam", time: "18h 50m", streak: "5d", active: false },
    { rank: 5, name: "Sophia", time: "15h 30m", streak: "12d", active: true },
    { rank: 6, name: "Daniel", time: "12h 15m", streak: "7d", active: false },
  ];

  const monthlyRankings = [
    { rank: 1, name: "Maya", time: "112h 45m", streak: "21d", active: true },
    { rank: 2, name: "Sam", time: "96h 20m", streak: "9d", active: true },
    { rank: 3, name: "Aarav", time: "92h 15m", streak: "16d", active: false },
    { rank: 4, name: "Liam", time: "84h 10m", streak: "5d", active: false },
    { rank: 5, name: "Sophia", time: "78h 50m", streak: "12d", active: true },
    { rank: 6, name: "Daniel", time: "64h 30m", streak: "7d", active: false },
  ];

  const activeRankings = lbFilter === "Weekly" ? weeklyRankings : monthlyRankings;
  const filteredRankings = activeRankings.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-neutral-200/80 bg-neutral-50/65 p-2 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur relative overflow-hidden">
      <div className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 text-left relative overflow-hidden">

        {/* Mock Browser Frame Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider ml-1 sm:ml-2">timmo.app/dashboard</span>
            </div>
          </div>

          {/* Tab Selector (Responsive Scroll/Pill Bar) */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-full border border-neutral-200/60 self-center max-w-full overflow-x-auto no-scrollbar whitespace-nowrap">
            {[
              { id: "timer", label: "Focus Timer", icon: Timer },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
              { id: "leaderboard", label: "Leaderboard", icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  id={`showcase-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-350 cursor-pointer ${isSelected ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white shadow-sm border border-neutral-200/35 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab View Container */}
        <div className="min-h-[340px] sm:min-h-[360px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "timer" && (
              <motion.div
                key="timerTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 sm:p-6 flex flex-col items-center relative w-full overflow-hidden">
                  {/* Category Chips */}
                  <div className="flex gap-1.5 sm:gap-2 self-start mb-6 w-full overflow-x-auto no-scrollbar whitespace-nowrap">
                    {["Coding", "Design", "Study"].map((cat) => (
                      <button
                        id={`category-chip-${cat}`}
                        key={cat}
                        onClick={() => setFocusTag(cat)}
                        className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${focusTag === cat
                          ? currentTheme.bg
                          : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Scalable Circle Timer Display */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                      <circle cx="96" cy="96" r={radius} className="stroke-neutral-100" strokeWidth="8" fill="transparent" />
                      <motion.circle
                        cx="96" cy="96" r={radius}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        animate={{
                          strokeDashoffset,
                          stroke: currentTheme.stroke
                        }}
                        transition={{ duration: 0.5, ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">{formatShowcaseTime(timerVal)}</span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-1 text-neutral-400">{focusTag}</span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full max-w-xs justify-center font-sans">
                    <button
                      id="showcase-play-btn"
                      onClick={handleStartStop}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-white py-2.5 sm:py-3 text-xs font-bold transition shadow shadow-neutral-950/5 active:scale-95 cursor-pointer"
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      {timerRunning ? "Pause" : "Start Session"}
                    </button>
                    <button
                      id="showcase-reset-btn"
                      onClick={handleReset}
                      className="rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-855 p-2.5 sm:p-3 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-snug">
                    Workspace setup that fits your flow.
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-medium">
                    Commit to deep study sprints, track code blocks, or catalog layout design blocks. Switch tags instantly to align your workspace palette with your current active focus task.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-1 sm:pt-2 font-sans">
                    <div className="border border-neutral-200 bg-neutral-50/40 p-3 rounded-xl">
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-800">Full Screen Mode</span>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 font-semibold leading-tight">Quiet full-screen clock for study, work blocks, and deep focus rituals.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analyticsTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 w-full overflow-hidden">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Performance Insights</span>
                      <p className="text-sm sm:text-base font-bold text-neutral-900 mt-0.5">Focus Duration Chart</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-neutral-200 shadow-sm whitespace-nowrap">Last 12 days</span>
                  </div>

                  {/* Responsive flex-basis bar graph */}
                  <div className="flex h-44 sm:h-52 items-end gap-1.5 sm:gap-2 px-1 w-full">
                    {[
                      { l: "Mon", v: 34 }, { l: "Tue", v: 58 }, { l: "Wed", v: 42 },
                      { l: "Thu", v: 78 }, { l: "Fri", v: 64 }, { l: "Sat", v: 88 },
                      { l: "Sun", v: 55 }, { l: "Mon", v: 46 }, { l: "Tue", v: 72 },
                      { l: "Wed", v: 90 }, { l: "Thu", v: 61 }, { l: "Fri", v: 80 }
                    ].map((b, idx) => (
                      <div key={idx} className="w-full flex flex-col items-center gap-1.5 group/shbar">
                        <div className="relative w-full h-28 sm:h-36 flex items-end">
                          <motion.span
                            initial={{ height: 0 }}
                            animate={{ height: `${b.v}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.03 }}
                            className="w-full rounded-t-sm bg-neutral-900 hover:bg-indigo-650 hover:bg-indigo-600 transition-colors duration-250 cursor-pointer"
                          />
                          <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/shbar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {(b.v / 10).toFixed(1)}h
                          </div>
                        </div>
                        <span className="text-[9px] text-neutral-450 font-bold">{b.l.substring(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 font-sans">
                    {[
                      { title: "Total focus", val: "142.5h", diff: "+12.4%", desc: "vs last week" },
                      { title: "Daily avg", val: "4.5h", diff: "+5.1%", desc: "vs last month" },
                      { title: "Streak", val: "14 Days", diff: "Active", desc: "Claimed today" },
                      { title: "Efficiency", val: "94%", diff: "Optimal", desc: "Steady flow" },
                    ].map((stat, idx) => (
                      <div key={idx} className="border border-neutral-200 bg-white p-3 sm:p-4 rounded-xl flex flex-col justify-between shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:shadow transition-shadow">
                        <span className="text-[9px] sm:text-[10px] text-neutral-450 font-bold uppercase tracking-wider">{stat.title}</span>
                        <div className="flex items-baseline justify-between mt-1.5 sm:mt-2 gap-1.5">
                          <span className="text-base sm:text-xl font-extrabold text-neutral-900">{stat.val}</span>
                          <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stat.diff.startsWith('+') ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' : 'bg-neutral-50 text-neutral-500 border border-neutral-200/50'
                            }`}>{stat.diff}</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-neutral-400 mt-1 font-semibold leading-tight">{stat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboardTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-3 sm:p-4 w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                    <div className="relative w-full sm:w-52">
                      <Search className="w-3.5 h-3.5 text-neutral-450 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="showcase-search-leaderboard"
                        type="text"
                        placeholder="Search focusers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-xs text-neutral-900 pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-neutral-450 placeholder:text-neutral-400 font-sans"
                      />
                    </div>

                    <div className="flex bg-neutral-100 border border-neutral-200/80 p-0.5 rounded-lg w-full sm:w-auto justify-center">
                      {["Weekly", "Monthly"].map((filter) => (
                        <button
                          id={`showcase-filter-${filter}`}
                          key={filter}
                          onClick={() => setLbFilter(filter)}
                          className={`px-3 py-1 sm:py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer w-1/2 sm:w-auto ${lbFilter === filter
                            ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/30'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-1 no-scrollbar font-sans w-full">
                    <AnimatePresence mode="popLayout">
                      {filteredRankings.length > 0 ? (
                        filteredRankings.map((user) => (
                          <motion.div
                            layout
                            key={user.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-[28px_1fr_75px_50px] sm:grid-cols-[36px_1fr_90px_60px] items-center gap-2 p-2 rounded-xl bg-white hover:bg-neutral-50/50 transition border border-neutral-200/50 shadow-[0_1px_4px_rgba(0,0,0,0.01)] w-full"
                          >
                            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-extrabold border ${user.rank === 1 ? 'bg-yellow-50 text-yellow-805 text-yellow-800 border-yellow-250 border-yellow-200' :
                              user.rank === 2 ? 'bg-neutral-105 bg-neutral-100 text-neutral-800 border-neutral-200' :
                                'bg-orange-50 text-orange-850 border-orange-200'
                              }`}>
                              #{user.rank}
                            </span>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-bold text-neutral-900 truncate">{user.name}</span>
                              {user.active && (
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">{user.time}</span>
                            <span className="text-[9px] text-neutral-400 font-bold whitespace-nowrap">{user.streak}</span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-neutral-400 text-xs font-bold font-sans">No focusers found matching query.</div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                    Healthy competition, zero distraction.
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-medium">
                    Compete on streaks and cumulative focus hours. Keep each other accountable without messaging clutter. Learn and grow alongside builders worldwide.
                  </p>
                  <div className="border border-neutral-200 bg-neutral-50/30 p-3 sm:p-4 rounded-xl flex items-center gap-3">
                    <Award className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-950/80 shrink-0" />
                    <div>
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-850 block">Top 5% Global Index</span>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 font-sans font-semibold leading-tight">Average focus session of 92 minutes.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Landing Component
// ----------------------------------------------------
function Landing() {
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await axios.get("/api/user/public-stats");
        setTotalUsers(res.data.stats?.totalUsers ?? null);
      } catch (err) {
        console.log("error fetching landing stats:", err);
      }
    };

    fetchPublicStats();
  }, []);

  const userCountLabel = useMemo(
    () => (totalUsers === null ? "1,240" : formatCompact(totalUsers)),
    [totalUsers]
  );

  const stats = [
    { value: userCountLabel, label: "registered users" },
    { value: "6", label: "focus tools included" },
    { value: "365", label: "days of activity heatmap" },
  ];

  return (
    <div
      className="h-screen w-screen overflow-y-auto bg-[#fafafa] text-neutral-950 font-sans selection:bg-white selection:text-black"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#171717 transparent",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* Navigation Bar */}
        <header>
          <nav
            id="main-navbar"
            className="sticky top-4 z-40 mx-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-full border border-neutral-200/80 bg-white/80 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] backdrop-blur-md sm:px-6"
          >
            <Link to="/" className="font-gothic text-lg tracking-wide hover:opacity-80 transition">
              Timmo
            </Link>

            <div className="hidden items-center gap-7 font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 md:flex">
              <a href="#features" className="transition hover:text-neutral-950">
                Features
              </a>
              <a href="#preview" className="transition hover:text-neutral-950">
                Preview
              </a>
              <a href="#proof" className="transition hover:text-neutral-950">
                Proof
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="nav-login-btn"
                className="hidden rounded-full border border-neutral-200 bg-white px-5 py-2 font-sans text-xs font-bold text-neutral-800 transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:border-neutral-300 sm:block"
              >
                Log in
              </Link>
              <Link
                to="/login"
                id="nav-start-btn"
                className="group flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2 font-sans text-xs font-bold text-white shadow shadow-neutral-900/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Start
                <ArrowUpRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden pb-10 pt-10 text-center sm:pt-14 w-full">

            {/* Minimal Background Grid Design */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:96px_96px]" />
            <div className="absolute left-1/2 top-24 -z-10 h-80 w-[75%] -translate-x-1/2 rounded-full bg-neutral-250 bg-neutral-200/10 blur-3xl" />

            {/* Social Proof Badge */}
            <div className="mb-6 flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 font-sans text-xs font-bold text-neutral-600 shadow-[0_2px_8px_rgba(0,0,0,0.015)] backdrop-blur">
              <div className="flex -space-x-1.5">
                {["T", "M", "S"].map((item) => (
                  <span
                    key={item}
                    className="flex size-6 items-center justify-center rounded-full border border-white text-[10px] text-white font-black bg-neutral-950 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span>Used by {userCountLabel} focus builders</span>
            </div>

            {/* Hero Main Heading (Instrument Serif accents) */}
            <div className="flex flex-col items-center px-2 w-full">
              <h1 className="max-w-4xl font-sans text-[clamp(2rem,6.2vw,4.5rem)] font-extrabold tracking-tight text-neutral-950 text-center leading-[1.1]">
                A quiet workspace for <br />
                <span className="font-instrumental font-normal italic text-neutral-500 text-[1.12em] block sm:inline mt-2 sm:mt-0">deep study, analytics, and rank.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-neutral-500 sm:text-lg text-center font-medium px-4">
              Timmo turns every focused minute into a visible system: clock,
              stopwatch, countdown, streaks, heatmaps, leaderboard, and settings
              that feel calm enough to use every day.
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row z-10 px-4">
              <Link
                to="/login"
                id="hero-start-free"
                className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 font-sans text-sm font-semibold text-white shadow-lg shadow-neutral-950/10 hover:shadow-xl hover:shadow-neutral-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto"
              >
                Get started free
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#preview"
                id="hero-view-demo"
                className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/75 px-6 font-sans text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:border-neutral-300 sm:w-auto"
              >
                View product demo
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* SaaS Screenshot Showcase Mockup */}
            <div id="preview" className="mt-14 w-full px-1 sm:px-4">
              <AppShowcase />
            </div>
          </section>

          {/* Core App Statistics */}
          <section className="grid gap-6 py-12 grid-cols-1 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group rounded-2xl border border-neutral-200 bg-white/80 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white"
              >
                <p className="font-instrumental text-5xl font-medium italic text-neutral-950 sm:text-6xl">
                  {item.value}
                </p>
                <p className="mt-2 font-sans text-xs font-bold tracking-wider uppercase text-neutral-400">
                  {item.label}
                </p>
              </div>
            ))}
          </section>

          {/* Features Bento Grid */}
          <section id="features" className="py-14 w-full">
            <div className="mx-auto max-w-3xl text-center mb-10 px-4">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
                Bento System
              </span>
              <h2 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-neutral-950">
                Everything your focus app <br />
                <span className="font-instrumental font-normal italic text-neutral-450 text-neutral-455 text-neutral-400">
                  should remember.
                </span>
              </h2>
            </div>

            {/* Dynamic Bento Grid Widgets */}
            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
              <BentoTimerWidget />
              <BentoStreakWidget />
              <BentoHeatmapWidget />
              <BentoLeaderboardWidget />
              <BentoSettingsWidget />
            </div>
          </section>

          {/* Analytics Overview Section */}
          <section className="grid gap-6 py-12 grid-cols-1 lg:grid-cols-2 items-center w-full">

            {/* Analytics Details Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm backdrop-blur w-full">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200/80 px-3 py-1 rounded-full">
                Analytics Preview
              </span>
              <h2 className="mt-5 font-sans text-3xl font-black leading-tight text-neutral-950">
                Know if you are actually{" "}
                <span className="font-instrumental font-normal italic text-neutral-500">
                  improving.
                </span>
              </h2>
              <p className="mt-4 font-sans text-sm leading-relaxed text-neutral-500 font-medium">
                Your saved stopwatch and countdown sessions become clear daily totals, averages, streaks, charts, and activity heatmaps.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { val: "128h total", label: "Focus logged" },
                  { val: "2h today", label: "Session time" },
                  { val: "14 day streak", label: "Current momentum" },
                  { val: "52m avg", label: "Daily average" },
                ].map((item) => (
                  <div
                    key={item.val}
                    className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 sm:p-4 transition-all duration-350 hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-neutral-900" />
                      <span className="font-sans text-sm font-extrabold text-neutral-800">{item.val}</span>
                    </div>
                    <p className="text-[10px] text-neutral-450 mt-1 font-bold uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Dashboard Visual Chart */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-6 shadow shadow-neutral-200/30 relative overflow-hidden group w-full">

              <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
                <div className="mb-6 flex items-center justify-between border-b border-neutral-105 border-neutral-100 pb-4">
                  <div>
                    <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">Analytics Dashboard</p>
                    <p className="font-sans text-lg font-bold text-neutral-900 mt-1">Focus Distribution</p>
                  </div>
                  <TrendingUp className="text-neutral-950 w-5 h-5 animate-pulse" />
                </div>

                {/* Responsive bar graph */}
                <div className="flex h-52 items-end gap-1.5 sm:gap-3 px-2 w-full">
                  {[
                    { label: "M", val: 32, color: "bg-neutral-900" },
                    { label: "T", val: 54, color: "bg-neutral-900" },
                    { label: "W", val: 39, color: "bg-neutral-900" },
                    { label: "T", val: 68, color: "bg-neutral-950" },
                    { label: "F", val: 44, color: "bg-neutral-900" },
                    { label: "S", val: 76, color: "bg-neutral-900" },
                    { label: "S", val: 81, color: "bg-neutral-955 bg-neutral-950" },
                    { label: "M", val: 48, color: "bg-neutral-900" },
                    { label: "T", val: 92, color: "bg-neutral-950" },
                    { label: "W", val: 70, color: "bg-neutral-900" },
                    { label: "T", val: 58, color: "bg-neutral-900" },
                    { label: "F", val: 86, color: "bg-neutral-950" },
                  ].map((bar, idx) => (
                    <div key={idx} className="w-full flex flex-col items-center gap-2 group/bar">
                      <div className="relative w-full h-40 flex items-end">
                        <motion.span
                          initial={{ height: 0 }}
                          whileInView={{ height: `${bar.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.04 }}
                          className={`w-full rounded-t transition-all duration-300 hover:scale-x-110 hover:opacity-100 opacity-80 ${bar.color}`}
                        />
                        <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {(bar.val / 10).toFixed(1)}h
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Proof Section (Leaderboard and heatmap) */}
          <section id="proof" className="grid gap-6 py-12 grid-cols-1 lg:grid-cols-3 w-full">

            {/* Leaderboard Section */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm lg:col-span-2 flex flex-col justify-between w-full">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-neutral-100 pb-6">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-55 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full">
                    Leaderboard
                  </span>
                  <h2 className="mt-4 font-sans text-3xl font-black leading-tight text-neutral-950">
                    Compete without the{" "}
                    <span className="font-instrumental font-normal italic text-neutral-450 text-neutral-400">
                      chaos.
                    </span>
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2 font-medium">
                    Compare streaks and daily focus times with other creators globally.
                  </p>
                </div>
                <Award className="text-neutral-950 w-8 h-8 self-start" />
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 shadow-[0_2px_12px_rgba(0,0,0,0.015)] bg-white w-full">
                {leaderboardRows.map(([rank, name, time, streak]) => (
                  <div
                    key={rank}
                    className="grid grid-cols-[50px_1fr_100px_80px] sm:grid-cols-[60px_1fr_120px_100px] items-center gap-2 sm:gap-4 border-b border-neutral-100 bg-white px-4 sm:px-6 py-4 font-sans text-sm last:border-b-0 hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border ${rank === "01" ? 'bg-yellow-50 text-yellow-850 border-yellow-200' :
                      rank === "02" ? 'bg-neutral-100 text-neutral-800 border-neutral-200' :
                        'bg-orange-50 text-orange-850 border-orange-200'
                      }`}>
                      #{rank}
                    </span>
                    <span className="font-bold text-neutral-950 flex items-center gap-2 truncate">
                      {name}
                      {rank === "01" && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse shrink-0" />}
                    </span>
                    <span className="font-bold text-neutral-600 whitespace-nowrap">{time} focus</span>
                    <span className="text-xs font-bold text-neutral-450 text-neutral-450 text-neutral-400 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                      <Flame className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
                      {streak} streak
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annual Calendar Heatmap Showcase */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between w-full min-h-[300px]">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full font-sans">
                  Consistency
                </span>
                <h3 className="mt-4 font-sans text-3xl font-black text-neutral-950 leading-tight">
                  Your year, <br />
                  <span className="font-instrumental font-normal italic text-neutral-400">
                    one glance.
                  </span>
                </h3>
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed font-medium">
                  Make your daily focus streak visible. Every box represents a day you showed up.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-6 gap-2 sm:gap-2.5">
                {heatCells.map((value, index) => {
                  const opacity = 0.08 + value / 115;
                  return (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      className="aspect-square rounded bg-neutral-950 cursor-pointer shadow-sm"
                      style={{ opacity }}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-neutral-450 mt-6 border-t border-neutral-100 pt-4 font-bold">
                <span>Less study</span>
                <span>More focus</span>
              </div>
            </div>
          </section>

          {/* Call to Action Banner (Light gray minimalist layout) */}
          <section className="py-12 w-full">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100/70 text-neutral-950 shadow-[0_12px_40px_rgba(0,0,0,0.015)] w-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.025),transparent_40%)]" />

              <div className="relative grid gap-8 p-6 sm:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center w-full">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-600 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                    Get Started
                  </span>
                  <h2 className="mt-5 max-w-2xl font-sans text-3xl sm:text-4xl font-extrabold leading-[1.15] sm:text-5xl">
                    Make your next focused minute{" "}
                    <span className="block font-instrumental font-normal italic text-neutral-500 mt-1">
                      count.
                    </span>
                  </h2>
                  <p className="mt-4 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-neutral-500 font-medium">
                    Create an account, start a session, and let Timmo turn your work into momentum you can see and feel every single day.
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to="/login"
                    id="cta-start-btn"
                    className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 font-sans text-sm font-semibold text-white shadow hover:bg-neutral-850 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:w-fit cursor-pointer"
                  >
                    Create account free
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-neutral-200/60 py-8 text-neutral-500 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-gothic text-base tracking-wide text-neutral-800">Timmo</span>
              <span className="text-neutral-300">|</span>
              <p>© {new Date().getFullYear()} Timmo. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Sam721166/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/samirande_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="Twitter/X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-neutral-200/20 pt-4 text-center text-[11px] text-neutral-400">
            <p>
              Built with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
              <a
                href="https://github.com/Sam721166"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Samiran De
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;

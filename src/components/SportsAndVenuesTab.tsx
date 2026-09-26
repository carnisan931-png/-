import React, { useState, useMemo } from "react";
import {
  Trophy,
  Activity,
  Building,
  Globe,
  Search,
  Crosshair,
  Bomb,
  Ticket,
  Users,
  ShieldAlert,
  Flame,
  Wrench,
  Filter,
  Eye,
  AlertTriangle,
  Plus,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Country, GameState, Stadium, Tournament } from "../types";

interface SportsAndVenuesTabProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  playerCountry: Country | undefined;
  addNews: (message: string, type: "war" | "economy" | "diplomacy" | "info") => void;
  // Handlers
  handleEvacuateVenue: (stadiumId: string) => void;
  handleFillVenue: (stadiumId: string, customTitle?: string) => void;
  handleBombVenue: (stadiumId: string, strikeType: "missile" | "airstrike" | "artillery") => void;
  handleRepairVenue: (stadiumId: string) => void;
}

export const SportsAndVenuesTab: React.FC<SportsAndVenuesTabProps> = ({
  gameState,
  setGameState,
  playerCountry,
  addNews,
  handleEvacuateVenue,
  handleFillVenue,
  handleBombVenue,
  handleRepairVenue,
}) => {
  // Navigation Sub-tab
  const [subTab, setSubTab] = useState<"explorer" | "tournaments" | "builder">("explorer");

  // Explorer Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [occupancyFilter, setOccupancyFilter] = useState<"all" | "full" | "empty" | "destroyed">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modals & Active Targets
  const [selectedVenueForBombing, setSelectedVenueForBombing] = useState<Stadium | null>(null);
  const [bombStrikeType, setBombStrikeType] = useState<"missile" | "airstrike" | "artillery">("missile");
  const [selectedVenueForFill, setSelectedVenueForFill] = useState<Stadium | null>(null);
  const [fillEventTitle, setFillEventTitle] = useState("");

  // Builder Form States
  const [buildName, setBuildName] = useState("");
  const [buildType, setBuildType] = useState<Stadium["type"]>("football");
  const [buildCapacity, setBuildCapacity] = useState<number>(45000);
  const [buildCountryId, setBuildCountryId] = useState<string>(playerCountry?.id || "saudi_arabia");
  const [buildCity, setBuildCity] = useState<string>("");
  const [buildInitialOccupancy, setBuildInitialOccupancy] = useState<"full" | "empty">("empty");
  const [buildInitialEvent, setBuildInitialEvent] = useState<string>("");

  // Tournament Form States
  const [tourName, setTourName] = useState("");
  const [tourType, setTourType] = useState<Tournament["type"]>("custom");
  const [tourSport, setTourSport] = useState<Tournament["sportType"]>("football");
  const [tourCost, setTourCost] = useState<number>(5);
  const [tourRevenue, setTourRevenue] = useState<number>(8);
  const [tourPrestige, setTourPrestige] = useState<number>(10);

  // Filtered Venues List
  const allStadiums = useMemo(() => gameState.stadiums || [], [gameState.stadiums]);

  const filteredStadiums = useMemo(() => {
    return allStadiums.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const country = gameState.countries.find((c) => c.id === s.countryId);
        const matchName = s.name.toLowerCase().includes(q);
        const matchCity = (s.city || "").toLowerCase().includes(q);
        const matchCountry = (country?.name || "").toLowerCase().includes(q);
        const matchEvent = (s.currentEvent || "").toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchCountry && !matchEvent) {
          return false;
        }
      }

      // Country filter
      if (countryFilter !== "all" && s.countryId !== countryFilter) {
        return false;
      }

      // Occupancy / Status filter
      if (occupancyFilter === "full") {
        if (s.health === 0 || s.occupancyStatus !== "full") return false;
      } else if (occupancyFilter === "empty") {
        if (s.health === 0 || s.occupancyStatus !== "empty") return false;
      } else if (occupancyFilter === "destroyed") {
        if ((s.health ?? 100) > 0) return false;
      }

      // Type filter
      if (typeFilter !== "all" && s.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [allStadiums, searchQuery, countryFilter, occupancyFilter, typeFilter, gameState.countries]);

  // Statistics counters
  const totalVenues = allStadiums.length;
  const fullVenuesCount = allStadiums.filter((s) => (s.health ?? 100) > 0 && s.occupancyStatus === "full").length;
  const emptyVenuesCount = allStadiums.filter((s) => (s.health ?? 100) > 0 && s.occupancyStatus === "empty").length;
  const destroyedVenuesCount = allStadiums.filter((s) => (s.health ?? 100) === 0).length;

  const getTypeBadge = (type: Stadium["type"]) => {
    switch (type) {
      case "football":
        return { label: "⚽ كرة قدم", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      case "basketball":
        return { label: "🏀 كرة سلة", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" };
      case "tennis":
        return { label: "🎾 كرة مضرب", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
      case "olympic":
        return { label: "🏅 مدينة أولمبية", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
      case "arena":
        return { label: "🎤 صالة وحفلات أرينا", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" };
      case "convention":
        return { label: "🏛️ مؤتمرات ومعارض", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
      case "festival":
        return { label: "🎪 كرنفال ومهرجانات", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
      default:
        return { label: "🏟️ مجمع فعاليات", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
    }
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-l from-yellow-500 via-amber-500 to-orange-500" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 justify-start md:justify-end">
              <span>🏟️ منظومة الملاعب وساحات الفعاليات والبطولات السيادية</span>
              <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              ابحث واستكشف كافة الملاعب وصالات المؤتمرات والمهرجانات لدى جميع الدول، وتحقق من حالتها فوراً (فاضي أم مليان بالجماهير)، ونفّذ ضربات وقصفاً عسكرياً ضدها أو قم بإخلائها وملئها وتشييد صروح جديدة!
            </p>
          </div>

          {/* Sub-tab Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setSubTab("explorer")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === "explorer"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>مستكشف وبحث الملاعب ({filteredStadiums.length})</span>
            </button>
            <button
              onClick={() => setSubTab("tournaments")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === "tournaments"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>البطولات العالمية ({gameState.tournaments?.length || 0})</span>
            </button>
            <button
              onClick={() => setSubTab("builder")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === "builder"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>تشييد صرح / بطولة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-bold">إجمالي الملاعب والساحات</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalVenues} صرحاً</div>
          </div>
          <Building className="w-8 h-8 text-blue-400/80 bg-blue-500/10 p-1.5 rounded-xl" />
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>مليان (يحتضن فعاليات)</span>
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">{fullVenuesCount} مكان</div>
          </div>
          <Ticket className="w-8 h-8 text-emerald-400/80 bg-emerald-500/10 p-1.5 rounded-xl" />
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-amber-400 font-bold">فاضي (خالٍ من الجماهير)</div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{emptyVenuesCount} صرح</div>
          </div>
          <Users className="w-8 h-8 text-amber-400/80 bg-amber-500/10 p-1.5 rounded-xl" />
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-red-400 font-bold">مدمّر بقصف عسكري</div>
            <div className="text-2xl font-black text-red-400 mt-0.5">{destroyedVenuesCount} منشأة</div>
          </div>
          <Flame className="w-8 h-8 text-red-400/80 bg-red-500/10 p-1.5 rounded-xl" />
        </div>
      </div>

      {/* ======================= TAB 1: EXPLORER & SEARCH ======================= */}
      {subTab === "explorer" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input field */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ابحث بالاسم، المدينة، اسم الفعالية، أو الدولة..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pr-10 pl-3 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Country selector filter */}
              <div className="md:col-span-3">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">🌍 كل الدول والسيادات</option>
                  {gameState.countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} {c.id === playerCountry?.id ? "(دولتك)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div className="md:col-span-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">🏟️ جميع أنواع المنشآت والساحات</option>
                  <option value="football">⚽ ملاعب كرة القدم</option>
                  <option value="basketball">🏀 صالات كرة السلة</option>
                  <option value="tennis">🎾 مجمعات التنس الدولي</option>
                  <option value="olympic">🏅 المدن الرياضية الأولمبية</option>
                  <option value="arena">🎤 صالات الأرينا والحفلات الكبرى</option>
                  <option value="convention">🏛️ مراكز المؤتمرات والقمم السيادية</option>
                  <option value="festival">🎪 ساحات المهرجانات والكرنفالات</option>
                </select>
              </div>
            </div>

            {/* Occupancy Status Pills Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>حالة الإشغال (فاضي / مليان):</span>
              </span>

              <button
                onClick={() => setOccupancyFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  occupancyFilter === "all"
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-slate-950/50 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                الكل ({allStadiums.length})
              </button>

              <button
                onClick={() => setOccupancyFilter("full")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  occupancyFilter === "full"
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-sm"
                    : "bg-slate-950/50 text-emerald-400 hover:bg-emerald-500/10 border border-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>مليان (يحتضن فعاليات) ({fullVenuesCount})</span>
              </button>

              <button
                onClick={() => setOccupancyFilter("empty")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  occupancyFilter === "empty"
                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm"
                    : "bg-slate-950/50 text-amber-400 hover:bg-amber-500/10 border border-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>فاضي (خالٍ من الجماهير) ({emptyVenuesCount})</span>
              </button>

              <button
                onClick={() => setOccupancyFilter("destroyed")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  occupancyFilter === "destroyed"
                    ? "bg-red-500/30 text-red-300 border border-red-500/50 shadow-sm"
                    : "bg-slate-950/50 text-red-400 hover:bg-red-500/10 border border-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>مدمّر بقصف عسكري ({destroyedVenuesCount})</span>
              </button>
            </div>
          </div>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStadiums.map((venue) => {
              const country = gameState.countries.find((c) => c.id === venue.countryId);
              const isPlayerOwned = venue.countryId === playerCountry?.id;
              const isDestroyed = (venue.health ?? 100) === 0;
              const isFull = !isDestroyed && venue.occupancyStatus === "full";
              const typeBadge = getTypeBadge(venue.type);

              return (
                <div
                  key={venue.id}
                  className={`border rounded-2xl p-5 space-y-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isDestroyed
                      ? "bg-red-950/20 border-red-500/30 shadow-red-950/40"
                      : isFull
                      ? "bg-slate-900/80 border-emerald-500/30 shadow-lg shadow-emerald-950/10"
                      : "bg-slate-900/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Top Status Bar Accent */}
                  <div
                    className={`absolute top-0 right-0 left-0 h-1.5 ${
                      isDestroyed
                        ? "bg-red-600 animate-pulse"
                        : isFull
                        ? "bg-gradient-to-l from-emerald-400 to-teal-500"
                        : "bg-gradient-to-l from-amber-400 to-yellow-600"
                    }`}
                  />

                  {/* Top Info: Country Flag, City, Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeBadge.color}`}>
                          {typeBadge.label}
                        </span>
                        {isPlayerOwned && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ⭐ دولتك
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                        <span>{venue.city ? `${venue.city} - ` : ""}{country?.name || "دولة مجهولة"}</span>
                        <span className="text-base">{country?.flag || "🏳️"}</span>
                      </div>
                    </div>

                    {/* Venue Name */}
                    <h4 className="text-base font-extrabold text-white flex items-center justify-between gap-2">
                      <span>{venue.name}</span>
                      {isDestroyed ? (
                        <span className="text-xs text-red-400 font-mono font-bold">0% سلامة 💥</span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {((venue.capacity || 40000)).toLocaleString()} مقعد
                        </span>
                      )}
                    </h4>

                    {/* Occupancy Indicator Banner */}
                    {isDestroyed ? (
                      <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-right space-y-1">
                        <div className="text-xs font-bold text-red-400 flex items-center gap-1 justify-end">
                          <span>مدمّر بالكامل جراء قصف عسكري 💥</span>
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        </div>
                        <p className="text-[10px] text-red-300/80 leading-tight">
                          {venue.lastStrikeType
                            ? `تم استهدافه بـ ${venue.lastStrikeType === "missile" ? "صاروخ بالستي" : venue.lastStrikeType === "airstrike" ? "غارة جوية" : "قصف مدفعي"} وسقط ${venue.lastCasualties || 0} ضحية.`
                            : "الصرح خارج الخدمة تماماً ويتطلب إعادة إعمار وترميم."}
                        </p>
                      </div>
                    ) : isFull ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-right space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-mono font-extrabold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{(venue.attendeesCount || Math.floor(venue.capacity * 0.9)).toLocaleString()} متفرج</span>
                          </span>
                          <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>مليان (يحتضن فعالية جارية) 🎟️</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-200 font-semibold truncate" title={venue.currentEvent}>
                          {venue.currentEvent || "مباراة جماهيرية كبرى ⚽"}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-right space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-400 font-mono font-bold">0 متفرج</span>
                          <span className="font-extrabold text-amber-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span>فاضي (خالٍ من الجماهير) 🧹</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-200/80 leading-tight">
                          {venue.currentEvent || "المكان فارغ وجاهز لتنظيم واستضافة الفعاليات الكبرى."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    {/* Primary Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Bomb / Strike Venue Button */}
                      {!isDestroyed ? (
                        <button
                          onClick={() => {
                            setSelectedVenueForBombing(venue);
                            setBombStrikeType("missile");
                          }}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-950/40 active:scale-95"
                          title="استهداف وقصف هذا الصرح بالصواريخ أو الطيران"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>قصف واستهداف 🚀</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRepairVenue(venue.id)}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-600/90 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/40 active:scale-95 col-span-2"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>ترميم وإعادة إعمار الصرح (تكلفة مالية)</span>
                        </button>
                      )}

                      {/* Fill / Evacuate Toggle */}
                      {!isDestroyed && (
                        <>
                          {isFull ? (
                            <button
                              onClick={() => handleEvacuateVenue(venue.id)}
                              className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                              title="إخلاء الملعب فوراً وجعله فارغاً"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                              <span>إخلاء طارئ (تفريغ) 🚨</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedVenueForFill(venue);
                                setFillEventTitle("");
                              }}
                              className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-950/40"
                              title="إقامة فعالية وملء المكان بالجماهير"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>إقامة فعالية (ملء) 🎟️</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredStadiums.length === 0 && (
              <div className="col-span-full p-12 text-center bg-slate-900/40 border border-dashed border-white/10 rounded-3xl space-y-3">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">لم يتم العثور على ملاعب تطابق معايير البحث</h4>
                <p className="text-xs text-slate-500">جرب تعديل كلمات البحث أو تصفية نوع المنشأة وحالة الإشغال.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCountryFilter("all");
                    setOccupancyFilter("all");
                    setTypeFilter("all");
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-all"
                >
                  إعادة ضبط المرشحات
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: TOURNAMENTS ======================= */}
      {subTab === "tournaments" && (
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs text-slate-400">البطولات الفعالة والترشيحات الجارية</span>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏆 الأجندة الرياضية والبطولات القائمة والمستقبلية</span>
            </h4>
          </div>

          <div className="space-y-4">
            {(gameState.tournaments || []).map((tour) => {
              const hasBid = tour.bidders.includes(playerCountry?.id || "");
              const hostCountry = tour.hostCountryId ? gameState.countries.find((c) => c.id === tour.hostCountryId) : null;
              const hostName = hostCountry ? hostCountry.name : "لم يحدد بعد";
              const hostFlag = hostCountry ? hostCountry.flag : "🗳️";
              const winnerCountryObj = tour.winnerCountryId ? gameState.countries.find((c) => c.id === tour.winnerCountryId) : null;

              return (
                <div
                  key={tour.id}
                  className="p-5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all space-y-4 text-right"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      {tour.status === "bidding" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          ⏳ باب الترشح مفتوح
                        </span>
                      )}
                      {tour.status === "upcoming" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                          📅 قريباً تحت التجهيز
                        </span>
                      )}
                      {tour.status === "ongoing" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold animate-pulse">
                          🔥 جارية الآن
                        </span>
                      )}
                      {tour.status === "completed" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          🏆 منتهية بنجاح
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">سنة {tour.year}</span>
                    </div>
                    <span className="font-bold text-base text-white">{tour.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">المستضيف: </span>
                      <span className="font-semibold text-slate-100 flex items-center gap-1 mt-0.5 justify-end">
                        <span>{hostName}</span>
                        <span>{hostFlag}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">التكلفة والإنفاق: </span>
                      <span className="font-mono font-bold text-red-400 block mt-0.5">-{tour.investmentCost}B$</span>
                    </div>
                    <div>
                      <span className="text-slate-400">العوائد والمكاسب المتوقعة: </span>
                      <span className="font-mono font-bold text-emerald-400 block mt-0.5">
                        +{tour.revenueGenerated}B$ (+{tour.prestigeReward} هيبة)
                      </span>
                    </div>
                  </div>

                  {/* Bidding actions */}
                  {tour.status === "bidding" && (
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <div className="flex gap-1.5">
                          {tour.bidders.map((bidId) => {
                            const bidCountry = gameState.countries.find((c) => c.id === bidId);
                            return (
                              <span key={bidId} title={bidCountry?.name} className="text-base">
                                {bidCountry?.flag || "🏳️"}
                              </span>
                            );
                          })}
                        </div>
                        <span className="text-slate-400 font-bold">الدول المترشحة حالياً:</span>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400">
                          تكلفة ملف الترشيح وتعبئة اللجان الدبلوماسية: <b className="text-amber-400 font-mono">2B$</b>
                        </span>
                        {hasBid ? (
                          <span className="px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                            <span>تم تقديم ملف الترشيح بنجاح 🟢</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (!playerCountry) return;
                              if (playerCountry.stats.economy < 2) {
                                addNews("ميزانيتكم الاقتصادية لا تغطي رسوم الترشح لاستضافة البطولة.", "info");
                                return;
                              }
                              setGameState((prev) => {
                                const nextCountries = prev.countries.map((c) => {
                                  if (c.id === prev.playerCountryId) {
                                    return {
                                      ...c,
                                      stats: {
                                        ...c.stats,
                                        economy: Math.max(0, c.stats.economy - 2),
                                        sportsInterest: Math.min(100, (c.stats.sportsInterest || 45) + 3),
                                      },
                                    };
                                  }
                                  return c;
                                });
                                const nextTournaments = (prev.tournaments || []).map((t) => {
                                  if (t.id === tour.id) {
                                    return {
                                      ...t,
                                      bidders: [...t.bidders, prev.playerCountryId],
                                    };
                                  }
                                  return t;
                                });
                                return {
                                  ...prev,
                                  countries: nextCountries,
                                  tournaments: nextTournaments,
                                  news: [
                                    {
                                      id: `bid-submitted-${tour.id}-${Date.now()}`,
                                      turn: prev.turn,
                                      message: `🗳️ [ملف استضافة سيادي] أعلنت دولة ${playerCountry.name} رسمياً تقديم ملف تنظيم بطولي متكامل لاستضافة "${tour.name}" ودعم ملف الاستضافة بتمويل دبلوماسي سخي!`,
                                      type: "diplomacy",
                                    },
                                    ...prev.news,
                                  ],
                                };
                              });
                            }}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1"
                          >
                            <span>تقديم ملف الترشح 🗳️</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {tour.status === "completed" && winnerCountryObj && (
                    <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>{winnerCountryObj.flag} {winnerCountryObj.name}</span>
                        <span>🎉 البطل المتوج بالكأس واللقب:</span>
                      </span>
                      <span className="text-slate-400">اختتمت البطولة بنجاح مثالي كروي ودبلوماسي</span>
                    </div>
                  )}

                  {tour.history && tour.history.length > 0 && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-1.5 text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">سجل البطولة ومجرياتها الدبلوماسية:</span>
                      {tour.history.map((log, idx) => (
                        <p key={idx} className="text-[11px] text-slate-300 leading-relaxed flex items-start gap-1 justify-end">
                          <span>{log}</span>
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: BUILDER (VENUES & TOURNAMENTS) ======================= */}
      {subTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form 1: Build Venue for any country */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4 text-right shadow-xl">
            <h4 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2 justify-end">
              <span>تشييد صرح رياضي أو ساحة فعاليات جديدة 🏗️</span>
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">الدولة المالكة للصرح</label>
                <select
                  value={buildCountryId}
                  onChange={(e) => setBuildCountryId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {gameState.countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} {c.id === playerCountry?.id ? "(دولتك)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">اسم الصرح / الاستاد</label>
                  <input
                    type="text"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    placeholder="مثال: استاد الجوهرة الأيقوني..."
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">المدينة</label>
                  <input
                    type="text"
                    value={buildCity}
                    onChange={(e) => setBuildCity(e.target.value)}
                    placeholder="مثال: الرياض، دبي، باريس..."
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">نوع الصرح والنشاط</label>
                <select
                  value={buildType}
                  onChange={(e) => setBuildType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="football">⚽ استاد كرة قدم جماهيري</option>
                  <option value="basketball">🏀 صالة كرة سلة مغلقة</option>
                  <option value="tennis">🎾 مجمع ملاعب تنس أرضي</option>
                  <option value="olympic">🏅 مدينة رياضية أولمبية متكاملة</option>
                  <option value="arena">🎤 صالة أرينا للحفلات والاستعراض</option>
                  <option value="convention">🏛️ مركز مؤتمرات ومعارض وقمم دولية</option>
                  <option value="festival">🎪 ساحة فعاليات ومهرجانات وكرنفال</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-300">{buildCapacity.toLocaleString()} متفرج</span>
                  <label className="block font-bold text-slate-300">السعة الاستيعابية</label>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={120000}
                  step={5000}
                  value={buildCapacity}
                  onChange={(e) => setBuildCapacity(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">الحالة الأولية</label>
                  <select
                    value={buildInitialOccupancy}
                    onChange={(e) => setBuildInitialOccupancy(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-xs font-bold text-slate-100 text-right"
                  >
                    <option value="empty">🧹 فاضي (خالٍ من الجماهير)</option>
                    <option value="full">🎟️ مليان (يحتضن فعالية فورية)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">عنوان الفعالية (اختياري)</label>
                  <input
                    type="text"
                    value={buildInitialEvent}
                    onChange={(e) => setBuildInitialEvent(e.target.value)}
                    placeholder="مثال: حفل الافتتاح الرسمي..."
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-xs text-slate-100 text-right"
                  />
                </div>
              </div>

              {(() => {
                const cost = Math.max(1, Math.round(((buildCapacity / 10000) * 0.5) * 10) / 10);
                return (
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 space-y-1 text-xs text-right">
                    <div className="flex justify-between">
                      <span className="font-mono font-bold text-red-400">-{cost}B$</span>
                      <span className="text-slate-400">تكلفة التشييد المطلوبة:</span>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  if (!playerCountry) return;
                  if (!buildName.trim()) {
                    addNews("يرجى إدخال اسم الصرح قبل التشييد.", "info");
                    return;
                  }
                  const cost = Math.max(1, Math.round(((buildCapacity / 10000) * 0.5) * 10) / 10);
                  if (playerCountry.stats.economy < cost) {
                    addNews("ميزانيتكم الاقتصادية لا تغطي تكلفة هذا الصرح الفخم.", "info");
                    return;
                  }

                  const targetCountry = gameState.countries.find((c) => c.id === buildCountryId) || playerCountry;
                  const isFull = buildInitialOccupancy === "full";
                  const attendees = isFull ? Math.floor(buildCapacity * 0.9) : 0;
                  const eventTitle = buildInitialEvent.trim() || (isFull ? "مهرجان الافتتاح والتدشين الأسطوري ✨" : "فارغ وجاهز للفعاليات 🧹");

                  setGameState((prev) => {
                    const nextCountries = prev.countries.map((c) => {
                      if (c.id === prev.playerCountryId) {
                        return {
                          ...c,
                          stats: {
                            ...c.stats,
                            economy: Math.max(0, c.stats.economy - cost),
                            sportsInterest: Math.min(100, (c.stats.sportsInterest || 45) + 3),
                            happiness: Math.min(100, c.stats.happiness + 2),
                          },
                        };
                      }
                      return c;
                    });

                    const newStadium: Stadium = {
                      id: `stad-custom-${Date.now()}`,
                      name: buildName,
                      type: buildType,
                      capacity: buildCapacity,
                      cost: cost,
                      countryId: targetCountry.id,
                      city: buildCity.trim() || "العاصمة",
                      occupancyStatus: buildInitialOccupancy,
                      currentEvent: eventTitle,
                      attendeesCount: attendees,
                      health: 100,
                      isEvacuated: false,
                    };

                    return {
                      ...prev,
                      countries: nextCountries,
                      stadiums: [...(prev.stadiums || []), newStadium],
                      news: [
                        {
                          id: `stad-built-${Date.now()}`,
                          turn: prev.turn,
                          message: `🏗️ [تدشين صرح جديد] تم تدشين وافتتاح "${buildName}" في ${targetCountry.flag} ${targetCountry.name} بسعة ${buildCapacity.toLocaleString()} مقعد بنجاح!`,
                          type: "info",
                        },
                        ...prev.news,
                      ],
                    };
                  });

                  setBuildName("");
                  setBuildCity("");
                  setBuildInitialEvent("");
                  addNews(`تم تدشين صرح "${buildName}" بنجاح!`, "info");
                  setSubTab("explorer");
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 rounded-xl text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>تدشين وإطلاق المنشأة رسمياً 🏗️</span>
              </button>
            </div>
          </div>

          {/* Form 2: Create Custom Tournament */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4 text-right shadow-xl">
            <h4 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2 justify-end">
              <span>تأسيس بطولة دولية جديدة 🏆</span>
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">اسم البطولة</label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="مثال: بطولة كأس القادة للأندية النخبوية..."
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">فئة وتصنيف البطولة</label>
                <select
                  value={tourType}
                  onChange={(e) => setTourType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                >
                  <option value="custom">🏆 بطولة سيادية مخصصة (ودية/إقليمية)</option>
                  <option value="world_cup">⚽ مونديال كأس العالم المصغر</option>
                  <option value="asian_cup">🇸🇦 كأس آسيا كروية</option>
                  <option value="arab_cup">🇸🇦 كأس العرب الموحد</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">نوع اللعبة المدرجة</label>
                <select
                  value={tourSport}
                  onChange={(e) => setTourSport(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                >
                  <option value="football">⚽ منافسات كرة قدم</option>
                  <option value="basketball">🏀 بطولة عمالقة السلة</option>
                  <option value="tennis">🎾 جولة المضرب الذهبي للتنس</option>
                  <option value="olympic">🏅 الألعاب والمنافسات الأولمبية</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-right">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-300">التمويل والتنظيم (B$)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={tourCost}
                    onChange={(e) => setTourCost(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-xs font-bold text-slate-100 text-center focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-300">العوائد المالية المتوقعة (B$)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={tourRevenue}
                    onChange={(e) => setTourRevenue(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-xs font-bold text-slate-100 text-center focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!playerCountry) return;
                  if (!tourName.trim()) {
                    addNews("يرجى كتابة اسم البطولة قبل تأسيسها.", "info");
                    return;
                  }
                  if (playerCountry.stats.economy < tourCost) {
                    addNews("ميزانيتكم الاقتصادية لا تكفي لتمويل وتنظيم هذه البطولة الدولية الضخمة.", "info");
                    return;
                  }

                  const playerStadiums = (gameState.stadiums || []).filter((s) => s.countryId === playerCountry.id);
                  const matchingStad = playerStadiums.find((s) => s.type === tourSport || s.type === "olympic");
                  if (!matchingStad) {
                    addNews(`لا يمكن تنظيم هذه البطولة! يجب تشييد ملعب مخصص لـ "${tourSport === "football" ? "كرة القدم" : tourSport === "basketball" ? "كرة السلة" : tourSport === "tennis" ? "كرة المضرب" : "الألعاب الأولمبية"}" أولاً.`, "info");
                    return;
                  }

                  setGameState((prev) => {
                    const nextCountries = prev.countries.map((c) => {
                      if (c.id === prev.playerCountryId) {
                        return {
                          ...c,
                          stats: {
                            ...c.stats,
                            economy: Math.max(0, c.stats.economy - tourCost),
                            sportsInterest: Math.min(100, (c.stats.sportsInterest || 45) + 6),
                            happiness: Math.min(100, c.stats.happiness + 5),
                          },
                        };
                      }
                      return c;
                    });

                    const newTour: Tournament = {
                      id: `tour-custom-${Date.now()}`,
                      name: tourName,
                      status: "upcoming",
                      hostCountryId: prev.playerCountryId,
                      bidders: [prev.playerCountryId],
                      type: tourType,
                      sportType: tourSport,
                      year: prev.turn + 2026,
                      investmentCost: tourCost,
                      revenueGenerated: tourRevenue,
                      prestigeReward: tourPrestige,
                      history: [`تم إطلاق البطولة بمبادرة سامية من دولة ${playerCountry.name}، وتم اختيار الاستاد المرموق "${matchingStad.name}" كمسرح رسمي لافتتاح البطولة!`],
                    };

                    return {
                      ...prev,
                      countries: nextCountries,
                      tournaments: [...(prev.tournaments || []), newTour],
                      news: [
                        {
                          id: `tour-created-${Date.now()}`,
                          turn: prev.turn,
                          message: `🏆 [تأسيس بطولة دولية] أعلن الاتحاد الرياضي في ${playerCountry.name} رسمياً إطلاق وتأسيس "${tourName}" بتمويل يقدر بـ ${tourCost}B$!`,
                          type: "info",
                        },
                        ...prev.news,
                      ],
                    };
                  });

                  setTourName("");
                  addNews("تهانينا! تم تأسيس وإطلاق البطولة بنجاح.", "info");
                  setSubTab("tournaments");
                }}
                className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 shadow-lg shadow-yellow-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>إطلاق وتأسيس البطولة الرياضية 🏆</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: BOMB / STRIKE VENUE ======================= */}
      {selectedVenueForBombing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-base">
                <Crosshair className="w-5 h-5 text-red-500 animate-pulse" />
                <span>مركز العمليات: أمر استهداف وقصف عسكري</span>
              </div>
              <button
                onClick={() => setSelectedVenueForBombing(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Target Information Card */}
            {(() => {
              const targetCountry = gameState.countries.find((c) => c.id === selectedVenueForBombing.countryId);
              const isFull = selectedVenueForBombing.occupancyStatus === "full";
              const attendees = selectedVenueForBombing.attendeesCount || Math.floor(selectedVenueForBombing.capacity * 0.9);

              return (
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">الهدف المحدد:</span>
                    <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <span>{selectedVenueForBombing.name}</span>
                      <span>{targetCountry?.flag}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">الدولة والموقع:</span>
                    <span className="text-slate-200 font-bold">{selectedVenueForBombing.city || "العاصمة"} - {targetCountry?.name}</span>
                  </div>

                  {/* Occupancy warning */}
                  {isFull ? (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1">
                      <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                        <span>⚠️ تنبيه: المكان مكتظ بالجماهير (مليان)!</span>
                      </div>
                      <p className="text-[11px] text-red-300/90 leading-tight">
                        يحتضن الصرح حالياً: <b>"{selectedVenueForBombing.currentEvent}"</b> بتواجد ما يزيد عن{" "}
                        <b className="font-mono text-white">{attendees.toLocaleString()} شخص</b>. القصف سيتسبب في خسائر بشرية وإدانات دولية واسعة!
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>المكان خالٍ تماماً (فاضي)</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-tight">
                        لا يوجد حضور جماهيري في الموقع، والضربة ستؤدي لتدمير البنية التحتية للمنشأة وخسائر اقتصادية للخصم دون ضحايا مدنيين.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Strike Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">اختر منظومة وسلاح القصف:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setBombStrikeType("missile")}
                  className={`p-3 rounded-xl border text-right space-y-1 transition-all ${
                    bombStrikeType === "missile"
                      ? "bg-red-500/20 border-red-500 text-white shadow-md shadow-red-500/20"
                      : "bg-slate-950/50 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold">🚀 صاروخ بالستي</div>
                  <div className="text-[10px] text-slate-400">تتطلب: 1 صاروخ</div>
                </button>

                <button
                  onClick={() => setBombStrikeType("airstrike")}
                  className={`p-3 rounded-xl border text-right space-y-1 transition-all ${
                    bombStrikeType === "airstrike"
                      ? "bg-red-500/20 border-red-500 text-white shadow-md shadow-red-500/20"
                      : "bg-slate-950/50 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold">✈️ غارة جوية</div>
                  <div className="text-[10px] text-slate-400">قوة عسكرية: 15+</div>
                </button>

                <button
                  onClick={() => setBombStrikeType("artillery")}
                  className={`p-3 rounded-xl border text-right space-y-1 transition-all ${
                    bombStrikeType === "artillery"
                      ? "bg-red-500/20 border-red-500 text-white shadow-md shadow-red-500/20"
                      : "bg-slate-950/50 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold">💥 قصف مدفعي</div>
                  <div className="text-[10px] text-slate-400">قوة عسكرية: 10+</div>
                </button>
              </div>
            </div>

            {/* Execute Strike / Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedVenueForBombing(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleBombVenue(selectedVenueForBombing.id, bombStrikeType)}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/40 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Crosshair className="w-4 h-4" />
                <span>إطلاق وتنفيذ الضربة فوراً 🔥</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: FILL / LAUNCH EVENT IN VENUE ======================= */}
      {selectedVenueForFill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span>تنظيم فعالية وملء الصرح بالجماهير</span>
              </div>
              <button
                onClick={() => setSelectedVenueForFill(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                سيتم ملء مدرجات <b>"{selectedVenueForFill.name}"</b> بما يقارب{" "}
                <b className="text-emerald-400 font-mono">
                  {Math.floor(selectedVenueForFill.capacity * 0.9).toLocaleString()} متفرج
                </b>{" "}
                وإطلاق الفعالية لتصبح حالة الصرح <b className="text-emerald-400">مليان 🎟️</b>.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">عنوان الفعالية أو المباراة (اختياري)</label>
                <input
                  type="text"
                  value={fillEventTitle}
                  onChange={(e) => setFillEventTitle(e.target.value)}
                  placeholder="مثال: نهائي كأس النخبة الكروي الحاسم ⚽..."
                  className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-xl text-xs font-bold text-white text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setFillEventTitle("نهائي دوري أبطال القارات الكروي ⚽")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-300 border border-white/5"
                >
                  ⚽ نهائي دوري الأبطال
                </button>
                <button
                  onClick={() => setFillEventTitle("مهرجان الموسيقى والاستعراض العالمي 🎶")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-300 border border-white/5"
                >
                  🎶 مهرجان الموسيقى
                </button>
                <button
                  onClick={() => setFillEventTitle("القمة الدبلوماسية لرؤساء الدول العظمى 🏛️")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-300 border border-white/5"
                >
                  🏛️ قمة القادة
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedVenueForFill(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleFillVenue(selectedVenueForFill.id, fillEventTitle)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>إطلاق الفعالية وملء المدرجات 🎟️</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

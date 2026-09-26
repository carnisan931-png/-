import React, { useState } from "react";
import { 
  AlertTriangle, ShieldAlert, DollarSign, Flame, 
  ChevronDown, ChevronUp, MessageSquare, Anchor, Waves, 
  ExternalLink, Globe, Zap, Radio 
} from "lucide-react";
import { HORMUZ_PROTESTS_DATA, HormuzCountryProtest } from "../data/hormuzReactions";
import { Country } from "../types";

interface HormuzCrisisPanelProps {
  isClosed: boolean;
  onOpenDiplomacy: (countryId: string) => void;
  countries: Country[];
}

export const HormuzCrisisPanel: React.FC<HormuzCrisisPanelProps> = ({
  isClosed,
  onOpenDiplomacy,
  countries,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProtestId, setSelectedProtestId] = useState<string | null>(null);

  if (!isClosed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950/90 via-slate-900/90 to-red-950/90 border-2 border-red-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-red-950/50 my-4 text-right animate-pulse-border relative overflow-hidden" dir="rtl">
      {/* Background glow and decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/30 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
            <Anchor className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
                حالة طوارئ عالمية 🚨
              </span>
              <span className="text-xs text-red-300/80 font-mono">21M برميل/يوم متوقفة</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mt-0.5">
              أزمة إغلاق مضيق هرمز: عاصفة الاحتجاجات والاعتراضات والذرائع الدولية
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>طي التفاصيل</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>عرض الدول المعترضة ({HORMUZ_PROTESTS_DATA.length})</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Alert Description */}
      <div className="mt-3 text-xs sm:text-sm text-red-200/90 leading-relaxed relative z-10 bg-red-950/40 border border-red-500/20 p-3 rounded-2xl">
        <p className="font-semibold">
          ⚠️ بعد قرار إغلاق مضيق هرمز، اشتعلت الأسواق العالمية واحتجت كبرى العواصم بشدة؛ حيث بدأت الدول بالتحجج بقطع إمدادات الطاقة، انتهاك القوانين البحرية الدولية، وشلل المصانع، ملوحةً بفرض عقوبات قاصمة وإرسال أساطيل حربية لكسر الإغلاق بالقوة المسلحة!
        </p>
      </div>

      {/* Protesting Countries Grid */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          {HORMUZ_PROTESTS_DATA.map((protest) => {
            const countryObj = countries.find(c => c.id === protest.countryId);
            const isSelected = selectedProtestId === protest.countryId;

            return (
              <div
                key={protest.countryId}
                className="bg-slate-950/80 border border-red-500/30 hover:border-red-400/60 rounded-2xl p-3.5 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Top row of card */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{protest.flag}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{protest.countryName}</h4>
                        <span className="text-[10px] text-red-400/90 font-mono">
                          خسائر تقديرية: -{protest.economicDamageB}B$
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-900/60 text-red-300 border border-red-500/40">
                      {protest.threatLevel}
                    </span>
                  </div>

                  {/* Pretext & Excuse */}
                  <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-2 mb-2 text-xs">
                    <span className="text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      الحجة والذريعة الرسمية:
                    </span>
                    <p className="text-amber-200/90 text-[11px] leading-relaxed">
                      "{protest.pretext}"
                    </p>
                  </div>

                  {/* Official Outrage Statement */}
                  <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-2 mb-2 text-xs">
                    <span className="text-red-400 font-bold block mb-0.5 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                      البيان والاعتراض الغاضب:
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      "{protest.officialStatement}"
                    </p>
                  </div>

                  {/* Military Reaction */}
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 text-xs mb-3">
                    <span className="text-slate-400 font-bold block mb-0.5 flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      التحرك العسكري والأمني:
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      {protest.militaryReaction}
                    </p>
                  </div>
                </div>

                {/* Direct Negotiation Button */}
                <button
                  onClick={() => onOpenDiplomacy(protest.countryId)}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>بدء محادثات ومفاوضات دبلوماسية فورية مع {protest.countryName}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HormuzCrisisPanel;

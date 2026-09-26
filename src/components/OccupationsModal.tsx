import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  Flame,
  CheckCircle2,
  X,
  Target,
  Sparkles,
  HeartHandshake,
  Send,
  MessageSquareQuote,
  Globe2,
  Zap,
  Building2,
  Coins
} from 'lucide-react';
import { Country, GameState, JointDestinyPact } from '../types';

interface OccupationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  playerCountry: Country;
  onSignPact: (targetId: string) => void;
  onRevokePact: (targetId: string) => void;
  onOccupyCountry?: (targetId: string) => void;
  onLiberateCountry?: (occupiedId: string) => void;
  onLaunchLiberationWar?: (occupiedId: string, occupierId: string) => void;
  onSendResistanceAid: (targetId: string, amount: number) => void;
  onOpenDiplomacy: (country: Country) => void;
}

export const OccupationsModal: React.FC<OccupationsModalProps> = ({
  isOpen,
  onClose,
  gameState,
  playerCountry,
  onSignPact,
  onRevokePact,
  onSendResistanceAid,
  onOpenDiplomacy,
}) => {
  const [selectedTab, setSelectedTab] = useState<'palestine_solidarity' | 'active_pacts' | 'add_new_pact'>('palestine_solidarity');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const jointPacts: JointDestinyPact[] = gameState.jointDestinyPacts || [];

  const palestineCountry = gameState.countries.find((c) => c.id === 'palestine');
  const hasPalestinePact = jointPacts.some((p) => p.protectedId === 'palestine');

  // Friendly countries available to sign a pact with (alive, not player, not already in pact)
  const availableCountries = gameState.countries.filter(
    (c) =>
      c.id !== playerCountry.id &&
      c.isAlive &&
      !jointPacts.some((p) => p.protectedId === c.id)
  );

  const handleSupportCountry = (targetId: string, name: string) => {
    onSendResistanceAid(targetId, 10);
    setSuccessMsg(`🚀 تم إرسال شحنة دعم دفاعي ومنظومات صواريخ وتمويل بقيمة 10B$ إلى ${name} لتعزيز الجاهزية الدفاعية!`);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  const handleTogglePact = (targetId: string, hasPact: boolean) => {
    if (hasPact) {
      onRevokePact(targetId);
      setSuccessMsg(`تم إنهاء ميثاق المصير المشترك.`);
    } else {
      onSignPact(targetId);
      setSuccessMsg(`🤝 تم توثيق ميثاق المصير المشترك رسمياً: "أي اعتداء يقع عليهم يُعد اعتداءً مباشراً على عاصمتنا وأراضينا الوطنية!"`);
    }
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-right font-sans" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-950 border-2 border-emerald-500/40 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[880px] flex flex-col shadow-2xl shadow-emerald-950/40 overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
              🇵🇸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>ميثاق المصير المشترك والدفاع التضامني</span>
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> كفالة سيادية مطلقة
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                "أي اعتداء عليهم كأنه اعتداء مباشر عليا" — تحالف سيادي وأمني متين لنصرة الأشقاء ودحر أي عدوان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-900/60 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('palestine_solidarity')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'palestine_solidarity'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🇵🇸 كفالة ونصرة فلسطين الحرة</span>
            {hasPalestinePact && (
              <span className="bg-emerald-950 px-2 py-0.5 rounded-full text-[10px] border border-emerald-400/40 text-emerald-300 font-mono">
                مفعل 🛡️
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedTab('active_pacts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'active_pacts'
                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>الدول المشمولة بالميثاق</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded-full text-[10px] text-emerald-300 border border-emerald-500/30">
              {jointPacts.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('add_new_pact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'add_new_pact'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>عقد ميثاق جديد مع دولة شقيقة</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded-full text-[10px]">
              {availableCountries.length}
            </span>
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-3 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Palestine Solidarity */}
          {selectedTab === 'palestine_solidarity' && (
            <div className="space-y-6">
              {/* Sovereign Principle Card */}
              <div className="p-5 bg-gradient-to-l from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
                    <HeartHandshake className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <span>مبدأ المصير المشترك: «أي اعتداء عليهم كأنه اعتداء مباشر عليا»</span>
                      </h3>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        كفالة وجودية
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      عند تفعيل <strong>ميثاق المصير المشترك</strong> مع دولة فلسطين 🇵🇸 أو أي دولة حليفة، فإنك تعلن رسمياً أمام العالم أن
                      سيادتهم وأمنهم جزء لا يتجزأ من سيادتك وأمنك الوطني. <strong>أي استهداف عسكري أو قصف يطالهم سيُعامل فوراً كعدوان مباشر على عاصمتك</strong>،
                      وستنطلق منظوماتك الصاروخية والدفاعية للرد الحاسم والرادع تلقائياً!
                    </p>
                  </div>
                </div>
              </div>

              {/* Palestine Showcase Card */}
              {palestineCountry && (
                <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">🇵🇸</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white">دولة فلسطين الحرة المستقلة</h3>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            عاصمتها القدس الشريف
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          رمز الصمود والكرامة والرباط | السيادة الوطنية الكاملة على كامل أراضيها
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasPalestinePact ? (
                        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-black">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>ميثاق المصير المشترك مفعل 🤝</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTogglePact('palestine', false)}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          <span>عقد ميثاق المصير المشترك («كأنه اعتداء عليا»)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Palestine Stats Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold">القدرة العسكرية والدفاعية</div>
                      <div className="text-emerald-400 font-black text-lg mt-0.5">{palestineCountry.stats.military}%</div>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold">المخزون الصاروخي</div>
                      <div className="text-emerald-400 font-black text-lg mt-0.5">{palestineCountry.stats.missiles || 0} منصة</div>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold">الروح المعنوية والشعبية</div>
                      <div className="text-emerald-400 font-black text-lg mt-0.5">{palestineCountry.stats.happiness}%</div>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold">الميزانية والاحتياطي</div>
                      <div className="text-emerald-400 font-black text-lg mt-0.5">{palestineCountry.stats.economy}B$</div>
                    </div>
                  </div>

                  {/* Actions for Palestine */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSupportCountry('palestine', 'فلسطين')}
                      className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-md"
                    >
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>إمداد منظومات صواريخ باليستية ودفاع جوي (10B$)</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenDiplomacy(palestineCountry);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <MessageSquareQuote className="w-4 h-4 text-teal-400" />
                      <span>عقد قمة دبلوماسية ثنائية وتنسيق استراتيجي</span>
                    </button>

                    {hasPalestinePact && (
                      <button
                        onClick={() => handleTogglePact('palestine', true)}
                        className="px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer mr-auto"
                      >
                        إنهاء الحلف
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Active Pacts */}
          {selectedTab === 'active_pacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>الدول المشمولة بميثاق المصير المشترك النشط:</span>
                </h4>
                <span className="text-xs text-slate-400">
                  أي اعتداء عليهم يطلق رداً صاروخياً فورياً للدفاع عنهم
                </span>
              </div>

              {jointPacts.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-3xl space-y-3">
                  <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">لا توجد مواثيق مصير مشترك مفعلة حالياً</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    بإمكانك التوجه لتبويب "نصرة فلسطين الحرة" أو "عقد ميثاق جديد" لتوسيع مظلة حمايتك وكفالة أمن الدول الشقيقة.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jointPacts.map((pact) => {
                    const country = gameState.countries.find((c) => c.id === pact.protectedId);
                    if (!country) return null;

                    return (
                      <div
                        key={pact.id}
                        className="bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-500/70 rounded-2xl p-5 space-y-4 shadow-xl transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{country.flag}</span>
                            <div>
                              <h4 className="text-base font-black text-white">{country.name}</h4>
                              <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                                حليف مكفول السيادة منذ الدور {pact.sinceTurn}
                              </p>
                            </div>
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3 text-emerald-400" /> ردع صاروخي مشترك
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl text-center text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px]">الجيش</span>
                            <div className="text-white font-bold">{country.stats.military}%</div>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px]">الصواريخ</span>
                            <div className="text-emerald-400 font-bold">{country.stats.missiles || 0}</div>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px]">الاقتصاد</span>
                            <div className="text-amber-400 font-bold">{country.stats.economy}B$</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => handleSupportCountry(country.id, country.name)}
                            className="flex-1 py-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>إمداد عسكري (10B$)</span>
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenDiplomacy(country);
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            قمة
                          </button>
                          <button
                            onClick={() => handleTogglePact(country.id, true)}
                            className="px-3 py-2 bg-red-950/50 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            إنهاء
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Add New Pact */}
          {selectedTab === 'add_new_pact' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-950/30 border border-teal-500/30 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
                <HeartHandshake className="w-6 h-6 text-teal-400 shrink-0" />
                <p>
                  اختر دولة شقيقة أو حليفة لعقد <strong>ميثاق المصير المشترك</strong> معها. بمجرد توقيع الميثاق، ستدخل دولتك في حلف دفاعي مطلق
                  يضمن توجيه ضربات انتقامية رادعة لأي طرف يجرؤ على الاعتداء عليها!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableCountries.map((country) => (
                  <div
                    key={country.id}
                    className="bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{country.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          جيش {country.stats.military}% | اقتصاد {country.stats.economy}B$
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTogglePact(country.id, false)}
                      className="w-full py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>عقد ميثاق المصير المشترك</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

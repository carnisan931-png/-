import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  Sword,
  Flame,
  Handshake,
  CheckCircle2,
  X,
  Target,
  Megaphone,
  AlertTriangle,
  Award,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { Country, GameState, MilitaryOccupation, JointDestinyPact } from '../types';

interface OccupationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  playerCountry: Country;
  onSignJointDestinyPact: (targetId: string) => void;
  onRevokeJointDestinyPact: (targetId: string) => void;
  onOccupyCountry: (targetId: string) => void;
  onLiberateCountry: (occupiedId: string) => void;
  onLaunchLiberationWar: (occupiedId: string, occupierId: string) => void;
  onOpenDiplomacy: (targetId: string) => void;
  onSendResistanceAid: (occupiedId: string, amount: number) => void;
}

export const OccupationsModal: React.FC<OccupationsModalProps> = ({
  isOpen,
  onClose,
  gameState,
  playerCountry,
  onSignJointDestinyPact,
  onRevokeJointDestinyPact,
  onOccupyCountry,
  onLiberateCountry,
  onLaunchLiberationWar,
  onOpenDiplomacy,
  onSendResistanceAid,
}) => {
  const [selectedTab, setSelectedTab] = useState<'real_occupations' | 'my_occupations' | 'occupy_new'>('real_occupations');
  const [selectedTargetToOccupy, setSelectedTargetToOccupy] = useState<string>('');
  const [resistanceSuccessMsg, setResistanceSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const occupations: MilitaryOccupation[] = gameState.occupations || [];
  const jointPacts: JointDestinyPact[] = gameState.jointDestinyPacts || [];

  // Countries available to occupy (not player, alive, not already occupied)
  const availableToOccupy = gameState.countries.filter(
    (c) =>
      c.id !== playerCountry.id &&
      c.isAlive &&
      !occupations.some((o) => o.occupiedId === c.id && o.status === 'active')
  );

  const handleSupportResistance = (occupiedId: string) => {
    onSendResistanceAid(occupiedId, 10);
    setResistanceSuccessMsg(`🚀 تم إرسال شحنة صواريخ باليستية ودعم مالي بقيمة 10B$ لتعزيز صمود المقاومة ورفع جاهزية التحرير!`);
    setTimeout(() => setResistanceSuccessMsg(null), 4000);
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
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
              🇵🇸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>منظومة الاحتلالات العسكرية والمصير المشترك</span>
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> كفالة السيادة الوجودية
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                الوقوف الحاسم مع الدول المحتلة واعتبار أي اعتداء عليها كأنه اعتداء مباشر علينا، وإدارة ملفات التحرير والغزو العسكري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-900/60 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('real_occupations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'real_occupations'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🇵🇸 الاحتلالات الواقعية ونصرة فلسطين</span>
            <span className="bg-emerald-950/80 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
              {occupations.filter((o) => o.status === 'active').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('occupy_new')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'occupy_new'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>فرض الاحتلال العسكري وإخضاع دولة</span>
          </button>

          <button
            onClick={() => setSelectedTab('my_occupations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'my_occupations'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>الأقاليم الخاضعة لسيطرتنا الميدانية</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded-full text-[10px]">
              {occupations.filter((o) => o.occupierId === playerCountry.id && o.status === 'active').length}
            </span>
          </button>
        </div>

        {/* Success Banner */}
        {resistanceSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-3 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{resistanceSuccessMsg}</span>
            </div>
            <button onClick={() => setResistanceSuccessMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Real Occupations & Palestine Alliance */}
          {selectedTab === 'real_occupations' && (
            <div className="space-y-6">
              {/* Sovereign Principle Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-l from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>ميثاق الكفالة الشاملة: "كأنهم محتليني.. وأي اعتداء عليهم كأنه اعتداء عليا"</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                        مبدأ سيادي مطلق
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      عند تفعيل <strong>حلف المصير المشترك</strong> مع أي دولة محتلة (مثل فلسطين 🇵🇸)، فإنك تعلن رسمياً أمام العالم أنك
                      تتحدث بصوتهم، وتعتبر أرضهم أرضك وعرضك. <strong>أي صاروخ أو غارة أو اعتداء إسرائيلي أو معادٍ يستهدفهم سيُعامل فوراً كعدوان مباشر على عاصمتك</strong>،
                      وستطلق بطارياتك الدفاعية صواريخ الاعتراض، وستتاح لك خيارات الرد الانتقامي الساحق تلقائياً!
                    </p>
                  </div>
                </div>
              </div>

              {/* Occupations List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>الاحتلالات العسكرية النشطة في العالم:</span>
                </h4>

                {occupations.map((occ) => {
                  const occupiedCountry = gameState.countries.find((c) => c.id === occ.occupiedId);
                  const occupierCountry = gameState.countries.find((c) => c.id === occ.occupierId);
                  if (!occupiedCountry || !occupierCountry) return null;

                  const hasJointPact = jointPacts.some((p) => p.protectedId === occ.occupiedId);
                  const isPlayerOccupier = occ.occupierId === playerCountry.id;

                  return (
                    <div
                      key={occ.id}
                      className="bg-slate-900/80 border-2 border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-5"
                    >
                      {/* Top Bar of the Occupation Card */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-2">
                            <span className="text-3xl z-10">{occupiedCountry.flag}</span>
                            <span className="text-xl bg-slate-800 p-1 rounded-full border border-white/10 text-red-400 font-bold z-20">
                              ⚔️
                            </span>
                            <span className="text-3xl z-10">{occupierCountry.flag}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-black text-white">
                                احتلال {occupierCountry.name} لـ {occupiedCountry.name}
                              </h3>
                              {occ.isHistorical && (
                                <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  احتلال واقعي غاشم
                                </span>
                              )}
                              {hasJointPact && (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                  <Shield className="w-3 h-3 text-emerald-400" /> حلف المصير المشترك مفعل
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              الحاكم العسكري: {occ.militaryGovernor || 'إدارة الاحتلال'} | بدأت الإجراءات منذ الدور {occ.sinceTurn}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold">مستوى المقاومة الشعبية والصمود</div>
                            <div className="text-sm font-black text-emerald-400 flex items-center justify-end gap-1.5">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span>{occ.resistanceLevel}% صمود وبسالة</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Occupied Regions Pill List */}
                      <div>
                        <div className="text-xs text-slate-300 font-bold mb-2 flex items-center gap-1.5">
                          <span>📍 الأقاليم والمقدسات تحت نير الاحتلال:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {occ.occupiedRegions.map((region, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl font-bold flex items-center gap-1"
                            >
                              <span>🚫</span> {region}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* History & Reality Notes */}
                      {occ.historyNotes && occ.historyNotes.length > 0 && (
                        <div className="p-3.5 bg-slate-950/70 border border-white/5 rounded-2xl space-y-1">
                          {occ.historyNotes.map((note, idx) => (
                            <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                              • {note}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Interactive Buttons for the Player */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {/* 1. Stand With Palestine / Joint Destiny Pact */}
                        {!hasJointPact ? (
                          <button
                            onClick={() => onSignJointDestinyPact(occ.occupiedId)}
                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-700/30 active:scale-95"
                          >
                            <HeartHandshake className="w-4 h-4" />
                            <span>عقد حلف المصير المشترك (كأنهم محتليني!)</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>أنت كافل سيادتهم: أي اعتداء عليهم اعتداء مباشر عليك</span>
                            </div>
                            <button
                              onClick={() => onRevokeJointDestinyPact(occ.occupiedId)}
                              className="px-3 py-2 bg-slate-800 hover:bg-red-950/50 hover:text-red-400 border border-white/10 rounded-xl text-xs text-slate-400 transition-all font-bold"
                            >
                              إنهاء الحلف
                            </button>
                          </div>
                        )}

                        {/* 2. Speak on their behalf with the occupier */}
                        <button
                          onClick={() => onOpenDiplomacy(occ.occupierId)}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                          <Megaphone className="w-4 h-4 text-amber-400" />
                          <span>قمة مع {occupierCountry.name} (التحدث نيابة عن {occupiedCountry.name})</span>
                        </button>

                        {/* 3. Send direct military and missile support to the resistance */}
                        <button
                          onClick={() => handleSupportResistance(occ.occupiedId)}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>إمداد المقاومة بالصواريخ والتمويل 🚀</span>
                        </button>

                        {/* 4. Launch liberation war */}
                        <button
                          onClick={() => onLaunchLiberationWar(occ.occupiedId, occ.occupierId)}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95"
                        >
                          <Sword className="w-4 h-4" />
                          <span>إطلاق معركة التحرير الكبرى وطرد الاحتلال</span>
                        </button>

                        {/* If player is the occupier */}
                        {isPlayerOccupier && (
                          <button
                            onClick={() => onLiberateCountry(occ.occupiedId)}
                            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                          >
                            <span>إنهاء احتلالنا ومنح الاستقلال التام 🕊️</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Occupy a New Country */}
          {selectedTab === 'occupy_new' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 bg-gradient-to-l from-red-950/50 via-slate-900 to-slate-950 border border-red-500/30 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400">
                    <Sword className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>إعلان الغزو العسكري وفرض الاحتلال التام على دولة أخرى</span>
                      <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/30">
                        خيار القوة الإمبريالية
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      بإمكانك غزو واحتلال أي دولة معادية، فرض الحكم العسكري عليها، مصادرة أسلحتها، وجني إتاوات وضريبة احتلال تنعش اقتصادك
                      في كل دور. انتبه: الاحتلال يولد مقاومة مستمرة وقد يستدرج عقوبات وتدخلات دولية إن لم تكن تملك الردع الكافي!
                    </p>
                  </div>
                </div>
              </div>

              {/* Selector */}
              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                <label className="text-xs font-bold text-slate-300 block">
                  🎯 اختر الدولة المراد فرض السيطرة والاحتلال العسكري عليها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableToOccupy.map((co) => {
                    const isSelected = selectedTargetToOccupy === co.id;
                    const isAtWar = gameState.wars.some(
                      (w) =>
                        (w.attackerId === playerCountry.id && w.defenderId === co.id) ||
                        (w.attackerId === co.id && w.defenderId === playerCountry.id)
                    );

                    return (
                      <button
                        key={co.id}
                        onClick={() => setSelectedTargetToOccupy(co.id)}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-red-950/60 border-red-500 shadow-lg shadow-red-950/50'
                            : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{co.flag}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{co.name}</div>
                            <div className="text-[10px] text-slate-400">
                              جيش: {co.stats.military}% | اقتصاد: {co.stats.economy}B$
                            </div>
                          </div>
                        </div>

                        {isAtWar && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full">
                            في حرب
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedTargetToOccupy && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-slate-300">
                      الدولة المحددة:{' '}
                      <strong className="text-white">
                        {gameState.countries.find((c) => c.id === selectedTargetToOccupy)?.name}
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        onOccupyCountry(selectedTargetToOccupy);
                        setSelectedTargetToOccupy('');
                        setSelectedTab('my_occupations');
                      }}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
                    >
                      <Sword className="w-4 h-4" />
                      <span>بدء الغزو وإعلان الاحتلال العسكري 🪖</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Player's Own Occupations */}
          {selectedTab === 'my_occupations' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>الدول والمناطق الخاضعة لحكمك العسكري المباشر:</span>
              </h4>

              {occupations.filter((o) => o.occupierId === playerCountry.id && o.status === 'active').length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 border border-white/5 rounded-3xl space-y-3">
                  <Globe2 className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-400">لا توجد دول تحت احتلالك العسكري حالياً</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    بإمكانك التوجه لتبويب "فرض الاحتلال العسكري" لإخضاع خصومك وغزو أراضيهم، أو التركيز على نصرة المظلومين وتحرير فلسطين.
                  </p>
                </div>
              ) : (
                occupations
                  .filter((o) => o.occupierId === playerCountry.id && o.status === 'active')
                  .map((occ) => {
                    const occupiedCountry = gameState.countries.find((c) => c.id === occ.occupiedId);
                    if (!occupiedCountry) return null;

                    return (
                      <div
                        key={occ.id}
                        className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{occupiedCountry.flag}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{occupiedCountry.name} (دولة محتلة)</h4>
                            <p className="text-xs text-slate-400">
                              ضريبة الاحتلال المستقطعة: +{occ.occupationTax}B$ لكل دور | مستوى المقاومة: {occ.resistanceLevel}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onLiberateCountry(occ.occupiedId)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow"
                          >
                            إنهاء الاحتلال وتحرير الدولة 🕊️
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            الحلف السيادي يضمن التدخل التلقائي ورد العدوان فور وقوعه
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

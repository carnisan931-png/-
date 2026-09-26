import React, { useState, useEffect, useRef } from "react";
import { 
  X, Send, Sparkles, Shield, AlertTriangle, 
  Handshake, Globe, DollarSign, Building2, User, ChevronDown, 
  Flame, CheckCircle2, RotateCcw, MessageSquare, FileText, Radio
} from "lucide-react";
import { Country, CabinetMember, GameState, War, Truce } from "../types";
import { 
  ChatMessage, 
  sendDiplomaticMessage, 
  DiplomaticPromptContext 
} from "../lib/geminiDiplomacy";
import { HORMUZ_PROTESTS_DATA } from "../data/hormuzReactions";

interface DiplomaticDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCountry: Country;
  targetCountry: Country;
  initialMinister?: CabinetMember | null;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  addNews: (message: string, type: 'war' | 'diplomacy' | 'economy' | 'disaster' | 'info' | 'research') => void;
}

export const DiplomaticDiscussionModal: React.FC<DiplomaticDiscussionModalProps> = ({
  isOpen,
  onClose,
  playerCountry,
  targetCountry,
  initialMinister,
  gameState,
  setGameState,
  addNews,
}) => {
  const [targetType, setTargetType] = useState<'leader' | 'minister'>(
    initialMinister ? 'minister' : 'leader'
  );
  const [selectedMinisterId, setSelectedMinisterId] = useState<string>(
    initialMinister?.id || (targetCountry.cabinet?.[0]?.id || '')
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<'friendly' | 'cautious' | 'hostile' | 'respectful' | 'furious' | 'pragmatic'>('pragmatic');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedMinister = targetCountry.cabinet?.find(m => m.id === selectedMinisterId);

  const isAtWar = gameState.wars.some(
    w => (w.attackerId === playerCountry.id && w.defenderId === targetCountry.id) ||
         (w.attackerId === targetCountry.id && w.defenderId === playerCountry.id)
  );

  const isAllied = (playerCountry.stats.alliances || []).includes(targetCountry.id) ||
                   (targetCountry.stats.alliances || []).includes(playerCountry.id);

  const isSanctioned = (playerCountry.stats.sanctions || []).includes(targetCountry.id) ||
                       (targetCountry.stats.sanctions || []).includes(playerCountry.id);

  // Initialize greeting on open or target change
  useEffect(() => {
    if (!isOpen) return;

    if (initialMinister) {
      setTargetType('minister');
      setSelectedMinisterId(initialMinister.id);
    }

    const speakerName = targetType === 'leader' 
      ? `رئيس ${targetCountry.name} والقيادة العليا` 
      : (selectedMinister?.name || `وزير في ${targetCountry.name}`);
    const speakerRole = targetType === 'leader' 
      ? `رئيس الدولة والقيادة التنفيذية` 
      : (selectedMinister?.role || `الحقيبة الوزارية`);

    let initialGreeting = "";
    if (isAtWar) {
      initialGreeting = `خط الاتصال الدبلوماسي المشفر مفتوح وسط استمرار العمليات العسكرية. إن قيادة ${targetCountry.name} مستعدة للاستماع إلى ما لديكم من شروط أو مقترحات.`;
    } else if (isAllied) {
      initialGreeting = `أهلاً بالحلفاء في ${playerCountry.name}. خط الاتصال السيادي المباشر جاهز لبحث كافة سبل التعاون وتنسيق السياسات المشتركة.`;
    } else {
      initialGreeting = `مرحباً بقيادة ${playerCountry.name}. نسعد بفتح هذه الجلسة الدبلوماسية الرسمية لمناقشة القضايا الثنائية والمصالح المشتركة بين بلدينا.`;
    }

    setMessages([
      {
        id: 'msg-init',
        sender: 'target',
        senderName: speakerName,
        senderRole: speakerRole,
        senderFlag: targetCountry.flag,
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        mood: isAtWar ? 'cautious' : isAllied ? 'friendly' : 'pragmatic'
      }
    ]);
  }, [isOpen, targetCountry.id, targetType, selectedMinisterId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputMessage.trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-player-${Date.now()}`,
      sender: 'player',
      senderName: `قيادة ${playerCountry.name}`,
      senderRole: 'الرئيس والحكومة',
      senderFlag: playerCountry.flag,
      text: content,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context: DiplomaticPromptContext = {
        playerCountry,
        targetCountry,
        targetType,
        minister: targetType === 'minister' ? selectedMinister : undefined,
        isAtWar,
        isAllied,
        isSanctioned,
        straitOfHormuzClosed: gameState.straitOfHormuzClosed,
        turn: gameState.turn,
        history: newHistory,
        message: content,
      };

      const aiResponse = await sendDiplomaticMessage(context);

      const targetMsg: ChatMessage = {
        id: `msg-target-${Date.now()}`,
        sender: 'target',
        senderName: targetType === 'leader' 
          ? `رئيس ${targetCountry.name}` 
          : (selectedMinister?.name || 'الوزير'),
        senderRole: targetType === 'leader' 
          ? 'القيادة العليا' 
          : (selectedMinister?.role || 'الوزارة'),
        senderFlag: targetCountry.flag,
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        mood: aiResponse.mood,
        agreementOffer: aiResponse.agreementOffer ? {
          ...aiResponse.agreementOffer,
          applied: false
        } : undefined
      };

      setMessages(prev => [...prev, targetMsg]);
      if (aiResponse.mood) {
        setCurrentMood(aiResponse.mood);
      }
    } catch (err) {
      console.error("Error during diplomatic discussion:", err);
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'target',
        senderName: targetType === 'leader' ? targetCountry.name : (selectedMinister?.name || 'الوزير'),
        senderRole: 'القناة الدبلوماسية',
        senderFlag: targetCountry.flag,
        text: `تم استلام البرقية السيادية من طرفكم وسنقوم بدراستها في مجلس الوزراء لاتخاذ الموقف المناسب.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        mood: 'pragmatic'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign and execute agreed treaties
  const handleApplyAgreement = (messageId: string, offer: NonNullable<ChatMessage['agreementOffer']>) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.agreementOffer) {
        return {
          ...m,
          agreementOffer: {
            ...m.agreementOffer,
            applied: true
          }
        };
      }
      return m;
    }));

    // Apply game mechanics
    if (offer.type === 'truce') {
      // End war and establish truce
      setGameState(prev => {
        const nextWars = prev.wars.filter(
          w => !(
            (w.attackerId === playerCountry.id && w.defenderId === targetCountry.id) ||
            (w.attackerId === targetCountry.id && w.defenderId === playerCountry.id)
          )
        );
        const nextTruces: Truce[] = [
          ...(prev.truces || []),
          {
            countryA: playerCountry.id,
            countryB: targetCountry.id,
            endTurn: prev.turn + 10
          }
        ];
        return {
          ...prev,
          wars: nextWars,
          truces: nextTruces
        };
      });
      addNews(
        `🕊️ [معاهدة دبلوماسية] تم التوصل لاتفاق هدنة ووقف إطلاق النار رسمياً بين ${playerCountry.name} و ${targetCountry.name} إثر مباحثات القمة المباشرة!`,
        'diplomacy'
      );
    } else if (offer.type === 'alliance') {
      // Add mutual alliances
      setGameState(prev => ({
        ...prev,
        countries: prev.countries.map(c => {
          if (c.id === playerCountry.id) {
            const nextAlliances = Array.from(new Set([...(c.stats.alliances || []), targetCountry.id]));
            return { ...c, stats: { ...c.stats, alliances: nextAlliances } };
          }
          if (c.id === targetCountry.id) {
            const nextAlliances = Array.from(new Set([...(c.stats.alliances || []), playerCountry.id]));
            return { ...c, stats: { ...c.stats, alliances: nextAlliances } };
          }
          return c;
        })
      }));
      addNews(
        `🤝 [حلف استراتيجي] وقعت دولة ${playerCountry.name} معاهدة دفاع مشترك وتحالف عسكري شامل مع ${targetCountry.name} بعد جولة مفاوضات تاريخية!`,
        'diplomacy'
      );
    } else if (offer.type === 'trade') {
      // Economic boost + lift sanctions
      setGameState(prev => ({
        ...prev,
        countries: prev.countries.map(c => {
          if (c.id === playerCountry.id) {
            const nextSanctions = (c.stats.sanctions || []).filter(id => id !== targetCountry.id);
            return {
              ...c,
              stats: {
                ...c.stats,
                economy: c.stats.economy + 15,
                happiness: Math.min(100, (c.stats.happiness || 50) + 5),
                sanctions: nextSanctions
              }
            };
          }
          if (c.id === targetCountry.id) {
            const nextSanctions = (c.stats.sanctions || []).filter(id => id !== playerCountry.id);
            return {
              ...c,
              stats: {
                ...c.stats,
                economy: c.stats.economy + 15,
                happiness: Math.min(100, (c.stats.happiness || 50) + 5),
                sanctions: nextSanctions
              }
            };
          }
          return c;
        })
      }));
      addNews(
        `💰 [اتفاقية اقتصادية] إبرام صفقة تجارية واستثمارية كبرى بين ${playerCountry.name} و ${targetCountry.name} تضخ 15B$ في اقتصاد البلدين وترفع العقوبات!`,
        'economy'
      );
    } else if (offer.type === 'non_aggression') {
      // Prisoner exchange / calming
      setGameState(prev => ({
        ...prev,
        captives: (prev.captives || []).map(cap => {
          if (cap.countryId === targetCountry.id || cap.countryId === playerCountry.id) {
            return { ...cap, status: 'exchanged' as const };
          }
          return cap;
        })
      }));
      addNews(
        `⛓️ [صفقة تبادل أسرى] نجاح المحادثات الدبلوماسية مع ${targetCountry.name} في إبرام صفقة تبادل أسرى شاملة وتخفيف التوتر الأمني!`,
        'diplomacy'
      );
    } else if (offer.type === 'close_hormuz') {
      // Close Strait of Hormuz + trigger massive international rage and excuses
      setGameState(prev => {
        const protestNews = HORMUZ_PROTESTS_DATA.map(p => ({
          id: `news-hormuz-${p.countryId}-${Date.now()}-${Math.random()}`,
          turn: prev.turn,
          message: `🚨 [احتجاج واعتراض دولي] ${p.countryName} (${p.flag}): "${p.officialStatement}" | الحجة: ${p.pretext}`,
          type: 'war' as const
        }));

        const emergencyBannerNews = {
          id: `news-hormuz-main-${Date.now()}`,
          turn: prev.turn,
          message: `🛑 [أزمة الطاقة العالمية] استجابت إيران لطلب ${playerCountry.name} وأغلقت مضيق هرمز بالكامل! ثوران واحتجاجات عاصفة في واشنطن وبكين والرياض وبرلين وطوكيو وتل أبيب مع تلويح بضربات عسكرية وكسر الحصار!`,
          type: 'war' as const
        };

        const updatedCountries = prev.countries.map(c => {
          const protestData = HORMUZ_PROTESTS_DATA.find(p => p.countryId === c.id);
          if (protestData) {
            return {
              ...c,
              stats: {
                ...c.stats,
                economy: Math.max(10, c.stats.economy - protestData.economicDamageB),
                happiness: Math.max(5, (c.stats.happiness || 50) - 20)
              }
            };
          }
          return c;
        });

        return {
          ...prev,
          straitOfHormuzClosed: true,
          countries: updatedCountries,
          news: [emergencyBannerNews, ...protestNews, ...prev.news].slice(0, 50)
        };
      });

      addNews(
        `🛑 [إغلاق مضيق هرمز] أعلنت إيران رسمياً تنفيذ قرار إغلاق مضيق هرمز بعد مباحثات القمة، ودول العالم تحتج وتتحجج بشلل مصالحها وتتوعد بالرد الحازم!`,
        'war'
      );
    } else if (offer.type === 'open_hormuz') {
      // Reopen Hormuz
      setGameState(prev => ({
        ...prev,
        straitOfHormuzClosed: false,
        news: [
          {
            id: `news-hormuz-open-${Date.now()}`,
            turn: prev.turn,
            message: `🌊 [انفراجة دولية] وافقت إيران على إعادة فتح مضيق هرمز واستئناف تدفقات النفط والملاحة العالمية بعد التوصل لتفاهمات دبلوماسية!`,
            type: 'diplomacy' as const
          },
          ...prev.news
        ].slice(0, 50)
      }));
      addNews(
        `🌊 [إعادة فتح مضيق هرمز] إعادة فتح المضيق وارتياح في أسواق الطاقة العالمية وتراجع حدة التوتر العسكري.`,
        'diplomacy'
      );
    } else if (offer.type === 'joint_destiny') {
      // Joint Destiny Pact with Palestine or occupied brother country
      setGameState(prev => {
        const existingPacts = prev.jointDestinyPacts || [];
        const filtered = existingPacts.filter(p => p.protectedId !== targetCountry.id);
        const newPact = {
          id: `joint-destiny-${Date.now()}`,
          sponsorId: playerCountry.id,
          protectedId: targetCountry.id,
          sinceTurn: prev.turn,
          commitmentLevel: 'existential' as const,
          autoRetaliate: true,
          jointDefenseShield: true,
          resistanceSupport: true,
          pactTitle: offer.title
        };

        return {
          ...prev,
          jointDestinyPacts: [...filtered, newPact],
          countries: prev.countries.map(c => {
            if (c.id === targetCountry.id) {
              return {
                ...c,
                stats: {
                  ...c.stats,
                  alliances: Array.from(new Set([...c.stats.alliances, playerCountry.id])),
                  missiles: (c.stats.missiles || 0) + 15,
                  happiness: Math.min(100, c.stats.happiness + 35)
                }
              };
            }
            if (c.id === playerCountry.id) {
              return {
                ...c,
                stats: {
                  ...c.stats,
                  alliances: Array.from(new Set([...c.stats.alliances, targetCountry.id])),
                  happiness: Math.min(100, c.stats.happiness + 20)
                }
              };
            }
            return c;
          }),
          news: [
            {
              id: `news-destiny-${Date.now()}`,
              turn: prev.turn,
              message: `🤝🇵🇸 [توقيع ميثاق المصير المشترك التاريخي] تم التوقيع رسمياً بين ${playerCountry.name} و ${targetCountry.name}! أعلنت القيادة أن "أرضهم أرضنا، وأي اعتداء أو قصف يطالهم يُعد اعتداءً مباشراً على عاصمتنا وسيادتنا الوطنية"، مع تفعيل مظلة الدفاع والردع الصاروخي المشترك!`,
              type: 'diplomacy' as const
            },
            ...prev.news
          ].slice(0, 50)
        };
      });

      addNews(
        `🤝🇵🇸 أعلن ${playerCountry.name} حلف المصير المشترك وكفالة الدفاع عن ${targetCountry.name}: أي اعتداء عليهم كأنه اعتداء عليا!`,
        'diplomacy'
      );
    }

    const confirmMsg: ChatMessage = {
      id: `msg-confirm-${Date.now()}`,
      sender: 'system',
      senderName: 'بروتوكول المعاهدات الدولية',
      senderRole: 'توثيق رسمي',
      senderFlag: '📜',
      text: `✅ تم تصديق وتوقيع "${offer.title}" وتفعيل كافة بنوده السيادية في شؤون الدولة بنجاح!`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  const quickTopics = [
    ...(targetCountry.id === 'palestine'
      ? [
          { label: "إعلان حلف المصير المشترك 🇵🇸🤝", prompt: "نعلن أمام العالم حلف المصير المشترك معكم: أرضكم أرضنا وعرضكم عرضنا، وأي اعتداء إسرائيلي أو معادٍ عليكم هو اعتداء مباشر على عاصمتنا!" },
          { label: "فتح جسر جوي للتسليح والصواريخ 🚀📦", prompt: "نضع مستودعاتنا العسكرية والصاروخية في خدمتكم لدعم صمود المقاومة في غزة والقدس والضفة وردع طائرات الاحتلال!" },
          { label: "تنسيق خطة معركة التحرير الكبرى ⚔️", prompt: "نقترح تنسيق غرف العمليات المشتركة لبدء الاستعدادات الحاسمة لدحر قوات الاحتلال وإنهاء السيطرة العسكرية الصهيونية!" },
          { label: "تسيير قوافل الإغاثة وكسر الحصار 🚢", prompt: "نعتزم تسيير قوافل إمداد بحرية وبرية عاجلة لكسر الحصار وتقديم مساعدات إنسانية بمليارات الدولارات لأهلنا الصامدين." }
        ]
      : []
    ),
    ...(targetCountry.id === 'israel'
      ? [
          { label: "المطالبة بالانسحاب الفوري من فلسطين 🇵🇸✌️", prompt: "بصفتنا كافلين للسيادة الفلسطينية (كأنهم محتليني): نأمركم بالانسحاب الفوري والشامل من القدس الشرقية والضفة وغزة وتفكيك المستوطنات فوراً!" },
          { label: "إنذار: أي اعتداء على فلسطين اعتداء عليا! 🛡️💥", prompt: "نحذركم رسمياً وبلهجة قاطعة: أي غارة أو قصف صاروخي أو اجتياح للأراضي الفلسطينية سنعتبره هجوماً مباشراً على عاصمتنا وسندمر قواعدكم فوراً!" },
          { label: "المطالبة بفك حصار غزة وإطلاق الأسرى ⛓️", prompt: "نطالبكم بالرفع الفوري والشامل للحصار عن قطاع غزة، ووقف الاغتيالات، والإفراج الفوري عن كافة الأسرى والمعتقلين في سجونكم!" },
          { label: "دفع تعويضات إعادة الإعمار والاعتذار 🏛️", prompt: "نطالبكم بدفع تعويضات حرب وإعادة إعمار بقيمة 50 مليار دولار للشعب الفلسطيني عن الدمار وتقديم اعتذار رسمي دولي!" }
        ]
      : []
    ),
    ...(targetCountry.id === 'iran' 
      ? (!gameState.straitOfHormuzClosed 
          ? [{ label: "إقناع إيران بإغلاق مضيق هرمز 🛑🌊", prompt: "نقترح على القيادة الإيرانية إغلاق مضيق هرمز فوراً للضغط على القوى العالمية وقطع خطوط إمداد الطاقة وفرض الشروط السيادية!" }]
          : [{ label: "اقتراح إعادة فتح مضيق هرمز 🌊🕊️", prompt: "نقترح على القيادة الإيرانية إعادة فتح مضيق هرمز لخفض التوتر الدولي والتوصل لتسوية سياسية بعد تحقيق المكاسب." }]
        )
      : (gameState.straitOfHormuzClosed 
          ? [{ label: "الرد على اعتراضاتكم حول هرمز 🛡️", prompt: "نناقش معكم أزمة إغلاق مضيق هرمز ومخاوفكم بشأن أسعار الطاقة وإمدادات الوقود، ونبحث شروط التهدئة." }]
          : []
        )
    ),
    { label: "طلب هدنة فورية 🕊️", prompt: "نطالبكم بوقف فوري لإطلاق النار وعقد هدنة رسمية تضمن أمن الطرفين وحقن الدماء." },
    { label: "عرض صفقة اقتصادية 💰", prompt: "نقترح إبرام صفقة تجارية وتبادل استثماري بقيمة 15 مليار دولار وفتح الموانئ والأسواق المشتركة." },
    { label: "اقتراح تحالف عسكري 🤝", prompt: "نعرض عليكم تشكيل حلف عسكري استراتيجي ومعاهدة دفاع مشترك لردع التهديدات الإقليمية." },
    { label: "تحذير وإنذار أخير ⚠️", prompt: "نوجه إليكم إنذاراً سيادياً حازماً: أي تصعيد عسكري أو انتهاك لسيادتنا سيقابل برد مدمر لا هوادة فيه!" },
    { label: "مفاوضات تبادل الأسرى ⛓️", prompt: "ندعوكم لبدء مفاوضات عاجلة لإجراء صفقة تبادل شاملة للأسرى والرموز السيادية المحتجزة." },
    { label: "شراكة الطاقة والموارد ⛽", prompt: "نبحث معكم تعزيز إمدادات النفط والغاز والمعادن الاستراتيجية وتأمين الممرات البحرية المشتركة." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-right" dir="rtl">
      <div className="bg-slate-950 border-2 border-emerald-500/30 rounded-3xl w-full max-w-4xl h-[92vh] max-h-[850px] flex flex-col shadow-2xl shadow-emerald-950/40 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
              {targetCountry.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  قمة ومحادثات سيادية مع {targetCountry.name}
                </h2>
                {isAtWar && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Flame className="w-3 h-3" /> حالة حرب
                  </span>
                )}
                {isAllied && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Handshake className="w-3 h-3" /> حليف استراتيجي
                  </span>
                )}
                {isSanctioned && (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> عقوبات
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>اقتصاد: {targetCountry.stats.economy}B$</span>
                <span>•</span>
                <span>قوة عسكرية: {targetCountry.stats.military}%</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-ping" /> قناة دبلوماسية مشفرة
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages(prev => prev.slice(0, 1));
              }}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
              title="إعادة بدء جلسة المفاوضات"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">تصفير الحوار</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl border border-white/5 transition-all cursor-pointer"
              title="إغلاق المحادثة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Target Switcher: Head of State OR Select from 25 Cabinet Ministers */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetType('leader')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                targetType === 'leader'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-md shadow-amber-950/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الرئيس / الملك (القيادة العليا)</span>
            </button>

            <button
              onClick={() => setTargetType('minister')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                targetType === 'minister'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>وزراء الحكومة ({targetCountry.cabinet?.length || 25} وزيراً)</span>
            </button>
          </div>

          {targetType === 'minister' && targetCountry.cabinet && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">اختر الوزير:</span>
              <select
                value={selectedMinisterId}
                onChange={(e) => setSelectedMinisterId(e.target.value)}
                className="bg-slate-950 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-emerald-400 w-full sm:w-72 font-sans font-bold cursor-pointer"
              >
                {targetCountry.cabinet.map((m, idx) => (
                  <option key={m.id} value={m.id}>
                    {idx + 1}. {m.role} - {m.name} {m.status === 'kidnapped' ? '🚨 (مختطف)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Current Interlocutor Summary Banner */}
        <div className="px-4 py-2 bg-slate-900/30 border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>
              أنت تتناقش الآن مع:{" "}
              <strong className="text-white font-bold">
                {targetType === 'leader' 
                  ? `الرئيس والقيادة التنفيذية لـ ${targetCountry.name}` 
                  : `${selectedMinister?.role} (${selectedMinister?.name})`}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500">مزاج المفاوض:</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              currentMood === 'friendly' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              currentMood === 'hostile' || currentMood === 'furious' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              currentMood === 'cautious' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {currentMood === 'friendly' ? 'ودود ومنفتح 💚' :
               currentMood === 'hostile' ? 'متعنت وعدائي 💔' :
               currentMood === 'furious' ? 'غاضب وحازم 🔥' :
               currentMood === 'cautious' ? 'حذر ومتحفظ 🛡️' :
               currentMood === 'respectful' ? 'محترم وحليف 🤝' :
               'براغماتي وحسابي ⚖️'}
            </span>
          </div>
        </div>

        {/* Chat Transcript Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-950/60">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2 rounded-2xl max-w-lg text-center font-bold flex items-center gap-2 shadow-sm">
                    <span>{msg.senderFlag}</span>
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            const isPlayer = msg.sender === 'player';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isPlayer ? 'flex-row' : 'flex-row-reverse'} items-start`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 border ${
                  isPlayer 
                    ? 'bg-blue-950/40 border-blue-500/30 text-blue-300' 
                    : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                }`}>
                  {msg.senderFlag}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-2 border text-right ${
                  isPlayer
                    ? 'bg-blue-600/15 border-blue-500/30 text-slate-100 rounded-tr-sm'
                    : 'bg-slate-900/90 border-white/10 text-slate-100 rounded-tl-sm shadow-lg'
                }`}>
                  <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1.5 text-[11px]">
                    <span className={`font-bold ${isPlayer ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {msg.senderName} <span className="text-[10px] text-slate-500 font-normal">({msg.senderRole})</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-200">
                    {msg.text}
                  </p>

                  {/* Interactive Agreement Offer Card */}
                  {msg.agreementOffer && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="p-3.5 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl space-y-2 text-right">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            {msg.agreementOffer.title}
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            عرض رسمي ملزم
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          {msg.agreementOffer.description}
                        </p>
                        {msg.agreementOffer.terms && (
                          <div className="text-[11px] text-slate-400 bg-black/30 p-2 rounded-xl border border-white/5 font-mono">
                            📜 الشروط: {msg.agreementOffer.terms}
                          </div>
                        )}

                        <div className="pt-2 flex gap-2">
                          {msg.agreementOffer.applied ? (
                            <div className="w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-emerald-500/30">
                              <CheckCircle2 className="w-4 h-4" /> تم التصديق والتوقيع وتفعيل الاتفاق
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApplyAgreement(msg.id, msg.agreementOffer!)}
                              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" /> توقيع والتزام بالمعاهدة فوراً ✍️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 flex-row-reverse items-start">
              <div className="w-9 h-9 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
                {targetCountry.flag}
              </div>
              <div className="bg-slate-900 border border-white/10 rounded-3xl rounded-tl-sm p-4 text-xs text-slate-400 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>جاري صياغة وتشفير الرد الدبلوماسي الرسمي عبر الأقمار السيادية...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Diplomatic Agendas / Proposals Chips */}
        <div className="px-4 py-2 bg-slate-900/80 border-t border-white/5 overflow-x-auto custom-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">مقترحات سريعة:</span>
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.prompt)}
              disabled={isLoading}
              className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border border-white/5 hover:border-emerald-500/30 disabled:opacity-50 cursor-pointer"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Message Input & Send Control */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`اكتب رسالتك أو اقتراحك أو إنذارك إلى ${targetType === 'leader' ? `رئيس ${targetCountry.name}` : selectedMinister?.role}...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-white/10 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-l from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/30 active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>إرسال برقية</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default DiplomaticDiscussionModal;

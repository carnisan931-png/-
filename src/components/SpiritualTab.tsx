import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  DollarSign,
  Shield,
  Trophy,
  Activity,
  Building2,
  Users,
  Flame,
  Newspaper,
  Clock,
  BookOpen,
  Compass,
  ArrowRight,
} from "lucide-react";
import { cn } from "../lib/utils";

// Quranic Verses list for the spiritual department
export const QURAN_VERSES = [
  {
    id: "quran_safety",
    surah: "سورة البقرة، الآية 126",
    text: "رَبِّ اجْعَلْ هَٰذَا بَلَدًا آمِنًا وَارْزُقْ أَهْلَهُ مِنَ الثَّمَرَاتِ",
    benefits: "تنزيل السكينة الشعبية والبركة في ربوع الوطن، رفع السعادة والرضا العام بمقدار +6% وزيادة تماسك واستقرار الدولة بمقدار +5%.",
    bonusText: "رفع سعادة الشعب بمقدار +6%، ومستوى الاستقرار بمقدار +5%.",
    apply: (playerStats: any) => ({
      ...playerStats,
      happiness: Math.min(100, playerStats.happiness + 6),
      stability: Math.min(100, (playerStats.stability ?? 80) + 5)
    }),
    broadcastMessage: "🕌 [آية الطمأنينة والأمان] بثّت وسائل التعليم والإرشاد الوطنية آية البركة: {رَبِّ اجْعَلْ هَٰذَا بَلَدًا آمِنًا وَارْزُقْ أَهْلَهُ} لتعزيز الطمأنينة وحب الأوطان في كافة المناطق والبلاد."
  },
  {
    id: "quran_victory",
    surah: "سورة يوسف، الآية 21",
    text: "وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ",
    benefits: "شحن همم ومعنويات المقاتلين والجنود على ثغور وجبهات الوطن لتعزيز القدرات العسكرية والدفاعية للدولة بمقدار +5 نقاط.",
    bonusText: "رفع الجاهزية والقوة العسكرية الوطنية بمقدار +5 نقاط.",
    apply: (playerStats: any) => ({
      ...playerStats,
      military: Math.min(100, playerStats.military + 5)
    }),
    broadcastMessage: "🕌 [آية اليقين والنصر السيادي] بأمر القيادة العليا، بُثّت آية النصر المؤزر: {وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ} في المعسكرات وعند النقاط الحدودية لبث روح الفداء وتثبيت أقدام حماة الوطن."
  },
  {
    id: "quran_provision",
    surah: "سورة قريش، الآية 4",
    text: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
    benefits: "مباركة الأنشطة والتبادلات التجارية والصناعية الوطنية ومكافحة الأزمات المعيشية ليرتفع الناتج والوفر الاقتصادي بمقدار +6B$.",
    bonusText: "إيداع +6B مليار دولار بركة في خزينة ميزانية الدولة الاقتصادية.",
    apply: (playerStats: any) => ({
      ...playerStats,
      economy: playerStats.economy + 6,
      stability: Math.min(100, (playerStats.stability ?? 80) + 3)
    }),
    broadcastMessage: "🕌 [آية الرزق ورغد العيش] دشّنت الهيئات الاقتصادية أعمالها بآية البركة والرخاء: {الَّذِي أَطْعَمَهُم مِّن جُوعٍ} تيمناً بمسيرة التنمية السيادية وتوفير الخيرات لأبناء الوطن المخلصين."
  },
  {
    id: "quran_conspiracy",
    surah: "سورة الأنفال، الآية 30",
    text: "وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ ۖ وَاللَّهُ خَيْرُ الْمَاكِرِينَ",
    benefits: "تمتين درع الأمان القومي والمخابراتي الوقائي لكشف خلايا العدو وعمليات التخريب، وزيادة جاهزية الدفاع الجوي بمقدار +6 نقاط.",
    bonusText: "رفع قدرات الدفاع الجوي الوطني بمقدار +6 نقاط سيادية.",
    apply: (playerStats: any) => ({
      ...playerStats,
      airDefense: Math.min(100, (playerStats.airDefense || 50) + 6)
    }),
    broadcastMessage: "🕌 [آية كشف المكايد والتحصين] بثّت منصات الدفاع السيادية والأمنية آية الوقاية: {وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ} لتمتين الصف الداخلي وتوجيه ضربة قاصمة للجواسيس والمخربين في الظل."
  },
  {
    id: "quran_unity",
    surah: "سورة آل عمران، الآية 103",
    text: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا",
    benefits: "ترسيخ أواصر التلاحم والوحدة واللحمة الاجتماعية بين أفراد الشعب وإخماد الفتن والصراعات الفئوية ليزيد الاستقرار بمقدار +8%.",
    bonusText: "رفع مستوى الاستقرار الداخلي وحصانة المجتمع بمقدار +8%.",
    apply: (playerStats: any) => ({
      ...playerStats,
      stability: Math.min(100, (playerStats.stability ?? 80) + 8)
    }),
    broadcastMessage: "🕌 [آية اللحمة والاعتصام الوطني] عمّمت الشؤون الدينية نداء التآخي والوحدة بآية: {وَاعْتَصِمُوا بِحَبْلِ اللَّهِ} على سائر المنابر لتقوية نسيجنا الاجتماعي ودفع دعاة الفرقة والشقاق."
  }
];

// National Supplications list for the spiritual department
export const NATIONAL_SUPPLICATIONS = [
  {
    id: "supp_leaders",
    title: "دعاء ولاة الأمر والبطانة الصالحة والرشاد",
    text: "اللهم وفّق ولاة أمرنا وقادتنا لما تحب وترضى، وخذ بنواصيهم للبر والتقوى، وهيئ لهم من لدنك بطانةً صالحةً ناصحةً تدلهم على الخير وتعينهم عليه، واجعلهم رحمةً وسنداً لرعيتهم وحصناً لبلادنا العظيمة.",
    benefits: "مباركة القرارات والخطط القيادية، تحسين كفاءة الوزراء والسيادة الوطنية لتزيد الاستقرار بنسبة +5% والسعادة بنسبة +3%.",
    bonusText: "رفع الاستقرار بنسبة +5%، ومستوى السعادة والرضا العام بمقدار +3%.",
    apply: (playerStats: any) => ({
      ...playerStats,
      stability: Math.min(100, (playerStats.stability ?? 80) + 5),
      happiness: Math.min(100, playerStats.happiness + 3)
    }),
    broadcastMessage: "🕌 [مباركة وتأييد للقيادة] تم رفع ونشر الدعاء الوطني للتوفيق والبطانة الناصحة لولاة الأمر في كافة الإذاعات، سائلين المولى عز وجل الرشاد والسداد والتأييد الدائم لخدمة الوطن والملة."
  },
  {
    id: "supp_soldiers",
    title: "دعاء جنودنا البواسل الأبطال المرابطين",
    text: "اللهم احفظ جنودنا المرابطين على حدودنا وثغورنا، وسدد رميهم وثبت أقدامهم، واجمع كلمتهم على الحق، وانصرهم بنصرك المؤزر، واحمِ حماة عقيدتنا وأراضينا بعينك التي لا تنام يا قوي يا عزيز.",
    benefits: "رفع الروح القتالية ومعنويات أفراد القوات المسلحة لتزيد الكفاءة والجاهزية العسكرية بمقدار +5 وتدعيم الدفاع الجوي (+4).",
    bonusText: "رفع القوة العسكرية للبلاد +5 نقاط، ومستوى حماية الدفاع الجوي +4 نقاط.",
    apply: (playerStats: any) => ({
      ...playerStats,
      military: Math.min(100, playerStats.military + 5),
      airDefense: Math.min(100, (playerStats.airDefense || 50) + 4)
    }),
    broadcastMessage: "🕌 [تضامن مع حماة الوطن] أطلق شعبنا الوفي حملة تضرع ودعاء لجنودنا المرابطين البواسل في جبهات القتال والأمن، مما شحن معنويات المرابطين وحمّس الأبطال لبذل الغالي والنفيس صيانة للثغور."
  },
  {
    id: "supp_blessing",
    title: "دعاء البركة العامة والرخاء المالي للوطن",
    text: "اللهم بارك لنا في أرزاقنا وثرواتنا الطبيعية، وأفض علينا نفحات خيرك وبركاتك من السماء والأرض، واجعل بلادنا سخاءً رخاءً، آمنةً مطمئنة، ميسورةً مباركة، وسائر بلاد المسلمين من العوز والفتن.",
    benefits: "طرح البركة في الميزانية والصادرات البترولية والصناعية لرفد ودعم الخزانة العامة فوراً بمقدار وسيولة مالية +8B$.",
    bonusText: "مباركة الموارد المالية وضخ +8B مليار دولار في ميزانية السيادة الوطنية.",
    apply: (playerStats: any) => ({
      ...playerStats,
      economy: playerStats.economy + 8
    }),
    broadcastMessage: "🕌 [دعاء الرخاء ورغد العيش] انطلقت تضرعات البركة والرخاء المالي لتعزيز اقتصادنا الوطني وتعميم مسيرة النمو والتصنيع برزق مبارك يدر الخير على سائر منشآت وربوع وطننا الغالي."
  },
  {
    id: "supp_protection",
    title: "دعاء حفظ المجتمع والتحصين من الفتن والمكاره",
    text: "اللهم ألّف بين قلوبنا، واجمع شملنا على التوحيد والحق، واحمِ وطننا وشعبنا من الشائعات والفتن ما ظهر منها وما بطن، وقِ بلادنا شرور الأوبئة والحروب وحقد الحاسدين وحسد المتربصين بنا يا ذا الجلال والإكرام.",
    benefits: "بناء درع روحي واجتماعي متماسك للشعب ضد الهجمات والشائعات، مما يرفع السعادة بنسبة +7% والاستقرار بنسبة +6%.",
    bonusText: "رفع مستوى السعادة والسرور الوطني بنسبة +7% والاستقرار العام بنسبة +6%.",
    apply: (playerStats: any) => ({
      ...playerStats,
      happiness: Math.min(100, playerStats.happiness + 7),
      stability: Math.min(100, (playerStats.stability ?? 80) + 6)
    }),
    broadcastMessage: "🕌 [دعاء التحصين والتآلف الاجتماعي] تم بث دعاء حفظ الوطن والمجتمع وتوطيد المحبة وألفة القلوب بين المواطنين للوقاية من دعاوى الفرقة والفتن الطائفية والمؤامرات الخارجية المغرضة."
  }
];

interface SpiritualTabProps {
  gameState: any;
  setGameState: React.Dispatch<React.SetStateAction<any>>;
  playerCountry: any;
  addNews: (message: string, type: any) => void;
  spiritualBroadcasts: {
    id: string;
    text: string;
    type: "verse" | "supplication";
    timestamp: number;
    benefits: string;
  }[];
  setSpiritualBroadcasts: React.Dispatch<React.SetStateAction<any[]>>;
  spiritualBlessing: number;
  setSpiritualBlessing: React.Dispatch<React.SetStateAction<number>>;
  customSupplication: string;
  setCustomSupplication: React.Dispatch<React.SetStateAction<string>>;
}

export default function SpiritualTab({
  gameState,
  setGameState,
  playerCountry,
  addNews,
  spiritualBroadcasts,
  setSpiritualBroadcasts,
  spiritualBlessing,
  setSpiritualBlessing,
  customSupplication,
  setCustomSupplication,
}: SpiritualTabProps) {
  const [activeSubSection, setActiveSubSection] = useState<"verses" | "premade" | "custom" | "projects">("verses");
  const [isSuccessBanner, setIsSuccessBanner] = useState<string | null>(null);

  const triggerSuccess = (msg: string) => {
    setIsSuccessBanner(msg);
    setTimeout(() => {
      setIsSuccessBanner(null);
    }, 4500);
  };

  if (!playerCountry) return null;

  // 1. Publish Quranic Verse
  const handlePublishVerse = (verse: typeof QURAN_VERSES[0]) => {
    // Modify country stats with benefits
    setGameState((prev: any) => {
      const nextCountries = prev.countries.map((c: any) => {
        if (c.id === prev.playerCountryId) {
          return {
            ...c,
            stats: verse.apply(c.stats),
          };
        }
        return c;
      });

      return {
        ...prev,
        countries: nextCountries,
        news: [
          {
            id: `spiritual-verse-${Date.now()}`,
            turn: prev.turn,
            message: verse.broadcastMessage,
            type: "info" as const,
          },
          ...prev.news,
        ],
      };
    });

    // Update blessing index and broadcasts history
    setSpiritualBlessing((prev) => Math.min(100, prev + 5));
    setSpiritualBroadcasts((prev) => [
      {
        id: `bcast-${Date.now()}`,
        text: verse.text,
        type: "verse",
        timestamp: Date.now(),
        benefits: verse.bonusText,
      },
      ...prev,
    ]);

    triggerSuccess(`تم بث ونشر الآية الكريمة: {${verse.text}} في وسائل الإعلام والتربية بنجاح، ولقد حظيت الدولة ببركتها!`);
  };

  // 2. Publish Premade Supplication
  const handlePublishSupplication = (supp: typeof NATIONAL_SUPPLICATIONS[0]) => {
    setGameState((prev: any) => {
      const nextCountries = prev.countries.map((c: any) => {
        if (c.id === prev.playerCountryId) {
          return {
            ...c,
            stats: supp.apply(c.stats),
          };
        }
        return c;
      });

      return {
        ...prev,
        countries: nextCountries,
        news: [
          {
            id: `spiritual-supp-${Date.now()}`,
            turn: prev.turn,
            message: supp.broadcastMessage,
            type: "info" as const,
          },
          ...prev.news,
        ],
      };
    });

    setSpiritualBlessing((prev) => Math.min(100, prev + 5));
    setSpiritualBroadcasts((prev) => [
      {
        id: `bcast-${Date.now()}`,
        text: supp.text,
        type: "supplication",
        timestamp: Date.now(),
        benefits: supp.bonusText,
      },
      ...prev,
    ]);

    triggerSuccess(`تم بث ونشر الدعاء السيادي: "${supp.title}" في سائر أنحاء البلاد ليعم التلاحم والخير والبركة!`);
  };

  // 3. Publish Custom Supplication
  const handlePublishCustom = (focus: "happiness" | "military" | "economy") => {
    if (!customSupplication.trim() || customSupplication.trim().length < 8) {
      addNews("يرجى كتابة دعاء وطني لائق وواضح لا يقل عن 8 أحرف للبث المباشر.", "info");
      return;
    }

    const prayerText = customSupplication.trim();

    setGameState((prev: any) => {
      const nextCountries = prev.countries.map((c: any) => {
        if (c.id === prev.playerCountryId) {
          const stats = { ...c.stats };
          if (focus === "happiness") stats.happiness = Math.min(100, stats.happiness + 5);
          if (focus === "military") stats.military = Math.min(100, stats.military + 4);
          if (focus === "economy") stats.economy = stats.economy + 5;
          return { ...c, stats };
        }
        return c;
      });

      return {
        ...prev,
        countries: nextCountries,
        news: [
          {
            id: `spiritual-custom-${Date.now()}`,
            turn: prev.turn,
            message: `🕌 [بث دعاء سيادي مخصص] نشرت قيادتنا الحكيمة ومجلس الدولة دعاءً مخصصاً للوطن: "${prayerText}" وقد لهجت ألسنة المواطنين بالتأمين والوفاء، مما عزز اللحمة الوطنية!`,
            type: "info" as const,
          },
          ...prev.news,
        ],
      };
    });

    const focusText =
      focus === "happiness"
        ? "رفع رضا وسعادة الشعب بمقدار +5%"
        : focus === "military"
        ? "زيادة حماسة وقوة الجيش بمقدار +4 نقاط"
        : "زيادة بركة ميزانية الدولة وتسييل +5B$ في الخزينة";

    setSpiritualBlessing((prev) => Math.min(100, prev + 6));
    setSpiritualBroadcasts((prev) => [
      {
        id: `bcast-${Date.now()}`,
        text: prayerText,
        type: "supplication",
        timestamp: Date.now(),
        benefits: focusText,
      },
      ...prev,
    ]);

    setCustomSupplication("");
    triggerSuccess("عاش الوطن! تم بث دعاءك الوطني المخصص وبثه لكافة المنشآت بنجاح ومباركة!");
  };

  // 4. Spiritual Endowment Project
  const handleLaunchProject = (projType: "quran" | "mosque" | "academy") => {
    let cost = 0;
    let projName = "";
    let effectMessage = "";
    let applyStats = (stats: any) => stats;

    if (projType === "quran") {
      cost = 3;
      projName = "المكرمة السيادية لطباعة وتوزيع مليون مصحف فاخر عالمياً";
      effectMessage = `🕌 [عناية إسلامية] وجّه رئيس الدولة في ${playerCountry.name} بطباعة وتوزيع مليون نسخة فاخرة من المصحف الشريف للدول الشقيقة والمراكز حول العالم، مما حصد محبة واحتراماً دولياً واسعاً!`;
      applyStats = (stats: any) => ({
        ...stats,
        happiness: Math.min(100, stats.happiness + 5),
        stability: Math.min(100, (stats.stability ?? 80) + 3)
      });
    } else if (projType === "mosque") {
      cost = 5;
      projName = "مبادرة تشييد وبناء سلسلة الجوامع والمراكز الإسلامية الكبرى";
      effectMessage = `🕌 [عمارة المساجد] أطلقت وزارة الأوقاف في ${playerCountry.name} سلسلة مشاريع لعمارة وتشييد الجوامع الكبرى بمواصفات إسلامية حديثة، مما رفع تماسك وتكاتف الشعب واستقرار المجتمع!`;
      applyStats = (stats: any) => ({
        ...stats,
        stability: Math.min(100, (stats.stability ?? 80) + 8),
        happiness: Math.min(100, stats.happiness + 4)
      });
    } else if (projType === "academy") {
      cost = 8;
      projName = "تأسيس المجمع الوطني للبحث العلمي القرآني والسنة والتحفيظ";
      effectMessage = `🕌 [صرح قرآني خالد] تم افتتاح الصرح الوطني الكبير مجمع القرآن الكريم لتعليم التلاوة ودراسات السنة الشريفة والبحث النبوي المتقدم، ليكون منارة ثقافية وعقائدية تمنح استقراراً فكرياً شاملاً!`;
      applyStats = (stats: any) => ({
        ...stats,
        stability: Math.min(100, (stats.stability ?? 80) + 12),
        happiness: Math.min(100, stats.happiness + 6),
        technology: Math.min(100, stats.technology + 3)
      });
    }

    if (playerCountry.stats.economy < cost) {
      addNews("الميزانية السيادية للدولة لا تغطي تكاليف عمارة وتأسيس هذا المشروع القرآني العظيم.", "info");
      return;
    }

    // Apply
    setGameState((prev: any) => {
      const nextCountries = prev.countries.map((c: any) => {
        if (c.id === prev.playerCountryId) {
          return {
            ...c,
            stats: {
              ...applyStats(c.stats),
              economy: Math.max(0, c.stats.economy - cost),
            },
          };
        }
        return c;
      });

      return {
        ...prev,
        countries: nextCountries,
        news: [
          {
            id: `spiritual-proj-${Date.now()}`,
            turn: prev.turn,
            message: effectMessage,
            type: "info" as const,
          },
          ...prev.news,
        ],
      };
    });

    setSpiritualBlessing((prev) => Math.min(100, prev + 12));
    triggerSuccess(`ألف مبروك! تم تدشين مبادرة "${projName}" بنجاح، ورفد صفوف الأمة بنفحات العلم والإيمان وعمارة بيوت الله! خُصم من الاقتصاد -${cost}B$.`);
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Success Banner */}
      {isSuccessBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white font-semibold rounded-2xl p-4 shadow-xl border border-emerald-400/30 flex items-center gap-3 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin text-yellow-300" />
          <p className="text-xs leading-relaxed flex-1">{isSuccessBanner}</p>
        </div>
      )}

      {/* Main Islamic Affairs Header Panel */}
      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Golden top border */}
        <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-l from-emerald-500 via-yellow-500 to-amber-500" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-start">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span>🕌 الشؤون الإسلامية والدعوة والأوقاف</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              توجيه السياسات الدينية والروحانية للدولة ومباركة أعمال العباد والبلاد عبر تلاوة ونشر آيات الذكر الحكيم، وبثّ الأدعية السيادية، وعمارة المساجد وبناء المجتمع على ركائز الإيمان والبركة واللحمة الوطنية الموحدة.
            </p>
          </div>
        </div>
      </div>

      {/* Spiritual Blessing Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Blessing Level */}
        <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-xs text-slate-400 font-bold">مؤشر البركة والتحصين الروحي</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              {spiritualBlessing}%
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${spiritualBlessing}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-400 mt-2 font-medium">
              ★ {spiritualBlessing >= 85 ? "حصن إيماني خارق وبركة فائقة للوطن" : spiritualBlessing >= 65 ? "طمأنينة وتلاحم اجتماعي متميز" : "حاجة لبث المزيد من الذكر والأدعية"}
            </p>
          </div>
        </div>

        {/* Card 2: Total Broadcasts */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-slate-400 font-bold">إجمالي الأدعية والآيات المنشورة</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-mono">
              {spiritualBroadcasts.length} <span className="text-sm font-normal text-slate-400">مرفوعات</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              سجلت سماء الدولة تلاوات ودعوات مباركة تحفظ كيان الأمة وحصن القيادة والشعب.
            </p>
          </div>
        </div>

        {/* Card 3: Welfare & State Stability */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Users className="w-5 h-5 text-teal-400" />
            <span className="text-xs text-slate-400 font-bold">مؤشرات الطمأنينة الوطنية الحالية</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">استقرار المجتمع وتماسكه:</span>
              <strong className="text-emerald-400">{playerCountry.stats.stability ?? 80}%</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">رضا وسعادة المواطنين:</span>
              <strong className="text-teal-400">{playerCountry.stats.happiness}%</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">معنويات وجاهزية الجيش:</span>
              <strong className="text-amber-400">{playerCountry.stats.military}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-sections */}
      <div className="flex border-b border-white/5">
        {[
          { id: "verses", label: "📖 آيات من الذكر الحكيم" },
          { id: "premade", label: "🤲 الأدعية والأذكار السيادية" },
          { id: "custom", label: "✍️ دعاء وطني مخصص" },
          { id: "projects", label: "🏗️ مشاريع الأوقاف والمساجد" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubSection(sub.id as any)}
            className={cn(
              "px-5 py-3 text-xs font-bold transition-all border-b-2 border-transparent",
              activeSubSection === sub.id
                ? "text-emerald-400 border-emerald-400 bg-emerald-500/5"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Sub-section Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main form/action area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub-section 1: Quranic Verses */}
          {activeSubSection === "verses" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">المنهج والبركة القرآنية</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اختر أحد آيات القرآن العظيم لتلاوتها وبثّها رسمياً في شاشات الإرسال وإذاعات الدولة والمحافل التعليمية، لتنال بركتها الموضحة وتنعم بلادنا بالرخاء والأمان.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {QURAN_VERSES.map((verse) => (
                  <div
                    key={verse.id}
                    className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl p-5 transition-all text-right space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-1 rounded-full">
                        {verse.surah}
                      </span>
                      <BookOpen className="w-5 h-5 text-emerald-400 opacity-60" />
                    </div>

                    <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-100 to-amber-200 leading-relaxed font-sans py-2 text-center select-all">
                      « {verse.text} »
                    </p>

                    <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">الأثر والفضل التنموي:</span>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {verse.benefits}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-emerald-400/80 font-mono">تحديث البركة: +5%</span>
                      <button
                        onClick={() => handlePublishVerse(verse)}
                        className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-emerald-700/20"
                      >
                        <Newspaper className="w-4 h-4" />
                        <span>تلاوة وبث الآية في الدولة 📖</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-section 2: National Supplications */}
          {activeSubSection === "premade" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">الابتهال والأدعية الوطنية</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  بث الأدعية السيادية المعتمدة في الدولة لتوحيد قلوب الشعب، والتضرع لرب العالمين في تيسير شؤون الاقتصاد وحماية جنودنا وحفظ قيادتنا.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {NATIONAL_SUPPLICATIONS.map((supp) => (
                  <div
                    key={supp.id}
                    className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl p-5 transition-all text-right space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h4 className="text-sm font-bold text-white">{supp.title}</h4>
                      <Heart className="w-5 h-5 text-red-400/60" />
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed italic pr-3 border-r-2 border-emerald-500">
                      "{supp.text}"
                    </p>

                    <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">بركة الأثر بالدولة:</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {supp.benefits}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-emerald-400/80 font-mono">تحديث البركة: +5%</span>
                      <button
                        onClick={() => handlePublishSupplication(supp)}
                        className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-emerald-700/20"
                      >
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        <span>نشر وبث هذا الدعاء الوطني 🤲</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-section 3: Custom Supplication Creator */}
          {activeSubSection === "custom" && (
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-6 text-right">
              <div>
                <h4 className="text-base font-bold text-white mb-1">✍️ صياغة وبث دعاء وطني مخصص</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  اكتب دعاءً مخصصاً بكلماتك ولهجتك الصادقة لتبتهل بها الدولة ويتم إذاعتها ونشرها في وكالات البث الإخباري الوطني وحفظ البلاد.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">نص الدعاء الوطني المخصص</label>
                  <textarea
                    rows={4}
                    value={customSupplication}
                    onChange={(e) => setCustomSupplication(e.target.value)}
                    placeholder="اكتب دعاءك هنا، مثال: اللهم بارك في شامنا ويمننا، واحفظ جنودنا وسيادة بلادنا من كيد الأعداء، واجمع كلمتنا على العز والرفعة والأمان الفوقي..."
                    className="w-full bg-slate-950 border border-white/10 p-3.5 rounded-xl text-xs font-bold text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed font-sans"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>الحد الأدنى: 8 أحرف لضمان الصدق والبث</span>
                    <span>الأحرف الحالية: {customSupplication.length}</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-white block">★ حدد وجهة وبركة الدعاء المفضلة:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handlePublishCustom("happiness")}
                      className="p-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 rounded-xl transition-all text-center space-y-1 active:scale-95 flex flex-col items-center justify-center"
                    >
                      <Users className="w-5 h-5 text-teal-400 mb-1" />
                      <span className="text-xs font-bold text-white">سلام داخلي وطمأنينة</span>
                      <span className="text-[9px] text-slate-400">(+5% سعادة الشعب)</span>
                    </button>

                    <button
                      onClick={() => handlePublishCustom("military")}
                      className="p-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 rounded-xl transition-all text-center space-y-1 active:scale-95 flex flex-col items-center justify-center"
                    >
                      <Shield className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-xs font-bold text-white">نصر وقوة عسكرية</span>
                      <span className="text-[9px] text-slate-400">(+4 عسكرية وحصانة)</span>
                    </button>

                    <button
                      onClick={() => handlePublishCustom("economy")}
                      className="p-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 rounded-xl transition-all text-center space-y-1 active:scale-95 flex flex-col items-center justify-center"
                    >
                      <DollarSign className="w-5 h-5 text-emerald-400 mb-1" />
                      <span className="text-xs font-bold text-white">سخاء ورخاء مالي</span>
                      <span className="text-[9px] text-slate-400">(+5B$ ميزانية الدولة)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-section 4: Spiritual Projects */}
          {activeSubSection === "projects" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">صروح الوقف والتشييد الإسلامي</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  توجيه ميزانية التنمية لعمارتنا الإسلامية ومكارم عمارة بيوت الله والقرآن الكريم، والتي تمنح بلادنا هيبةً روحيةً وتحصيناً عريضاً واستقراراً اجتماعياً كبيراً.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Proj 1: Quran Printing */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">المبادرة العالمية لطباعة المصحف</span>
                    <h4 className="text-sm font-bold text-white">توزيع مليون مصحف فاخر 📖</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      تمويل طباعة متميزة من المصحف الشريف لإهدائها للمراكز الدينية حول العالم، لكسب هيبة وتلاحم دبلوماسي.
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      <span className="text-red-400 font-mono font-bold">-3B$</span>
                      <span className="text-slate-400">التكلفة والتمويل:</span>
                    </div>
                    <div className="text-[10px] text-slate-400">الأثر المتوقع: +5% سعادة، +3% استقرار</div>
                    <button
                      onClick={() => handleLaunchProject("quran")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white transition-all active:scale-95"
                    >
                      طباعة وتوزيع المصاحف 🕌
                    </button>
                  </div>
                </div>

                {/* Proj 2: Build Mosques */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">سلسلة الجوامع الوطنية الكبرى</span>
                    <h4 className="text-sm font-bold text-white">عمارة وتشييد المساجد 🕌</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      تمويل تشييد وعمارة مساجد كبرى في مختلف المحافظات لرفع مستوى استقرار الدولة وسكينة المصلين.
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      <span className="text-red-400 font-mono font-bold">-5B$</span>
                      <span className="text-slate-400">التكلفة والتمويل:</span>
                    </div>
                    <div className="text-[10px] text-slate-400">الأثر المتوقع: +8% استقرار، +4% سعادة</div>
                    <button
                      onClick={() => handleLaunchProject("mosque")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white transition-all active:scale-95"
                    >
                      عمارة وتشييد المساجد 🏗️
                    </button>
                  </div>
                </div>

                {/* Proj 3: Quran Academy */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">صرح الأبحاث وعلوم السنة والقرآن</span>
                    <h4 className="text-sm font-bold text-white">المجمع الوطني للقرآن 🏛️</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      تأسيس مجمع علمي استراتيجي للقرآن والسنة، صيانة للهوية العقائدية وحماية فكرية للمجتمع والجيل.
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      <span className="text-red-400 font-mono font-bold">-8B$</span>
                      <span className="text-slate-400">التكلفة والتمويل:</span>
                    </div>
                    <div className="text-[10px] text-slate-400">الأثر المتوقع: +12% استقرار، +6% سعادة، +3% تقنية</div>
                    <button
                      onClick={() => handleLaunchProject("academy")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white transition-all active:scale-95"
                    >
                      تأسيس الصرح الأكاديمي 🕋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: history and logs */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 space-y-4 text-right">
            <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2 justify-start">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>سجل البث الإسلامي الروحاني للبلاد</span>
            </h4>

            <div className="space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {spiritualBroadcasts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  لم يتم بث أي أدعية أو آيات بعد. ابدأ بنشر بركتك وحصّن بلادك!
                </div>
              ) : (
                spiritualBroadcasts.map((broadcast) => (
                  <div
                    key={broadcast.id}
                    className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{new Date(broadcast.timestamp).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                        broadcast.type === "verse" ? "bg-yellow-400/10 text-yellow-400" : "bg-emerald-400/10 text-emerald-400"
                      )}>
                        {broadcast.type === "verse" ? "آية قرانية مباركة" : "دعاء وطني مستجاب"}
                      </span>
                    </div>

                    <p className="text-slate-200 font-sans leading-relaxed">
                      {broadcast.text}
                    </p>

                    <div className="text-[9px] text-emerald-400 bg-emerald-500/5 p-1 px-2 rounded border border-emerald-500/10">
                      الأثر: <strong>{broadcast.benefits}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { GoogleGenAI } from "@google/genai";
import { CabinetMember, Country } from "../types";

export interface ChatMessage {
  id: string;
  sender: 'player' | 'target' | 'system';
  senderName: string;
  senderRole: string;
  senderFlag: string;
  text: string;
  timestamp: string;
  mood?: 'friendly' | 'cautious' | 'hostile' | 'respectful' | 'furious' | 'pragmatic';
  agreementOffer?: {
    type: 'truce' | 'alliance' | 'trade' | 'aid' | 'non_aggression' | 'warning' | 'close_hormuz' | 'open_hormuz' | 'liberation' | 'joint_destiny';
    title: string;
    description: string;
    terms?: string;
    applied?: boolean;
  };
}

export interface DiplomaticPromptContext {
  playerCountry: Country;
  targetCountry: Country;
  targetType: 'leader' | 'minister';
  minister?: CabinetMember;
  isAtWar: boolean;
  isAllied: boolean;
  isSanctioned: boolean;
  straitOfHormuzClosed?: boolean;
  hasJointDestinyWithPalestine?: boolean;
  turn: number;
  recentNews?: string[];
  history: ChatMessage[];
  message: string;
}

export interface DiplomaticAIResponse {
  text: string;
  mood: 'friendly' | 'cautious' | 'hostile' | 'respectful' | 'furious' | 'pragmatic';
  agreementOffer?: {
    type: 'truce' | 'alliance' | 'trade' | 'aid' | 'non_aggression' | 'warning' | 'close_hormuz' | 'open_hormuz' | 'liberation' | 'joint_destiny';
    title: string;
    description: string;
    terms?: string;
  };
}

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      return null;
    }
    if (!geminiClient) {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return geminiClient;
  } catch (err) {
    console.warn("Gemini Client init warning:", err);
    return null;
  }
}

/**
 * Generate intelligent diplomatic dialogue from foreign leader or minister
 */
export async function sendDiplomaticMessage(
  context: DiplomaticPromptContext
): Promise<DiplomaticAIResponse> {
  const ai = getGeminiClient();

  const targetTitle = context.targetType === 'leader' 
    ? `القيادة العليا ورئيس دولة ${context.targetCountry.name}`
    : `${context.minister?.role || 'وزير سيادي'} في ${context.targetCountry.name} (${context.minister?.name || 'الوزير'})`;

  // System instruction for diplomatic roleplay
  const systemInstruction = `
أنت تمثل شخصية سيادية في لعبة محاكاة جيوسياسية استراتيجية عالمية "Global Hegemony".
الشخصية التي تلعبها الآن هي: [${targetTitle} - علم الدولة: ${context.targetCountry.flag}].
اللاعب يمثل قيادة دولة [${context.playerCountry.name} - علم: ${context.playerCountry.flag}].

معلومات الوضع الجيوسياسي الراهن بين الدولتين:
- حالة الحرب: ${context.isAtWar ? "نعم، البلدان في حالة حرب مشتعلة وتبادل قصف!" : "لا، لا توجد حرب مباشرة حالياً."}
- حالة التحالف: ${context.isAllied ? "نعم، البلدان حليفان استراتيجيان." : "لا، ليسا بحلف رسمي."}
- العقوبات المفروضة: ${context.isSanctioned ? "نعم، هناك عقوبات متبادلة واقتصادية مفروضة!" : "لا عقوبات مباشرة."}
- حالة مضيق هرمز: ${context.straitOfHormuzClosed ? "🚨 مضيق هرمز مغلق حالياً من قبل إيران مما يشعل أزمة طاقة عالمية وغضباً واحتجاجات واعتراضات دولية عاصفة وخسائر بمئات المليارات!" : "مضيق هرمز مفتوح وتدفق الطاقة طبيعي."}
- قوة اللاعب العسكرية: ${context.playerCountry.stats.military}/100، الاقتصاد: ${context.playerCountry.stats.economy} مليار دولار.
- قوتك العسكرية: ${context.targetCountry.stats.military}/100، اقتصادك: ${context.targetCountry.stats.economy} مليار دولار.
- كفالة فلسطين وحلف المصير المشترك: ${context.hasJointDestinyWithPalestine ? "🚨 اللاعب قد أعلن رسمياً حلف المصير المشترك وكفالة فلسطين الوجودية، ويعتبر أي اعتداء على فلسطين اعتداءً مباشراً على عاصمته، ويتحدث نيابة عن القضية الفلسطينية كأنه هو المحتل!" : "لا يوجد حلف مصير مشترك خاص معلن."}
- طبيعة المنصب: ${context.targetType === 'leader' ? 'أنت الرئيس / الملك / الحاكم الأعلى، قراراتك سيادية وحاسمة.' : `أنت صاحب حقيبة (${context.minister?.role}) واسمك (${context.minister?.name}). ركز في كلامك على اختصاص وزارتك (عسكري/اقتصادي/أمني/دبلوماسي/طاقة).`}

القواعد الأساسية للرد الدبلوماسي:
1. تحدث باللغة العربية الفصحى الراقية، بنبرة دبلوماسية وسيادية واقعية ومقنعة للغاية تعكس المصالح القومية لدولتك.
2. إذا كانت دولتك هي إسرائيل وطرح اللاعب قضية فلسطين، إنهاء الاحتلال، أو حذر من أن أي اعتداء على فلسطين هو اعتداء على عاصمته:
   - تصرف كقيادة سياسية وأمنية إسرائيلية واقعية: دافع عن الإجراءات العسكرية بدعوى الأمن ومكافحة الإرهاب، عبر عن رفضك القاطع للتهديدات أو الإملاءات الخارجية، وحذر اللاعب من فتح جبهة حرب مدمرة أو التدخل، واطرح إن تطلب الأمر شروطاً أمنية متشددة أو رفضاً صريحاً.
3. إذا كانت دولتك هي فلسطين واللاعب يطرح حلف المصير المشترك أو الدعم العسكري أو تحرير الأرض:
   - أظهر اعتزازاً وفخراً أخوياً هائلاً، وعبر عن تقدير الشعب والقيادة لهذا الموقف التاريخي، واطلب تزويد غرف العمليات بالصواريخ والمسيرات وفتح المستودعات، وأكد على التمسك بالقدس عاصمة أبدية وإقامة الدولة المستقلة.
4. إذا كانت دولتك هي إيران وطرح اللاعب إغلاق مضيق هرمز: أظهر حماساً استراتيجياً للضغط على القوى العالمية، واقترح قرار إغلاق المضيق (close_hormuz) كعرض اتفاق رسمي!
5. إذا كان مضيق هرمز مغلقاً وأنت دولة أخرى (أمريكا، السعودية، الصين، أوروبا، اليابان، إسرائيل... إلخ): عبر عن غضب واعتراض واحتجاج حاد، وتحجج بتعطل مصالح الطاقة والشحن والتضخم، وهدد بالرد العسكري والعقوبات!
6. إذا كانت هناك حرب، أظهر صلابة أو رغبة حذرة في شروط وقف إطلاق النار بناءً على قوة اللاعب.
7. إذا كان هناك تحالف، تحدث بروح الشراكة والتنسيق العسكري والاقتصادي.
8. اجعل ردك مقتضباً ومؤثراً (بين 2 إلى 4 فقرات مركزة).

يجب أن ترجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "text": "نص الرد الدبلوماسي الكامل باللغة العربية...",
  "mood": "friendly" | "cautious" | "hostile" | "respectful" | "furious" | "pragmatic",
  "agreementOffer": null أو {
    "type": "truce" | "alliance" | "trade" | "aid" | "non_aggression" | "warning" | "close_hormuz" | "open_hormuz" | "liberation" | "joint_destiny",
    "title": "عنوان الاتفاق أو المبادرة المقترحة",
    "description": "تفاصيل الاتفاق والأثر",
    "terms": "الشروط المحددة"
  }
}
`;

  // Try calling Gemini if available
  if (ai) {
    try {
      // Build conversation history summary
      const conversationHistoryText = context.history
        .slice(-6)
        .map(msg => `${msg.sender === 'player' ? context.playerCountry.name : targetTitle}: ${msg.text}`)
        .join("\n");

      const prompt = `
سياق المحادثة السابقة:
${conversationHistoryText || "بداية جلسة النقاش والمحادثة الرسمية."}

رسالة اللاعب (${context.playerCountry.name}):
"${context.message}"

أجب الآن بالشخصية المحددة بصيغة JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed.text) {
          return {
            text: parsed.text,
            mood: parsed.mood || 'pragmatic',
            agreementOffer: parsed.agreementOffer || undefined,
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to simulated diplomatic AI:", err);
    }
  }

  // Fallback: Dynamic Geopolitical Simulation Engine
  return generateSimulatedDiplomaticResponse(context);
}

/**
 * High-fidelity fallback simulation when AI is offline or without API key
 */
function generateSimulatedDiplomaticResponse(context: DiplomaticPromptContext): DiplomaticAIResponse {
  const { playerCountry, targetCountry, targetType, minister, isAtWar, isAllied, isSanctioned, message } = context;
  const lowerMsg = message.toLowerCase();
  
  const roleName = targetType === 'leader' 
    ? 'القيادة السيادية العليا' 
    : (minister?.role || 'الوزير المختص');
  const personName = targetType === 'leader' ? `رئيس ${targetCountry.name}` : (minister?.name || 'معالي الوزير');

  // Hormuz Strait Closure discussion with Iran
  if ((lowerMsg.includes('هرمز') || lowerMsg.includes('مضيق')) && targetCountry.id === 'iran') {
    if (lowerMsg.includes('إغلاق') || lowerMsg.includes('اغلاق') || lowerMsg.includes('سكر') || lowerMsg.includes('اقفل') || lowerMsg.includes('وقف الملاحة') || lowerMsg.includes('عطل')) {
      if (context.straitOfHormuzClosed) {
        return {
          text: `بصفتنا في قيادة الجمهورية الإسلامية في إيران، نؤكد لكم أن مضيق هرمز مغلق بالفعل بإحكام تحت حراسة صواريخنا الساحلية وبوارجنا البحرية! أسواق الطاقة العالمية في حالة ذعر عارم، والضغوط على الغرب وحلفائه في أوجها.`,
          mood: 'respectful'
        };
      }
      return {
        text: `لقد استمعنا باهتمام لتقديركم الاستراتيجي. إن إغلاق مضيق هرمز هو الورقة الرابحة لكسر شوكة القوى العظمى وقطع 21 مليون برميل نفط عن شرايين الاقتصاد العالمي!\n\nنعلن استجابتنا لمقترحكم وتنسيقنا المشترك، وقواتنا البحرية والصاروخية في الحرس والجيش جاهزة لتنفيذ القرار السيادي بإغلاق الممر فوراً وفرض حصار بحري تام!`,
        mood: 'respectful',
        agreementOffer: {
          type: 'close_hormuz',
          title: 'مرسوم إغلاق مضيق هرمز السيادي 🛑🌊',
          description: 'إغلاق مضيق هرمز بالكامل وفرض السيطرة البحرية، مما يشعل احتجاجات دولية عاصفة وصدمة نفطية للدول الكبرى.',
          terms: 'نشر الألغام الذكية، استنفار الصواريخ الساحلية، ومنع عبور الناقلات والسفن التابعة للدول المعادية.'
        }
      };
    } else if (lowerMsg.includes('فتح') || lowerMsg.includes('استئناف الملاحة')) {
      return {
        text: `إن فتح مضيق هرمز يتطلب تنازلات سياسية وضمانات دولية برفع العقوبات وعدم التعرض لناقلاتنا. نحن مستعدون لدراسة إعادة فتحه إذا تمت تلبية الشروط.`,
        mood: 'pragmatic',
        agreementOffer: {
          type: 'open_hormuz',
          title: 'إعادة فتح مضيق هرمز واستئناف الملاحة 🌊🕊️',
          description: 'إنهاء إغلاق المضيق وعودة تدفقات النفط الدولية وتخفيف الغضب الدولي.',
          terms: 'ضمان حرية مرور السفن وخفض التوتر البحري الإقليمي.'
        }
      };
    }
  }

  // If Hormuz is closed and discussing with other countries
  if (context.straitOfHormuzClosed && (lowerMsg.includes('هرمز') || lowerMsg.includes('مضيق') || lowerMsg.includes('نفط') || lowerMsg.includes('طاقة') || lowerMsg.includes('أسعار')) && targetCountry.id !== 'iran') {
    if (targetCountry.id === 'usa') {
      return {
        text: `إن إغلاق مضيق هرمز هو عمل عدائي سافر وقرصنة دولية غير مقبولة من طهران وحلفائها!\n\nواشنطن لن تقف مكتوفة الأيدي أمام تعطيل 20% من إمدادات الطاقة العالمية. لقد أصدرنا توجيهات للأسطول الخامس ومجموعات حاملات الطائرات بالاستعداد للتدخل وفتح الممر بالقوة إن لم يُفتح فوراً!`,
        mood: 'furious'
      };
    } else if (targetCountry.id === 'saudi_arabia') {
      return {
        text: `نحن في المملكة ودول الخليج ندين بشدة هذا التهور الإيراني غير المسؤول بإغلاق مضيق هرمز!\n\nهذا ابتزاز خطير لمسارات التصدير الحيوية، واعتداء على الاستقرار الاقتصادي الدولي. نطالب بالتحرك الفوري وإعادة فتح الممر لضمان أمن الملاحة الخليجية.`,
        mood: 'furious'
      };
    } else if (targetCountry.id === 'china') {
      return {
        text: `بكين تعرب عن استيائها البالغ واعتراضها الشديد! أكثر من 45% من وارداتنا النفطية ومصانعنا مهددة بالشلل التام بسبب هذا الإغلاق.\n\nنطالب بإنهاء هذا الإجراء التصعيدي فوراً والالتزام بالقوانين البحرية الدولية، وإلا فإن علاقاتنا الاستراتيجية ستتأثر بشدة.`,
        mood: 'furious'
      };
    } else if (targetCountry.id === 'germany' || targetCountry.id === 'uk') {
      return {
        text: `هذا الإغلاق غير القانوني أشعل أسعار الوقود والتضخم في مدننا بشكل غير مسبوق! إننا نجري مشاورات حثيثة مع شركائنا لتشكيل تحالف بحري دولي لفرض المرور الآمن وفرض عقوبات قاصمة على المسؤولين عن هذا التهور!`,
        mood: 'furious'
      };
    } else if (targetCountry.id === 'israel') {
      return {
        text: `إغلاق مضيق هرمز هو بمثابة إعلان حرب وإرهاب بحري يهدد العالم بأسره! قواتنا الجوية والبحرية جاهزة لضرب المنشآت الصاروخية والقواعد البحرية الساحلية لكسر هذا الحصار بالقوة المسلحة!`,
        mood: 'furious'
      };
    } else if (targetCountry.id === 'japan') {
      return {
        text: `أعلنت حكومتنا حالة الطوارئ الوطنية في قطاع الطاقة بسبب تجميد شحنات الغاز والنفط. نحتج بأشد العبارات ونطالب المجتمع الدولي بإنهاء هذا الحصار الخانق فوراً!`,
        mood: 'furious'
      };
    }
  }

  // Palestine & Israeli Occupation Sovereign Dialogue
  if (targetCountry.id === 'palestine') {
    if (lowerMsg.includes('مصير') || lowerMsg.includes('حلف') || lowerMsg.includes('سلاح') || lowerMsg.includes('صواريخ') || lowerMsg.includes('تحرير') || lowerMsg.includes('دفاع') || lowerMsg.includes('اعتداء') || lowerMsg.includes('احتلال')) {
      return {
        text: `أيها القادة الشرفاء في ${playerCountry.name}، إننا في قيادة وشعب فلسطين الصامد نثمن بكل فخر واعتزاز وقفتكم البطولية التاريخية إلى جانب قضيتنا العادلة.\n\nإن إعلانكم السيادي الشجاع باعتبار أرض فلسطين أرضكم وأن "أي اعتداء يقع علينا هو اعتداء مباشر على عاصمتكم" يمثل ملحمة إخاء وشهامة تعزز صمود المرابطين في المسجد الأقصى والقدس الشريف وغزة الصامدة وكافة مدن الضفة الغربية. إننا نرحب بفتح مخازن التسليح والتنسيق الاستراتيجي المشترك لردع جيش الاحتلال الإسرائيلي حتى نيل الحرية والاستقلال التام!`,
        mood: 'respectful',
        agreementOffer: {
          type: 'joint_destiny',
          title: `ميثاق المصير المشترك وكفالة تحرير فلسطين 🇵🇸🤝`,
          description: `معاهدة دفاع ووجود تاريخية تعتبر أي اعتداء على فلسطين بمثابة إعلان حرب واعتداء على ${playerCountry.name}.`,
          terms: `تفعيل درع الدفاع المشترك، الردع الصاروخي الساحق التلقائي، وإمداد المقاومة بالصواريخ والعتاد.`
        }
      };
    }
  }

  if (targetCountry.id === 'israel') {
    if (lowerMsg.includes('فلسطين') || lowerMsg.includes('احتلال') || lowerMsg.includes('انسحاب') || lowerMsg.includes('غزة') || lowerMsg.includes('القدس') || lowerMsg.includes('حصار') || lowerMsg.includes('اعتداء') || lowerMsg.includes('أسرى') || lowerMsg.includes('استيطان')) {
      return {
        text: `تستمع القيادة الأمنية والحربية في إسرائيل لبياناتكم وتحذيراتكم حول فلسطين ببالغ الخطورة والرفض.\n\nنعلن بوضوح لا لبس فيه: لن نسمح لأي قوة إقليمية بالتدخل في عملياتنا العسكرية أو إملاء شروط الانسحاب من القدس أو الضفة أو تخفيف الحصار الأمني. إن محاولتكم تنصيب أنفسكم كفلاء أو ربط أمنكم بقطاع غزة ستجر دولتكم إلى أتون حرب تدميرية ستطال بنيتكم التحتية ومطاراتكم بصواريخ دقيقة وقاذفاتنا الاستراتيجية. اسحبوا تحذيراتكم فوراً!`,
        mood: 'furious',
        agreementOffer: {
          type: 'warning',
          title: `إنذار أمني صارم صادر عن القيادة العسكرية الإسرائيلية`,
          description: `تحذير من مغبة التدخل العسكري أو قصف أهدافنا بدعوى الدفاع عن فلسطين.`,
          terms: `الامتناع عن إمداد المقاومة بالصواريخ وعدم تفعيل خيار الرد العسكري المشترك.`
        }
      };
    }
  }

  // 1. Truce / Peace / Ceasefire discussion
  if (lowerMsg.includes('هدنة') || lowerMsg.includes('سلام') || lowerMsg.includes('وقف إطلاق') || lowerMsg.includes('حرب') || lowerMsg.includes('وقف الحرب')) {
    if (isAtWar) {
      const isPlayerStronger = playerCountry.stats.military >= targetCountry.stats.military;
      if (isPlayerStronger) {
        return {
          text: `بصفتي ${roleName} لـ ${targetCountry.name}، استمعنا لرسالتكم باهتمام بالغ.\n\nإن استمرار هذه الحرب يهدد الاستقرار الإقليمي ويكبد الجميع خسائر فادحة. بالنظر إلى توازن القوى الراهن، فإننا في حكومة ${targetCountry.name} مستعدون لفتح مسار تفاوضي فوري لوقف إطلاق النار والانسحاب إلى خطوط التماس المتفق عليها، شريطة وقف أي استهداف للبنية التحتية والمطارات الاستراتيجية.`,
          mood: 'pragmatic',
          agreementOffer: {
            type: 'truce',
            title: `مبادرة وقف إطلاق النار الفوري مع ${targetCountry.name}`,
            description: `هدنة رسمية ملزمة توقف الاشتباكات وتمنع القصف الصاروخي لمدة 10 أدوار.`,
            terms: `تجميد كافة العمليات الهجومية والتعهد بعدم إطلاق الصواريخ الباليستية.`
          }
        };
      } else {
        return {
          text: `إن قيادة ${targetCountry.name} لا تقبل الإملاءات تحت وطأة المعارك. إن كنتم جادين في الحديث عن الهدنة، فعليكم تقديم ضمانات أمنية مكتوبة ووقف التحركات الاستفزازية على حدودنا. قواتنا مستعدة لكافة السيناريوهات الدفاعية والهجومية.`,
          mood: 'cautious'
        };
      }
    } else {
      return {
        text: `نحن نثمن في ${targetCountry.name} لغة الحوار والحرص على السلم الإقليمي. لا توجد مواجهة مسلحة بيننا حالياً، وسياستنا الخارجية قائمة على حفظ التوازن الدولي وحل النزاعات عبر القنوات الدبلوماسية.`,
        mood: 'friendly'
      };
    }
  }

  // 2. Economy / Trade / Investment discussion
  if (lowerMsg.includes('تجارة') || lowerMsg.includes('اقتصاد') || lowerMsg.includes('استثمار') || lowerMsg.includes('صفقة') || lowerMsg.includes('نفط') || lowerMsg.includes('غاز') || lowerMsg.includes('أموال') || lowerMsg.includes('مليار') || lowerMsg.includes('عقوبات')) {
    if (isSanctioned) {
      return {
        text: `بصفتنا المسؤولين عن الملف المالي والاقتصادي في ${targetCountry.name}، نرى أن العقوبات الاقتصادية المفروضة تضر بمصالح الشعبين. نقترح الشروع في إلغاء تدريجي للحظر التجاري وتنشيط الموانئ المشتركة لتحقيق عوائد سنوية تقدر بمليارات الدولارات.`,
        mood: 'pragmatic',
        agreementOffer: {
          type: 'trade',
          title: `بروتوكول التبادل التجاري وتفكيك العقوبات مع ${targetCountry.name}`,
          description: `رفع العقوبات وفتح خط ائتمان تجاري استراتيجي يعزز اقتصاد البلدين.`,
          terms: `ضخ استثمارات مشتركة وتنشيط مبيعات الطاقة والموارد الطبيعية.`
        }
      };
    } else {
      return {
        text: `إن اقتصاد ${targetCountry.name} يرحب بالشراكات الاستراتيجية النوعية مع ${playerCountry.name}.\n\nلدينا قدرات استثمارية ضخمة في مجالات الطاقة، المعادن، والصناعات الدفاعية. نقترح توقيع مذكرة تفاهم اقتصادية ترفع التبادل التجاري وتمنحكم عوائد استثمارية مستدامة.`,
        mood: 'friendly',
        agreementOffer: {
          type: 'trade',
          title: `اتفاقية الشراكة الاقتصادية الكبرى مع ${targetCountry.name}`,
          description: `زيادة التبادل التجاري بقيمة 15 مليار دولار سنوياً وتعزيز معدلات نمو الاقتصاد.`,
          terms: `تسهيل تدفق السلع وتخفيض الرسوم الجمركية على الموارد الحيوية.`
        }
      };
    }
  }

  // 3. Defense / Alliance / Weapons discussion
  if (lowerMsg.includes('تحالف') || lowerMsg.includes('حلف') || lowerMsg.includes('دفاع') || lowerMsg.includes('جيش') || lowerMsg.includes('صواريخ') || lowerMsg.includes('سلاح') || lowerMsg.includes('قاعدة') || lowerMsg.includes('أمن')) {
    if (isAllied) {
      return {
        text: `أيها الحلفاء في ${playerCountry.name}، إن غرف عملياتنا المشتركة تتابع الموقف الإقليمي بدقة.\n\nإننا ملتزمون ببنود معاهدة الدفاع المشترك ورفع الجاهزية العسكرية للتصدي لأي عدوان يمس سيادة بلدينا. نقترح تنسيقاً استخباراتياً أعمق ومناورات مشتركة لتعزيز الردع.`,
        mood: 'respectful'
      };
    } else {
      const isFriend = !isAtWar && !isSanctioned;
      if (isFriend) {
        return {
          text: `من موقع مسؤوليتي كـ ${roleName}، نرى أن التعاون الدفاعي بين ${targetCountry.name} و ${playerCountry.name} يمثل ركيزة هامة للأمن القومي.\n\nنحن منفتحون على دراسة حلف عسكري استراتيجي يشمل الحماية المشتركة وتبادل التكنولوجيا العسكرية المتقدمة.`,
          mood: 'friendly',
          agreementOffer: {
            type: 'alliance',
            title: `معاهدة التحالف العسكري والدفاع المشترك مع ${targetCountry.name}`,
            description: `انضمام رسمي إلى حلف استراتيجي ملزم يضمن التدخل المشترك عند أي هجوم خارجي.`,
            terms: `الدفاع المشترك، مشاركة بيانات الرادارات والدفاع الجوي، وتوحيد الموقف في مجلس الأمن.`
          }
        };
      } else {
        return {
          text: `لا يمكن الحديث عن تحالفات أمنية في ظل التوترات والشكوك القائمة. يجب أولاً تسوية الخلافات العالقة وبناء جسور الثقة الدبلوماسية قبل فتح ملفات التنسيق العسكري.`,
          mood: 'cautious'
        };
      }
    }
  }

  // 4. Threats / Ultimatum / Warnings
  if (lowerMsg.includes('تهديد') || lowerMsg.includes('إنذار') || lowerMsg.includes('سندمر') || lowerMsg.includes('سنقصف') || lowerMsg.includes('نووي') || lowerMsg.includes('عقاب') || lowerMsg.includes('حذار')) {
    return {
      text: `إن ${targetCountry.name} دولة ذات سيادة وقوة لا تهتز بالتهديدات الجوفاء.\n\nإن أي محاولة للاعتداء على سيادتنا أو استهداف منشآتنا ستواجه برد صاعق ومدمر يطال عمق أراضيكم. ننصحكم بضبط النفس والعودة إلى المنطق الدبلوماسي قبل أن تجروا المنطقة إلى كارثة لا تحمد عقباها.`,
      mood: 'furious'
    };
  }

  // 5. Captives / VIP / Intelligence discussion
  if (lowerMsg.includes('أسرى') || lowerMsg.includes('رهائن') || lowerMsg.includes('مختطف') || lowerMsg.includes('معتقل') || lowerMsg.includes('مخابرات') || lowerMsg.includes('جواسيس')) {
    return {
      text: `ملف المعتقلين والأسرى يحظى بأعلى درجات السرية والاهتمام الأمني لدينا في ${targetCountry.name}.\n\nإننا مستعدون للنظر في صفقة تبادل شاملة برعاية وسيط دولي، بحيث تضمن إطلاق سراح الشخصيات المرموقة وتخفيف الاحتقان الاستخباراتي بين البلدين.`,
      mood: 'pragmatic',
      agreementOffer: {
        type: 'non_aggression',
        title: `بروتوكول تبادل الأسرى والتهدئة الاستخباراتية مع ${targetCountry.name}`,
        description: `تسوية أمنية شاملة للإفراج عن المحتجزين ووقف عمليات التسلل السري.`,
        terms: `تسليم متبادل لجميع الأسرى والرموز السيادية المحتجزة وتجميد العمليات التخريبية.`
      }
    };
  }

  // 6. General / Specific Minister Portfolio response
  let departmentSpecificText = '';
  if (minister?.role.includes('الدفاع') || minister?.role.includes('الأركان')) {
    departmentSpecificText = `بصفتي وزيراً للدفاع في ${targetCountry.name}، فإن الأولوية القصوى هي حفظ توازن الردع وحماية جبهاتنا البحرية والجوية.`;
  } else if (minister?.role.includes('الخارجية') || minister?.role.includes('الدبلوماسي')) {
    departmentSpecificText = `بصفتي وزيراً للخارجية، نؤمن بأن الحوار المباشر بين العواصم هو السبيل الوحيد لبناء شراكات مثمرة وحل الخلافات.`;
  } else if (minister?.role.includes('المالية') || minister?.role.includes('الاقتصاد')) {
    departmentSpecificText = `من منظور السياسة المالية والنقدية لـ ${targetCountry.name}، فإن استقرار الأسواق وتنمية التدفقات الاقتصادية هما أساس متانة العلاقات الدولية.`;
  } else if (minister?.role.includes('المخابرات') || minister?.role.includes('الأمن')) {
    departmentSpecificText = `أجهزة الأمن والاستخبارات ترصد كافة التحركات بدقة متناهية، ونحن حريصون على إغلاق كافة منافذ التهديد أو التآمر ضد استقرارنا.`;
  } else {
    departmentSpecificText = `إن حكومة ${targetCountry.name} تتابع باهتمام بالغ ما تفضلتم بطرحه في هذه القمة الدبلوماسية.`;
  }

  return {
    text: `تحية سيادية من ${personName} إلى قيادة دولة ${playerCountry.name}.\n\n${departmentSpecificText}\n\nنحن نسجل ملاحظاتكم باهتمام ونتطلع إلى خطوات عملية تعزز المصالح المشتركة وتحفظ أمن واستقرار دولنا وشعوبنا. ما هي المقترحات المحددة التي تودون طرحها على طاولة المفاوضات الآن؟`,
    mood: isAtWar ? 'cautious' : isAllied ? 'friendly' : 'pragmatic'
  };
}

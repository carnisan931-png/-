import { MilitaryOccupation } from '../types';

export const INITIAL_OCCUPATIONS: MilitaryOccupation[] = [
  {
    id: 'occ-israel-palestine',
    occupierId: 'israel',
    occupiedId: 'palestine',
    occupiedRegions: [
      'القدس الشرقية والمسجد الأقصى الشريف',
      'الضفة الغربية (رام الله، الخليل، نابلس، جنين)',
      'قطاع غزة (حصار بري وبحري وجوي مستمر)',
      'هضبة الجولان السورية ومزارع شبعا'
    ],
    sinceTurn: 1,
    resistanceLevel: 92,
    militaryGovernor: 'قيادة جيش الاحتلال الإسرائيلي والإدارة المدنية العسكرية',
    occupationTax: 25,
    isHistorical: true,
    status: 'active',
    historyNotes: [
      'احتلال عسكري إسرائيلي متواصل للأراضي الفلسطينية منذ عام 1967 وعام 1948، تخلله بناء مستوطنات غير قانونية وجدار الفصل العنصري وحصار غزة الخانق.',
      'صمود أسطوري مستمر وشعب يواصل النضال والمقاومة لنيل حقوقه الوطنية الكاملة وتقرير المصير وإقامة دولته المستقلة وعاصمتها القدس الشريف.'
    ]
  }
];

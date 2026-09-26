export enum ResourceType {
  OIL = 'نفط',
  GAS = 'غاز',
  MINERALS = 'معادن',
}

export interface Resources {
  [ResourceType.OIL]: number;
  [ResourceType.GAS]: number;
  [ResourceType.MINERALS]: number;
}

export interface CountryStats {
  population: number;
  economy: number; // GDP in billions
  military: number; // Strength index 0-100
  resources: Resources;
  happiness: number; // 0-100
  technology: number; // 0-100
  stability?: number; // 0-100
  missiles?: number; // Number of missiles
  ships?: number; // Number of ships
  deaths: number; // Total casualties
  alliances: string[]; // List of country IDs
  sanctions: string[]; // List of country IDs sanctioning this country
  severedRelations?: string[]; // List of country IDs with severed relations
  securityLevel?: 'normal' | 'medium' | 'high';
  airDefense?: number;
  sustainability?: number;
}

export enum AssetType {
  BASE = 'قاعدة عسكرية',
  COMPANY = 'شركة',
  NUCLEAR_PLANT = 'مفاعل نووي',
  RESEARCH_CENTER = 'مركز أبحاث',
}

export interface ForeignAsset {
  id: string;
  ownerId: string; // The country that owns this asset
  type: AssetType;
  name: string;
  health: number; // 0-100
  isActive?: boolean;
  strikeCount?: number;
  garrison?: number; // Troops stationed in this base
  airDefenseLevel?: number; // Air defense percentage of this base
  airDefenseBuildingBuilt?: boolean; // Whether the air defense building is built
}

export interface CabinetMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'assassinated' | 'kidnapped';
  replacementCount: number;
  kidnappedBy?: string;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  stats: CountryStats;
  isPlayer: boolean;
  isAlive: boolean;
  x: number;
  y: number;
  regions?: string[];
  foreignAssets?: ForeignAsset[]; // Assets located ON this country's soil
  cabinet?: CabinetMember[];
  hospitals?: { id: string; name: string; health: number; isActive: boolean }[];
  policeStations?: { id: string; name: string; health: number; isActive: boolean }[];
}

export interface NewsEvent {
  id: string;
  turn: number;
  message: string;
  type: 'war' | 'diplomacy' | 'economy' | 'disaster' | 'info' | 'research';
}

export interface War {
  attackerId: string;
  defenderId: string;
  startTurn: number;
  negotiationType?: 'truce' | 'peace'; // 'truce' (هدنة مؤقتة) or 'peace' (سلام شامل ودائم)
  negotiationStartTurn?: number;
  negotiationProgress?: number; // success probability or current status (0 - 100)
  negotiationTurnsLeft?: number; // 3 turns counter
  negotiationOfferMade?: 'none' | 'aid' | 'demands' | 'status_quo' | 'pow_exchange' | 'un_arbitration' | 'withdrawal' | 'demilitarized_zone' | 'secret_summit' | 'trade_deal' | 'energy_corridor' | 'cultural_exchange' | 'joint_patrols' | 'intelligence_sharing' | 'threat_naval_blockade' | 'threat_cyber_blackout' | 'threat_nuclear_scare' | 'threat_proxy_trigger' | 'threat_economic_embargo' | 'threat_total_mobilization'; // Player's concession/approach/threat
}

export interface Truce {
  countryA: string;
  countryB: string;
  endTurn: number;
}

export interface VipTarget {
  id: string;
  name: string; // الاسم
  title: string; // الصفة أو المنصب
  countryId: string; // الدولة الأم ينتمي إليها
  spottedInCountryId: string; // الدولة التي تم رصده فيها حالياً
  locationName: string; // اسم الفندق أو المطار المحدد
  locationType: 'airport' | 'hotel' | 'other';
  intelSource: string; // مصدر المخابرات ورصده
  impactType: 'military' | 'technology' | 'economy' | 'general'; // الأثر الأساسي للاغتيال
  scandalFactor: number; // مستوى تفاعل الرأي العام والحساسية
  missilesRequired?: number; // عدد الصواريخ الباليستية المطلوبة للقاذف
}

export interface Blockade {
  id: string;
  countryId: string; // The country being blockaded
  type: 'naval' | 'land';
  intensity: number; // 25, 50, 75, 100
  initiatorId: string; // Country that initiated the blockade
}

export interface GameState {
  turn: number;
  countries: Country[];
  news: NewsEvent[];
  playerCountryId: string;
  wars: War[];
  truces: Truce[];
  straitOfHormuzClosed?: boolean;
  activeDecrees?: string[];
  warnings?: { [countryId: string]: number };
  activeSystems?: string[];
  nuclearUnlocked?: boolean;
  showNuclearPuzzle?: boolean;
  vipTargets?: VipTarget[];
  electionsActive?: { [countryId: string]: { turnsLeft: number; candidateName?: string } };
  sovereignHqsDestroyed?: { [countryId: string]: string[] };
  pendingApologies?: {
    id: string;
    hostCountryId: string;
    vipName: string;
    locationName: string;
    targetCountryId: string;
    deaths: number;
  }[];
  incomingThreat?: {
    id: string;
    type: 'missile' | 'nuclear_doomsday';
    sourceId?: string;
    timeLeft: number;
  } | null;
  comprehensiveWipeTurnsLeft?: number;
  blockades?: Blockade[];
  captives?: Captive[];
  strategicRoads?: StrategicRoad[];
  interestRateActive?: boolean;
  protectionPacts?: { id: string; targetId: string; protectedId: string; status: 'accepted' | 'rejected' | 'violated_and_retaliated' }[];
  recentBaseBombardments?: { id: string; targetBaseId: string; targetBaseName: string; hostCountryId: string; attackerCountryId: string; turn: number; threatened?: boolean }[];
  sovereignViolations?: SovereignViolation[];
  antiKidnappingShieldActive?: boolean;
  terroristCountries?: string[]; // IDs of countries marked as terrorist
  unVoteInProgress?: {
    id: string;
    targetCountryId: string;
    proposerCountryId?: string; // country ID of the proposer (can be NPC or player)
    type: 'add' | 'remove' | 'sanctions' | 'embargo' | 'intervention' | 'aid' | 'disarm'; // resolution types
    yeas: string[]; // country IDs voting yes
    nays: string[]; // country IDs voting no
    status: 'pending' | 'passed' | 'failed';
    turnInitiated: number;
    lobbyCount?: number; // times the player has used lobbying/influence
  } | null;
  stadiums?: Stadium[];
  tournaments?: Tournament[];
  sportsInterest?: number;
  occupations?: MilitaryOccupation[];
  jointDestinyPacts?: JointDestinyPact[];
}

export interface MilitaryOccupation {
  id: string;
  occupierId: string; // The occupying country ID
  occupiedId: string; // The occupied country ID
  occupiedRegions: string[]; // List of occupied regions/cities
  sinceTurn: number;
  resistanceLevel: number; // 0 to 100 (% resistance activity)
  militaryGovernor?: string; // Title or name of occupying command
  occupationTax: number; // Extracted revenue/economic siphon
  isHistorical?: boolean; // Real-world occupation flag
  status: 'active' | 'liberated' | 'uprising';
  historyNotes?: string[];
}

export interface JointDestinyPact {
  id: string;
  sponsorId: string; // The defending protector (usually playerCountryId)
  protectedId: string; // The defended/occupied country ID (e.g. palestine)
  sinceTurn: number;
  commitmentLevel: 'existential'; // أي اعتداء كأنه اعتداء عليا
  autoRetaliate: boolean;
  jointDefenseShield: boolean;
  resistanceSupport: boolean;
  pactTitle: string;
}

export interface SovereignViolation {
  id: string;
  type: 'base_bombardment' | 'pact_violation';
  attackerCountryId: string;
  targetName: string; // Base name or protected country name
  hostCountryId: string; // Host country ID of the base or the protected country ID
  turn: number;
  status: 'pending' | 'retaliated_heavy_bombardment' | 'retaliated_nuclear' | 'retaliated_decapitation' | 'retaliated_economic' | 'brutal_invasion' | 'forgiven';
  advisorDiscussions?: { role: string; name: string; advice: string; tone: string; avatar: string }[];
}

export interface StrategicRoad {
  id: string;
  name: string;
  targetCountryId: string;
  carCount: number;
  pedestrianCount: number;
  status: 'normal' | 'congested' | 'shelled' | 'destroyed';
  destructionLevel: number; // Percentage: 0 to 100
  tacticalValue: string;
  speedLimit: number; // in km/h
  threatLevel: 'low' | 'medium' | 'high';
}

export interface Captive {
  id: string;
  name: string;
  title: string;
  countryId: string;
  originCity: string;
  captureTurn: number;
  isVip: boolean;
  importance: 'low' | 'medium' | 'high' | 'critical';
  status: 'alive' | 'executed' | 'exchanged';
}

export interface Stadium {
  id: string;
  name: string;
  type: 'football' | 'basketball' | 'tennis' | 'olympic' | 'swimming' | 'volleyball' | 'arena' | 'convention' | 'festival';
  capacity: number;
  cost: number;
  countryId: string;
  city?: string;
  occupancyStatus?: 'empty' | 'full'; // فاضي أو مليان
  currentEvent?: string; // e.g. "مباراة نهائي كأس الأمم ⚽", "قمة القادة الدبلوماسية 🏛️", "فارغ حالياً..."
  attendeesCount?: number; // عدد الحضور الفعلي
  health?: number; // 0 to 100 (100 = سليم تماماً، 0 = مدمر بالقصف)
  isEvacuated?: boolean; // هل تم إخلاؤه
  lastStrikeType?: 'missile' | 'airstrike' | 'artillery' | null;
  lastCasualties?: number;
}

export interface Tournament {
  id: string;
  name: string;
  status: 'bidding' | 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  hostCountryId: string | null;
  bidders: string[];
  type: 'world_cup' | 'asian_cup' | 'arab_cup' | 'olympics' | 'custom';
  sportType: 'football' | 'basketball' | 'tennis' | 'olympic' | 'mixed';
  year: number;
  investmentCost: number;
  revenueGenerated: number;
  prestigeReward: number;
  winnerCountryId?: string;
  history?: string[];
}



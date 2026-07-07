/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  NON_BINARY = "Non-Binary"
}

export interface Appearance {
  skinColor: string; // Hex color code
  hairStyle: string; // "bald", "short", "curly", "long", "punk", "afro"
  hairColor: string; // Hex color code
  eyeColor: string; // Hex color code
  clothing: string; // "casual", "suit", "rags", "hipster", "pajamas"
  accessory: string; // "none", "glasses", "sunglasses", "clown_nose", "monocle"
  facialExpression: "neutral" | "happy" | "sad" | "angry" | "crazed" | "dead";
}

export interface PersonalityTrait {
  name: string;
  description: string;
  statModifiers: Partial<PlayerStats>;
}

export interface PlayerStats {
  health: number;       // 0-100
  happiness: number;    // 0-100
  sanity: number;       // 0-100 (craziness is 100 - sanity)
  luck: number;         // 0-100
  strength: number;     // 0-100
  fitness: number;      // 0-100
  attractiveness: number; // 0-100
  charisma: number;     // 0-100
  intelligence: number; // 0-100
  creativity: number;   // 0-100
  fame: number;         // 0-100
  reputation: number;   // 0-100
  morality: number;     // 0-100 (high = saintly, low = crime-lord)
  stress: number;       // 0-100
}

export interface Career {
  id: string;
  title: string;
  field: string;
  salary: number;
  stress: number;
  reqIntelligence: number;
  reqCreativity: number;
  reqCharisma: number;
  level: number; // 1 to 5 progression
  description: string;
}

export interface EducationPath {
  id: string;
  name: string;
  cost: number;
  duration: number; // in years
  reqIntelligence: number;
  perksDescription: string;
}

export interface NPC {
  id: string;
  name: string;
  gender: Gender;
  relationType: "Parent" | "Sibling" | "Friend" | "Partner" | "Child" | "Enemy" | "Tenant" | "Landlord";
  relationValue: number; // 0-100
  age: number;
  isAlive: boolean;
  occupation: string;
  personality: string;
  memories: string[]; // Remembered interactions
}

export interface RealEstate {
  id: string;
  name: string;
  type: "rent" | "own";
  propertyType: "Cardboard Box" | "Shared Room" | "Shabby Studio" | "Hipster Loft" | "Suburban House" | "Luxury Penthouse" | "Eco-Mansion";
  value: number; // Purchase price
  monthlyCost: number; // Rent or maintenance
  condition: number; // 0-100 (cleanliness, modernity, etc.)
  securityLevel: number; // 0-100 (upgrades like smart lock, cameras)
  hasPool: boolean;
  hasGarden: boolean;
  hasSmartTech: boolean;
  locationArea: string; // "Downtown", "Suburbs", "Rural", "Luxury Island"
  tenants: NPC[]; // For rented properties owned by the player
}

export interface Vehicle {
  id: string;
  name: string;
  category: "Car" | "Motorcycle" | "Boat" | "Yacht" | "Private Jet";
  type: "sports" | "practical" | "classic";
  value: number;
  condition: number; // 0-100
  fuelLevel: number; // 0-100
  insurancePaid: boolean;
  monthlyMaintenance: number;
  description: string;
}

export interface PersonalItem {
  id: string;
  name: string;
  category: "Jewellery" | "Watch" | "Electronics" | "Artwork" | "Antique" | "Collectable" | "Sentimental";
  value: number;
  condition: number; // 0-100
  rarity: "common" | "rare" | "epic" | "legendary";
  emotionalValue: number; // 0-100
  description: string;
}

export interface Business {
  id: string;
  name: string;
  type: "Shop" | "Restaurant" | "Online Startup" | "Real Estate Agency" | "Entertainment Venue";
  purchaseCost: number;
  annualRevenue: number;
  monthlyMaintenance: number;
  employeesCount: number;
  reputation: number; // 0-100
  isThriving: boolean;
  description: string;
}

export interface Pet {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Capybara" | "Rock" | "Alpaca" | "Miniature Dragon";
  personality: string;
  health: number; // 0-100
  training: number; // 0-100
  age: number;
}

export interface HistoryLog {
  age: number;
  text: string;
  type: "birth" | "standard" | "career" | "relationship" | "crime" | "health" | "death";
}

export interface GameState {
  name: string;
  gender: Gender;
  age: number;
  cash: number;
  netWorth: number;
  stats: PlayerStats;
  appearance: Appearance;
  traits: string[]; // Names of active traits
  educationCompleted: string[];
  currentEducation: { id: string; yearsLeft: number } | null;
  currentCareer: Career | null;
  history: HistoryLog[];
  npcs: NPC[];
  properties: RealEstate[];
  vehicles: Vehicle[];
  personalItems: PersonalItem[];
  businesses: Business[];
  pets: Pet[];
  isDead: boolean;
  deathReason: string;
  crimeRecordCount: number;
  fameFollowers: number;
  yearlyFocus?: "career" | "relationship" | "health" | "education" | "wealth";
  calendarYear?: number;
  season?: "Spring" | "Summer" | "Autumn" | "Winter";
  lifeStage?: "Infancy" | "Childhood" | "Teen Years" | "Young Adult" | "Adult" | "Later Life" | "Elderly";
  delayedEffects?: DelayedEffect[];
  decisionFlags?: Record<string, boolean>;
  activeNews?: string[];
  worldCondition?: WorldCondition;
  investments?: Record<string, number>;
  stockPrices?: Record<string, number>;
}

export interface DelayedEffect {
  id: string;
  triggerAge?: number; // Either trigger at this age
  yearsLeft?: number;   // Or after this many years
  title: string;
  description: string;
  statChanges: Partial<PlayerStats> & { cash?: number };
  consequenceText: string;
  newsText?: string;
}

export interface WorldCondition {
  economy: "depression" | "recession" | "normal" | "boom";
  politicalClimate: string;
  weather: string;
}

export interface GameChoice {
  text: string;
  statChanges: Partial<PlayerStats> & { cash?: number };
  consequenceText: string;
  nextEventId?: string; // For event chains
  delayedEffect?: DelayedEffect;
  setFlag?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  situation?: string; // What is happening?
  context?: string;   // Why is it happening?
  category: "childhood" | "general" | "career" | "crime" | "relationship" | "crisis";
  minAge: number;
  maxAge: number;
  chance: number; // Weight/chance of triggering
  conditions?: (state: GameState) => boolean;
  choices: GameChoice[];
}

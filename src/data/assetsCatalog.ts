/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RealEstate, Vehicle, PersonalItem, Business } from "../types";

export interface LocationSpec {
  id: string;
  name: string;
  averageWealth: string;
  safetyLevel: number; // 0-100
  crimeRate: number; // 0-100
  weather: string;
  description: string;
  statusMultiplier: number;
}

export const LOCATIONS: LocationSpec[] = [
  {
    id: "rural",
    name: "The Rustling Wilds (Rural)",
    averageWealth: "Modest",
    safetyLevel: 95,
    crimeRate: 5,
    weather: "Crisp mountain air & snowy winters",
    description: "Endless space and pine trees. The nearest grocery store is a 45-minute drive, but you have ultimate peace of mind.",
    statusMultiplier: 0.8
  },
  {
    id: "suburbs",
    name: "The Cozy Suburbs",
    averageWealth: "Comfortable",
    safetyLevel: 88,
    crimeRate: 12,
    weather: "Mild, sunny, and predictable",
    description: "Beige fences, manicured lawns, and neighbors who compete aggressively on Christmas lights display.",
    statusMultiplier: 1.0
  },
  {
    id: "downtown",
    name: "Downtown Neon (Urban Center)",
    averageWealth: "High",
    safetyLevel: 55,
    crimeRate: 45,
    weather: "Drizzly, smoggy, illuminated by cyber-signboards",
    description: "Loud sirens, 24-hour convenience stores, high taxes, and high-stakes networking. Very prestigious.",
    statusMultiplier: 1.5
  },
  {
    id: "luxury_island",
    name: "Gold Dust Gated Island",
    averageWealth: "Astronomical",
    safetyLevel: 99,
    crimeRate: 1,
    weather: "Endless tropical sunshine and perfect sea breeze",
    description: "Accessible only via private yacht or helicopter. Graced with high-security laser grids and gold-flecked beaches.",
    statusMultiplier: 2.5
  }
];

export interface RealEstateOption {
  id: string;
  name: string;
  propertyType: RealEstate["propertyType"];
  cost: number;
  monthlyMaintenance: number;
  potentialRent: number;
  locationArea: string;
  description: string;
  happinessModifier: number;
  type: "rent" | "own";
}

export const PROPERTY_OPTIONS_EXPANDED: RealEstateOption[] = [
  // --- RENTALS ---
  {
    id: "rent_box",
    name: "Discarded Appliance Cardboard Box",
    propertyType: "Cardboard Box",
    cost: 15,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    locationArea: "The Rustling Wilds (Rural)",
    description: "Located behind a small organic farm. Drafty and gets very soggy, but has stellar cricket ambient acoustics.",
    happinessModifier: -10
  },
  {
    id: "rent_closet",
    name: "Harry Potter-esque Under-Stair Storage",
    propertyType: "Shared Room",
    cost: 180,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    locationArea: "The Cozy Suburbs",
    description: "Your landlord labels it a 'vintage under-stair suite'. You can hear every step and plumbing flush above you.",
    happinessModifier: -4
  },
  {
    id: "rent_studio",
    name: "Industrial Paint-Shed Studio",
    propertyType: "Shabby Studio",
    cost: 550,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    locationArea: "The Cozy Suburbs",
    description: "Slightly smells of paint thinner and gasoline. Radiator shrieks randomly, but rent is surprisingly reasonable.",
    happinessModifier: 2
  },
  {
    id: "rent_loft",
    name: "Exposed-Pipe Hipster Warehouse Loft",
    propertyType: "Hipster Loft",
    cost: 1200,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    locationArea: "Downtown Neon (Urban Center)",
    description: "Features brick walls, zero doors, and a hammock. Rent spikes whenever a hipster espresso store opens nearby.",
    happinessModifier: 15
  },
  {
    id: "rent_penthouse",
    name: "Helipad-Adjacent High-Gloss Penthouse",
    propertyType: "Luxury Penthouse",
    cost: 4200,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    locationArea: "Downtown Neon (Urban Center)",
    description: "High floor, floor-to-ceiling glass, gold-plated automatic bidet, and a sweeping view of city life.",
    happinessModifier: 30
  },

  // --- OWNERSHIP ---
  {
    id: "own_hutch",
    name: "Suburban Commuter Hutch",
    propertyType: "Suburban House",
    cost: 75000,
    type: "own",
    monthlyMaintenance: 150,
    potentialRent: 550,
    locationArea: "The Cozy Suburbs",
    description: "A cozy beige house with a tiny garden and a very normal driveway. The neighborhood is aggressively polite.",
    happinessModifier: 12
  },
  {
    id: "own_steam_loft",
    name: "Decommissioned Steam-Room Loft",
    propertyType: "Hipster Loft",
    cost: 180000,
    type: "own",
    monthlyMaintenance: 350,
    potentialRent: 1350,
    locationArea: "Downtown Neon (Urban Center)",
    description: "High-ceiling loft with original bronze pipes and industrial steam dials. High yield rent potential.",
    happinessModifier: 18
  },
  {
    id: "own_penthouse_buy",
    name: "Sky-Cottage Marble Penthouse",
    propertyType: "Luxury Penthouse",
    cost: 650000,
    type: "own",
    monthlyMaintenance: 1100,
    potentialRent: 4500,
    locationArea: "Downtown Neon (Urban Center)",
    description: "Comes with private elevator access, marble countertops, and soundproofing to keep noise out.",
    happinessModifier: 28
  },
  {
    id: "own_eco_mansion",
    name: "Solar-Dome Eco-Mansion",
    propertyType: "Eco-Mansion",
    cost: 1850000,
    type: "own",
    monthlyMaintenance: 2800,
    potentialRent: 14000,
    locationArea: "Gold Dust Gated Island",
    description: "Powered by hydrogen fuel-cells, guarded by well-trained guard geese, with infinity pool and hot tub.",
    happinessModifier: 45
  }
];

export interface VehicleCatalogOption {
  id: string;
  name: string;
  category: Vehicle["category"];
  type: Vehicle["type"];
  cost: number;
  monthlyMaintenance: number;
  description: string;
  reputationGain: number;
}

export const VEHICLE_OPTIONS: VehicleCatalogOption[] = [
  {
    id: "veh_scooter",
    name: "Sputtering Retro Moped",
    category: "Motorcycle",
    type: "practical",
    cost: 850,
    monthlyMaintenance: 20,
    description: "Emits a light blue exhaust cloud and sounds like a blender on high speed. Excellent fuel economy, poor safety.",
    reputationGain: 2
  },
  {
    id: "veh_hatchback",
    name: "Dented Commuter Hatchback",
    category: "Car",
    type: "practical",
    cost: 3200,
    monthlyMaintenance: 60,
    description: "Reliable, gray, and blends in with any traffic. The tape player is permanently jammed playing a country tape.",
    reputationGain: 5
  },
  {
    id: "veh_muscle",
    name: "Guzzling V8 Heavy Muscle Car",
    category: "Car",
    type: "sports",
    cost: 28000,
    monthlyMaintenance: 220,
    description: "Roars like a captured dragon. Shakes violently when idle. Drastically decreases fuel reserve but boosts charisma.",
    reputationGain: 20
  },
  {
    id: "veh_classic_bike",
    name: "1972 Vintage Leather Cruiser",
    category: "Motorcycle",
    type: "classic",
    cost: 16500,
    monthlyMaintenance: 110,
    description: "Chrome exhaust pipes that shine like mirrors. Requires weekly polishing, but elders look at you with high respect.",
    reputationGain: 15
  },
  {
    id: "veh_supercar",
    name: "Fibre-Weave Neon Supercar",
    category: "Car",
    type: "sports",
    cost: 195000,
    monthlyMaintenance: 950,
    description: "Sits 2 inches off the ground. Scrapes on speed bumps. Accelerates to 60 MPH in under two seconds. Highly prestigious.",
    reputationGain: 50
  },
  {
    id: "veh_yacht",
    name: "Solar-Sail Sleek Yacht",
    category: "Yacht",
    type: "sports",
    cost: 1200000,
    monthlyMaintenance: 5500,
    description: "Equipped with a miniature putting green, champagne cooling wells, and a captain named Pierre who refuses to make eye contact.",
    reputationGain: 90
  }
];

export interface PersonalItemCatalogOption {
  id: string;
  name: string;
  category: PersonalItem["category"];
  cost: number;
  rarity: PersonalItem["rarity"];
  emotionalValue: number;
  description: string;
}

export const ITEM_OPTIONS: PersonalItemCatalogOption[] = [
  // --- Sentimental (Low cost, high emotional value) ---
  {
    id: "item_toy",
    name: "One-Eared Knitted Teddy Bear",
    category: "Sentimental",
    cost: 5,
    rarity: "common",
    emotionalValue: 95,
    description: "Smells of mothballs, attic dust, and childhood safety. Has a button for an eye and a loose paw."
  },
  {
    id: "item_photos",
    name: "Faded Polaroids Photo Album",
    category: "Sentimental",
    cost: 12,
    rarity: "common",
    emotionalValue: 88,
    description: "Captures embarrassing birthday parties, funny pet antics, and people with very wide 90s shoulder pads."
  },
  {
    id: "item_ring",
    name: "Engraved Brass Ring of Trust",
    category: "Sentimental",
    cost: 45,
    rarity: "common",
    emotionalValue: 90,
    description: "Supposedly guarantees good fortune, but mostly just leaves a faint green circle on your finger."
  },
  // --- Collectables / Antiques ---
  {
    id: "item_watch",
    name: "Precision-Bezel Chrono Watch",
    category: "Watch",
    cost: 4500,
    rarity: "rare",
    emotionalValue: 15,
    description: "Highly complex mechanics. Tells time in 4 time zones and is water resistant to depths you will never visit."
  },
  {
    id: "item_cyber_art",
    name: "Vibrant Holographic Neon Canvas",
    category: "Artwork",
    cost: 12500,
    rarity: "epic",
    emotionalValue: 20,
    description: "A painting that hums gently and shifts colors based on your heart rate. Visitors think you are deeply cultured."
  },
  {
    id: "item_antique_sword",
    name: "16th-Century Damaged Katana",
    category: "Antique",
    cost: 35000,
    rarity: "epic",
    emotionalValue: 10,
    description: "Has a slight nick in the steel from a legendary historical duel. Excellent conversation starter."
  },
  {
    id: "item_crown_jewels",
    name: "Royal Diamond Collar Pins",
    category: "Jewellery",
    cost: 185000,
    rarity: "legendary",
    emotionalValue: 5,
    description: "Snatched at a high-end auction in Switzerland. The diamonds are so bright they are visible from high orbit."
  }
];

export interface BusinessCatalogOption {
  id: string;
  name: string;
  type: Business["type"];
  cost: number;
  potentialAnnualRevenue: number;
  monthlyMaintenance: number;
  description: string;
}

export const BUSINESS_OPTIONS: BusinessCatalogOption[] = [
  {
    id: "biz_coffee",
    name: "Hyper-Roast Espresso Cart",
    type: "Shop",
    cost: 12000,
    potentialAnnualRevenue: 4500,
    monthlyMaintenance: 120,
    description: "A small mobile espresso cart with a high-pressure brass boiler. Customers complain of minor muscle twitches.",
    // 35% ROI
  },
  {
    id: "biz_pizza",
    name: "Deep-Dish Holographic Pizza parlor",
    type: "Restaurant",
    cost: 48000,
    potentialAnnualRevenue: 18000,
    monthlyMaintenance: 450,
    description: "Serves glowing, neon cheese-infused pizzas. Highly popular among tech students and late-night workers.",
    // 37% ROI
  },
  {
    id: "biz_startup",
    name: "AI-Powered Tiny Sunglasses App",
    type: "Online Startup",
    cost: 110000,
    potentialAnnualRevenue: 48000,
    monthlyMaintenance: 1100,
    description: "A virtual app matching retro sunglasses to user dogs' avatars. The metrics are slightly inflated but it works.",
    // 44% ROI
  },
  {
    id: "biz_agency",
    name: "Sleek Brick & Mortar Agency",
    type: "Real Estate Agency",
    cost: 320000,
    potentialAnnualRevenue: 155000,
    monthlyMaintenance: 3200,
    description: "Earns handsome broker fees off other people's real estate bad choices. Highly lucrative and corporate.",
    // 48% ROI
  },
  {
    id: "biz_arcade",
    name: "Cyber-Synthesizer Arcade Lounge",
    type: "Entertainment Venue",
    cost: 950000,
    potentialAnnualRevenue: 520000,
    monthlyMaintenance: 9800,
    description: "Neon dance pads, retro pinballs, and a robotic bartender that makes amazing non-toxic neon sodas.",
    // 54% ROI
  }
];

export const FUN_TENANTS_LIST = [
  { name: "Scurvy Pete", occupation: "Pirate Re-enactor", personality: "Noisy & pays in rusty gold coins", income: 1500, reliability: 45, cleanliness: 20 },
  { name: "Luna Moonglow", occupation: "Aura-Alignment Consultant", personality: "Vaporizes too much sage incense", income: 2800, reliability: 80, cleanliness: 90 },
  { name: "Brody Broson", occupation: "Crypto Leverage Broker", personality: "Breaks walls during margin calls", income: 8500, reliability: 30, cleanliness: 40 },
  { name: "Dr. Thaddeus", occupation: "Exiled Reptile Geneticist", personality: "Quiet & glowing mist under door", income: 6200, reliability: 95, cleanliness: 55 },
  { name: "Mildred Penny", occupation: "Retired Librarian", personality: "Extremely tidy, bakes hard cookies", income: 3100, reliability: 99, cleanliness: 100 },
  { name: "Gary Glitch", occupation: "Synthesizer Technician", personality: "Plays frequencies at 3 AM", income: 4200, reliability: 75, cleanliness: 60 }
];

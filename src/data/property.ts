/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RealEstate } from "../types";

export interface PropertyOption {
  id: string;
  name: string;
  propertyType: RealEstate["propertyType"];
  cost: number; // Purchase price (if buy) or monthly rent (if rent)
  type: "rent" | "own";
  monthlyMaintenance: number; // For owned properties
  potentialRent: number; // For renting to tenants
  description: string;
  happinessModifier: number;
}

export const PROPERTY_OPTIONS: PropertyOption[] = [
  // --- RENTALS ---
  {
    id: "rent_box",
    name: "Discarded Appliance Cardboard Box",
    propertyType: "Cardboard Box",
    cost: 15,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    description: "Located behind a fancy organic grocery store. Drafty, prone to getting soggy in the rain, but excellent community vibes.",
    happinessModifier: -15
  },
  {
    id: "rent_closet",
    name: "Harry Potter-esque Under-Stair Closet",
    propertyType: "Shared Room",
    cost: 180,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    description: "Your landlord calls it a 'cozy micro-studio with rustic overhead acoustics'. You can hear every time they use the toilet.",
    happinessModifier: -5
  },
  {
    id: "rent_studio",
    name: "Industrial Paint-Shed Studio",
    propertyType: "Shabby Studio",
    cost: 550,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    description: "A single room smelling strongly of lead and paint thinner. The radiator makes a screaming sound at 4 AM, but the rent is cheap.",
    happinessModifier: 0
  },
  {
    id: "rent_loft",
    name: "Exposed-Pipe Hipster Warehouse Loft",
    propertyType: "Hipster Loft",
    cost: 1200,
    type: "rent",
    monthlyMaintenance: 0,
    potentialRent: 0,
    description: "Features zero doors, a hammock, and a rent that increases every time a trendy cafe opens nearby. Highly aesthetic.",
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
    description: "Glass walls, automated gold-plated bidet, and a view of the peasants below. Guaranteed to boost your confidence.",
    happinessModifier: 30
  },

  // --- OWNERSHIP PROPERTIES ---
  {
    id: "own_hutch",
    name: "Suburban Commuter Hutch",
    propertyType: "Suburban House",
    cost: 75000,
    type: "own",
    monthlyMaintenance: 150,
    potentialRent: 650,
    description: "A small, beige wooden home. The yard is large enough for half a rosebush. The neighbors are aggressively normal.",
    happinessModifier: 10
  },
  {
    id: "own_loft_buy",
    name: "Decommissioned Steam-Room Loft",
    propertyType: "Hipster Loft",
    cost: 180000,
    type: "own",
    monthlyMaintenance: 350,
    potentialRent: 1400,
    description: "A high-ceiling loft with original copper dials and rusty pipe valves. Excellent rent potential for tech-hipsters.",
    happinessModifier: 15
  },
  {
    id: "own_penthouse_buy",
    name: "Plush Sky-Cottage Penthouse",
    propertyType: "Luxury Penthouse",
    cost: 650000,
    type: "own",
    monthlyMaintenance: 1100,
    potentialRent: 4800,
    description: "Includes private elevator, marble countertops, and soundproofing to block out the sounds of local protests.",
    happinessModifier: 25
  },
  {
    id: "own_mansion",
    name: "Eco-Fortress Solar Mansion",
    propertyType: "Eco-Mansion",
    cost: 1850000,
    type: "own",
    monthlyMaintenance: 2800,
    potentialRent: 13500,
    description: "Powered by seaweed fuel-cells, guarded by trained geese, and features a hot tub heated by the warmth of mining servers.",
    happinessModifier: 40
  }
];

export const FUN_TENANT_BACKGROUNDS = [
  { name: "Scurvy Pete", occupation: "Decommissioned Pirate Re-enactor", personality: "Noisy, pays rent in copper coins, highly unstable" },
  { name: "Luna Moonglow", occupation: "Aura-Alignment Consultant", personality: "Pleasant, burns too much incense, attempts to pay with crystals" },
  { name: "Brody Broson", occupation: "Crypto Arbitrage Trader", personality: "Hyperactive, talks about 'leverage', occasionally breaks walls" },
  { name: "Dr. Thaddeus", occupation: "Exiled Reptile Geneticist", personality: "Quiet, secretive, strange green vapors escape under the door" }
];

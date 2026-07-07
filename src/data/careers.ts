/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Career, EducationPath } from "../types";

export const EDUCATION_PATHS: EducationPath[] = [
  {
    id: "hard_knocks",
    name: "School of Hard Knocks",
    cost: 0,
    duration: 2,
    reqIntelligence: 10,
    perksDescription: "Teaches you resilience. Slightly raises Luck (+15) and Street-Smarts (+20 Morality reduction resistance)."
  },
  {
    id: "grifting_academy",
    name: "Institute of Dynamic Grifting",
    cost: 4000,
    duration: 3,
    reqIntelligence: 30,
    perksDescription: "Master the art of convincing people to give you money. Grants +25 Charisma and boosts Shady career opportunities."
  },
  {
    id: "memetics",
    name: "Academy of Modern Memetics & Hype",
    cost: 15000,
    duration: 4,
    reqIntelligence: 40,
    perksDescription: "Learn to command the internet. Grants +30 Creativity and unlocks Tech & Hype Level 3 directly."
  },
  {
    id: "corporate_compliance",
    name: "University of Corporate Compliance",
    cost: 40000,
    duration: 4,
    reqIntelligence: 55,
    perksDescription: "Excellent for desk jobs. Grants +25 Intelligence and unlocks high-tier Corporate careers immediately."
  }
];

export const CAREERS: Career[] = [
  // --- TECH & HYPE ---
  {
    id: "tech_1",
    title: "Prompt Engineering Intern",
    field: "Tech & Hype",
    salary: 18000,
    stress: 25,
    reqIntelligence: 20,
    reqCreativity: 25,
    reqCharisma: 10,
    level: 1,
    description: "Begging chatbots to write Excel macros. You are technically an 'engineer' to your non-tech friends."
  },
  {
    id: "tech_2",
    title: "Meme Curator & Slack Reaction Specialist",
    field: "Tech & Hype",
    salary: 38000,
    stress: 20,
    reqIntelligence: 30,
    reqCreativity: 45,
    reqCharisma: 20,
    level: 2,
    description: "Maintaining company culture by dropping timely, slightly edgy reaction GIFs in the #general channel."
  },
  {
    id: "tech_3",
    title: "DeFi Yield Farming Shaman",
    field: "Tech & Hype",
    salary: 85000,
    stress: 65,
    reqIntelligence: 40,
    reqCreativity: 50,
    reqCharisma: 55,
    level: 3,
    description: "Selling complex financial products named after breakfast foods. High-risk, highly volatile, and questionable legality."
  },
  {
    id: "tech_4",
    title: "AI Whisperer & Hype Evangelist",
    field: "Tech & Hype",
    salary: 160000,
    stress: 40,
    reqIntelligence: 55,
    reqCreativity: 65,
    reqCharisma: 70,
    level: 4,
    description: "Keynoting conferences where you wave your hands, say 'Autonomous Co-Agents', and receive thunderous applause."
  },
  {
    id: "tech_5",
    title: "Techno-King of the Simulated Grid",
    field: "Tech & Hype",
    salary: 550000,
    stress: 85,
    reqIntelligence: 75,
    reqCreativity: 80,
    reqCharisma: 90,
    level: 5,
    description: "You are the ultimate digital visionary. You own satellites, post unhinged messages at 3 AM, and manipulate markets with emojis."
  },

  // --- CORPORATE SLAVING ---
  {
    id: "corp_1",
    title: "Paperclip Sorting Coordinator",
    field: "Corporate Slaving",
    salary: 15000,
    stress: 15,
    reqIntelligence: 15,
    reqCreativity: 10,
    reqCharisma: 15,
    level: 1,
    description: "Separating standard size and giant paperclips. A vital, yet entirely unappreciated pillar of the department."
  },
  {
    id: "corp_2",
    title: "Spreadsheet Pastel Palette Stylist",
    field: "Corporate Slaving",
    salary: 36000,
    stress: 45,
    reqIntelligence: 40,
    reqCreativity: 30,
    reqCharisma: 20,
    level: 2,
    description: "Making sure the executive dashboard colors are 'inspiring' rather than 'depressing'. Must know basic VLOOKUP."
  },
  {
    id: "corp_3",
    title: "Middle Manager of Strategic Synergies",
    field: "Corporate Slaving",
    salary: 72000,
    stress: 70,
    reqIntelligence: 45,
    reqCreativity: 25,
    reqCharisma: 50,
    level: 3,
    description: "Running standard 3-hour meetings to define what 'alignment' means. Your reports silently dislike you."
  },
  {
    id: "corp_4",
    title: "Executive Vice President of Slide Alignments",
    field: "Corporate Slaving",
    salary: 175000,
    stress: 80,
    reqIntelligence: 60,
    reqCreativity: 35,
    reqCharisma: 75,
    level: 4,
    description: "You spend your life adjusting text boxes on slide 14. Your power is legendary, your calendar is a solid block of red."
  },
  {
    id: "corp_5",
    title: "Chief Extraction Officer (CEO)",
    field: "Corporate Slaving",
    salary: 980000,
    stress: 95,
    reqIntelligence: 70,
    reqCreativity: 40,
    reqCharisma: 85,
    level: 5,
    description: "You write emails consisting entirely of 'Pls fix' and 'Approved'. Your golden parachute is larger than some small nations' GDP."
  },

  // --- SHADY TRADES ---
  {
    id: "shady_1",
    title: "Alleyway Watch Counterfeit Retailer",
    field: "Shady Trades",
    salary: 11000,
    stress: 40,
    reqIntelligence: 15,
    reqCreativity: 25,
    reqCharisma: 30,
    level: 1,
    description: "Selling 'Rolecks' and 'Omegle' watches out of a long trenchcoat. Fast feet required."
  },
  {
    id: "shady_2",
    title: "Untaxed Sugarwater Purveyor",
    field: "Shady Trades",
    salary: 28000,
    stress: 30,
    reqIntelligence: 25,
    reqCreativity: 30,
    reqCharisma: 45,
    level: 2,
    description: "Brewing and selling hyper-caffeinated energy mixtures in local gyms. Technically illegal in 14 countries, but highly effective."
  },
  {
    id: "shady_3",
    title: "Laundry Appliance Laundering Consultant",
    field: "Shady Trades",
    salary: 62000,
    stress: 55,
    reqIntelligence: 50,
    reqCreativity: 40,
    reqCharisma: 60,
    level: 3,
    description: "You advise small car washes on how to clean cash using old coin laundry dryers. High integrity, low morality."
  },
  {
    id: "shady_4",
    title: "VIP Underground Casino Administrator",
    field: "Shady Trades",
    salary: 140000,
    stress: 70,
    reqIntelligence: 60,
    reqCreativity: 45,
    reqCharisma: 70,
    level: 4,
    description: "Managing secret poker matches for high-society politicians. Exciting, highly profitable, but you occasionally sleep with one eye open."
  },
  {
    id: "shady_5",
    title: "Crime Syndicate HR Representative",
    field: "Shady Trades",
    salary: 490000,
    stress: 80,
    reqIntelligence: 70,
    reqCreativity: 55,
    reqCharisma: 85,
    level: 5,
    description: "You handle benefits, non-disclosure agreements, and exit-interviews (which are literal exits) for a global mafia."
  },

  // --- ARTS & LOAFING ---
  {
    id: "art_1",
    title: "Professional Line Stander",
    field: "Arts & Loafing",
    salary: 19000,
    stress: 10,
    reqIntelligence: 10,
    reqCreativity: 15,
    reqCharisma: 20,
    level: 1,
    description: "You stand in line for trendy brunch spots, expensive clothing drops, or governmental permits. Good shoes are essential."
  },
  {
    id: "art_2",
    title: "Vandalism-Accredited Subway Muralist",
    field: "Arts & Loafing",
    salary: 31000,
    stress: 30,
    reqIntelligence: 25,
    reqCreativity: 50,
    reqCharisma: 30,
    level: 2,
    description: "Spray-painting profound, highly satirical rats on urban structures. Commuters find it either deep or annoying."
  },
  {
    id: "art_3",
    title: "Subway Interpretive Human Statue",
    field: "Arts & Loafing",
    salary: 54000,
    stress: 25,
    reqIntelligence: 30,
    reqCreativity: 65,
    reqCharisma: 55,
    level: 3,
    description: "Standing perfectly still covered in copper paint until someone drops a quarter, then performing a robotic wave. Absolute leg core strength required."
  },
  {
    id: "art_4",
    title: "Avant-Garde Silenced Audio Composer",
    field: "Arts & Loafing",
    salary: 95000,
    stress: 15,
    reqIntelligence: 45,
    reqCreativity: 85,
    reqCharisma: 65,
    level: 4,
    description: "Creating full albums of high-fidelity ambient silence. Critically acclaimed by elite journals, streamed by millions falling asleep."
  },
  {
    id: "art_5",
    title: "Accidental Pop-Art Cultural Icon",
    field: "Arts & Loafing",
    salary: 380000,
    stress: 50,
    reqIntelligence: 55,
    reqCreativity: 95,
    reqCharisma: 85,
    level: 5,
    description: "You spilled soup on a canvas, got recorded saying something silly, and now elite museums pay hundreds of thousands for your signature."
  }
];

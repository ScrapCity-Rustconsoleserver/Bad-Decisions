/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Globe, Heart, Shield, RotateCw, Play, ChevronRight, 
  Volume2, VolumeX, Eye, Info, User, Compass, Cloud, MapPin, 
  UserX, Laugh, Award, MessageSquare, DollarSign
} from "lucide-react";
import { Gender, Appearance, PlayerStats, NPC } from "../types";
import { AvatarRenderer } from "./AvatarRenderer";

interface CharacterCreatorProps {
  onStartGame: (
    name: string,
    gender: Gender,
    appearance: Appearance,
    traitName: string,
    initialStats: PlayerStats,
    extraStartingData?: any
  ) => void;
}

// Ridiculous options to ask God
const RIDICULOUS_CHOICES = [
  { emoji: "🐉", label: "Dragon", desc: "Breathe fire, hoard shiny gold, fly above regulations." },
  { emoji: "🐈", label: "Cat", desc: "Sleep 18 hours, knock cups off tables, be worshiped." },
  { emoji: "👑", label: "Billionaire", desc: "Buy space rockets, build questionable bunkers, skip taxes." },
  { emoji: "🦖", label: "Dinosaur", desc: "Rawr loudly, stomp on spreadsheets, avoid meteors." },
  { emoji: "👽", label: "Alien", desc: "Beam up farmers, write Crop Circles, probe bureaucracies." },
  { emoji: "🧙", label: "Wizard", desc: "Cast fireballs, wear glowing velvet robes, speak gibberish." },
  { emoji: "🧛", label: "Vampire", desc: "Sleep in a coffin, bite necks, avoid garlic bread." },
  { emoji: "🦈", label: "Shark", desc: "Swim fast, bite surfers, star in dramatic documentaries." },
  { emoji: "🚀", label: "Space Pirate", desc: "Plunder interstellar cargo, drink space rum, wear neon eye-patches." },
  { emoji: "🐸", label: "Frog", desc: "Sit on a moist lily pad, eat flies, scream at Wednesdays." },
  { emoji: "Parrot", emoji2: "🦜", label: "Parrot", desc: "Repeat insults, steal salty crackers, live 80 years." },
  { emoji: "💀", label: "Immortal Skeleton", desc: "Rattle bones, ignore vital organs, play xylophone ribs." },
  { emoji: "🤖", label: "Cybernetic Toaster", desc: "Burn bread perfectly, launch minor cyberattacks." },
  { emoji: "🥔", label: "Sentient Potato", desc: "Lie in warm dirt, watch the universe pass, look round." }
];

// God's sarcastic rejections
const SARCASTIC_REJECTIONS = [
  "Absolutely not.",
  "Those are reserved for premium souls.",
  "I admire the optimism.",
  "You've definitely not earned that.",
  "Maybe after another few hundred lifetimes.",
  "I've already got too many of those running around.",
  "HR said absolutely no.",
  "We are currently fresh out of those.",
  "Nice try, kid.",
  "Server capacity exceeded. Downgrading to standard.",
  "A bold choice. Denied.",
  "Let's stick to what we have in stock."
];

// God's final words
const GOD_FINAL_WORDS = [
  "Good luck.",
  "Don't lick any batteries this time.",
  "Maybe avoid pyramid schemes.",
  "Try being nicer to your neighbours.",
  "Please stop committing tax fraud.",
  "Let's see how long this one lasts.",
  "Don't waste it.",
  "I'll be watching...",
  "Remember, gravity is not a suggestion.",
  "If you see a suspicious red button, push it.",
  "Unicycles are significantly harder than they look."
];

// Countries with matching cities, cultures, politics, and weather
const GEOGRAPHY_DATABASE = [
  {
    country: "Japan",
    cities: ["Tokyo", "Osaka", "Kyoto", "Sapporo"],
    religion: "Cult of the Golden Turnip",
    politics: "Bureaucracy of Coffee Addicts",
    culture: "Obsessive line-standing and high-speed bows",
    weather: "Sporadic warm soup rain",
    firstNamesMale: ["Kenji", "Hiroshi", "Yuki", "Sora", "Takashi", "Daiki"],
    firstNamesFemale: ["Sakura", "Hana", "Aoi", "Yui", "Mei", "Nanami"],
    lastNames: ["Tanaka", "Sato", "Watanabe", "Takahashi", "Nakamura", "Kobayashi"]
  },
  {
    country: "United States",
    cities: ["New York", "Austin", "Detroit", "Seattle", "Miami"],
    religion: "Worship of the Grand Spreadsheet",
    politics: "Sarcastic Board of Directors",
    culture: "Extreme coffee consumption and anti-tax-fraud patrol",
    weather: "Cozy breeze with a trace of cheese forecasts",
    firstNamesMale: ["Buster", "Chad", "Reginald", "Spenny", "Barnaby", "Ziggy"],
    firstNamesFemale: ["Mildred", "Daisy", "Beatrice", "Wanda", "Euphemia", "Gertrude"],
    lastNames: ["McWacky", "Snape", "Snodgrass", "Wiggleworth", "Flapjack", "Butterworth"]
  },
  {
    country: "Brazil",
    cities: ["Rio de Janeiro", "São Paulo", "Salvador", "Manaus"],
    religion: "Samba Devotionist",
    politics: "Neo-Anarchist Coffee Collective",
    culture: "Passionate beach soccer and high-IQ flip-flop engineering",
    weather: "Constant blistering heat and mango drizzle",
    firstNamesMale: ["Thiago", "Matheus", "Lucas", "Gabriel", "Rodrigo", "Bruno"],
    firstNamesFemale: ["Camila", "Isabella", "Beatriz", "Larissa", "Juliana", "Mariana"],
    lastNames: ["Silva", "Santos", "Oliveira", "Costa", "Souza", "Pereira"]
  },
  {
    country: "France",
    cities: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    religion: "Existential Baguettism",
    politics: "Supreme Syndicate of Bakers",
    culture: "Dramatically sighing at tourists and butter appreciation",
    weather: "Cozy grey drizzle with high existential dread",
    firstNamesMale: ["Pierre", "Jean-Luc", "Antoine", "Mathieu", "Guillaume", "Hugo"],
    firstNamesFemale: ["Amélie", "Chloé", "Léa", "Manon", "Camille", "Clara"],
    lastNames: ["Dubois", "Martin", "Moreau", "Bernard", "Petit", "Richard"]
  },
  {
    country: "Sweden",
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
    religion: "IKEA Furniture Alignment Sect",
    politics: "Feudal Tech Republic",
    culture: "Avoider of direct eye contact and cinnamon bun worship",
    weather: "Sub-zero frost with occasional glow-in-the-dark snow",
    firstNamesMale: ["Björn", "Gustav", "Sven", "Erik", "Lars", "Olof"],
    firstNamesFemale: ["Freja", "Astrid", "Elin", "Saga", "Ebba", "Maja"],
    lastNames: ["Lindqvist", "Andersson", "Larsson", "Nilsson", "Eriksson", "Svensson"]
  },
  {
    country: "India",
    cities: ["Mumbai", "New Delhi", "Bangalore", "Kolkata", "Chennai"],
    religion: "Cricket Pantheism",
    politics: "Technocratic High-Frequency Trading Assembly",
    culture: "Competitive wedding-dance planning and absolute spice dominance",
    weather: "Oppressive heatwaves followed by dynamic umbrella tests",
    firstNamesMale: ["Aarav", "Rajesh", "Amit", "Rahul", "Vijay", "Arjun"],
    firstNamesFemale: ["Ananya", "Priya", "Divya", "Neha", "Kavita", "Aditi"],
    lastNames: ["Sharma", "Patel", "Kumar", "Iyer", "Singh", "Mehta"]
  },
  {
    country: "Nigeria",
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
    religion: "Pastafarianism of Jollof Rice",
    politics: "Council of Legendary Elders",
    culture: "Loud celebratory dancing and competitive family group chats",
    weather: "Warm humid winds with sudden lightning solos",
    firstNamesMale: ["Chidi", "Babatunde", "Tobi", "Emeka", "Segun", "Femi"],
    firstNamesFemale: ["Amara", "Chioma", "Yinka", "Funmi", "Sade", "Zainab"],
    lastNames: ["Okeke", "Balogun", "Adebayo", "Nwachukwu", "Okonkwo", "Eze"]
  },
  {
    country: "Italy",
    cities: ["Rome", "Milan", "Naples", "Florence", "Venice"],
    religion: "Holy Order of the Al Dente",
    politics: "Espresso Junta",
    culture: "Intense hand-gesturing and absolute rejection of pineapple",
    weather: "Sun-drenched olive breeze with high static electricity",
    firstNamesMale: ["Giovanni", "Matteo", "Marco", "Alessandro", "Luca", "Francesco"],
    firstNamesFemale: ["Francesca", "Giulia", "Sofia", "Chiara", "Elena", "Giorgia"],
    lastNames: ["Rossi", "Bianchi", "Ferrari", "Ricci", "Marino", "Russo"]
  }
];

// Funny random starting traits
const FUNNY_TRAITS = [
  { name: "Caffeine Dependent", desc: "Can align spreadsheets at 4x speed, but will crash instantly if denied dark roast." },
  { name: "Sarcastic Genius", desc: "Extremely smart and creative, but completely insufferable and pessimistic." },
  { name: "Gravity Defiant", desc: "Has an unusual tendency to trip upwards. Avoid stairs and banana peels." },
  { name: "Cryptid Seeker", desc: "Spends nights whispering to local pigeons. High luck, suspicious reputation." },
  { name: "Accident-Prone", desc: "Statistically likely to get stuck in revolving doors. Constant physical stress." },
  { name: "Impulsive Slacker", desc: "Blessed with incredible luck and a carefree attitude, but struggles with focus." },
  { name: "Anxious Overachiever", desc: "Sprints through exams, but possesses near-zero mental stability and double stress." },
  { name: "Charismatic Grifter", desc: "Incredibly handsome. Understands human leverage, but has questionable ethics." },
  { name: "Llama Whisperer", desc: "Animals trust you implicitly, though humans suspect you smell faintly of hay." }
];

// Procedural funny family histories
const FAMILY_HISTORIES = [
  "Your parents met at an anti-unicycle rally. Your father was trading turnip stocks and your mother was a professional line-stander. They welcomed you with mixed feelings of joy and financial panic.",
  "Your parents met in an elevator while holding identical bags of premium garlic. Your birth was heralded by a rare double-rainbow that smelled faintly of toasted cheese.",
  "You were born during an intense solar eclipse. Your father was attempting to build a perpetual motion toaster and your mother was cataloging rare moss. They claim you were delivered by a confused goose.",
  "Your parents met on a high-speed corporate transit pod. They bonded over their mutual hatred of low-contrast spreadsheets. You were born in a local clinic decorated entirely in sticky notes.",
  "Your mother was a legendary virtual line-stander and your father was a low-frequency unicycle safety inspector. Your family history is mostly lost in an accidental cloud-deletion incident in 2024."
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onStartGame }) => {
  const [cinematicStep, setCinematicStep] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");
  const [choicesList, setChoicesList] = useState<any[]>([]);
  const [selectedRidiculous, setSelectedRidiculous] = useState<any>(null);
  const [godResponse, setGodResponse] = useState("");
  const [finalWords, setFinalWords] = useState("");

  // Random birth sheet data (kept in state for Step 10)
  const [birthSheet, setBirthSheet] = useState<any>(null);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodeRef = useRef<GainNode | null>(null);

  // Dialog dialogues
  const godDialogues = [
    "Welcome back.",
    "I see you've managed to die again.",
    "...Some of those decisions were certainly... creative.",
    "So...",
    "What would you like to be in your next life?"
  ];

  // Initialize randomized ridiculously choices
  useEffect(() => {
    // Pick 3 random ridiculous choices
    const shuffled = [...RIDICULOUS_CHOICES].sort(() => 0.5 - Math.random());
    setChoicesList(shuffled.slice(0, 3));
  }, []);

  // Audio Engine functions using Web Audio API
  const startBackgroundMusic = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create main gain node for drone
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.06, ctx.currentTime);
      mainGain.connect(ctx.destination);
      droneNodeRef.current = mainGain;

      // 3 Oscillator nodes playing a warm cosmic major 7th chord (C3, G3, E4)
      const oscs = [130.81, 196.00, 329.63].map((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = index === 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Add subtle pitch LFO for strings vibration
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.4 + Math.random() * 0.3, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        // Slowly modulate gain to create cloud floating volume swell
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
        
        osc.connect(gain);
        gain.connect(mainGain);
        osc.start();
        return { osc, gain, lfo };
      });

      // Keep track of active audio elements if needed
    } catch (e) {
      console.warn("Web Audio failed to start:", e);
    }
  };

  const stopBackgroundMusic = () => {
    if (droneNodeRef.current) {
      try {
        droneNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current?.currentTime || 0 + 1);
      } catch (e) {}
    }
  };

  // Sound effects
  const playFlashTransitionSfx = () => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      // Synthesize deep falling wind whoosh sweep
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 2.5);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {}
  };

  const playBabyCrySfx = () => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      // Procedural cute baby wah-wah cry
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + 1.8 + (i * 0.5);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(780, start);
        osc.frequency.linearRampToValueAtTime(540, start + 0.35);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      }
    } catch (e) {}
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute) {
      // Unmuting, start background
      setTimeout(() => {
        startBackgroundMusic();
      }, 50);
    } else {
      stopBackgroundMusic();
    }
  };

  // Run typewriter effect for dialogues
  useEffect(() => {
    if (cinematicStep >= 2 && cinematicStep <= 6) {
      const currentDialogue = godDialogues[cinematicStep - 2];
      let i = 0;
      setTypewriterText("");
      const interval = setInterval(() => {
        if (i < currentDialogue.length) {
          setTypewriterText((prev) => prev + currentDialogue.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [cinematicStep]);

  // Step 0 -> Step 1 -> Step 2 auto timers
  useEffect(() => {
    if (cinematicStep === 0) {
      const t = setTimeout(() => {
        setCinematicStep(1);
      }, 1500);
      return () => clearTimeout(t);
    } else if (cinematicStep === 1) {
      const t = setTimeout(() => {
        setCinematicStep(2);
        startBackgroundMusic();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [cinematicStep]);

  // Generate complete random birth sheet
  const generateRandomBirthSheet = () => {
    // 1. Geography, culture & environment
    const geo = GEOGRAPHY_DATABASE[Math.floor(Math.random() * GEOGRAPHY_DATABASE.length)];
    const city = geo.cities[Math.floor(Math.random() * geo.cities.length)];
    
    // 2. Gender
    const genderRoll = Math.random();
    const gender = genderRoll < 0.45 ? Gender.MALE : genderRoll < 0.90 ? Gender.FEMALE : Gender.NON_BINARY;
    
    // 3. Name
    let firstName = "";
    if (gender === Gender.MALE) {
      firstName = geo.firstNamesMale[Math.floor(Math.random() * geo.firstNamesMale.length)];
    } else if (gender === Gender.FEMALE) {
      firstName = geo.firstNamesFemale[Math.floor(Math.random() * geo.firstNamesFemale.length)];
    } else {
      // Mixed
      const pool = [...geo.firstNamesMale, ...geo.firstNamesFemale];
      firstName = pool[Math.floor(Math.random() * pool.length)];
    }
    const lastName = geo.lastNames[Math.floor(Math.random() * geo.lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    // 4. Family Wealth Class
    const classRoll = Math.random();
    let wealthClass = "Middle Class";
    let startingCash = 250;
    let wealthDesc = "in a comfortable brick apartment.";
    
    if (classRoll < 0.40) {
      wealthClass = "Struggling";
      startingCash = Math.floor(10 + Math.random() * 20);
      wealthDesc = "in a tattered cardboard draft house, struggling to purchase synthetic noodles.";
    } else if (classRoll < 0.75) {
      wealthClass = "Working Class";
      startingCash = Math.floor(80 + Math.random() * 70);
      wealthDesc = "in a cramped but cozy multi-family brick tenement.";
    } else if (classRoll < 0.93) {
      wealthClass = "Middle Class";
      startingCash = Math.floor(200 + Math.random() * 150);
      wealthDesc = "in a pleasant suburban neighborhood with a reliable used hover-sedan.";
    } else if (classRoll < 0.99) {
      wealthClass = "Upper Class";
      startingCash = Math.floor(1200 + Math.random() * 1300);
      wealthDesc = "in a secure gated suburban mansion with an automated virtual golf cart.";
    } else {
      wealthClass = "Multi-Millionaire";
      startingCash = Math.floor(15000 + Math.random() * 25000);
      wealthDesc = "with a vast trust fund portfolio and three personal pediatric lawyers.";
    }

    // 5. Appearance
    const skinColorPalette = ["#FCE5CD", "#E6B8AF", "#8C5A47", "#E0AC69", "#C59062", "#D4A373", "#5C382A", "#3A2218"];
    const skinColor = skinColorPalette[Math.floor(Math.random() * skinColorPalette.length)];
    const hairStyle = ["bald", "short", "curly", "long", "punk", "afro"][Math.floor(Math.random() * 6)];
    const hairColor = ["#e69138", "#434343", "#7c2d12", "#cccccc", "#ef4444", "#3b82f6", "#22c55e", "#ec4899"][Math.floor(Math.random() * 8)];
    const eyeColor = ["#3d85c6", "#274e13", "#783f04", "#ef4444", "#f59e0b"][Math.floor(Math.random() * 5)];
    const clothing = ["casual", "suit", "rags", "hipster", "pajamas"][Math.floor(Math.random() * 5)];
    const accessory = Math.random() < 0.85 ? "none" : ["glasses", "sunglasses", "clown_nose", "monocle"][Math.floor(Math.random() * 4)];

    // 6. Stats (Completely randomized starting stats)
    const stats: PlayerStats = {
      health: Math.floor(40 + Math.random() * 55),
      happiness: Math.floor(40 + Math.random() * 50),
      sanity: Math.floor(40 + Math.random() * 50),
      luck: Math.floor(10 + Math.random() * 90),
      strength: Math.floor(20 + Math.random() * 60),
      fitness: Math.floor(20 + Math.random() * 60),
      attractiveness: Math.floor(20 + Math.random() * 75),
      charisma: Math.floor(20 + Math.random() * 75),
      intelligence: Math.floor(20 + Math.random() * 75),
      creativity: Math.floor(20 + Math.random() * 75),
      fame: 0,
      reputation: Math.floor(10 + Math.random() * 30),
      morality: Math.floor(10 + Math.random() * 85),
      stress: Math.floor(10 + Math.random() * 35)
    };

    // 7. Starting Trait
    const startingTrait = FUNNY_TRAITS[Math.floor(Math.random() * FUNNY_TRAITS.length)];

    // 8. Parents Setup
    const momAge = Math.floor(18 + Math.random() * 25);
    const dadAge = momAge + Math.floor(Math.random() * 10 - 2);
    
    const momOcc = ["Professional Line Stander", "Coffee Transport Coordinator", "Quantum Accountant", "Virtual Dog Walker", "Recess Arbitrageur", "Organic Cheese Consultant", "Unemployed Philosopher"][Math.floor(Math.random() * 7)];
    const dadOcc = ["Spreadsheet Optimizer", "Moist Moss Cataloguer", "Virtual Unicycle Safety Inspector", "Toaster Mechanic", "Internet Historian", "Low-Frequency Alarm Tester", "Cat Massage Therapist"][Math.floor(Math.random() * 7)];
    
    const parentPersonalities = ["Overprotective & Loud", "Sarcastic & Carefree", "Deeply Confused", "Vaguely Suspicious", "Aggressively Optimistic", "Quiet & Intellectual"];
    const momPers = parentPersonalities[Math.floor(Math.random() * parentPersonalities.length)];
    const dadPers = parentPersonalities[Math.floor(Math.random() * parentPersonalities.length)];

    const momName = `${geo.firstNamesFemale[Math.floor(Math.random() * geo.firstNamesFemale.length)]} ${lastName}`;
    const dadName = `${geo.firstNamesMale[Math.floor(Math.random() * geo.firstNamesMale.length)]} ${lastName}`;

    const initialNPCs: NPC[] = [
      {
        id: "mom",
        name: momName,
        gender: Gender.FEMALE,
        relationType: "Parent",
        relationValue: Math.floor(60 + Math.random() * 35),
        age: momAge,
        isAlive: true,
        occupation: momOcc,
        personality: momPers,
        memories: []
      },
      {
        id: "dad",
        name: dadName,
        gender: Gender.MALE,
        relationType: "Parent",
        relationValue: Math.floor(55 + Math.random() * 40),
        age: dadAge,
        isAlive: true,
        occupation: dadOcc,
        personality: dadPers,
        memories: []
      }
    ];

    // 9. Siblings
    const sibsCount = Math.random() < 0.55 ? 0 : Math.random() < 0.75 ? 1 : Math.random() < 0.92 ? 2 : 3;
    const siblingNames: string[] = [];
    for (let s = 0; s < sibsCount; s++) {
      const sGender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
      const sName = sGender === Gender.MALE 
        ? geo.firstNamesMale[Math.floor(Math.random() * geo.firstNamesMale.length)]
        : geo.firstNamesFemale[Math.floor(Math.random() * geo.firstNamesFemale.length)];
      const sibAge = Math.floor(1 + Math.random() * 9);
      
      initialNPCs.push({
        id: `sibling_${s}`,
        name: `${sName} ${lastName}`,
        gender: sGender,
        relationType: "Sibling",
        relationValue: Math.floor(50 + Math.random() * 45),
        age: sibAge,
        isAlive: true,
        occupation: sibAge <= 4 ? "Professional Thumb-Sucker" : "Playground Diplomat",
        personality: parentPersonalities[Math.floor(Math.random() * parentPersonalities.length)],
        memories: []
      });
      siblingNames.push(`${sName} (Age ${sibAge})`);
    }

    // 10. Geography-based Weather & World Conditions
    const worldCondition = {
      economy: (["normal", "boom", "recession", "depression"][Math.floor(Math.random() * 4)]) as any,
      politicalClimate: geo.politics,
      weather: geo.weather
    };

    // 11. Family History
    const familyHistory = FAMILY_HISTORIES[Math.floor(Math.random() * FAMILY_HISTORIES.length)];
    const birthYear = 2026 + Math.floor(Math.random() * 60);

    const sheet = {
      fullName,
      gender,
      country: geo.country,
      city,
      religion: geo.religion,
      politicalClimate: geo.politics,
      culture: geo.culture,
      weather: geo.weather,
      birthYear,
      wealthClass,
      startingCash,
      wealthDesc,
      skinColor,
      hairStyle,
      hairColor,
      eyeColor,
      clothing,
      accessory,
      stats,
      startingTrait,
      npcs: initialNPCs,
      siblingNames,
      familyHistory
    };

    setBirthSheet(sheet);
    return sheet;
  };

  // Skip introduction directly to Random Birth Certificate
  const handleSkipIntro = () => {
    stopBackgroundMusic();
    const sheet = generateRandomBirthSheet();
    // Spooky wind transition
    playFlashTransitionSfx();
    // Jump straight to Certificate screen (cinematicStep 10)
    setCinematicStep(10);
  };

  const handleSelectRidiculous = (choice: any) => {
    setSelectedRidiculous(choice);
    // God pauses, sighs, and replies
    const randomReject = SARCASTIC_REJECTIONS[Math.floor(Math.random() * SARCASTIC_REJECTIONS.length)];
    setGodResponse(randomReject);
    setCinematicStep(7);

    // After a delay, show God smiling and saying "Human it is"
    setTimeout(() => {
      setCinematicStep(8);
    }, 3200);
  };

  const handleLaunchHumanTransition = () => {
    const sheet = generateRandomBirthSheet();
    setCinematicStep(9);
    // Wind Whoosh sound
    playFlashTransitionSfx();
    // Baby cries
    playBabyCrySfx();

    // Randomize God's final words
    const randomWords = GOD_FINAL_WORDS[Math.floor(Math.random() * GOD_FINAL_WORDS.length)];
    setFinalWords(randomWords);

    // Transit to birth certificate card
    setTimeout(() => {
      setCinematicStep(10);
    }, 4500);
  };

  const handleStartLifetime = () => {
    if (!birthSheet) return;
    
    // Construct the Appearance object
    const appearance: Appearance = {
      skinColor: birthSheet.skinColor,
      hairStyle: birthSheet.hairStyle,
      hairColor: birthSheet.hairColor,
      eyeColor: birthSheet.eyeColor,
      clothing: birthSheet.clothing,
      accessory: birthSheet.accessory,
      facialExpression: "neutral"
    };

    // Birth timeline log text
    const birthText = `🍼 Born in ${birthSheet.city}, ${birthSheet.country}. You were born ${birthSheet.gender.toLowerCase()} in a ${birthSheet.wealthClass.toLowerCase()} family, ${birthSheet.wealthDesc} Culture: ${birthSheet.culture}. Religion: ${birthSheet.religion}. Trait: ${birthSheet.startingTrait.name}. ${birthSheet.familyHistory}`;

    const birthHistoryLog = {
      age: 0,
      text: birthText,
      type: "birth" as const
    };

    // Start!
    onStartGame(
      birthSheet.fullName,
      birthSheet.gender,
      appearance,
      birthSheet.startingTrait.name,
      birthSheet.stats,
      {
        cash: birthSheet.startingCash,
        netWorth: birthSheet.startingCash,
        npcs: birthSheet.npcs,
        history: [birthHistoryLog],
        yearlyFocus: "health",
        calendarYear: birthSheet.birthYear,
        worldCondition: {
          economy: "normal",
          politicalClimate: birthSheet.politicalClimate,
          weather: birthSheet.weather
        },
        traits: [birthSheet.startingTrait.name, birthSheet.wealthClass],
        activeNews: [
          `📰 WORLD TELEGRAPH (${birthSheet.birthYear}): A chaotic newborn named ${birthSheet.fullName} draws first breath in ${birthSheet.city}. Local fortune tellers panic.`,
          `🌧️ LOCAL WEATHER: ${birthSheet.weather} reported over the maternity ward.`
        ]
      }
    );
  };

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-slate-950 text-slate-100 relative overflow-hidden animate-fade-in font-sans">
      
      {/* Absolute Header: Sound Controls & Skip Intro */}
      <div className="absolute top-2 left-0 w-full z-40 px-4 flex justify-between items-center pointer-events-auto">
        <button
          onClick={handleToggleMute}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
          title="Toggle Audio Soundtrack"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Sound On</span>
            </>
          )}
        </button>

        {cinematicStep < 10 && (
          <button
            onClick={handleSkipIntro}
            className="bg-indigo-950/40 hover:bg-indigo-900 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1"
          >
            Skip Intro
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Cinematic Content Viewport */}
      <div className="flex-grow flex flex-col justify-center items-center p-6 relative h-full">

        {/* STEP 0: PURE BLACK SCREEN FADING TO GATES */}
        {cinematicStep === 0 && (
          <div className="text-center space-y-4 animate-pulse">
            <span className="text-[10px] tracking-[0.25em] font-mono text-slate-600 font-extrabold block uppercase">Initializing Afterlife Space</span>
            <div className="w-20 h-0.5 bg-slate-800 mx-auto rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-indigo-500 rounded-full animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
        )}

        {/* STEP 1 TO 8: ENDLESS CLOUDS & MEET GOD */}
        {cinematicStep >= 1 && cinematicStep <= 8 && (
          <div className="w-full text-center flex flex-col items-center justify-center space-y-6 relative h-full">
            
            {/* Glowing Golden Heaven Gates & Background Clouds */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col items-center justify-center opacity-40">
              <div className="absolute top-1/4 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-[80px]"></div>
              
              {/* Golden Gates SVG */}
              <svg viewBox="0 0 100 100" className="w-48 h-48 opacity-25 filter blur-[1px] animate-[pulse_6s_infinite]" xmlns="http://www.w3.org/2000/svg">
                <path d="M 15 80 L 15 35 A 35 35 0 0 1 85 35 L 85 80" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
                <path d="M 50 80 L 50 20" stroke="#fcd34d" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="50" cy="20" r="2.5" fill="#fcd34d" />
              </svg>

              {/* Floating Clouds Layer */}
              <div className="absolute bottom-5 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
              <Cloud className="absolute bottom-4 left-6 text-slate-800/40 w-16 h-16 animate-[bounce_4s_infinite]" />
              <Cloud className="absolute bottom-8 right-10 text-slate-800/30 w-20 h-20 animate-[bounce_5s_infinite_1s]" />
              <Cloud className="absolute top-16 left-12 text-slate-900/20 w-14 h-14 animate-[bounce_6s_infinite]" />
            </div>

            {/* Mysterious Approaching Figure of God */}
            <div className="relative shrink-0 mb-4 h-36 flex items-center justify-center">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/30 to-amber-500/20 border-2 border-indigo-400/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all duration-1000 ${
                cinematicStep >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}>
                {/* God's humor halo */}
                <div className="absolute -top-3 w-16 h-4 border border-amber-300/60 rounded-full transform -rotate-12 shadow-[0_0_15px_rgba(252,211,77,0.5)] animate-bounce"></div>
                
                {/* Ethereal eyes */}
                <div className="flex gap-4 opacity-75">
                  <span className="text-xl font-black text-indigo-200 tracking-widest animate-pulse">●</span>
                  <span className="text-xl font-black text-indigo-200 tracking-widest animate-pulse">●</span>
                </div>

                {/* Shifting background sparks */}
                <Sparkles className="w-6 h-6 text-amber-300 absolute -bottom-2 -right-2 animate-spin" />
              </div>
            </div>

            {/* Title / Name Badge */}
            {cinematicStep >= 2 && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400">
                GOD (THE SUPREME CREATOR)
              </span>
            )}

            {/* Interactive Sarcastic Dialogue Board */}
            <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl max-w-sm min-h-24 flex items-center justify-center relative shadow-xl backdrop-blur-sm z-10 w-full">
              <p className="text-sm font-semibold leading-relaxed tracking-wide text-slate-200 text-center italic">
                "{typewriterText || "..."}"
              </p>
            </div>

            {/* Continue Controls */}
            {cinematicStep >= 1 && cinematicStep < 6 && (
              <button
                onClick={() => {
                  if (cinematicStep === 1) {
                    setCinematicStep(2);
                    startBackgroundMusic();
                  } else {
                    setCinematicStep((prev) => prev + 1);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-full flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer uppercase tracking-widest border-t border-white/10 z-10"
              >
                {cinematicStep === 1 ? "Approach the Divine" : "Continue"}
                <Play className="w-3 h-3 fill-white" />
              </button>
            )}

            {/* Ridiculous Options Box (Cinematic step 6) */}
            {cinematicStep === 6 && typewriterText.endsWith("?") && (
              <div className="w-full max-w-sm space-y-2.5 z-10 animate-fade-in pt-2">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">CHOOSE YOUR PREFERRED OUTCOME</p>
                <div className="grid grid-cols-1 gap-2">
                  {choicesList.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRidiculous(ch)}
                      className="bg-slate-900/95 hover:bg-indigo-950 border border-indigo-500/10 hover:border-indigo-500/40 p-3 rounded-xl text-left flex items-center gap-3 w-full group transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span className="text-2xl filter drop-shadow">{ch.emoji || ch.emoji2}</span>
                      <div className="flex-grow">
                        <span className="font-extrabold text-xs text-white block group-hover:text-amber-400 transition-colors uppercase tracking-wider">{ch.label}</span>
                        <span className="text-[9px] text-slate-400 leading-snug mt-0.5 block">{ch.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sarcastic rejection (Cinematic step 7) */}
            {cinematicStep === 7 && (
              <div className="space-y-4 animate-fade-in z-10">
                <div className="flex justify-center items-center gap-2">
                  <span className="text-2xl">{selectedRidiculous?.emoji}</span>
                  <span className="text-xs font-black uppercase text-rose-400 line-through tracking-wider">{selectedRidiculous?.label} REQUESTED</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 text-slate-400 italic font-mono text-xs p-3.5 rounded-xl block max-w-xs">
                  "{godResponse}"
                </div>
              </div>
            )}

            {/* Smile: Human it is (Cinematic step 8) */}
            {cinematicStep === 8 && (
              <div className="space-y-4 animate-fade-in z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-extrabold">CREATION DECREE APPROVED</span>
                <p className="text-xl font-black text-white tracking-tight uppercase">"Human it is."</p>
                
                <button
                  onClick={handleLaunchHumanTransition}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs px-8 py-4 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer uppercase tracking-widest border-t border-white/20"
                >
                  ✨ Accept Reincarnation
                </button>
              </div>
            )}

          </div>
        )}

        {/* STEP 9: TRANSITIONAL RE-ENTRY ZOOM FADE */}
        {cinematicStep === 9 && (
          <div className="absolute inset-0 bg-white flex flex-col justify-center items-center text-center p-6 z-50 animate-flash-fade overflow-hidden">
            {/* Rapid speed lines and zooming clouds simulated with CSS */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="absolute w-[300%] h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rotate-45 transform scale-[2] animate-[dash_1s_infinite]"></div>
              <div className="absolute w-[300%] h-1.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent -rotate-12 transform scale-[2.5] animate-[dash_1.5s_infinite]"></div>
              <div className="absolute w-[300%] h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-transparent rotate-90 transform scale-[1.8] animate-[dash_0.8s_infinite]"></div>
            </div>

            <div className="space-y-3 z-10 max-w-xs text-slate-900">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block animate-ping">CRITICAL RE-ENTRY</span>
              <h2 className="text-3xl font-black tracking-tight leading-none uppercase text-slate-950">FALLING TO EARTH...</h2>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed italic mt-2">
                Accelerating through stratospheric clouds. Hospital coordinates locked. Starting heart monitor...
              </p>
            </div>
          </div>
        )}

        {/* STEP 10: HOSPITAL BIRTHING CERTIFICATE SCREEN */}
        {cinematicStep === 10 && birthSheet && (
          <div className="w-full space-y-4 animate-fade-in h-full flex flex-col justify-between overflow-y-auto scrollbar pb-2 pt-6">
            
            <div className="space-y-4">
              {/* Header block with baby cries notification */}
              <div className="text-center space-y-1">
                <span className="bg-emerald-950 text-emerald-400 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  🍼 SUCCESSFUL CHILDBIRTH
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none mt-2">
                  Meet Your New Self
                </h3>
                <p className="text-[10px] text-slate-400">
                  Genetics are hard-locked. Rerolling is strictly prohibited. Accept your lot in history.
                </p>
              </div>

              {/* Avatar Renderer of the Baby */}
              <div className="flex justify-center mt-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/20 shadow-lg">
                  <AvatarRenderer
                    appearance={{
                      skinColor: birthSheet.skinColor,
                      hairStyle: birthSheet.hairStyle,
                      hairColor: birthSheet.hairColor,
                      eyeColor: birthSheet.eyeColor,
                      clothing: birthSheet.clothing,
                      accessory: birthSheet.accessory,
                      facialExpression: "neutral"
                    }}
                    age={0} // Baby preview!
                  />
                </div>
              </div>

              {/* Official Birthing Registry (Bento style card list) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                <span className="text-[8px] font-black uppercase tracking-wider text-indigo-400 block border-b border-slate-800 pb-1.5">
                  OFFICIAL MATERNITY REGISTER
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs leading-none">
                  <div>
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Identified Name</span>
                    <span className="text-white font-black text-[11px] block mt-1 truncate">{birthSheet.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Pronouns & Sex</span>
                    <span className="text-indigo-300 font-black text-[11px] block mt-1">{birthSheet.gender}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2">
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Birthplace</span>
                    <span className="text-amber-400 font-black text-[11px] block mt-1 truncate flex items-center gap-1">
                      <Globe className="w-3 h-3 text-sky-400" />
                      {birthSheet.city}, {birthSheet.country}
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2">
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Starting Funds</span>
                    <span className="text-emerald-400 font-black text-[11px] block mt-1 font-mono">${birthSheet.startingCash} ({birthSheet.wealthClass})</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 col-span-2">
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Predisposed Trait</span>
                    <span className="text-pink-400 font-black text-[11px] block mt-1 uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
                      {birthSheet.startingTrait.name}
                    </span>
                    <p className="text-[9px] text-slate-400 leading-snug mt-0.5">{birthSheet.startingTrait.desc}</p>
                  </div>
                </div>

                {/* Additional detailed narrative registry details */}
                <div className="border-t border-slate-800 pt-2.5 space-y-1.5 text-[10px] leading-snug">
                  <div>
                    <strong className="text-slate-400">Parents:</strong>{" "}
                    <span className="text-slate-200">
                      Mom {birthSheet.npcs[0]?.name} (Age {birthSheet.npcs[0]?.age}, {birthSheet.npcs[0]?.occupation}), Dad {birthSheet.npcs[1]?.name} (Age {birthSheet.npcs[1]?.age}, {birthSheet.npcs[1]?.occupation}).
                    </span>
                  </div>
                  {birthSheet.siblingNames.length > 0 && (
                    <div>
                      <strong className="text-slate-400">Siblings:</strong>{" "}
                      <span className="text-slate-200">{birthSheet.siblingNames.join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <strong className="text-slate-400">Religion:</strong>{" "}
                    <span className="text-sky-300">{birthSheet.religion}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400">Environment:</strong>{" "}
                    <span className="text-amber-300">{birthSheet.politicalClimate}</span> with <span className="text-purple-300">{birthSheet.culture}</span>.
                  </div>
                  <div>
                    <strong className="text-slate-400">Family History:</strong>{" "}
                    <span className="text-slate-300 italic">"{birthSheet.familyHistory}"</span>
                  </div>
                </div>
              </div>

              {/* God's final words speech block */}
              <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <span className="text-sm">👁</span>
                </div>
                <div>
                  <span className="text-[8px] text-indigo-400 font-black block tracking-wider uppercase">GOD'S PARTING ADVICE</span>
                  <p className="text-[10px] text-slate-300 italic font-semibold">"{finalWords}"</p>
                </div>
              </div>
            </div>

            {/* Confirm & Launch Game button */}
            <div className="pt-2">
              <button
                onClick={handleStartLifetime}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs py-3.5 rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest border-t border-white/20"
              >
                ✨ Enter This Chaotic Lifetime
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

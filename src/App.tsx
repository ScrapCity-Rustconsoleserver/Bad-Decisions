/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Trophy, Skull, RefreshCw, Eye, BookOpen, VolumeX, Users } from "lucide-react";
import { GameState, Gender, Appearance, PlayerStats, GameChoice, GameEvent, NPC, Pet, HistoryLog, RealEstate, EducationPath, Career, Vehicle, PersonalItem, Business, DelayedEffect } from "./types";
import { CharacterCreator } from "./components/CharacterCreator";
import { GameDashboard } from "./components/GameDashboard";
import { GodAfterlifeReview } from "./components/GodAfterlifeReview";
import { EventModal } from "./components/EventModal";
import { TechnicalPlan } from "./components/TechnicalPlan";
import { EVENTS } from "./data/events";
import { EDUCATION_PATHS } from "./data/careers";
import { AvatarRenderer } from "./components/AvatarRenderer";

const LOCAL_STORAGE_KEY = "bad_decisions_simulator_save_v1";

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showTechnicalDocOnly, setShowTechnicalDocOnly] = useState(false);
  const [viewingLegacy, setViewingLegacy] = useState(false);

  // Auto-load on startup
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved game state", e);
      }
    }
  }, []);

  // Save changes
  const saveState = (newState: GameState) => {
    setGameState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };

  const handleStartGame = (
    name: string,
    gender: Gender,
    appearance: Appearance,
    traitName: string,
    initialStats: PlayerStats,
    extraStartingData?: any
  ) => {
    // Generate funny parents
    const momName = `Euphemia ${name.split(" ")[1] || "McWacky"}`;
    const dadName = `Gideon ${name.split(" ")[1] || "McWacky"}`;

    const initialNPCs: NPC[] = [
      {
        id: "mom",
        name: momName,
        gender: Gender.FEMALE,
        relationType: "Parent",
        relationValue: 85,
        age: 26 + Math.floor(Math.random() * 12),
        isAlive: true,
        occupation: "Professional Line Stander",
        personality: "Overprotective & Loud",
        memories: []
      },
      {
        id: "dad",
        name: dadName,
        gender: Gender.MALE,
        relationType: "Parent",
        relationValue: 78,
        age: 28 + Math.floor(Math.random() * 12),
        isAlive: true,
        occupation: "Coffee Transport Coordinator",
        personality: "Sarcastic Spreadsheet Lover",
        memories: []
      }
    ];

    const initialHistory: HistoryLog[] = [
      {
        age: 0,
        text: `You were born as a healthy ${gender.toLowerCase()} in a cozy local maternity ward. Your parents celebrated by eating a box of organic synthetics.`,
        type: "birth"
      }
    ];

    let newGame: GameState = {
      name,
      gender,
      age: 0,
      cash: 250, // Starting piggy bank money!
      netWorth: 255,
      stats: initialStats,
      appearance,
      traits: [traitName],
      educationCompleted: [],
      currentEducation: null,
      currentCareer: null,
      history: initialHistory,
      npcs: initialNPCs,
      properties: [],
      vehicles: [],
      personalItems: [
        {
          id: "initial_teddy",
          name: "One-Eared Knitted Teddy Bear",
          category: "Sentimental",
          value: 5,
          condition: 90,
          rarity: "common",
          emotionalValue: 95,
          description: "Given to you at birth. Smells of lavender and cozy attic dust. Ultimate sentimental companion."
        }
      ],
      businesses: [],
      pets: [],
      isDead: false,
      deathReason: "",
      crimeRecordCount: 0,
      fameFollowers: 0,
      yearlyFocus: "health",
      calendarYear: 2026,
      season: "Spring",
      lifeStage: "Infancy",
      delayedEffects: [],
      decisionFlags: {},
      activeNews: ["GLOBAL BROADCAST: Welcome to the world! Human cloning is still illegal, so you are technically unique."],
      worldCondition: {
        economy: "normal",
        politicalClimate: "Bureaucracy of spreadsheet lovers",
        weather: "Cozy breeze with sporadic meatball forecasts"
      },
      investments: {
        TURNIP: 0,
        SSYN: 0,
        CWP: 0,
        GOLD: 0,
        FROG: 0
      },
      stockPrices: {
        TURNIP: 10,
        SSYN: 150,
        CWP: 50,
        GOLD: 400,
        FROG: 1.50
      }
    };

    if (extraStartingData) {
      newGame = {
        ...newGame,
        ...extraStartingData,
        stats: {
          ...newGame.stats,
          ...extraStartingData.stats
        }
      };
    }

    saveState(newGame);
  };

  const calculateNetWorth = (state: Partial<GameState>): number => {
    try {
      const cash = state.cash || 0;
      const propsValue = (state.properties || []).reduce((sum, p) => sum + (p && p.type === "own" ? (p.value || 0) : 0), 0);
      const vehiclesValue = (state.vehicles || []).reduce((sum, v) => sum + (v ? Math.round((v.value || 0) * ((v.condition !== undefined ? v.condition : 100) / 100)) : 0), 0);
      const itemsValue = (state.personalItems || []).reduce((sum, i) => sum + (i ? (i.value || 0) : 0), 0);
      const businessesValue = (state.businesses || []).reduce((sum, b) => sum + (b ? Math.round((b.purchaseCost || 0) * (b.isThriving ? 1.3 : 0.7)) : 0), 0);
      const investmentsValue = state.investments && state.stockPrices 
        ? Object.entries(state.investments).reduce((sum, [ticker, qty]) => sum + Math.round((qty || 0) * (state.stockPrices?.[ticker] || 0)), 0)
        : 0;
      return cash + propsValue + vehiclesValue + itemsValue + businessesValue + investmentsValue;
    } catch (e) {
      console.error("Error in calculateNetWorth:", e);
      return state.cash || 0;
    }
  };

  const handleAction = (logText: string, statChanges: any) => {
    if (!gameState) return;

    const currentStats = { ...gameState.stats };
    let currentCash = gameState.cash;

    // Apply stat changes
    Object.entries(statChanges).forEach(([key, val]) => {
      if (key === "cash") {
        currentCash = Math.max(0, currentCash + (val as number));
      } else if (key in currentStats) {
        const k = key as keyof PlayerStats;
        currentStats[k] = Math.max(0, Math.min(100, currentStats[k] + (val as number)));
      }
    });

    const newHistory: HistoryLog = {
      age: gameState.age,
      text: logText,
      type: statChanges.morality && statChanges.morality < 0 ? "crime" : "standard"
    };

    const updatedState: GameState = {
      ...gameState,
      stats: currentStats,
      cash: currentCash,
      history: [...gameState.history, newHistory]
    };

    // Update net worth
    updatedState.netWorth = calculateNetWorth(updatedState);

    // Adjust facial expression based on happiness
    let expr = updatedState.appearance.facialExpression;
    if (updatedState.stats.happiness > 75) expr = "happy";
    else if (updatedState.stats.happiness < 30) expr = "sad";
    else if (updatedState.stats.sanity < 25) expr = "crazed";
    else expr = "neutral";
    updatedState.appearance.facialExpression = expr;

    saveState(updatedState);
  };

  const handleAgeUp = () => {
    if (!gameState) return;

    try {
      const properties = (gameState.properties || []).filter(Boolean);
      const npcs = (gameState.npcs || []).filter(Boolean);
      const pets = (gameState.pets || []).filter(Boolean);
      const educationCompleted = gameState.educationCompleted || [];
      const delayedEffects = gameState.delayedEffects || [];

      let newAge = (gameState.age !== undefined ? gameState.age : 0) + 1;
      let newCash = gameState.cash !== undefined ? gameState.cash : 0;
      let newHistory = [...(gameState.history || [])];
      let currentStats = {
        health: 50,
        happiness: 50,
        sanity: 50,
        luck: 50,
        strength: 50,
        fitness: 50,
        attractiveness: 50,
        charisma: 50,
        intelligence: 50,
        creativity: 50,
        fame: 0,
        reputation: 50,
        morality: 50,
        stress: 20,
        ...gameState.stats
      };

      // 1. Advance Calendar Year & Cycle Season
      const currentYear = gameState.calendarYear || 2026;
      const nextCalendarYear = currentYear + 1;
      const seasonsList: ("Spring" | "Summer" | "Autumn" | "Winter")[] = ["Spring", "Summer", "Autumn", "Winter"];
      const currentSeasonIdx = seasonsList.indexOf(gameState.season || "Spring");
      const nextSeason = seasonsList[(currentSeasonIdx + 1) % 4];

      // Compute life stage
      let nextLifeStage: "Infancy" | "Childhood" | "Teen Years" | "Young Adult" | "Adult" | "Later Life" | "Elderly" = "Infancy";
      if (newAge <= 2) nextLifeStage = "Infancy";
      else if (newAge <= 12) nextLifeStage = "Childhood";
      else if (newAge <= 17) nextLifeStage = "Teen Years";
      else if (newAge <= 30) nextLifeStage = "Young Adult";
      else if (newAge <= 55) nextLifeStage = "Adult";
      else if (newAge <= 75) nextLifeStage = "Later Life";
      else nextLifeStage = "Elderly";

      // 2. Apply Seasonal Costs / Event Buffs
      if (nextSeason === "Winter") {
        // Heating and winter overhead cost
        const winterCost = properties.length > 0 ? 250 : 120;
        newCash = Math.max(0, newCash - winterCost);
        newHistory.push({
          age: newAge,
          text: `❄️ Winter Frost: Radiators clattered and frost grew on the window panes. Paid $${winterCost} in seasonal heating bills and bought a heavy woolen scarf.`,
          type: "standard"
        });
      } else if (nextSeason === "Summer") {
        // Summer hydration and relaxation buff
        currentStats.happiness = Math.min(100, currentStats.happiness + 6);
        currentStats.stress = Math.max(0, currentStats.stress - 5);
        newHistory.push({
          age: newAge,
          text: `☀️ Summer Solstice: Bounded by warm sunshine and ice-pop cravings. Spent $40 on sunglasses, gaining +6 Happiness and -5 Stress.`,
          type: "standard"
        });
        newCash = Math.max(0, newCash - 40);
      } else if (nextSeason === "Autumn") {
        newHistory.push({
          age: newAge,
          text: `🍁 Golden Autumn: Leaves drifted through the local park. You enjoyed hot cider and stepped on some crunchable dry foliage. Cozy!`,
          type: "standard"
        });
      } else if (nextSeason === "Spring") {
        newHistory.push({
          age: newAge,
          text: `🌱 Spring Awakening: Pollen allergy levels peaked, but birds sang. You felt an optimistic surge to build clean habits.`,
          type: "standard"
        });
      }

      // 3. Yearly Focus Multipliers
      const currentFocus = gameState.yearlyFocus || "health";
      if (currentFocus === "career") {
        currentStats.reputation = Math.min(100, (currentStats.reputation || 50) + 12);
        currentStats.stress = Math.min(100, currentStats.stress + 10);
        const careerBonus = gameState.currentCareer ? 1200 : 150;
        newCash += careerBonus;
        newHistory.push({
          age: newAge,
          text: `💼 Focus - Career: Spent the year networking with influencers, aligning spreadsheets, and using corporate buzzwords. Gained +12 Reputation & $${careerBonus} extra cash, but stress rose (+10).`,
          type: "career"
        });
      } else if (currentFocus === "relationship") {
        currentStats.happiness = Math.min(100, currentStats.happiness + 10);
        currentStats.stress = Math.max(0, currentStats.stress - 8);
        newHistory.push({
          age: newAge,
          text: `👥 Focus - Relationships: You prioritized family, friends, and pets. You sent warm memes, remembered birthdays, and paid for coffee. Gained +10 Happiness!`,
          type: "relationship"
        });
      } else if (currentFocus === "health") {
        currentStats.health = Math.min(100, currentStats.health + 15);
        currentStats.fitness = Math.min(100, currentStats.fitness + 15);
        currentStats.stress = Math.max(0, currentStats.stress - 15);
        newHistory.push({
          age: newAge,
          text: `❤️ Focus - Health & Wellness: Slept 8 hours nightly, drank blended green sludge (kale), and did awkward living room yoga. Health (+15) and fitness (+15) rocketed, stress plunged!`,
          type: "health"
        });
      } else if (currentFocus === "education") {
        currentStats.intelligence = Math.min(100, currentStats.intelligence + 15);
        newHistory.push({
          age: newAge,
          text: `🎓 Focus - Education: You devoured technical books at 3x playback speed, learned standard trivia, and attended virtual lectures. Gained +15 Intelligence!`,
          type: "standard"
        });
      } else if (currentFocus === "wealth") {
        const interestYield = Math.min(1800, Math.round(newCash * 0.05));
        newCash += interestYield;
        currentStats.stress = Math.min(100, currentStats.stress + 6);
        newHistory.push({
          age: newAge,
          text: `💰 Focus - Wealth: You micro-managed your liquid assets, trading stock fractions of turnip futures. Earned 5% yield of $${interestYield.toLocaleString()} on cash, though stress crept up.`,
          type: "standard"
        });
      }

      // 4. Biological / Life Stage Stat Decay & Boosts
      if (nextLifeStage === "Infancy") {
        currentStats.intelligence = Math.min(100, currentStats.intelligence + 3);
      } else if (nextLifeStage === "Childhood") {
        currentStats.intelligence = Math.min(100, currentStats.intelligence + 2);
        currentStats.fitness = Math.min(100, currentStats.fitness + 2);
      } else if (nextLifeStage === "Teen Years") {
        currentStats.stress = Math.min(100, currentStats.stress + 3); // teen angst
      } else if (nextLifeStage === "Adult") {
        // Natural metabolism slowing
        currentStats.fitness = Math.max(0, currentStats.fitness - 1);
      } else if (nextLifeStage === "Later Life") {
        currentStats.health = Math.max(0, currentStats.health - 2);
        currentStats.fitness = Math.max(0, currentStats.fitness - 2);
        currentStats.intelligence = Math.min(100, currentStats.intelligence + 1); // Wisdom
      } else if (nextLifeStage === "Elderly") {
        currentStats.health = Math.max(0, currentStats.health - 4);
        currentStats.fitness = Math.max(0, currentStats.fitness - 4);
        currentStats.intelligence = Math.min(100, currentStats.intelligence + 1); // Senior Wisdom
      }

      // 5. Build Dynamic News Ticker & Historical Progress Headlines
      let dynamicNews: string[] = [];
      
      // Historical tech/world headlines
      if (nextCalendarYear >= 2026 && nextCalendarYear <= 2035) {
        dynamicNews.push(`🚀 TECH FUTURE: AI pizza makers are now standard. Human chefs protest by throwing pepperoni.`);
      } else if (nextCalendarYear >= 2036 && nextCalendarYear <= 2045) {
        dynamicNews.push(`🛰️ GLOBAL PROGRESS: Commercial drone flights to the upper troposphere begin. Sandwiches can be delivered mid-air.`);
      } else if (nextCalendarYear >= 2046 && nextCalendarYear <= 2060) {
        dynamicNews.push(`🧬 BIO PROGRESS: Anti-wrinkle toothpaste hits market. Elder teeth reported to be shining like neon signs.`);
      } else {
        dynamicNews.push(`🛸 COSMIC UPDATE: Lunar mining colony registers first union strike. Workers demand shorter gravity boots.`);
      }

      // NPCs aging with comedy updates
      let newNPCs = npcs.map((npc) => {
        if (!npc) return npc;
        if (!npc.isAlive) return npc;
        let nextAge = (npc.age !== undefined ? npc.age : 0) + 1;
        let nextRel = npc.relationValue !== undefined ? npc.relationValue : 50;

        // Natural relationship drift
        if (Math.random() < 0.15) {
          const driftUp = Math.random() > 0.5;
          nextRel = Math.max(0, Math.min(100, nextRel + (driftUp ? 5 : -5)));
        }

        // Relationship modifiers from Relationship Focus
        if (currentFocus === "relationship") {
          nextRel = Math.min(100, nextRel + 8);
        }

        const relType = npc.relationType || "Friend";
        const npcName = npc.name || "Someone";

        // Funny milestone headlines
        if (nextAge === 18 && Math.random() < 0.35) {
          dynamicNews.push(`🎓 GRADUATION NEWS: Your ${relType.toLowerCase()} ${npcName} graduated high school and bought a questionable unicycle.`);
        } else if (nextAge === 30 && Math.random() < 0.25) {
          dynamicNews.push(`💍 ROMANCE EXCLUSIVE: ${npcName} (${relType}) engaged to a professional cheese consultant!`);
        } else if (nextAge === 65 && Math.random() < 0.25) {
          dynamicNews.push(`🌴 RETIREMENT REVEAL: ${npcName} retired to raise high-IQ talking carrots.`);
        }

        return {
          ...npc,
          age: nextAge,
          relationValue: nextRel
        };
      });

      let newPets = pets.map((pet) => {
        if (!pet) return pet;
        return {
          ...pet,
          age: (pet.age !== undefined ? pet.age : 0) + 1,
          health: Math.max(0, (pet.health !== undefined ? pet.health : 100) - 5) // Pets lose 5% health per year
        };
      });

      let currentEdu = gameState.currentEducation;
      let completedEdu = [...educationCompleted];
      let isDead = false;
      let deathReason = "";

      // A. Simulate World Economy & Conditions
      const economies: ("depression" | "recession" | "normal" | "boom")[] = ["depression", "recession", "normal", "boom"];
      const politicalClimates = [
        "Bureaucracy of spreadsheet lovers",
        "Anarchic sandpit disputes",
        "Supreme Council of Caffeine",
        "Sarcastic Board of Directors",
        "Technocratic drone-delivery governance"
      ];
      const weatherForecasts = [
        "Sporadic hot soup rains",
        "Cozy chill with high turnip yields",
        "Intense solar glares and low wind",
        "Unpredictable sandstorms of recess dust",
        "Mild moisture and occasional fog"
      ];

      let currentEconomy = gameState.worldCondition?.economy || "normal";
      if (Math.random() < 0.25) {
        const idx = economies.indexOf(currentEconomy);
        const delta = Math.random() < 0.5 ? -1 : 1;
        currentEconomy = economies[Math.max(0, Math.min(economies.length - 1, idx + delta))];
      }

      const currentWorldCondition = {
        economy: currentEconomy,
        politicalClimate: politicalClimates[Math.floor(Math.random() * politicalClimates.length)],
        weather: weatherForecasts[Math.floor(Math.random() * weatherForecasts.length)]
      };

      // B. Build World News Ticker
      if (currentEconomy === "boom") {
        dynamicNews.push("📈 ECONOMIC HYPER-BOOM: The stock exchange registers a record 500% gain! Everyone is buying gold-plated staplers.");
      } else if (currentEconomy === "recession") {
        dynamicNews.push("📉 MARKET RECESSION: Financial giants seen bartering mechanical keyboards for organic turnips.");
      } else if (currentEconomy === "depression") {
        dynamicNews.push("💀 GREAT COFFEE DEPRESSION: Central banks run out of espresso reserves. Citizens panic in spreadsheets.");
      } else {
        dynamicNews.push("📊 AVERAGE STABILITY THRILLS SEC: Stock prices remain identical to yesterday. Traders are taking long naps.");
      }

      // Story headlines based on achievements
      if (newAge < 5) {
        dynamicNews.push("👶 CRADLE TRENDS: Local toddler reported to have built a mock tax haven using neon blocks.");
      } else if (newAge >= 18 && !gameState.currentCareer) {
        dynamicNews.push(`📰 CITIZEN CROSSROADS: At age ${newAge}, ${gameState.name || "You"} is reportedly searching for jobs requiring zero physical movement.`);
      } else if (gameState.currentCareer) {
        dynamicNews.push(`💼 INDUSTRY INSIGHTS: Local employee ${gameState.name || "You"} is making waves within the "${gameState.currentCareer.field}" sector.`);
      }

      if (newCash > 30000) {
        dynamicNews.push(`💰 CAPITALIST CRITIQUE: Multi-thousandaire ${gameState.name || "You"} accused of hiding chocolate coins in offshore toy chests.`);
      }
      if ((gameState.crimeRecordCount || 0) > 0) {
        dynamicNews.push(`🚨 SHADY CITIZEN TACTICS: Law enforcement continues monitoring a notorious playground offender.`);
      }

      // C. Process Delayed Consequence Effects
      let nextDelayedEffects: DelayedEffect[] = [];
      let activeDelayedEffects: DelayedEffect[] = [];

      if (delayedEffects) {
        delayedEffects.forEach((eff) => {
          if (!eff) return;
          let years = eff.yearsLeft !== undefined ? eff.yearsLeft - 1 : 0;
          if (years <= 0 || (eff.triggerAge !== undefined && newAge === eff.triggerAge)) {
            activeDelayedEffects.push(eff);
          } else {
            nextDelayedEffects.push({ ...eff, yearsLeft: years });
          }
        });
      }

      // Trigger matured delayed consequences
      activeDelayedEffects.forEach((eff) => {
        if (!eff || !eff.statChanges) return;
        // Apply stat updates
        Object.entries(eff.statChanges).forEach(([key, val]) => {
          if (key === "cash") {
            newCash = Math.max(0, newCash + (val as number));
          } else if (key in currentStats) {
            const k = key as keyof PlayerStats;
            currentStats[k] = Math.max(0, Math.min(100, currentStats[k] + (val as number)));
          }
        });

        // Write into milestone timeline
        newHistory.push({
          age: newAge,
          text: `⏳ CONSECONQUENCE: ${eff.title} — ${eff.consequenceText}`,
          type: "standard"
        });

        // Insert news flash
        if (eff.newsText) {
          dynamicNews.push(`⚡ LATE FLASH: ${eff.newsText}`);
        } else {
          dynamicNews.push(`⚡ IMPACT REPORT: ${eff.title} consequences observed!`);
        }
      });

      // 1. Economic Flow Calculations
      // --- Job Salary ---
      if (gameState.currentCareer) {
        const salary = gameState.currentCareer.salary || 0;
        newCash += salary;
        newHistory.push({
          age: newAge,
          text: `Collected your annual earnings of $${salary.toLocaleString()} as a ${gameState.currentCareer.title || "Employee"}.`,
          type: "career"
        });
      }

      // --- Property costs and rents ---
      properties.forEach((prop) => {
        if (!prop) return;
        const monthlyCost = prop.monthlyCost || 0;
        const propValue = prop.value || 0;
        const propName = prop.name || "Property";
        if (prop.type === "rent") {
          // Living expenses
          newCash = Math.max(0, newCash - monthlyCost);
          newHistory.push({
            age: newAge,
            text: `Paid $${monthlyCost.toLocaleString()} in rent for your living space at "${propName}".`,
            type: "standard"
          });
        } else {
          // Owned assets maintenance
          newCash = Math.max(0, newCash - monthlyCost);
          // Tenant payouts!
          if (prop.tenants && prop.tenants.length > 0) {
            const tenantRent = Math.round(propValue * 0.08); // Rents out at 8% of purchase price annually
            newCash += tenantRent;
            newHistory.push({
              age: newAge,
              text: `Collected $${tenantRent.toLocaleString()} in rent from your eccentric tenants at "${propName}".`,
              type: "standard"
            });
          }
        }
      });

      // 2. Education Progression
      if (currentEdu) {
        const remaining = currentEdu.yearsLeft - 1;
        if (remaining === 0) {
          completedEdu.push(currentEdu.id);
          const eduName = EDUCATION_PATHS.find((e) => e.id === currentEdu?.id)?.name || "Academic Studies";
          newHistory.push({
            age: newAge,
            text: `🎓 Congratulations! You graduated from "${eduName}" with honors. High-tier careers unlocked!`,
            type: "career"
          });
          currentEdu = null;
        } else {
          currentEdu = { ...currentEdu, yearsLeft: remaining };
        }
      }

      // 3. Parental / NPC aging occurrences
      newNPCs.forEach((npc) => {
        if (npc && npc.isAlive && npc.age > 75) {
          // Parents might pass away
          const dieRoll = Math.random();
          if (dieRoll > 0.8) {
            npc.isAlive = false;
            const inherit = Math.round(Math.random() * 3000);
            newCash += inherit;
            const relType = npc.relationType || "relative";
            const npcName = npc.name || "Relative";
            newHistory.push({
              age: newAge,
              text: `🖤 Comedic Tragedy: Your ${relType.toLowerCase()} (${npcName}) passed away peacefully at age ${npc.age} while trying to chase down a stray goose. They left you a modest inheritance of $${inherit.toLocaleString()} and a legacy of rusty teaspoons.`,
              type: "relationship"
            });
          }
        }
      });

      // 4. Player Death Evaluation
      const health = currentStats.health;
      const healthRoll = Math.random();
      if (health <= 0) {
        isDead = true;
        deathReason = "Your bodily systems fully went offline due to absolute health starvation (Health hit 0%).";
      } else if (newAge >= 80 && healthRoll > health / 100) {
        isDead = true;
        deathReason = `You passed away peacefully in your sleep at age ${newAge} due to extreme elderly natural decay.`;
      }

      // 5. Market Stock Prices Fluctuation
      let nextStockPrices: Record<string, number> = {};
      const oldPrices = gameState.stockPrices || {
        TURNIP: 10,
        SSYN: 150,
        CWP: 50,
        GOLD: 400,
        FROG: 1.50
      };

      Object.entries(oldPrices).forEach(([ticker, price]) => {
        const priceNum = price as number;
        let changePercent = (Math.random() * 0.2) - 0.1; // -10% to +10% base
        if (currentEconomy === "boom") {
          if (ticker === "FROG") changePercent += Math.random() * 0.5; // Crypto surges up to +60%
          if (ticker === "TURNIP") changePercent += Math.random() * 0.35; // Turnips up to +45%
          else changePercent += Math.random() * 0.2; // others up to +30%
        } else if (currentEconomy === "recession") {
          if (ticker === "GOLD") changePercent += 0.05; // GOLD stays positive as safe haven
          else if (ticker === "FROG") changePercent -= Math.random() * 0.3; // FROG drops up to -40%
          else changePercent -= Math.random() * 0.15; // others drop up to -25%
        } else if (currentEconomy === "depression") {
          if (ticker === "GOLD") changePercent += Math.random() * 0.15; // GOLD surges up to +20% as flight to safety
          else if (ticker === "FROG") changePercent -= Math.random() * 0.6; // FROG crashes up to -70%
          else changePercent -= Math.random() * 0.35; // others crash up to -45%
        } else {
          // normal economy
          if (ticker === "FROG") changePercent = (Math.random() * 0.4) - 0.2; // Volatile crypto
          else if (ticker === "TURNIP") changePercent = (Math.random() * 0.3) - 0.15; // Volatile turnips
        }

        let nextPrice = priceNum * (1 + changePercent);
        // Floor limits
        if (ticker === "FROG") nextPrice = Math.max(0.1, nextPrice); // FROG minimum $0.1
        else if (ticker === "TURNIP") nextPrice = Math.max(0.5, nextPrice); // TURNIP minimum $0.5
        else nextPrice = Math.max(1, nextPrice); // minimum $1

        nextStockPrices[ticker] = Math.round(nextPrice * 100) / 100;
      });

      const nextState: GameState = {
        ...gameState,
        age: newAge,
        cash: newCash,
        stats: currentStats,
        npcs: newNPCs,
        pets: newPets,
        currentEducation: currentEdu,
        educationCompleted: completedEdu,
        history: newHistory,
        isDead,
        deathReason,
        calendarYear: nextCalendarYear,
        season: nextSeason,
        lifeStage: nextLifeStage,
        delayedEffects: nextDelayedEffects,
        activeNews: dynamicNews,
        worldCondition: currentWorldCondition,
        decisionFlags: gameState.decisionFlags || {},
        investments: gameState.investments || { TURNIP: 0, SSYN: 0, CWP: 0, GOLD: 0, FROG: 0 },
        stockPrices: nextStockPrices
      };

      // Calculate updated net worth
      nextState.netWorth = calculateNetWorth(nextState);

      if (isDead) {
        saveState(nextState);
        return;
      }

      // 5. Select & trigger funny random events
      const eligibleEvents = EVENTS.filter((ev) => {
        const ageOk = newAge >= ev.minAge && newAge <= ev.maxAge;
        const condOk = !ev.conditions || ev.conditions(nextState);
        return ageOk && condOk;
      });

      if (eligibleEvents.length > 0 && Math.random() < 0.75) {
        // Pick a random eligible event
        const selected = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
        setActiveEvent(selected);
        setGameState(nextState); // Store intermediate, don't write full save until choice is completed
      } else {
        nextState.history.push({
          age: newAge,
          text: "Another year went by. You spent most of your spare time rearranging your furniture or staring at the ceiling.",
          type: "standard"
        });
        saveState(nextState);
      }
    } catch (error) {
      console.error("FATAL ERROR in handleAgeUp:", error);
    }
  };

  const handleChoiceSelected = (choice: GameChoice) => {
    if (!gameState) return;

    const currentStats = { ...gameState.stats };
    let currentCash = gameState.cash;

    // Apply choice modifiers
    Object.entries(choice.statChanges).forEach(([key, val]) => {
      if (key === "cash") {
        currentCash = Math.max(0, currentCash + (val as number));
      } else if (key in currentStats) {
        const k = key as keyof PlayerStats;
        currentStats[k] = Math.max(0, Math.min(100, currentStats[k] + (val as number)));
      }
    });

    const newHistory: HistoryLog = {
      age: gameState.age,
      text: `Scenario: ${activeEvent?.title} — ${choice.consequenceText}`,
      type: choice.statChanges.morality && choice.statChanges.morality < 0 ? "crime" : "standard"
    };

    // Parse flag updates and delayed effect attachments
    const updatedDecisionFlags = { ...(gameState.decisionFlags || {}) };
    if (choice.setFlag) {
      updatedDecisionFlags[choice.setFlag] = true;
    }

    const updatedDelayedEffects = [...(gameState.delayedEffects || [])];
    if (choice.delayedEffect) {
      updatedDelayedEffects.push(choice.delayedEffect);
    }

    const nextState: GameState = {
      ...gameState,
      stats: currentStats,
      cash: currentCash,
      history: [...gameState.history, newHistory],
      decisionFlags: updatedDecisionFlags,
      delayedEffects: updatedDelayedEffects
    };

    // Update net worth
    nextState.netWorth = calculateNetWorth(nextState);

    // Trigger facial changes
    let expr = nextState.appearance.facialExpression;
    if (nextState.stats.happiness > 75) expr = "happy";
    else if (nextState.stats.happiness < 30) expr = "sad";
    else if (nextState.stats.sanity < 25) expr = "crazed";
    else expr = "neutral";
    nextState.appearance.facialExpression = expr;

    setActiveEvent(null);
    saveState(nextState);
  };

  // NPC Actions callbacks
  const handleUpdateNPC = (npcId: string, relDelta: number, logText: string) => {
    if (!gameState) return;
    const updatedNPCs = gameState.npcs.map((n) => {
      if (n.id === npcId) {
        return { ...n, relationValue: Math.max(0, Math.min(100, n.relationValue + relDelta)) };
      }
      return n;
    });
    saveState({ ...gameState, npcs: updatedNPCs });
  };

  const handleBuyStock = (ticker: string, quantity: number, price: number) => {
    if (!gameState) return;
    const cost = Math.round(quantity * price);
    if (gameState.cash < cost) return;

    const updatedInvestments = { ...(gameState.investments || {}) };
    updatedInvestments[ticker] = (updatedInvestments[ticker] || 0) + quantity;

    const nextState = {
      ...gameState,
      cash: Math.max(0, gameState.cash - cost),
      investments: updatedInvestments
    };
    nextState.netWorth = calculateNetWorth(nextState);

    const log: HistoryLog = {
      age: gameState.age,
      text: `📈 STOCKS: Purchased ${quantity} shares of ${ticker} at $${price.toLocaleString()} each (Total: $${cost.toLocaleString()}).`,
      type: "standard"
    };
    nextState.history = [...gameState.history, log];

    saveState(nextState);
  };

  const handleSellStock = (ticker: string, quantity: number, price: number) => {
    if (!gameState) return;
    const owned = gameState.investments?.[ticker] || 0;
    if (owned < quantity) return;

    const updatedInvestments = { ...(gameState.investments || {}) };
    updatedInvestments[ticker] = Math.max(0, owned - quantity);

    const payout = Math.round(quantity * price);
    const nextState = {
      ...gameState,
      cash: gameState.cash + payout,
      investments: updatedInvestments
    };
    nextState.netWorth = calculateNetWorth(nextState);

    const log: HistoryLog = {
      age: gameState.age,
      text: `💸 STOCKS: Sold ${quantity} shares of ${ticker} at $${price.toLocaleString()} each, pocketing $${payout.toLocaleString()}.`,
      type: "standard"
    };
    nextState.history = [...gameState.history, log];

    saveState(nextState);
  };

  const handleAddNPC = (npc: NPC) => {
    if (!gameState) return;
    saveState({ ...gameState, npcs: [...gameState.npcs, npc] });
  };

  const handleUpdateNPCRelationType = (npcId: string, nextType: string, relDelta: number, logText: string) => {
    if (!gameState) return;
    const updatedNPCs = gameState.npcs.map((n) => {
      if (n.id === npcId) {
        return {
          ...n,
          relationType: nextType,
          relationValue: Math.max(0, Math.min(100, n.relationValue + relDelta))
        };
      }
      return n;
    });

    const log: HistoryLog = {
      age: gameState.age,
      text: logText,
      type: "relationship"
    };

    saveState({
      ...gameState,
      npcs: updatedNPCs,
      history: [...gameState.history, log]
    });
  };

  // Pet callbacks
  const handleAdoptPet = (pet: Pet) => {
    if (!gameState) return;
    saveState({ ...gameState, pets: [...gameState.pets, pet] });
  };

  const handleInteractPet = (petId: string, action: "feed" | "train" | "pet", logText: string, statChanges: any) => {
    if (!gameState) return;
    const updatedPets = gameState.pets.map((p) => {
      if (p.id === petId) {
        let h = p.health;
        let t = p.training;
        if (action === "feed") h = Math.min(100, h + 20);
        if (action === "train") t = Math.min(100, t + 15);
        return { ...p, health: h, training: t };
      }
      return p;
    });

    handleAction(logText, statChanges);
    saveState({ ...gameState, pets: updatedPets });
  };

  // Property callbacks
  const handleBuyProperty = (prop: RealEstate) => {
    if (!gameState) return;
    saveState({ ...gameState, properties: [...gameState.properties, prop] });
  };

  const handleSellProperty = (propId: string, sellValue: number) => {
    if (!gameState) return;
    const filtered = gameState.properties.filter((p) => p.id !== propId);
    saveState({ ...gameState, properties: filtered });
  };

  const handleEvictTenant = (propId: string, tenantId: string) => {
    if (!gameState) return;
    const updated = gameState.properties.map((p) => {
      if (p.id === propId) {
        return { ...p, tenants: p.tenants.filter((t) => t.id !== tenantId) };
      }
      return p;
    });
    saveState({ ...gameState, properties: updated });
  };

  const handleAddTenant = (propId: string, tenant: NPC) => {
    if (!gameState) return;
    const updated = gameState.properties.map((p) => {
      if (p.id === propId) {
        return { ...p, tenants: [...p.tenants, tenant] };
      }
      return p;
    });
    saveState({ ...gameState, properties: updated });
  };

  const handleUpdateProperty = (propId: string, updatedProp: Partial<RealEstate>) => {
    if (!gameState) return;
    const updated = gameState.properties.map((p) => {
      if (p.id === propId) {
        return { ...p, ...updatedProp } as RealEstate;
      }
      return p;
    });
    saveState({ ...gameState, properties: updated });
  };

  const handleBuyVehicle = (veh: Vehicle) => {
    if (!gameState) return;
    saveState({ ...gameState, vehicles: [...gameState.vehicles, veh] });
  };

  const handleSellVehicle = (vehId: string) => {
    if (!gameState) return;
    const filtered = gameState.vehicles.filter((v) => v.id !== vehId);
    saveState({ ...gameState, vehicles: filtered });
  };

  const handleUpdateVehicle = (vehId: string, updatedVeh: Partial<Vehicle>) => {
    if (!gameState) return;
    const updated = gameState.vehicles.map((v) => {
      if (v.id === vehId) {
        return { ...v, ...updatedVeh } as Vehicle;
      }
      return v;
    });
    saveState({ ...gameState, vehicles: updated });
  };

  const handleBuyItem = (item: PersonalItem) => {
    if (!gameState) return;
    saveState({ ...gameState, personalItems: [...gameState.personalItems, item] });
  };

  const handleSellItem = (itemId: string) => {
    if (!gameState) return;
    const filtered = gameState.personalItems.filter((i) => i.id !== itemId);
    saveState({ ...gameState, personalItems: filtered });
  };

  const handleBuyBusiness = (biz: Business) => {
    if (!gameState) return;
    saveState({ ...gameState, businesses: [...gameState.businesses, biz] });
  };

  const handleSellBusiness = (bizId: string) => {
    if (!gameState) return;
    const filtered = gameState.businesses.filter((b) => b.id !== bizId);
    saveState({ ...gameState, businesses: filtered });
  };

  const handleUpdateBusiness = (bizId: string, updatedBiz: Partial<Business>) => {
    if (!gameState) return;
    const updated = gameState.businesses.map((b) => {
      if (b.id === bizId) {
        return { ...b, ...updatedBiz } as Business;
      }
      return b;
    });
    saveState({ ...gameState, businesses: updated });
  };

  // Careers callbacks
  const handleApplyEducation = (edu: EducationPath) => {
    if (!gameState) return;
    const currentStats = { ...gameState.stats };
    saveState({
      ...gameState,
      cash: gameState.cash - edu.cost,
      currentEducation: { id: edu.id, yearsLeft: edu.duration },
      history: [
        ...gameState.history,
        {
          age: gameState.age,
          text: `Enrolled in the prestigious program: "${edu.name}". You paid $${edu.cost.toLocaleString()} and started reading thick textbooks.`,
          type: "standard"
        }
      ]
    });
  };

  const handleGetJob = (career: Career) => {
    if (!gameState) return;
    saveState({
      ...gameState,
      currentCareer: career,
      history: [
        ...gameState.history,
        {
          age: gameState.age,
          text: `💼 Hired! You joined "${career.title}" within the "${career.field}" sector. Expecting $${career.salary.toLocaleString()}/yr.`,
          type: "career"
        }
      ]
    });
  };

  const handleQuitJob = () => {
    if (!gameState) return;
    const oldTitle = gameState.currentCareer?.title || "job";
    saveState({
      ...gameState,
      currentCareer: null,
      history: [
        ...gameState.history,
        {
          age: gameState.age,
          text: `You dramatically packed your stuff in a plastic bin and walked out of your position as ${oldTitle}. Freedom!`,
          type: "career"
        }
      ]
    });
  };

  const handleUpdateYearlyFocus = (focus: "career" | "relationship" | "health" | "education" | "wealth") => {
    if (!gameState) return;
    saveState({
      ...gameState,
      yearlyFocus: focus
    });
  };

  const handleContinueAsChild = (child: NPC) => {
    if (!gameState) return;
    
    setViewingLegacy(false);
    
    // We inherit 85% of parent's wealth!
    const legacyCash = Math.round(gameState.netWorth * 0.85);
    
    // Initial stats for the child with all fields populated
    const childStats: PlayerStats = {
      health: 100,
      happiness: 85,
      sanity: 90,
      luck: Math.min(100, Math.round(50 + Math.random() * 25)),
      strength: 55,
      fitness: 70,
      attractiveness: Math.min(100, Math.round(50 + Math.random() * 30)),
      charisma: Math.min(100, Math.round(50 + Math.random() * 30)),
      intelligence: Math.min(100, Math.round(55 + Math.random() * 25)), // genetic intelligence!
      creativity: Math.min(100, Math.round(50 + Math.random() * 30)),
      fame: 0,
      reputation: 20,
      morality: Math.min(100, Math.max(0, Math.round(gameState.stats.morality + (Math.random() * 20 - 10)))), // genetic moral baseline!
      stress: 10,
    };

    // Parent becomes a deceased NPC in our npcs list!
    const deceasedParent: NPC = {
      id: "deceased_parent_" + Date.now(),
      name: gameState.name,
      age: gameState.age,
      gender: gameState.gender,
      relationValue: 100,
      relationType: "Parent",
      isAlive: false,
      occupation: gameState.currentCareer?.title || "Retired",
      personality: "Legendary",
      memories: ["Settled a gigantic inheritance on you."]
    };

    const siblingNPCs = gameState.npcs.filter((n) => n.id !== child.id);
    
    const nextGame: GameState = {
      name: child.name,
      gender: child.gender,
      age: child.age, // starts at child's actual age!
      cash: legacyCash,
      netWorth: legacyCash,
      stats: childStats,
      appearance: {
        skinColor: gameState.appearance.skinColor,
        hairStyle: "short",
        hairColor: gameState.appearance.hairColor,
        eyeColor: gameState.appearance.eyeColor,
        clothing: "casual",
        accessory: "none",
        facialExpression: "neutral"
      },
      traits: ["Heir", "Ambitious"],
      educationCompleted: child.age >= 18 ? ["High School"] : [],
      currentEducation: null,
      currentCareer: null,
      history: [
        {
          age: child.age,
          text: `👑 Dynasty Continuation: You have assumed the legacy of your late parent, ${gameState.name}. You inherited 85% of their total estate ($${legacyCash.toLocaleString()}) and are ready to forge your own bizarre path in history.`,
          type: "birth"
        }
      ],
      npcs: [deceasedParent, ...siblingNPCs],
      properties: [],
      vehicles: [],
      personalItems: [
        {
          id: "parent_will",
          name: `Official Will & Testament of ${gameState.name}`,
          category: "Sentimental",
          value: 100,
          condition: 100,
          rarity: "rare",
          emotionalValue: 100,
          description: `Passed down to you. Dictated that you inherit $${legacyCash.toLocaleString()} and the solemn duty of making even worse life decisions.`
        }
      ],
      businesses: [],
      pets: [],
      isDead: false,
      deathReason: "",
      crimeRecordCount: 0,
      fameFollowers: 0,
      yearlyFocus: "career",
      calendarYear: gameState.calendarYear || 2026,
      season: "Spring",
      lifeStage: child.age <= 2 ? "Infancy" : child.age <= 12 ? "Childhood" : child.age <= 17 ? "Teen Years" : "Young Adult",
      delayedEffects: [],
      decisionFlags: {},
      activeNews: [`📜 ANNOUNCEMENT: The late ${gameState.name}'s estate has been settled. ${child.name} has taken over the family name and starting funds of $${legacyCash.toLocaleString()}!`],
      worldCondition: gameState.worldCondition || {
        economy: "normal",
        politicalClimate: "Bureaucracy of spreadsheet lovers",
        weather: "Cozy breeze"
      },
      investments: {
        TURNIP: 0,
        SSYN: 0,
        CWP: 0,
        GOLD: 0,
        FROG: 0
      },
      stockPrices: gameState.stockPrices || {
        TURNIP: 10,
        SSYN: 150,
        CWP: 50,
        GOLD: 400,
        FROG: 1.50
      }
    };

    saveState(nextGame);
  };

  const handleRestart = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGameState(null);
    setViewingLegacy(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row items-center justify-center p-0 md:p-6 gap-6 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Dev Blueprint side card for desktop reviews */}
      <div className="hidden lg:flex flex-col w-[320px] h-[860px] bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-300 overflow-y-auto scrollbar">
        <h3 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Dev Blueprint & Plan
        </h3>
        <div className="mt-4 text-xs">
          <TechnicalPlan />
        </div>
      </div>

      {/* Sleek physical phone container on desktop, full-screen on mobile devices */}
      <div className="w-full h-screen md:h-[860px] md:max-w-[410px] bg-white md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col relative overflow-hidden transition-all">
        
        {/* Top Minimalist Speaker & Camera Notch (physical phone aesthetic) */}
        <div className="hidden md:flex absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-50 items-center justify-center gap-1.5 px-3">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-900 rounded-full border border-slate-700"></div>
        </div>

        {/* Dynamic Screen Viewport */}
        <div className="flex-grow flex flex-col h-full overflow-hidden relative pt-0 md:pt-4">
          {showTechnicalDocOnly ? (
            <div className="flex-grow flex flex-col h-full bg-slate-50 overflow-hidden">
              <div className="bg-slate-900 text-white p-3 flex justify-between items-center shrink-0">
                <span className="text-xs font-black tracking-widest uppercase">Dev Blueprint</span>
                <button
                  onClick={() => setShowTechnicalDocOnly(false)}
                  className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer"
                >
                  Back
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-4 scrollbar">
                <TechnicalPlan />
              </div>
            </div>
          ) : gameState === null ? (
            <CharacterCreator onStartGame={handleStartGame} />
          ) : gameState.isDead ? (
            !viewingLegacy ? (
              <GodAfterlifeReview
                state={gameState}
                onBeginAnotherLife={handleRestart}
                onViewLegacy={() => setViewingLegacy(true)}
                onContinueAsChild={handleContinueAsChild}
              />
            ) : (
              /* High-Contrast Comedy Death Screen optimized for mobile zero-scroll format */
              <div className="flex-grow flex flex-col justify-between bg-slate-900 text-white p-5 overflow-y-auto scrollbar relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500"></div>
                
                <div className="space-y-4 text-center mt-4">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 bg-rose-950/40 border border-rose-500/30 rounded-full flex items-center justify-center shadow-lg">
                      <Skull className="w-7 h-7 text-rose-500 animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-rose-400 font-black">The End of the Line</span>
                    <h2 className="text-xl font-black tracking-tight uppercase leading-none text-white">Epitaph for {gameState.name}</h2>
                    <p className="text-[11px] text-slate-300 italic leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5 mt-2">
                      "{gameState.deathReason}"
                    </p>
                  </div>
                </div>

                {/* Statistics Bento */}
                <div className="grid grid-cols-2 gap-2.5 bg-slate-950/50 p-4 rounded-xl border border-white/5 my-4 text-left">
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase block tracking-wider">Final Age</span>
                    <span className="text-white font-black text-sm block font-mono">{gameState.age} Years</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase block tracking-wider">Net Worth</span>
                    <span className="text-emerald-400 font-black text-sm block font-mono">${gameState.netWorth.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase block tracking-wider">Adopted Pets</span>
                    <span className="text-pink-400 font-black text-sm block font-mono">{gameState.pets.length} Companions</span>
                  </div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase block tracking-wider">Career Peak</span>
                    <span className="text-indigo-400 font-black text-[10px] block truncate mt-0.5">
                      {gameState.currentCareer ? gameState.currentCareer.title : "Unemployed Vagabond"}
                    </span>
                  </div>
                </div>

                {/* Dynasty Selection */}
                {(() => {
                  const livingChildren = gameState.npcs.filter(
                    (n) => n.isAlive && (n.relationType === "Child" || n.relationType === "Son" || n.relationType === "Daughter")
                  );
                  if (livingChildren.length === 0) return null;

                  return (
                    <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3.5 space-y-2 text-left mb-4">
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-pink-500" />
                        Dynasty Succession ({livingChildren.length} Heirs)
                      </h4>
                      <p className="text-[9px] text-slate-400 leading-snug">
                        Tap an heir to assume their identity and inherit 85% of your parent's assets:
                      </p>
                      
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {livingChildren.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleContinueAsChild(child)}
                            className="bg-slate-900 border border-white/5 hover:border-indigo-500/20 rounded-lg p-2 flex items-center justify-between text-left w-full group transition-all cursor-pointer"
                          >
                            <div>
                              <span className="font-extrabold text-white text-[10px] block leading-none">
                                {child.name}
                              </span>
                              <span className="text-[8px] text-slate-400 mt-0.5 block">
                                {child.relationType} • Age {child.age}
                              </span>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono font-black">
                              +${(gameState.netWorth * 0.85).toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setViewingLegacy(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    🌌 Return to Celestial Court
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reincarnate (Restart)
                  </button>
                </div>
              </div>
            )
          ) : (
            <GameDashboard
              state={gameState}
              activeEvent={activeEvent}
              onChoiceSelected={handleChoiceSelected}
              onRestart={handleRestart}
              onAgeUp={handleAgeUp}
              onAction={handleAction}
              onUpdateNPC={handleUpdateNPC}
              onAdoptPet={handleAdoptPet}
              onInteractPet={handleInteractPet}
              onBuyProperty={handleBuyProperty}
              onSellProperty={handleSellProperty}
              onEvictTenant={handleEvictTenant}
              onAddTenant={handleAddTenant}
              onUpdateProperty={handleUpdateProperty}
              onBuyVehicle={handleBuyVehicle}
              onSellVehicle={handleSellVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onBuyItem={handleBuyItem}
              onSellItem={handleSellItem}
              onBuyBusiness={handleBuyBusiness}
              onSellBusiness={handleSellBusiness}
              onUpdateBusiness={handleUpdateBusiness}
              onApplyEducation={handleApplyEducation}
              onGetJob={handleGetJob}
              onQuitJob={handleQuitJob}
              onUpdateYearlyFocus={handleUpdateYearlyFocus}
              onBuyStock={handleBuyStock}
              onSellStock={handleSellStock}
              onAddNPC={handleAddNPC}
              onUpdateNPCRelationType={handleUpdateNPCRelationType}
            />
          )}
        </div>
      </div>
    </div>
  );
}

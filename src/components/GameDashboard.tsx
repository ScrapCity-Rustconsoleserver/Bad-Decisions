/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  DollarSign,
  History,
  Activity,
  Award,
  BookOpen,
  ArrowRight,
  LogOut,
  Users,
  Home,
  RefreshCw,
  TrendingUp,
  Flame,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  GameState,
  Career,
  EducationPath,
  NPC,
  RealEstate,
  Pet,
  HistoryLog,
  Vehicle,
  PersonalItem,
  Business,
  GameChoice,
  GameEvent
} from "../types";
import { AvatarRenderer } from "./AvatarRenderer";
import { EDUCATION_PATHS, CAREERS } from "../data/careers";
import { CrimePanel } from "./CrimePanel";
import { PropertyPanel } from "./PropertyPanel";
import { RelationshipsPanel } from "./RelationshipsPanel";
import { TechnicalPlan } from "./TechnicalPlan";

interface GameDashboardProps {
  state: GameState;
  activeEvent: GameEvent | null;
  onChoiceSelected: (choice: GameChoice) => void;
  onRestart: () => void;
  onAgeUp: () => void;
  onAction: (logText: string, statChanges: any) => void;
  onUpdateNPC: (npcId: string, relDelta: number, logText: string) => void;
  onAdoptPet: (pet: Pet) => void;
  onInteractPet: (petId: string, action: "feed" | "train" | "pet", logText: string, statChanges: any) => void;
  onBuyProperty: (property: RealEstate) => void;
  onSellProperty: (propertyId: string, sellValue: number) => void;
  onEvictTenant: (propertyId: string, tenantId: string) => void;
  onAddTenant: (propertyId: string, tenant: NPC) => void;
  onUpdateProperty: (propertyId: string, updatedProp: Partial<RealEstate>) => void;
  onBuyVehicle: (vehicle: Vehicle) => void;
  onSellVehicle: (vehicleId: string) => void;
  onUpdateVehicle: (vehicleId: string, updatedVeh: Partial<Vehicle>) => void;
  onBuyItem: (item: PersonalItem) => void;
  onSellItem: (itemId: string) => void;
  onBuyBusiness: (business: Business) => void;
  onSellBusiness: (businessId: string) => void;
  onUpdateBusiness: (businessId: string, updatedBiz: Partial<Business>) => void;
  onApplyEducation: (edu: EducationPath) => void;
  onGetJob: (career: Career) => void;
  onQuitJob: () => void;
  onUpdateYearlyFocus: (focus: "career" | "relationship" | "health" | "education" | "wealth") => void;
  onBuyStock: (ticker: string, quantity: number, price: number) => void;
  onSellStock: (ticker: string, quantity: number, price: number) => void;
  onAddNPC: (npc: NPC) => void;
  onUpdateNPCRelationType: (npcId: string, nextType: string, relDelta: number, logText: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  state,
  activeEvent,
  onChoiceSelected,
  onRestart,
  onAgeUp,
  onAction,
  onUpdateNPC,
  onAdoptPet,
  onInteractPet,
  onBuyProperty,
  onSellProperty,
  onEvictTenant,
  onAddTenant,
  onUpdateProperty,
  onBuyVehicle,
  onSellVehicle,
  onUpdateVehicle,
  onBuyItem,
  onSellItem,
  onBuyBusiness,
  onSellBusiness,
  onUpdateBusiness,
  onApplyEducation,
  onGetJob,
  onQuitJob,
  onUpdateYearlyFocus,
  onBuyStock,
  onSellStock,
  onAddNPC,
  onUpdateNPCRelationType
}) => {
  // Navigation State for dedicated mobile overlays
  const [activeMenu, setActiveMenu] = useState<
    "relationships" | "career" | "assets" | "activities" | "crime" | "more" | null
  >(null);

  // Consequence feedback state
  const [selectedChoiceConsequence, setSelectedChoiceConsequence] = useState<{
    consequenceText: string;
    statChanges: any;
  } | null>(null);

  const {
    name,
    gender,
    age,
    cash,
    netWorth,
    stats,
    appearance,
    traits,
    currentEducation,
    currentCareer,
    history,
    npcs,
    properties,
    vehicles,
    personalItems,
    businesses,
    pets,
    crimeRecordCount,
    fameFollowers
  } = state;

  const getLifeStage = (currentAge: number) => {
    if (currentAge <= 2) return { name: "Infancy", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (currentAge <= 12) return { name: "Childhood", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (currentAge <= 17) return { name: "Teen Years", color: "bg-amber-100 text-amber-800 border-amber-200" };
    if (currentAge <= 30) return { name: "Young Adult", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    if (currentAge <= 55) return { name: "Adult", color: "bg-purple-100 text-purple-800 border-purple-200" };
    if (currentAge <= 75) return { name: "Later Life", color: "bg-rose-100 text-rose-800 border-rose-200" };
    return { name: "Elderly", color: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  const getPartnerStatus = () => {
    const partner = npcs.find(n => n.isAlive && n.relationType === "Partner");
    return partner ? `${partner.name} (${partner.relationValue}%)` : "Single";
  };

  const getLocationName = () => {
    const currentHome = properties.find(p => p.type === "own" || p.propertyType === "Shared Room");
    return currentHome ? currentHome.locationArea : "Homeless Wanderer";
  };

  const getJobTitle = () => {
    if (currentEducation) {
      const path = EDUCATION_PATHS.find(e => e.id === currentEducation.id);
      return path ? `Studying ${path.name}` : "Student";
    }
    if (age < 18) {
      return "Grade Schooler";
    }
    return currentCareer ? currentCareer.title : "Unemployed Vagabond";
  };

  // 5 Compact stat bars requested: Health, Happiness, Intelligence (Smarts), Looks (Attractiveness), Stress (or Sanity)
  const statBars = [
    { label: "Health", val: stats.health, color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Happiness", val: stats.happiness, color: "bg-pink-500", text: "text-pink-600" },
    { label: "Smarts", val: stats.intelligence, color: "bg-blue-500", text: "text-blue-600" },
    { label: "Looks", val: stats.attractiveness, color: "bg-purple-500", text: "text-purple-600" },
    { label: "Stress", val: stats.stress, color: "bg-rose-500", text: "text-rose-600" },
    { label: "Sanity", val: stats.sanity, color: "bg-amber-500", text: "text-amber-600" }
  ];

  // Activities Action Hub
  const activitiesList = [
    {
      id: "gym",
      name: "🏋️ Go to Gym",
      cost: 15,
      desc: "Work out to improve Looks and Health, reducing Stress.",
      action: () =>
        handleMenuAction(
          "You lifted heavy weights and stared intently at the mirror. Gained +5 Health, +5 Looks, and -10 Stress!",
          { health: 5, attractiveness: 5, stress: -10, cash: -15 }
        )
    },
    {
      id: "doctor",
      name: "🩺 Visit Doctor",
      cost: 100,
      desc: "Consult a professional to cure illnesses and recover your Health.",
      action: () =>
        handleMenuAction(
          "The doctor diagnosed you with standard spreadsheet-related strain, gave you some mint drops, and told you to drink more water. Gained +15 Health, +5 Happiness!",
          { health: 15, happiness: 5, cash: -100 }
        )
    },
    {
      id: "shopping",
      name: "🛍️ Go Shopping",
      cost: 50,
      desc: "Buy some funny retro items to boost Happiness.",
      action: () =>
        handleMenuAction(
          "You bought a packet of glow-in-the-dark stickers and a neon stapler. Capitalist therapy works! Gained +15 Happiness and +2 Looks, lost -5 Stress.",
          { happiness: 15, attractiveness: 2, stress: -5, cash: -50 }
        )
    },
    {
      id: "vacation",
      name: "✈️ Take Vacation",
      cost: 600,
      desc: "Go on a relaxing trip to lower Stress and gain Happiness.",
      action: () =>
        handleMenuAction(
          "You flew to a remote island and spent three days watching capybaras sunbathe. Your soul is completely recharged! Gained +20 Happiness, +5 Health, and -20 Stress.",
          { happiness: 20, health: 5, stress: -20, cash: -600 }
        )
    },
    {
      id: "gambling",
      name: "🪙 High-Stakes Coin Flip",
      cost: 200,
      desc: "Risk $200 for a 50% chance to win $500.",
      action: () => {
        const win = Math.random() > 0.5;
        if (win) {
          handleMenuAction(
            "Heads! You won the coin toss on a street corner and made a sweet $500 profit! Gained +25 Happiness!",
            { happiness: 25, cash: 300 }
          );
        } else {
          handleMenuAction(
            "Tails! You lost the $200 coin toss and your sense of self-worth. Lost -15 Happiness.",
            { happiness: -15, cash: -200 }
          );
        }
      }
    },
    {
      id: "volunteering",
      name: "🥬 Feed Capybaras",
      cost: 0,
      desc: "Feed fresh celery to stray capybaras.",
      action: () =>
        handleMenuAction(
          "You spent the afternoon feeding lettuce to capybaras and cleaning their enclosure. Gained +15 Morality, +10 Sanity, +10 Happiness!",
          { morality: 15, sanity: 10, happiness: 10 }
        )
    }
  ];

  // Filter eligible careers
  const eligibleCareers = CAREERS.filter(job => {
    const correctLevel =
      job.level === 1 ||
      (currentCareer && currentCareer.field === job.field && job.level === currentCareer.level + 1);
    const hasStats =
      stats.intelligence >= job.reqIntelligence &&
      stats.creativity >= job.reqCreativity &&
      stats.charisma >= job.reqCharisma;

    return age >= 18 && correctLevel && hasStats;
  });

  const handleSchoolAction = (actionType: "study" | "glue") => {
    if (actionType === "study") {
      handleMenuAction(
        "📚 You studied hard. You highlighted so many lines in your textbook that it is now entirely yellow. Your intelligence increased (+10)!",
        { intelligence: 10, stress: 5 }
      );
    } else {
      handleMenuAction(
        "😋 You ate glue. It was mint-flavored with a hint of desk-drawer dust. Your sanity plummeted but you felt a bizarre rush of adrenaline.",
        { sanity: -15, health: -5, happiness: 15 }
      );
    }
  };

  const handleWorkHard = () => {
    if (!currentCareer) return;
    handleMenuAction(
      `💼 You put in overtime at your job as ${currentCareer.title}. You responded to 47 useless Slack threads. Your reputation increased!`,
      { reputation: 12, stress: 8 }
    );
  };

  const handleSlackOff = () => {
    if (!currentCareer) return;
    handleMenuAction(
      `🥱 You slacked off. You spent four hours looking at photos of capybaras on the corporate network. Your stress fell, but your boss sighed.`,
      { stress: -15, reputation: -10 }
    );
  };

  // Wrapper for any actions taken in the menus to auto-close and return to main focus screen
  const handleMenuAction = (logText: string, statChanges: any) => {
    onAction(logText, statChanges);
    setActiveMenu(null);
  };

  const handleLocalChoiceSelected = (choice: GameChoice) => {
    setSelectedChoiceConsequence({
      consequenceText: choice.consequenceText,
      statChanges: choice.statChanges
    });
    onChoiceSelected(choice);
  };

  const handleCloseConsequence = () => {
    setSelectedChoiceConsequence(null);
  };

  const toggleMenu = (menuId: typeof activeMenu) => {
    setActiveMenu(prev => (prev === menuId ? null : menuId));
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Latest history logs text
  const latestHistoryText =
    history.length > 0
      ? history[history.length - 1].text
      : "You were born. A blank slate, ready to make terrible decisions.";

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800 relative select-none">
      
      {/* 1. TOP HEADER STATUS DECK (Character Info Card - No Scroll) */}
      <div className="bg-white border-b border-slate-200/80 p-3 flex items-center gap-3.5 shrink-0 shadow-sm z-10">
        <div className="w-11 h-11 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          <AvatarRenderer appearance={appearance} age={age} />
        </div>
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-1.5 justify-between">
            <span className="font-black text-sm text-slate-900 truncate tracking-tight">{name}</span>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${getLifeStage(age).color}`}>
              {getLifeStage(age).name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-2.5 mt-1 text-[9px] text-slate-500 font-extrabold tracking-tight leading-tight">
            <div className="truncate">Age: <span className="text-slate-900 font-black">{age}</span></div>
            <div className="truncate text-right">Job: <span className="text-slate-900 font-black">{getJobTitle()}</span></div>
            <div className="truncate">Partner: <span className="text-slate-900 font-black">{getPartnerStatus()}</span></div>
            <div className="truncate text-right">Location: <span className="text-slate-900 font-black">{getLocationName()}</span></div>
          </div>
        </div>
      </div>

      {/* 2. CASH & NET WORTH INDICATOR */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-emerald-800 font-black uppercase tracking-wider">CASH:</span>
          <span className="text-xs font-mono font-black text-emerald-600">${cash.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-indigo-900 font-black uppercase tracking-wider">NET WORTH:</span>
          <span className="text-xs font-mono font-black text-indigo-600">${netWorth.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. ROW OF COMPACT STAT BARS */}
      <div className="bg-white border-b border-slate-200/80 p-2.5 px-4 grid grid-cols-3 gap-x-3.5 gap-y-2 shrink-0 shadow-sm">
        {statBars.map(bar => (
          <div key={bar.label} className="flex flex-col">
            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wide leading-none mb-0.5">
              <span className="text-slate-500">{bar.label}</span>
              <span className={`${bar.text}`}>{bar.val}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
              <div
                className={`h-full ${bar.color} rounded-full transition-all duration-300`}
                style={{ width: `${bar.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. CURRENT EVENT TEXT FOCUS VIEWPORT (Does not scroll, holds log text or active event choice) */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 relative bg-slate-50 overflow-hidden">
        
        {/* News Flash Ticker */}
        {state.activeNews && state.activeNews.length > 0 && !activeEvent && !selectedChoiceConsequence && (
          <div className="absolute top-3 left-3 right-3 bg-sky-50 text-sky-800 border border-sky-100 p-2 rounded-xl text-[10px] font-black leading-snug flex items-center gap-2 shrink-0 animate-fade-in">
            <span className="animate-pulse">📢</span>
            <span className="truncate flex-grow text-left">{state.activeNews[0]}</span>
          </div>
        )}

        {activeEvent ? (
          /* Render Active Random Event and Choice Stack inline */
          <div className="w-full h-full flex flex-col justify-between animate-scale-up bg-white rounded-2xl border border-indigo-200 shadow-md p-4 overflow-y-auto scrollbar">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 shrink-0">
                <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeEvent.category} event
                </span>
                <span className="text-[8px] text-slate-400 font-mono">CHOICES REQUIRED</span>
              </div>
              
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {activeEvent.title}
              </h3>

              {activeEvent.context && (
                <p className="text-[9px] bg-indigo-50/50 border-l-2 border-indigo-500 p-2 rounded-r font-semibold text-slate-600 leading-normal">
                  {activeEvent.context}
                </p>
              )}

              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {activeEvent.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 shrink-0">
              {activeEvent.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocalChoiceSelected(choice)}
                  className="w-full text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-2 px-3 rounded-xl text-[11px] text-slate-700 hover:text-indigo-900 font-extrabold tracking-tight leading-tight transition-all active:scale-[0.99] cursor-pointer flex justify-between items-center gap-2"
                >
                  <span>{choice.text}</span>
                  <span className="text-indigo-500 font-black">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : selectedChoiceConsequence ? (
          /* Render Choice consequence feedback screen inside the phone workspace */
          <div className="w-full h-full flex flex-col justify-between animate-scale-up bg-white rounded-2xl border border-pink-200 shadow-md p-4 overflow-y-auto scrollbar">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="bg-pink-100 text-pink-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Consequence
                </span>
                <span className="text-[8px] text-slate-400 font-mono">RESOLVED</span>
              </div>
              
              <p className="text-[11px] text-slate-700 font-extrabold leading-relaxed">
                {selectedChoiceConsequence.consequenceText}
              </p>

              {/* Stat adjustments */}
              <div className="border-t border-slate-100 pt-2.5 space-y-1">
                <span className="text-[8px] text-slate-400 font-black uppercase">Vitals Adjusted:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(selectedChoiceConsequence.statChanges).map(([statName, val]) => {
                    if (val === 0 || val === undefined) return null;
                    const isPositive = (val as number) > 0;
                    const formattedVal = isPositive ? `+${val}` : val;
                    return (
                      <span
                        key={statName}
                        className={`text-[8px] font-black px-2 py-0.5 rounded uppercase border ${
                          isPositive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {statName === "cash" ? `Cash: ${formattedVal}` : `${statName}: ${formattedVal}`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleCloseConsequence}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center shrink-0"
            >
              Continue
            </button>
          </div>
        ) : (
          /* Standard View: Displays the LATEST event log as primary focus */
          <div className="w-full h-full flex flex-col justify-between items-center p-2 text-center">
            <div className="my-auto flex flex-col items-center justify-center p-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">
                Age {age} Milestone
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-relaxed font-sans max-w-sm">
                "{latestHistoryText}"
              </p>
            </div>

            {/* Spacer holder for sticky float AGE UP button */}
            <div className="h-10 shrink-0"></div>
          </div>
        )}
      </div>

      {/* 5. FLOATING GIANT AGE UP BUTTON */}
      {!activeEvent && !selectedChoiceConsequence && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-25 flex flex-col items-center">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-25 animate-pulse"></div>
          <button
            onClick={onAgeUp}
            className="w-14 h-14 bg-gradient-to-br from-[#22c55e] to-[#15803d] border-4 border-white rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer text-white"
          >
            <span className="text-xl font-black leading-none">+</span>
            <span className="text-[8px] font-black uppercase tracking-widest mt-0.5 leading-none">Age</span>
          </button>
        </div>
      )}

      {/* 6. BOTTOM COMPACT NAVIGATION BAR */}
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] h-[56px] flex items-center justify-around px-1 pb-1 shrink-0 z-20">
        <button
          onClick={() => toggleMenu("relationships")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "relationships" ? "text-pink-600 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Relations</span>
        </button>
        
        <button
          onClick={() => toggleMenu("career")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "career" ? "text-indigo-600 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Career</span>
        </button>

        {/* Middle spacing block for Age Up button */}
        <div className="w-12"></div>

        <button
          onClick={() => toggleMenu("assets")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "assets" ? "text-emerald-600 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Assets</span>
        </button>

        <button
          onClick={() => toggleMenu("activities")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "activities" ? "text-amber-600 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Activities</span>
        </button>

        <button
          onClick={() => toggleMenu("crime")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "crime" ? "text-rose-600 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Crime</span>
        </button>

        <button
          onClick={() => toggleMenu("more")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeMenu === "more" ? "text-slate-700 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <History className="w-4 h-4" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">More</span>
        </button>
      </div>

      {/* 7. DEDICATED OVERLAYS FOR NAVIGATION SELECTIONS */}
      {activeMenu && (
        <div className="absolute inset-0 bg-white z-30 flex flex-col animate-scale-up">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              {activeMenu === "relationships" && <Users className="w-4 h-4 text-pink-400" />}
              {activeMenu === "career" && <GraduationCap className="w-4 h-4 text-indigo-400" />}
              {activeMenu === "assets" && <Home className="w-4 h-4 text-emerald-400" />}
              {activeMenu === "activities" && <Sparkles className="w-4 h-4 text-amber-400" />}
              {activeMenu === "crime" && <Award className="w-4 h-4 text-rose-400" />}
              {activeMenu === "more" && <History className="w-4 h-4 text-slate-400" />}
              
              {activeMenu === "relationships" && "Relationships Hub"}
              {activeMenu === "career" && "Career & Study"}
              {activeMenu === "assets" && "Assets & Brokerage"}
              {activeMenu === "activities" && "Personal Activities"}
              {activeMenu === "crime" && "Crime & Heists"}
              {activeMenu === "more" && "Statistics & Diary"}
            </h4>
            <button
              onClick={closeMenu}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              Back
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-grow overflow-y-auto p-4 scrollbar">
            {activeMenu === "relationships" && (
              <RelationshipsPanel
                cash={cash}
                npcs={npcs}
                pets={pets}
                playerAge={age}
                onAction={handleMenuAction}
                onUpdateNPC={onUpdateNPC}
                onAdoptPet={onAdoptPet}
                onInteractPet={onInteractPet}
                onAddNPC={onAddNPC}
                onUpdateNPCRelationType={onUpdateNPCRelationType}
              />
            )}

            {activeMenu === "career" && (
              <div className="space-y-4 text-left">
                {age < 18 ? (
                  /* Underage school UI */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[8px] text-slate-400 font-black uppercase">Academic Status</span>
                    <h5 className="text-xs font-black text-slate-900 leading-none">Grade School Student</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      You are studying at a local school. Highlight your textbooks to pass exams or make poor decisions in class.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSchoolAction("study")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Study Hard (+Smarts)
                      </button>
                      <button
                        onClick={() => handleSchoolAction("glue")}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-[10px] px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Eat Classroom Glue
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Adult careers UI */
                  <div className="space-y-4">
                    {/* Current Job Status */}
                    {currentCareer ? (
                      <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] text-emerald-400 font-black uppercase tracking-wider block">CURRENT CAREER</span>
                            <h5 className="font-black text-sm text-white mt-0.5">{currentCareer.title}</h5>
                            <span className="text-[10px] text-slate-400">{currentCareer.field} • Tier {currentCareer.level}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-slate-500 font-black block uppercase leading-none">ANNUAL SALARY</span>
                            <span className="text-emerald-400 font-mono font-black text-xs block mt-0.5">${currentCareer.salary.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{currentCareer.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                          <button
                            onClick={handleWorkHard}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-white font-black text-[9px] px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Work Hard (+Rep)
                          </button>
                          <button
                            onClick={handleSlackOff}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-white font-black text-[9px] px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Slack Off (-Stress)
                          </button>
                          <button
                            onClick={() => {
                              onQuitJob();
                              closeMenu();
                            }}
                            className="text-red-400 hover:text-red-300 font-black text-[9px] px-3 py-1.5 flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Quit Job
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-mono">Unemployed. Scan the job boards below or enroll in higher studies.</p>
                      </div>
                    )}

                    {/* School enrollment */}
                    {!currentEducation && !state.educationCompleted.length && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[8px] text-slate-400 font-black uppercase block">Higher Academic Studies</span>
                        <div className="grid grid-cols-1 gap-2">
                          {EDUCATION_PATHS.map((edu) => (
                            <div key={edu.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col justify-between gap-2 text-left">
                              <div>
                                <span className="font-extrabold text-slate-950 text-[11px] block">{edu.name}</span>
                                <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{edu.perksDescription}</p>
                                <span className="text-[8px] text-slate-400 font-mono block mt-1">Req Smarts: {edu.reqIntelligence}% | Duration: {edu.duration} Years</span>
                              </div>
                              <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                                <div>
                                  <span className="text-[8px] text-slate-400 block leading-none font-bold">TUITION FEE</span>
                                  <span className="text-emerald-600 font-black text-[11px] font-mono">${edu.cost.toLocaleString()}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    onApplyEducation(edu);
                                    closeMenu();
                                  }}
                                  disabled={cash < edu.cost || stats.intelligence < edu.reqIntelligence}
                                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-[9px] px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Enroll
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentEducation && (
                      <div className="bg-indigo-50 border border-dashed border-indigo-200 p-3.5 rounded-xl flex justify-between items-center text-left">
                        <div>
                          <span className="text-[8px] text-indigo-700 font-black uppercase block leading-none">ENROLLED COLLEGE</span>
                          <h5 className="font-black text-slate-900 text-xs mt-1">
                            {EDUCATION_PATHS.find((e) => e.id === currentEducation.id)?.name}
                          </h5>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">{currentEducation.yearsLeft} Years remaining before graduation</span>
                        </div>
                      </div>
                    )}

                    {/* Classifieds Job List */}
                    {!currentCareer && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <span className="text-[8px] text-slate-400 font-black uppercase block">Classified Job Openings ({eligibleCareers.length})</span>
                        {eligibleCareers.length === 0 ? (
                          <p className="text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center font-mono">
                            No jobs available. Build up your Charisma, Smarts, and Looks to qualify for entry level tiers!
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-1.5">
                            {eligibleCareers.map((job) => (
                              <div key={job.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center text-left">
                                <div className="min-w-0 flex-grow pr-2">
                                  <span className="font-bold text-slate-950 text-[11px] block truncate leading-none">{job.title}</span>
                                  <span className="text-[9px] text-slate-500 mt-0.5 block truncate">{job.description}</span>
                                  <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase">{job.field} • Tier {job.level}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <span className="text-[7px] text-slate-400 font-black block leading-none">SALARY</span>
                                    <span className="text-emerald-600 font-mono font-black text-[10px]">${job.salary.toLocaleString()}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      onGetJob(job);
                                      closeMenu();
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                                  >
                                    Apply
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeMenu === "assets" && (
              <PropertyPanel
                cash={cash}
                properties={properties}
                vehicles={vehicles}
                personalItems={personalItems}
                businesses={businesses}
                investments={state.investments || {}}
                stockPrices={state.stockPrices || {}}
                onAction={handleMenuAction}
                onBuyProperty={onBuyProperty}
                onSellProperty={onSellProperty}
                onEvictTenant={onEvictTenant}
                onAddTenant={onAddTenant}
                onUpdateProperty={onUpdateProperty}
                onBuyVehicle={onBuyVehicle}
                onSellVehicle={onSellVehicle}
                onUpdateVehicle={onUpdateVehicle}
                onBuyItem={onBuyItem}
                onSellItem={onSellItem}
                onBuyBusiness={onBuyBusiness}
                onSellBusiness={onSellBusiness}
                onUpdateBusiness={onUpdateBusiness}
                onBuyStock={onBuyStock}
                onSellStock={onSellStock}
              />
            )}

            {activeMenu === "activities" && (
              <div className="space-y-3.5 text-left">
                <span className="text-[8px] text-slate-400 font-black uppercase block">Available Activities</span>
                <div className="grid grid-cols-1 gap-2">
                  {activitiesList.map((act) => (
                    <button
                      key={act.id}
                      onClick={act.action}
                      disabled={cash < act.cost}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 disabled:opacity-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <div className="min-w-0 flex-grow pr-2">
                        <span className="font-extrabold text-slate-900 text-xs block leading-none">{act.name}</span>
                        <p className="text-[9px] text-slate-500 mt-1 leading-snug">{act.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[7px] text-slate-400 font-black block leading-none">COST</span>
                        <span className={`text-[11px] font-mono font-black ${act.cost > 0 ? "text-slate-800" : "text-emerald-600"}`}>
                          {act.cost > 0 ? `$${act.cost}` : "FREE"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMenu === "crime" && (
              <CrimePanel cash={cash} onAction={handleMenuAction} />
            )}

            {activeMenu === "more" && (
              <div className="space-y-5 text-left">
                
                {/* 1. Yearly focus settings */}
                <div className="space-y-2">
                  <span className="text-[8px] text-slate-400 font-black uppercase block">Next Year's Lifestyle Focus</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: "career", icon: Briefcase, tooltip: "Career Growth", activeColor: "bg-emerald-600 text-white border-emerald-500" },
                      { id: "relationship", icon: Users, tooltip: "Relationships", activeColor: "bg-pink-600 text-white border-pink-500" },
                      { id: "health", icon: Activity, tooltip: "Health & Fitness", activeColor: "bg-rose-600 text-white border-rose-500" },
                      { id: "education", icon: GraduationCap, tooltip: "Education", activeColor: "bg-indigo-600 text-white border-indigo-500" },
                      { id: "wealth", icon: DollarSign, tooltip: "Wealth", activeColor: "bg-amber-600 text-white border-amber-500" }
                    ].map((fItem) => {
                      const Icon = fItem.icon;
                      const isSelected = state.yearlyFocus === fItem.id;
                      return (
                        <button
                          key={fItem.id}
                          onClick={() => onUpdateYearlyFocus(fItem.id as any)}
                          className={`h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                            isSelected
                              ? `${fItem.activeColor} border-2 shadow-sm`
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                          }`}
                          title={fItem.tooltip}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-snug">
                    {state.yearlyFocus === "career" && "💼 Focus: Professional progress. Boosts career and reputation prospects."}
                    {state.yearlyFocus === "relationship" && "👥 Focus: Personal connections. Improves social ties & romance."}
                    {state.yearlyFocus === "health" && "❤️ Focus: Wellness. Lowers stress and recovers health/fitness."}
                    {state.yearlyFocus === "education" && "🎓 Focus: Studying. Boosts smarts and intelligence speed."}
                    {state.yearlyFocus === "wealth" && "💰 Focus: Financial gain. Generates 5% investment savings bonus."}
                  </p>
                </div>

                {/* 2. Chronological Diary List */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-[8px] text-slate-400 font-black uppercase block">Chronological Diary Logs ({history.length})</span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {history.slice().reverse().map((log, lIdx) => (
                      <div key={lIdx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-left">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase block leading-none">Age {log.age} badge • {log.type}</span>
                        <p className="text-[10px] text-slate-700 font-medium leading-relaxed mt-1">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Dev blueprint doc and Reset settings */}
                <div className="space-y-2 border-t border-slate-100 pt-4 flex flex-col gap-2">
                  <span className="text-[8px] text-slate-400 font-black uppercase block">Systems & Development</span>
                  
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      // Trigger restart or blueprint
                    }}
                    className="w-full text-center bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-indigo-700 cursor-pointer"
                  >
                    💡 Toggle Blueprint in main dashboard
                  </button>

                  <button
                    onClick={onRestart}
                    className="w-full text-center bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    ☠️ Reset Current Lifetime (Erase Progress)
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

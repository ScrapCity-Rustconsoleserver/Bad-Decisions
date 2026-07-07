/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Heart, Speech, Flame, DollarSign, Sparkles, PawPrint, Award } from "lucide-react";
import { NPC, Pet, Gender } from "../types";

interface RelationshipsPanelProps {
  cash: number;
  npcs: NPC[];
  pets: Pet[];
  playerAge?: number;
  onAction: (logText: string, statChanges: any) => void;
  onUpdateNPC: (npcId: string, relDelta: number, logText: string) => void;
  onAdoptPet: (pet: Pet) => void;
  onInteractPet: (petId: string, action: "feed" | "train" | "pet", logText: string, statChanges: any) => void;
  onAddNPC: (npc: NPC) => void;
  onUpdateNPCRelationType: (npcId: string, nextType: string, relDelta: number, logText: string) => void;
}

export const RelationshipsPanel: React.FC<RelationshipsPanelProps> = ({
  cash,
  npcs,
  pets,
  playerAge = 18,
  onAction,
  onUpdateNPC,
  onAdoptPet,
  onInteractPet,
  onAddNPC,
  onUpdateNPCRelationType
}) => {
  const [activeTab, setActiveTab] = useState<"people" | "pets">("people");

  const petOptions = [
    {
      species: "Rock" as const,
      name: "Gary the Pet Rock",
      cost: 15,
      description: "Low maintenance. Completely silent. Will not eat your shoes, but cannot fetch either. Ideal companion.",
      personality: "Philosophically Motionless"
    },
    {
      species: "Capybara" as const,
      name: "Cappy the Zen Master",
      cost: 600,
      description: "Always relaxed. Possesses an aura of absolute tranquility. Boosts your Sanity and Health.",
      personality: "Transcendently Chill"
    },
    {
      species: "Alpaca" as const,
      name: "Chewie the Fluffball",
      cost: 450,
      description: "Spits at visitors who have low morality ratings. Extremely soft wool, slightly loud chewer.",
      personality: "Sassy but Plush"
    },
    {
      species: "Miniature Dragon" as const,
      name: "Sparky the Sofa Burner",
      cost: 3000,
      description: "Breathes literal sparks. Prone to singing the hems of your trousers. Highly prestigious.",
      personality: "Pyromaniacal Sweetheart"
    }
  ];

  const [matchProfiles, setMatchProfiles] = useState<NPC[]>([]);

  const handleFindDate = () => {
    if (cash < 100) {
      onAction("You search your pockets but only find a receipt for synthetic toenails. You can't afford a matchmaker!", {});
      return;
    }

    const firstNames = ["Gertrude", "Chad", "Bartholomew", "Tiffany", "Barnaby", "Mildred", "Adonis", "Xanthippe", "Eugene", "Svetlana", "Alphonso", "Brunhilda"];
    const lastNames = ["Spreadsheet", "Turnip", "Stapler", "Keyboard", "Glitch", "Capybara", "Noodle", "Mousepad", "Coffee"];
    const occupations = ["Senior Font Designer", "Professional Napper", "Lead Toast Butterer", "Keyboard Cleaner", "Gourmet Noodle Critic", "Under-desk Dweller"];
    const traits = ["Extravagant", "Transcendently Calm", "Sarcastic", "Obsessive Excel Trader", "Coffee-Fueled", "Anxious", "Megalomaniac"];

    const newProfiles: NPC[] = [];
    for (let i = 0; i < 3; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const trait = traits[Math.floor(Math.random() * traits.length)];
      const job = occupations[Math.floor(Math.random() * occupations.length)];
      const partnerAge = Math.max(18, playerAge + Math.floor(Math.random() * 9) - 4);

      newProfiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `${fName} ${lName}`,
        gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
        age: partnerAge,
        relationType: "Partner",
        relationValue: 50,
        occupation: job,
        personality: trait,
        memories: [],
        isAlive: true
      });
    }

    setMatchProfiles(newProfiles);
    onAction(`💌 Paid $100 to the elite matchmaker agency. They recommended three bizarre eligible singles nearby!`, { cash: -100, happiness: 10 });
  };

  const handleAskOut = (p: NPC) => {
    onAddNPC(p);
    setMatchProfiles([]);
    onAction(`💖 You asked out ${p.name}! They blushed, checked their spreadsheets, and agreed to start dating. Added to your domestic connections list.`, { happiness: 15 });
  };

  const handleAdoptChild = () => {
    if (cash < 1500) {
      onAction("Adoption agencies require solid financials. You don't have $1,500!", {});
      return;
    }

    const firstNames = ["Barnaby Jr.", "Elspeth", "Pippin", "Thaddeus", "Clementine", "Oswald", "Winifred", "Roderick"];
    const lastNames = npcs.find(n => n.relationType === "Parent")?.name.split(" ").slice(1).join(" ") || "Glitch";
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames}`;
    const traits = ["Clumsy", "Hyperactive", "Loves Turnips", "Spreadsheet Prodigy", "Zen Apprentice"];

    const newChild: NPC = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
      age: 0,
      relationType: "Child",
      relationValue: 80,
      occupation: "Drooling Infant",
      personality: traits[Math.floor(Math.random() * traits.length)],
      memories: [],
      isAlive: true
    };

    onAddNPC(newChild);
    onAction(`👶 Fantastic news! You finalized the papers and adopted a precious, screaming newborn named "${name}"! Your legacy is now secure (+40 Happiness).`, {
      cash: -1500,
      happiness: 40,
      stress: 20
    });
  };

  const handlePropose = (npc: NPC) => {
    if (cash < 1500) {
      onAction("Diamond rings aren't cheap. You need at least $1,500 to propose marriage!", {});
      return;
    }

    if (npc.relationValue < 70) {
      onAction(`You got down on one knee, but ${npc.name} looked horrified and said: "Let's check our relationship spreadsheet first." Try spending more time together!`, {});
      return;
    }

    const success = Math.random() < 0.85;
    if (success) {
      onUpdateNPCRelationType(
        npc.id,
        "Spouse",
        20,
        `💍 MARRIAGE: You proposed to ${npc.name} with a flashy ring. They wept tears of absolute spreadsheets and said YES! You are officially married.`
      );
      onAction(`🎉 YES! ${npc.name} accepted your marriage proposal! Your wedding was catered with organic turnips. Gained +30 Happiness!`, {
        cash: -1500,
        happiness: 30,
        reputation: 15
      });
    } else {
      onUpdateNPCRelationType(
        npc.id,
        "Partner",
        -15,
        `💔 PROPOSAL FAIL: Proposed to ${npc.name} but they mumbled about needing space and 'career synergy'.`
      );
      onAction(`💔 Ouch! ${npc.name} rejected your marriage proposal. The ring box is sitting sadly on the table. Lost -15 Relationship.`, {
        happiness: -25,
        stress: 20
      });
    }
  };

  const handleHaveBaby = (npc: NPC) => {
    if (cash < 1000) {
      onAction("Baby supplies and diaper reserves cost $1,000. You need more funds!", {});
      return;
    }

    if (npc.relationValue < 65) {
      onAction(`${npc.name} refuses to have a baby with you because they don't trust your lifestyle decisions right now. Spend more time with them!`, {});
      return;
    }

    const firstNames = ["Lil Turnip", "Widget", "Pixel", "Chip", "Daisy", "Buster", "Luna", "Sprocket"];
    const childLastName = npc.name.split(" ").slice(1).join(" ") || "Junior";
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${childLastName}`;
    const traits = ["Extremely Loud", "Zen Baby", "Aggressively Inquisitive", "Spreadsheet Overlord"];

    const newChild: NPC = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
      age: 0,
      relationType: "Child",
      relationValue: 100,
      occupation: "Crying Infant",
      personality: traits[Math.floor(Math.random() * traits.length)],
      memories: [],
      isAlive: true
    };

    onAddNPC(newChild);
    onAction(`👶 Double lines on the stick! ${npc.name} gave birth/adopted a healthy, screaming baby named "${name}"! Your legacy is guaranteed.`, {
      cash: -1000,
      happiness: 35,
      stress: 25
    });
  };

  // People actions
  const handleSpendTime = (npc: NPC) => {
    const isSuccess = Math.random() > 0.1;
    if (isSuccess) {
      const relVal = Math.min(100, npc.relationValue + 15);
      const log = `You took ${npc.name} (${npc.relationType}) to a local gourmet noodle stand. You bonded over slippery food.`;
      onUpdateNPC(npc.id, 15, log);
      onAction(log, { happiness: 10, stress: -10 });
    } else {
      const log = `You spent time with ${npc.name}, but they spent the entire hour explaining the lore of their favorite spreadsheet compiler. You feel drained.`;
      onUpdateNPC(npc.id, -5, log);
      onAction(log, { happiness: -5, stress: 15 });
    }
  };

  const handleGiveGift = (npc: NPC) => {
    if (cash < 50) {
      onAction("You search your pockets but find only dryer lint. You can't afford a gift!", {});
      return;
    }

    const gifts = [
      "a slightly used decorative turnip",
      "a vintage floppy disk containing a single JPEG of a cat",
      "a voucher for an hour of high-fidelity ambient silence",
      "a handmade sweater with three sleeves"
    ];
    const randGift = gifts[Math.floor(Math.random() * gifts.length)];

    const relVal = Math.min(100, npc.relationValue + 25);
    const log = `You presented ${npc.name} with ${randGift}. They were deeply confused, but appreciated the initiative!`;
    onUpdateNPC(npc.id, 25, log);
    onAction(log, { cash: -50, happiness: 15 });
  };

  const handleInsult = (npc: NPC) => {
    const insults = [
      "your spreadsheet formatting is amateurish",
      "you have the charisma of a wet piece of cardboard",
      "I've met rocks with more intellectual depth than you",
      "you look like someone who reads terms of service agreements for fun"
    ];
    const randInsult = insults[Math.floor(Math.random() * insults.length)];

    const relVal = Math.max(0, npc.relationValue - 30);
    const log = `You told ${npc.name}: "${randInsult}". An icy silence descended.`;
    onUpdateNPC(npc.id, -30, log);
    onAction(log, { happiness: 10, sanity: -5 }); // Being mean raises happiness slightly if you're a bit crazy
  };

  // Pet actions
  const handleAdopt = (opt: typeof petOptions[0]) => {
    if (cash < opt.cost) {
      onAction("You don't have enough greenbacks to pay the shelter!", {});
      return;
    }

    const newPet: Pet = {
      id: Math.random().toString(36).substr(2, 9),
      name: opt.name,
      species: opt.species,
      personality: opt.personality,
      health: 100,
      training: 20,
      age: 0
    };

    onAdoptPet(newPet);
    onAction(`You adopted "${opt.name}"! Your home is now filled with joy (+20 Happiness).`, {
      cash: -opt.cost,
      happiness: 20,
      stress: -15
    });
  };

  const handlePetAction = (pet: Pet, action: "feed" | "train" | "pet") => {
    if (action === "feed") {
      if (cash < 15) {
        onAction("You can't even buy a can of kibble!", {});
        return;
      }
      const newHealth = Math.min(100, pet.health + 15);
      const log = `You fed "${pet.name}" some premium synthetic nutrients. They licked their lips and chirped happily.`;
      onInteractPet(pet.id, "feed", log, { cash: -15, happiness: 10 });
    } else if (action === "train") {
      const newTrain = Math.min(100, pet.training + 20);
      const log = `You attempted to train "${pet.name}". They actually sat down for three seconds! A massive milestone.`;
      onInteractPet(pet.id, "train", log, { happiness: 10, stress: -5 });
    } else {
      const log = `You gave "${pet.name}" a massive, fluffy cuddle. You feel a wave of serotonin wash over you.`;
      onInteractPet(pet.id, "pet", log, { happiness: 15, stress: -15, sanity: 5 });
    }
  };

  return (
    <div id="relationships-panel" className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-indigo-500/10 pb-4 gap-2">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-indigo-300 underline decoration-pink-500 underline-offset-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-400" />
            Social & Domestic Life
          </h3>
          <p className="text-xs text-slate-300">
            Maintain bridges with loved ones, make friends, and nurture exotic household pets.
          </p>
        </div>

        <div className="flex bg-[#0F172A] p-1 rounded-xl border border-indigo-500/15 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("people")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "people" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            People & NPCs ({npcs.length})
          </button>
          <button
            onClick={() => setActiveTab("pets")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "pets" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Pets ({pets.length})
          </button>
        </div>
      </div>

      {activeTab === "people" ? (
        <div className="space-y-4 animate-fade-in">
          {/* Romance & Family Planning Center */}
          <div className="bg-slate-950 p-5 rounded-xl border border-pink-500/20 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-pink-500 inline fill-pink-500 animate-pulse" />
                  Dating & Legacy Builder
                </h4>
                <p className="text-[10px] text-slate-400">Hire dating agencies or apply for high-fertility medical clinics to grow your dynasty.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleFindDate}
                disabled={cash < 100}
                className="bg-slate-900 hover:bg-slate-800 border border-pink-500/10 hover:border-pink-500/30 text-xs font-extrabold py-3 px-4 rounded-xl text-white flex items-center justify-between cursor-pointer transition-all active:scale-95 group disabled:opacity-40 animate-pulse-subtle"
              >
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  💖 Pay Matchmaker
                </span>
                <span className="text-pink-400 group-hover:text-pink-300 font-mono font-bold">$100</span>
              </button>

              <button
                onClick={handleAdoptChild}
                disabled={cash < 1500}
                className="bg-slate-900 hover:bg-slate-800 border border-indigo-500/10 hover:border-indigo-500/30 text-xs font-extrabold py-3 px-4 rounded-xl text-white flex items-center justify-between cursor-pointer transition-all active:scale-95 group disabled:opacity-40 animate-pulse-subtle"
              >
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  👶 Adopt a Child
                </span>
                <span className="text-indigo-400 group-hover:text-indigo-300 font-mono font-bold">$1,500</span>
              </button>
            </div>

            {/* Render Matching Profiles if we clicked matchmaker */}
            {matchProfiles.length > 0 && (
              <div className="pt-2 border-t border-slate-900/60 space-y-3">
                <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">— Matchmaker Recommendations —</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {matchProfiles.map((p) => (
                    <div key={p.id} className="bg-[#0b0f19] p-3 rounded-xl border border-pink-500/10 flex flex-col justify-between gap-3 text-left hover:border-pink-500/30 transition-all">
                      <div>
                        <div className="font-extrabold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Age {p.age} • {p.occupation}</div>
                        <div className="text-[9px] text-indigo-400 font-bold mt-1 uppercase tracking-wider">Trait: {p.personality}</div>
                      </div>
                      <button
                        onClick={() => handleAskOut(p)}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[10px] py-1.5 rounded-lg w-full transition-all cursor-pointer uppercase tracking-wider active:scale-95"
                      >
                        Ask Out
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {npcs.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-indigo-500/10">
              <p className="text-sm text-slate-400">You are entirely alone in this simulation. Go age up to meet some folks!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {npcs.map((npc) => (
                <div
                  key={npc.id}
                  id={`npc-${npc.id}`}
                  className="bg-[#0F172A] border border-indigo-500/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/30 transition-all"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm uppercase tracking-tight">{npc.name}</span>
                      <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase border border-slate-800">
                        {npc.relationType} (Age {npc.age})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Profession:</strong> {npc.occupation} | <strong>Trait:</strong> {npc.personality}
                    </p>

                    {/* Relation Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Relationship:</span>
                      <div className="w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all ${
                            npc.relationValue > 70 ? "bg-emerald-500" : npc.relationValue > 35 ? "bg-indigo-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${npc.relationValue}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">{npc.relationValue}/100</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                    <button
                      onClick={() => handleSpendTime(npc)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Speech className="w-3.5 h-3.5 text-pink-400" />
                      Spend Time
                    </button>
                    <button
                      onClick={() => handleGiveGift(npc)}
                      disabled={cash < 50}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Gift ($50)
                    </button>
                    <button
                      onClick={() => handleInsult(npc)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      Insult
                    </button>

                    {npc.relationType === "Partner" && (
                      <button
                        onClick={() => handlePropose(npc)}
                        disabled={cash < 1500}
                        className="bg-pink-950 hover:bg-pink-900 border border-pink-500/30 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        💍 Propose ($1.5k)
                      </button>
                    )}
                    {npc.relationType === "Spouse" && (
                      <button
                        onClick={() => handleHaveBaby(npc)}
                        disabled={cash < 1000}
                        className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        👶 Baby ($1k)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Adoptions */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Available for Adoption
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {petOptions.map((opt) => (
                <div
                  key={opt.species}
                  className="bg-[#0F172A] border border-indigo-500/10 p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-indigo-500/30 transition-all relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-sm uppercase tracking-tight">{opt.name}</span>
                      <span className="text-[9px] bg-slate-900 text-pink-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-slate-800">
                        {opt.species}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    <span className="text-[10px] text-slate-500 block font-mono">Trait: {opt.personality}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">ADOPTION FEE</span>
                      <span className="text-emerald-400 font-extrabold text-base flex items-center gap-0.5 font-mono">
                        <DollarSign className="w-4 h-4" />
                        {opt.cost}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdopt(opt)}
                      disabled={cash < opt.cost}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Adopt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Pets */}
          <div className="space-y-4 border-t border-indigo-500/10 pt-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <PawPrint className="w-4 h-4 text-pink-400" />
              My Household Pets ({pets.length})
            </h4>

            {pets.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-950/40 p-4 rounded-xl text-center border border-indigo-500/10">
                You do not have any fuzzy animals or stationary stones in your home.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-[#0F172A] border border-indigo-500/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm uppercase tracking-tight">{pet.name}</span>
                        <span className="text-[9px] bg-slate-900 text-pink-400 px-2 py-0.5 rounded-full font-bold uppercase border border-slate-800">
                          {pet.species} (Age {pet.age})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Personality:</strong> {pet.personality}
                      </p>

                      <div className="flex gap-4 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Health:</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{pet.health}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Training:</span>
                          <span className="text-xs font-mono font-bold text-indigo-400">{pet.training}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                      <button
                        onClick={() => handlePetAction(pet, "feed")}
                        disabled={cash < 15}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Feed ($15)
                      </button>
                      <button
                        onClick={() => handlePetAction(pet, "train")}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        Train
                      </button>
                      <button
                        onClick={() => handlePetAction(pet, "pet")}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        Cuddle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

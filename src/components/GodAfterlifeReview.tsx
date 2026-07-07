/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Skull, Users, Heart, Shield, RefreshCw, BookOpen, Globe,
  ArrowRight, Landmark, Award, AlertTriangle, Eye, Volume2, VolumeX, Cloud
} from "lucide-react";
import { GameState, NPC } from "../types";

interface GodAfterlifeReviewProps {
  state: GameState;
  onBeginAnotherLife: () => void;
  onViewLegacy: () => void;
  onContinueAsChild: (child: NPC) => void;
}

export const GodAfterlifeReview: React.FC<GodAfterlifeReviewProps> = ({
  state,
  onBeginAnotherLife,
  onViewLegacy,
  onContinueAsChild
}) => {
  const [dialogueText, setDialogueText] = useState("");
  const [showStats, setShowStats] = useState(false);

  // Filter living children
  const livingChildren = state.npcs.filter(
    (n) => n.isAlive && (n.relationType === "Child" || n.relationType === "Son" || n.relationType === "Daughter")
  );

  // Calculate dynamic Soul Legacy Score
  const legacyScore = Math.round(
    (state.netWorth / 1000) + 
    state.age * 8 + 
    (state.fameFollowers / 100) + 
    (state.pets.length * 25) + 
    (state.crimeRecordCount * -15) +
    (state.stats.happiness * 3)
  );

  // Generate God's sarcastic commentary
  const getGodCommentary = () => {
    if (state.age <= 3) {
      return "Ah, welcome back. That was... incredibly brief. Did you try licking a battery already? I barely had time to clean your cloud chamber. Let's try to last longer than a toddler next time.";
    }
    if (state.crimeRecordCount >= 4) {
      return "Back so soon? I watched those police chases on the celestial monitor. You really thought robbing banks and evading taxes would end well? Creative, but highly illegal. HR is deeply concerned.";
    }
    if (state.netWorth >= 1000000) {
      return "Look at you, a certified multi-millionaire! Sadly, we don't accept turnip stock certificates, gold-plated unicycles, or designer lofts up here. But I must say... not bad at all.";
    }
    if (state.netWorth <= 100 && state.age >= 45) {
      return "You died with practically empty pockets after a full lifetime. On the bright side, you didn't commit tax fraud... mostly. But I honestly expected a tiny bit more effort in the wealth department.";
    }
    if (state.stats.happiness >= 85) {
      return "Well, aren't you a rare sight? You were surprisingly wholesome, decent and happy. The Celestial Department of Decency sends its warmest regards. Try not to let it go to your head.";
    }
    if (state.stats.sanity <= 20) {
      return "So... you spent your final years speaking to park pigeons and eating raw turnip peelings. Sanity levels reached absolute zero. I see worse, but that was certainly an interesting aesthetic.";
    }

    // Default witty replies
    const defaultCommentaries = [
      "So... that could have gone better. I've seen worse, though. Actually, I've definitely seen worse.",
      "A highly creative sequence of questionable life decisions. I am almost impressed by the chaos.",
      "I was betting you would make it past 80. Alas, the turnip futures market or random chance got the best of you.",
      "Welcome back to the cloud layer. Grab some tea. Let's review the spreadsheet of your existence."
    ];
    
    // Pick based on name hash to keep it stable
    const idx = state.name.charCodeAt(0) % defaultCommentaries.length;
    return defaultCommentaries[idx];
  };

  useEffect(() => {
    const commentary = getGodCommentary();
    let i = 0;
    setDialogueText("");
    const timer = setInterval(() => {
      if (i < commentary.length) {
        setDialogueText((prev) => prev + commentary.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setShowStats(true);
      }
    }, 20); // Faster typewriter for longer reviews
    return () => clearInterval(timer);
  }, [state]);

  // Determine funniest Achievement & Regret based on state
  const getAchievementsAndRegrets = () => {
    let achievement = "Surviving in a completely unpredictable reality";
    let regret = "Failing to lick enough batteries during your earthly stay";

    if (state.netWorth >= 1500000) {
      achievement = "Acquiring a staggering multi-million dollar estate";
    } else if (state.currentCareer) {
      achievement = `Climbing the corporate ladder to ${state.currentCareer.title}`;
    } else if (state.crimeRecordCount >= 5) {
      achievement = "Developing a highly suspicious and legendary local rap sheet";
    } else if (state.fameFollowers >= 5000) {
      achievement = `Amassing a digital army of ${state.fameFollowers.toLocaleString()} followers`;
    } else if (state.pets.length >= 4) {
      achievement = `Assembling a small private army of ${state.pets.length} adopted pets`;
    }

    if (state.stats.sanity <= 25) {
      regret = "Completely losing grip of your mental stability and sanity";
    } else if (state.cash <= 50 && state.age >= 30) {
      regret = "Dying with practically empty pockets and zero turnip assets";
    } else if (state.properties.length === 0 && state.age >= 40) {
      regret = "Never successfully securing a deed to real estate";
    } else if (state.crimeRecordCount >= 1) {
      regret = "Getting caught by the spreadsheet police";
    }

    return { achievement, regret };
  };

  const { achievement, regret } = getAchievementsAndRegrets();

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-slate-950 text-slate-100 relative overflow-y-auto scrollbar p-5 animate-fade-in">
      
      {/* Background celestial visual accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/3 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[80px]"></div>
        {/* Soft floating clouds */}
        <Cloud className="absolute top-10 left-4 text-slate-800/30 w-16 h-16 animate-[bounce_5s_infinite]" />
        <Cloud className="absolute bottom-32 right-6 text-slate-800/20 w-24 h-24 animate-[bounce_6s_infinite_1s]" />
        {/* Glowing Gates Silhouette */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-15">
          <svg viewBox="0 0 100 100" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
            <path d="M 15 80 L 15 35 A 35 35 0 0 1 85 35 L 85 80" fill="none" stroke="#6366f1" strokeWidth="1" />
            <path d="M 50 80 L 50 20" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 z-10 w-full">
        {/* Header Title */}
        <div className="text-center space-y-1">
          <span className="bg-indigo-950 text-indigo-400 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
            🌌 THE CELESTIAL COURT
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mt-2">
            The Afterlife Audit
          </h2>
          <p className="text-[10px] text-slate-400">
            Evaluating the chaotic existence of <strong className="text-slate-200">{state.name}</strong>
          </p>
        </div>

        {/* God's Silhouette character bubble */}
        <div className="flex justify-center my-1.5 shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/30 to-amber-500/20 border border-indigo-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="absolute -top-2 w-10 h-2.5 border border-amber-300/50 rounded-full transform -rotate-6 shadow-[0_0_10px_rgba(252,211,77,0.3)] animate-bounce"></div>
            <div className="flex gap-2 opacity-60">
              <span className="text-xs font-black text-indigo-300 animate-pulse">●</span>
              <span className="text-xs font-black text-indigo-300 animate-pulse">●</span>
            </div>
          </div>
        </div>

        {/* God's speech box */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl min-h-20 flex items-center justify-center relative shadow-lg">
          <p className="text-xs font-semibold leading-relaxed text-slate-300 italic text-center">
            "{dialogueText || "..."}"
          </p>
        </div>

        {/* Celestial Audit Scroll list (reveals when typewriter finishes) */}
        {showStats && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">
                  SOUL ACCOUNTABILITY REPORT
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase">
                  Audit Completed
                </span>
              </div>

              {/* Grid of basic summary stats */}
              <div className="grid grid-cols-2 gap-3 text-xs leading-none">
                <div>
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Final Age</span>
                  <span className="text-white font-black text-xs block mt-1">{state.age} Years</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Cause of Death</span>
                  <span className="text-rose-400 font-bold text-xs block mt-1 truncate" title={state.deathReason}>{state.deathReason}</span>
                </div>
                <div className="border-t border-slate-800 pt-2">
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Net Worth Cash</span>
                  <span className="text-emerald-400 font-black text-xs block mt-1 font-mono">${state.netWorth.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-2">
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Legacy Score</span>
                  <span className="text-purple-400 font-black text-xs block mt-1 font-mono">{legacyScore.toLocaleString()} pts</span>
                </div>
              </div>

              {/* Narrative detailed audits */}
              <div className="border-t border-slate-800 pt-2 space-y-1.5 text-[10px] leading-snug">
                <div>
                  <strong className="text-slate-400">Biggest Achievement:</strong>{" "}
                  <span className="text-slate-200">{achievement}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Biggest Regret:</strong>{" "}
                  <span className="text-slate-300 italic">"{regret}"</span>
                </div>
                <div>
                  <strong className="text-slate-400">Relationships & Dynasty:</strong>{" "}
                  <span className="text-slate-200">
                    Adopted {state.pets.length} pets, committed {state.crimeRecordCount} crimes, and fathered/mothered {state.npcs.filter(n => n.relationType === "Child" || n.relationType === "Son" || n.relationType === "Daughter").length} children.
                  </span>
                </div>
              </div>
            </div>

            {/* Dynasty succession inline shortcut! */}
            {livingChildren.length > 0 && (
              <div className="bg-slate-900 border border-indigo-500/15 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">
                    Dynasty Succession ({livingChildren.length} Eligible Heirs)
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 leading-snug">
                  Assume the soul of an heir to bypass God's introduction and continue the family legacy with <strong className="text-emerald-400">85% of your estate (${Math.round(state.netWorth * 0.85).toLocaleString()})</strong>:
                </p>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {livingChildren.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => onContinueAsChild(child)}
                      className="bg-slate-950 border border-slate-800 hover:border-indigo-500/20 rounded-xl p-2 flex items-center justify-between text-left w-full group transition-all cursor-pointer"
                    >
                      <div>
                        <span className="font-extrabold text-white text-[10px] block leading-none">
                          {child.name}
                        </span>
                        <span className="text-[8px] text-slate-500 mt-0.5 block">
                          {child.relationType} • Age {child.age}
                        </span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-mono font-black flex items-center gap-0.5">
                        Inherit +${Math.round(state.netWorth * 0.85).toLocaleString()}
                        <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer controls */}
      {showStats && (
        <div className="space-y-2 pt-4 border-t border-slate-900">
          <p className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest">
            "Fancy another go?"
          </p>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={onBeginAnotherLife}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest border-t border-white/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              ✨ Begin Another Life
            </button>

            <button
              onClick={onViewLegacy}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              📖 View Legacy (Detailed Grave)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

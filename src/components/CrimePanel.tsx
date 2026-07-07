/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldAlert, Footprints, DollarSign, Bomb, Flame } from "lucide-react";

interface CrimePanelProps {
  cash: number;
  onAction: (logText: string, statChanges: any) => void;
}

export const CrimePanel: React.FC<CrimePanelProps> = ({ cash, onAction }) => {
  const crimes = [
    {
      id: "crime_supplies",
      name: "Steal Office Sharpies & Staplers",
      cost: 0,
      payout: 45,
      risk: "Almost None",
      successRate: 0.95,
      description: "Stuffing heavy-duty metal staplers and high-grade markers into your socks. The company is a conglomerate; they won't miss it.",
      successMsg: "You successfully bypassed the secretary and sold three boxes of premium markers to a local schoolchild for $45.",
      failMsg: "The stapler made a loud metallic CLANG as you sneezed. The receptionist stared. You dropped it and ran, losing -15 Reputation.",
      failStats: { reputation: -15, stress: 10 }
    },
    {
      id: "crime_stickers",
      name: "Print Counterfeit Retro Stickers",
      cost: 150,
      payout: 650,
      risk: "Low",
      successRate: 0.8,
      description: "Printing fuzzy pictures of anime frogs onto adhesive sheets and selling them as 'Vintage 1999 Collectibles' online.",
      successMsg: "They bought them instantly! You made $650 and were praised as a 'curator of culture'. Your morality drops slightly (-10).",
      failMsg: "A copyright bot flagged your account. Your store was shuttered, and you lost your $150 deposit. You feel highly stressed.",
      failStats: { morality: -10, stress: 15, sanity: -5 }
    },
    {
      id: "crime_disco",
      name: "Hack Local Water Cooler for Bribes",
      cost: 400,
      payout: 2200,
      risk: "Moderate",
      successRate: 0.65,
      description: "Coding a malicious script that forces the office water dispenser to charge 25 cents per splash unless they use your bypass code.",
      successMsg: "A massive success! You gathered $2,200 in quarters. Your colleagues paid without asking questions. You feel like a cyber mastermind (+10 Smarts).",
      failMsg: "The IT department traced your custom IP address back to your laptop which has your photo on the desktop. They fined you and wrote an angry Slack alert.",
      failStats: { reputation: -25, stress: 30, morality: -15, cash: -400 }
    },
    {
      id: "crime_turnip_nft",
      name: "Sell 'Imaginary Turnip' NFT to Billionaire",
      cost: 1200,
      payout: 15000,
      risk: "High",
      successRate: 0.4,
      description: "Drafting a description of an invisible root vegetable on a ledger and marketing it as 'The Ultimate Sovereign Store of Nutritional Value'.",
      successMsg: "Unbelievable! A tech magnate purchased it for $15,000 to show off on their social feed. You are a genius (+20 Smarts) but a saint you are not (-30 Morality).",
      failMsg: "They saw through your scheme, called the cyber-police, and dragging you into court. You had to hire a fast-talking lawyer who cleaned out $2,000 from your account.",
      failStats: { cash: -2000, reputation: -30, stress: 40, sanity: -20 }
    }
  ];

  const handleCommit = (crime: typeof crimes[0]) => {
    if (cash < crime.cost) {
      onAction("You don't have enough cash for raw materials!", {});
      return;
    }

    const roll = Math.random();
    const isSuccess = roll < crime.successRate;

    if (isSuccess) {
      const reward = crime.payout - crime.cost;
      onAction(
        crime.successMsg,
        {
          cash: reward,
          morality: -10,
          happiness: 15,
          reputation: 5
        }
      );
    } else {
      const penalty = {
        ...crime.failStats,
        cash: (crime.failStats.cash || 0) - crime.cost
      };
      onAction(crime.failMsg, penalty);
    }
  };

  return (
    <div id="crime-panel" className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-indigo-500/10 pb-4">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-indigo-300 underline decoration-pink-500 underline-offset-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Shady Activities & Grifts
          </h3>
          <p className="text-xs text-slate-300">
            Fast cash with highly volatile outcomes. Morality decreases upon committing crime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {crimes.map((crime) => (
          <div
            key={crime.id}
            id={crime.id}
            className="bg-[#0F172A] border border-indigo-500/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/30 transition-all"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-extrabold text-white text-sm uppercase tracking-tight">{crime.name}</h4>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  crime.risk === "Almost None" ? "bg-emerald-950/60 text-emerald-400 border-emerald-900/30" :
                  crime.risk === "Low" ? "bg-blue-950/60 text-blue-400 border-blue-900/30" :
                  crime.risk === "Moderate" ? "bg-amber-950/60 text-amber-400 border-amber-900/30" :
                  "bg-rose-950/60 text-rose-400 border-rose-900/30"
                }`}>
                  Risk: {crime.risk}
                </span>
                {crime.cost > 0 && (
                  <span className="text-[9px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase border border-slate-800">
                    Setup: ${crime.cost}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{crime.description}</p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 gap-4">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">POTENTIAL PAYOUT</span>
                <span className="text-emerald-400 font-extrabold text-base flex items-center gap-0.5 font-mono">
                  <DollarSign className="w-4 h-4" />
                  +{crime.payout}
                </span>
              </div>

              <button
                onClick={() => handleCommit(crime)}
                disabled={cash < crime.cost}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Bomb className="w-3.5 h-3.5" />
                Commit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

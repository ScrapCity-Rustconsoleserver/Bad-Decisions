/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MessageSquare, HeartHandshake, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { GameEvent, GameChoice } from "../types";

interface EventModalProps {
  event: GameEvent;
  onChoiceSelected: (choice: GameChoice) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoiceSelected }) => {
  const [selectedChoice, setSelectedChoice] = useState<GameChoice | null>(null);

  const handleSelect = (choice: GameChoice) => {
    setSelectedChoice(choice);
  };

  const handleClose = () => {
    if (selectedChoice) {
      onChoiceSelected(selectedChoice);
      setSelectedChoice(null);
    }
  };

  return (
    <div id="event-modal-backdrop" className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div id="event-modal-content" className="w-full max-w-xl bg-[#1E293B] border-2 border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl animate-scale-up relative pt-1.5">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500"></div>

        {/* Category Header */}
        <div className="bg-[#0F172A] px-6 py-4 border-b border-indigo-500/10 flex justify-between items-center">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
            event.category === "childhood" ? "bg-amber-950/60 text-amber-400 border border-amber-900/40" :
            event.category === "career" ? "bg-indigo-950/60 text-indigo-400 border border-indigo-900/40" :
            event.category === "crime" ? "bg-red-950/60 text-red-400 border border-red-900/40" :
            event.category === "crisis" ? "bg-purple-950/60 text-purple-400 border border-purple-900/40" :
            "bg-sky-950/60 text-sky-400 border border-sky-900/40"
          }`}>
            {event.category} Event
          </span>
          <span className="text-xs font-mono text-slate-500">RANDOM SCENARIO</span>
        </div>

        {/* Event Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-start gap-2.5 underline decoration-pink-500 underline-offset-4 mb-3">
              <MessageSquare className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
              {event.title}
            </h3>

            {/* Context Block */}
            {event.context && (
              <div id="event-context-box" className="bg-[#0F172A]/80 border-l-4 border-indigo-500 p-3.5 rounded-r-xl text-xs font-medium text-slate-300 leading-relaxed">
                <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">Context</span>
                {event.context}
              </div>
            )}

            {/* Situation Block */}
            {event.situation && (
              <div id="event-situation-box" className="bg-[#0F172A]/80 border-l-4 border-pink-500 p-3.5 rounded-r-xl text-xs font-medium text-slate-300 leading-relaxed">
                <span className="text-[9px] text-pink-400 font-extrabold uppercase tracking-widest block mb-1">Situation</span>
                {event.situation}
              </div>
            )}

            <p className="text-sm text-slate-200 leading-relaxed md:text-base pt-1">
              {event.description}
            </p>
          </div>

          {!selectedChoice ? (
            /* Choices List */
            <div className="space-y-2.5 pt-2">
              {event.choices.map((choice, idx) => (
                <button
                  key={idx}
                  id={`event-choice-${idx}`}
                  onClick={() => handleSelect(choice)}
                  className="w-full text-left bg-[#0F172A] hover:bg-indigo-600/10 border border-indigo-500/15 hover:border-indigo-500/50 p-4 rounded-xl text-xs sm:text-sm text-slate-200 hover:text-white font-bold transition-all flex justify-between items-center gap-4 cursor-pointer active:scale-[0.99]"
                >
                  <span>{choice.text}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            /* Consequence Reveal */
            <div className="bg-[#0F172A] border border-indigo-500/10 p-5 rounded-xl space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] text-pink-500 font-extrabold uppercase tracking-wider block">Consequence</span>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedChoice.consequenceText}</p>
              </div>

              {/* Stat Indicators */}
              <div className="border-t border-slate-800/85 pt-3 space-y-2">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase block tracking-wider">Stat Adjustments</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedChoice.statChanges).map(([statName, val]) => {
                    if (val === 0) return null;
                    const isPositive = (val as number) > 0;
                    const formattedVal = isPositive ? `+${val}` : val;

                    return (
                      <div
                        key={statName}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 uppercase ${
                          isPositive
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                            : "bg-red-950/40 text-red-400 border border-red-900/30"
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {statName === "cash" ? `Cash: ${formattedVal}` : `${statName}: ${formattedVal}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        {selectedChoice && (
          <div className="bg-[#0F172A] p-4 border-t border-indigo-500/10 flex justify-end">
            <button
              onClick={handleClose}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

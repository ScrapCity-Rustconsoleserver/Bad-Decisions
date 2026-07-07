/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Appearance, GameState } from "../types";

interface AvatarRendererProps {
  appearance: Appearance;
  age: number;
  state?: GameState;
}

// Deterministic hash to map strings (like character name) to numbers
const getHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Parse hex colors for gradients/mixing
const parseHex = (hex: string) => {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  if (clean.length !== 6) {
    return { r: 243, g: 211, b: 189 };
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return "#" + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
};

// Generates highlight or shadow colors dynamically
const getShadeColor = (hex: string, percent: number) => {
  const { r, g, b } = parseHex(hex);
  const factor = 1 + percent;
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return rgbToHex(clamp(r * factor), clamp(g * factor), clamp(b * factor));
};

// Blends skin color with other tones
const blendColors = (hexA: string, hexB: string, ratio: number) => {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const r = a.r + (b.r - a.r) * ratio;
  const g = a.g + (b.g - a.g) * ratio;
  const bVal = a.b + (b.b - a.b) * ratio;
  return rgbToHex(clamp(r), clamp(g), clamp(bVal));
};

// Blends skin color with a sickly desaturated pale shade based on health
const getModifiedSkinColor = (baseSkin: string, health: number, isDead: boolean) => {
  if (isDead) return "#8ba1b5"; // Cold corpse blue-grey
  const rgb = parseHex(baseSkin);
  if (health >= 65) return baseSkin;
  
  // Mix with a desaturated sickly tone (pale grey-greenish)
  const paleness = (65 - health) / 65; // 0 to 1
  const targetR = 205;
  const targetG = 210;
  const targetB = 190;
  
  const r = rgb.r + (targetR - rgb.r) * paleness * 0.5;
  const g = rgb.g + (targetG - rgb.g) * paleness * 0.5;
  const b = rgb.b + (targetB - rgb.b) * paleness * 0.5;
  return rgbToHex(r, g, b);
};

// Fades hair color gradually to silver-grey starting at age 42
const getModifiedHairColor = (baseHair: string, age: number) => {
  const greyStartAge = 42;
  const greyEndAge = 75;
  if (age < greyStartAge) return baseHair;
  
  const factor = Math.min(1, (age - greyStartAge) / (greyEndAge - greyStartAge));
  const hairRgb = parseHex(baseHair);
  
  const targetR = 215;
  const targetG = 219;
  const targetB = 224;
  
  const r = hairRgb.r + (targetR - hairRgb.r) * factor * 0.85;
  const g = hairRgb.g + (targetG - hairRgb.g) * factor * 0.85;
  const b = hairRgb.b + (targetB - hairRgb.b) * factor * 0.85;
  return rgbToHex(r, g, b);
};

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({ appearance, age, state }) => {
  const [fadeDead, setFadeDead] = useState(false);
  const isDead = state ? state.isDead : (appearance.facialExpression === "dead");

  useEffect(() => {
    if (isDead) {
      const timer = setTimeout(() => {
        setFadeDead(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setFadeDead(false);
    }
  }, [isDead]);

  // Extract variables with defaults
  const baseSkinColor = appearance.skinColor || "#FCE5CD";
  const baseHairColor = appearance.hairColor || "#E69138";
  const eyeColor = appearance.eyeColor || "#3d85c6";
  const hairStyle = appearance.hairStyle || "short";
  const clothing = appearance.clothing || "casual";
  const accessory = appearance.accessory || "none";
  const baseExpression = appearance.facialExpression || "neutral";

  // Access Stats safely
  const health = state?.stats?.health ?? 85;
  const stress = state?.stats?.stress ?? 20;
  const happiness = state?.stats?.happiness ?? 75;
  const fitness = state?.stats?.fitness ?? 50;
  const fame = state?.stats?.fame ?? 0;
  const morality = state?.stats?.morality ?? 50;
  const currentCareer = state?.currentCareer;

  // Resolve derived attributes
  const skinColor = getModifiedSkinColor(baseSkinColor, health, isDead);
  const hairColor = getModifiedHairColor(baseHairColor, age);

  // Dynamic skin shade variants for painting layers
  const skinShadow = getShadeColor(skinColor, -0.22);
  const skinDeepShadow = getShadeColor(skinColor, -0.38);
  const skinHighlight = getShadeColor(skinColor, 0.16);
  const blushColor = blendColors(skinColor, "#ef4444", 0.28);

  // Hair shade variants
  const hairShadow = getShadeColor(hairColor, -0.35);
  const hairHighlight = getShadeColor(hairColor, 0.3);

  // Eye shade variants
  const eyeShadow = getShadeColor(eyeColor, -0.4);
  const eyeHighlight = getShadeColor(eyeColor, 0.4);

  // Determine emotional expression based on physical attributes
  let facialExpression = baseExpression;
  if (isDead) {
    facialExpression = "dead";
  } else if (happiness > 80) {
    facialExpression = "happy";
  } else if (happiness < 25) {
    facialExpression = "sad";
  } else if (stress > 70) {
    facialExpression = "crazed";
  }

  // Continuous aging parameters
  const isBaby = age <= 2;
  const isToddler = age >= 3 && age <= 5;
  const isChild = age >= 6 && age <= 12;
  const isElderly = age >= 66;

  // Dynamic Eye Size (Baby eyes are huge and expressive, adult eyes are normal)
  const eyeSizeMultiplier = isBaby ? 1.6 : isToddler ? 1.35 : isChild ? 1.15 : 1.0;
  const eyeY = isBaby ? 47 : isToddler ? 45 : isChild ? 44 : 42.5;

  // Dynamic Jaw Shape based on age & fitness
  // Low fitness = softer jaw / double chin, High fitness = sculpted cheekbones
  const cheekSwell = Math.max(0, Math.min(7, (100 - fitness) / 13));
  const doubleChin = Math.max(0, Math.min(6, (100 - fitness) / 16));
  const chinY = 62 + doubleChin;

  // Wrinkle opacities based on age
  const foreHeadWrinkleOpacity = Math.max(0, Math.min(0.7, (age - 34) / 48));
  const laughLineOpacity = Math.max(0, Math.min(0.75, (age - 40) / 42));
  const eyeBagOpacity = health < 45 ? 0.65 : Math.max(0, Math.min(0.6, (age - 44) / 46));

  // Determine uniform or clothing style
  let activeClothing = clothing;
  let hasHardHat = false;
  let hasChefHat = false;
  let hasStethoscope = false;

  if (age >= 18 && currentCareer) {
    const title = currentCareer.title.toLowerCase();
    
    if (title.includes("doctor") || title.includes("surgeon") || title.includes("nurse") || title.includes("medic")) {
      activeClothing = "doctor";
      hasStethoscope = true;
    } else if (title.includes("police") || title.includes("officer") || title.includes("detective") || title.includes("sheriff")) {
      activeClothing = "police";
    } else if (title.includes("chef") || title.includes("cook") || title.includes("baker")) {
      activeClothing = "chef";
      hasChefHat = true;
    } else if (title.includes("ceo") || title.includes("executive") || title.includes("manager") || title.includes("broker") || title.includes("lawyer")) {
      activeClothing = "suit";
    } else if (title.includes("construction") || title.includes("miner") || title.includes("builder") || title.includes("engineer")) {
      activeClothing = "construction";
      hasHardHat = true;
    } else if (morality < 25 && state?.crimeRecordCount && state.crimeRecordCount > 1) {
      activeClothing = "prison";
    }
  }

  // Famous / Celebrity overrides
  const isFamous = fame > 50;

  // Scan history logs for deterministic scars/injuries
  const logs = state?.history || [];
  const hasScar = logs.some(l => l.text.toLowerCase().includes("scar") || l.text.toLowerCase().includes("attacked") || l.text.toLowerCase().includes("fight"));
  const hasBlackEye = health < 35 && logs.some(l => l.text.toLowerCase().includes("fight") || l.text.toLowerCase().includes("punch") || l.text.toLowerCase().includes("beat"));
  const hasBandage = health < 25;
  const hasMissingTooth = age >= 6 && (health < 15 || logs.some(l => l.text.toLowerCase().includes("tooth") || l.text.toLowerCase().includes("teeth") || l.text.toLowerCase().includes("accident")));

  // Facial Hair determination for adults (deterministic hash based on character name)
  const charHash = getHash(state?.name ?? "Reginald Butterworth");
  const facialHairType = (age >= 17 && charHash % 4 !== 0) 
    ? (charHash % 3 === 0 ? "beard" : charHash % 3 === 1 ? "stubble" : "mustache")
    : "none";

  const postureSlump = (health < 35 || fitness < 20) ? 2.5 : 0;
  const isTired = health < 30 || stress > 75;
  const bodyY = isTired ? 2.0 : 0;

  // Define realistic painted color codes for clothing
  const clothesFills = {
    casual: { main: "#3b82f6", shadow: "#1d4ed8", light: "#60a5fa" }, // Sporty Blue
    suit: { main: "#1e293b", shadow: "#0f172a", light: "#334155" }, // Slate Suit
    rags: { main: "#78350f", shadow: "#451a03", light: "#92400e" }, // Tattered Burlap
    hipster: { main: "#db2777", shadow: "#9d174d", light: "#f472b6" }, // Retro Magenta
    pajamas: { main: "#a78bfa", shadow: "#6d28d9", light: "#c084fc" }, // Cozy Lavender
    doctor: { main: "#0ea5e9", shadow: "#0369a1", light: "#38bdf8" }, // Surgical Scrubs
    police: { main: "#172554", shadow: "#030712", light: "#1e3a8a" }, // Navy Tactical Blue
    chef: { main: "#f1f5f9", shadow: "#cbd5e1", light: "#ffffff" }, // Pristine Whites
    construction: { main: "#ea580c", shadow: "#9a3412", light: "#f97316" }, // High-Vis Orange
    prison: { main: "#f97316", shadow: "#c2410c", light: "#fb923c" } // Correctional Orange
  };

  const currentOutfit = clothesFills[activeClothing as keyof typeof clothesFills] || clothesFills.casual;

  // Render Cemetery Gravestone Scene if dead
  if (isDead && fadeDead) {
    const birthYear = (state?.calendarYear ?? 2026) - age;
    const deathYear = state?.calendarYear ?? (2026 + age);
    const season = state?.season ?? "Spring";

    // Select dynamic epitaph based on legacy achievements
    let epitaph = "Beloved spreadsheet survivor.";
    if (state && state.netWorth >= 1000000) {
      epitaph = "Built an empire from nothing.";
    } else if (fame > 50) {
      epitaph = "A shining star that burned too bright.";
    } else if (morality < 30 && state && state.crimeRecordCount > 0) {
      epitaph = "Chaos was their middle name.";
    } else if (state && state.pets.length >= 4) {
      epitaph = "Loved by every animal in town.";
    } else if (age >= 95) {
      epitaph = "Witnessed a century of ridiculousness.";
    } else if (health < 20 && happiness > 75) {
      epitaph = "Left with a giant smile.";
    }

    const hasFamily = state?.npcs.some(n => n.isAlive && n.relationValue > 40 && (n.relationType === "Partner" || n.relationType === "Child" || n.relationType === "Parent" || n.relationType === "Friend"));

    return (
      <div id="gravestone-container" className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden transition-all duration-1000 animate-fade-in">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={season === "Winter" ? "#f1f5f9" : season === "Autumn" ? "#7c2d12" : "#14532d"} />
              <stop offset="100%" stopColor={season === "Winter" ? "#94a3b8" : season === "Autumn" ? "#451a03" : "#064e3b"} />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#skyGrad)" />

          {/* Glowing stars */}
          <g opacity="0.65">
            <circle cx="15" cy="15" r="0.4" fill="#ffffff" />
            <circle cx="28" cy="8" r="0.3" fill="#ffffff" />
            <circle cx="45" cy="12" r="0.5" fill="#ffffff" />
            <circle cx="65" cy="6" r="0.3" fill="#ffffff" />
            <circle cx="82" cy="16" r="0.4" fill="#ffffff" />
            <circle cx="92" cy="10" r="0.3" fill="#ffffff" />
            <circle cx="50" cy="22" r="0.4" fill="#ffffff" />
          </g>

          {/* Moon with 3D shadow rim */}
          <circle cx="80" cy="25" r="7" fill="#fef08a" opacity="0.1" />
          <circle cx="80" cy="25" r="5" fill="#fef08a" opacity="0.8" />
          <circle cx="77" cy="23" r="4.5" fill="#0f172a" />

          {/* Grassy ground silhoutte */}
          <path d="M 0 75 Q 12 70, 25 74 T 50 72 T 75 75 T 100 74 L 100 100 L 0 100 Z" fill="url(#grassGrad)" />

          {/* Beautifully Shaded Beveled Gravestone */}
          <g transform="translate(0, 4)">
            {/* Back ambient occlusion shadow */}
            <path d="M 28 80 L 28 44 A 22 22 0 0 1 72 44 L 72 80 Z" fill="#020617" opacity="0.45" transform="translate(1.5, 1.5)" />
            
            {/* Front Gravestone Tablet */}
            <path d="M 28 80 L 28 44 A 22 22 0 0 1 72 44 L 72 80 Z" fill="url(#stoneGrad)" stroke="#94a3b8" strokeWidth="0.8" />
            
            {/* Bevel inset line */}
            <path d="M 31 77 L 31 46 A 19 19 0 0 1 69 46 L 69 77 Z" fill="none" stroke="#1e293b" strokeWidth="0.6" opacity="0.4" />

            {/* Ivy branch wrapping the gravestone gracefully */}
            <g opacity="0.85">
              {/* Ivy Vine */}
              <path d="M 28 65 Q 31 60, 29 55 T 33 46" fill="none" stroke="#166534" strokeWidth="0.8" strokeLinecap="round" />
              {/* Ivy Leaves */}
              <path d="M 29.5 61 Q 31 60, 31.5 62 Z" fill="#15803d" />
              <path d="M 28.5 56 Q 26 55, 27 57 Z" fill="#16a34a" />
              <path d="M 31 51 Q 33 49, 34 52 Z" fill="#15803d" />
            </g>

            {/* RIP cross emblem */}
            <g stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" fill="none">
              <line x1="50" y1="36" x2="50" y2="44" />
              <line x1="46" y1="38.5" x2="54" y2="38.5" />
            </g>

            {/* Gravestone text */}
            <g fill="#0f172a" textAnchor="middle" opacity="0.9">
              <text x="50" y="49" fontSize="2.8" fontWeight="bold" letterSpacing="0.4" fill="#334155">IN MEMORY OF</text>
              
              <text x="50" y="55" fontSize="4.6" fontWeight="900" fill="#0f172a" letterSpacing="-0.1">
                {(state?.name ?? "Buster McWacky").toUpperCase()}
              </text>
              
              <text x="50" y="60.5" fontSize="3.1" fontWeight="extrabold" fill="#1e293b" fontFamily="monospace">
                {birthYear} — {deathYear}
              </text>

              <text x="50" y="64" fontSize="2.6" fontWeight="bold" fill="#334155">
                AGE {age}
              </text>

              <text x="50" y="71" fontSize="2.2" fontStyle="italic" fill="#1e293b" fontWeight="semibold">
                "{epitaph}"
              </text>
            </g>
          </g>

          {/* Flower bunch at gravestone base */}
          {hasFamily && (
            <g transform="translate(32, 78)">
              <path d="M 6 4 Q 8 1, 9 -2 M 10 4 Q 12 0, 14 -1 M 24 4 Q 22 1, 21 -2" stroke="#166534" strokeWidth="0.6" fill="none" />
              <circle cx="9" cy="-2" r="1.8" fill="#ef4444" />
              <circle cx="10" cy="-2.5" r="0.6" fill="#fde047" />
              
              <circle cx="14" cy="-1" r="1.5" fill="#ec4899" />
              <circle cx="21" cy="-2" r="1.8" fill="#3b82f6" />
              <circle cx="21" cy="-2" r="0.6" fill="#fde047" />

              <circle cx="17" cy="1" r="1.4" fill="#ffffff" />
              <circle cx="17" cy="1" r="0.5" fill="#fde047" />
            </g>
          )}

          {/* Seasons ambiance details */}
          {season === "Spring" && (
            <g opacity="0.75">
              <circle cx="10" cy="40" r="0.8" fill="#fbcfe8" />
              <circle cx="25" cy="30" r="0.6" fill="#fbcfe8" />
              <circle cx="70" cy="45" r="0.7" fill="#fbcfe8" />
              <circle cx="85" cy="55" r="0.5" fill="#fbcfe8" />
            </g>
          )}

          {season === "Summer" && (
            <g opacity="0.65">
              <circle cx="15" cy="65" r="0.5" fill="#fef08a" />
              <circle cx="35" cy="55" r="0.4" fill="#fef08a" />
              <circle cx="75" cy="62" r="0.5" fill="#fef08a" />
              <circle cx="88" cy="70" r="0.4" fill="#fef08a" />
            </g>
          )}

          {season === "Autumn" && (
            <g opacity="0.85">
              <path d="M 12 30 Q 14 32, 11 34 Z" fill="#ea580c" />
              <path d="M 28 45 Q 30 48, 27 50 Z" fill="#b45309" />
              <path d="M 68 35 Q 71 37, 69 40 Z" fill="#ca8a04" />
              <path d="M 82 50 Q 84 53, 81 55 Z" fill="#7c2d12" />
            </g>
          )}

          {season === "Winter" && (
            <g>
              <circle cx="12" cy="15" r="0.6" fill="#ffffff" opacity="0.8" />
              <circle cx="24" cy="35" r="0.5" fill="#ffffff" opacity="0.7" />
              <circle cx="45" cy="25" r="0.7" fill="#ffffff" opacity="0.85" />
              <circle cx="68" cy="45" r="0.5" fill="#ffffff" opacity="0.75" />
              <circle cx="88" cy="30" r="0.6" fill="#ffffff" opacity="0.8" />
              {/* Snowcap on top of gravestone */}
              <path d="M 33 44 Q 50 39, 67 44 Q 50 42, 33 44 Z" fill="#f8fafc" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // STANDARD HIGH-QUALITY PORTRAIT SYSTEM (Living avatar layered assets)
  return (
    <div id="avatar-container" className="relative w-full h-full bg-slate-950 rounded-full overflow-hidden border-2 border-slate-700/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-300">
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Dynamic Skin Color Gradients */}
          <linearGradient id="skinGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={skinHighlight} />
            <stop offset="45%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>
          
          <linearGradient id="skinNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinShadow} />
            <stop offset="100%" stopColor={skinDeepShadow} />
          </linearGradient>

          {/* Dynamic Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairHighlight} />
            <stop offset="50%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairShadow} />
          </linearGradient>

          {/* Dynamic Iris Depth Gradient */}
          <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor={eyeHighlight} />
            <stop offset="40%" stopColor={eyeColor} />
            <stop offset="100%" stopColor={eyeShadow} />
          </radialGradient>

          {/* Clothing Fills */}
          <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentOutfit.light} />
            <stop offset="60%" stopColor={currentOutfit.main} />
            <stop offset="100%" stopColor={currentOutfit.shadow} />
          </linearGradient>

          {/* Premium Ambient Background Glow */}
          <radialGradient id="bgPortraitGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={isFamous ? "#fbbf24" : "#6366f1"} stopOpacity={isFamous ? 0.38 : 0.24} />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Celebrity Gold Aura */}
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Pro-Illustrated Inner Shadow Filter */}
          <filter id="layerShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.38" />
          </filter>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background aura */}
        <circle cx="50" cy="50" r="49" fill="url(#bgPortraitGlow)" />

        {/* Celebrity Golden Sparks Overlay */}
        {isFamous && (
          <g opacity="0.85" fill="url(#goldShine)">
            <path d="M 15 28 L 16.5 29.5 L 15 31 L 13.5 29.5 Z" />
            <path d="M 85 22 L 86 23 L 85 24 L 84 23.5 Z" />
            <path d="M 88 44 L 89.2 45.2 L 88 46.4 L 86.8 45.2 Z" />
            <circle cx="17" cy="20" r="0.7" fill="#ffffff" />
            <circle cx="83" cy="48" r="0.6" fill="#ffffff" />
          </g>
        )}

        {/* BACK HAIR LAYER (Behind Neck & Shoulders) */}
        {hairStyle !== "bald" && (
          <g fill="url(#hairGrad)" filter="url(#layerShadow)">
            {hairStyle === "long" && (
              <path d="M 27 42 Q 16 60, 20 78 Q 26 86, 34 84 Q 30 64, 28 42 M 73 42 Q 84 60, 80 78 Q 74 86, 66 84 Q 70 64, 72 42" />
            )}
            {hairStyle === "curly" && (
              <path d="M 29 42 Q 12 55, 18 76 C 22 79, 28 78, 29 65 M 71 42 Q 88 55, 82 76 C 78 79, 72 78, 71 65" opacity="0.88" />
            )}
            {hairStyle === "afro" && (
              <path d="M 50 42 C 20 42, 18 15, 50 15 C 82 15, 80 42, 50 42 Z" opacity="0.3" fill="#000" />
            )}
          </g>
        )}

        {/* SHADED NECK */}
        <g transform={`translate(0, ${postureSlump})`}>
          {/* Base neck trunk */}
          <path d="M 43.5 56 L 43.5 74 C 43.5 74, 50 78, 56.5 74 L 56.5 56 Z" fill="url(#skinNeckGrad)" />
          {/* Sternal collarbone muscles detailing */}
          <path d="M 46 60 L 48 73 M 54 60 L 52 73" stroke={skinDeepShadow} strokeWidth="0.85" strokeLinecap="round" opacity="0.3" />
          {/* Throat/Adam's apple shadow structure */}
          <path d="M 50 61 L 48.5 64.5 L 51.5 64.5 Z" fill={skinDeepShadow} opacity="0.22" />
        </g>

        {/* PROFESSIONAL/CASUAL CLOTHING LAYER */}
        <g transform={`translate(0, ${bodyY})`} filter="url(#layerShadow)">
          {/* Volumetric shoulders base with painted gradients */}
          <path d="M 14 92 C 14 73, 86 73, 86 92 Z" fill="url(#clothGrad)" />

          {/* Render collar details, seams, folds */}
          <path d="M 14 92 C 22 75, 50 82, 86 92" stroke={currentOutfit.light} strokeWidth="0.85" fill="none" opacity="0.25" />

          {/* Dynamic specific outfits styles */}
          {activeClothing === "doctor" && (
            <g>
              {/* Teal V-neck scrub top */}
              <path d="M 41.5 74 L 50 87 L 58.5 74 Z" fill="#0ea5e9" />
              <path d="M 41.5 74 L 50 87" stroke="#0284c7" strokeWidth="1.1" />
              <path d="M 58.5 74 L 50 87" stroke="#0284c7" strokeWidth="1.1" />
              {/* High-quality doctors lab coat lapels */}
              <path d="M 30 73 L 44 94 L 28 94 Z" fill="#ffffff" />
              <path d="M 70 73 L 56 94 L 72 94 Z" fill="#ffffff" />
              <path d="M 30 73 L 44 94" stroke="#cbd5e1" strokeWidth="1.1" />
              <path d="M 70 73 L 56 94" stroke="#cbd5e1" strokeWidth="1.1" />
              {/* Pocket detailing */}
              <path d="M 25 86 L 31 86 L 31 93 L 25 93 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <line x1="25" y1="88" x2="31" y2="88" stroke="#cbd5e1" strokeWidth="0.8" />
            </g>
          )}

          {activeClothing === "police" && (
            <g>
              {/* Dark navy police collar fold */}
              <path d="M 34 76 L 44 76 L 41 85 Z" fill="#1e3a8a" />
              <path d="M 66 76 L 56 76 L 59 85 Z" fill="#1e3a8a" />
              {/* Golden metallic law star badge */}
              <g transform="translate(29, 82) scale(0.9)">
                <path d="M 5 0 L 6.5 3.5 L 10 3.5 L 7 5.5 L 8.5 9 L 5 7 L 1.5 9 L 3 5.5 L 0 3.5 L 3.5 3.5 Z" fill="url(#goldShine)" filter="url(#layerShadow)" />
                <circle cx="5" cy="4.5" r="1.3" fill="#ffffff" opacity="0.4" />
              </g>
              {/* Epaulets with brass bars */}
              <rect x="18" y="77" width="10" height="3" fill="#111827" rx="0.5" />
              <rect x="25" y="77.5" width="2" height="2" fill="#fbbf24" />
              <rect x="72" y="77" width="10" height="3" fill="#111827" rx="0.5" />
              <rect x="73" y="77.5" width="2" height="2" fill="#fbbf24" />
              {/* Center button line */}
              <line x1="50" y1="76" x2="50" y2="94" stroke="#020617" strokeWidth="1.1" />
              <circle cx="50" cy="81" r="1.1" fill="#fbbf24" />
              <circle cx="50" cy="87" r="1.1" fill="#fbbf24" />
            </g>
          )}

          {activeClothing === "chef" && (
            <g>
              {/* Elegant folded double breast chef jacket front */}
              <path d="M 43 73 L 50 82 L 57 73 Z" fill="#cbd5e1" opacity="0.65" />
              <line x1="43" y1="74" x2="55" y2="94" stroke="#94a3b8" strokeWidth="0.95" />
              {/* Glossy double breasted button dots */}
              <circle cx="44" cy="80" r="1.3" fill="#1e293b" />
              <circle cx="44" cy="86" r="1.3" fill="#1e293b" />
              <circle cx="56" cy="80" r="1.3" fill="#1e293b" />
              <circle cx="56" cy="86" r="1.3" fill="#1e293b" />
            </g>
          )}

          {activeClothing === "construction" && (
            <g>
              {/* High visibility neon yellow reflective safety vest suspender straps */}
              <path d="M 32 73 L 38 73 L 42 94 L 35 94 Z" fill="#fbbf24" />
              <path d="M 68 73 L 62 73 L 58 94 L 65 94 Z" fill="#fbbf24" />
              {/* Silver reflective center striping */}
              <path d="M 34 76 L 37 76 L 40 94 L 37 94 Z" fill="#cbd5e1" />
              <path d="M 66 76 L 63 76 L 60 94 L 63 94 Z" fill="#cbd5e1" />
              {/* Horizontal safety waist band */}
              <rect x="18" y="86" width="64" height="4.5" fill="#fbbf24" />
              <rect x="18" y="87" width="64" height="2" fill="#cbd5e1" />
            </g>
          )}

          {activeClothing === "prison" && (
            <g>
              {/* Correctional details */}
              <path d="M 43 73 C 45 79, 55 79, 57 73" fill="none" stroke="#7c2d12" strokeWidth="1.2" />
              <text x="32" y="85" fontSize="2.8" fill="#ffffff" fontWeight="bold" opacity="0.9" fontFamily="monospace" letterSpacing="0.4">STATE-820</text>
              {/* Prison neck zipper */}
              <line x1="50" y1="76" x2="50" y2="94" stroke="#334155" strokeWidth="1" />
              <path d="M 49 76 L 51 76 L 50 78 Z" fill="#94a3b8" />
            </g>
          )}

          {activeClothing === "suit" && (
            <g>
              {/* Clean corporate white collared shirt */}
              <path d="M 42 73 L 50 88 L 58 73 Z" fill="#f8fafc" />
              <path d="M 42 73 L 47 80 L 41 80 Z" fill="#e2e8f0" />
              <path d="M 58 73 L 53 80 L 59 80 Z" fill="#e2e8f0" />
              {/* High-quality Red Silk Tie with dimensional shade */}
              <path d="M 47.5 79.5 L 52.5 79.5 L 54 91.5 L 50 94 L 46 91.5 Z" fill="#dc2626" />
              <path d="M 48 79.5 L 50 83.5 L 52 79.5 Z" fill="#991b1b" />
              {/* Golden tie clip */}
              <line x1="47.5" y1="84" x2="52.5" y2="84" stroke="url(#goldShine)" strokeWidth="0.8" />
              {/* Executive pocket square */}
              <path d="M 24 84 L 32 84 L 32 91 L 24 91 Z" fill="#1e293b" />
              <path d="M 26 84 L 28 80 L 30 84" fill="#ffffff" />
            </g>
          )}

          {activeClothing === "rags" && (
            <g>
              {/* Slits, holes and custom stitched patches */}
              <path d="M 25 80 L 31 82" stroke="#451a03" strokeWidth="1.1" />
              <path d="M 28 78 L 28 84" stroke="#451a03" strokeWidth="1.1" />
              {/* Patch 1 */}
              <path d="M 64 80 L 72 82 L 70 88 L 62 86 Z" fill="#451a03" opacity="0.6" />
              <path d="M 62 80 L 65 79 M 66 81 L 68 79 M 71 83 L 72 85" stroke="#78350f" strokeWidth="0.8" />
            </g>
          )}

          {activeClothing === "hipster" && (
            <g>
              {/* Retro graphic t-shirt peeking through */}
              <path d="M 43 73 C 45 81, 55 81, 57 73 Z" fill="#1e293b" />
              {/* Golden retro graphic circle */}
              <circle cx="50" cy="78" r="1.8" fill="#fbbf24" opacity="0.8" />
              {/* Open casual jacket collar flaps */}
              <path d="M 33 73 L 42 90 L 30 94 Z" fill="#9d174d" />
              <path d="M 67 73 L 58 90 L 70 94 Z" fill="#9d174d" />
            </g>
          )}

          {activeClothing === "pajamas" && (
            <g>
              {/* Cute white soft piping detail */}
              <path d="M 33 76 L 43 85 M 67 76 L 57 85" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              {/* Sleepy Moon embroidery on the chest */}
              <circle cx="28" cy="84" r="1.8" fill="#ffffff" opacity="0.5" />
              <circle cx="26.8" cy="84" r="1.8" fill="#a78bfa" />
            </g>
          )}

          {/* Golden Famous Chain */}
          {isFamous && (
            <path d="M 35 73.5 C 35 84, 65 84, 65 73.5" fill="none" stroke="url(#goldShine)" strokeWidth="1.8" strokeDasharray="1.2,1.2" filter="url(#layerShadow)" />
          )}
        </g>

        {/* Doctor Stethoscope draping */}
        {hasStethoscope && (
          <g filter="url(#layerShadow)">
            {/* Soft dark grey flexible tubing */}
            <path d="M 38 65 C 38 81, 62 81, 62 65" fill="none" stroke="#334155" strokeWidth="1.8" />
            {/* Shiny steel chestpiece bell */}
            <circle cx="50" cy="81" r="2.8" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="50" cy="81" r="1.4" fill="#64748b" />
          </g>
        )}

        {/* CHISELED HIGH-QUALITY HEAD & JAWLINE */}
        <g filter="url(#layerShadow)">
          {isBaby ? (
            <circle cx="50" cy="46" r="17.5" fill="url(#skinGrad)" />
          ) : isToddler ? (
            <path d="M 33.5 44 C 33.5 28.5, 66.5 28.5, 66.5 44 C 66.5 56, 57.5 59.5, 50 59.5 C 42.5 59.5, 33.5 56, 33.5 44 Z" fill="url(#skinGrad)" />
          ) : (
            /* Perfectly sculpted organic jawline path with detailed chin curves */
            <path
              d={`M 31.5 41 Q 31.5 23.5, 50 23.5 Q 68.5 23.5, 68.5 41 Q 68.5 55.5, ${62 + cheekSwell/1.5} ${58.5 + cheekSwell/2.5} Q 50 ${chinY}, ${38 - cheekSwell/1.5} ${58.5 + cheekSwell/2.5} Q 31.5 55.5, 31.5 41 Z`}
              fill="url(#skinGrad)"
            />
          )}
        </g>

        {/* Anatomically Shaded Ears */}
        <g>
          {/* Left Ear */}
          <circle cx={isBaby ? "33.8" : "31"} cy="43.5" r={isBaby ? "3.2" : "4.0"} fill="url(#skinGrad)" />
          <path d="M 31.5 41 C 30 42, 30 45, 32.5 45.5" stroke={skinDeepShadow} strokeWidth="0.75" fill="none" opacity="0.32" />
          
          {/* Right Ear */}
          <circle cx={isBaby ? "66.2" : "69"} cy="43.5" r={isBaby ? "3.2" : "4.0"} fill="url(#skinGrad)" />
          <path d="M 68.5 41 C 70 42, 70 45, 67.5 45.5" stroke={skinDeepShadow} strokeWidth="0.75" fill="none" opacity="0.32" />
        </g>

        {/* Soft Organic Facial Depth Shadows */}
        {!isBaby && (
          <g pointerEvents="none" opacity="0.14">
            {/* Cheekbone shade */}
            <path d="M 31.5 41 Q 34 50, 42 54" fill="none" stroke={skinDeepShadow} strokeWidth="3" strokeLinecap="round" />
            <path d="M 68.5 41 Q 66 50, 58 54" fill="none" stroke={skinDeepShadow} strokeWidth="3" strokeLinecap="round" />
            {/* Temples shade */}
            <path d="M 34 29 Q 36 34, 38 36" stroke={skinDeepShadow} strokeWidth="1.8" fill="none" />
            <path d="M 66 29 Q 64 34, 62 36" stroke={skinDeepShadow} strokeWidth="1.8" fill="none" />
          </g>
        )}

        {/* Soft Rosy Makeup/Blush cheeks */}
        {(isBaby || facialExpression === "happy") && (
          <g opacity="0.22" pointerEvents="none">
            <circle cx="36.5" cy="48" r="3.6" fill="url(#bgPortraitGlow)" filter="url(#softGlow)" />
            <circle cx="63.5" cy="48" r="3.6" fill="url(#bgPortraitGlow)" filter="url(#softGlow)" />
            <circle cx="36.5" cy="48" r="2.8" fill={blushColor} />
            <circle cx="63.5" cy="48" r="2.8" fill={blushColor} />
          </g>
        )}

        {/* HIGH-QUALITY ILLUSTRATED EYE SYSTEM */}
        <g>
          {/* Left Eye Deep Socket Shading */}
          {!isBaby && <circle cx={50 - 9.5} cy={eyeY} r="6.2" fill={skinShadow} opacity="0.24" pointerEvents="none" />}
          {/* Right Eye Deep Socket Shading */}
          {!isBaby && <circle cx={50 + 9.5} cy={eyeY} r="6.2" fill={skinShadow} opacity="0.24" pointerEvents="none" />}

          {/* Left Sclera (3D sphere shade) */}
          <g transform={`translate(${50 - 9.5}, ${eyeY}) scale(${eyeSizeMultiplier})`}>
            <path d="M -4.5 0 C -4.5 -1.8, 4.5 -1.8, 4.5 0 C 4.5 1.8, -4.5 1.8, -4.5 0 Z" fill="#fcfcfd" />
            <path d="M -4.5 0 C -4.5 -1.8, 4.5 -1.8, 4.5 0 Z" fill="#94a3b8" opacity="0.14" />
            
            {/* Iris */}
            <circle cx="0" cy="0" r="2.3" fill="url(#irisGrad)" />
            {/* Iris radial sparkles */}
            <circle cx="0" cy="0" r="2.1" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="0.3,0.4" opacity="0.25" />
            {/* Pupil */}
            <circle cx="0" cy="0" r="1.15" fill="#090d16" />
            
            {/* Specular Wet Highlights */}
            {facialExpression !== "dead" && (
              <g>
                <circle cx="-0.65" cy="-0.65" r="0.6" fill="#ffffff" opacity="0.95" />
                <circle cx="0.65" cy="0.65" r="0.32" fill="#ffffff" opacity="0.75" />
              </g>
            )}

            {/* Stylized Upper Lash line and Double crease */}
            <path d="M -5 -0.5 Q 0 -2.4, 5 -0.5" fill="none" stroke="#090d16" strokeWidth="0.95" strokeLinecap="round" />
            <path d="M -4 -2 Q 0 -3.2, 4 -2" fill="none" stroke="#1e293b" strokeWidth="0.4" opacity="0.35" />
          </g>

          {/* Right Eye (Symmetrical) */}
          <g transform={`translate(${50 + 9.5}, ${eyeY}) scale(${eyeSizeMultiplier})`}>
            <path d="M -4.5 0 C -4.5 -1.8, 4.5 -1.8, 4.5 0 C 4.5 1.8, -4.5 1.8, -4.5 0 Z" fill="#fcfcfd" />
            <path d="M -4.5 0 C -4.5 -1.8, 4.5 -1.8, 4.5 0 Z" fill="#94a3b8" opacity="0.14" />
            
            <circle cx="0" cy="0" r="2.3" fill="url(#irisGrad)" />
            <circle cx="0" cy="0" r="2.1" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="0.3,0.4" opacity="0.25" />
            <circle cx="0" cy="0" r="1.15" fill="#090d16" />
            
            {facialExpression !== "dead" && (
              <g>
                <circle cx="-0.65" cy="-0.65" r="0.6" fill="#ffffff" opacity="0.95" />
                <circle cx="0.65" cy="0.65" r="0.32" fill="#ffffff" opacity="0.75" />
              </g>
            )}

            <path d="M -5 -0.5 Q 0 -2.4, 5 -0.5" fill="none" stroke="#090d16" strokeWidth="0.95" strokeLinecap="round" />
            <path d="M -4 -2 Q 0 -3.2, 4 -2" fill="none" stroke="#1e293b" strokeWidth="0.4" opacity="0.35" />
          </g>
        </g>

        {/* EYEBROWS (Gamer illustration style curves) */}
        <g stroke={hairStyle === "bald" ? "#4a301e" : hairColor} strokeLinecap="round" fill="none">
          {facialExpression === "angry" ? (
            <g>
              <path d="M 33 39 Q 41 41.5, 45.5 42.5" strokeWidth="2.1" />
              <path d="M 67 39 Q 59 41.5, 54.5 42.5" strokeWidth="2.1" />
              <path d="M 33 39 Q 41 41.5, 45.5 42.5" stroke="url(#hairGrad)" strokeWidth="1.4" />
              <path d="M 67 39 Q 59 41.5, 54.5 42.5" stroke="url(#hairGrad)" strokeWidth="1.4" />
            </g>
          ) : facialExpression === "sad" ? (
            <g>
              <path d="M 33 41.5 Q 40 39, 45 35.5" strokeWidth="2.1" />
              <path d="M 67 41.5 Q 60 39, 55 35.5" strokeWidth="2.1" />
              <path d="M 33 41.5 Q 40 39, 45 35.5" stroke="url(#hairGrad)" strokeWidth="1.4" />
              <path d="M 67 41.5 Q 60 39, 55 35.5" stroke="url(#hairGrad)" strokeWidth="1.4" />
            </g>
          ) : (
            <g>
              <path d="M 32.5 39.5 Q 39 36, 45.5 38.2" strokeWidth={isBaby ? "1" : "2.1"} />
              <path d="M 67.5 39.5 Q 61 36, 54.5 38.2" strokeWidth={isBaby ? "1" : "2.1"} />
              <path d="M 32.5 39.5 Q 39 36, 45.5 38.2" stroke="url(#hairGrad)" strokeWidth={isBaby ? "0.6" : "1.4"} />
              <path d="M 67.5 39.5 Q 61 36, 54.5 38.2" stroke="url(#hairGrad)" strokeWidth={isBaby ? "0.6" : "1.4"} />
            </g>
          )}
        </g>

        {/* ILLUSTRATED NOSE SYSTEM */}
        {accessory === "clown_nose" ? (
          <g filter="url(#layerShadow)">
            <circle cx="50" cy="48.5" r="4.5" fill="#ef4444" />
            <circle cx="48.2" cy="46.8" r="1.4" fill="#ffffff" opacity="0.88" />
          </g>
        ) : (
          <g>
            {/* Bridge shading */}
            <path d="M 47.5 39 L 47.5 48 Q 47.5 50.5, 50 50.5" fill="none" stroke={skinShadow} strokeWidth="1.3" opacity="0.4" />
            {/* Nose Tip & Nostril outline curves */}
            <path d="M 46.2 50 C 47.2 51.8, 52.8 51.8, 53.8 50" fill="none" stroke={skinDeepShadow} strokeWidth="1.15" strokeLinecap="round" opacity="0.38" />
            <path d="M 48 49 C 49 48, 51 48, 52 49" fill="none" stroke={skinHighlight} strokeWidth="0.9" opacity="0.6" />
          </g>
        )}

        {/* DETAILED MOUTH & LIPS */}
        <g>
          {facialExpression === "dead" ? (
            <path d="M 42 56 Q 50 53.5, 58 56" stroke="#090d16" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            <g>
              {/* Painted Upper Lip */}
              <path
                d="M 42 54.2 Q 46 52.2, 50 53.1 Q 54 52.2, 58 54.2 Q 50 55.6, 42 54.2 Z"
                fill="#b91c1c"
                opacity="0.85"
              />
              {/* Painted Lower Lip */}
              <path
                d="M 42.5 55.2 Q 50 59.2, 57.5 55.2 Q 50 56.4, 42.5 55.2 Z"
                fill="#e11d48"
                opacity="0.88"
              />
              {/* Specular Wet Gloss Highlight */}
              <path
                d="M 45 56.5 Q 50 57.8, 55 56.5"
                stroke="#ffffff"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.65"
                fill="none"
              />

              {/* Dynamic Expression-specific mouth openings with teeth/tongue details */}
              {facialExpression === "happy" ? (
                <g>
                  {/* Smiling open mouth */}
                  <path d="M 42 54.5 Q 50 61.5, 58 54.5 Z" fill="#4c0519" stroke="#090d16" strokeWidth="1.3" />
                  {/* Clean row of pearly white teeth */}
                  <path d="M 43.5 54.8 L 56.5 54.8 L 55 56 L 45 56 Z" fill="#ffffff" />
                  {/* Sickly missing tooth cutout */}
                  {hasMissingTooth && (
                    <rect x="48" y="54.8" width="2.4" height="1.6" fill="#4c0519" />
                  )}
                </g>
              ) : facialExpression === "sad" ? (
                <path d="M 42 56.8 Q 50 52.5, 58 56.8" stroke="#090d16" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              ) : facialExpression === "angry" ? (
                <path d="M 42.5 55.5 L 57.5 55.5" stroke="#090d16" strokeWidth="2.1" strokeLinecap="round" fill="none" />
              ) : facialExpression === "crazed" ? (
                <g>
                  <path d="M 42 54.5 Q 50 66, 58 54.5 Z" fill="#450a0a" stroke="#090d16" strokeWidth="1.3" />
                  <path d="M 43.5 54.8 L 56.5 54.8 L 55 56 L 45 56 Z" fill="#ffffff" />
                  {/* Red shouting tongue */}
                  <circle cx="50" cy="62" r="2.8" fill="#fda4af" />
                </g>
              ) : (
                /* Neutral parting line */
                <path d="M 42.5 54.8 Q 50 55.2, 57.5 54.8" stroke="#090d16" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              )}
            </g>
          )}
        </g>

        {/* DYNAMIC SHADED FACIAL HAIR */}
        {facialHairType !== "none" && !isBaby && !isToddler && !isChild && (
          <g fill="url(#hairGrad)" stroke="url(#hairGrad)" filter="url(#layerShadow)">
            {facialHairType === "stubble" && (
              <path
                d={`M 32 42 Q 32 55.5, 38 60 Q 50 ${chinY}, 62 60 Q 68 55.5, 68 42`}
                fill="none"
                stroke="#334155"
                strokeWidth="2.8"
                strokeDasharray="0.8,1.3"
                opacity="0.38"
              />
            )}
            {facialHairType === "mustache" && (
              <g>
                <path d="M 41 53 Q 50 50, 59 53 Q 50 52.2, 41 53 Z" opacity="0.94" />
                {/* Strand strokes */}
                <path d="M 44 52.5 L 46 54.5 M 56 52.5 L 54 54.5" stroke={hairShadow} strokeWidth="0.85" opacity="0.5" />
              </g>
            )}
            {facialHairType === "beard" && (
              <g>
                <path
                  d={`M 32 42 Q 31 52.5, 38 60.5 Q 50 ${chinY + 3}, 62 60.5 Q 69 52.5, 68 42 Q 68 54.5, 50 63 Q 32 54.5, 32 42 Z`}
                  opacity="0.96"
                />
                {/* Strands detailing */}
                <path d="M 37 57 Q 50 68, 63 57" fill="none" stroke={hairHighlight} strokeWidth="0.6" opacity="0.3" />
                <path d="M 44 60 L 46 63.5 M 56 60 L 54 63.5" fill="none" stroke={hairShadow} strokeWidth="0.8" opacity="0.5" />
              </g>
            )}
          </g>
        )}

        {/* AGING AND HEALTH WRINKLES SYSTEM */}
        {(age >= 35 || health < 45) && (
          <g stroke="#090d16" strokeWidth="0.65" strokeLinecap="round" fill="none">
            {/* Forehead worry lines */}
            <g opacity={foreHeadWrinkleOpacity}>
              <path d="M 36.5 29 Q 50 27.5, 63.5 29" />
              <path d="M 38.5 32.5 Q 50 31, 61.5 32.5" />
            </g>

            {/* Crow's feet laugh creases */}
            <g opacity={Math.max(0, (age - 45) / 38)}>
              <path d="M 32 43.5 L 28 45.5" />
              <path d="M 31.5 44.5 L 28.5 47.5" />
              <path d="M 68 43.5 L 72 45.5" />
              <path d="M 68.5 44.5 L 71.5 47.5" />
            </g>

            {/* Sickly/elderly eye bags */}
            <g opacity={eyeBagOpacity}>
              <path d={`M ${50 - 13.5} ${eyeY + 2.3} Q ${50 - 9.5} ${eyeY + 4.3}, ${50 - 5.5} ${eyeY + 2.3}`} />
              <path d={`M ${50 + 5.5} ${eyeY + 2.3} Q ${50 + 9.5} ${eyeY + 4.3}, ${50 + 13.5} ${eyeY + 2.3}`} />
            </g>

            {/* Deep nasolabial laugh folds */}
            <g opacity={laughLineOpacity}>
              <path d="M 41.2 50.2 Q 39 56.5, 42.2 60.5" />
              <path d="M 58.8 50.2 Q 61 56.5, 57.8 60.5" />
            </g>
          </g>
        )}

        {/* FRONT HAIR LAYER (Sits on top, casting drop shadow) */}
        {hairStyle !== "bald" && !isBaby && (
          <g fill="url(#hairGrad)" filter="url(#layerShadow)">
            {hairStyle === "short" && (
              <g>
                {/* Modern clean undercut crop */}
                <path d="M 31.5 41 C 31.5 21, 68.5 21, 68.5 41 C 68.5 33, 31.5 33, 31.5 41 Z" />
                <path d="M 31.5 41 Q 39 30, 48 33 Q 58 30, 68.5 41 L 65.5 31 L 34.5 31 Z" fill="url(#hairGrad)" />
                {/* Stray strands sweeping front */}
                <path d="M 40 33 Q 41.5 37, 43 38" fill="none" stroke="url(#hairGrad)" strokeWidth="1.6" strokeLinecap="round" />
                {/* Clean shine accent */}
                <path d="M 36 29 Q 50 22, 64 29" fill="none" stroke="#ffffff" strokeWidth="0.85" opacity="0.22" />
              </g>
            )}

            {hairStyle === "curly" && (
              <g>
                {/* Volumetric painted curls overlapping the scalp */}
                <circle cx="34" cy="30" r="5" />
                <circle cx="43.5" cy="24" r="5.8" />
                <circle cx="51.5" cy="22" r="5.8" />
                <circle cx="59.5" cy="24" r="5.8" />
                <circle cx="66" cy="30" r="5" />
                <circle cx="32" cy="38" r="4" />
                <circle cx="68" cy="38" r="4" />
                {/* Highlights on spheres */}
                <circle cx="43.5" cy="24" r="3.2" fill="#ffffff" opacity="0.14" />
                <circle cx="51.5" cy="22" r="3.2" fill="#ffffff" opacity="0.14" />
                <circle cx="59.5" cy="24" r="3.2" fill="#ffffff" opacity="0.14" />
                <path d="M 31.5 41 C 31.5 23.5, 68.5 23.5, 68.5 41 Z" />
                {/* Soft curl loops */}
                <path d="M 36 38 C 34 40, 36 43, 38 41" fill="none" stroke="url(#hairGrad)" strokeWidth="1.8" />
                <path d="M 64 38 C 66 40, 64 43, 62 41" fill="none" stroke="url(#hairGrad)" strokeWidth="1.8" />
              </g>
            )}

            {hairStyle === "long" && (
              <g>
                {/* Elegant split-part locks draping side cheek bones */}
                <path d="M 31.5 41 C 31.5 20, 68.5 20, 68.5 41 Z" />
                <path d="M 30 41 Q 29.5 53, 34.5 53 Q 36.5 47, 33 41 Z" />
                <path d="M 70 41 Q 70.5 53, 65.5 53 Q 63.5 47, 67 41 Z" />
                {/* Volume highlights */}
                <path d="M 39 23 Q 30.5 32, 29.5 41" fill="none" stroke="#ffffff" strokeWidth="1.15" opacity="0.2" />
                <path d="M 61 23 Q 69.5 32, 70.5 41" fill="none" stroke="#ffffff" strokeWidth="1.15" opacity="0.2" />
              </g>
            )}

            {hairStyle === "punk" && (
              <g>
                {/* Spikey detailed Mohawk */}
                <path d="M 43.5 24 L 50 8 L 56.5 24 L 50 16 Z" />
                <path d="M 38 26 L 43.5 12 L 49 26 L 43.5 18 Z" />
                <path d="M 52 26 L 57.5 12 L 63 26 L 57.5 18 Z" />
                <path d="M 50 8 L 52.5 13 L 47.5 13 Z" fill="#ffffff" opacity="0.35" />
                <path d="M 43.5 12 L 45 16 L 42 16 Z" fill="#ffffff" opacity="0.35" />
                <path d="M 57.5 12 L 59 16 L 56 16 Z" fill="#ffffff" opacity="0.35" />
              </g>
            )}

            {hairStyle === "afro" && (
              <g>
                {/* Puffy clouds afro volume */}
                <circle cx="50" cy="21.5" r="11" />
                <circle cx="37.5" cy="24.5" r="11" />
                <circle cx="62.5" cy="24.5" r="11" />
                <circle cx="31.5" cy="32.5" r="10" />
                <circle cx="68.5" cy="32.5" r="10" />
                <path d="M 31.5 41 Q 31.5 22.5, 50 22.5 Q 68.5 22.5, 68.5 41 Z" />
                {/* Ambient glow edge */}
                <path d="M 34.5 24.5 Q 38.5 22.5, 39.5 26.5" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.18" />
                <path d="M 65.5 24.5 Q 61.5 22.5, 60.5 26.5" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.18" />
              </g>
            )}
          </g>
        )}

        {/* Soft baby hair curls */}
        {isBaby && (
          <g stroke="url(#hairGrad)" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" fill="none">
            <path d="M 46.5 27 Q 48.5 23.5, 51 27" />
            <path d="M 48.5 25.5 Q 51 22, 53.5 25.5" />
          </g>
        )}

        {/* PROFESSIONAL WORK HAT LAYER (Casts shadow) */}
        {hasHardHat && (
          <g filter="url(#layerShadow)">
            {/* Volumetric construction helmet with peak ridge */}
            <path d="M 30.5 25 A 19.5 19.5 0 0 1 69.5 25 L 72.5 27 L 27.5 27 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <path d="M 25 27 L 75 27 L 71 30 L 29 30 Z" fill="#f59e0b" />
            {/* Center crest */}
            <rect x="46.5" y="18" width="7" height="8.5" fill="#d97706" rx="0.5" />
            <rect x="48" y="18" width="4" height="8.5" fill="#fbbf24" rx="0.5" />
          </g>
        )}

        {hasChefHat && (
          <g filter="url(#layerShadow)">
            {/* Fluffy white pleated chefs crown */}
            <path d="M 32.5 23.5 Q 26.5 11, 37.5 11 Q 50 3, 62.5 11 Q 73.5 11, 67.5 23.5 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            {/* Base headband fold */}
            <rect x="32" y="20.5" width="36" height="4.8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.65" />
          </g>
        )}

        {/* LOW-MORALITY CRIMINAL ACCENT TATTOOS */}
        {state && morality < 35 && (
          <g stroke="#2563eb" strokeWidth="0.65" fill="none" opacity="0.7" filter="url(#layerShadow)">
            {/* Tear drop ink under left eye */}
            <path d="M 39 46.5 L 39.8 48 L 38.2 48 Z" fill="#2563eb" stroke="none" />
            {/* Neck tribal tattoo art */}
            <path d="M 46 64.5 Q 47.5 67, 46 69 T 47.5 73.5" strokeWidth="0.95" />
          </g>
        )}

        {/* SCARS, BANDAGES & BLACK EYE */}
        {hasScar && (
          <g filter="url(#layerShadow)">
            <path d="M 32.5 45.5 L 38.5 51.5" stroke="#f43f5e" strokeWidth="1.4" opacity="0.9" strokeLinecap="round" />
            {/* Cross stitches */}
            <path d="M 33 49 L 36 47 M 35 51 L 38 49" stroke="#fda4af" strokeWidth="0.6" />
          </g>
        )}

        {hasBlackEye && (
          <circle cx="40.5" cy={eyeY} r="4.8" fill="#6b21a8" opacity="0.25" filter="url(#softGlow)" />
        )}

        {hasBandage && (
          <g transform="translate(61, 49) rotate(22)" filter="url(#layerShadow)" opacity="0.95">
            <rect x="-1.2" y="-3.8" width="2.4" height="7.6" fill="#fde047" rx="0.5" />
            <rect x="-3.8" y="-1.2" width="7.6" height="2.4" fill="#fde047" rx="0.5" />
            <circle cx="0" cy="0" r="0.6" fill="#ffffff" opacity="0.8" />
          </g>
        )}

        {/* MODERN LAYERED ACCESSORIES */}
        {accessory === "glasses" && (
          <g opacity="0.98" filter="url(#layerShadow)">
            {/* Stylized acetate frames with 3D shadow and glass sheen reflections */}
            <circle cx={50 - 9.5} cy={eyeY} r="5.8" stroke="#1e293b" strokeWidth="1.5" fill="none" />
            <circle cx={50 + 9.5} cy={eyeY} r="5.8" stroke="#1e293b" strokeWidth="1.5" fill="none" />
            {/* Blue-light anti-reflective coat lens shine sweeps */}
            <path d={`M ${50 - 13.5} ${eyeY - 2.5} L ${50 - 6.5} ${eyeY + 2.5}`} stroke="#38bdf8" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
            <path d={`M ${50 + 5.5} ${eyeY - 2.5} L ${50 + 12.5} ${eyeY + 2.5}`} stroke="#38bdf8" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
            {/* Golden center nose bridge and temple rails */}
            <path d={`M ${50 - 3.7} ${eyeY} L ${50 + 3.7} ${eyeY}`} stroke="url(#goldShine)" strokeWidth="1.6" />
            <path d={`M ${50 - 15.3} ${eyeY} L ${50 - 18.5} ${eyeY - 1.2}`} stroke="#1e293b" strokeWidth="1.2" />
            <path d={`M ${50 + 15.3} ${eyeY} L ${50 + 18.5} ${eyeY - 1.2}`} stroke="#1e293b" strokeWidth="1.2" />
          </g>
        )}

        {accessory === "sunglasses" && (
          <g filter="url(#layerShadow)" opacity="0.98">
            {/* Modern cool aviator sunglasses with Sunset orange/purple-pink/dark-blue reflection */}
            <defs>
              <linearGradient id="sunsetLens" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <path d={`M ${50 - 15.5} ${eyeY} C ${50 - 15.5} ${eyeY - 5.5}, ${50 - 2.5} ${eyeY - 5.5}, ${50 - 2.5} ${eyeY} C ${50 - 2.5} ${eyeY + 4.5}, ${50 - 15.5} ${eyeY + 4.5}, ${50 - 15.5} ${eyeY} Z`} fill="url(#sunsetLens)" stroke="url(#goldShine)" strokeWidth="1.0" />
            <path d={`M ${50 + 2.5} ${eyeY} C ${50 + 2.5} ${eyeY - 5.5}, ${50 + 15.5} ${eyeY - 5.5}, ${50 + 15.5} ${eyeY} C ${50 + 15.5} ${eyeY + 4.5}, ${50 + 2.5} ${eyeY + 4.5}, ${50 + 2.5} ${eyeY} Z`} fill="url(#sunsetLens)" stroke="url(#goldShine)" strokeWidth="1.0" />
            {/* Glossy specular shine lines */}
            <path d={`M ${50 - 13.2} ${eyeY - 3.2} L ${50 - 6.2} ${eyeY + 3.8}`} stroke="#ffffff" strokeWidth="1.4" opacity="0.45" strokeLinecap="round" />
            <path d={`M ${50 + 4.8} ${eyeY - 3.2} L ${50 + 11.8} ${eyeY + 3.8}`} stroke="#ffffff" strokeWidth="1.4" opacity="0.45" strokeLinecap="round" />
            {/* Double brow bar */}
            <path d={`M ${50 - 14.5} ${eyeY - 4.5} L ${50 + 14.5} ${eyeY - 4.5}`} stroke="url(#goldShine)" strokeWidth="1.2" />
            <path d={`M ${50 - 2.5} ${eyeY - 2} L ${50 + 2.5} ${eyeY - 2}`} stroke="url(#goldShine)" strokeWidth="1.6" />
            <path d={`M ${50 - 15.5} ${eyeY - 1} L ${50 - 18.5} ${eyeY - 2}`} stroke="url(#goldShine)" strokeWidth="0.9" />
            <path d={`M ${50 + 15.5} ${eyeY - 1} L ${50 + 18.5} ${eyeY - 2}`} stroke="url(#goldShine)" strokeWidth="0.9" />
          </g>
        )}

        {accessory === "monocle" && (
          <g stroke="url(#goldShine)" strokeWidth="1.45" fill="none" filter="url(#layerShadow)" opacity="0.98">
            <circle cx={50 + 9.5} cy={eyeY} r="5.8" />
            {/* Glass sheen */}
            <path d={`M ${50 + 5.5} ${eyeY - 2.5} L ${50 + 12.5} ${eyeY + 2.5}`} stroke="#38bdf8" strokeWidth="1.0" opacity="0.5" strokeLinecap="round" />
            {/* Hanging golden chain links draping down the lapel */}
            <path d={`M ${50 + 15.3} ${eyeY} C ${50 + 19.5} ${eyeY + 11}, 62 64, 53 79`} strokeWidth="0.75" strokeDasharray="1.1,1.4" />
          </g>
        )}
      </svg>
    </div>
  );
};

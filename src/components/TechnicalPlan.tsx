/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Wrench, GitFork, Milestone, FileText, CheckCircle } from "lucide-react";

export const TechnicalPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tech" | "github" | "phases" | "mvp" | "files">("tech");

  const sections = {
    tech: {
      title: "1 & 2. Technology Stack & Technical Plan",
      icon: <Wrench className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-6 text-slate-300">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Architectural Philosophy</h4>
            <p className="text-sm leading-relaxed">
              To build a rich, addictive, and fast-paced text-based game, we utilize an <strong>Offline-First, State-Driven SPA architecture</strong>.
              All game simulation computations (aging, NPC life cycles, economic fluctuation, event evaluations) run purely on the client side inside a consolidated React state tree.
              This guarantees instantaneous page loads, zero server lag when hitting "Age Up", and makes compiling the game into a native mobile app trivial using wrapper systems.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Core Tech Stack (100% Free Tier Friendly)</h4>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Frontend Core:</strong> React 19 + TypeScript.
                  Ensures perfect type-safety for complex game state models (such as NPC trees, nested properties, and stats) and leverages React's reactive state for high-fidelity UI rendering.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Build Tool:</strong> Vite.
                  Ultra-fast module bundling, instant local dev reloads, and highly optimized production builds targeting pure static HTML/JS output.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Styling:</strong> Tailwind CSS.
                  Rapid styling via utility classes. Ideal for building high-density, bento-grid dashboards that work seamlessly across both desktop and mobile devices.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Animations:</strong> Motion (formerly Framer Motion).
                  Provides juicy micro-interactions, modal fly-ins, and numbers ticking upwards, critical for maintaining high gamification engagement.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Persistence:</strong> HTML5 LocalStorage + JSON Export.
                  Zero-cost persistence. Keeps game states saved even if the user refreshes their browser. Allows users to easily backup or share their save files via JSON string exports.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white">Mobile Compiling:</strong> CapacitorJS or Apache Cordova.
                  Wraps our static React build directly in a native webview container, granting access to iOS App Store and Google Play deployment with zero modifications to the core simulation logic.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    github: {
      title: "3. GitHub Repository Design",
      icon: <GitFork className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-6 text-slate-300">
          <p className="text-sm">
            A production-ready repository layout separating game data configurations from UI views, allowing non-technical writers to expand the event deck without breaking the simulation loop.
          </p>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-cyan-400 overflow-x-auto leading-relaxed border border-slate-800">
{`comedy-life-simulator/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD: Auto-publish to GitHub Pages on commit
├── public/
│   └── icons/                # High-contrast game icons and startup images
├── src/
│   ├── @types/
│   │   └── index.ts          # Core type definitions (Player, NPC, Jobs, Events)
│   ├── components/           # UI Modular Blocks
│   │   ├── AvatarRenderer.tsx# Custom SVG procedural face compiler
│   │   ├── Dashboard.tsx     # Game hud & layout controller
│   │   ├── EventModal.tsx    # Random choice injector & card layout
│   │   ├── TechPlan.tsx      # Embedded developer planning console
│   │   └── subpanels/        # Category tabs (Crime, Careers, RealEstate)
│   ├── data/                 # Game Configurations & Content Deck
│   │   ├── events.ts         # JSON deck containing thousands of funny events
│   │   ├── careers.ts        # Career ladder and salary matrix
│   │   └── properties.ts     # Real estate buy/rent and tenant lists
│   ├── hooks/
│   │   └── useGameState.ts   # Centralized logic for aging, loops, saving
│   ├── index.css             # Tailwind entry & custom font mappings
│   ├── main.tsx              # React bootstrap entry point
│   └── App.tsx               # Primary coordinator and state hub
├── tsconfig.json             # Strict TypeScript compilation configs
├── vite.config.ts            # Bundling presets and build alias mappings
└── package.json              # Standard dependency manifest`}
          </pre>
        </div>
      )
    },
    phases: {
      title: "4. Achievable Development Phases",
      icon: <Milestone className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm">
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 1: Core Loop & Character Creation (Current Step)</h5>
            <p className="text-slate-400">Implement baseline state modeling, statistics, interactive custom character creation, procedural avatar rendering, and the central event scheduler loop.</p>
          </div>
          <div className="border-l-2 border-slate-700 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 2: World Population (NPCs & Social Tree)</h5>
            <p className="text-slate-400">Inject dynamic NPCs with age routines. Implement dynamic relationships (family, dating, marriage, children) and character-specific event logs detailing their reactions to player behavior.</p>
          </div>
          <div className="border-l-2 border-slate-700 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 3: Wealth & Economic Engine</h5>
            <p className="text-slate-400">Introduce multi-tier jobs, stock-market tickers, property buying/renting, and landlord simulations where players manage eccentric tenants.</p>
          </div>
          <div className="border-l-2 border-slate-700 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 4: Crime, Justice & Penal Systems</h5>
            <p className="text-slate-400">Add multi-tiered crime mechanics (petty thievery, elaborate fraud), police tracking metrics, and fully-narrated courtroom battles where players use rhetorical arguments to bribe or escape prosecution.</p>
          </div>
          <div className="border-l-2 border-slate-700 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 5: Fame, Virality & Public Opinion</h5>
            <p className="text-slate-400">Deploy social media trackers, viral loops, news broadcasts, cancel culture meters, and satirical parody celebrity encounters.</p>
          </div>
          <div className="border-l-2 border-slate-700 pl-4 space-y-1">
            <h5 className="font-bold text-white">Phase 6: Native Mobile Packaging & Launch</h5>
            <p className="text-slate-400">Compile assets into native Android/iOS bundles using Capacitor, set up in-app purchase hooks for cosmetic features, and push to digital markets.</p>
          </div>
        </div>
      )
    },
    mvp: {
      title: "5. Minimum Viable Product (MVP)",
      icon: <CheckCircle className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <p className="text-sm">
            To make immediate development productive and fun, the MVP focuses on establishing a completely playable game slice. It comprises:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <li className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <strong className="text-indigo-300 block mb-1">Interactive Creation</strong>
              Custom choose your name, gender, traits, hair, skin, and eyes.
            </li>
            <li className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <strong className="text-indigo-300 block mb-1">State & Stats Tracker</strong>
              Full 14-stat tracker fluctuating dynamically in real-time based on your clicks.
            </li>
            <li className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <strong className="text-indigo-300 block mb-1">Random Event Loop</strong>
              The iconic "Age Up" sequence triggering funny scenario choice-cards.
            </li>
            <li className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <strong className="text-indigo-300 block mb-1">Visual Aging Engine</strong>
              An avatar whose hair turns gray, grows old, and changes expressions instantly.
            </li>
          </ul>
          <p className="text-sm text-amber-300 bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
            💡 <strong>Good news!</strong> We have fully implemented this exact high-fidelity MVP in this app workspace right now. You can close this Dev Console and start playing instantly!
          </p>
        </div>
      )
    },
    files: {
      title: "6. Created Files Map",
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm">
          <p>
            Here is a summary of the code architecture we established in this folder, designed for seamless scalability:
          </p>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-2">File Path</th>
                <th className="py-2">Purpose & Architecture Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/types.ts</td>
                <td className="py-2">All custom interfaces for Player state, careers, pets, real-estate, and NPC structures. Safe against type-drifts.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/data/careers.ts</td>
                <td className="py-2">Hilarious career branches (Tech, Corporate, Shady, Arts) and multi-year educational routes containing custom perk rules.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/data/property.ts</td>
                <td className="py-2">Housing listings and tenant templates designed for landlord micro-simulations.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/data/events.ts</td>
                <td className="py-2">The comedy event pool, detailing options, consequences, and conditional filters.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/components/AvatarRenderer.tsx</td>
                <td className="py-2">Dynamic, procedural face drawings rendered purely via responsive React SVG tags. Zero image load asset lags.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-cyan-400">/src/App.tsx</td>
                <td className="py-2">Primary Game coordinator, state machine, local storage synchronizer, and visual shell tabs.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  };

  return (
    <div id="technical-plan-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">Studio Blueprint</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            Game Technical Architecture & Plan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete technical specs designed for scaling and compiling to Android & iOS.
          </p>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
        {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {sections[key].title.split(".")[0]}. {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Active Tab Area */}
      <div className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-2xl min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
            {sections[activeTab].icon}
            <h3 className="text-lg font-bold text-white">{sections[activeTab].title}</h3>
          </div>
          {sections[activeTab].content}
        </div>

        <div className="mt-8 border-t border-slate-800/50 pt-4 text-xs text-slate-500 flex justify-between items-center">
          <span>COMEDY LIFE SIMULATOR V1.0.0</span>
          <span>Designed with AI-Assisted Architecture</span>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Home,
  Car,
  Briefcase,
  Gem,
  DollarSign,
  Hammer,
  Users,
  UserMinus,
  PlusCircle,
  Wrench,
  Flame,
  Gauge,
  HelpCircle,
  Sparkles,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  Coffee,
  CheckCircle,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { RealEstate, Vehicle, PersonalItem, Business, NPC, Gender } from "../types";
import {
  LOCATIONS,
  PROPERTY_OPTIONS_EXPANDED,
  VEHICLE_OPTIONS,
  ITEM_OPTIONS,
  BUSINESS_OPTIONS,
  FUN_TENANTS_LIST
} from "../data/assetsCatalog";

interface PropertyPanelProps {
  cash: number;
  properties: RealEstate[];
  vehicles: Vehicle[];
  personalItems: PersonalItem[];
  businesses: Business[];
  investments?: Record<string, number>;
  stockPrices?: Record<string, number>;
  onAction: (logText: string, statChanges: any) => void;
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
  onBuyStock: (ticker: string, quantity: number, price: number) => void;
  onSellStock: (ticker: string, quantity: number, price: number) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  cash,
  properties,
  vehicles,
  personalItems,
  businesses,
  investments = { TURNIP: 0, SSYN: 0, CWP: 0, GOLD: 0, FROG: 0 },
  stockPrices = { TURNIP: 10, SSYN: 150, CWP: 50, GOLD: 400, FROG: 1.50 },
  onAction,
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
  onBuyStock,
  onSellStock
}) => {
  // Tabs for different asset classes: real_estate, vehicles, businesses, collections, investments
  const [assetTab, setAssetTab] = useState<"real_estate" | "vehicles" | "businesses" | "collections" | "investments">("real_estate");
  
  // Real Estate subtab: catalog vs owned
  const [realEstateSubTab, setRealEstateSubTab] = useState<"listings" | "owned">("listings");
  
  // Vehicle subtab: showroom vs owned
  const [vehicleSubTab, setVehicleSubTab] = useState<"showroom" | "garage">("showroom");

  // Business subtab: investment vs owned
  const [businessSubTab, setBusinessSubTab] = useState<"invest" | "hq">("invest");

  // Collection subtab: market vs vault
  const [collectionSubTab, setCollectionSubTab] = useState<"shop" | "vault">("shop");

  // Selected mortgage / cash option state for property purchases
  const [purchaseMethod, setPurchaseMethod] = useState<{ [key: string]: "cash" | "mortgage" }>({});

  const ownedProperties = properties.filter((p) => p.type === "own");
  const rentedProperty = properties.find((p) => p.type === "rent");

  // --- Real Estate Core Actions ---
  const handleBuyPropertyAction = (opt: typeof PROPERTY_OPTIONS_EXPANDED[0]) => {
    const isMortgage = purchaseMethod[opt.id] === "mortgage";
    const costToPay = isMortgage ? Math.round(opt.cost * 0.2) : opt.cost; // 20% down payment
    
    if (cash < costToPay) {
      onAction("Your bank cards were aggressively declined! You cannot afford this down-payment/price.", {});
      return;
    }

    const newProp: RealEstate = {
      id: Math.random().toString(36).substr(2, 9),
      name: opt.name,
      type: opt.type,
      propertyType: opt.propertyType,
      value: opt.cost,
      monthlyCost: opt.type === "rent" 
        ? opt.cost 
        : isMortgage 
          ? Math.round(opt.monthlyMaintenance + (opt.cost * 0.005)) // Interest payments added
          : opt.monthlyMaintenance,
      condition: 100,
      securityLevel: 10,
      hasPool: false,
      hasGarden: false,
      hasSmartTech: false,
      locationArea: opt.locationArea,
      tenants: []
    };

    onBuyProperty(newProp);
    onAction(
      `🏡 Congratulations! You signed the deeds for "${opt.name}" in "${opt.locationArea}" using ${isMortgage ? "a 20% down-payment mortgage" : "pure liquid cash"}. Your social credit and confidence spiked!`,
      {
        cash: -costToPay,
        happiness: opt.happinessModifier + 5,
        reputation: isMortgage ? 5 : 20
      }
    );
  };

  const handleSellPropertyAction = (prop: RealEstate) => {
    // Buyers with personalities (Family, Investor, Luxury Buyer)
    const buyerPersonalities = [
      { type: "Family", offerMultiplier: 0.85, msg: "wants space for three aggressive toddlers" },
      { type: "Ruthless Investor", offerMultiplier: 0.72, msg: "proposes a lowball cash deal with zero contingencies" },
      { type: "High-Status Mogul", offerMultiplier: 1.05, msg: "is desperate to acquire the prestige address" }
    ];
    
    const randomBuyer = buyerPersonalities[Math.floor(Math.random() * buyerPersonalities.length)];
    const baseValue = prop.value * (prop.condition / 100);
    const offerValue = Math.round(baseValue * randomBuyer.offerMultiplier);

    onSellProperty(prop.id, offerValue);
    onAction(
      `💸 A "${randomBuyer.type}" buyer offered to buy "${prop.name}". They ${randomBuyer.msg}. You agreed and sold the property for $${offerValue.toLocaleString()}!`,
      {
        cash: offerValue,
        happiness: 5
      }
    );
  };

  const handleRenovateProperty = (propId: string, upgradeType: "repair" | "pool" | "garden" | "security" | "smart") => {
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    if (upgradeType === "repair") {
      const repairCost = Math.round((100 - prop.condition) * (prop.value * 0.001));
      if (cash < repairCost) {
        onAction("You don't even have enough cash to buy a single paint brush for these repairs.", {});
        return;
      }
      onUpdateProperty(propId, { condition: 100 });
      onAction(`🛠️ You hired a team of highly vocal builders. They successfully repaired all leaks and cracks at "${prop.name}".`, {
        cash: -repairCost,
        happiness: 5
      });
    } else if (upgradeType === "pool") {
      const poolCost = 15000;
      if (cash < poolCost) {
        onAction("Installing an infinity pool requires more swimming pool cash.", {});
        return;
      }
      onUpdateProperty(propId, { hasPool: true, condition: Math.min(100, prop.condition + 5) });
      onAction(`🏊 You installed a stunning solar-heated infinity pool. Your friends are extremely jealous. (+15 Happiness)`, {
        cash: -poolCost,
        happiness: 15,
        reputation: 10
      });
    } else if (upgradeType === "garden") {
      const gardenCost = 4500;
      if (cash < gardenCost) {
        onAction("A garden landscape upgrade is outside your current petty cash reserve.", {});
        return;
      }
      onUpdateProperty(propId, { hasGarden: true, condition: Math.min(100, prop.condition + 10) });
      onAction(`🌿 You landscaped the garden with organic bamboo and glowing bioluminescent flowerpots.`, {
        cash: -gardenCost,
        happiness: 8
      });
    } else if (upgradeType === "security") {
      const securityCost = 7200;
      if (cash < securityCost) {
        onAction("Can't afford laser grids right now.", {});
        return;
      }
      onUpdateProperty(propId, { securityLevel: 95 });
      onAction(`🔒 You installed high-voltage laser wires, smart biometric doors, and guard dog sirens. Absolute maximum security achieved!`, {
        cash: -securityCost,
        happiness: 5
      });
    } else if (upgradeType === "smart") {
      const smartCost = 5500;
      if (cash < smartCost) {
        onAction("Can't afford AI butler nodes.", {});
        return;
      }
      onUpdateProperty(propId, { hasSmartTech: true });
      onAction(`🤖 Integrated full smart tech. The house now speaks in a British accent and automatically adjusts light brightness to your mood.`, {
        cash: -smartCost,
        happiness: 10
      });
    }
  };

  const handleAdvertiseTenant = (propId: string) => {
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    // Pick a random funny tenant background with simulated traits
    const tenantBackground = FUN_TENANTS_LIST[Math.floor(Math.random() * FUN_TENANTS_LIST.length)];
    
    const newTenant: NPC = {
      id: Math.random().toString(36).substr(2, 9),
      name: tenantBackground.name,
      gender: Gender.NON_BINARY,
      relationType: "Tenant",
      relationValue: tenantBackground.reliability,
      age: 21 + Math.floor(Math.random() * 50),
      isAlive: true,
      occupation: tenantBackground.occupation,
      personality: tenantBackground.personality,
      memories: [`Enrolled as tenant in "${prop.name}"`]
    };

    onAddTenant(propId, newTenant);
    onAction(
      `🔑 tenant accepted! "${newTenant.name}" (${newTenant.occupation}) moved in. Personality: "${newTenant.personality}". They promised to pay rent!`,
      { happiness: 5 }
    );
  };

  const handleEvictTenantAction = (propId: string, tenant: NPC) => {
    onEvictTenant(propId, tenant.id);
    onAction(`🚫 You dramatically evicted "${tenant.name}". They muttered an ancient dialect curse and left some glowing moss in the tub.`, {
      morality: -12,
      happiness: -4
    });
  };

  // --- Vehicles Actions ---
  const handleBuyVehicleAction = (opt: typeof VEHICLE_OPTIONS[0]) => {
    if (cash < opt.cost) {
      onAction("You cannot buy this ride. Stick to walking for now.", {});
      return;
    }

    const newVeh: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      name: opt.name,
      category: opt.category,
      type: opt.type,
      value: opt.cost,
      condition: 100,
      fuelLevel: 100,
      insurancePaid: true,
      monthlyMaintenance: opt.monthlyMaintenance,
      description: opt.description
    };

    onBuyVehicle(newVeh);
    onAction(`🏎️ Vroom! You purchased "${opt.name}"! The local teenagers stared in awe. Your status has dramatically risen.`, {
      cash: -opt.cost,
      happiness: 25,
      reputation: opt.reputationGain
    });
  };

  const handleJoyrideVehicle = (veh: Vehicle) => {
    if (veh.fuelLevel < 15) {
      onAction(`Your "${veh.name}" is fully out of gas. Fuel up first!`, {});
      return;
    }

    const roll = Math.random();
    let logMsg = "";
    let statsDelta: any = { fuelLevel: -25, condition: -10 };

    if (roll < 0.12) {
      logMsg = `🚨 CRASH & BURN! You lost control of your "${veh.name}" while drifting around a recycling bin and clipped a fire hydrant. The car is dented and you got a steep fine!`;
      statsDelta = {
        ...statsDelta,
        condition: -40,
        cash: -1200,
        health: -15,
        happiness: -25
      };
    } else if (roll < 0.3) {
      logMsg = `🚔 SPEEDING TICKET! You tested the acceleration limit on your "${veh.name}". A cop clocked you going 105 in a 35 zone. You got a hefty fine but felt alive!`;
      statsDelta = {
        ...statsDelta,
        cash: -350,
        happiness: 10,
        reputation: 5
      };
    } else {
      logMsg = `🌅 EXHILARATING JOYRIDE! You took your "${veh.name}" down the highway at sunset, listening to retro vaporwave music. Stress completely wiped!`;
      statsDelta = {
        ...statsDelta,
        happiness: 25,
        stress: -20
      };
    }

    // Update state
    onUpdateVehicle(veh.id, {
      fuelLevel: Math.max(0, veh.fuelLevel - 25),
      condition: Math.max(0, veh.condition + (statsDelta.condition || -10))
    });
    
    // Trigger history action
    onAction(logMsg, {
      cash: statsDelta.cash || 0,
      happiness: statsDelta.happiness || 0,
      reputation: statsDelta.reputation || 0,
      health: statsDelta.health || 0,
      stress: statsDelta.stress || 0
    });
  };

  const handleMaintenanceVehicle = (veh: Vehicle, type: "fuel" | "repair") => {
    if (type === "fuel") {
      const fuelCost = 50;
      if (cash < fuelCost) {
        onAction("Can't even afford a tank of premium fuel.", {});
        return;
      }
      onUpdateVehicle(veh.id, { fuelLevel: 100 });
      onAction(`⛽ Fueled up your "${veh.name}". It's ready to tear up some asphalt.`, { cash: -fuelCost });
    } else {
      const repairCost = Math.round((100 - veh.condition) * (veh.value * 0.003));
      if (cash < repairCost) {
        onAction("You lack the funds to pay the mechanic's hourly rate.", {});
        return;
      }
      onUpdateVehicle(veh.id, { condition: 100 });
      onAction(`🔧 Your mechanic tuned and polished your "${veh.name}". It is now in showroom condition!`, { cash: -repairCost });
    }
  };

  const handleSellVehicleAction = (veh: Vehicle) => {
    const depreciation = 0.5 + Math.random() * 0.4;
    const sellValue = Math.round(veh.value * (veh.condition / 100) * depreciation);
    onSellVehicle(veh.id);
    onAction(`💸 You sold your "${veh.name}" on the secondary market for $${sellValue.toLocaleString()}!`, {
      cash: sellValue,
      happiness: -5
    });
  };

  // --- Businesses Actions ---
  const handleBuyBusinessAction = (opt: typeof BUSINESS_OPTIONS[0]) => {
    if (cash < opt.cost) {
      onAction("You do not have enough capital to acquire this franchise.", {});
      return;
    }

    const newBiz: Business = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${opt.name}`,
      type: opt.type,
      purchaseCost: opt.cost,
      annualRevenue: opt.potentialAnnualRevenue,
      monthlyMaintenance: opt.monthlyMaintenance,
      employeesCount: 2,
      reputation: 60,
      isThriving: true,
      description: opt.description
    };

    onBuyBusiness(newBiz);
    onAction(`💼 ENTERPRISE ACQUIRED! You purchased "${opt.name}" and appointed yourself Grand Executive. Time to manage cash flow!`, {
      cash: -opt.cost,
      happiness: 20,
      reputation: 15
    });
  };

  const handleBusinessCampaign = (biz: Business, campaignType: "hire" | "ads" | "renovate") => {
    if (campaignType === "ads") {
      const adsCost = 1500;
      if (cash < adsCost) {
        onAction("Can't afford billboard advertising campaigns.", {});
        return;
      }
      const success = Math.random() > 0.3;
      const repGain = success ? 20 : -5;
      const revMultiplier = success ? 1.25 : 0.9;
      
      onUpdateBusiness(biz.id, {
        reputation: Math.min(100, biz.reputation + repGain),
        annualRevenue: Math.round(biz.annualRevenue * revMultiplier)
      });
      onAction(
        success
          ? `📢 AD BLITZ! Your advertising campaign went viral. Customers are queueing around the corner to spend money at "${biz.name}"!`
          : `📢 AD FLOP... Your advertising campaign was called 'cringe' on the internet. People are actively making memes about it.`,
        { cash: -adsCost, reputation: success ? 10 : -2 }
      );
    } else if (campaignType === "hire") {
      const recruitCost = 1200;
      if (cash < recruitCost) {
        onAction("Hiring costs money.", {});
        return;
      }
      onUpdateBusiness(biz.id, {
        employeesCount: biz.employeesCount + 1,
        annualRevenue: Math.round(biz.annualRevenue * 1.15)
      });
      onAction(`👔 You hired an assistant manager for "${biz.name}". Efficiency boosted. Passive annual revenue increased by 15%!`, {
        cash: -recruitCost
      });
    } else {
      const upgradeCost = Math.round(biz.purchaseCost * 0.15);
      if (cash < upgradeCost) {
        onAction("Renovating your headquarters requires heavy investment cash.", {});
        return;
      }
      onUpdateBusiness(biz.id, {
        reputation: 100,
        isThriving: true,
        annualRevenue: Math.round(biz.annualRevenue * 1.35)
      });
      onAction(`✨ You renovated your storefront at "${biz.name}" with luxury wood panels and state-of-the-art Espresso bar. The location is now classified as Elite!`, {
        cash: -upgradeCost,
        reputation: 15
      });
    }
  };

  const handleSellBusinessAction = (biz: Business) => {
    const valuation = Math.round(biz.purchaseCost * (biz.isThriving ? 1.4 : 0.5) * (biz.reputation / 100));
    onSellBusiness(biz.id);
    onAction(`💸 You sold the deeds to your business enterprise "${biz.name}" to a private equity firm for $${valuation.toLocaleString()}!`, {
      cash: valuation,
      happiness: 10
    });
  };

  // --- Item Collections Actions ---
  const handleBuyItemAction = (opt: typeof ITEM_OPTIONS[0]) => {
    if (cash < opt.cost) {
      onAction("You don't have enough liquid wealth for this collectible asset.", {});
      return;
    }

    const newItem: PersonalItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: opt.name,
      category: opt.category,
      value: opt.cost,
      condition: 100,
      rarity: opt.rarity,
      emotionalValue: opt.emotionalValue,
      description: opt.description
    };

    onBuyItem(newItem);
    onAction(`💎 COLLECTIBLE UNLOCKED! You bought "${opt.name}". It is now stored inside your personal vault.`, {
      cash: -opt.cost,
      happiness: 10
    });
  };

  const handlePolishItem = (item: PersonalItem) => {
    onAction(`🧼 You spent an hour carefully polishing "${item.name}" with fine microfiber. It shines brilliantly and feels extremely satisfying.`, {
      happiness: 12,
      stress: -10
    });
  };

  const handleSellItemAction = (item: PersonalItem) => {
    const marketAppreciation = item.rarity === "legendary" ? 1.5 : item.rarity === "epic" ? 1.25 : 0.85;
    const finalPrice = Math.round(item.value * marketAppreciation);
    
    onSellItem(item.id);
    onAction(`💸 You listed "${item.name}" on an elite collectors' auction house and hammered it down for $${finalPrice.toLocaleString()}!`, {
      cash: finalPrice,
      happiness: item.emotionalValue > 50 ? -20 : 5 // Emotional items hurt to sell!
    });
  };

  return (
    <div id="property-panel" className="space-y-5 animate-fade-in text-slate-100">
      
      {/* Visual Navigation Tabs for Asset Classes */}
      <div className="grid grid-cols-5 gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-indigo-500/10 shrink-0">
        {[
          { id: "real_estate", label: "Real Estate", icon: <Home className="w-3.5 h-3.5" />, color: "border-pink-500/20" },
          { id: "vehicles", label: "Vehicles", icon: <Car className="w-3.5 h-3.5" />, color: "border-emerald-500/20" },
          { id: "businesses", label: "Businesses", icon: <Briefcase className="w-3.5 h-3.5" />, color: "border-amber-500/20" },
          { id: "collections", label: "Vault", icon: <Gem className="w-3.5 h-3.5" />, color: "border-purple-500/20" },
          { id: "investments", label: "Exchange", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "border-indigo-500/20" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAssetTab(tab.id as any)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
              assetTab === tab.id
                ? "bg-indigo-600 border-indigo-400 text-white shadow-md font-black"
                : `text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40`
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* RENDER VIEWPORT: REAL ESTATE */}
      {assetTab === "real_estate" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">Deeds & Tenancy Hub</h3>
              <p className="text-[10px] text-slate-400">Own residential listings to lease for automated rent checks or move into cozy studios.</p>
            </div>
            
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-indigo-500/15">
              <button
                onClick={() => setRealEstateSubTab("listings")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  realEstateSubTab === "listings" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Catalog
              </button>
              <button
                onClick={() => setRealEstateSubTab("owned")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  realEstateSubTab === "owned" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Portfolio ({properties.length})
              </button>
            </div>
          </div>

          {realEstateSubTab === "listings" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PROPERTY_OPTIONS_EXPANDED.map((opt) => {
                const alreadyRenting = rentedProperty?.propertyType === opt.propertyType;
                const hasProperty = properties.some(p => p.name === opt.name);
                const isMortgage = purchaseMethod[opt.id] === "mortgage";
                const activePrice = isMortgage ? Math.round(opt.cost * 0.2) : opt.cost;
                const canAfford = cash >= activePrice;

                return (
                  <div
                    key={opt.id}
                    className="bg-slate-950/80 border border-indigo-500/10 hover:border-indigo-500/20 p-4 rounded-xl flex flex-col justify-between gap-3.5 transition-all relative overflow-hidden"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-white text-xs uppercase tracking-tight">{opt.name}</h4>
                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          opt.type === "rent" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : "bg-purple-950 text-purple-400 border border-purple-900/30"
                        }`}>
                          {opt.type === "rent" ? "RENTAL" : "ACQUISITION"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">"{opt.description}"</p>
                      
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-900">
                        <div>Location: <span className="text-white">{opt.locationArea}</span></div>
                        {opt.type === "own" && <div>Maint: <span className="text-red-400">${opt.monthlyMaintenance}/yr</span></div>}
                        {opt.type === "own" && <div>Est. Rent: <span className="text-emerald-400">${opt.potentialRent}/yr</span></div>}
                        <div className="text-pink-400 font-extrabold">Happiness: +{opt.happinessModifier}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-900 pt-2.5">
                      {opt.type === "own" && (
                        <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-400 font-bold uppercase pl-1">Payment Method:</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setPurchaseMethod({ ...purchaseMethod, [opt.id]: "cash" })}
                              className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                purchaseMethod[opt.id] !== "mortgage" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              Cash
                            </button>
                            <button
                              onClick={() => setPurchaseMethod({ ...purchaseMethod, [opt.id]: "mortgage" })}
                              className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                purchaseMethod[opt.id] === "mortgage" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              20% Down Mortgage
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider block leading-none">
                            {opt.type === "rent" ? "Monthly rent" : isMortgage ? "Required Down-payment" : "Total Cost"}
                          </span>
                          <span className="text-emerald-400 font-black text-xs font-mono block mt-1">
                            ${activePrice.toLocaleString()} {isMortgage && <span className="text-[8px] text-slate-500 font-mono italic">(Mortgaged)</span>}
                          </span>
                        </div>

                        <button
                          onClick={() => handleBuyPropertyAction(opt)}
                          disabled={alreadyRenting || hasProperty || !canAfford}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                        >
                          {alreadyRenting || hasProperty ? "Already Possessed" : opt.type === "rent" ? "Sign Lease" : "Invest"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-indigo-500/10 font-mono text-[11px] text-slate-400">
                  ⚠️ No real estate assets owned. Go to the Catalog to secure shelter or buy commercial structures.
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map((prop) => (
                    <div key={prop.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start border-b border-slate-900 pb-2.5">
                        <div>
                          <h4 className="font-extrabold text-white text-xs uppercase tracking-tight flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5 text-indigo-400" />
                            {prop.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Type: {prop.propertyType} | Condition: <span className={prop.condition < 40 ? "text-red-400" : "text-emerald-400"}>{prop.condition}%</span> | Area: {prop.locationArea}
                          </p>
                        </div>
                        {prop.type === "own" && (
                          <button
                            onClick={() => handleSellPropertyAction(prop)}
                            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px] px-2.5 py-1.5 rounded uppercase cursor-pointer"
                          >
                            List & Sell
                          </button>
                        )}
                      </div>

                      {/* Renovation Actions */}
                      {prop.type === "own" && (
                        <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                            <Hammer className="w-3 h-3 text-pink-400" />
                            Upgrades & Renovations
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => handleRenovateProperty(prop.id, "repair")}
                              disabled={prop.condition >= 95}
                              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                            >
                              Repaint & Fix Leaks (${Math.round((100 - prop.condition) * (prop.value * 0.001))} / {100 - prop.condition}% repairs)
                            </button>
                            {!prop.hasPool && (
                              <button
                                onClick={() => handleRenovateProperty(prop.id, "pool")}
                                className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                              >
                                Install Infinity Pool ($15,000)
                              </button>
                            )}
                            {!prop.hasGarden && (
                              <button
                                onClick={() => handleRenovateProperty(prop.id, "garden")}
                                className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                              >
                                Landscape Gardens ($4,500)
                              </button>
                            )}
                            {prop.securityLevel < 80 && (
                              <button
                                onClick={() => handleRenovateProperty(prop.id, "security")}
                                className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                              >
                                High-Tech Security Grid ($7,200)
                              </button>
                            )}
                            {!prop.hasSmartTech && (
                              <button
                                onClick={() => handleRenovateProperty(prop.id, "smart")}
                                className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                              >
                                AI Butler Integration ($5,500)
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-900/60 text-[8px] text-indigo-400 font-semibold font-mono uppercase">
                            {prop.hasPool && <span>🏊 Pool Equipped</span>}
                            {prop.hasGarden && <span>🌿 Landscaped Yard</span>}
                            {prop.hasSmartTech && <span>🤖 Smart Tech Active</span>}
                            {prop.securityLevel > 80 && <span>🔒 Fortified Protection ({prop.securityLevel}%)</span>}
                          </div>
                        </div>
                      )}

                      {/* Landlord Tenant Section */}
                      {prop.type === "own" ? (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                            <span className="text-[9px] text-slate-300 font-bold flex items-center gap-1.5 uppercase font-mono">
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                              Active Tenant
                            </span>
                            {prop.tenants.length === 0 && (
                              <button
                                onClick={() => handleAdvertiseTenant(prop.id)}
                                className="text-emerald-400 hover:text-emerald-300 text-[8px] font-black uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <PlusCircle className="w-3 h-3" />
                                Advertise vacancy
                              </button>
                            )}
                          </div>

                          {prop.tenants.length === 0 ? (
                            <p className="text-[10px] text-slate-500 font-mono italic px-2 py-1">
                              Vacant. Advertise to secure a tenant and collect passive rent.
                            </p>
                          ) : (
                            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white text-xs block leading-none">{prop.tenants[0].name}</span>
                                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                                  Occupation: {prop.tenants[0].occupation} | Rent pays: <span className="text-emerald-400 font-bold">${Math.round(prop.value * 0.08 / 12)}/mo</span>
                                </span>
                                <span className="text-[9px] text-slate-500 block italic">"Personality: {prop.tenants[0].personality}"</span>
                              </div>
                              <button
                                onClick={() => handleEvictTenantAction(prop.id, prop.tenants[0])}
                                className="text-rose-400 hover:text-rose-300 text-[9px] font-extrabold flex items-center gap-0.5 cursor-pointer uppercase"
                              >
                                <UserMinus className="w-3 h-3" />
                                Evict
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-400 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 flex items-center justify-between font-mono">
                          <span>Primary Residence</span>
                          <span>Cost: ${prop.monthlyCost}/month</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEWPORT: VEHICLES */}
      {assetTab === "vehicles" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">Showroom & Garage</h3>
              <p className="text-[10px] text-slate-400">Buy sportscars, motorcycles or planes. Take them on joyrides, manage fuel, and buy insurance.</p>
            </div>
            
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-indigo-500/15">
              <button
                onClick={() => setVehicleSubTab("showroom")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  vehicleSubTab === "showroom" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Showroom
              </button>
              <button
                onClick={() => setVehicleSubTab("garage")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  vehicleSubTab === "garage" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Garage ({vehicles.length})
              </button>
            </div>
          </div>

          {vehicleSubTab === "showroom" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {VEHICLE_OPTIONS.map((opt) => {
                const canAfford = cash >= opt.cost;
                return (
                  <div key={opt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 relative overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-white text-xs uppercase">{opt.name}</h4>
                        <span className="text-[8px] bg-slate-900 text-indigo-400 border border-indigo-500/10 px-1.5 py-0.5 rounded uppercase font-black font-mono">
                          {opt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic font-semibold">"{opt.description}"</p>
                      <div className="text-[9px] text-slate-500 font-mono flex gap-3 mt-1.5">
                        <span>Maint: ${opt.monthlyMaintenance}/yr</span>
                        <span className="text-indigo-400">Reputation: +{opt.reputationGain}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Showroom Price</span>
                        <span className="text-emerald-400 font-mono font-black text-xs">${opt.cost.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleBuyVehicleAction(opt)}
                        disabled={!canAfford}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-[9px] px-3 py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Buy Ride
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-indigo-500/10 font-mono text-[11px] text-slate-400">
                  🚲 Your garage is empty. Buy a sputtering scooter or slick supercar to skip city buses.
                </div>
              ) : (
                vehicles.map((veh) => (
                  <div key={veh.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
                    <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                      <div>
                        <h4 className="font-extrabold text-white text-xs uppercase flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-emerald-400" />
                          {veh.name}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">Condition: {veh.condition}% | Fuel: {veh.fuelLevel}%</span>
                      </div>
                      <button
                        onClick={() => handleSellVehicleAction(veh)}
                        className="text-amber-500 hover:text-amber-400 text-[9px] font-extrabold uppercase"
                      >
                        Sell Ride
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-900 text-center text-[10px] font-mono">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block">FUEL STATUS</span>
                        <div className="h-1 bg-slate-950 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${veh.fuelLevel}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block">VEHICLE WEAR</span>
                        <div className="h-1 bg-slate-950 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${veh.condition}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1.5 justify-end">
                      <button
                        onClick={() => handleMaintenanceVehicle(veh, "fuel")}
                        disabled={veh.fuelLevel >= 95}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-[9px] font-bold px-3 py-1.5 rounded uppercase text-slate-200 cursor-pointer"
                      >
                        Fuel up ($50)
                      </button>
                      <button
                        onClick={() => handleMaintenanceVehicle(veh, "repair")}
                        disabled={veh.condition >= 98}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-[9px] font-bold px-3 py-1.5 rounded uppercase text-slate-200 cursor-pointer"
                      >
                        Mechanic Repair (${Math.round((100 - veh.condition) * (veh.value * 0.003))})
                      </button>
                      <button
                        onClick={() => handleJoyrideVehicle(veh)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-[9px] font-black px-4.5 py-1.5 rounded uppercase text-white shadow-md cursor-pointer tracking-wider flex items-center gap-1 animate-pulse"
                      >
                        <Gauge className="w-3 h-3" />
                        Take For Joyride!
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEWPORT: BUSINESSES */}
      {assetTab === "businesses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">Enterprise HQ</h3>
              <p className="text-[10px] text-slate-400">Buy shops, restaurants, or online tech startups. Hire managers, fund marketing, and pocket receipts.</p>
            </div>
            
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-indigo-500/15">
              <button
                onClick={() => setBusinessSubTab("invest")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  businessSubTab === "invest" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Buy Enterprise
              </button>
              <button
                onClick={() => setBusinessSubTab("hq")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  businessSubTab === "hq" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Executive HQ ({businesses.length})
              </button>
            </div>
          </div>

          {businessSubTab === "invest" ? (
            <div className="grid grid-cols-1 gap-3">
              {BUSINESS_OPTIONS.map((opt) => {
                const canAfford = cash >= opt.cost;
                return (
                  <div key={opt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-xs uppercase">{opt.name}</h4>
                        <span className="text-[7px] bg-slate-900 text-amber-400 border border-amber-500/10 px-1.5 py-0.5 rounded font-black font-mono uppercase">
                          {opt.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic font-semibold">"{opt.description}"</p>
                      <div className="text-[9px] text-slate-500 font-mono flex gap-4">
                        <span>Est. Annual Profit: <span className="text-emerald-400 font-bold">${opt.potentialAnnualRevenue.toLocaleString()}</span></span>
                        <span>Maint: ${opt.monthlyMaintenance}/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-900 pt-2 sm:pt-0">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">Investment</span>
                        <span className="text-emerald-400 font-mono font-black text-xs block mt-1">${opt.cost.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleBuyBusinessAction(opt)}
                        disabled={!canAfford}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-[9px] px-3.5 py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Invest
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {businesses.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-indigo-500/10 font-mono text-[11px] text-slate-400">
                  💼 You hold 0 business deeds. Invest in an Espresso Cart or a high-pressure real estate agency!
                </div>
              ) : (
                businesses.map((biz) => (
                  <div key={biz.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
                    <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                      <div>
                        <h4 className="font-extrabold text-white text-xs uppercase flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                          {biz.name}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Employees: {biz.employeesCount} | Corporate Rep: <span className="text-indigo-400 font-bold">{biz.reputation}%</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleSellBusinessAction(biz)}
                        className="text-amber-500 hover:text-amber-400 text-[9px] font-extrabold uppercase"
                      >
                        Liquidate
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-900/30 p-2.5 rounded-lg border border-slate-900 text-[10px] font-mono">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block">ANNUAL PASSIVE NET INFLOW</span>
                        <span className="text-emerald-400 font-bold text-xs block mt-1">${biz.annualRevenue.toLocaleString()}/yr</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block">ENTERPRISE STATE</span>
                        <span className="text-indigo-400 font-black text-xs block mt-1 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />Thriving
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-900">
                      <span className="text-[8px] text-slate-400 font-black uppercase block mb-1.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                        Strategic Executive Actions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleBusinessCampaign(biz, "ads")}
                          className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                        >
                          Run Viral Ad Campaign ($1,500)
                        </button>
                        <button
                          onClick={() => handleBusinessCampaign(biz, "hire")}
                          className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                        >
                          Recruit Top Manager ($1,200)
                        </button>
                        <button
                          onClick={() => handleBusinessCampaign(biz, "renovate")}
                          className="bg-slate-800 hover:bg-slate-700 text-[9px] font-bold px-2 py-1 rounded text-slate-200 cursor-pointer"
                        >
                          Renovate Headquarters (${Math.round(biz.purchaseCost * 0.15)})
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEWPORT: COLLECTIBLE VAULT */}
      {assetTab === "collections" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">Personal Vault</h3>
              <p className="text-[10px] text-slate-400">Store watches, antiques, fine artwork, jewellery and sentimental items. Polish and preserve them.</p>
            </div>
            
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-indigo-500/15">
              <button
                onClick={() => setCollectionSubTab("shop")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  collectionSubTab === "shop" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Acquire Collectibles
              </button>
              <button
                onClick={() => setCollectionSubTab("vault")}
                className={`px-3 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                  collectionSubTab === "vault" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Vault Vault ({personalItems.length})
              </button>
            </div>
          </div>

          {collectionSubTab === "shop" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ITEM_OPTIONS.map((opt) => {
                const canAfford = cash >= opt.cost;
                return (
                  <div key={opt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 relative overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-white text-xs uppercase">{opt.name}</h4>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded uppercase font-mono font-black border ${
                          opt.rarity === "legendary" ? "bg-yellow-950/60 text-yellow-400 border-yellow-500/30 animate-pulse" :
                          opt.rarity === "epic" ? "bg-purple-950/60 text-purple-400 border-purple-500/30" :
                          opt.rarity === "rare" ? "bg-blue-950/60 text-blue-400 border-blue-500/30" : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}>
                          {opt.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic font-semibold">"{opt.description}"</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Auction Price</span>
                        <span className="text-emerald-400 font-mono font-black text-xs">${opt.cost.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleBuyItemAction(opt)}
                        disabled={!canAfford}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-[9px] px-3 py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Acquire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {personalItems.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-indigo-500/10 col-span-2 font-mono text-[11px] text-slate-400">
                  💎 Your vault is bare. Buy crown jewels, antique katanas, or display vintage toys here.
                </div>
              ) : (
                personalItems.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-white text-xs uppercase flex items-center gap-1">
                          <Gem className="w-3.5 h-3.5 text-indigo-400" />
                          {item.name}
                        </h4>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded font-black font-mono border uppercase ${
                          item.rarity === "legendary" ? "bg-yellow-950/60 text-yellow-400 border-yellow-500/30" :
                          item.rarity === "epic" ? "bg-purple-950/60 text-purple-400 border-purple-500/30" :
                          item.rarity === "rare" ? "bg-blue-950/60 text-blue-400 border-blue-500/30" : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}>
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic font-semibold">"{item.description}"</p>
                      
                      <div className="text-[9px] text-slate-500 font-mono pt-1">
                        {item.emotionalValue > 50 ? (
                          <span className="text-pink-400 font-black flex items-center gap-0.5 uppercase tracking-wider">
                            <Heart className="w-3 h-3 text-pink-500 inline fill-pink-500" />
                            Sentimental value: {item.emotionalValue}%
                          </span>
                        ) : (
                          <span>Market Valuation: <span className="text-emerald-400 font-bold">${item.value.toLocaleString()}</span></span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-900/60 justify-end">
                      <button
                        onClick={() => handlePolishItem(item)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold px-2.5 py-1.5 rounded uppercase text-slate-200 cursor-pointer"
                      >
                        Polish Asset
                      </button>
                      <button
                        onClick={() => handleSellItemAction(item)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold px-2.5 py-1.5 rounded uppercase text-rose-400 cursor-pointer"
                      >
                        Sell Collector
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEWPORT: STOCK EXCHANGE */}
      {assetTab === "investments" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">Stock & Turnip Exchange</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Speculate on highly volatile root vegetables or purchase fractions of corporate spreadsheets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { ticker: "TURNIP", name: "Turnip Futures Market", desc: "Extreme volatility. Prices fluctuate wildly based on annual weather whims and agricultural speculation." },
              { ticker: "SSYN", name: "Spreadsheet Synergy Inc.", desc: "Steady corporate enterprise. Tied tightly to office productivity. Highly stable, low stress." },
              { ticker: "CWP", name: "Capybara Wellness Corp.", desc: "High-growth lifestyle company. Offers virtual mud baths. Good potential, medium risk." },
              { ticker: "GOLD", name: "Gold-Plated Staplers ETF", desc: "Safe haven asset. Holds value or even gains when the economy is in a recession or depression." },
              { ticker: "FROG", name: "Frog Meme Crypto Token", desc: "Peer-to-peer frog drawing database. Zero intrinsic value. Absolute market chaos. Pure speculative energy." }
            ].map(({ ticker, name, desc }) => {
              const price = stockPrices[ticker] || 10;
              const owned = investments[ticker] || 0;
              const value = owned * price;

              return (
                <div key={ticker} className="bg-slate-950 p-4 rounded-xl border border-indigo-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/20 transition-all">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-indigo-400 text-sm tracking-wider font-mono">{ticker}</span>
                      <span className="text-[10px] text-slate-300 font-extrabold uppercase">({name})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-semibold">{desc}</p>
                    
                    <div className="flex flex-wrap gap-4 pt-1 text-[10px] text-slate-500 font-mono">
                      <span>Shares Owned: <span className="text-white font-bold">{owned.toLocaleString()}</span></span>
                      <span>Total Value: <span className="text-emerald-400 font-bold">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch md:items-end gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Market Price:</span>
                      <span className="text-white font-extrabold font-mono text-sm bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shadow-inner">
                        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex gap-1.5 w-full">
                      <button
                        onClick={() => onBuyStock(ticker, 1, price)}
                        disabled={cash < price}
                        className="bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-30 border border-indigo-500/20 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-white flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Buy 1
                      </button>
                      <button
                        onClick={() => onBuyStock(ticker, 10, price)}
                        disabled={cash < (price * 10)}
                        className="bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-30 border border-indigo-500/20 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-white flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Buy 10
                      </button>
                      <button
                        onClick={() => {
                          const maxQty = Math.floor(cash / price);
                          if (maxQty > 0) onBuyStock(ticker, maxQty, price);
                        }}
                        disabled={cash < price}
                        className="bg-emerald-600/80 hover:bg-emerald-600 disabled:opacity-30 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-white flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Buy Max
                      </button>
                      <button
                        onClick={() => onSellStock(ticker, 1, price)}
                        disabled={owned < 1}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-rose-400 flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Sell 1
                      </button>
                      <button
                        onClick={() => onSellStock(ticker, 10, price)}
                        disabled={owned < 10}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-rose-400 flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Sell 10
                      </button>
                      <button
                        onClick={() => onSellStock(ticker, owned, price)}
                        disabled={owned <= 0}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded text-rose-500 flex-1 md:flex-none cursor-pointer transition-all active:scale-95"
                      >
                        Sell All
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

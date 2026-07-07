/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEvent } from "../types";

export const EVENTS: GameEvent[] = [
  // ==========================================
  // --- CHILDHOOD EVENTS (Age 0 - 12) ---
  // ==========================================
  {
    id: "child_1",
    title: "The Lego Buffet",
    description: "You are toddler size. You spot a bright, red, juicy-looking plastic block hidden under the sofa. It looks delicious.",
    category: "childhood",
    minAge: 1,
    maxAge: 4,
    chance: 100,
    choices: [
      {
        text: "Eat the spicy plastic berry.",
        statChanges: { health: -15, sanity: -15, happiness: 10 },
        consequenceText: "You swallowed it whole. Your lungs made a squeaky toy sound for three days. Your parents are panicking, but you feel accomplished."
      },
      {
        text: "Build a mock offshore shell company.",
        statChanges: { intelligence: 15, creativity: 10, morality: -5 },
        consequenceText: "You stack the Legos in a shape that hides your animal crackers from the nanny. Your first tax haven is born."
      },
      {
        text: "Scream at it until it moves.",
        statChanges: { charisma: 10, stress: 15, sanity: 5 },
        consequenceText: "You screech at the brick for 45 minutes. It does not move. Your mother records this, ensuring your future wedding video is deeply embarrassing."
      }
    ]
  },
  {
    id: "child_2",
    title: "Sandpit Hostage Crisis",
    description: "A burly kid named Billy is occupying the plastic castle. He demands your sparkly blue bucket or he will throw wet mud at your face.",
    category: "childhood",
    minAge: 4,
    maxAge: 7,
    chance: 80,
    choices: [
      {
        text: "Engage in diplomatic trade (Offer a chewed crayon).",
        statChanges: { charisma: 15, intelligence: 10, luck: 10 },
        consequenceText: "Billy accepts the blue crayon. You negotiated a transition of power. You now rule the sandpit. Everyone has a price."
      },
      {
        text: "Launch a preemptive shovel strike.",
        statChanges: { strength: 15, fitness: 10, morality: -15, reputation: 10 },
        consequenceText: "A clean 'THWACK' rings across the playground. Billy goes crying to his mother. You are placed in time-out, but your authority is absolute."
      },
      {
        text: "Cry and surrender immediately.",
        statChanges: { happiness: -20, sanity: -10, charisma: -10 },
        consequenceText: "You hand over the bucket, cover your face, and weep. Billy kicks your sandcastle. The playground crows laugh at your cowardice."
      }
    ]
  },
  {
    id: "child_3",
    title: "The Great Wall-Art Incident",
    description: "You have acquired a permanent black marker and a pristine, freshly-painted white living room wall. The creative urge is overpowering.",
    category: "childhood",
    minAge: 5,
    maxAge: 9,
    chance: 80,
    choices: [
      {
        text: "Draw an existential masterpiece about taxation.",
        statChanges: { creativity: 20, intelligence: 15, stress: 10 },
        consequenceText: "You paint stick figures crying under a large, dark cloud labeled 'TAX MAN'. Your artist father says it's 'subversive realism'. You are grounded."
      },
      {
        text: "Frame your imaginary friend, 'Garbanzo'.",
        statChanges: { morality: -15, charisma: 15, sanity: -10 },
        consequenceText: "You swear to your tearful parents that Garbanzo the Goblin did it. They exchange worried glances. You avoid punishment but now have a mandatory therapist appointment."
      },
      {
        text: "Eat the marker.",
        statChanges: { health: -20, sanity: -20, intelligence: -10 },
        consequenceText: "You lick the felt tip. Your tongue turns black, your stomach burns, and your mouth smells like industrial solvents. Not your finest moment."
      }
    ]
  },

  // ==========================================
  // --- ADOLESCENCE / TEEN EVENTS (Age 13 - 19) ---
  // ==========================================
  {
    id: "teen_1",
    title: "The Unprepared Exam",
    description: "It is 8:00 AM. You are sitting in the classroom for your Advanced Memetics exam. You realize you spent the entire night watching videos of capybaras bathing instead of studying.",
    category: "general",
    minAge: 13,
    maxAge: 18,
    chance: 90,
    choices: [
      {
        text: "Peep at your genius classmate's paper.",
        statChanges: { intelligence: 10, morality: -15, stress: 15 },
        consequenceText: "You successfully copy 80% of their answers. You pass with flying colors, but you feel a greasy layer of guilt coating your soul."
      },
      {
        text: "Fain a massive, dramatic gastrointestinal distress.",
        statChanges: { charisma: 20, attractiveness: -10, stress: -10 },
        consequenceText: "You clutch your abdomen, scream in agony, and fall out of your chair. The teacher is horrified and sends you to the nurse. You get a make-up test!"
      },
      {
        text: "Accept failure and use the paper as a pillow.",
        statChanges: { happiness: -10, sanity: 15, intelligence: -15 },
        consequenceText: "You draw a sad face on the sheet and take an aggressive 45-minute nap. You score an 8%. But you woke up feeling refreshed and mentally stable."
      }
    ]
  },
  {
    id: "teen_2",
    title: "The First Crush",
    description: "You find yourself standing by the lockers next to the school's most attractive person. They are currently struggling to open a jammed locker door.",
    category: "general",
    minAge: 14,
    maxAge: 19,
    chance: 85,
    choices: [
      {
        text: "Flex your muscles and attempt a brute-force unlock.",
        statChanges: { strength: 15, charisma: -10, attractiveness: -10, health: -5 },
        consequenceText: "You pull with all your might. Your foot slips, your jeans rip at the crotch, and you punch yourself in the chin. The locker remains locked. They walk away slowly."
      },
      {
        text: "Offer a sophisticated, sarcastic critique of school infrastructure.",
        statChanges: { charisma: 20, attractiveness: 15, intelligence: 10 },
        consequenceText: "You lean coolly against the locker and make a hilarious joke about the school budget. They laugh, unlock it together, and give you their social media handle."
      },
      {
        text: "Panic and hiss like an angry goose.",
        statChanges: { sanity: -20, charisma: -20, reputation: -15 },
        consequenceText: "Your brain short-circuits. You open your mouth, release a high-pitched 'HONK' sound, flapping your arms, and sprint out of the corridor. You are now known as the 'Goose Kid'."
      }
    ]
  },

  // ==========================================
  // --- ADULT & ECONOMIC EVENTS (Age 18+) ---
  // ==========================================
  {
    id: "adult_1",
    title: "The Cold-DM Opportunity",
    description: "An old high-school classmate you haven't spoken to in 11 years sends you a message: 'Hey hon! 🌸 Quick question, do you want to become your own CEO, work from your bed, and make $10k a month selling organic charcoal-infused energy wraps?'",
    category: "general",
    minAge: 18,
    maxAge: 60,
    chance: 70,
    choices: [
      {
        text: "Invest your entire savings in 'Tier 1 Ambassador' stock.",
        statChanges: { cash: -2000, intelligence: -20, sanity: -15, stress: 25 },
        consequenceText: "You spend $2,000 on boxes of synthetic dust. Your garage is full. Your friends block your number. You are officially an entrepreneur!"
      },
      {
        text: "Decline and counter-pitch them a fake cult.",
        statChanges: { charisma: 20, happiness: 15, intelligence: 10 },
        consequenceText: "You copy-paste a bizarre script asking if they want to join the 'Order of the Floating Turnip'. They immediately block you. You won the internet."
      },
      {
        text: "Ignore the message and watch television.",
        statChanges: { happiness: 5, stress: -5 },
        consequenceText: "You mark the message as read and eat a handful of cereal directly from the box. A highly productive evening."
      }
    ]
  },
  {
    id: "adult_2",
    title: "The Crypto Meltdown",
    description: "You wake up to find that 'DogeElongateCoin', the highly speculative meme cryptocurrency you bought on a whim, has lost 99.8% of its value in 45 minutes because the founder posted a typo on social media.",
    category: "general",
    minAge: 18,
    maxAge: 50,
    chance: 60,
    choices: [
      {
        text: "Buy the dip! To the moon!",
        statChanges: { cash: -1500, sanity: -25, luck: -15, stress: 30 },
        consequenceText: "You sink another $1,500 into the coin. It immediately drops another 99% and the website goes offline. You now have a digital wallet of dust."
      },
      {
        text: "Panic-sell everything and cry in the shower.",
        statChanges: { cash: -500, happiness: -20, stress: 15, attractiveness: -5 },
        consequenceText: "You salvage $1.24 out of your original investment. You spend two hours weeping under lukewarm water, questioning your life choices."
      },
      {
        text: "Claim you did it 'for the underlying blockchain technology'.",
        statChanges: { charisma: 15, reputation: -10, intelligence: 5 },
        consequenceText: "You write a long, pretentious post on professional media about 'disruptive paradigms' and 'web3 friction'. Nobody believes you, but you saved face."
      }
    ]
  },
  {
    id: "adult_3",
    title: "Unidentified Leftover Dish",
    description: "You return home starving. Deep in your fridge, you discover a plastic tub containing a gray, fuzzy, slightly glowing lump. You aren't sure if it was originally spaghetti or chili, but it is calling your name.",
    category: "general",
    minAge: 18,
    maxAge: 99,
    chance: 75,
    choices: [
      {
        text: "Eat it cold. Survival of the fittest.",
        statChanges: { health: -25, sanity: -15, strength: 5 },
        consequenceText: "It tasted like metallic dust and regret. You spent the night fighting for your life on the bathroom floor. You survived, and your immune system is legendary."
      },
      {
        text: "Microwave it for 10 minutes to kill the bacteria.",
        statChanges: { health: -10, happiness: -10, safety: -5 } as any,
        consequenceText: "The heat makes it smell like burnt rubber. It explodes, coating the microwave in a cement-like glaze. You eat a raw piece of cheese instead."
      },
      {
        text: "Throw it at your neighbor's annoying dog.",
        statChanges: { morality: -20, reputation: -15, luck: -10 },
        consequenceText: "The lump lands in their yard. The dog sniffs it, gains temporary telepathic powers, and spends the night barking in morse code. Your neighbor is furious."
      }
    ]
  },

  // ==========================================
  // --- CAREER-SPECIFIC EVENTS (Age 18+) ---
  // ==========================================
  {
    id: "career_1",
    title: "The Accidental Reply-All",
    description: "You drafted an angry, sarcastic email impersonating your boss's terrible posture and loaded it with hilarious emojis. You intended to send it to your work bestie, but you hit 'REPLY ALL' to the entire company including the Board.",
    category: "career",
    minAge: 18,
    maxAge: 70,
    chance: 65,
    conditions: (state) => state.currentCareer !== null,
    choices: [
      {
        text: "Claim your cat walked across the keyboard.",
        statChanges: { charisma: -10, intelligence: -15, reputation: -20, stress: 35 },
        consequenceText: "Your boss points out that your cat has surprisingly advanced vocabulary, correct paragraph formatting, and styled emoji arrays. You are written up."
      },
      {
        text: "Flee the country immediately and change your identity.",
        statChanges: { cash: -1000, sanity: -20, reputation: 10 },
        consequenceText: "You pack your desk into a grocery bag, sprint to the parking lot, and spend $1,000 on a one-way flight to an island. You are now an expatriate."
      },
      {
        text: "Spin it as an 'edgy corporate team-building experiment'.",
        statChanges: { charisma: 25, reputation: 15, stress: 10, fame: 15 },
        consequenceText: "You present a slide deck explaining that this was a 'Stress-Testing Synergy' workshop. The executives find it 'disruptively brave'. You get a small bonus!"
      }
    ]
  },
  {
    id: "career_2",
    title: "The Boss's Terrible Idea",
    description: "Your supervisor pitched a new initiative: 'Synergy-Infused Water Coolers' where employees must scan their faces and answer a 3-question survey about their company loyalty before they can dispense water. They ask your 'honest feedback'.",
    category: "career",
    minAge: 18,
    maxAge: 70,
    chance: 65,
    conditions: (state) => state.currentCareer !== null,
    choices: [
      {
        text: "Praise it as the greatest invention since the printing press.",
        statChanges: { morality: -15, charisma: 15, stress: 15 },
        consequenceText: "You flatter them relentlessly. They assign you to lead the 'Water Synergy Committee'. You are now hated by your coworkers, but favored by leadership."
      },
      {
        text: "Tell them it's an dystopian, administrative nightmare.",
        statChanges: { reputation: -10, stress: 25, charisma: 5 },
        consequenceText: "Your boss blinks, frowns, and notes that you aren't 'exhibiting a growth-mindset'. Your desk is moved next to the recycling bin."
      },
      {
        text: "Quietly sabotage the cooler's software.",
        statChanges: { intelligence: 15, morality: -10, happiness: 20 },
        consequenceText: "You hack the cooler to play disco music and dispense carbonated coffee on face scans. The office is delighted. Your boss is deeply confused."
      }
    ]
  },

  // ==========================================
  // --- CRIME & LAW EVENTS (Age 15+) ---
  // ==========================================
  {
    id: "crime_1",
    title: "The Sticky Finger Temptation",
    description: "You are visiting a high-end department store. A golden, diamond-encrusted decorative turnip is sitting unguarded on a pedestal. It's worth a fortune and would fit perfectly in your coat.",
    category: "crime",
    minAge: 15,
    maxAge: 80,
    chance: 50,
    choices: [
      {
        text: "Stuff the turnip in your jacket and walk calmly.",
        statChanges: { cash: 1200, morality: -25, luck: -10, reputation: -5 },
        consequenceText: "You bypassed the sensor and successfully strolled out. You sold the golden turnip to a pawn shop for $1,200 cash! Sneaky."
      },
      {
        text: "Try to eat the turnip to hide the evidence.",
        statChanges: { health: -30, sanity: -30, intelligence: -20 },
        consequenceText: "You try to swallow a solid gold turnip. It lodges in your throat. You are rushed to surgery and store security is waiting when you wake up."
      },
      {
        text: "Refrain from stealing and buy a normal turnip.",
        statChanges: { cash: -5, morality: 15, happiness: 10 },
        consequenceText: "You control your impulses, leave, and purchase an organic turnip from the grocery store. It doesn't shine, but you sleep peacefully."
      }
    ]
  },

  // ==========================================
  // --- LATE STAGE & CRISIS EVENTS ---
  // ==========================================
  {
    id: "crisis_1",
    title: "Midlife Crisis: Red Sports Car",
    description: "You hit your 40th birthday. You look in the mirror, see a gray hair, and realize you haven't lived. A glossy, incredibly loud, scarlet sports car is sitting in the local dealership showroom.",
    category: "crisis",
    minAge: 38,
    maxAge: 55,
    chance: 90,
    choices: [
      {
        text: "Buy the car with a high-interest 96-month loan.",
        statChanges: { cash: -12000, attractiveness: 20, stress: 25, sanity: -15 },
        consequenceText: "You drive off the lot revving the engine. It makes you feel 22 again! However, your bank account is crying, and your back hurts from the low seats."
      },
      {
        text: "Buy a sensible, boring silver hatchback instead.",
        statChanges: { cash: -3000, sanity: 15, happiness: -10 },
        consequenceText: "You purchase a hybrid vehicle. It has excellent trunk space and fuel efficiency. It has zero sex appeal, but you feel like a responsible adult."
      },
      {
        text: "Adopt 7 stray ferrets to fill the void.",
        statChanges: { cash: -400, sanity: -20, happiness: 25, attractiveness: -15 },
        consequenceText: "You fill your home with highly energetic, tube-shaped animals. Your house smells like dry grass and musk, but they are your children now."
      }
    ]
  },
  // ==========================================
  // --- CELEBRITY PARODIES & AGE-SPECIFIC EVENTS ---
  // ==========================================
  {
    id: "parody_elizabeth",
    title: "The Sandbox Biotech Deal",
    description: "You are toddler size. A girl in a black turtleneck named Elizabeth Holmes Jr. offers to trade her shiny pebble for your entire lunchbox. She claims one single drop of apple juice on her pebble will diagnose if you have preschool cooties.",
    category: "childhood",
    minAge: 1,
    maxAge: 5,
    chance: 95,
    choices: [
      {
        text: "Trade your lunchbox for the revolutionary pebble.",
        statChanges: { cash: -50, intelligence: -15, sanity: -10, health: -10 },
        consequenceText: "You give away your delicious ham sandwich. You spend three hours licking the pebble to calibrate it. Your throat is sore and you are starving. The c-suite has collapsed."
      },
      {
        text: "Expose her sandbox metrics as fully fraudulent.",
        statChanges: { intelligence: 20, reputation: 15, charisma: 10 },
        consequenceText: "You point out that her pebble is just common gravel from the slide area. The other toddlers gasp. Elizabeth Holmes Jr. is exiled to the swings and you are crowned playground auditor."
      }
    ]
  },
  {
    id: "parody_zuck",
    title: "Swingset Terms of Service",
    description: "A quiet kid named Mark Zukerberg stands in front of the empty swings holding a clipboard. He refuses to let you swing until you verbally agree to his 14-page 'Sandbox swingset Privacy & Meta-Tracking Agreement'.",
    category: "childhood",
    minAge: 6,
    maxAge: 11,
    chance: 95,
    choices: [
      {
        text: "Accept the terms and swing high into the sky.",
        statChanges: { happiness: 15, sanity: -10, reputation: -10 },
        consequenceText: "You swing happily! However, Mark spends the rest of recess shouting your embarrassing kindergarten secrets to the slide monitor. Your local search history has been monetized."
      },
      {
        text: "Throw dirt at his clipboard and assert your privacy rights.",
        statChanges: { strength: 10, morality: 10, stress: 15, reputation: 15 },
        consequenceText: "You kick a cloud of dust onto his sheets. Mark blinks in shock, murmurs something about a 'sandbox shadowban', and flees to the library to write a algorithm about you."
      }
    ]
  },
  {
    id: "parody_tusk_teen",
    title: "The Cardboard Solar go-kart",
    description: "A high schooler named Elon Tusk challenges you to a race down Dead Man's Hill in his custom, solar-powered cardboard go-kart. He promises that if you win, he'll give you 1,000 shares of his rocket-shuttle company.",
    category: "general",
    minAge: 12,
    maxAge: 17,
    chance: 90,
    choices: [
      {
        text: "Hop in your rusty wagon and accept the high-stakes race.",
        statChanges: { fitness: 15, health: -15, stress: 20, luck: 25 },
        consequenceText: "The go-kart loses its left wheel immediately. You crash into a recycling bin at 25 MPH, bruising your tailbone. But Elon says your crash data is invaluable and tweets a meme about you."
      },
      {
        text: "Short-sell his cardboard kart on the school board.",
        statChanges: { intelligence: 20, cash: 100, morality: -5 },
        consequenceText: "You bet three classmates that Elon's kart will implode before the finish line. It explodes in a shower of glue and batteries at second 4. You collect $100 in lunch money. Market genius!"
      }
    ]
  },
  {
    id: "parody_ramsay",
    title: "Roasted by Gorgon Ramsay",
    description: "You enter a local culinary show. The celebrity guest judge is Gorgon Ramsay. He tastes your specialty dish (microwave cheddar toast) and looks at you with bulging eyes, breathing heavily.",
    category: "career",
    minAge: 18,
    maxAge: 45,
    chance: 85,
    choices: [
      {
        text: "Scream back that your toast has dynamic culinary complexity.",
        statChanges: { charisma: 20, stress: 30, sanity: -15, reputation: 15 },
        consequenceText: "You point your spatula at him and yell. Gorgon is so shocked by your audacity that he calls you an 'unhinged genius' on live TV. You go viral! Your stress is through the roof."
      },
      {
        text: "Apologize and call yourself an 'idiot sandwich'.",
        statChanges: { happiness: -25, sanity: -10, reputation: -15, attractiveness: -10 },
        consequenceText: "You place two slices of soggy bread against your own ears and weep. Gorgon sigh and tells you to get out of his sight. Your self-esteem has dissolved into greasy crumbs."
      }
    ]
  },
  {
    id: "parody_shift",
    title: "Taylor Shift Ticket Scramble",
    description: "Pop megastar Taylor Shift is playing in your town! Standard nosebleed ticket prices have reached the price of a small suburban house. A shady alleyway grifter offers you VIP floor tickets in exchange for your entire life savings.",
    category: "general",
    minAge: 16,
    maxAge: 45,
    chance: 85,
    choices: [
      {
        text: "Drain your bank account and buy the shift tickets.",
        statChanges: { cash: -5000, happiness: 35, stress: 25, sanity: -15 },
        consequenceText: "You are totally broke now ($5,000 gone). But you get to breathe the same recycled arena air as Taylor Shift! You sang along to 44 songs, your vocal cords are bleeding, but you are fulfilled."
      },
      {
        text: "Hum her unreleased single loudly to get sued for free publicity.",
        statChanges: { fame: 30, charisma: 15, stress: 20 },
        consequenceText: "Her legal team issues a cease-and-desist within 20 minutes of your social video. You get featured on major news channels as the 'Melody Outlaw'. You didn't get tickets, but you are famous!"
      }
    ]
  },
  {
    id: "parody_pebble",
    title: "Smell What 'The Pebble' Is Baking",
    description: "While lifting modest 5-lb dumbbells at the gym, Dwayne 'The Pebble' Johnson walks up, flexes his massive deltoids until his gym shirt shreds, and raises his eyebrow so high it merges with his hairline. He offers you his brand of volcanic tequila.",
    category: "general",
    minAge: 18,
    maxAge: 55,
    chance: 85,
    choices: [
      {
        text: "Chug the volcanic tequila and attempt a 400lb bench press.",
        statChanges: { strength: 30, health: -15, safety: -20, sanity: -15 } as any,
        consequenceText: "The tequila burns like a molten meteor. You attempt the lift, drop the bar directly onto your collarbone, and get rushed to the clinic. But 'The Pebble' signs your cast and calls you a 'warrior'!"
      },
      {
        text: "Decline and lecture him on joint longevity and recovery sleep.",
        statChanges: { intelligence: 15, charisma: -10, attractiveness: -5 },
        consequenceText: "You explain that high weight is destroying his cartilage. The Pebble looks deeply bored, pats your head, and says: 'Keep eating your oats, little pebble.' Your pride is wounded."
      }
    ]
  },
  {
    id: "parody_leaves",
    title: "The Keanu Leaves Bench Encounter",
    description: "You spot the universally beloved actor Keanu Leaves sitting alone on a rainy park bench eating a simple cheese sandwich. He looks up at you, eyes shimmering with deep, cosmic, soulful tranquility.",
    category: "general",
    minAge: 20,
    maxAge: 70,
    chance: 80,
    choices: [
      {
        text: "Sit silently beside him and pet a stray pigeon.",
        statChanges: { sanity: 30, happiness: 25, stress: -25, morality: 15 },
        consequenceText: "No words are spoken. You sit in absolute silence for 20 minutes, petting a gray pigeon. Keanu smiles warmly, hands you half his sandwich, and says: 'You are breathtaking.' Your soul is healed."
      },
      {
        text: "Beg him to sign your forehead with a permanent marker.",
        statChanges: { charisma: 10, fame: 15, reputation: -10 },
        consequenceText: "He looks slightly embarrassed but politely signs your forehead. You walk around town for three days refusing to wash your face. People think you look insane, but you have the blessed touch."
      }
    ]
  },
  {
    id: "parody_beezos",
    title: "Jeff Beezos Rocket Safari",
    description: "Tech supreme lord Jeff Beezos invites you (now a distinguished senior citizen) to join his suborbital rocket safari to experience 180 seconds of weightlessness. He says it will make your ancient joints feel young again.",
    category: "general",
    minAge: 60,
    maxAge: 90,
    chance: 80,
    choices: [
      {
        text: "Strap into the tubular ship and blast into orbit.",
        statChanges: { cash: -2000, sanity: 20, health: -20, stress: 30 },
        consequenceText: "The g-force makes your teeth rattle out of your gums. You spend the 3 minutes of microgravity vomiting floaty gray blobs of soup. It was an expensive, terrifying, dental disaster."
      },
      {
        text: "Decline and unionize his local packing cardboard folders.",
        statChanges: { morality: 25, reputation: 25, stress: 15 },
        consequenceText: "You organize a massive protest of local boxes in his neighborhood. Jeff Beezos frowns, flies his yacht to a private island, and blacklists you from buying books online. You are a working-class hero!"
      }
    ]
  },
  {
    id: "parody_grates",
    title: "Bill Grates Microwave patch",
    description: "You receive an urgent email chain letter from 'Bill Grates'. He warns you that unless you forward his email to 12 friends in the next hour, he will use your microwave to remotely install a firmware patch on your brain.",
    category: "general",
    minAge: 65,
    maxAge: 100,
    chance: 85,
    choices: [
      {
        text: "Panic and forward the chain mail to everyone you know.",
        statChanges: { sanity: -20, stress: 15, reputation: -15 },
        consequenceText: "You spam your grandchildren and your dentist. Your dentist thinks you have dementia, and your grandchildren block you. But you are confident your brain is patch-free!"
      },
      {
        text: "Wrap your head in tin foil and microwave a potato.",
        statChanges: { sanity: -30, health: -10, intelligence: -15 },
        consequenceText: "You wear a shiny tinfoil crown to block the signal. The potato sparks, setting your kitchen drapes on fire. You are treated for minor smoke inhalation, but the tin crown worked!"
      }
    ]
  },
  {
    id: "startup_1",
    title: "The Sandbox Startup",
    description: "A local dry cleaner goes bankrupt, leaving an empty damp basement full of rusted dryer drums, loose wires, and industrial web routers. The landlord offers you a cheap lease to start an enterprise.",
    category: "career",
    minAge: 18,
    maxAge: 45,
    chance: 90,
    situation: "Dryer drums and industrial routers are begging to be combined into a business.",
    context: "You are looking to leave a permanent mark on the business world.",
    choices: [
      {
        text: "Bootstrap the 'Beanie Spin Protocol' (Beanie Baby & Laundry crypto startup).",
        setFlag: "startup_created",
        statChanges: { cash: -500, intelligence: 10, stress: 15 },
        consequenceText: "You sign the lease and spend $500. Your tech-laundry startup is born! You spend 18 hours a day staring at dry cycles and charts.",
        delayedEffect: {
          id: "beanie_ipo_delay",
          yearsLeft: 3,
          title: "Beanie Spin IPO Judgment Day",
          description: "Remember the laundry-beanie startup you founded in the damp basement? It has successfully achieved viral internet status!",
          statChanges: { cash: 25000, fame: 35, happiness: 20 },
          consequenceText: "Your company goes public on the New York Sock Exchange! Your founders' shares are worth $25,000! You wear a suit made of beanies to the opening bell."
        }
      },
      {
        text: "Reject corporate stress and take a long, luxurious nap.",
        statChanges: { happiness: 10, stress: -15 },
        consequenceText: "You decide against entering the startup hamster wheel. You take a glorious nap and dream of dancing carrots."
      }
    ]
  },
  {
    id: "startup_2",
    title: "The Keyboard Screamer",
    description: "A developer is shivering outside your basement. They have extremely bloodshot eyes, are clutching a mechanical keyboard with grease stains, and are chanting coding spells.",
    category: "career",
    minAge: 18,
    maxAge: 48,
    chance: 90,
    conditions: (state: any) => !!state.decisionFlags?.["startup_created"] && !state.decisionFlags?.["first_employee"],
    situation: "Your servers are catching fire due to Beanie spin popularity and you need an extra developer.",
    context: "Your startup sandbox has reached critical capacity.",
    choices: [
      {
        text: "Hire them in exchange for instant espresso and imaginary shares.",
        setFlag: "first_employee",
        statChanges: { sanity: -10, stress: 10, intelligence: 15 },
        consequenceText: "They write 9,000 lines of code in 3 hours. The Beanie spin algorithm is blazing fast now, but they occasionally screech when they spot a semi-colon in your code."
      },
      {
        text: "Employ a trained chimpanzee named 'Barnaby' to cut payroll.",
        setFlag: "first_employee",
        statChanges: { morality: -15, sanity: -15, charisma: 10 },
        consequenceText: "Barnaby is excellent at clicking buttons but keeps posting pictures of half-eaten bananas on the company's official social account. Users find the authenticity refreshing!"
      }
    ]
  },
  {
    id: "wiring_1",
    title: "The Buzzing Outlet",
    description: "Your living quarters develop a deep, ominous vibration. The main kitchen outlet is glowing electric-blue, making a high-pitched sizzling sound, and smelling like roasted peanut shells.",
    category: "crisis",
    minAge: 18,
    maxAge: 90,
    chance: 80,
    conditions: (state: any) => state.properties && state.properties.length > 0 && !state.decisionFlags?.["wiring_resolved"],
    situation: "A dangerous electrical defect threatens your primary residence.",
    context: "Years of neglect and ignoring electrical codes are catching up to your home.",
    choices: [
      {
        text: "Stuff it full of fresh chewing gum and ignore it.",
        setFlag: "wiring_ignored",
        statChanges: { sanity: -10, stress: 5 },
        consequenceText: "The peanut smell fades, replaced by a refreshing minty scent. Problem solved! Surely nothing bad will come of this.",
        delayedEffect: {
          id: "wiring_fire",
          yearsLeft: 2,
          title: "The Socket Fire Disaster",
          description: "The minty chewing gum you stuffed in the glowing outlet has carbonized and erupted into flames.",
          statChanges: { cash: -4000, health: -20, happiness: -20 },
          consequenceText: "A massive fire has gutted your kitchen! You pay $4,000 for emergency structural repairs and suffer singed eyebrows."
        }
      },
      {
        text: "Hire a premium certified electrician to resolve it.",
        setFlag: "wiring_resolved",
        statChanges: { cash: -400, stress: -10, happiness: 10 },
        consequenceText: "You spend $400. The electrician pulls out four nesting mice, mutters a prayer, and installs a safe, state-of-the-art circuit breaker."
      }
    ]
  },
  {
    id: "delayed_vip_1",
    title: "The Stranded Sovereign",
    description: "An old man wearing a stained velvet cape is shivering on your porch in a torrential downpour. He claims to be the exiled Grand Duke of a microscopic European principality and needs $100 for a premium taxi to his embassy.",
    category: "relationship",
    minAge: 18,
    maxAge: 70,
    chance: 85,
    situation: "A highly suspicious royal figure needs minor financial assistance.",
    context: "A chance encounter with an eccentric traveler during heavy weather.",
    choices: [
      {
        text: "Sigh and hand over $100 of your hard-earned money.",
        setFlag: "helped_grand_duke",
        statChanges: { cash: -100, morality: 20, happiness: 10 },
        consequenceText: "He kisses your hands, leaves a dusty copper turnip token on your desk, and sprints away into a premium cab.",
        delayedEffect: {
          id: "duke_inheritance",
          yearsLeft: 5,
          title: "The Grand Duke's Royal Reward",
          description: "Do you remember the exiled European Duke you lent taxi money to in the rain? He has successfully staged a coup and reclaimed his throne!",
          statChanges: { cash: 12000, reputation: 25, fame: 20 },
          consequenceText: "A golden carriage rolls onto your street. His attorney presents you with a suitcase containing $12,000 and a royal charter knighting you as 'Honorary Lord of the Sandpit'!"
        }
      },
      {
        text: "Hose him off your porch and tell him to get a real job.",
        statChanges: { morality: -20, reputation: -10, sanity: -10 },
        consequenceText: "He looks at you with cold, aristocratic fury, scribbles your face in a leather notebook, and mutters: 'Your lineage is cursed, commoner!'"
      }
    ]
  }
];


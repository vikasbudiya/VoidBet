/* ==========================================================================
   VOIDBET CENTRAL SIMULATED DATABASE & ACTIVE STATE MANAGER (AUDITED & EXPANDED)
   ========================================================================== */

const VOID_DB = {
    // 1. Reactive User Account State
    user: {
        username: "AveryHouse_99",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AveryHouse&backgroundColor=12131a",
        clan: "VOID",
        level: 14,
        xp: 4850,
        xpNextLevel: 10000,
        vipLevel: "Bronze", // Bronze, Silver, Gold, Platinum, Diamond, Elite, Void God
        balances: {
            ETH: 12.45000,
            SOL: 245.82000,
            BTC: 0.34500,
            USDT: 15420.00000,
            BNB: 8.42000,
            DOGE: 14250.00000,
            XRP: 3840.00000
        },
        activeCurrency: "ETH",
        stats: {
            totalWageredUsd: 184500.00,
            betsPlaced: 1482,
            biggestWinUsd: 14200.00,
            clanRank: 12
        },
        betHistory: [
            { id: "TX-9982", game: "Rocket Crash", time: "02:14:10", wager: "0.050", unit: "ETH", multiplier: "2.40x", payout: "0.120", state: "win" },
            { id: "TX-9971", game: "MineGrid", time: "02:10:45", wager: "1.200", unit: "SOL", multiplier: "1.80x", payout: "2.160", state: "win" },
            { id: "TX-9959", game: "Gravity Plinko", time: "02:08:12", wager: "50.000", unit: "USDT", multiplier: "0.50x", payout: "25.000", state: "loss" },
            { id: "TX-9948", game: "LootRush", time: "02:05:00", wager: "0.002", unit: "BTC", multiplier: "0.00x", payout: "0.000", state: "loss" }
        ],
        unlockedSkins: [
            { id: "default", name: "Default Companion", cost: "FREE" },
            { id: "oni", name: "Charcoal Oni", cost: "0.50 ETH" },
            { id: "pharaoh", name: "Golden Pharaoh", cost: "1.20 ETH" },
            { id: "vapor", name: "Dusk Edition", cost: "0.25 ETH" }
        ],
        activeSkin: "default"
    },

    // 2. Casino Games Catalog
    casinoGames: [
        { id: "crash-x", name: "Rocket Crash", category: "Originals", desc: "Cash out before the launch line breaks. Fast rounds with clear multiplier tension.", icon: "🚀", banner: "assets/mascot_rocket_crash.png", multiplier: "Volatile" },
        { id: "plinko-neo", name: "Gravity Plinko", category: "Originals", desc: "Drop a ball, choose your risk, and watch it settle into a payout lane.", icon: "🔵", banner: "assets/mascot_gravity_plinko.png", multiplier: "Variable" },
        { id: "mines-void", name: "MineGrid", category: "Originals", desc: "Reveal safe tiles, build a multiplier, and cash out before finding a mine.", icon: "💎", banner: "assets/mascot_mine_grid.png", multiplier: "Custom" },
        { id: "wheel-chaos", name: "SpinCore", category: "Originals", desc: "A compact wheel with crisp motion, readable sectors, and simple risk.", icon: "🎡", banner: "assets/mascot_spin_core.png", multiplier: "Rewards" },
        { id: "coinflip-pvp", name: "BattleFlip PvP", category: "Originals", desc: "Choose a side and settle a clean double-or-nothing round against a rival.", icon: "🪙", banner: "assets/mascot_battle_flip.png", multiplier: "2.0x Double" },
        { id: "lootbox-rush", name: "LootRush", category: "Originals", desc: "Open a reward crate with measured suspense and a clear payout reveal.", icon: "🎁", banner: "assets/mascot_loot_rush.png", multiplier: "Free Claim" }
    ],

    // 3. Sportsbook Scheduling & Simulated Odds System
    sportsSchedule: [
        {
            id: "sport-v-101",
            sport: "Esports",
            game: "Valorant",
            tournament: "VCT Champions 2026",
            teamA: "Sentinels",
            teamB: "Fnatic",
            scoreA: 11,
            scoreB: 12,
            status: "LIVE",
            minute: "Map 3 - Round 24",
            odds: { w1: 1.85, draw: 12.00, w2: 1.95 },
            stats: { possession: "50-50", attacksA: 45, attacksB: 48 },
            predictions: { winProbA: 48, winProbB: 52, risk: "Medium" }
        },
        {
            id: "sport-c-202",
            sport: "Esports",
            game: "CS2",
            tournament: "PGL Major Copenhagen",
            teamA: "Natus Vincere",
            teamB: "FaZe Clan",
            scoreA: 1,
            scoreB: 0,
            status: "LIVE",
            minute: "Map 2 - Round 6",
            odds: { w1: 1.45, draw: 15.00, w2: 2.75 },
            stats: { possession: "N/A", attacksA: 12, attacksB: 9 },
            predictions: { winProbA: 68, winProbB: 32, risk: "Low Risk" }
        },
        {
            id: "sport-e-203",
            sport: "Esports",
            game: "BGMI",
            tournament: "BGMI Grind Season 5",
            teamA: "GodLike",
            teamB: "Team Soul",
            scoreA: 8, // eliminations
            scoreB: 12,
            status: "LIVE",
            minute: "Match 2 - Zone 5",
            odds: { w1: 1.90, draw: 18.00, w2: 1.80 },
            stats: { possession: "N/A", attacksA: 8, attacksB: 12 },
            predictions: { winProbA: 42, winProbB: 58, risk: "High Return" }
        },
        {
            id: "sport-f-303",
            sport: "Football",
            game: "Soccer",
            tournament: "UEFA Champions League Final",
            teamA: "Real Madrid",
            teamB: "Manchester City",
            scoreA: 2,
            scoreB: 2,
            status: "LIVE",
            minute: "84'",
            odds: { w1: 3.10, draw: 2.10, w2: 2.45 },
            stats: { possession: "42-58", attacksA: 88, attacksB: 145 },
            predictions: { winProbA: 38, winProbB: 62, risk: "High Stakes" }
        },
        {
            id: "sport-u-304",
            sport: "UFC",
            game: "MMA",
            tournament: "UFC 320 Main Card",
            teamA: "Jon Jones",
            teamB: "Stipe Miocic",
            scoreA: 45, // strikes
            scoreB: 28,
            status: "LIVE",
            minute: "Round 2 - 2:45",
            odds: { w1: 1.35, draw: 40.00, w2: 3.20 },
            stats: { possession: "N/A", attacksA: 45, attacksB: 28 },
            predictions: { winProbA: 78, winProbB: 22, risk: "Very Safe" }
        },
        {
            id: "sport-b-404",
            sport: "Basketball",
            game: "NBA",
            tournament: "NBA Finals Game 7",
            teamA: "Boston Celtics",
            teamB: "LA Lakers",
            scoreA: 98,
            scoreB: 99,
            status: "LIVE",
            minute: "4th Qtr - 1:12",
            odds: { w1: 2.20, draw: 22.00, w2: 1.68 },
            stats: { possession: "N/A", attacksA: 98, attacksB: 99 },
            predictions: { winProbA: 45, winProbB: 55, risk: "Medium Risk" }
        },
        {
            id: "sport-k-505",
            sport: "Cricket",
            game: "Cricket",
            tournament: "IPL Playoffs",
            teamA: "Mumbai Indians",
            teamB: "Chennai Super Kings",
            scoreA: 185, // runs
            scoreB: 182, // for wickets
            status: "LIVE",
            minute: "19.2 Overs",
            odds: { w1: 1.55, draw: 30.00, w2: 2.40 },
            stats: { possession: "N/A", attacksA: 185, attacksB: 182 },
            predictions: { winProbA: 60, winProbB: 40, risk: "Low Risk" }
        }
    ],

    // 4. Initial Community Chat Logs
    chatMessages: [
        { username: "VortexWhale", level: 48, clan: "HOUSE", text: "LootRush just landed 20x on 0.5 SOL. Clean reveal.", time: "02:12" },
        { username: "CryptoPixie", level: 8, clan: "ROSE", text: "The cursor glow feels smooth in light mode.", time: "02:13" },
        { username: "RektZ", level: 23, clan: "VOID", text: "Rocket Crash rocket is at 45x wtf is going on, who is still holding?", time: "02:14" },
        { username: "HypeBeast_Crypto", level: 31, clan: "RUSH", text: "Anyone bet CS2 live? Sentinels looking strong on Valorant VCT map 3 right now", time: "02:14" }
    ],

    // 5. Clan leaderboards
    clans: [
        { name: "VOID", tagline: "Embrace the empty void. Win it all.", members: 142, volumeUsd: 1450200.00, xp: 84000 },
        { name: "HOUSE", tagline: "Measured bets. Clean exits.", members: 98, volumeUsd: 980400.00, xp: 52000 },
        { name: "RUSH", tagline: "Fast speed betters. No regrets.", members: 120, volumeUsd: 875000.00, xp: 48000 },
        { name: "PINK", tagline: "Glamour, high stakes, big payouts.", members: 76, volumeUsd: 620000.00, xp: 32000 }
    ],

    // 6. User Level milestones
    levelMilestones: [
        { level: 1, title: "Bronze Initiate", multiplier: "1.0x" },
        { level: 10, title: "Table Regular", multiplier: "1.1x" },
        { level: 20, title: "Sharp Player", multiplier: "1.2x" },
        { level: 50, title: "Void Overlord", multiplier: "1.5x" },
        { level: 100, title: "House Legend", multiplier: "2.0x" }
    ],

    // Simulated players array for active bets ticker
    simulatedUsers: [
        "AstroZero", "BettingBunny", "ZenWhale", "SolSlayer", "WAGMI_Lord", 
        "HypeBeast99", "AlphaRunner", "SlateRunner", "SatoshiKid", "SignalKing",
        "ApexHunter", "DogeFather", "PixelLedger", "DuskRaider", "GigaBrain_Crypto"
    ],
    
    simulatedEmotes: ["🚀", "🔥", "💎", "🥶", "🤑", "👑", "🎯", "🤖"],

    // State Modifiers / Database Logic API
    mutators: {
        // Switch Active Wallet Currency
        setActiveCurrency(currency) {
            if (VOID_DB.user.balances[currency] !== undefined) {
                VOID_DB.user.activeCurrency = currency;
                return true;
            }
            return false;
        },

        // Add crypto funds
        depositFunds(amount, currency) {
            if (VOID_DB.user.balances[currency] !== undefined) {
                VOID_DB.user.balances[currency] += parseFloat(amount);
                // Dispatch update event
                VOID_DB.events.dispatch("balanceUpdated", { balance: VOID_DB.user.balances[currency], currency });
                return true;
            }
            return false;
        },

        // Withdraw funds
        withdrawFunds(amount, currency) {
            amount = parseFloat(amount);
            if (VOID_DB.user.balances[currency] !== undefined && VOID_DB.user.balances[currency] >= amount) {
                VOID_DB.user.balances[currency] -= amount;
                VOID_DB.events.dispatch("balanceUpdated", { balance: VOID_DB.user.balances[currency], currency });
                return true;
            }
            return false;
        },

        // Adjust active balance on wagers/wins
        modifyBalance(amount, action = "sub") {
            const currency = VOID_DB.user.activeCurrency;
            amount = parseFloat(amount);
            if (action === "sub") {
                if (VOID_DB.user.balances[currency] >= amount) {
                    VOID_DB.user.balances[currency] -= amount;
                    VOID_DB.events.dispatch("balanceUpdated", { balance: VOID_DB.user.balances[currency], currency });
                    return true;
                }
                return false;
            } else if (action === "add") {
                VOID_DB.user.balances[currency] += amount;
                VOID_DB.events.dispatch("balanceUpdated", { balance: VOID_DB.user.balances[currency], currency });
                return true;
            }
            return false;
        },

        // Increase level / XP
        addXp(amount) {
            VOID_DB.user.xp += amount;
            if (VOID_DB.user.xp >= VOID_DB.user.xpNextLevel) {
                VOID_DB.user.xp -= VOID_DB.user.xpNextLevel;
                VOID_DB.user.level += 1;
                // Scale XP requirement
                VOID_DB.user.xpNextLevel = Math.floor(VOID_DB.user.xpNextLevel * 1.25);
                
                // VIP Rank Upgrade thresholds
                if (VOID_DB.user.level === 15) VOID_DB.user.vipLevel = "Silver";
                else if (VOID_DB.user.level === 30) VOID_DB.user.vipLevel = "Gold";
                else if (VOID_DB.user.level === 50) VOID_DB.user.vipLevel = "Platinum";
                else if (VOID_DB.user.level === 75) VOID_DB.user.vipLevel = "Diamond";
                else if (VOID_DB.user.level === 100) VOID_DB.user.vipLevel = "Void God";
                
                VOID_DB.events.dispatch("levelUp", { level: VOID_DB.user.level, vip: VOID_DB.user.vipLevel });
            }
            VOID_DB.events.dispatch("xpUpdated", { xp: VOID_DB.user.xp, xpNextLevel: VOID_DB.user.xpNextLevel });
        },

        // Log bet transactions
        logBet(game, wager, multiplier, payout, status) {
            const currency = VOID_DB.user.activeCurrency;
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const newBet = {
                id: "TX-" + Math.floor(1000 + Math.random() * 9000),
                game,
                time: timeStr,
                wager: parseFloat(wager).toFixed(4),
                unit: currency,
                multiplier: parseFloat(multiplier).toFixed(2) + "x",
                payout: parseFloat(payout).toFixed(4),
                state: status
            };
            VOID_DB.user.betHistory.unshift(newBet);
            if (VOID_DB.user.betHistory.length > 25) VOID_DB.user.betHistory.pop();
            
            // Add user stats
            VOID_DB.user.stats.betsPlaced += 1;
            
            // Convert to mock USD volume roughly
            let multiplierRate = 1;
            if (currency === "ETH") multiplierRate = 3400;
            if (currency === "SOL") multiplierRate = 145;
            if (currency === "BTC") multiplierRate = 67000;
            
            VOID_DB.user.stats.totalWageredUsd += parseFloat(wager) * multiplierRate;
            if (status === "win") {
                const profitUsd = (parseFloat(payout) - parseFloat(wager)) * multiplierRate;
                if (profitUsd > VOID_DB.user.stats.biggestWinUsd) {
                    VOID_DB.user.stats.biggestWinUsd = profitUsd;
                }
            }

            VOID_DB.events.dispatch("betLogged", newBet);
        }
    },

    // 7. Mini Event Emitter / Dispatcher for UI Reactive Updates
    events: {
        listeners: {},
        on(event, callback) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(callback);
        },
        dispatch(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(cb => cb(data));
            }
        }
    }
};

/* ==========================================================================
   BACKGROUND CHAT, SPORTS & BETSIMULATORS
   ========================================================================== */

function initializeStateSimulators() {
    // A. Real-time active player wagers simulator (feeds live bet side-panel)
    setInterval(() => {
        const game = VOID_DB.casinoGames[Math.floor(Math.random() * VOID_DB.casinoGames.length)].name;
        const player = VOID_DB.simulatedUsers[Math.floor(Math.random() * VOID_DB.simulatedUsers.length)];
        const multiplier = (Math.random() > 0.45) ? (1.1 + Math.random() * 5).toFixed(2) : "0.00";
        const state = (parseFloat(multiplier) > 0) ? "win" : "loss";
        
        const units = ["ETH", "SOL", "USDT", "BNB", "DOGE", "XRP"];
        const unit = units[Math.floor(Math.random() * units.length)];
        
        let wager = 0.01 + Math.random() * 0.5;
        if (unit === "USDT") wager = 5 + Math.random() * 150;
        if (unit === "SOL") wager = 0.1 + Math.random() * 3;
        if (unit === "DOGE") wager = 50 + Math.random() * 400;
        
        const payout = state === "win" ? (wager * parseFloat(multiplier)) : 0;

        const mockBet = {
            game,
            player,
            multiplier: multiplier + "x",
            payout: payout.toFixed(unit === "USDT" || unit === "DOGE" ? 2 : 4) + " " + unit,
            state
        };

        VOID_DB.events.dispatch("simulatedBetAdded", mockBet);
    }, 2500);

    // B. Real-time community chat message simulators
    const botMessages = [
        "VIP cashback posted cleanly today.",
        "Gravity Plinko feels balanced on medium risk.",
        "Solana odds moved on Sentinels. Nice market timing.",
        "The companion just reminded me to hedge. Sensible advice.",
        "Rocket Crash broke late. Huge round.",
        "Seed verification matched on the first check.",
        "VOID clan is still leading the daily board.",
        "SOL withdrawal cleared almost instantly.",
        "Is the blackjack live table opening soon?",
        "SpinCore animation feels crisp tonight.",
        "LootRush Omega tier just hit 20x.",
        "Keeping most of tonight's action in SOL."
    ];

    setInterval(() => {
        const username = VOID_DB.simulatedUsers[Math.floor(Math.random() * VOID_DB.simulatedUsers.length)];
        const text = botMessages[Math.floor(Math.random() * botMessages.length)];
        const tag = (Math.random() > 0.6) ? VOID_DB.clans[Math.floor(Math.random() * VOID_DB.clans.length)].name : null;
        
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

        const newMsg = {
            username,
            level: Math.floor(5 + Math.random() * 85),
            clan: tag,
            text,
            time: timeStr
        };

        VOID_DB.chatMessages.push(newMsg);
        if (VOID_DB.chatMessages.length > 50) VOID_DB.chatMessages.shift();

        VOID_DB.events.dispatch("simulatedChatAdded", newMsg);
    }, 6000);

    // C. Sports Scoreboard and Real-time Odds simulator
    setInterval(() => {
        // Choose a random live match to mutate
        const liveMatches = VOID_DB.sportsSchedule.filter(m => m.status === "LIVE");
        if (liveMatches.length > 0) {
            const match = liveMatches[Math.floor(Math.random() * liveMatches.length)];
            
            // Randomly update match metrics based on category
            if (match.game === "Valorant" || match.game === "CS2" || match.game === "BGMI") {
                // Round change simulation
                if (Math.random() > 0.7) {
                    if (Math.random() > 0.5) match.scoreA += 1;
                    else match.scoreB += 1;
                    
                    // Increment round text
                    if (match.game === "BGMI") {
                        match.minute = `Match 2 - Zone ${Math.min(8, Math.floor((match.scoreA + match.scoreB)/2) + 1)}`;
                    } else {
                        const currentRound = match.scoreA + match.scoreB;
                        match.minute = `Map 3 - Round ${currentRound}`;
                    }
                    
                    // Recalculate odds slightly
                    match.odds.w1 = parseFloat((1.1 + Math.random() * 2).toFixed(2));
                    match.odds.w2 = parseFloat((1.1 + Math.random() * 2).toFixed(2));
                    
                    VOID_DB.events.dispatch("sportsOddsUpdated", match);
                }
            } else if (match.game === "Soccer") {
                // Score updates or minute progression
                if (Math.random() > 0.85) {
                    if (Math.random() > 0.5) match.scoreA += 1;
                    else match.scoreB += 1;
                }
                
                // Tick minute text
                let minInt = parseInt(match.minute.replace("'", ""));
                if (minInt < 90) {
                    minInt += 1;
                    match.minute = minInt + "'";
                } else {
                    match.minute = "90+3'";
                }
                
                VOID_DB.events.dispatch("sportsOddsUpdated", match);
            } else if (match.game === "NBA") {
                // Fast-paced scores
                match.scoreA += Math.random() > 0.5 ? 2 : 3;
                match.scoreB += Math.random() > 0.5 ? 2 : 3;
                
                VOID_DB.events.dispatch("sportsOddsUpdated", match);
            } else if (match.game === "MMA") {
                // UFC strike ticks
                if (Math.random() > 0.5) {
                    match.scoreA += Math.floor(Math.random() * 4) + 1;
                    match.scoreB += Math.floor(Math.random() * 3) + 1;
                    match.minute = `Round 2 - ${Math.max(0, 5 - Math.floor((match.scoreA + match.scoreB)/15))}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`;
                    
                    VOID_DB.events.dispatch("sportsOddsUpdated", match);
                }
            }
        }
    }, 4000);
}

// Fire simulator systems immediately on script integration
initializeStateSimulators();

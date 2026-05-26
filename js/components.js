/* ==========================================================================
   VOIDBET INTERACTIVE VIEW COMPONENTS & PLAYABLE GAME ENGINES
   ========================================================================== */

// ==========================================================================
// PROCEDURAL AUDIO SYNTHESIZER ENGINE (WEB AUDIO API)
// ==========================================================================
const ARCADE_SYNTH = {
    ctx: null,
    tensionOsc: null,
    tensionGain: null,
    rumbleOsc: null,
    rumbleGain: null,
    noiseNode: null,
    activeNodes: [],

    isMuted() {
        return window._VOIDBET_MUTED === true;
    },

    init() {
        if (this.isMuted()) return;
        if (this.ctx) {
            if (this.ctx.state === "suspended") {
                this.ctx.resume();
            }
            return;
        }
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            if (this.ctx.state === "suspended") {
                this.ctx.resume();
            }
        } catch (e) {
            console.log("AudioContext failed:", e);
        }
    },

    playIgnition() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            
            // Warm sub rumble oscillator
            this.rumbleOsc = this.ctx.createOscillator();
            this.rumbleGain = this.ctx.createGain();
            this.rumbleOsc.type = "sawtooth";
            this.rumbleOsc.frequency.setValueAtTime(32, now);
            this.rumbleOsc.frequency.linearRampToValueAtTime(70, now + 1.8);
            
            // Low-pass filter for heavy combustion rumble
            const filter = this.ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(100, now);
            filter.frequency.exponentialRampToValueAtTime(240, now + 1.8);
            
            // Exhaust noise buffer
            const bufferSize = this.ctx.sampleRate * 2.0;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(180, now);
            
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.005, now);
            noiseGain.gain.linearRampToValueAtTime(0.06, now + 1.5);
            
            this.rumbleGain.gain.setValueAtTime(0.001, now);
            this.rumbleGain.gain.linearRampToValueAtTime(0.35, now + 1.8);
            
            this.rumbleOsc.connect(this.rumbleGain);
            this.rumbleGain.connect(filter);
            filter.connect(this.ctx.destination);
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            
            this.rumbleOsc.start(now);
            noise.start(now);
            
            this.noiseNode = noise;
            this.activeNodes.push(this.rumbleOsc);
            this.activeNodes.push(noise);
        } catch (e) {
            console.log("Ignition play failed:", e);
        }
    },

    setRumblePitch(multiplier) {
        if (!this.rumbleOsc || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const newFreq = Math.min(240, 70 + multiplier * 18);
            this.rumbleOsc.frequency.setValueAtTime(newFreq, now);
        } catch (e) {}
    },

    startTension(multiplier) {
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            if (this.tensionOsc) {
                try { this.tensionOsc.stop(); } catch (e) {}
            }
            
            this.tensionOsc = this.ctx.createOscillator();
            this.tensionGain = this.ctx.createGain();
            
            this.tensionOsc.type = "sine";
            const startFreq = 160 + multiplier * 30;
            this.tensionOsc.frequency.setValueAtTime(startFreq, now);
            
            this.tensionGain.gain.setValueAtTime(0.001, now);
            this.tensionGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
            
            this.tensionOsc.connect(this.tensionGain);
            this.tensionGain.connect(this.ctx.destination);
            
            this.tensionOsc.start(now);
            this.activeNodes.push(this.tensionOsc);
        } catch (e) {
            console.log("Tension start failed:", e);
        }
    },

    updateTension(multiplier) {
        if (!this.tensionOsc || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const newFreq = Math.min(1800, 160 + Math.pow(multiplier, 1.45) * 80);
            this.tensionOsc.frequency.setValueAtTime(newFreq, now);
            
            const newGain = Math.min(0.2, 0.06 + (multiplier * 0.012));
            this.tensionGain.gain.setValueAtTime(newGain, now);
        } catch (e) {}
    },

    stopTensionAndRumble() {
        this.activeNodes.forEach(node => {
            try { node.stop(); } catch (e) {}
        });
        this.activeNodes = [];
        this.rumbleOsc = null;
        this.noiseNode = null;
        this.tensionOsc = null;
    },

    playBoom() {
        this.stopTensionAndRumble();
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            
            // Sub Bass Boom
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = "sawtooth";
            sub.frequency.setValueAtTime(140, now);
            sub.frequency.exponentialRampToValueAtTime(20, now + 0.6);
            
            subGain.gain.setValueAtTime(0.9, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            
            const subFilter = this.ctx.createBiquadFilter();
            subFilter.type = "lowpass";
            subFilter.frequency.setValueAtTime(75, now);
            
            sub.connect(subGain);
            subGain.connect(subFilter);
            subFilter.connect(this.ctx.destination);
            
            // White Noise shockwave blast
            const bufferSize = this.ctx.sampleRate * 1.5;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(400, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.7);
            
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.45, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            
            sub.start(now);
            noise.start(now);
            
            sub.stop(now + 1.1);
            noise.stop(now + 1.6);
        } catch (e) {
            console.log("Boom play failed:", e);
        }
    },

    playWinCheer() {
        this.stopTensionAndRumble();
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord arpeggio
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gainNode = this.ctx.createGain();
                
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);
                osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.45 + idx * 0.05);
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05 + idx * 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.05);
                
                osc.connect(gainNode);
                gainNode.connect(this.ctx.destination);
                
                osc.start(now);
                osc.stop(now + 1.2);
            });
        } catch (e) {
            console.log("Win cheer failed:", e);
        }
    },

    playLossGlitch() {
        this.stopTensionAndRumble();
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(45, now + 0.45);
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(180, now);
            
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0.001, now + 0.45);
            
            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.5);
        } catch (e) {
            console.log("Loss glitch failed:", e);
        }
    },

    playOhYeah() {
        this.stopTensionAndRumble();
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Chiptune vocaloid shouting arpeggio: "OH YEAH!"
            const notes = [
                { f: 260, t: 0.0 },
                { f: 390, t: 0.1 },
                { f: 520, t: 0.2 }
            ];
            notes.forEach(n => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();
                
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(n.f, now + n.t);
                osc.frequency.exponentialRampToValueAtTime(n.f * 1.6, now + n.t + 0.12);
                
                filter.type = "bandpass";
                filter.frequency.setValueAtTime(700, now + n.t);
                filter.frequency.linearRampToValueAtTime(1300, now + n.t + 0.12);
                
                gain.gain.setValueAtTime(0, now + n.t);
                gain.gain.linearRampToValueAtTime(0.22, now + n.t + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.22);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(now + n.t);
                osc.stop(now + n.t + 0.25);
            });
        } catch (e) {}
    },

    playPlinkoPegClick(pitch = 500) {
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(pitch, now);
            osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, now + 0.06);
            
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }
};

const VOID_COMPONENTS = {
    // ==========================================================================
    // 1. DYNAMIC PAGE TEMPLATE RENDERERS
    // ==========================================================================

    // A. HOME VIEWS RENDERER
    home(container) {
        container.innerHTML = `
            <div class="home-hero-container">
                <div class="hero-glow-back"></div>
                <div class="home-hero-layout">
                    <div class="hero-text-block">
                        <div class="hero-tagline"><i class="fa-solid fa-diamond"></i> Premium casino and sportsbook</div>
                        <h1 class="hero-title">VoidBet, refined.</h1>
                        <p class="hero-desc">A polished betting lobby with fast wallet actions, transparent game verification, live markets, and calm product-grade interactions.</p>
                        <div class="hero-cta-row">
                            <a href="#casino" class="btn btn-primary btn-lg"><i class="fa-solid fa-gamepad"></i> Play Casino</a>
                            <a href="#sportsbook" class="btn btn-secondary btn-lg"><i class="fa-solid fa-trophy"></i> Sportsbook</a>
                        </div>
                    </div>
                    <div class="hero-visual-block hidden-mobile" style="position: relative; display: flex; justify-content: center; align-items: center; min-height: 250px; min-width: 250px;">
                        <div class="disney-floating-mascot" style="width: 260px; height: 260px; border-radius: 24px; position: absolute; top: -30px; z-index: 10;"></div>
                    </div>
                </div>
            </div>

            <!-- Global Jackpot Counter Banner -->
            <div class="home-jackpot-banner">
                <div class="jackpot-headline"><i class="fa-solid fa-chart-line-up"></i> House jackpot, live</div>
                <div class="jackpot-counter-big" id="homeJackpotCounter">$2,450,183.42</div>
                <button class="btn btn-success" id="claimRewardBtn"><i class="fa-solid fa-gift"></i> Claim daily reward</button>
            </div>

            <!-- Custom Originals Section -->
            <div class="home-section-header">
                <h2 class="section-headline"><i class="fa-solid fa-crown neon-purple-text"></i> VoidBet Originals</h2>
                <span class="text-muted font-tech">Six playable game formats</span>
            </div>
            
            <div class="home-games-grid" id="originalGamesGrid">
                <!-- Loaded dynamically below -->
            </div>

            <!-- Real-time Live Winners Feed -->
            <div class="home-section-header">
                <h2 class="section-headline"><i class="fa-solid fa-wave-pulse cyan-text"></i> Real-Time Activity Feed</h2>
                <span class="active-pulse"></span>
            </div>
            <div class="glass-panel" style="padding: 20px; overflow-x: auto;">
                <table class="bets-ticker-header" style="width: 100%; display: table; border-bottom: none;">
                    <thead>
                        <tr style="display: table-row; color: var(--text-muted); font-size: 11px;">
                            <th style="text-align: left; padding: 10px;">GAME</th>
                            <th style="text-align: left; padding: 10px;">USER</th>
                            <th style="text-align: left; padding: 10px;">TIME</th>
                            <th style="text-align: right; padding: 10px;">WAGER</th>
                            <th style="text-align: right; padding: 10px;">MULT.</th>
                            <th style="text-align: right; padding: 10px;">PAYOUT</th>
                        </tr>
                    </thead>
                    <tbody id="homeActivityFeedBox">
                        <!-- Loaded dynamically -->
                    </tbody>
                </table>
            </div>
        `;

        // Render game cards
        const originals = VOID_DB.casinoGames.filter(g => g.category === "Originals");
        const grid = container.querySelector("#originalGamesGrid");
        originals.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-lobby-card arcade-card";
            card.innerHTML = `
                <div class="arcade-card-glow"></div>
                <div class="arcade-mascot-container">
                    <img class="arcade-mascot-img float-animation" src="${game.banner}" alt="${game.name}">
                </div>
                <div class="game-card-overlay">
                    <div class="card-play-icon"><i class="fa-solid fa-gamepad"></i></div>
                    <h3 class="card-game-title">${game.name}</h3>
                    <p class="card-game-desc">${game.desc}</p>
                    <span class="card-multiplier-badge">${game.multiplier}</span>
                </div>
            `;
            
            // Add 3D rotation transform on mouse hover
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                card.style.transform = `perspective(900px) rotateX(${-dy / 26}deg) rotateY(${dx / 26}deg) translateY(-4px)`;
                const mascot = card.querySelector(".arcade-mascot-img");
                if (mascot) {
                    mascot.style.transform = `translateZ(18px) scale(1.04) rotateY(${dx / 18}deg)`;
                }
                const glow = card.querySelector(".arcade-card-glow");
                if (glow) {
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 154, 78, 0.10) 0%, rgba(0,0,0,0) 70%)`;
                }
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
                const mascot = card.querySelector(".arcade-mascot-img");
                if (mascot) {
                    mascot.style.transform = "";
                }
                const glow = card.querySelector(".arcade-card-glow");
                if (glow) {
                    glow.style.background = "";
                }
            });

            card.addEventListener("click", () => {
                window.location.hash = `#casino/${game.id}`;
            });
            grid.appendChild(card);
        });

        // Initialize Activity feed list with 5 simulated bet rows
        const feedBody = container.querySelector("#homeActivityFeedBox");
        for (let i = 0; i < 5; i++) {
            feedBody.appendChild(createFeedRow());
        }

        // Live jackpot ticking timer
        let jackpot = 2450183.42;
        const jackpotNode = container.querySelector("#homeJackpotCounter");
        const jackpotInterval = setInterval(() => {
            if (!container.contains(jackpotNode)) {
                clearInterval(jackpotInterval);
                return;
            }
            jackpot += 0.05 + Math.random() * 0.15;
            jackpotNode.textContent = "$" + jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }, 100);

        // Daily Reward click
        container.querySelector("#claimRewardBtn").addEventListener("click", () => {
            openLootboxCelebration();
        });
    },

    // B. CASINO CATALOG VIEWS RENDERER
    casino(container, subRoute = "") {
        if (subRoute) {
            // Render specific original game
            this.renderGameFrame(container, subRoute);
            return;
        }

        container.innerHTML = `
            <div class="home-section-header">
                <h1 class="section-headline"><i class="fa-solid fa-gamepad neon-purple-text"></i> Casino</h1>
                <div class="sports-nav-tabs">
                    <button class="sport-pill-btn active" data-cat="all">All Games</button>
                    <button class="sport-pill-btn" data-cat="Originals">Originals</button>
                    <button class="sport-pill-btn" data-cat="Live Casino">Live tables</button>
                </div>
            </div>

            <div class="home-games-grid" id="casinoFullGrid" style="margin-top: 20px;">
                <!-- Loaded dynamically -->
            </div>
        `;

        const grid = container.querySelector("#casinoFullGrid");
        const tabs = container.querySelectorAll(".sport-pill-btn");

        const renderFiltered = (category) => {
            grid.innerHTML = "";
            const filtered = category === "all" ? VOID_DB.casinoGames : VOID_DB.casinoGames.filter(g => g.category === category);
            filtered.forEach(game => {
                const card = document.createElement("div");
                card.className = "game-lobby-card arcade-card";
                card.innerHTML = `
                    <div class="arcade-card-glow"></div>
                    <div class="arcade-mascot-container">
                        <img class="arcade-mascot-img float-animation" src="${game.banner}" alt="${game.name}">
                    </div>
                    <div class="game-card-overlay">
                        <div class="card-play-icon"><i class="fa-solid fa-gamepad"></i></div>
                        <h3 class="card-game-title">${game.name}</h3>
                        <p class="card-game-desc">${game.desc}</p>
                        <span class="card-multiplier-badge">${game.multiplier}</span>
                    </div>
                `;
                
                // Add 3D rotation transform on mouse hover
                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xc = rect.width / 2;
                    const yc = rect.height / 2;
                    const dx = x - xc;
                    const dy = y - yc;
                    card.style.transform = `perspective(900px) rotateX(${-dy / 26}deg) rotateY(${dx / 26}deg) translateY(-4px)`;
                    const mascot = card.querySelector(".arcade-mascot-img");
                    if (mascot) {
                        mascot.style.transform = `translateZ(18px) scale(1.04) rotateY(${dx / 18}deg)`;
                    }
                    const glow = card.querySelector(".arcade-card-glow");
                    if (glow) {
                        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 154, 78, 0.10) 0%, rgba(0,0,0,0) 70%)`;
                    }
                });
                card.addEventListener("mouseleave", () => {
                    card.style.transform = "";
                    const mascot = card.querySelector(".arcade-mascot-img");
                    if (mascot) {
                        mascot.style.transform = "";
                    }
                    const glow = card.querySelector(".arcade-card-glow");
                    if (glow) {
                        glow.style.background = "";
                    }
                });

                card.addEventListener("click", () => {
                    window.location.hash = `#casino/${game.id}`;
                });
                grid.appendChild(card);
            });
        };

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                renderFiltered(tab.dataset.cat);
            });
        });

        renderFiltered("all");
    },

    // ==========================================================================
    // 2. THE 5 CLIENT-SIDE PHYSICS GAME ENGINES
    // ==========================================================================

    renderGameFrame(container, gameId) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <a href="#casino" class="btn btn-secondary btn-sm"><i class="fa-solid fa-chevron-left"></i> Back to Lobby</a>
                <h1 class="section-headline" id="gameHeadlineTitle">Play Game</h1>
                <button class="btn btn-secondary btn-sm" id="gameVerifyPFBtn"><i class="fa-solid fa-shield-halved"></i> Fairness Verification</button>
            </div>
            
            <div class="game-play-layout">
                <!-- Betting Bet Slip Control sidebar -->
                <div class="game-control-panel glass-panel">
                    <div class="input-group">
                        <div class="input-label-row">
                            <label class="input-label">BET AMOUNT</label>
                            <span class="text-muted" style="font-size: 10px;">Active Balance: <span id="gamePanelBalanceVal">12.450</span> ETH</span>
                        </div>
                        <div class="amount-input-box">
                            <input type="number" step="any" class="cyber-input" id="gameWagerInput" value="0.010">
                            <button class="amount-max-btn" id="gameWagerHalfBtn">½</button>
                            <button class="amount-max-btn" id="gameWagerDoubleBtn">2x</button>
                            <button class="amount-max-btn" id="gameWagerMaxBtn">MAX</button>
                        </div>
                    </div>
                    
                    <!-- Game specific parameters placeholder -->
                    <div id="gameParamsPlaceholder"></div>

                    <button class="btn btn-primary btn-bet-trigger btn-full" id="gameActionTriggerBtn">PLACE BET</button>
                </div>

                <!-- Visual Interactive canvas viewport window -->
                <div class="game-viewport-frame glass-panel" id="gameViewportFrame">
                    <!-- Specific canvas/grid injected by engine -->
                </div>
            </div>
        `;

        // Sync Balance text dynamically
        const syncBalance = () => {
            const node = container.querySelector("#gamePanelBalanceVal");
            if (!node) return;
            const cur = VOID_DB.user.activeCurrency;
            node.textContent = VOID_DB.user.balances[cur].toFixed(4) + " " + cur;
        };
        syncBalance();
        VOID_DB.events.on("balanceUpdated", syncBalance);

        // Half/Double/Max control wagers
        const wagerInput = container.querySelector("#gameWagerInput");
        container.querySelector("#gameWagerHalfBtn").addEventListener("click", () => { wagerInput.value = (parseFloat(wagerInput.value) / 2).toFixed(4); });
        container.querySelector("#gameWagerDoubleBtn").addEventListener("click", () => { wagerInput.value = (parseFloat(wagerInput.value) * 2).toFixed(4); });
        container.querySelector("#gameWagerMaxBtn").addEventListener("click", () => {
            const cur = VOID_DB.user.activeCurrency;
            wagerInput.value = VOID_DB.user.balances[cur].toFixed(4);
        });

        // Event for Provably Fair verifier
        container.querySelector("#gameVerifyPFBtn").addEventListener("click", () => {
            openProvablyFairModal();
        });

        // Initialize specific engine
        if (gameId === "crash-x") this.initCrashEngine(container);
        else if (gameId === "plinko-neo") this.initPlinkoEngine(container);
        else if (gameId === "mines-void") this.initMinesEngine(container);
        else if (gameId === "lootbox-rush") this.initLootboxRushEngine(container);
        else if (gameId === "wheel-chaos") this.initWheelEngine(container);
        else if (gameId === "coinflip-pvp") this.initCoinflipEngine(container);
    },

    // A. ROCKET CRASH GAME ENGINE — FULLY AUTONOMOUS AUTO-LOOPING
    initCrashEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-shuttle-space pink-text"></i> Rocket Crash`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">AUTO CASHOUT MULTIPLIER</label>
                <input type="number" step="0.1" class="cyber-input" id="crashAutoCashInput" value="2.0" placeholder="E.g. 2.00">
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `
            <canvas id="crashCanvas" width="800" height="500"></canvas>
            <div class="crash-live-indicator">
                <div class="crash-multiplier-display" id="crashLiveMult">STARTING...</div>
                <div class="text-muted" style="font-size:11px;font-weight:700;letter-spacing:0.15em;" id="crashLiveSub">GAME LOADING...</div>
            </div>
            <div id="crashCountdownOverlay" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:12;pointer-events:none;">
                <div id="crashCountdownNum" style="font-family:'Space Grotesk',sans-serif;font-size:72px;font-weight:700;color:#8b958f;text-shadow:0 0 30px rgba(139,149,143,0.6),0 0 60px rgba(139,149,143,0.3);display:none;"></div>
                <div id="crashCountdownLabel" style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;color:rgba(255,255,255,0.5);margin-top:8px;display:none;">PLACE YOUR BETS</div>
            </div>
            <div id="crashBotFeed" style="position:absolute;bottom:12px;left:12px;right:12px;display:flex;flex-wrap:wrap;gap:6px;z-index:10;max-height:90px;overflow:hidden;"></div>
        `;

        // === DOM REFS ===
        const canvas = viewFrame.querySelector("#crashCanvas");
        const ctx = canvas.getContext("2d");
        const multDisplay = viewFrame.querySelector("#crashLiveMult");
        const subDisplay = viewFrame.querySelector("#crashLiveSub");
        const countdownNumEl = viewFrame.querySelector("#crashCountdownNum");
        const countdownLabelEl = viewFrame.querySelector("#crashCountdownLabel");
        const botFeedEl = viewFrame.querySelector("#crashBotFeed");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");

        // === STATE ===
        let phase = "idle";       // idle → countdown → flying → crashed → (repeat)
        let mult = 1.00;
        let crashAt = 2.00;
        let flyFrames = 0;
        let countSec = 10;
        let countInterval = null;
        let round = 0;
        let dead = false;
        let animId = null;
        let shake = 0;
        let tick = 0;

        // Player
        let pBet = false;
        let pWager = 0;
        let pAutoCash = 2.0;
        let pCashed = false;

        // Bots
        const BNAMES = ["CryptoKing_99","SlateRider","SolWhale","VoidHunter","SignalFox","DiamondHands","MoonBot_X","PhantomBet","TableSage","RocketPilot","AlphaDegen","ZenMaster"];
        let bots = [];

        // Visuals
        let trails = [];
        let explosionParts = [];
        let debris = [];
        for (let i = 0; i < 12; i++) {
            debris.push({
                x: Math.random() * 800, y: Math.random() * 500,
                r: 5 + Math.random() * 15, sp: 0.5 + Math.random() * 1.5,
                rot: Math.random() * 6.28, rs: 0.01 + Math.random() * 0.02,
                col: i % 2 === 0 ? "rgba(139,149,143,0.2)" : "rgba(201,154,78,0.15)"
            });
        }

        // === HELPERS ===
        const pickCrash = () => {
            const r = Math.random();
            if (r < 0.03) return 1.00;
            if (r < 0.10) return 1.01 + Math.random() * 0.3;
            if (r < 0.45) return 1.3 + Math.random() * 1.5;
            if (r < 0.75) return 2.0 + Math.random() * 3.0;
            if (r < 0.92) return 4.0 + Math.random() * 5.0;
            return 8.0 + Math.random() * 15.0;
        };

        const makeBots = () => {
            bots = [];
            const n = 5 + Math.floor(Math.random() * 6);
            const shuffled = [...BNAMES].sort(() => Math.random() - 0.5);
            for (let i = 0; i < n; i++) {
                bots.push({
                    name: shuffled[i % shuffled.length],
                    bet: +(0.005 + Math.random() * 0.15).toFixed(4),
                    cashAt: 1.1 + Math.random() * 6,
                    out: false, won: false
                });
            }
        };

        const drawBots = () => {
            botFeedEl.innerHTML = "";
            bots.forEach(b => {
                const d = document.createElement("div");
                d.style.cssText = "display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:6px;font-size:10px;font-family:'Space Grotesk',sans-serif;font-weight:600;letter-spacing:0.05em;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.06);";
                if (b.out && b.won) {
                    d.style.background = "rgba(127,160,106,0.15)"; d.style.color = "#7fa06a";
                    d.innerHTML = `🤑 ${b.name} <span style="font-weight:700">${b.cashAt.toFixed(2)}x</span> +${(b.bet * b.cashAt).toFixed(4)}`;
                } else if (phase === "crashed" && !b.out) {
                    d.style.background = "rgba(184,102,85,0.15)"; d.style.color = "#b86655";
                    d.innerHTML = `💀 ${b.name} <span style="opacity:0.6">-${b.bet.toFixed(4)}</span>`;
                } else {
                    d.style.background = "rgba(255,255,255,0.04)"; d.style.color = "rgba(255,255,255,0.6)";
                    d.innerHTML = `🎮 ${b.name} <span style="opacity:0.4">${b.bet.toFixed(4)} ETH</span>`;
                }
                botFeedEl.appendChild(d);
            });
        };

        const doBotCashouts = () => {
            bots.forEach(b => {
                if (!b.out && mult >= b.cashAt) {
                    b.out = true; b.won = true;
                    drawBots();
                }
            });
        };

        const spawnExplosion = (x, y) => {
            explosionParts = [];
            for (let i = 0; i < 120; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 18;
                explosionParts.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: 2 + Math.random() * 10,
                    col: ["#b86655","#c99a4e","#d8a64f","#8b958f","#b86655","#ffffff"][i % 6],
                    life: 1.0,
                    decay: 0.01 + Math.random() * 0.02
                });
            }
        };

        // === PHASE TRANSITIONS ===
        const goCountdown = () => {
            if (dead) return;
            phase = "countdown";
            round++;
            countSec = 10;
            mult = 1.00;
            flyFrames = 0;
            trails = [];
            explosionParts = [];
            pCashed = false;
            shake = 0;
            crashAt = pickCrash();
            makeBots();
            drawBots();

            multDisplay.className = "crash-multiplier-display";
            multDisplay.style.color = ""; multDisplay.style.textShadow = ""; multDisplay.style.fontSize = "";
            multDisplay.textContent = "NEXT ROUND";
            subDisplay.textContent = `ROUND #${round} — PLACE YOUR BETS`;
            subDisplay.style.color = "#8b958f";
            countdownNumEl.style.display = "block";
            countdownLabelEl.style.display = "block";
            countdownNumEl.textContent = countSec + "s";
            countdownNumEl.style.color = "#8b958f";
            countdownNumEl.style.textShadow = "0 0 30px rgba(139,149,143,0.6),0 0 60px rgba(139,149,143,0.3)";

            if (!pBet) {
                actionBtn.textContent = "⚡ PLACE BET";
                actionBtn.className = "btn btn-primary btn-bet-trigger btn-full";
                actionBtn.disabled = false;
            }

            clearInterval(countInterval);
            countInterval = setInterval(() => {
                if (dead) { clearInterval(countInterval); return; }
                countSec--;
                if (countSec <= 0) {
                    clearInterval(countInterval);
                    goFly();
                } else {
                    countdownNumEl.textContent = countSec + "s";
                    if (countSec <= 3) {
                        countdownNumEl.style.color = "#b86655";
                        countdownNumEl.style.textShadow = "0 0 40px rgba(184,102,85,0.8)";
                    }
                }
            }, 1000);
        };

        const goFly = () => {
            if (dead) return;
            phase = "flying";
            flyFrames = 0;
            mult = 1.00;
            countdownNumEl.style.display = "none";
            countdownLabelEl.style.display = "none";

            multDisplay.textContent = "1.00x";
            multDisplay.className = "crash-multiplier-display";
            multDisplay.style.color = ""; multDisplay.style.textShadow = "";
            subDisplay.textContent = "🚀 ROCKET IGNITION — FLY TO THE MOON";
            subDisplay.style.color = "#8b958f";

            try { ARCADE_SYNTH.playIgnition(); } catch(e){}
            try { ARCADE_SYNTH.startTension(1.0); } catch(e){}

            if (pBet && !pCashed) {
                actionBtn.textContent = "💰 CASH OUT";
                actionBtn.className = "btn btn-danger btn-bet-trigger btn-full pulse-glow-btn";
                actionBtn.disabled = false;
            } else {
                actionBtn.textContent = "WATCHING...";
                actionBtn.className = "btn btn-secondary btn-bet-trigger btn-full";
                actionBtn.disabled = true;
            }
        };

        const goCrash = () => {
            if (dead) return;
            phase = "crashed";

            const progress = Math.min(flyFrames / 300, 1.0);
            const rx = 120 + progress * (canvas.width - 280);
            const ry = (canvas.height - 120) - progress * (canvas.height - 240);
            spawnExplosion(rx, ry);
            shake = 30;

            // BOOM SOUND
            try { ARCADE_SYNTH.playBoom(); } catch(e){}
            // Loss sound after short delay
            setTimeout(() => { try { ARCADE_SYNTH.playLossGlitch(); } catch(e){} }, 500);

            // Player lost?
            if (pBet && !pCashed) {
                try { VOID_DB.mutators.logBet("Rocket Crash", pWager, 0, 0, "loss"); } catch(e){}
                try { showToast(`💥 Crashed at ${crashAt.toFixed(2)}x! Lost ${pWager.toFixed(4)} ETH`, "error"); } catch(e){}
                pBet = false;
                try { triggerMascotReaction("scared", `BOOM! Crashed at ${crashAt.toFixed(2)}x! 🥶💥`); } catch(e){}
            }

            bots.forEach(b => { if (!b.out) b.out = true; });
            drawBots();

            multDisplay.className = "crash-multiplier-display crashed";
            multDisplay.textContent = "CRASHED!";
            multDisplay.style.fontSize = "48px";
            multDisplay.style.color = "#b86655";
            multDisplay.style.textShadow = "0 0 40px rgba(184,102,85,0.7)";
            subDisplay.textContent = `💥 EXPLODED AT ${crashAt.toFixed(2)}x`;
            subDisplay.style.color = "#b86655";
            actionBtn.textContent = "NEXT ROUND STARTING...";
            actionBtn.className = "btn btn-secondary btn-bet-trigger btn-full";
            actionBtn.disabled = true;

            try { ARCADE_SYNTH.stopTensionAndRumble(); } catch(e){}

            // Auto restart after 3 seconds
            setTimeout(() => {
                if (!dead) goCountdown();
            }, 3000);
        };

        // === PLAYER ACTIONS ===
        const playerBet = () => {
            if (phase !== "countdown") return;
            const w = parseFloat(container.querySelector("#gameWagerInput").value);
            const ac = container.querySelector("#crashAutoCashInput");
            pAutoCash = ac ? parseFloat(ac.value) : 2.0;
            if (isNaN(w) || w <= 0) { try { showToast("Enter a valid bet amount!", "error"); } catch(e){} return; }
            const cur = VOID_DB.user.activeCurrency;
            if (w > VOID_DB.user.balances[cur]) { try { showToast("Insufficient balance!", "error"); } catch(e){} return; }
            VOID_DB.user.balances[cur] -= w;
            try { VOID_DB.events.dispatch("balanceUpdated"); } catch(e){}
            pWager = w;
            pBet = true;
            pCashed = false;
            actionBtn.textContent = `BET PLACED ✓ (${w.toFixed(4)} ETH)`;
            actionBtn.className = "btn btn-primary btn-bet-trigger btn-full";
            actionBtn.disabled = true;
            try { showToast(`🎰 Bet placed: ${w.toFixed(4)} ETH | Auto cashout: ${pAutoCash.toFixed(2)}x`, "success"); } catch(e){}
        };

        const playerCash = () => {
            if (phase !== "flying" || !pBet || pCashed) return;
            pCashed = true;
            const winnings = pWager * mult;
            const cur = VOID_DB.user.activeCurrency;
            VOID_DB.user.balances[cur] += winnings;
            try { VOID_DB.events.dispatch("balanceUpdated"); } catch(e){}
            try { VOID_DB.mutators.logBet("Rocket Crash", pWager, winnings, mult, "win"); } catch(e){}

            if (mult >= 3.0) {
                try { ARCADE_SYNTH.playOhYeah(); } catch(e){}
            } else {
                try { ARCADE_SYNTH.playWinCheer(); } catch(e){}
            }

            try { showToast(`💰 CASHED OUT at ${mult.toFixed(2)}x! Won ${winnings.toFixed(4)} ETH!`, "success"); } catch(e){}
            try { triggerMascotReaction("excited", `YESSS! ${mult.toFixed(2)}x cash out! 🎉🤑`); } catch(e){}

            actionBtn.textContent = `✅ WON ${winnings.toFixed(4)} ETH`;
            actionBtn.className = "btn btn-primary btn-bet-trigger btn-full";
            actionBtn.disabled = true;
            pBet = false;
        };

        // === BUTTON CLICK ===
        actionBtn.addEventListener("click", () => {
            if (phase === "countdown" && !pBet) {
                playerBet();
            } else if (phase === "flying" && pBet && !pCashed) {
                playerCash();
            }
        });

        // === CANVAS SIZING ===
        // Use fixed buffer dimensions. CSS handles display stretching to fill viewport.
        canvas.width = 800;
        canvas.height = 500;

        // === MAIN RENDER LOOP ===
        const render = () => {
            if (dead) {
                return;
            }
            tick++;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // === DARK SPACE BACKGROUND FILL ===
            ctx.fillStyle = "#08090d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Screen shake
            let sx = 0, sy = 0;
            if (shake > 0) {
                sx = (Math.random() - 0.5) * shake;
                sy = (Math.random() - 0.5) * shake;
                shake *= 0.92;
            } else if (phase === "flying") {
                const rumble = Math.min(5, (mult - 1.0) * 0.8);
                sx = (Math.random() - 0.5) * rumble;
                sy = (Math.random() - 0.5) * rumble;
            }
            ctx.save();
            ctx.translate(sx, sy);

            // === STARS ===
            for (let i = 0; i < 80; i++) {
                const starX = (Math.sin(i * 123.4 + i * 0.7) * 0.5 + 0.5) * canvas.width;
                const starY = ((i * 19) % canvas.height + (phase === "flying" ? flyFrames * (1.5 + mult * 2) * 0.5 : tick * 0.3)) % canvas.height;
                const bright = 0.2 + Math.sin(tick * 0.02 + i) * 0.15;
                ctx.fillStyle = `rgba(255,255,255,${bright})`;
                const sz = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
                ctx.fillRect(starX, starY, sz, sz);
            }

            // Space debris
            debris.forEach(d => {
                d.y = (d.y + d.sp * (phase === "flying" ? 1 + mult * 2 : 0.5)) % canvas.height;
                d.rot += d.rs;
                ctx.save();
                ctx.translate(d.x, d.y);
                ctx.rotate(d.rot);
                ctx.fillStyle = d.col;
                ctx.fillRect(-d.r / 2, -d.r / 2, d.r, d.r);
                ctx.restore();
            });

            // Nebula glow during flight
            if (mult >= 2.0 && phase === "flying") {
                const g = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.3, 10, canvas.width * 0.7, canvas.height * 0.3, 200);
                g.addColorStop(0, `rgba(201,154,78,${0.08 + Math.sin(tick * 0.03) * 0.04})`);
                g.addColorStop(0.5, "rgba(139,149,143,0.04)");
                g.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // === ROCKET POSITION ===
            const launchX = 100;
            const launchY = canvas.height - 80;

            let rocketX, rocketY;
            if (phase === "flying" || phase === "crashed") {
                // Curved flight path (exponential curve upward)
                const t = Math.min(flyFrames / 400, 1.0);
                rocketX = launchX + t * (canvas.width - 200);
                rocketY = launchY - Math.pow(t, 0.7) * (canvas.height - 120);
            } else {
                rocketX = launchX;
                rocketY = launchY;
            }

            // === FLYING LOGIC ===
            if (phase === "flying") {
                flyFrames++;
                mult = Math.pow(Math.E, flyFrames * 0.005);
                multDisplay.textContent = mult.toFixed(2) + "x";

                if (mult >= 5.0) {
                    multDisplay.style.color = "#b86655";
                    multDisplay.style.textShadow = "0 0 30px rgba(184,102,85,0.6)";
                } else if (mult >= 2.0) {
                    multDisplay.style.color = "#7fa06a";
                    multDisplay.style.textShadow = "0 0 20px rgba(127,160,106,0.4)";
                } else {
                    multDisplay.style.color = "#8b958f";
                    multDisplay.style.textShadow = "0 0 15px rgba(139,149,143,0.4)";
                }

                try { ARCADE_SYNTH.setRumblePitch(mult); } catch(e){}
                try { ARCADE_SYNTH.updateTension(mult); } catch(e){}

                // Thruster fire trails
                if (flyFrames % 2 === 0) {
                    for (let t = 0; t < 4; t++) {
                        trails.push({
                            x: rocketX + (Math.random() - 0.5) * 14,
                            y: rocketY + 20 + Math.random() * 10,
                            r: 8 + Math.random() * 14,
                            vx: (Math.random() - 0.5) * 4,
                            vy: 2 + Math.random() * 4,
                            life: 1.0,
                            col: t === 0 ? "rgba(255,200,0,0.9)" : t === 1 ? "rgba(184,102,85,0.7)" : t === 2 ? "rgba(201,154,78,0.5)" : "rgba(255,120,0,0.6)"
                        });
                    }
                }

                // Bot cashouts
                doBotCashouts();

                // Player auto cashout
                if (pBet && !pCashed && mult >= pAutoCash) {
                    playerCash();
                }

                // CRASH CHECK
                if (mult >= crashAt) {
                    goCrash();
                }
            }

            // === DRAW FIRE TRAILS ===
            trails.forEach(t => {
                t.x += t.vx; t.y += t.vy; t.life -= 0.025;
                if (t.life > 0) {
                    ctx.save();
                    ctx.globalAlpha = t.life;
                    ctx.beginPath(); ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2);
                    ctx.fillStyle = t.col; ctx.shadowColor = t.col; ctx.shadowBlur = 15;
                    ctx.fill(); ctx.restore();
                }
            });
            trails = trails.filter(t => t.life > 0);

            // === FLIGHT PATH LINE ===
            if (phase === "flying") {
                ctx.save();
                ctx.strokeStyle = "rgba(139,149,143,0.3)";
                ctx.lineWidth = 2;
                ctx.setLineDash([8, 6]);
                ctx.beginPath();
                ctx.moveTo(launchX, launchY);
                // Draw curved path
                for (let step = 0; step <= Math.min(flyFrames / 400, 1.0); step += 0.02) {
                    const px = launchX + step * (canvas.width - 200);
                    const py = launchY - Math.pow(step, 0.7) * (canvas.height - 120);
                    ctx.lineTo(px, py);
                }
                ctx.stroke();
                ctx.restore();
            }

            // === LAUNCH PAD ===
            if (phase === "countdown" || phase === "idle") {
                ctx.save();
                // Ground platform
                ctx.fillStyle = "rgba(139,149,143,0.15)";
                ctx.fillRect(launchX - 30, launchY + 25, 60, 6);
                ctx.fillRect(launchX - 20, launchY + 18, 40, 8);
                // Launch tower
                ctx.fillStyle = "rgba(139,149,143,0.08)";
                ctx.fillRect(launchX + 28, launchY - 40, 4, 65);
                ctx.fillRect(launchX + 24, launchY - 45, 12, 6);
                ctx.restore();
            }

            // === DRAW ROCKET (visible in countdown, flying) ===
            if (phase === "countdown" || phase === "flying") {
                ctx.save();
                ctx.translate(rocketX, rocketY);

                // Rotation: pointing up during countdown, angled during flight
                const angle = phase === "flying" ? -0.5 - Math.min(flyFrames * 0.001, 0.3) : 0;
                ctx.rotate(angle);

                // === OUTER GLOW ===
                ctx.shadowColor = phase === "flying" ? "#b86655" : "#8b958f";
                ctx.shadowBlur = phase === "flying" ? 30 + Math.sin(tick * 0.15) * 15 : 20;

                // === ROCKET BODY (bigger) ===
                const bodyGrad = ctx.createLinearGradient(0, -35, 0, 25);
                bodyGrad.addColorStop(0, "#ffffff");
                bodyGrad.addColorStop(0.3, "#e0e5f0");
                bodyGrad.addColorStop(1, "#b0b8cc");
                ctx.fillStyle = bodyGrad;
                ctx.beginPath();
                ctx.moveTo(0, -35);      // Nose tip
                ctx.lineTo(-14, 20);     // Left base
                ctx.lineTo(14, 20);      // Right base
                ctx.closePath();
                ctx.fill();

                // === NOSE CONE ===
                const noseGrad = ctx.createLinearGradient(0, -35, 0, -10);
                noseGrad.addColorStop(0, "#b86655");
                noseGrad.addColorStop(1, "#c99a4e");
                ctx.fillStyle = noseGrad;
                ctx.beginPath();
                ctx.moveTo(0, -35);
                ctx.lineTo(-8, -10);
                ctx.lineTo(8, -10);
                ctx.closePath();
                ctx.fill();

                // === FINS ===
                ctx.fillStyle = "#8b958f";
                ctx.beginPath(); ctx.moveTo(-14, 20); ctx.lineTo(-24, 30); ctx.lineTo(-10, 12); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(14, 20); ctx.lineTo(24, 30); ctx.lineTo(10, 12); ctx.closePath(); ctx.fill();

                // === WINDOW ===
                ctx.fillStyle = "#8b958f";
                ctx.shadowColor = "#8b958f"; ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                // === STRIPE ===
                ctx.fillStyle = "#b86655";
                ctx.fillRect(-10, 8, 20, 3);

                // === ENGINE FIRE (during flight) ===
                if (phase === "flying") {
                    for (let f = 0; f < 7; f++) {
                        const flameLen = 20 + Math.random() * 30 + mult * 4;
                        const flameW = 4 + Math.random() * 7;
                        const colors = ["rgba(255,200,0,0.9)", "rgba(255,120,0,0.8)", "rgba(184,102,85,0.6)", "rgba(201,154,78,0.4)", "rgba(255,255,200,0.7)"];
                        ctx.fillStyle = colors[f % colors.length];
                        ctx.beginPath();
                        ctx.moveTo(-flameW + (Math.random() - 0.5) * 6, 20);
                        ctx.lineTo(flameW + (Math.random() - 0.5) * 6, 20);
                        ctx.lineTo((Math.random() - 0.5) * 8, 20 + flameLen);
                        ctx.closePath();
                        ctx.fill();
                    }
                }

                ctx.restore();
            }

            // === EXPLOSION PARTICLES ===
            if (phase === "crashed") {
                explosionParts.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                    p.vx *= 0.97; p.vy *= 0.97;
                    if (p.life > 0) {
                        ctx.save();
                        ctx.globalAlpha = p.life;
                        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
                        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 18;
                        ctx.fill(); ctx.restore();
                    }
                });
                explosionParts = explosionParts.filter(p => p.life > 0);

                // Crash flash text on canvas
                ctx.save();
                ctx.font = "bold 42px 'Space Grotesk', sans-serif";
                ctx.fillStyle = "#b86655";
                ctx.shadowColor = "#b86655"; ctx.shadowBlur = 30;
                ctx.textAlign = "center";
                ctx.fillText("💥 BOOM!", canvas.width / 2, canvas.height / 2 - 20);
                ctx.font = "bold 22px 'Space Grotesk', sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.shadowBlur = 0;
                ctx.fillText(`Crashed at ${crashAt.toFixed(2)}x`, canvas.width / 2, canvas.height / 2 + 20);
                ctx.restore();
            }

            // === DEBUG STATE TEXT (top-left corner) ===
            ctx.save();
            ctx.font = "bold 12px 'Space Grotesk', monospace";
            ctx.fillStyle = "rgba(139,149,143,0.5)";
            ctx.textAlign = "left";
            ctx.fillText(`Phase: ${phase} | Round: ${round} | Mult: ${mult.toFixed(2)}x | Crash@: ${crashAt.toFixed(2)}x`, 10, 18);
            ctx.restore();

            ctx.restore(); // end shake transform

            animId = requestAnimationFrame(render);
        };

        // === START ===
        render();

        // Auto-start first round after 1.5 seconds
        setTimeout(() => {
            if (!dead) goCountdown();
        }, 1500);

        // Cleanup on navigation — use a unique ID to detect when THIS game's container is gone
        const crashGameId = "crash_" + Date.now() + "_" + Math.random();
        canvas.dataset.crashId = crashGameId;
        const cleanupCheck = setInterval(() => {
            // If our canvas is no longer in the DOM, the user navigated away
            if (!document.querySelector(`[data-crash-id="${crashGameId}"]`)) {
                dead = true;
                clearInterval(cleanupCheck);
                clearInterval(countInterval);
                if (animId) cancelAnimationFrame(animId);
                try { ARCADE_SYNTH.stopTensionAndRumble(); } catch(e){}
            }
        }, 500);
    },

    // B. GRAVITY PLINKO PHYSICS ENGINE
    initPlinkoEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-circle-dot cyan-text"></i> Gravity Plinko`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">RISK LEVEL</label>
                <select class="cyber-select" id="plinkoRiskSelect">
                    <option value="low">Low Risk</option>
                    <option value="medium" selected>Medium Risk</option>
                    <option value="high">High Risk</option>
                </select>
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `<canvas id="plinkoCanvas" width="800" height="500"></canvas>`;

        const canvas = viewFrame.querySelector("#plinkoCanvas");
        const ctx = canvas.getContext("2d");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");

        // Set up peg mechanics
        const rows = 8;
        const pegs = [];
        const startY = 80;
        const spacing = 38;

        for (let r = 2; r <= rows + 1; r++) {
            const y = startY + r * spacing;
            const startX = canvas.width / 2 - (r * spacing) / 2;
            for (let c = 0; c <= r; c++) {
                pegs.push({
                    x: startX + c * spacing,
                    y: y,
                    radius: 3.5,
                    impactGlow: 0
                });
            }
        }

        // Target multiplier bins
        const coefs = {
            low: [5.0, 1.8, 1.2, 0.7, 0.4, 0.7, 1.2, 1.8, 5.0],
            medium: [12.0, 3.0, 1.5, 0.8, 0.2, 0.8, 1.5, 3.0, 12.0],
            high: [28.0, 8.0, 2.0, 0.5, 0.0, 0.5, 2.0, 8.0, 28.0]
        };

        const binCount = rows + 1;
        const bins = [];
        const binWidth = spacing;
        const binY = startY + (rows + 2) * spacing;
        const binStartX = canvas.width / 2 - (binCount * binWidth) / 2;

        for (let i = 0; i < binCount; i++) {
            bins.push({
                x: binStartX + i * binWidth,
                y: binY,
                width: binWidth,
                height: 24,
                index: i
            });
        }

        let spheres = [];
        let particles = [];
        const gravity = 0.22;

        const animateLoop = () => {
            if (!container.contains(canvas)) {
                return;
            }
            const riskSelect = container.querySelector("#plinkoRiskSelect");
            if (!riskSelect) return;
            const selectedRisk = riskSelect.value;
            const currentCoefs = coefs[selectedRisk];

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw peg boards with quiet impact rings.
            pegs.forEach(peg => {
                // Draw gravitational orbital field ring
                ctx.save();
                ctx.beginPath();
                ctx.arc(peg.x, peg.y, 14, 0, Math.PI * 2);
                ctx.strokeStyle = peg.impactGlow > 0 ? `rgba(139, 149, 143, ${peg.impactGlow * 0.4})` : "rgba(139, 149, 143, 0.07)";
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 4]); // orbital dashes
                ctx.stroke();
                ctx.restore();

                ctx.beginPath();
                ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
                ctx.fillStyle = peg.impactGlow > 0 ? `rgba(127, 160, 106, ${peg.impactGlow})` : "rgba(139, 149, 143, 0.45)";
                ctx.fill();

                if (peg.impactGlow > 0) {
                    // Draw ripple ring
                    ctx.beginPath();
                    ctx.arc(peg.x, peg.y, peg.radius + peg.impactGlow * 15, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(127, 160, 106, ${1.0 - peg.impactGlow})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    peg.impactGlow -= 0.04;
                }
            });

            // Draw multiplier bins

            bins.forEach(bin => {
                const mult = currentCoefs[bin.index];
                
                // Color ramp based on multiplier tier
                let col = "#c99a4e";
                if (mult >= 5.0) col = "#b86655";
                else if (mult >= 1.5) col = "#8b958f";
                else if (mult < 0.6) col = "#555870";

                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(bin.x + 2, bin.y, bin.width - 4, bin.height, 4);
                ctx.fill();
                ctx.stroke();

                // Draw multiplier text
                ctx.fillStyle = "#fff";
                ctx.font = "bold 9px 'Space Grotesk'";
                ctx.textAlign = "center";
                ctx.fillText(mult + "x", bin.x + bin.width / 2, bin.y + 15);
            });

            // Update sphere bodies
            spheres.forEach(ball => {
                ball.y += ball.vy;
                ball.x += ball.vx;
                ball.vy += gravity;

                // Peg collision checklist
                pegs.forEach(peg => {
                    const dx = ball.x - peg.x;
                    const dy = ball.y - peg.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = ball.radius + peg.radius;

                    if (dist < minDist) {
                        // Elastic bounce reflection
                        const overlap = minDist - dist;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        ball.x += nx * overlap;
                        ball.y += ny * overlap;

                        // Reflected velocities
                        const dot = ball.vx * nx + ball.vy * ny;
                        ball.vx = (ball.vx - 2 * dot * nx) * 0.55;
                        ball.vy = (ball.vy - 2 * dot * ny) * 0.55;

                        // Add small lateral variance to prevent straight lines
                        ball.vx += (Math.random() - 0.5) * 0.45;
                        
                        peg.impactGlow = 1.0;

                        // Spawn collision trailing spark particles
                        for (let i = 0; i < 5; i++) {
                            particles.push({
                                x: peg.x,
                                y: peg.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                radius: 1 + Math.random() * 2,
                                color: ball.color,
                                life: 1.0,
                                decay: 0.04 + Math.random() * 0.04
                            });
                        }

                        // Play organic physical retro click
                        if (ARCADE_SYNTH.playPlinkoPegClick) {
                            ARCADE_SYNTH.playPlinkoPegClick(350 + Math.random() * 400);
                        }
                    }
                });

                // Draw sphere
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.shadowColor = ball.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0; // reset

                // Landed in bin checklist
                if (ball.y >= binY) {
                    const matchedBin = bins.find(b => ball.x >= b.x && ball.x <= b.x + b.width);
                    if (matchedBin) {
                        const finalMult = currentCoefs[matchedBin.index];
                        settlePlinkoBall(ball.wager, finalMult, matchedBin.x + matchedBin.width/2, matchedBin.y);
                    }
                    ball.dead = true;
                }
            });
            spheres = spheres.filter(b => !b.dead);

            // Draw impact spark particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95; // drag
                p.vy *= 0.95;
                p.life -= p.decay || 0.05;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color ? p.color : `rgba(127, 160, 106, ${p.life})`;
                ctx.fill();
            });
            particles = particles.filter(p => p.life > 0);

            requestAnimationFrame(animateLoop);
        };
        animateLoop();

        const settlePlinkoBall = (ballWager, mult, px, py) => {
            // Trigger visual hit sparks
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: px, y: py,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 1) * 4,
                    radius: 1.5 + Math.random() * 2,
                    life: 1.0
                });
            }

            const winVal = ballWager * mult;
            const state = mult >= 1.0 ? "win" : "loss";
            VOID_DB.mutators.modifyBalance(winVal, "add");
            VOID_DB.mutators.logBet("Gravity Plinko", ballWager, mult, winVal, state);

            if (mult >= 5.0) {
                showToast(`Hit ${mult}x Mega Win!`, "success");
                triggerMascotReaction("happy", `Boom! Landed in ${mult}x bin! 🤑`);
            } else if (mult < 0.5) {
                triggerMascotReaction("scared", "Yikes, 0.2x bin. Drop another sphere!");
            }
        };

        actionBtn.addEventListener("click", () => {
            const wagerVal = parseFloat(container.querySelector("#gameWagerInput").value);
            if (VOID_DB.mutators.modifyBalance(wagerVal, "sub")) {
                // Drop new sphere
                const colors = ["#7fa06a", "#8b958f", "#c99a4e", "#b86655"];
                spheres.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * 10,
                    y: startY,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: 1,
                    radius: 7,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    wager: wagerVal,
                    dead: false
                });

                triggerMascotReaction("happy", "Sphere dropped, follow the bounce! 🔵");
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        });
    },

    // C. MINES VOID GAME ENGINE
    initMinesEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-gem electric-green-text"></i> MineGrid`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">MINES QUANTITY</label>
                <input type="number" min="1" max="24" class="cyber-input" id="minesCountInput" value="3">
            </div>
            <div class="input-group" style="margin-top:10px;">
                <div class="input-label-row">
                    <label class="input-label">CURRENT ACCUMULATED MULTIPLIER</label>
                    <span class="electric-green-text font-tech" id="minesAccumMultText">1.00x</span>
                </div>
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `
            <div class="mines-split-layout">
                <!-- Chibi Mole Miner Panel -->
                <div class="mole-miner-panel">
                    <div class="mole-miner-mascot-box">
                        <img src="assets/mascot_mine_grid.png" id="moleMinerImg" class="mole-miner-img float-animation" alt="Mole Miner">
                        <div class="mole-miner-bubble" id="moleMinerBubble">G'day partner! Let's mine some glowing crystals! Watch out for reactor traps!</div>
                    </div>
                </div>
                <!-- Mines Matrix Grid -->
                <div class="mines-matrix-container" id="minesGridPanel"></div>
            </div>
        `;

        const gridPanel = viewFrame.querySelector("#minesGridPanel");
        const countInput = container.querySelector("#minesCountInput");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");
        const accumText = container.querySelector("#minesAccumMultText");

        let state = "idle"; // idle, playing
        let wager = 0.01;
        let mineRatio = 3;
        let selectedCount = 0;
        let calculatedMultiplier = 1.00;
        
        let minePlacements = [];
        let revealedTiles = [];

        const calculateNextPayout = () => {
            // Standard probability odds payout formula
            // multiplier = combo(25 - mineCount, selectedCount) / combo(25, selectedCount)
            let numer = 1;
            let denom = 1;
            for (let i = 0; i < selectedCount; i++) {
                numer *= (25 - mineRatio - i);
                denom *= (25 - i);
            }
            const winProb = numer / denom;
            const rawPayout = 0.99 / winProb; // 1% house edge
            return Math.max(rawPayout, 1.00);
        };

        const renderGrid = () => {
            gridPanel.innerHTML = "";
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement("div");
                cell.className = "mine-tile";
                cell.dataset.index = i;
                cell.innerHTML = `<i class="fa-solid fa-cube text-muted" style="font-size:12px;"></i>`;
                
                cell.addEventListener("click", () => {
                    if (state === "playing" && !revealedTiles.includes(i)) {
                        revealTile(cell, i);
                    }
                });
                
                gridPanel.appendChild(cell);
            }
        };
        renderGrid();

        const triggerGameStart = () => {
            wager = parseFloat(container.querySelector("#gameWagerInput").value);
            mineRatio = parseInt(countInput.value) || 3;

            if (mineRatio < 1 || mineRatio > 24) {
                showToast("Mine ratio must be between 1 and 24!", "error");
                return;
            }

            if (VOID_DB.mutators.modifyBalance(wager, "sub")) {
                state = "playing";
                selectedCount = 0;
                calculatedMultiplier = 1.00;
                revealedTiles = [];
                accumText.textContent = "1.00x";
                
                // Shuffle mines
                minePlacements = Array(25).fill(false);
                let placed = 0;
                while (placed < mineRatio) {
                    const idx = Math.floor(Math.random() * 25);
                    if (!minePlacements[idx]) {
                        minePlacements[idx] = true;
                        placed++;
                    }
                }

                actionBtn.textContent = "CASH OUT";
                actionBtn.className = "btn btn-danger btn-bet-trigger btn-full";
                countInput.disabled = true;

                renderGrid();
                triggerMascotReaction("gasping", "MineGrid is live. Tread carefully.");
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        };

        const revealTile = (cell, index) => {
            revealedTiles.push(index);
            const minerBubble = container.querySelector("#moleMinerBubble");
            
            // Check if mine hit
            if (minePlacements[index]) {
                cell.className = "mine-tile revealed-mine reactor-failure-tile";
                cell.innerHTML = `<i class="fa-solid fa-explosion"></i>`;
                if (minerBubble) {
                    minerBubble.textContent = "HOLY CORE COLLAPSE! Run for cover!! 🥶💥";
                }
                explodeGrid();
            } else {
                // Successful gem unearth
                selectedCount++;
                calculatedMultiplier = calculateNextPayout();
                accumText.textContent = calculatedMultiplier.toFixed(2) + "x";

                cell.className = "mine-tile revealed-gem glowing-crystal-tile";
                cell.innerHTML = `<i class="fa-solid fa-gem glowing-crystal-icon"></i>`;

                if (minerBubble) {
                    const phrases = [
                        "Clean tile. The multiplier is building.",
                        "Safe reveal. Keep the run steady.",
                        "Good find. The payout is getting warmer.",
                        "Smooth extraction. Cash out when it feels right."
                    ];
                    minerBubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
                }

                // Play custom synthesized sound tone scale
                playMinesScaleTone(selectedCount);

                if (revealedTiles.length === 25 - mineRatio) {
                    // Maximum perfect board unearth!
                    cashOutMines();
                } else {
                    triggerMascotReaction("happy", "Nice! A digital gem, multiplier grows! 💎");
                }
            }
        };

        const explodeGrid = () => {
            state = "idle";
            VOID_DB.mutators.logBet("MineGrid", wager, 0, 0, "loss");

            // Play massive synthesized core explosion and low-frequency drop
            ARCADE_SYNTH.playBoom();
            setTimeout(() => {
                ARCADE_SYNTH.playLossGlitch();
            }, 600);

            // Screen shake on grid layout
            const layout = container.querySelector(".mines-split-layout");
            if (layout) {
                layout.classList.add("reactor-blast-shake");
                setTimeout(() => {
                    layout.classList.remove("reactor-blast-shake");
                }, 750);
            }

            actionBtn.textContent = "PLACE BET";
            actionBtn.className = "btn btn-primary btn-bet-trigger btn-full";
            countInput.disabled = false;

            // Reveal all elements
            const cells = gridPanel.querySelectorAll(".mine-tile");
            cells.forEach((c, i) => {
                if (minePlacements[i]) {
                    c.className = "mine-tile revealed-mine reactor-failure-tile";
                    c.innerHTML = `<i class="fa-solid fa-burst"></i>`;
                }
            });

            triggerMascotReaction("scared", "Hit a hidden void! Better luck next grid sweep... 🥶");
        };

        const cashOutMines = () => {
            state = "idle";
            const winVal = wager * calculatedMultiplier;
            VOID_DB.mutators.modifyBalance(winVal, "add");
            VOID_DB.mutators.logBet("MineGrid", wager, calculatedMultiplier, winVal, "win");

            // Play chiptune wins
            if (calculatedMultiplier >= 2.0) {
                ARCADE_SYNTH.playOhYeah();
                if (window.startJackpotCoinRain) {
                    window.startJackpotCoinRain();
                }
            } else {
                ARCADE_SYNTH.playWinCheer();
            }

            actionBtn.textContent = "PLACE BET";
            actionBtn.className = "btn btn-primary btn-bet-trigger btn-full";
            countInput.disabled = false;
            
            showToast(`Cashed out ${calculatedMultiplier.toFixed(2)}x!`, "success");
            triggerMascotReaction("happy", `Secured ${calculatedMultiplier.toFixed(2)}x payout! Legendary grid sweep! 🤑`);

            // Highlight gem tiles green
            renderGrid();
            accumText.textContent = "1.00x";
        };

        actionBtn.addEventListener("click", () => {
            if (state === "idle") {
                triggerGameStart();
            } else if (state === "playing") {
                if (selectedCount > 0) {
                    cashOutMines();
                } else {
                    showToast("Must reveal at least one tile to cash out!", "error");
                }
            }
        });
    },

    // D. LOOTRUSH GAME ENGINE
    initLootboxRushEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-box-open neon-pink-text"></i> LootRush`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">CRATE TIER</label>
                <select class="cyber-select" id="lootboxTierSelect">
                    <option value="standard">Standard Crate (1.0x - 5.0x)</option>
                    <option value="mega">Omega Mimic Crate (0.0x - 20.0x)</option>
                </select>
            </div>
            <div class="ai-analytics-card" style="margin-top:12px;">
                <h4 style="margin-bottom:6px;"><i class="fa-solid fa-microchip"></i> DETECTOR REPORT</h4>
                <div class="input-label-row text-muted" style="font-size:10px;">
                    <span>Trap Chance: 12.5%</span>
                    <span>Variance: Active</span>
                </div>
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `
            <canvas id="lootboxCanvas" width="800" height="500"></canvas>
            <div class="lootbox-outcome-overlay" id="lootboxOutcomeBox" style="display:none;">
                <div class="lootbox-reward-title" id="lootboxRewardVal">5.00x</div>
                <div class="text-muted" style="font-size: 11px; font-weight:700; letter-spacing:0.15em;" id="lootboxRewardSub">REWARD COLLECTED</div>
            </div>
        `;

        const canvas = viewFrame.querySelector("#lootboxCanvas");
        const ctx = canvas.getContext("2d");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");
        const outcomeBox = viewFrame.querySelector("#lootboxOutcomeBox");
        const rewardVal = viewFrame.querySelector("#lootboxRewardVal");
        const rewardSub = viewFrame.querySelector("#lootboxRewardSub");

        let state = "idle"; // idle, opening, opened, trap_burst
        let chestAnim = 0.0;
        let lightRays = [];
        let goldCoins = [];
        let wager = 0.01;
        let finalMultiplier = 1.0;
        
        const chestImg = new Image();
        chestImg.src = "assets/mascot_loot_rush.png";

        // Setup light rays
        for (let i = 0; i < 18; i++) {
            lightRays.push({
                angle: (i * Math.PI * 2) / 18,
                speed: 0.008 + Math.random() * 0.012,
                width: 0.12 + Math.random() * 0.08,
                opacity: 0.12 + Math.random() * 0.28
            });
        }

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        let animFrameId;
        const renderLoop = () => {
            if (!container.contains(canvas)) {
                cancelAnimationFrame(animFrameId);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw glowing background aura
            const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 280);
            if (state === "trap_burst") {
                bgGrad.addColorStop(0, "rgba(184, 102, 85, 0.18)");
                bgGrad.addColorStop(1, "rgba(10, 11, 16, 0.95)");
            } else if (state === "opened" || state === "opening") {
                bgGrad.addColorStop(0, "rgba(139, 149, 143, 0.25)");
                bgGrad.addColorStop(1, "rgba(10, 11, 16, 0.95)");
            } else {
                bgGrad.addColorStop(0, "rgba(201, 154, 78, 0.08)");
                bgGrad.addColorStop(1, "rgba(10, 11, 16, 0.95)");
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Draw sweeping light beams from behind chest when opening
            if (state === "opening" || state === "opened") {
                ctx.save();
                ctx.translate(cx, cy - 20);
                lightRays.forEach(ray => {
                    ray.angle += ray.speed;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.arc(0, 0, 400, ray.angle - ray.width, ray.angle + ray.width);
                    ctx.closePath();
                    
                    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 350);
                    grad.addColorStop(0, `rgba(139, 149, 143, ${ray.opacity * (0.3 + chestAnim * 0.7)})`);
                    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = grad;
                    ctx.fill();
                });
                ctx.restore();
            }

            // 3. Update & Draw Gold Coins
            if (state === "opening" || state === "opened") {
                goldCoins.forEach(coin => {
                    coin.x += coin.vx;
                    coin.y += coin.vy;
                    coin.vy += 0.2; // gravity
                    coin.rot += coin.rotSpeed;

                    if (coin.y > canvas.height - 20) {
                        coin.y = canvas.height - 20;
                        coin.vy = -coin.vy * 0.4; // bounce dampening
                    }

                    ctx.save();
                    ctx.translate(coin.x, coin.y);
                    ctx.rotate(coin.rot);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, coin.radius, coin.radius * Math.abs(Math.sin(coin.rot)), 0, 0, Math.PI*2);
                    ctx.fillStyle = "#ffd700";
                    ctx.shadowColor = "#d8a64f";
                    ctx.shadowBlur = 6;
                    ctx.fill();
                    ctx.restore();
                });
            }

            // 4. Draw the crate mascot split animation.
            if (chestImg.complete) {
                const imgW = 200;
                const imgH = 200;
                const x = cx - imgW / 2;
                const y = cy - imgH / 2 - 20;

                ctx.save();
                const hoverBob = Math.sin(Date.now() * 0.003) * 6;
                ctx.translate(0, hoverBob);

                if (state === "opening" || state === "opened") {
                    chestAnim += (1.0 - chestAnim) * 0.08;
                    
                    // Top Half: Slide upwards and fade slightly
                    ctx.drawImage(
                        chestImg, 
                        0, 0, chestImg.width, chestImg.height / 2, 
                        x, y - (chestAnim * 48), imgW, imgH / 2
                    );
                    
                    // Bottom Half: Stays static
                    ctx.drawImage(
                        chestImg, 
                        0, chestImg.height / 2, chestImg.width, chestImg.height / 2, 
                        x, y + imgH / 2, imgW, imgH / 2
                    );
                } else if (state === "trap_burst") {
                    const rx = (Math.random() - 0.5) * 14;
                    const ry = (Math.random() - 0.5) * 14;
                    
                    ctx.shadowColor = "#b86655";
                    ctx.shadowBlur = 30;
                    ctx.drawImage(chestImg, x + rx, y + ry, imgW, imgH);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.shadowColor = "#c99a4e";
                    ctx.shadowBlur = 12;
                    ctx.drawImage(chestImg, x, y, imgW, imgH);
                    ctx.shadowBlur = 0;
                }
                ctx.restore();
            } else {
                ctx.fillStyle = "#c99a4e";
                ctx.fillRect(cx - 60, cy - 60, 120, 120);
            }

            animFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        const openCrate = () => {
            wager = parseFloat(container.querySelector("#gameWagerInput").value);
            const tier = container.querySelector("#lootboxTierSelect").value;

            if (VOID_DB.mutators.modifyBalance(wager, "sub")) {
                state = "opening";
                chestAnim = 0.0;
                goldCoins = [];
                outcomeBox.style.display = "none";
                actionBtn.disabled = true;

                // Play custom opening sweep rumble
                ARCADE_SYNTH.playIgnition();

                // Roll tier result
                const isTrap = Math.random() < (tier === "mega" ? 0.35 : 0.08); // Trap odds
                
                setTimeout(() => {
                    actionBtn.disabled = false;
                    actionBtn.textContent = "CLAIM CRATE";

                    if (isTrap) {
                        state = "trap_burst";
                        // Play explosion core collapse
                        ARCADE_SYNTH.playBoom();
                        setTimeout(() => {
                            ARCADE_SYNTH.playLossGlitch();
                        }, 600);

                        rewardVal.textContent = "TRAP!";
                        rewardVal.className = "lootbox-reward-title trap";
                        rewardSub.textContent = "MIMIC DETECTED - BUSTED!";
                        rewardSub.className = "pink-text font-tech";
                        outcomeBox.style.display = "block";

                        VOID_DB.mutators.logBet("LootRush", wager, 0, 0, "loss");
                        triggerMascotReaction("scared", "YIKES! A mimic trap inside the loot box! 🥶🎁");
                    } else {
                        state = "opened";
                        // Play win cheer arpeggios
                        if (tier === "mega") {
                            ARCADE_SYNTH.playOhYeah();
                            if (window.startJackpotCoinRain) {
                                window.startJackpotCoinRain();
                            }
                        } else {
                            ARCADE_SYNTH.playWinCheer();
                        }

                        // Spawn gold bouncing coins
                        for (let i = 0; i < 35; i++) {
                            goldCoins.push({
                                x: cx,
                                y: cy - 20,
                                vx: (Math.random() - 0.5) * 8,
                                vy: -4 - Math.random() * 8,
                                radius: 5 + Math.random() * 3,
                                rot: Math.random() * Math.PI,
                                rotSpeed: 0.1 + Math.random() * 0.2
                            });
                        }

                        // Win multiplier calculation
                        const rolls = tier === "mega" ? [1.5, 2.5, 5.0, 10.0, 20.0] : [1.1, 1.3, 1.5, 2.0, 3.5];
                        finalMultiplier = rolls[Math.floor(Math.random() * rolls.length)];
                        const winValue = wager * finalMultiplier;

                        rewardVal.textContent = finalMultiplier.toFixed(2) + "x";
                        rewardVal.className = "lootbox-reward-title win";
                        rewardSub.textContent = `REWARD: +${winValue.toFixed(4)} ${VOID_DB.user.activeCurrency}`;
                        rewardSub.className = "electric-green-text font-tech";
                        outcomeBox.style.display = "block";

                        VOID_DB.mutators.modifyBalance(winValue, "add");
                        VOID_DB.mutators.logBet("LootRush", wager, finalMultiplier, winValue, "win");
                        triggerMascotReaction("happy", `Boom! LootRush crate opened! printed ${finalMultiplier}x rewards! 🤑💎`);
                    }
                }, 1800);
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        };

        const resetCrate = () => {
            state = "idle";
            chestAnim = 0.0;
            goldCoins = [];
            outcomeBox.style.display = "none";
            actionBtn.textContent = "OPEN CRATE";
        };

        actionBtn.addEventListener("click", () => {
            if (state === "idle") {
                openCrate();
            } else {
                resetCrate();
            }
        });

        VOID_DB.events.on("viewChanged", () => {
            cancelAnimationFrame(animFrameId);
            ARCADE_SYNTH.stopTensionAndRumble();
        });
    },

    // E. WHEEL OF CHAOS SPINNER
    initWheelEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-dharmachakra neon-pink-text"></i> SpinCore`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">DIFFICULTY SECTOR</label>
                <select class="cyber-select" id="wheelSectorSelect">
                    <option value="10">10 Segments (Standard)</option>
                    <option value="20">20 Segments (Insane)</option>
                </select>
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `<canvas id="wheelCanvas" width="500" height="500"></canvas>`;

        const canvas = viewFrame.querySelector("#wheelCanvas");
        const ctx = canvas.getContext("2d");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");

        // Segment configurations
        const coefs = [1.5, 0.0, 2.0, 0.5, 1.2, 0.0, 5.0, 0.5, 1.5, 0.0];
        let currentRotation = 0;
        let isSpinning = false;

        const drawWheel = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = 180;
            const segments = coefs.length;
            const angleStep = (Math.PI * 2) / segments;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(currentRotation);

            // Draw sectors
            for (let i = 0; i < segments; i++) {
                const startAngle = i * angleStep;
                const endAngle = startAngle + angleStep;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, startAngle, endAngle);
                ctx.closePath();

                const mult = coefs[i];
                let fillCol = i % 2 === 0 ? "#141521" : "#1b1d2e";
                if (mult >= 5.0) fillCol = "rgba(184, 102, 85, 0.2)";
                else if (mult === 0) fillCol = "rgba(255,255,255,0.02)";

                ctx.fillStyle = fillCol;
                ctx.fill();

                ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw Text inside wedge
                ctx.save();
                ctx.rotate(startAngle + angleStep / 2);
                ctx.fillStyle = mult >= 2.0 ? "#8b958f" : mult === 0 ? "#888" : "#fff";
                ctx.font = "bold 13px 'Space Grotesk'";
                ctx.textAlign = "right";
                ctx.fillText(mult + "x", radius - 20, 5);
                ctx.restore();
            }

            ctx.restore();

            // Draw outer ring
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
            // Create a restrained Canvas ring treatment.
            const cyberGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
            cyberGrad.addColorStop(0, "#c99a4e");
            cyberGrad.addColorStop(0.5, "#8b958f");
            cyberGrad.addColorStop(1, "#7fa06a");
            ctx.strokeStyle = cyberGrad;
            ctx.lineWidth = 4;
            ctx.stroke();

            // Draw wheel pointer indicator
            ctx.beginPath();
            ctx.moveTo(cx + radius + 15, cy);
            ctx.lineTo(cx + radius - 5, cy - 10);
            ctx.lineTo(cx + radius - 5, cy + 10);
            ctx.closePath();
            ctx.fillStyle = "#b86655";
            ctx.fill();
        };

        // Redraw loop
        const drawElectricArc = (ctx, startX, startY, endX, endY, color) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5 + Math.random() * 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            const dx = endX - startX;
            const dy = endY - startY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const steps = 8;
            
            let curX = startX;
            let curY = startY;
            
            for (let i = 1; i < steps; i++) {
                const t = i / steps;
                const targetX = startX + dx * t;
                const targetY = startY + dy * t;
                
                // offset normal vector
                const nx = -dy / dist;
                const ny = dx / dist;
                const offset = (Math.random() - 0.5) * 15;
                
                curX = targetX + nx * offset;
                curY = targetY + ny * offset;
                
                ctx.lineTo(curX, curY);
            }
            
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        };

        let animFrameId;
        const renderLoop = () => {
            if (!container.contains(canvas)) {
                cancelAnimationFrame(animFrameId);
                return;
            }
            drawWheel();

            if (isSpinning) {
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const radius = 180;
                // Generate active electric visual arcs to selector indicator
                drawElectricArc(ctx, cx, cy, cx + radius - 5, cy, "#8b958f");
                if (Math.random() > 0.4) {
                    drawElectricArc(ctx, cx, cy, cx + radius - 5, cy, "#b86655");
                }
            }

            animFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        actionBtn.addEventListener("click", () => {
            if (isSpinning) return;
            const wagerVal = parseFloat(container.querySelector("#gameWagerInput").value);

            if (VOID_DB.mutators.modifyBalance(wagerVal, "sub")) {
                isSpinning = true;
                actionBtn.disabled = true;
                triggerMascotReaction("gasping", "Massive core reactor spin initiated! 🎡");

                // Play custom sweep rumble start
                ARCADE_SYNTH.playIgnition();

                // Target physics rotation variables
                const targetIdx = Math.floor(Math.random() * coefs.length);
                const finalAngle = (Math.PI * 2) - (targetIdx * ((Math.PI * 2) / coefs.length)) - (((Math.PI * 2) / coefs.length)/2);
                const fullSpins = 4 + Math.floor(Math.random() * 3);
                
                const targetRotation = fullSpins * Math.PI * 2 + finalAngle;
                
                let vel = 0.35;
                const friction = 0.0035;

                const spinInterval = setInterval(() => {
                    currentRotation += vel;
                    vel -= friction;

                    if (vel <= 0) {
                        clearInterval(spinInterval);
                        currentRotation = finalAngle; // Snap alignment
                        isSpinning = false;
                        actionBtn.disabled = false;

                        // Stop ongoing engine rumble
                        ARCADE_SYNTH.stopTensionAndRumble();

                        const mult = coefs[targetIdx];
                        const winVal = wagerVal * mult;
                        const state = mult >= 1.0 ? "win" : "loss";
                        
                        VOID_DB.mutators.modifyBalance(winVal, "add");
                        VOID_DB.mutators.logBet("SpinCore", wagerVal, mult, winVal, state);

                        if (mult >= 2.0) {
                            ARCADE_SYNTH.playWinCheer();
                            triggerMascotReaction("happy", `Landed on ${mult}x reactor core! Printed big rewards! 🤑`);
                        } else {
                            ARCADE_SYNTH.playLossGlitch();
                            triggerMascotReaction("scared", `Reactor land: ${mult}x. Ready for the next spin?`);
                        }
                    }
                }, 20);
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        });

        VOID_DB.events.on("viewChanged", () => {
            cancelAnimationFrame(animFrameId);
        });
    },

    // ==========================================================================
    // 3. SPORTSBOOK & ACTIVE SLIPS MODULES
    // ==========================================================================
    sportsbook(container) {
        container.innerHTML = `
            <div class="home-section-header">
                <h1 class="section-headline"><i class="fa-solid fa-trophy neon-purple-text"></i> Interactive Sportsbook</h1>
                <div class="sports-nav-tabs">
                    <button class="sport-pill-btn active" data-sport="all">All Arenas</button>
                    <button class="sport-pill-btn" data-sport="Esports"><i class="fa-solid fa-gamepad"></i> Esports</button>
                    <button class="sport-pill-btn" data-sport="Soccer"><i class="fa-solid fa-futbol"></i> Soccer</button>
                    <button class="sport-pill-btn" data-sport="Basketball"><i class="fa-solid fa-basketball"></i> NBA</button>
                    <button class="sport-pill-btn" data-sport="Cricket"><i class="fa-solid fa-baseball-bat-ball"></i> Cricket</button>
                </div>
            </div>

            <div class="sports-hub-layout">
                <!-- Matches Grid -->
                <div class="sports-grid" id="sportsMatchGrid">
                    <!-- Injected dynamically -->
                </div>

                <!-- Interactive Floating Bet Slip sidebar panel -->
                <div class="bet-slip-panel glass-panel" id="sportsBetSlipPanel">
                    <div class="bet-slip-title"><i class="fa-solid fa-receipt cyan-text"></i> ACTIVE BETTING SLIP</div>
                    <div class="bet-slip-list" id="slipItemsBox">
                        <div class="text-muted" style="text-align: center; padding: 40px 10px; font-size:12px;">No active stakes. Select live odds on cards to place bet.</div>
                    </div>
                    
                    <div class="bet-slip-calculations">
                        <div class="slip-calcs-row"><span>Combined Multiplier:</span> <span id="slipCombinedOdds">1.00</span></div>
                        <div class="slip-calcs-row">
                            <div class="input-label-row" style="width: 100%;">
                                <span>Your Wager:</span>
                                <span style="font-size: 10px;">Bal: <span id="slipBalanceVal">12.450</span> ETH</span>
                            </div>
                        </div>
                        <div class="amount-input-box" style="margin-bottom: 12px;">
                            <input type="number" step="any" class="cyber-input" id="slipWagerInput" value="0.050">
                            <button class="amount-max-btn" id="slipWagerMaxBtn">MAX</button>
                        </div>
                        <div class="slip-calcs-row grand-total"><span>Estimated Payout:</span> <span id="slipPayoutVal" class="electric-green-text">0.050 ETH</span></div>
                        
                        <button class="btn btn-primary btn-lg btn-full" id="placeSportsBetBtn" style="margin-top:12px;"><i class="fa-solid fa-bolt"></i> Place Sports Bet</button>
                    </div>
                </div>
            </div>
        `;

        const matchGrid = container.querySelector("#sportsMatchGrid");
        const tabs = container.querySelectorAll(".sport-pill-btn");
        const slipBox = container.querySelector("#slipItemsBox");
        const oddsText = container.querySelector("#slipCombinedOdds");
        const wagerIn = container.querySelector("#slipWagerInput");
        const payoutText = container.querySelector("#slipPayoutVal");
        const betBtn = container.querySelector("#placeSportsBetBtn");

        let activeSelections = []; // array of { matchId, pick, odds }

        // Sync local slip balance display
        const syncBalance = () => {
            const cur = VOID_DB.user.activeCurrency;
            container.querySelector("#slipBalanceVal").textContent = VOID_DB.user.balances[cur].toFixed(3);
        };
        syncBalance();

        const updateSlipCalculations = () => {
            if (activeSelections.length === 0) {
                slipBox.innerHTML = `<div class="text-muted" style="text-align: center; padding: 40px 10px; font-size:12px;">No active stakes. Select live odds on cards to place bet.</div>`;
                oddsText.textContent = "1.00";
                payoutText.textContent = `0.000 ${VOID_DB.user.activeCurrency}`;
                return;
            }

            slipBox.innerHTML = "";
            let combOdds = 1.0;
            
            activeSelections.forEach((sel, idx) => {
                combOdds *= sel.odds;
                const match = VOID_DB.sportsSchedule.find(m => m.id === sel.matchId);
                const card = document.createElement("div");
                card.className = "slip-item";
                card.innerHTML = `
                    <span class="slip-delete-btn" data-index="${idx}">&times;</span>
                    <div class="slip-match-title">${match.teamA} vs ${match.teamB}</div>
                    <div class="input-label-row">
                        <span class="slip-prediction-label">Pick: ${sel.pick === "w1" ? match.teamA : sel.pick === "w2" ? match.teamB : "Draw"}</span>
                        <span class="slip-odds-right">${sel.odds.toFixed(2)}</span>
                    </div>
                `;
                card.querySelector(".slip-delete-btn").addEventListener("click", () => {
                    activeSelections.splice(idx, 1);
                    updateSlipCalculations();
                });
                slipBox.appendChild(card);
            });

            oddsText.textContent = combOdds.toFixed(2);
            const payout = parseFloat(wagerIn.value) * combOdds;
            payoutText.textContent = payout.toFixed(4) + " " + VOID_DB.user.activeCurrency;
        };

        wagerIn.addEventListener("input", updateSlipCalculations);
        container.querySelector("#slipWagerMaxBtn").addEventListener("click", () => {
            wagerIn.value = VOID_DB.user.balances[VOID_DB.user.activeCurrency].toFixed(3);
            updateSlipCalculations();
        });

        const renderMatches = (filterSport) => {
            matchGrid.innerHTML = "";
            const matches = filterSport === "all" ? VOID_DB.sportsSchedule : VOID_DB.sportsSchedule.filter(m => m.sport === filterSport);

            matches.forEach(match => {
                const card = document.createElement("div");
                card.className = "match-odds-card glass-panel";
                card.innerHTML = `
                    <div class="match-teams-info">
                        <div class="match-meta-line">
                            <span class="live-indicator-pill"><i class="fa-solid fa-record-vinyl"></i> LIVE</span>
                            <span>${match.tournament}</span>
                            <span class="cyan-text font-tech">${match.minute}</span>
                        </div>
                        <div class="match-team-row">${match.teamA} <span class="cyan-text">${match.scoreA}</span></div>
                        <div class="match-team-row">${match.teamB} <span class="cyan-text">${match.scoreB}</span></div>
                        
                        <!-- AI predictions win probability bar -->
                        <div class="ai-analytics-card" style="margin-top:10px; padding: 8px 12px; width: 90%;">
                            <div class="input-label-row" style="font-size:10px; margin-bottom:4px;">
                                <span><i class="fa-solid fa-robot cyan-text"></i> AI Analytics: ${match.predictions.winProbA}% ${match.teamA}</span>
                                <span class="cyan-text font-tech">${match.predictions.risk}</span>
                            </div>
                            <div class="win-probability-track">
                                <div class="win-prob-bar-A" style="width: ${match.predictions.winProbA}%;"></div>
                                <div class="win-prob-bar-B" style="width: ${match.predictions.winProbB}%;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="match-odds-selector">
                        <div class="odds-coefficient-btn" data-pick="w1">
                            <span class="odds-label">1</span>
                            <span class="odds-value">${match.odds.w1.toFixed(2)}</span>
                        </div>
                        <div class="odds-coefficient-btn" data-pick="draw">
                            <span class="odds-label">X</span>
                            <span class="odds-value">${match.odds.draw.toFixed(2)}</span>
                        </div>
                        <div class="odds-coefficient-btn" data-pick="w2">
                            <span class="odds-label">2</span>
                            <span class="odds-value">${match.odds.w2.toFixed(2)}</span>
                        </div>
                    </div>
                `;

                // Add odds click events
                card.querySelectorAll(".odds-coefficient-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const pick = btn.dataset.pick;
                        const coef = match.odds[pick];
                        
                        // Prevent duplicate selection on same match
                        activeSelections = activeSelections.filter(s => s.matchId !== match.id);
                        activeSelections.push({ matchId: match.id, pick, odds: coef });
                        
                        updateSlipCalculations();
                        showToast(`Selection added to Betting Slip!`, "success");

                        // Mascot reacts
                        triggerMascotReaction("gasping", "Bet added! Let's parlay it for bigger wins! 🏆");
                    });
                });

                matchGrid.appendChild(card);
            });
        };

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                renderMatches(tab.dataset.sport);
            });
        });

        renderMatches("all");

        // Real-time updates subscription
        VOID_DB.events.on("sportsOddsUpdated", () => {
            // Keep active view rendered values updated
            const activePill = container.querySelector(".sport-pill-btn.active");
            if (!activePill) return;
            const activeTab = activePill.dataset.sport;
            renderMatches(activeTab);
            updateSlipCalculations();
        });

        // Submit wager bet slip
        betBtn.addEventListener("click", () => {
            if (activeSelections.length === 0) {
                showToast("Your betting slip is empty!", "error");
                return;
            }
            const wager = parseFloat(wagerIn.value);
            const combOdds = parseFloat(oddsText.textContent);
            
            if (VOID_DB.mutators.modifyBalance(wager, "sub")) {
                showToast("Sports Bet placed successfully!", "success");
                activeSelections = [];
                updateSlipCalculations();
                syncBalance();

                triggerMascotReaction("happy", "LFG! Sports bet locked. Rooting for your team! 🏆🔥");
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        });
    },

    // ==========================================================================
    // 4. PROTOCOL CLUB VIEWS (VIP PROGRESSION & LEADERBOARD)
    // ==========================================================================
    vip(container) {
        const u = VOID_DB.user;
        const progressPercent = Math.min((u.xp / u.xpNextLevel) * 100, 100);

        container.innerHTML = `
            <div class="home-hero-container" style="background: linear-gradient(135deg, rgba(201,154,78,0.2) 0%, rgba(10,11,16,0.95) 100%); position: relative; overflow: hidden;">
                <div class="home-hero-layout">
                    <div class="hero-text-block">
                        <div class="hero-tagline"><i class="fa-solid fa-crown neon-purple-text"></i> VIP club status</div>
                        <h1 class="hero-title">${u.vipLevel.toUpperCase()} RANK</h1>
                        <p class="hero-desc">Elevate your wagering power. Unlock weekly cashback reloads, exclusive custom mascot items, and direct clan bonuses.</p>
                    </div>
                    <div class="hero-visual-block hidden-mobile" style="position: relative; display: flex; justify-content: center; align-items: center; min-height: 200px; min-width: 200px;">
                        <div class="disney-floating-mascot" style="width: 200px; height: 200px; border-radius: 20px; position: absolute; top: -10px; z-index: 10;"></div>
                    </div>
                </div>
            </div>

            <!-- XP Level Progression Panel -->
            <div class="glass-panel" style="padding: 30px; margin-bottom: 30px;">
                <div class="input-label-row" style="margin-bottom: 12px;">
                    <h3 class="font-tech">VIP XP PROGRESSION TRACKER</h3>
                    <span class="cyan-text font-tech">LEVEL ${u.level} &rarr; ${u.level + 1}</span>
                </div>
                <div class="matrix-bar" style="width: 100%; height: 12px; margin-bottom: 8px;">
                    <div class="matrix-progress" style="width: ${progressPercent}%;"></div>
                </div>
                <div class="input-label-row text-muted" style="font-size: 12px;">
                    <span>Accumulated: ${u.xp} XP</span>
                    <span>Required: ${u.xpNextLevel} XP</span>
                </div>
            </div>

            <!-- Perks Grid -->
            <div class="home-section-header">
                <h2 class="section-headline">Your Premium Privileges</h2>
            </div>
            <div class="home-games-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                <div class="glass-panel" style="padding: 20px;">
                    <i class="fa-solid fa-coins fa-2x electric-green-text" style="margin-bottom:12px;"></i>
                    <h4 style="margin-bottom:8px;">10% Daily Cash Reloads</h4>
                    <p class="text-muted" style="font-size:12px; line-height:1.5;">Claim immediate cashback on wagers placed within the past 24 hours with zero rollover limits.</p>
                </div>
                <div class="glass-panel" style="padding: 20px;">
                    <i class="fa-solid fa-dragon fa-2x neon-purple-text" style="margin-bottom:12px;"></i>
                    <h4 style="margin-bottom:8px;">Exclusive NFT Cosmetics</h4>
                    <p class="text-muted" style="font-size:12px; line-height:1.5;">Personalize your companion with tasteful character cosmetics.</p>
                </div>
                <div class="glass-panel" style="padding: 20px;">
                    <i class="fa-solid fa-headset fa-2x cyan-text" style="margin-bottom:12px;"></i>
                    <h4 style="margin-bottom:8px;">Dedicated AI Bet Assistant</h4>
                    <p class="text-muted" style="font-size:12px; line-height:1.5;">Direct priority connection to advanced predictive wagering analytics models.</p>
                </div>
            </div>
        `;
    },

    leaderboards(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-chart-simple-horizontal neon-purple-text"></i> Global Leaderboards</h1>
                <span class="text-muted font-tech">DAILY WAGER volume TRACKERS</span>
            </div>

            <div class="glass-panel" style="padding:20px; overflow-x:auto;">
                <table class="bets-ticker-header" style="width: 100%; display: table; border-bottom: none;">
                    <thead>
                        <tr style="display: table-row; color: var(--text-muted); font-size:11px;">
                            <th style="padding:12px; text-align:center;">RANK</th>
                            <th style="padding:12px; text-align:left;">PLAYER</th>
                            <th style="padding:12px; text-align:left;">CLAN TAG</th>
                            <th style="padding:12px; text-align:right;">TOTAL WAGERED VOLUME</th>
                            <th style="padding:12px; text-align:right;">MOCK XP GAIN</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="display: table-row; border-bottom:1px solid rgba(255,255,255,0.02);">
                            <td style="padding:14px; text-align:center; color:#ffd700; font-weight:700;"><i class="fa-solid fa-medal"></i> 1</td>
                            <td style="padding:14px; font-weight:600;">ZenWhale</td>
                            <td style="padding:14px;"><span class="chat-clan-tag" style="background:rgba(139,149,143,0.15); border-color:#8b958f; color:#8b958f;">HOUSE</span></td>
                            <td style="padding:14px; text-align:right; font-family:'Space Grotesk';" class="electric-green-text">$1,245,800.00</td>
                            <td style="padding:14px; text-align:right; color:var(--neon-purple);">+25,000 XP</td>
                        </tr>
                        <tr style="display: table-row; border-bottom:1px solid rgba(255,255,255,0.02);">
                            <td style="padding:14px; text-align:center; color:#cfcfcf; font-weight:700;"><i class="fa-solid fa-medal"></i> 2</td>
                            <td style="padding:14px; font-weight:600;">AstroZero</td>
                            <td style="padding:14px;"><span class="chat-clan-tag">VOID</span></td>
                            <td style="padding:14px; text-align:right; font-family:'Space Grotesk';" class="electric-green-text">$980,450.00</td>
                            <td style="padding:14px; text-align:right; color:var(--neon-purple);">+15,000 XP</td>
                        </tr>
                        <tr style="display: table-row; border-bottom:1px solid rgba(255,255,255,0.02);">
                            <td style="padding:14px; text-align:center; color:#b6743b; font-weight:700;"><i class="fa-solid fa-medal"></i> 3</td>
                            <td style="padding:14px; font-weight:600;">CryptoPixie</td>
                            <td style="padding:14px;"><span class="chat-clan-tag" style="background:rgba(184,102,85,0.15); border-color:#b86655; color:#b86655;">RUSH</span></td>
                            <td style="padding:14px; text-align:right; font-family:'Space Grotesk';" class="electric-green-text">$845,000.00</td>
                            <td style="padding:14px; text-align:right; color:var(--neon-purple);">+10,000 XP</td>
                        </tr>
                        <tr style="display: table-row; border-bottom:1px solid rgba(255,255,255,0.02);">
                            <td style="padding:14px; text-align:center; color:var(--text-muted);">4</td>
                            <td style="padding:14px;">AveryHouse_99 (You)</td>
                            <td style="padding:14px;"><span class="chat-clan-tag">VOID</span></td>
                            <td style="padding:14px; text-align:right; font-family:'Space Grotesk';" class="electric-green-text">$184,500.00</td>
                            <td style="padding:14px; text-align:right; color:var(--neon-purple);">+5,400 XP</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    // E. OTHER VIEW ROUTE SHELLS
    provablyFair(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-shield-halved neon-purple-text"></i> Provably Fair Protocol</h1>
            </div>
            <div class="glass-panel" style="padding:30px;">
                <h3 style="margin-bottom:16px;">How fairness verification works</h3>
                <p class="text-muted" style="font-size:14px; line-height:1.6; margin-bottom:20px;">Every single bet rolled on VOIDBET is cryptographically verifiable in real-time. We combine an active Server Seed (generated by our system), a Client Seed (defined by your browser), and an incrementing Nonce (bet counter) to generate a fully deterministic SHA-256 hash hash. Since you have client seed control, results are mathematically protected from platform manipulation.</p>
                <button class="btn btn-primary" onclick="openProvablyFairModal()"><i class="fa-solid fa-arrows-rotate"></i> ROTATE ACTIVE SEEDS NOW</button>
            </div>
        `;
    },

    promotions(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-tags neon-pink-text"></i> Active Promotions</h1>
            </div>
            <div class="home-games-grid" style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));">
                <div class="glass-panel" style="padding:24px;">
                    <span class="live-indicator-pill" style="margin-bottom:12px; display:inline-block;">ACTIVE</span>
                    <h3 style="margin-bottom:10px;">$500,000 Clans Battle Arena</h3>
                    <p class="text-muted" style="font-size:13px; line-height:1.5; margin-bottom:16px;">Stake originals, gain clan power levels, and secure massive payouts inside the weekly clan leaderboard prize pool.</p>
                    <a href="#casino" class="btn btn-secondary btn-sm">Enter Battle</a>
                </div>
                <div class="glass-panel" style="padding:24px;">
                    <span class="live-indicator-pill" style="margin-bottom:12px; display:inline-block;">WEEKLY</span>
                    <h3 style="margin-bottom:10px;">Solana Level Up Multipliers</h3>
                    <p class="text-muted" style="font-size:13px; line-height:1.5; margin-bottom:16px;">Place bets using SOL and claim 2x VIP XP progression points on all custom original games this weekend.</p>
                    <a href="#casino/plinko-neo" class="btn btn-secondary btn-sm">Play Plinko SOL</a>
                </div>
            </div>
        `;
    },

    challenges(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-bullseye neon-purple-text"></i> Daily Missions</h1>
            </div>
            <div class="glass-panel" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
                <div class="input-label-row" style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:12px;">
                    <div>
                        <h4 class="electric-green-text">1. Crash Master Milestone</h4>
                        <p class="text-muted" style="font-size:12px;">Secure a 10.00x multiplier or higher in Rocket Crash</p>
                    </div>
                    <span class="cyan-text font-tech">+2.50 SOL REWARD</span>
                </div>
                <div class="input-label-row" style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:12px;">
                    <div>
                        <h4>2. Grid Sweeper Sweep</h4>
                        <p class="text-muted" style="font-size:12px;">Successfully reveal 10 safe crystals in MineGrid (3 Mines ratio)</p>
                    </div>
                    <span class="text-muted font-tech">0 / 1 DONE</span>
                </div>
            </div>
        `;
    },

    streamerHub(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-tower-broadcast neon-pink-text"></i> Streamer Hub</h1>
                    <span class="text-muted font-tech">Creator overlays and alerts</span>
            </div>
            <div class="glass-panel" style="padding:30px;">
                <h3 style="margin-bottom:12px;"><i class="fa-solid fa-square-rss"></i> Live OBS Stream Overlays</h3>
                <p class="text-muted" style="font-size:14px; line-height:1.6; margin-bottom:20px;">Generate clean transparent overlays for wins, live bet slips, odds changes, and companion reactions.</p>
                <div class="input-group" style="margin-bottom:20px;">
                    <label class="input-label">SECRET STREAM WIDGET LINK</label>
                    <div class="address-copy-box">
                        <span class="address-string">https://voidbet.io/overlay/streamer-AveryHouse-99</span>
                        <button class="copy-btn"><i class="fa-solid fa-copy"></i> Copy HUD link</button>
                    </div>
                </div>
            </div>
        `;
    },

    affiliate(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-users-rectangle neon-purple-text"></i> Affiliate Portal</h1>
            </div>
            <div class="glass-panel" style="padding:30px;">
                <h3 style="margin-bottom:12px;">Invite your crew. Earn 25% commissions.</h3>
                <p class="text-muted" style="font-size:14px; line-height:1.6; margin-bottom:20px;">Earn lifetime commissions on all wagers placed by players referred to the platform. Payouts are made instantly in real-time straight to your active crypto balance.</p>
                <div class="input-group">
                    <label class="input-label">YOUR EXCLUSIVE REFERRAL CODE</label>
                    <div class="address-copy-box">
                        <span class="address-string">https://voidbet.io/ref/AveryHouse_99</span>
                        <button class="copy-btn" onclick="showToast('Referral code copied!', 'success')"><i class="fa-solid fa-copy"></i> Copy Code</button>
                    </div>
                </div>
            </div>
        `;
    },

    wallet(container) {
        const u = VOID_DB.user;
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-wallet cyan-text"></i> Interactive Wallet Dashboard</h1>
            </div>

            <div class="home-games-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                <div class="glass-panel" style="padding:20px;">
                    <span class="text-muted" style="font-size:11px;">ETHEREUM FUNDS</span>
                    <h2 style="font-family:'Space Grotesk'; margin:8px 0;" class="cyan-text">${u.balances.ETH.toFixed(4)} ETH</h2>
                    <button class="btn btn-primary btn-sm btn-full" onclick="openWalletTab('ETH')"><i class="fa-solid fa-bolt"></i> Action Wallet</button>
                </div>
                <div class="glass-panel" style="padding:20px;">
                    <span class="text-muted" style="font-size:11px;">SOLANA FUNDS</span>
                    <h2 style="font-family:'Space Grotesk'; margin:8px 0;" class="cyan-text">${u.balances.SOL.toFixed(3)} SOL</h2>
                    <button class="btn btn-primary btn-sm btn-full" onclick="openWalletTab('SOL')"><i class="fa-solid fa-bolt"></i> Action Wallet</button>
                </div>
                <div class="glass-panel" style="padding:20px;">
                    <span class="text-muted" style="font-size:11px;">USDT FUNDS</span>
                    <h2 style="font-family:'Space Grotesk'; margin:8px 0;" class="cyan-text">${u.balances.USDT.toLocaleString()} USDT</h2>
                    <button class="btn btn-primary btn-sm btn-full" onclick="openWalletTab('USDT')"><i class="fa-solid fa-bolt"></i> Action Wallet</button>
                </div>
            </div>
        `;
    },

    profile(container) {
        const u = VOID_DB.user;
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-user-gear neon-purple-text"></i> Player Avatar Profile</h1>
            </div>

            <div class="glass-panel" style="padding:30px; display:flex; gap:30px; align-items:center; margin-bottom:30px;">
                <img src="${u.avatar}" alt="User Avatar" style="width:96px; height:96px; border-radius:50%; background:#1a1d2e;">
                <div>
                    <h2 style="margin-bottom:6px;">${u.username} <span class="chat-clan-tag">${u.clan}</span></h2>
                    <span class="text-muted" style="font-size:13px;">Total Wagered: <span class="electric-green-text font-tech">$${u.stats.totalWageredUsd.toLocaleString()}</span></span>
                    <div style="margin-top:10px;"><span class="user-level-badge bronze-badge">Level ${u.level}</span></div>
                </div>
            </div>

            <div class="home-section-header" style="margin-top:40px; margin-bottom:20px;">
                <h2 class="section-headline"><i class="fa-solid fa-palette cyan-text"></i> Customize companion skins</h2>
                <span class="text-muted font-tech">Unlocked cosmetics</span>
            </div>

            <div class="skins-selection-grid">
                ${u.unlockedSkins.map(skin => {
                    const isActive = u.activeSkin === skin.id;
                    return `
                        <div class="skin-item-card glass-panel ${isActive ? "active" : ""}" data-skin-id="${skin.id}">
                            <i class="fa-solid fa-paw fa-3x" style="margin-bottom:12px; color:${skin.id === "vapor" ? "var(--neon-pink)" : skin.id === "pharaoh" ? "var(--neon-yellow)" : skin.id === "oni" ? "red" : "var(--neon-purple)"};"></i>
                            <h4 style="margin-bottom:6px;">${skin.name}</h4>
                            <span class="text-muted" style="font-size:11px;">Cost: ${skin.cost}</span>
                            <div style="margin-top:12px;">
                                <button class="btn btn-secondary btn-sm equip-skin-btn" style="width:100%;" ${isActive ? "disabled" : ""}>
                                    ${isActive ? "EQUIPPED" : "EQUIP SKIN"}
                                </button>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;

        // Skins click actions
        container.querySelectorAll(".skin-item-card").forEach(card => {
            const btn = card.querySelector(".equip-skin-btn");
            if (btn) {
                btn.addEventListener("click", () => {
                    const skinId = card.dataset.skinId;
                    
                    // Switch skin state
                    VOID_DB.user.activeSkin = skinId;
                    
                    // Trigger visual update on mascot SVG
                    const mascotSvg = document.querySelector(".vibex-svg-character");
                    if (mascotSvg) {
                        mascotSvg.className.baseVal = `vibex-svg-character skin-${skinId}`;
                    }

                    // Reload profile rendering to sync buttons
                    VOID_COMPONENTS.profile(container);
                    showToast(`Cosmetic skin successfully updated to ${skinId.toUpperCase()}!`, "success");

                    triggerMascotReaction("happy", `Equipped ${skinId.toUpperCase()} skin! Look at my new style! 🦊✨`);
                });
            }
        });
    },

    // F. PVP COINFLIP GAME ENGINE
    initCoinflipEngine(container) {
        container.querySelector("#gameHeadlineTitle").innerHTML = `<i class="fa-solid fa-coins neon-purple-text"></i> BattleFlip PvP`;
        
        container.querySelector("#gameParamsPlaceholder").innerHTML = `
            <div class="input-group">
                <label class="input-label">CHOOSE SIDE</label>
                <div class="match-odds-selector" style="width:100%;">
                    <button class="btn btn-secondary active" id="coinSelectHeadsBtn" style="flex:1; border-color:var(--neon-purple); color:var(--neon-purple); box-shadow:0 0 10px rgba(201,154,78,0.25);">HEADS</button>
                    <button class="btn btn-secondary" id="coinSelectTailsBtn" style="flex:1;">TAILS</button>
                </div>
            </div>
            <div class="ai-analytics-card" style="margin-top:16px;">
                <h4 style="margin-bottom:8px;"><i class="fa-solid fa-robot"></i> AI WIN ANALYSIS</h4>
                <div class="input-label-row text-muted" style="font-size:11px;">
                    <span>Heads Rate: 51.2%</span>
                    <span>Tails Rate: 48.8%</span>
                </div>
            </div>
        `;

        const viewFrame = container.querySelector("#gameViewportFrame");
        viewFrame.innerHTML = `
            <div class="coinflip-arena">
                <div class="pvp-battle-arena">
                    <!-- Left Challenger Panel (Player) -->
                    <div class="pvp-challenger-panel left float-animation">
                        <img src="assets/mascot_battle_flip.png" class="pvp-mascot-img" alt="Player Mascot">
                        <div class="pvp-player-tag">YOU (AveryHouse_99)</div>
                        <div class="pvp-side-badge heads-badge">HEADS</div>
                    </div>
                    
                    <!-- Spinning 3D Coin Wrapper -->
                    <div class="coinflip-wrapper">
                        <div class="coinflip-coin" id="pvpActiveCoin">
                            <div class="coin-face heads"><i class="fa-solid fa-fingerprint"></i></div>
                            <div class="coin-face tails"><i class="fa-solid fa-yin-yang"></i></div>
                        </div>
                    </div>

                    <!-- Right Challenger Panel (Rival) -->
                    <div class="pvp-challenger-panel right float-animation">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ZenWhale&backgroundColor=151821" id="pvpRivalAvatar" class="pvp-mascot-img" alt="Rival Mascot">
                        <div class="pvp-player-tag" id="pvpRivalName">ZenWhale</div>
                        <div class="pvp-side-badge tails-badge">TAILS</div>
                    </div>
                </div>

                <div class="text-muted font-tech" id="coinflipStatusText">WAITING FOR CHALLENGERS...</div>
            </div>
        `;

        const coin = viewFrame.querySelector("#pvpActiveCoin");
        const status = viewFrame.querySelector("#coinflipStatusText");
        const actionBtn = container.querySelector("#gameActionTriggerBtn");
        const btnHeads = container.querySelector("#coinSelectHeadsBtn");
        const btnTails = container.querySelector("#coinSelectTailsBtn");

        let selectedSide = "heads"; // heads, tails
        let state = "idle"; // idle, flipping

        btnHeads.addEventListener("click", () => {
            if (state !== "idle") return;
            selectedSide = "heads";
            btnHeads.classList.add("active");
            btnHeads.style.borderColor = "var(--neon-purple)";
            btnHeads.style.color = "var(--neon-purple)";
            btnHeads.style.boxShadow = "0 0 10px rgba(201,154,78,0.25)";
            
            btnTails.classList.remove("active");
            btnTails.style.borderColor = "rgba(255,255,255,0.1)";
            btnTails.style.color = "";
            btnTails.style.boxShadow = "";

            container.querySelector(".heads-badge").textContent = "HEADS";
            container.querySelector(".tails-badge").textContent = "TAILS";
        });

        btnTails.addEventListener("click", () => {
            if (state !== "idle") return;
            selectedSide = "tails";
            btnTails.classList.add("active");
            btnTails.style.borderColor = "var(--cyber-cyan)";
            btnTails.style.color = "var(--cyber-cyan)";
            btnTails.style.boxShadow = "0 0 10px rgba(139,149,143,0.25)";

            btnHeads.classList.remove("active");
            btnHeads.style.borderColor = "rgba(255,255,255,0.1)";
            btnHeads.style.color = "";
            btnHeads.style.boxShadow = "";

            container.querySelector(".heads-badge").textContent = "TAILS";
            container.querySelector(".tails-badge").textContent = "HEADS";
        });

        actionBtn.addEventListener("click", () => {
            if (state !== "idle") return;
            const wager = parseFloat(container.querySelector("#gameWagerInput").value);

            if (VOID_DB.mutators.modifyBalance(wager, "sub")) {
                state = "flipping";
                actionBtn.disabled = true;
                
                // Shuffle rival
                const rivals = ["AstroZero", "BettingBunny", "ZenWhale", "SolSlayer", "WAGMI_Lord"];
                const rival = rivals[Math.floor(Math.random() * rivals.length)];
                viewFrame.querySelector("#pvpRivalName").textContent = rival;
                viewFrame.querySelector("#pvpRivalAvatar").src = "https://api.dicebear.com/7.x/bottts/svg?seed=" + rival + "&backgroundColor=151821";

                status.textContent = "COIN IN AIR... BATTLE STARTED!";
                status.className = "cyan-text font-tech";

                // Reset coin transform rotation classes
                coin.className = "coinflip-coin";
                
                // Force layout reflow
                void coin.offsetWidth;

                // Play flip ignition chimes
                ARCADE_SYNTH.playIgnition();

                // Randomize outcome
                const outcome = Math.random() > 0.5 ? "heads" : "tails";
                
                if (outcome === "heads") {
                    coin.classList.add("coin-flip-animation-heads");
                } else {
                    coin.classList.add("coin-flip-animation-tails");
                }

                triggerMascotReaction("gasping", "Coin is flipped! Flip dynamics active! 🪙");

                setTimeout(() => {
                    state = "idle";
                    actionBtn.disabled = false;
                    
                    // Stop rumble
                    ARCADE_SYNTH.stopTensionAndRumble();

                    const isWin = selectedSide === outcome;

                    if (isWin) {
                        const winVal = wager * 1.98; // 2% house edge Coinflip PvP
                        VOID_DB.mutators.modifyBalance(winVal, "add");
                        VOID_DB.mutators.logBet("BattleFlip PvP", wager, 1.98, winVal, "win");
                        
                        status.textContent = `BATTLE WON (+1.98x ${outcome.toUpperCase()})`;
                        status.className = "electric-green-text font-tech";

                        // Trigger Jackpot Coin Rain!
                        startJackpotCoinRain();

                        ARCADE_SYNTH.playWinCheer();

                        triggerMascotReaction("happy", "PvP Battle won! Coin landed in your favor! 🤑🪙");
                    } else {
                        VOID_DB.mutators.logBet("BattleFlip PvP", wager, 0, 0, "loss");
                        status.textContent = `BATTLE LOST (${outcome.toUpperCase()} DEFEAT)`;
                        status.className = "pink-text font-tech";

                        ARCADE_SYNTH.playLossGlitch();

                        triggerMascotReaction("scared", "Darn, rival took the coin! Flip again!");
                    }
                }, 3000);
            } else {
                showToast("Insufficient cryptocurrency funds!", "error");
            }
        });
    },

    settings(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-sliders cyan-text"></i> System Settings</h1>
            </div>
            <div class="glass-panel" style="padding:30px;">
                <div class="input-label-row" style="margin-bottom:20px;">
                    <h4>Atmospheric audio loops</h4>
                    <button class="btn btn-secondary btn-sm" id="prefSoundTogglerBtn">Enable Audio</button>
                </div>
            </div>
        `;
        
        const toggler = container.querySelector("#prefSoundTogglerBtn");
        toggler.addEventListener("click", () => {
            const bgAudio = document.getElementById("ambientSynthAudio");
            const soundToggleBtn = document.getElementById("soundToggleBtn");
            
            if (bgAudio.paused) {
                bgAudio.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
                toggler.textContent = "Disable Audio";
                soundToggleBtn.querySelector(".sound-on").style.display = "inline-block";
                soundToggleBtn.querySelector(".sound-off").style.display = "none";
            } else {
                bgAudio.pause();
                toggler.textContent = "Enable Audio";
                soundToggleBtn.querySelector(".sound-on").style.display = "none";
                soundToggleBtn.querySelector(".sound-off").style.display = "inline-block";
            }
        });
    },

    helpCenter(container) {
        container.innerHTML = `
            <div class="home-section-header" style="margin-bottom: 24px;">
                <h1 class="section-headline"><i class="fa-solid fa-circle-question cyan-text"></i> Help Center</h1>
            </div>
            <div class="glass-panel" style="padding:30px;">
                <h3 style="margin-bottom:12px;">Frequently Asked Questions</h3>
                <p class="text-muted" style="font-size:14px; margin-bottom:20px;">Have questions about seed generation, rapid Solana transaction processing, or level milestones?</p>
                <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding:12px 0;">
                    <h4 style="margin-bottom:6px;">Is this real currency?</h4>
                    <p style="font-size:12px; color:var(--text-muted);">No. This is a fully interactive Web3 simulation prototype designed to showcase premium high-fluidity visual designs and games.</p>
                </div>
            </div>
        `;
    }
};

// ==========================================================================
// 4. HELPER UTILITY FUNCTIONS & DYNAMIC CONTENT BUILDERS
// ==========================================================================

function createFeedRow() {
    const u = VOID_DB.simulatedUsers[Math.floor(Math.random() * VOID_DB.simulatedUsers.length)];
    const games = ["Rocket Crash", "Gravity Plinko", "MineGrid", "LootRush", "SpinCore", "BattleFlip PvP"];
    const game = games[Math.floor(Math.random() * games.length)];
    const mult = (Math.random() > 0.45) ? (1.1 + Math.random() * 5).toFixed(2) : "0.00";
    const state = (parseFloat(mult) > 0) ? "win" : "loss";
    const unit = "ETH";
    const wager = (0.005 + Math.random() * 0.1).toFixed(4);
    const payout = state === "win" ? (wager * parseFloat(mult)).toFixed(4) : "0.0000";

    const tr = document.createElement("tr");
    tr.style.display = "table-row";
    tr.style.borderBottom = "1px solid rgba(255,255,255,0.01)";
    tr.innerHTML = `
        <td style="padding: 10px; font-family:'Space Grotesk'; font-weight:600;">${game}</td>
        <td style="padding: 10px; color:var(--text-muted);">${u}</td>
        <td style="padding: 10px; color:var(--text-muted); font-size:11px;">02:14:22</td>
        <td style="padding: 10px; text-align:right; font-family:'Space Grotesk';">${wager} ETH</td>
        <td style="padding: 10px; text-align:right; font-family:'Space Grotesk'; font-weight:600;" class="${state === "win" ? "electric-green-text" : "text-muted"}">${mult}x</td>
        <td style="padding: 10px; text-align:right; font-family:'Space Grotesk'; font-weight:700;" class="${state === "win" ? "electric-green-text" : "text-muted"}">${payout} ETH</td>
    `;
    return tr;
}

// Quick Audio synth node scale helper
function playMinesScaleTone(step) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sine";
        // Map step (1-22) to a beautiful harmonic major scale tone
        const baseFreq = 261.63; // C4
        const ratio = Math.pow(2, ((step - 1) * 2) / 12);
        osc.frequency.setValueAtTime(baseFreq * ratio, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    } catch(e) {
        console.log("Audio tone synthesis failed.");
    }
}

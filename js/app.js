/* ==========================================================================
   VOIDBET SPA ROUTER, GENERAL INTERACTION & MASCOT COORDS BINDER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. BOOTSTRAP BIOMETRIC DECRYPTION LOADING SEQUENCER
    // ==========================================================================
    const loader = document.getElementById("globalLoader");
    const progressBar = document.getElementById("loaderProgressBar");
    const progressPercent = document.getElementById("loaderPercent");
    
    let loadPercent = 0;
    const loadInterval = setInterval(() => {
        loadPercent += Math.floor(Math.random() * 8) + 4;
        if (loadPercent >= 100) {
            loadPercent = 100;
            clearInterval(loadInterval);
            progressBar.style.width = "100%";
            progressPercent.textContent = "100%";
            
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);
            }, 300);
        } else {
            progressBar.style.width = loadPercent + "%";
            progressPercent.textContent = loadPercent + "%";
        }
    }, 45);

    // ==========================================================================
    // 2. DETAILED SPA ROUTER PORTAL HUB
    // ==========================================================================
    const viewport = document.getElementById("view-viewport");
    const sidebarLinks = document.querySelectorAll(".sidebar-link, .mobile-nav-item");

    const handleRouting = () => {
        const hash = window.location.hash || "#home";
        const cleanRoute = hash.split("/")[0]; // e.g. #casino
        const subRoute = hash.split("/")[1] || ""; // e.g. crash-x

        // Add view entry exit transition triggers
        viewport.style.opacity = "0";
        viewport.style.transform = "translateY(8px)";
        
        setTimeout(() => {
            // Match viewport targets
            if (cleanRoute === "#home") VOID_COMPONENTS.home(viewport);
            else if (cleanRoute === "#casino") VOID_COMPONENTS.casino(viewport, subRoute);
            else if (cleanRoute === "#sportsbook") VOID_COMPONENTS.sportsbook(viewport);
            else if (cleanRoute === "#live-casino") VOID_COMPONENTS.casino(viewport, "live-blackjack");
            else if (cleanRoute === "#vip") VOID_COMPONENTS.vip(viewport);
            else if (cleanRoute === "#leaderboards") VOID_COMPONENTS.leaderboards(viewport);
            else if (cleanRoute === "#provably-fair") VOID_COMPONENTS.provablyFair(viewport);
            else if (cleanRoute === "#promotions") VOID_COMPONENTS.promotions(viewport);
            else if (cleanRoute === "#challenges") VOID_COMPONENTS.challenges(viewport);
            else if (cleanRoute === "#streamer-hub") VOID_COMPONENTS.streamerHub(viewport);
            else if (cleanRoute === "#affiliate") VOID_COMPONENTS.affiliate(viewport);
            else if (cleanRoute === "#wallet") VOID_COMPONENTS.wallet(viewport);
            else if (cleanRoute === "#profile") VOID_COMPONENTS.profile(viewport);
            else if (cleanRoute === "#settings") VOID_COMPONENTS.settings(viewport);
            else if (cleanRoute === "#help-center") VOID_COMPONENTS.helpCenter(viewport);
            else {
                // Fallback to home portal
                VOID_COMPONENTS.home(viewport);
            }

            viewport.style.opacity = "1";
            viewport.style.transform = "translateY(0)";
            
            // Ensure active skin continues to render visual classes
            const mascotSvg = document.querySelector(".vibex-svg-character");
            if (mascotSvg) {
                mascotSvg.className.baseVal = `vibex-svg-character skin-${VOID_DB.user.activeSkin}`;
            }

            VOID_DB.events.dispatch("viewChanged", { route: cleanRoute });
        }, 150);

        // Highlight active sidebars/tabs links
        sidebarLinks.forEach(link => {
            const dataView = link.dataset.view;
            if (hash.includes(dataView)) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    window.addEventListener("hashchange", handleRouting);
    handleRouting(); // Fire initially

    // Collapsible side navigation handler
    const sidebar = document.getElementById("mainSidebar");
    const chatSidebar = document.getElementById("chatSidebar");
    
    if (window.innerWidth <= 992) {
        sidebar.classList.add("collapsed");
        chatSidebar.classList.add("collapsed");
    }

    document.getElementById("sidebarCollapseBtn").addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

    // ==========================================================================
    // 2.5. MATTE DARK/LIGHT MODE TOGGLE
    // ==========================================================================
    const themeToggleTrack = document.getElementById("themeToggleTrack");
    const themeToggleKnob = document.getElementById("themeToggleKnob");
    const themeToggleIcon = document.getElementById("themeToggleIcon");

    // Restore saved theme
    const savedTheme = localStorage.getItem("voidbet_theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
    } else {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
        if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
    }

    if (themeToggleTrack) {
        themeToggleTrack.addEventListener("click", () => {
            const isCurrentlyDark = document.body.classList.contains("dark-theme");
            
            // Jelly bounce animation
            themeToggleTrack.classList.remove("jelly-animate");
            themeToggleKnob.classList.remove("jelly-animate");
            void themeToggleTrack.offsetWidth; // force reflow
            themeToggleTrack.classList.add("jelly-animate");
            themeToggleKnob.classList.add("jelly-animate");

            if (isCurrentlyDark) {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
                themeToggleIcon.textContent = "☀️";
                localStorage.setItem("voidbet_theme", "light");
                showToast("Light mode activated", "success");
            } else {
                document.body.classList.remove("light-theme");
                document.body.classList.add("dark-theme");
                themeToggleIcon.textContent = "🌙";
                localStorage.setItem("voidbet_theme", "dark");
                showToast("Dark mode activated", "success");
            }

            // Remove animation class after it completes
            setTimeout(() => {
                themeToggleTrack.classList.remove("jelly-animate");
                themeToggleKnob.classList.remove("jelly-animate");
            }, 700);
        });
    }

    // ==========================================================================
    // 3. PREMIUM CURSOR AMBIENT LIGHTING
    // ==========================================================================
    const cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorCurrent = { x: cursorTarget.x, y: cursorTarget.y };

    window.addEventListener("pointermove", (e) => {
        cursorTarget.x = e.clientX;
        cursorTarget.y = e.clientY;
    }, { passive: true });

    const animateCursorGlow = () => {
        cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.12;
        cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.12;
        document.body.style.setProperty("--cursor-x", `${cursorCurrent.x}px`);
        document.body.style.setProperty("--cursor-y", `${cursorCurrent.y}px`);
        requestAnimationFrame(animateCursorGlow);
    };
    animateCursorGlow();

    // ==========================================================================
    // 4. PERSISTENT DISNEY MASCOT VIBEX CURSOR EYE-TRACKING & REACTIONS
    // ==========================================================================
    const leftPupil = document.getElementById("mascotLeftPupil");
    const rightPupil = document.getElementById("mascotRightPupil");
    const mascotIcon = document.getElementById("mascotInteractiveIcon");
    const bubble = document.getElementById("mascotSpeechBubble");
    const speechText = document.getElementById("mascotSpeechText");

    // Coordinates tracking binding
    window.addEventListener("mousemove", (e) => {
        if (!leftPupil || !rightPupil) return;

        const lx = leftPupil.getBoundingClientRect().left + 8;
        const ly = leftPupil.getBoundingClientRect().top + 10;
        const rx = rightPupil.getBoundingClientRect().left + 8;
        const ry = rightPupil.getBoundingClientRect().top + 10;

        const maxOffset = 6.0; // limit pupillary travel limit
        
        // Left Eye calculations
        const ldx = e.clientX - lx;
        const ldy = e.clientY - ly;
        const ldist = Math.sqrt(ldx*ldx + ldy*ldy);
        const lAngle = Math.atan2(ldy, ldx);
        const lTravel = Math.min(ldist * 0.05, maxOffset);
        
        // Right Eye calculations
        const rdx = e.clientX - rx;
        const rdy = e.clientY - ry;
        const rdist = Math.sqrt(rdx*rdx + rdy*rdy);
        const rAngle = Math.atan2(rdy, rdx);
        const rTravel = Math.min(rdist * 0.05, maxOffset);

        // Map values into CSS target parameters
        leftPupil.style.setProperty("--left-eye-x", (Math.cos(lAngle) * lTravel) + "px");
        leftPupil.style.setProperty("--left-eye-y", (Math.sin(lAngle) * lTravel) + "px");

        rightPupil.style.setProperty("--right-eye-x", (Math.cos(rAngle) * rTravel) + "px");
        rightPupil.style.setProperty("--right-eye-y", (Math.sin(rAngle) * rTravel) + "px");
    });

    // Periodic Mascot speaking alerts
    const tips = [
        "Pro tip: Adjust Plinko risk selection to High for insane 28x sectors! 🔵",
        "Verify your game hash at any time inside the Provably Fair modal. Secure tech!",
        "Feeling a parlay? Sentinels and Celtics are both showing strong prices right now.",
        "Secure weekly reloads in the VIP Platinum tab. Level 15 is just around the corner!",
        "Uncovered a bomb in Mines Void? Try reducing the mine ratio count to 1 for safer gems!"
    ];

    setInterval(() => {
        if (Math.random() > 0.4) {
            triggerMascotSpeak(tips[Math.floor(Math.random() * tips.length)]);
        }
    }, 25000);

    // Context-Aware AI Tipping System triggered on SPA routing
    VOID_DB.events.on("viewChanged", (data) => {
        const route = data.route;
        let speech = "";
        let reaction = "happy";

        if (route === "#home") {
            speech = "Welcome back. Your daily reward is ready whenever you are.";
        } else if (route === "#casino") {
            speech = "Casino Portal fully loaded! Check out Mines Void or Coinflip PvP! 🚀🎮";
        } else if (route === "#casino/crash-x") {
            speech = "Pro tip: Set Rocket Crash auto-cashout at 1.80x and raise your wagers incrementally. Secure trajectory! 🚀";
            reaction = "happy";
        } else if (route === "#casino/plinko-neo") {
            speech = "Physics engines active! Gravity Plinko risk level is variable. Drop some spheres! 🔵💥";
        } else if (route === "#casino/mines-void") {
            speech = "Safe gem sweep formula: Set MineGrid ratio to 3, place a wager, and let the Mole Miner guide you! 💎🛡️";
        } else if (route === "#casino/lootbox-rush") {
            speech = "Loot Crate ready! Watch out for mimic traps, Omega crates yield massive 20.0x rewards! 🎁⚡";
        } else if (route === "#casino/wheel-chaos") {
            speech = "SpinCore is live. The 5.0x sector is the premium target.";
        } else if (route === "#casino/coinflip-pvp") {
            speech = "PvP BattleFlip flipping! Heads has a historical 51.2% rate right now. Fight the rival! 🪙⚔️";
        } else if (route === "#sportsbook") {
            speech = "VCT Champions is live! SENTINELS combined parlay odds boost is active! Play the safe MMA Jon Jones bet! 🎮📈";
        } else if (route === "#vip") {
            speech = "Level 15 unlocks VIP Silver Cashback reloads! Double your XP gains by playing Coinflip PvP! 👑✨";
        } else if (route === "#provably-fair") {
            speech = "Hashed transparency! Use standard SHA-256 verifiers to assert game seeds yourself. 🛡️🔐";
        } else if (route === "#wallet") {
            speech = "Metamask instant deposit syncer active. Withdrawal takes exactly 2 seconds to hit your wallet pipeline. ⚡💼";
        }

        if (speech) {
            setTimeout(() => {
                triggerMascotReaction(reaction, speech);
            }, 600);
        }
    });

    // Speak bubble show close helper
    if (mascotIcon && bubble) {
        mascotIcon.addEventListener("click", () => {
            bubble.classList.toggle("active");
        });
    }

    // Trigger dialogue speech bubbles
    window.triggerMascotSpeak = (txt) => {
        if (!speechText || !bubble) return;
        speechText.textContent = txt;
        bubble.classList.add("active");
        setTimeout(() => {
            if (bubble) bubble.classList.remove("active");
        }, 6500);
    };

    // Emotional reacts states
    window.triggerMascotReaction = (emotion, speech = "") => {
        const wrap = document.getElementById("mascotWrapper");
        if (wrap) {
            wrap.className = `mascot-widget-wrapper mascot-${emotion}`;
        }
        if (speech) {
            triggerMascotSpeak(speech);
        }

        setTimeout(() => {
            if (wrap) wrap.className = "mascot-widget-wrapper";
        }, 5000);
    };

    // Mascot eye blinking loop
    setInterval(() => {
        const character = document.querySelector(".vibex-svg-character");
        if (!character) return;
        character.style.opacity = "0.9";
        setTimeout(() => {
            if (character) character.style.opacity = "1";
        }, 120);
    }, 6000);

    // ==========================================================================
    // 5. CRYPTO BALANCE SELECTION & VALUE UPDATES
    // ==========================================================================
    const balDisplayBtn = document.getElementById("balanceDisplayBtn");
    const balDropdown = document.getElementById("balanceDropdownPanel");
    const walletIcon = document.getElementById("activeWalletIcon");
    const headerBal = document.getElementById("headerBalanceValue");
    const headerUnit = document.getElementById("headerBalanceUnit");

    balDisplayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("balanceDisplayBtn").parentElement.classList.toggle("dropdown-open");
    });

    window.addEventListener("click", () => {
        document.getElementById("balanceDisplayBtn").parentElement.classList.remove("dropdown-open");
    });

    // Dropdown row click selector
    document.querySelectorAll(".crypto-select-row").forEach(row => {
        row.addEventListener("click", () => {
            const currency = row.dataset.currency;
            VOID_DB.mutators.setActiveCurrency(currency);

            // Highlight row active
            document.querySelectorAll(".crypto-select-row").forEach(r => r.classList.remove("active"));
            row.classList.add("active");

            // Update UI headers
            let iconClass = "fa-brands fa-ethereum eth-color";
            if (currency === "SOL") iconClass = "fa-solid fa-sun sol-color";
            if (currency === "BTC") iconClass = "fa-brands fa-bitcoin btc-color";
            if (currency === "USDT") iconClass = "fa-solid fa-dollar usdt-color";
            if (currency === "BNB") iconClass = "fa-solid fa-cube eth-color";
            if (currency === "DOGE") iconClass = "fa-solid fa-dog usdt-color";
            if (currency === "XRP") iconClass = "fa-solid fa-wave-square eth-color";

            walletIcon.innerHTML = `<i class="${iconClass}"></i>`;
            headerBal.textContent = VOID_DB.user.balances[currency].toFixed(currency === "USDT" || currency === "DOGE" ? 2 : 5);
            headerUnit.textContent = currency;

            showToast(`Active balance shifted to ${currency}!`, "success");
        });
    });

    // Event balance subscription
    VOID_DB.events.on("balanceUpdated", (data) => {
        if (data.currency === VOID_DB.user.activeCurrency) {
            headerBal.textContent = data.balance.toFixed(data.currency === "USDT" || data.currency === "DOGE" ? 2 : 5);
        }
        // Update values inside selector
        document.getElementById("dropValETH").textContent = VOID_DB.user.balances.ETH.toFixed(4) + " ETH";
        document.getElementById("dropValSOL").textContent = VOID_DB.user.balances.SOL.toFixed(2) + " SOL";
        document.getElementById("dropValBTC").textContent = VOID_DB.user.balances.BTC.toFixed(5) + " BTC";
        document.getElementById("dropValUSDT").textContent = VOID_DB.user.balances.USDT.toFixed(2) + " USDT";
        document.getElementById("dropValBNB").textContent = VOID_DB.user.balances.BNB.toFixed(4) + " BNB";
        document.getElementById("dropValDOGE").textContent = VOID_DB.user.balances.DOGE.toFixed(2) + " DOGE";
        document.getElementById("dropValXRP").textContent = VOID_DB.user.balances.XRP.toFixed(2) + " XRP";
    });

    // ==========================================================================
    // 6. MODALS INTERACTION & WALLET PANEL MANAGER
    // ==========================================================================
    const walletModal = document.getElementById("globalWalletModal");
    
    window.openWalletTab = (tabSelect = "ETH") => {
        walletModal.classList.add("active");
        
        // Select deposit default and toggle currency
        document.getElementById("modalTabDepositBtn").classList.add("active");
        document.getElementById("modalTabWithdrawBtn").classList.remove("active");
        document.getElementById("modalDepositPanel").classList.add("active");
        document.getElementById("modalWithdrawPanel").classList.remove("active");

        renderDepositCryptoRows();
    };

    document.getElementById("headerDepositBtn").addEventListener("click", () => openWalletTab("ETH"));
    document.getElementById("headerWalletOpenBtn").addEventListener("click", () => openWalletTab("ETH"));
    document.getElementById("closeWalletModalBtn").addEventListener("click", () => walletModal.classList.remove("active"));

    // Tab buttons deposit withdraw switcher
    document.getElementById("modalTabDepositBtn").addEventListener("click", () => {
        document.getElementById("modalTabDepositBtn").classList.add("active");
        document.getElementById("modalTabWithdrawBtn").classList.remove("active");
        document.getElementById("modalDepositPanel").classList.add("active");
        document.getElementById("modalWithdrawPanel").classList.remove("active");
    });
    document.getElementById("modalTabWithdrawBtn").addEventListener("click", () => {
        document.getElementById("modalTabDepositBtn").classList.remove("active");
        document.getElementById("modalTabWithdrawBtn").classList.add("active");
        document.getElementById("modalDepositPanel").classList.remove("active");
        document.getElementById("modalWithdrawPanel").classList.add("active");
        
        // Populate fast Max helper value
        const cur = VOID_DB.user.activeCurrency;
        document.getElementById("withdrawMaxHelper").textContent = `Max: ${VOID_DB.user.balances[cur].toFixed(4)} ${cur}`;
    });

    const renderDepositCryptoRows = () => {
        const depositGrid = document.getElementById("depositCryptoSelector");
        depositGrid.innerHTML = "";
        
        const currencies = ["ETH", "SOL", "BTC", "USDT", "BNB", "DOGE", "XRP"];
        currencies.forEach(cur => {
            const card = document.createElement("div");
            card.className = `wallet-crypto-row-selector-card ${cur === VOID_DB.user.activeCurrency ? "active" : ""}`;
            
            let iconClass = "fa-brands fa-ethereum eth-color";
            if (cur === "SOL") iconClass = "fa-solid fa-sun sol-color";
            if (cur === "BTC") iconClass = "fa-brands fa-bitcoin btc-color";
            if (cur === "USDT") iconClass = "fa-solid fa-dollar usdt-color";
            if (cur === "BNB") iconClass = "fa-solid fa-cube eth-color";
            if (cur === "DOGE") iconClass = "fa-solid fa-dog usdt-color";
            if (cur === "XRP") iconClass = "fa-solid fa-wave-square eth-color";

            card.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${cur}</span>
            `;
            card.addEventListener("click", () => {
                // Shift deposit personal string
                document.querySelectorAll(".wallet-crypto-row-selector-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");

                const addresses = {
                    ETH: "0x34C8d154Ef22f18378A5861b58B6D84a60db881A",
                    SOL: "solB6D84a60db881AXS34C8d154Ef22f18378A58",
                    BTC: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                    USDT: "0xTetherUSDT34C8d154Ef22f18378A5861b58B6D8",
                    BNB: "bnbBSCb6D84a60db881AXS34C8d154Ef22f18378A",
                    DOGE: "DOGEd154Ef22f18378A5861b58B6D84a60db881A",
                    XRP: "rXRPd154Ef22f18378A5861b58B6D84a60db881A"
                };
                document.getElementById("depositAddressStr").textContent = addresses[cur];
            });
            depositGrid.appendChild(card);
        });

        // Trigger address population initial
        depositGrid.querySelector(".wallet-crypto-row-selector-card.active").click();
    };

    // Clipboard copy mechanism
    document.getElementById("copyAddressBtn").addEventListener("click", () => {
        const text = document.getElementById("depositAddressStr").textContent;
        navigator.clipboard.writeText(text);
        showToast("Personal deposit address copied to clipboard!", "success");
    });

    // Max withdraw helper button
    const withdrawAmount = document.getElementById("withdrawAmountInput");
    document.getElementById("withdrawMaxBtn").addEventListener("click", () => {
        const cur = document.getElementById("withdrawCurrencySelect").value;
        withdrawAmount.value = VOID_DB.user.balances[cur].toFixed(4);
        triggerWithdrawalCalculations();
    });

    const triggerWithdrawalCalculations = () => {
        const amount = parseFloat(withdrawAmount.value) || 0;
        const gas = 0.001;
        document.getElementById("withdrawReceiveVal").textContent = Math.max(0, amount - gas).toFixed(4) + " " + document.getElementById("withdrawCurrencySelect").value;
    };
    withdrawAmount.addEventListener("input", triggerWithdrawalCalculations);

    // Process Withdrawal submission
    document.getElementById("withdrawSubmitBtn").addEventListener("click", () => {
        const cur = document.getElementById("withdrawCurrencySelect").value;
        const addr = document.getElementById("withdrawAddressInput").value;
        const amount = parseFloat(withdrawAmount.value);

        if (!addr) {
            showToast("Destination recipient address cannot be empty!", "error");
            return;
        }

        if (VOID_DB.mutators.withdrawFunds(amount, cur)) {
            showToast("Withdrawal request dispatched to blockchain pipeline! Processing.", "success");
            walletModal.classList.remove("active");
            withdrawAmount.value = "";
            document.getElementById("withdrawAddressInput").value = "";

            triggerMascotReaction("happy", "Withdrawal cleared! Payout complete in 2 seconds. ⚡🤑");
        } else {
            showToast("Insufficient cryptocurrency funds!", "error");
        }
    });

    // ==========================================================================
    // 7. PROVABLY FAIR VERIFIER MODAL INITIALIZER
    // ==========================================================================
    const pfModal = document.getElementById("provablyFairModal");
    window.openProvablyFairModal = () => {
        pfModal.classList.add("active");
        
        // Generate mock verifiable server seed hex
        const mockHex = "f38a5b28d6c771489e2b9c7fa83421e2b9c7fa83421e2b9c7fa83421e2b9";
        document.getElementById("pfServerSeedHashed").value = "Hashed: " + mockHex.substring(0, 32) + "...";
        document.getElementById("pfServerSeedClear").value = "Hashed: " + mockHex;
        
        triggerFairnessCalculation();
    };

    document.getElementById("closeProvablyFairModalBtn").addEventListener("click", () => pfModal.classList.remove("active"));

    const triggerFairnessCalculation = () => {
        const client = document.getElementById("pfClientSeed").value;
        const nonce = document.getElementById("pfNonce").value;
        
        document.getElementById("pfCombinatorString").textContent = `Server_Seed:${client}:${nonce}`;
        
        // Simulate SHA-256 result hash string
        const hash = "e77b4f7a268a5b28d6c771489e2b9c7fa83421e2b9c7fa83421e2b9c7fa83421";
        document.getElementById("pfHashResult").textContent = hash.substring(0, 20) + "...[Secured Hex]";
    };

    document.getElementById("pfClientSeed").addEventListener("input", triggerFairnessCalculation);
    document.getElementById("pfNonce").addEventListener("input", triggerFairnessCalculation);
    
    document.getElementById("pfGenerateSeedBtn").addEventListener("click", () => {
        const clientIn = document.getElementById("pfClientSeed");
        clientIn.value = "VoidBetClientSeed_" + Math.floor(1000 + Math.random()*9000);
        triggerFairnessCalculation();
        showToast("Verifiable game seeds rotated!", "success");
    });

    // ==========================================================================
    // 8. LOOTBOX REWARD POPUP MODULE
    // ==========================================================================
    const lootModal = document.getElementById("lootboxCelebrationModal");
    const lootOpenBtn = document.getElementById("lootboxOpenBtn");
    const lootResult = document.getElementById("lootResultCard");
    const lootModel = document.getElementById("lootboxVisualNode");

    window.openLootboxCelebration = () => {
        lootModal.classList.add("active");
        lootOpenBtn.style.display = "inline-flex";
        lootResult.style.display = "none";
        lootModel.style.display = "block";
    };

    lootOpenBtn.addEventListener("click", () => {
        // Trigger glitch particle shake
        lootModel.classList.add("glitch-shake");
        lootOpenBtn.disabled = true;

        setTimeout(() => {
            lootModel.style.display = "none";
            lootOpenBtn.style.display = "none";
            lootOpenBtn.disabled = false;

            // Roll loot prize
            const val = 0.01 + Math.random() * 0.1;
            const cur = VOID_DB.user.activeCurrency;
            VOID_DB.mutators.modifyBalance(val, "add");
            
            document.getElementById("lootResultValue").textContent = `+${val.toFixed(4)} ${cur}`;
            document.getElementById("lootResultDesc").textContent = `VOID PLATINUM REWARD ADDED!`;
            
            lootResult.style.display = "block";
            triggerMascotReaction("happy", `Loot box unlocked! Printed +${val.toFixed(2)} ${cur}! 🤑`);
        }, 1500);
    });

    document.getElementById("lootboxClaimBtn").addEventListener("click", () => {
        lootModal.classList.remove("active");
        showToast("Rewards synchronized across wallet balances!", "success");
    });

    // ==========================================================================
    // 9. HEADER SOUND SYNTH ATMOSPHERE LOOP CONTROL & WEB AUDIO SYNTH ENGINE
    // ==========================================================================
    const bgAudio = document.getElementById("ambientSynthAudio");
    const soundBtn = document.getElementById("soundToggleBtn");

    let synthInterval;
    let synthCtx;
    let activeSynthNodes = [];
    let audioInitialized = false;  // Track global audio activation state
    let ambientEnabled = false;    // Track ambient music toggle state

    // Shared AudioContext for click sounds (reused to avoid creating many contexts)
    let clickCtx = null;
    const getClickCtx = () => {
        if (!clickCtx || clickCtx.state === "closed") {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            clickCtx = new AudioContextClass();
        }
        if (clickCtx.state === "suspended") clickCtx.resume();
        return clickCtx;
    };

    // Natively synthesized liquid/water coin drop on click using oscillators
    // This ALWAYS plays after user's first gesture, regardless of sound toggle
    window.playWaterCoinClick = () => {
        if (!audioInitialized) return; // Only gate on first interaction
        if (window._VOIDBET_MUTED) return; // Mute when global sound is disabled

        try {
            const ctx = getClickCtx();
            
            // Resonance bubble (rapid slide up then down)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(580, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.05);
            osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
            
            // High metal drop impact
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(2600, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
            
            gain2.gain.setValueAtTime(0.001, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.015);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            // Water splash shimmer
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = "triangle";
            osc3.frequency.setValueAtTime(4200, ctx.currentTime);
            osc3.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);
            gain3.gain.setValueAtTime(0.001, ctx.currentTime);
            gain3.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
            gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            
            osc.start();
            osc2.start();
            osc3.start();
            osc.stop(ctx.currentTime + 0.25);
            osc2.stop(ctx.currentTime + 0.15);
            osc3.stop(ctx.currentTime + 0.12);
        } catch (e) {
            console.log("Click sound failed:", e);
        }
    };

    // Bind click sound globally to all interactive elements
    window.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest("button") || target.closest("a") || target.closest(".odds-coefficient-btn") || target.closest(".mine-tile") || target.closest(".sidebar-link") || target.closest(".crypto-select-row") || target.closest(".emote-pill") || target.closest(".game-lobby-card") || target.closest(".modal-tab-btn")) {
            playWaterCoinClick();
        }
    });

    // Beautiful smooth ambient synth pad generator
    window.startAmbientSynthTrack = () => {
        try {
            if (synthCtx && synthCtx.state !== "closed") return; // Already running
            
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            synthCtx = new AudioContextClass();
            if (synthCtx.state === "suspended") {
                synthCtx.resume();
            }
            
            // Master compressor for smooth volume
            const compressor = synthCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-24, synthCtx.currentTime);
            compressor.knee.setValueAtTime(30, synthCtx.currentTime);
            compressor.ratio.setValueAtTime(12, synthCtx.currentTime);
            compressor.connect(synthCtx.destination);
            
            const chords = [
                { bass: 65.41, pad: [130.81, 155.56, 196.00] }, // Cmin
                { bass: 51.91, pad: [103.83, 130.81, 155.56] }, // Abmaj
                { bass: 58.27, pad: [116.54, 146.83, 174.61] }, // Bbmaj
                { bass: 49.00, pad: [98.00,  116.54, 146.83] }  // Gmin
            ];
            
            let currentChord = 0;
            
            const playNextChord = () => {
                if (!synthCtx || synthCtx.state === "closed") return;
                if (synthCtx.state === "suspended") {
                    synthCtx.resume();
                }
                
                const chord = chords[currentChord];
                const now = synthCtx.currentTime;
                const duration = 6.5;
                
                // Lush low-pass filter sweep
                const filter = synthCtx.createBiquadFilter();
                filter.type = "lowpass";
                filter.Q.setValueAtTime(1.5, now);
                filter.frequency.setValueAtTime(250, now);
                filter.frequency.exponentialRampToValueAtTime(750, now + duration * 0.5);
                filter.frequency.exponentialRampToValueAtTime(250, now + duration);
                filter.connect(compressor);
                
                // Reverb-like delay for spaciousness
                const delay = synthCtx.createDelay(0.5);
                delay.delayTime.setValueAtTime(0.3, now);
                const delayGain = synthCtx.createGain();
                delayGain.gain.setValueAtTime(0.15, now);
                delay.connect(delayGain);
                delayGain.connect(compressor);
                
                // Deep Triangle sub bass
                const bassOsc = synthCtx.createOscillator();
                const bassGain = synthCtx.createGain();
                bassOsc.type = "triangle";
                bassOsc.frequency.setValueAtTime(chord.bass, now);
                
                bassGain.gain.setValueAtTime(0, now);
                bassGain.gain.linearRampToValueAtTime(0.2, now + 1.5);
                bassGain.gain.linearRampToValueAtTime(0.2, now + duration - 1.5);
                bassGain.gain.linearRampToValueAtTime(0, now + duration);
                
                bassOsc.connect(bassGain);
                bassGain.connect(filter);
                bassOsc.start(now);
                bassOsc.stop(now + duration);
                activeSynthNodes.push(bassOsc);
                
                // Lush detuned sawtooth chords with stereo spread
                chord.pad.forEach((freq, idx) => {
                    // Main oscillator
                    const osc = synthCtx.createOscillator();
                    const gainNode = synthCtx.createGain();
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(freq + (idx * 0.35), now);
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(0.04, now + 2.0);
                    gainNode.gain.linearRampToValueAtTime(0.04, now + duration - 2.0);
                    gainNode.gain.linearRampToValueAtTime(0, now + duration);
                    
                    osc.connect(gainNode);
                    gainNode.connect(filter);
                    gainNode.connect(delay); // Route through delay for reverb-like effect
                    osc.start(now);
                    osc.stop(now + duration);
                    activeSynthNodes.push(osc);
                    
                    // Detuned chorus double for shimmer
                    const osc2 = synthCtx.createOscillator();
                    const gainNode2 = synthCtx.createGain();
                    osc2.type = "sine";
                    osc2.frequency.setValueAtTime(freq * 2 + (idx * 0.7), now);
                    
                    gainNode2.gain.setValueAtTime(0, now);
                    gainNode2.gain.linearRampToValueAtTime(0.008, now + 2.0);
                    gainNode2.gain.linearRampToValueAtTime(0.008, now + duration - 2.0);
                    gainNode2.gain.linearRampToValueAtTime(0, now + duration);
                    
                    osc2.connect(gainNode2);
                    gainNode2.connect(filter);
                    osc2.start(now);
                    osc2.stop(now + duration);
                    activeSynthNodes.push(osc2);
                });
                
                currentChord = (currentChord + 1) % chords.length;
            };
            
            playNextChord();
            synthInterval = setInterval(playNextChord, 6000);
        } catch (e) {
            console.log("Synthesizer loop start error:", e);
        }
    };

    window.stopAmbientSynthTrack = () => {
        clearInterval(synthInterval);
        activeSynthNodes.forEach(node => {
            try { node.stop(); } catch (e) {}
        });
        activeSynthNodes = [];
        if (synthCtx) {
            try { synthCtx.close(); } catch (e) {}
            synthCtx = null;
        }
    };

    // ===== FIRST USER GESTURE ACTIVATOR =====
    // This fires on the very first click/keydown anywhere, initializing ALL audio
    const triggerAudioGlobalActivation = () => {
        if (audioInitialized) return;
        audioInitialized = true;

        // 1. Try external MP3 (optional, may fail on CORS/file://)
        bgAudio.volume = 0.3;
        bgAudio.play().catch(() => {
            console.log("External MP3 blocked (CORS/autoplay). Using Web Audio synth instead.");
        });

        // 2. Start the Web Audio synth pad (this ALWAYS works after gesture)
        startAmbientSynthTrack();
        ambientEnabled = true;

        // 3. Init game audio engine
        ARCADE_SYNTH.init();

        // 4. Update UI to show sound is ON
        soundBtn.querySelector(".sound-on").style.display = "inline-block";
        soundBtn.querySelector(".sound-off").style.display = "none";
        showToast("Audio ambience enabled", "success");

        // Remove listeners after first activation
        document.removeEventListener("click", triggerAudioGlobalActivation);
        document.removeEventListener("keydown", triggerAudioGlobalActivation);
        document.removeEventListener("touchstart", triggerAudioGlobalActivation);
    };
    
    // Register on multiple gesture types for maximum coverage
    document.addEventListener("click", triggerAudioGlobalActivation);
    document.addEventListener("keydown", triggerAudioGlobalActivation);
    document.addEventListener("touchstart", triggerAudioGlobalActivation);

    // Sound toggle button: controls ALL sound (ambient + game sounds)
    soundBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Ensure audio system is initialized first
        if (!audioInitialized) {
            triggerAudioGlobalActivation();
            return;
        }

        if (ambientEnabled) {
            // === MUTE ALL SOUNDS ===
            // Stop MP3 audio
            try { bgAudio.pause(); bgAudio.currentTime = 0; } catch(e){}
            
            // Stop synth ambient track
            try { stopAmbientSynthTrack(); } catch(e){}
            
            // Stop all game audio
            try { ARCADE_SYNTH.stopTensionAndRumble(); } catch(e){}
            if (ARCADE_SYNTH.ctx) {
                try { ARCADE_SYNTH.ctx.suspend(); } catch(e){}
            }
            
            // Set global mute flag
            window._VOIDBET_MUTED = true;
            ambientEnabled = false;
            
            soundBtn.querySelector(".sound-on").style.display = "none";
            soundBtn.querySelector(".sound-off").style.display = "inline-block";
            showToast("🔇 All sounds muted", "success");
        } else {
            // === UNMUTE ALL SOUNDS ===
            window._VOIDBET_MUTED = false;
            
            // Resume MP3
            try { bgAudio.volume = 0.3; bgAudio.play().catch(() => {}); } catch(e){}
            
            // Restart synth
            try { startAmbientSynthTrack(); } catch(e){}
            
            // Resume game audio
            try { ARCADE_SYNTH.init(); } catch(e){}
            if (ARCADE_SYNTH.ctx && ARCADE_SYNTH.ctx.state === "suspended") {
                try { ARCADE_SYNTH.ctx.resume(); } catch(e){}
            }
            
            ambientEnabled = true;
            soundBtn.querySelector(".sound-on").style.display = "inline-block";
            soundBtn.querySelector(".sound-off").style.display = "none";
            showToast("🔊 All sounds enabled! 🎵", "success");
        }
    });

    // ==========================================================================
    // 10. SOCIAL COMMUNITY LOBBY CHATROOMS & ACTIVE MESSAGES FEED
    // ==========================================================================
    const chatContainer = document.getElementById("chatMessagesBox");
    const chatIn = document.getElementById("chatInputText");
    const chatSend = document.getElementById("chatSendMsgBtn");

    const renderChatMessages = () => {
        chatContainer.innerHTML = "";
        VOID_DB.chatMessages.forEach(msg => {
            appendChatMessage(msg);
        });
    };

    const appendChatMessage = (msg, self = false) => {
        const row = document.createElement("div");
        row.className = `chat-msg-row ${self ? "self" : ""}`;
        row.innerHTML = `
            <div class="chat-msg-meta">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${msg.username}&backgroundColor=151821" alt="" class="chat-user-avatar">
                <span class="chat-username">${msg.username}</span>
                ${msg.clan ? `<span class="chat-clan-tag">${msg.clan}</span>` : ""}
                <span class="chat-time">${msg.time}</span>
            </div>
            <div class="chat-bubble">${msg.text}</div>
        `;
        chatContainer.appendChild(row);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    renderChatMessages();

    // Send active custom chat text
    const sendChatMessageAction = () => {
        const text = chatIn.value.trim();
        if (!text) return;

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

        const newMsg = {
            username: VOID_DB.user.username,
            clan: VOID_DB.user.clan,
            text,
            time: timeStr
        };

        appendChatMessage(newMsg, true);
        chatIn.value = "";
        
        // Add minimal reward XP on participation
        VOID_DB.mutators.addXp(120);

        // Mascot reacts
        if (Math.random() > 0.6) {
            setTimeout(() => {
                triggerMascotReaction("happy", "Message sent. The lobby is warming up.");
            }, 1000);
        }
    };

    chatSend.addEventListener("click", sendChatMessageAction);
    chatIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendChatMessageAction();
    });

    // Chat emote pill click injections
    document.querySelectorAll(".emote-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            chatIn.value += pill.dataset.emote;
            chatIn.focus();
        });
    });

    // Sidebar chat panel collapse handler
    document.getElementById("chatDrawerToggleBtn").addEventListener("click", () => {
        document.getElementById("chatSidebar").classList.toggle("collapsed");
    });

    // Switch chat tabs
    document.getElementById("chatTabRoomBtn").addEventListener("click", () => {
        document.getElementById("chatTabRoomBtn").classList.add("active");
        document.getElementById("chatTabBetsBtn").classList.remove("active");
        document.getElementById("chatRoomPanel").classList.add("active");
        document.getElementById("chatBetsPanel").classList.remove("active");
    });

    document.getElementById("chatTabBetsBtn").addEventListener("click", () => {
        document.getElementById("chatTabRoomBtn").classList.remove("active");
        document.getElementById("chatTabBetsBtn").classList.add("active");
        document.getElementById("chatRoomPanel").classList.remove("active");
        document.getElementById("chatBetsPanel").classList.add("active");
        
        // Populate live bet feed initial
        populateSimulatedBetsFeed();
    });

    // Simulated bets feed visual
    const betFeedPanel = document.getElementById("liveBetsTickerBox");
    const populateSimulatedBetsFeed = () => {
        betFeedPanel.innerHTML = "";
        for (let i = 0; i < 8; i++) {
            betFeedPanel.appendChild(createSimulatedBetRow());
        }
    };

    const createSimulatedBetRow = () => {
        const game = VOID_DB.casinoGames[Math.floor(Math.random() * VOID_DB.casinoGames.length)].name;
        const player = VOID_DB.simulatedUsers[Math.floor(Math.random() * VOID_DB.simulatedUsers.length)];
        const multiplier = (Math.random() > 0.45) ? (1.1 + Math.random() * 5).toFixed(2) : "0.00";
        const state = (parseFloat(multiplier) > 0) ? "win" : "loss";
        const unit = "ETH";
        const wager = (0.005 + Math.random() * 0.1).toFixed(4);
        const payout = state === "win" ? (wager * parseFloat(multiplier)).toFixed(4) : "0.0000";

        const div = document.createElement("div");
        div.className = "bet-ticker-row";
        div.innerHTML = `
            <span class="ticker-game-tag">${game}</span>
            <span class="ticker-uname">${player}</span>
            <span class="ticker-multiplier ${state === "win" ? "ticker-win" : "ticker-loss"}">${multiplier}x</span>
            <span class="ticker-payout ${state === "win" ? "ticker-win" : "ticker-loss"}">${payout} ${unit}</span>
        `;
        return div;
    };

    // ==========================================================================
    // 11. CENTRALIZED INTERACTION OBSERVER EVENT DISPATCHERS
    // ==========================================================================
    VOID_DB.events.on("simulatedChatAdded", (msg) => {
        if (document.getElementById("chatRoomPanel").classList.contains("active")) {
            appendChatMessage(msg);
        }
    });

    VOID_DB.events.on("simulatedBetAdded", (bet) => {
        if (document.getElementById("chatBetsPanel").classList.contains("active")) {
            const row = document.createElement("div");
            row.className = "bet-ticker-row";
            row.innerHTML = `
                <span class="ticker-game-tag">${bet.game}</span>
                <span class="ticker-uname">${bet.player}</span>
                <span class="ticker-multiplier ${bet.state === "win" ? "ticker-win" : "ticker-loss"}">${bet.multiplier}</span>
                <span class="ticker-payout ${bet.state === "win" ? "ticker-win" : "ticker-loss"}">${bet.payout}</span>
            `;
            betFeedPanel.insertBefore(row, betFeedPanel.firstChild);
            if (betFeedPanel.children.length > 20) betFeedPanel.lastChild.remove();
        }
    });

    // User level up popup chimes
    VOID_DB.events.on("levelUp", (data) => {
        showToast(`RANK UP UPGRADE! LEVEL ${data.level} REACHED!`, "success");
        triggerMascotReaction("happy", `Boom! Ranked up to Level ${data.level}! VIP ${data.vip} tier activated! 👑🔥`);
    });

    // Global Interactive notifications toast
    window.showToast = (msg, type = "success") => {
        const toastBox = document.getElementById("toastNotification");
        const card = document.createElement("div");
        card.className = `toast-card ${type}`;
        
        let icon = `<i class="fa-solid fa-circle-check cyan-text"></i>`;
        if (type === "error") icon = `<i class="fa-solid fa-circle-xmark pink-text"></i>`;

        card.innerHTML = `
            ${icon}
            <span>${msg}</span>
        `;
        toastBox.appendChild(card);

        setTimeout(() => {
            card.style.opacity = "0";
            card.style.transform = "translateX(50px)";
            setTimeout(() => {
                card.remove();
            }, 300);
        }, 4000);
    };

    // Auto trigger initial tip bubble from mascot
    setTimeout(() => {
        triggerMascotSpeak("Welcome to VoidBet. Click me any time for wagering tips.");
    }, 4500);

    // ==========================================================================
    // AUDITED: FULL SCREEN HOLOGRAPHIC REWARDS COIN RAIN ENGINE
    // ==========================================================================
    const rainCanvas = document.getElementById("jackpotRainCanvas");
    const rainCtx = rainCanvas.getContext("2d");
    let rainParticles = [];
    let isRainActive = false;
    let rainAnimId;

    const resizeRainCanvas = () => {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeRainCanvas);
    resizeRainCanvas();

    window.startJackpotCoinRain = () => {
        if (isRainActive) return;
        isRainActive = true;
        rainCanvas.classList.add("active");
        
        rainParticles = [];
        const coins = ["SOL", "BTC", "ETH", "USDT", "DOGE"];
        
        // Spawn 70 rotating coin entities
        for (let i = 0; i < 70; i++) {
            rainParticles.push({
                x: Math.random() * rainCanvas.width,
                y: -50 - Math.random() * 250,
                vy: 4 + Math.random() * 5,
                radius: 12 + Math.random() * 8,
                rot: Math.random() * Math.PI,
                rotSpeed: 0.05 + Math.random() * 0.1,
                label: coins[Math.floor(Math.random() * coins.length)],
                color: i % 2 === 0 ? "#c99a4e" : "#8b958f"
            });
        }

        animateRain();

        // Automatically terminate after 4 seconds
        setTimeout(() => {
            isRainActive = false;
            cancelAnimationFrame(rainAnimId);
            rainCanvas.classList.remove("active");
            rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        }, 4000);
    };

    const animateRain = () => {
        if (!isRainActive) return;
        rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

        rainParticles.forEach(p => {
            p.y += p.vy;
            p.rot += p.rotSpeed;

            rainCtx.save();
            rainCtx.translate(p.x, p.y);
            rainCtx.rotate(p.rot);
            
            // Draw rotating flat 3D coin edge
            const yScale = Math.abs(Math.sin(p.rot));
            
            rainCtx.beginPath();
            rainCtx.ellipse(0, 0, p.radius, p.radius * yScale, 0, 0, Math.PI * 2);
            rainCtx.fillStyle = "rgba(10, 11, 16, 0.9)";
            rainCtx.fill();
            
            rainCtx.strokeStyle = p.color;
            rainCtx.lineWidth = 2.5;
            rainCtx.shadowColor = p.color;
            rainCtx.shadowBlur = 10;
            rainCtx.stroke();
            rainCtx.shadowBlur = 0; // reset

            // Token letter label
            rainCtx.fillStyle = "#fff";
            rainCtx.font = `bold ${p.radius * 0.5}px 'Space Grotesk'`;
            rainCtx.textAlign = "center";
            rainCtx.textBaseline = "middle";
            rainCtx.scale(1, yScale);
            rainCtx.fillText(p.label[0], 0, 0);

            rainCtx.restore();
        });

        rainAnimId = requestAnimationFrame(animateRain);
    };

});

/**
 * DEVCHAOS PORTFOLIO - JAVASCRIPT
 * 100% Vanilla JavaScript - No external libraries or frameworks.
 * Features:
 * - Dark / Flashbang Light Mode with LocalStorage
 * - Web Audio API 8-bit sound effects (pure synthetic audio, zero external files)
 * - Interactive Canvas Confetti Particle System
 * - Runaway "Decline Offer" Button
 * - Live Status & Excuse Generator
 * - Animated Number Counters
 * - Project Filter & Dynamic Interactive Demos
 * - Form Validation with Memetic Error Handling
 * - Secret Easter Eggs & Rickroll Troll Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. WEB AUDIO API SYNTHESIZER (8-BIT SOUND EFFECTS)
     Zero external audio files needed! All sound is synthesized natively.
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playTone(frequency, type, duration, delay = 0, gainLevel = 0.08) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type; // 'sine', 'square', 'triangle', 'sawtooth'
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime + delay);

        gain.gain.setValueAtTime(gainLevel, this.audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + delay);
        osc.stop(this.audioCtx.currentTime + delay + duration);
      } catch (e) {
        // Audio policy or unsupported browser - silent fail
      }
    }

    // Short cute blip for navigation or buttons
    blip() {
      this.playTone(600, 'sine', 0.06);
    }

    // Bouncy retro click
    click() {
      this.playTone(440, 'triangle', 0.05);
      this.playTone(880, 'triangle', 0.08, 0.04);
    }

    // Mario-like Coin sound for successes
    coin() {
      this.playTone(987.77, 'square', 0.08, 0, 0.06); // B5
      this.playTone(1318.51, 'square', 0.28, 0.08, 0.06); // E6
    }

    // Laser zap for runaway button
    laser() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);
      } catch (e) {}
    }

    // Error buzzer for invalid form / funny warnings
    buzzer() {
      this.playTone(150, 'sawtooth', 0.22, 0, 0.1);
      this.playTone(110, 'sawtooth', 0.22, 0.08, 0.1);
    }

    // Rickroll melody intro for Easter Egg
    rickroll() {
      // Notes: G4, A4, C5, A4, E5, E5, D5
      const notes = [
        { f: 392.00, d: 0.14 },
        { f: 440.00, d: 0.14 },
        { f: 523.25, d: 0.14 },
        { f: 440.00, d: 0.14 },
        { f: 659.25, d: 0.3 },
        { f: 659.25, d: 0.3 },
        { f: 587.33, d: 0.5 }
      ];
      let delay = 0;
      notes.forEach(note => {
        this.playTone(note.f, 'square', note.d, delay, 0.07);
        delay += note.d + 0.04;
      });
    }
  }

  const sfx = new SoundFX();

  /* ==========================================================================
     2. THEME & FLASHBANG LIGHT MODE TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const flashbangBanner = document.getElementById('flashbang-banner');

  // Load saved theme
  const savedTheme = localStorage.getItem('devchaos_theme') || 'dark';
  if (savedTheme === 'light') {
    enableLightMode();
  } else {
    enableDarkMode();
  }

  themeToggle.addEventListener('click', () => {
    sfx.click();
    if (document.body.classList.contains('light-mode')) {
      enableDarkMode();
      localStorage.setItem('devchaos_theme', 'dark');
    } else {
      enableLightMode();
      localStorage.setItem('devchaos_theme', 'light');
    }
  });

  function enableLightMode() {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeIcon.textContent = '☀️';
    themeToggle.title = 'Switch to Vampire Dark Mode';
    flashbangBanner.classList.remove('hidden');
  }

  function enableDarkMode() {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '🌙';
    themeToggle.title = 'Switch to Flashbang Mode';
    flashbangBanner.classList.add('hidden');
  }

  /* ==========================================================================
     3. SOUND FX TOGGLE BUTTON
     ========================================================================== */
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  soundToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    if (sfx.enabled) {
      soundIcon.textContent = '🔊';
      soundToggle.title = 'Mute Sound FX';
      sfx.coin();
    } else {
      soundIcon.textContent = '🔇';
      soundToggle.title = 'Unmute Sound FX';
    }
  });

  /* ==========================================================================
     4. NAVBAR & SCROLL PROGRESS & ACTIVE LINK SPY
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  // Scroll Progress
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgressBar.style.width = `${progress}%`;

    // Active Section Spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Sound and close menu on nav item click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sfx.blip();
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('open');
    });
  });

  // Mobile Hamburger Toggle
  hamburgerBtn.addEventListener('click', () => {
    sfx.click();
    hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  /* ==========================================================================
     5. HERO STATUS PILL & RANDOM STATUS GENERATOR
     ========================================================================== */
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');

  const funnyStatuses = [
    "Staring at console.log('wtf') for 3 hours",
    "Centering a <div> with pure willpower and tears",
    "Converting caffeine into unhandled Promise rejections",
    "Waiting for npm install to finish downloading the internet",
    "Reading documentation (Just kidding, copy-pasting from StackOverflow)",
    "Explaining to manager why the bug is actually a premium feature",
    "Blaming Dave from DevOps for the broken production pipeline",
    "Fighting with CSS flexbox like it owes me money",
    "Running git push --force and turning off phone",
    "Considering a career change to organic llama farming"
  ];

  let currentStatusIndex = 0;
  statusPill.addEventListener('click', () => {
    sfx.blip();
    currentStatusIndex = (currentStatusIndex + 1) % funnyStatuses.length;
    statusText.style.opacity = '0';
    setTimeout(() => {
      statusText.textContent = funnyStatuses[currentStatusIndex];
      statusText.style.opacity = '1';
    }, 150);
  });

  /* ==========================================================================
     6. RUNAWAY "DECLINE OFFER" BUTTON
     The button playfully sprints away when the user tries to hover over it!
     ========================================================================== */
  const runawayBtn = document.getElementById('runaway-btn');

  function dodgeButton() {
    sfx.laser();
    const maxX = 160;
    const maxY = 90;
    const randomX = (Math.random() * 2 - 1) * maxX;
    const randomY = (Math.random() * 2 - 1) * maxY;
    runawayBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  runawayBtn.addEventListener('mouseenter', dodgeButton);
  runawayBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton();
  });

  runawayBtn.addEventListener('click', () => {
    sfx.buzzer();
    alert("🚨 IMPOSSIBLE! You clicked the unclickable button. Your reflexes are beyond human.");
  });

  /* ==========================================================================
     7. INSTANT DEVELOPER EXCUSE GENERATOR
     ========================================================================== */
  const generateExcuseBtn = document.getElementById('generate-excuse-btn');
  const excuseDisplay = document.getElementById('excuse-display');
  const excuseText = document.getElementById('excuse-text');

  const developerExcuses = [
    "It worked fine in the simulation!",
    "That was a temporary workaround that became permanent 3 years ago.",
    "A cosmic ray must have flipped a bit in the server RAM.",
    "The third-party API changed their schema without sending an email.",
    "I was told this sprint was for technical debt, not working features!",
    "My mechanical keyboard ran out of semicolons.",
    "It's an asynchronous feature, you just have to wait longer.",
    "Vim wouldn't let me exit, so I couldn't push the hotfix.",
    "It's not a memory leak, the application is just passionately holding on to data.",
    "Our code is totally bug-free. The universe's physics engine is lagging.",
    "Someone touched the CSS and the entire backend database collapsed."
  ];

  generateExcuseBtn.addEventListener('click', () => {
    sfx.coin();
    const randomExcuse = developerExcuses[Math.floor(Math.random() * developerExcuses.length)];
    excuseText.textContent = randomExcuse;
    excuseDisplay.classList.remove('hidden');
    // Micro animation
    excuseDisplay.style.animation = 'none';
    void excuseDisplay.offsetHeight; // trigger reflow
    excuseDisplay.style.animation = 'fadeIn 0.3s ease-in-out';
  });

  /* ==========================================================================
     8. ANIMATED NUMBER COUNTERS (HERO STATS)
     ========================================================================== */
  const counters = [
    { el: document.getElementById('coffee-counter'), target: 4208 },
    { el: document.getElementById('bug-counter'), target: 999 },
    { el: document.getElementById('tab-counter'), target: 86 },
    { el: document.getElementById('git-counter'), target: 0 }
  ];

  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(item => {
      const target = item.target;
      const element = item.el;
      if (!element) return;

      if (target === 0) {
        element.textContent = "0";
        return;
      }

      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        element.textContent = currentVal.toLocaleString() + (target > 500 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString() + (target > 500 ? '+' : '');
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters with IntersectionObserver
  const heroSection = document.getElementById('home');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runCounters();
    }
  }, { threshold: 0.3 });

  if (heroSection) {
    observer.observe(heroSection);
  }

  /* ==========================================================================
     9. PROJECT FILTER SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     10. INTERACTIVE PROJECT DEMO MODALS
     Dynamic simulations for each project!
     ========================================================================== */
  const demoModal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseDot = document.getElementById('modal-close-dot');
  const modalActionBtn = document.getElementById('modal-action-btn');

  function openModal(title, htmlContent) {
    sfx.coin();
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    demoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    sfx.blip();
    demoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseDot.addEventListener('click', closeModal);
  modalActionBtn.addEventListener('click', closeModal);

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) closeModal();
  });

  // Demo triggers
  const demoButtons = document.querySelectorAll('.demo-trigger');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      launchDemoSimulation(demoType);
    });
  });

  function launchDemoSimulation(type) {
    if (type === 'stack') {
      openModal('StackOverflow Auto-Copier 3000 Simulation', `
        <div style="text-align: center; padding: 10px;">
          <p style="margin-bottom: 16px;">Type anything on your keyboard or click below to simulate instant senior engineering:</p>
          <div id="stack-console" style="background:#0a0c10; padding:18px; border-radius:10px; font-family:monospace; min-height:100px; color:#00ff88; text-align:left; border: 1px solid #00ff88;">
            > Waiting for frustration signal...<br>
          </div>
          <button class="btn btn-primary" id="stack-auto-paste-btn" style="margin-top:16px;">
            📋 Smash Ctrl+V (Solve All Life Problems)
          </button>
        </div>
      `);

      const stackConsole = document.getElementById('stack-console');
      const pasteBtn = document.getElementById('stack-auto-paste-btn');

      const funnySnippets = [
        "> Sensed panic... fetching top answer from 2011...",
        "> Copied 40 lines of jQuery into your React project...",
        "> Added // DO NOT TOUCH THIS CODE, IT WORKS BY MIRACLE",
        "> Added 14 npm packages to pad a left-hand string...",
        "> Build passing! Zero comprehension achieved! 🎉"
      ];

      pasteBtn.addEventListener('click', () => {
        sfx.coin();
        triggerConfetti();
        const randomSnippet = funnySnippets[Math.floor(Math.random() * funnySnippets.length)];
        stackConsole.innerHTML += `<br><span style="color:#ffe600;">${randomSnippet}</span>`;
        stackConsole.scrollTop = stackConsole.scrollHeight;
      });

    } else if (type === 'div') {
      openModal('Div Centering Simulator (Dark Souls Edition)', `
        <div style="text-align:center;">
          <p style="margin-bottom: 14px;"><strong>Objective:</strong> Drag or click the div into the glowing center box. Good luck.</p>
          <div id="div-arena" style="position:relative; width:100%; height:220px; background:#121520; border:2px dashed #00d4ff; border-radius:10px; overflow:hidden;">
            <div id="target-box" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:90px; height:50px; border:2px solid #00ff88; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:11px; color:#00ff88;">
              CENTER
            </div>
            <div id="escape-div" style="position:absolute; top:20px; left:20px; width:80px; height:40px; background:#ff3366; color:#fff; display:flex; align-items:center; justify-content:center; border-radius:6px; font-family:monospace; font-size:12px; cursor:pointer; transition: all 0.15s ease;">
              &lt;div&gt;
            </div>
          </div>
          <p id="div-message" style="margin-top:14px; font-family:monospace; color:#ffe600;">Try catching the div!</p>
        </div>
      `);

      const escapeDiv = document.getElementById('escape-div');
      const divMessage = document.getElementById('div-message');

      const excuses = [
        "Oops! Margin collapse occurred!",
        "Safari rendered it 40px higher!",
        "Someone applied float: left in parent!",
        "display: inline-block struck again!",
        "z-index was overridden by an ad banner!",
        "Almost centered, but mobile breakpoint triggered!"
      ];

      escapeDiv.addEventListener('mouseenter', () => {
        sfx.laser();
        const randX = Math.floor(Math.random() * 260);
        const randY = Math.floor(Math.random() * 160);
        escapeDiv.style.left = `${randX}px`;
        escapeDiv.style.top = `${randY}px`;
        divMessage.textContent = excuses[Math.floor(Math.random() * excuses.length)];
      });

      escapeDiv.addEventListener('click', () => {
        sfx.coin();
        triggerConfetti();
        divMessage.innerHTML = "<span style='color:#00ff88;'>MIRACLE! You centered the div! CSS Gods are weeping!</span>";
      });

    } else if (type === 'bug') {
      openModal('Bug-to-Feature Transmuter', `
        <div style="text-align:center;">
          <p style="margin-bottom:16px;">Transform shameful unhandled exceptions into high-value product upsells:</p>
          <button class="btn btn-danger" id="transmute-trigger-btn" style="margin-bottom:16px;">
            🐛 Trigger 500 Server Crash
          </button>
          <div id="feature-box" style="background:#0a0c10; padding:18px; border-radius:10px; font-family:monospace; color:#ffe600; text-align:left; min-height:90px; border:1px solid rgba(255,255,255,0.1);">
            System standing by for catastrophic failures...
          </div>
        </div>
      `);

      const triggerBtn = document.getElementById('transmute-trigger-btn');
      const featureBox = document.getElementById('feature-box');

      const transmutations = [
        "CRASH: Infinite Loop detected!<br>➔ <span style='color:#00ff88;'>MARKETING REBRAND:</span> 'Zen Meditation Loading Mode - Gives users time to reflect on life.'",
        "CRASH: Database dropped unexpectedly!<br>➔ <span style='color:#00ff88;'>MARKETING REBRAND:</span> 'Zero-Knowledge Privacy Mode: We don't even store your data anymore.'",
        "CRASH: Memory Leak at 99% RAM!<br>➔ <span style='color:#00ff88;'>MARKETING REBRAND:</span> 'High-Performance Room Heater Mode: Free winter warming feature.'",
        "CRASH: App rendered upside down on Firefox!<br>➔ <span style='color:#00ff88;'>MARKETING REBRAND:</span> 'Australian Localization Edition.'"
      ];

      triggerBtn.addEventListener('click', () => {
        sfx.coin();
        triggerConfetti();
        const randomItem = transmutations[Math.floor(Math.random() * transmutations.length)];
        featureBox.innerHTML = randomItem;
      });

    } else if (type === 'sleep') {
      openModal('Sleep Schedule Optimizer (IoT 404)', `
        <div style="text-align:center;">
          <p>Calculating optimal circadian sleep parameters for software developer...</p>
          <div style="font-size:3rem; margin:16px 0;">☕⚡🛌</div>
          <div style="background:#0a0c10; padding:16px; border-radius:8px; font-family:monospace; color:#ff3366;">
            [ERROR 404: Sleep Not Found]<br>
            Current Time: 03:42 AM<br>
            Next Meeting: 08:30 AM<br>
            Estimated REM Cycles: 0.2<br>
            <span style="color:#00ff88;">Recommendation: Double shot espresso and intense prayer.</span>
          </div>
        </div>
      `);
    } else if (type === 'blame') {
      openModal('Git Blame Deflector Pro', `
        <div style="text-align:center;">
          <p>Production server is in flames. Who should we blame?</p>
          <button class="btn btn-primary" id="spin-blame-btn" style="margin:14px 0;">
            🎲 Spin The Scapegoat Wheel
          </button>
          <div id="scapegoat-result" style="background:#0a0c10; padding:16px; border-radius:8px; font-family:monospace; color:#00ff88; font-size:1.1rem;">
            Awaiting scapegoat selection...
          </div>
        </div>
      `);

      const spinBtn = document.getElementById('spin-blame-btn');
      const scapegoatResult = document.getElementById('scapegoat-result');
      const scapegoats = [
        "Dave from DevOps (Resigned in 2022)",
        "The unpaid summer intern who left last Friday",
        "A rogue solar flare interfering with AWS us-east-1",
        "The legacy PHP codebase from 2004",
        "The WiFi router at Starbucks"
      ];

      spinBtn.addEventListener('click', () => {
        sfx.buzzer();
        const scapegoat = scapegoats[Math.floor(Math.random() * scapegoats.length)];
        scapegoatResult.innerHTML = `Culprit Identified:<br><span style="color:#ffe600;">"${scapegoat}"</span>`;
      });

    } else if (type === 'existential') {
      openModal('Existential Terminal Shell', `
        <div>
          <p style="margin-bottom:12px;">Type any UNIX command into the void:</p>
          <div style="background:#0a0c10; border:1px solid #b537f2; border-radius:8px; padding:16px; font-family:monospace;">
            <div id="existential-log" style="max-height:140px; overflow-y:auto; color:#b537f2; margin-bottom:10px;">
              $ welcome to the abyss. Enter a command...<br>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:#ff2a85;">&gt;</span>
              <input type="text" id="term-input" placeholder="e.g. ls, pwd, whoami, help" style="background:transparent; border:none; color:#fff; font-family:monospace; width:100%; outline:none;">
            </div>
          </div>
        </div>
      `);

      const termInput = document.getElementById('term-input');
      const termLog = document.getElementById('existential-log');

      const responses = {
        "whoami": "You are a transient collection of stardust frantically debugging JavaScript.",
        "ls": "Why enumerate files when all matter decays into dust?",
        "pwd": "You are trapped in the illusion of linear time.",
        "clear": "You cannot clear your past commits.",
        "exit": "There is no exit. You are in Vim forever."
      };

      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sfx.blip();
          const cmd = termInput.value.trim().toLowerCase();
          const reply = responses[cmd] || "Command executed into emptiness. Nothing echoed back.";
          termLog.innerHTML += `<span style="color:#00ff88;">$ ${cmd}</span><br><span style="color:#ffe600;">${reply}</span><br>`;
          termInput.value = '';
          termLog.scrollTop = termLog.scrollHeight;
        }
      });
    }
  }

  // "Blame Git" repository buttons
  const repoButtons = document.querySelectorAll('.repo-trigger');
  repoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.blip();
      const projectTitle = btn.getAttribute('data-title');
      openModal('Git Commit Log Audit', `
        <div style="font-family:monospace; padding:10px;">
          <h4 style="color:#ff3366; margin-bottom:10px;">git log --oneline --graph</h4>
          <p style="color:#00ff88;">* 7f9a21c (HEAD -> main) fix: please work this time I am begging</p>
          <p style="color:#ffe600;">* 3b4c10e fix: previous fix broke everything</p>
          <p style="color:#00d4ff;">* 91d84f2 feat: ${projectTitle} initial commit</p>
          <p style="color:#b537f2;">* a12089b chore: deleted node_modules to free up 500GB of storage</p>
          <p style="color:#8b949e; margin-top:16px;">This repository contains proprietary meme energy. Customize this button with your GitHub link in index.html!</p>
        </div>
      `);
    });
  });

  /* ==========================================================================
     11. HIRE ME CONFETTI & SMOOTH SCROLL
     ========================================================================== */
  const hireBtn = document.getElementById('hire-btn');
  hireBtn.addEventListener('click', (e) => {
    sfx.coin();
    triggerConfetti();
  });

  /* ==========================================================================
     12. FORM VALIDATION & MEME SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Fields
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const reasonInput = document.getElementById('contact-reason');
    const msgInput = document.getElementById('sender-message');
    const agreeCheckbox = document.getElementById('meme-agree');

    // Helper to validate
    function validateField(input, condition) {
      const parent = input.closest('.form-group') || input.closest('.form-checkbox-group');
      if (!condition) {
        parent.classList.add('has-error');
        isValid = false;
      } else {
        parent.classList.remove('has-error');
      }
    }

    validateField(nameInput, nameInput.value.trim().length > 1);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    validateField(reasonInput, reasonInput.value !== '');
    validateField(msgInput, msgInput.value.trim().length > 3);
    validateField(agreeCheckbox, agreeCheckbox.checked);

    if (isValid) {
      sfx.coin();
      triggerConfetti();
      contactForm.style.display = 'none';
      formSuccess.classList.remove('hidden');
    } else {
      sfx.buzzer();
    }
  });

  resetFormBtn.addEventListener('click', () => {
    sfx.click();
    contactForm.reset();
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    formSuccess.classList.add('hidden');
    contactForm.style.display = 'flex';
  });

  /* ==========================================================================
     13. EASTER EGGS (DO NOT PRESS BUTTON, LOGO TRIPLE CLICK, KEY CODES)
     ========================================================================== */
  const secretEasterEggBtn = document.getElementById('secret-easter-egg-btn');
  const easterModal = document.getElementById('easter-modal');
  const easterCloseBtn = document.getElementById('easter-close-btn');
  const trollDismissBtn = document.getElementById('troll-dismiss-btn');
  const logoTrigger = document.getElementById('logo-trigger');

  function openEasterEgg() {
    sfx.rickroll();
    triggerConfetti();
    easterModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeEasterEgg() {
    sfx.click();
    easterModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  secretEasterEggBtn.addEventListener('click', openEasterEgg);
  easterCloseBtn.addEventListener('click', closeEasterEgg);
  trollDismissBtn.addEventListener('click', closeEasterEgg);
  easterModal.addEventListener('click', (e) => {
    if (e.target === easterModal) closeEasterEgg();
  });

  // Triple Click on DevChaos Logo
  let logoClicks = 0;
  let logoTimer = null;
  logoTrigger.addEventListener('click', (e) => {
    logoClicks++;
    sfx.blip();
    clearTimeout(logoTimer);
    if (logoClicks >= 3) {
      logoClicks = 0;
      openEasterEgg();
    } else {
      logoTimer = setTimeout(() => {
        logoClicks = 0;
      }, 700);
    }
  });

  // Secret Keyboard listener: typing 'r-i-c-k' triggers Easter Egg
  let keySequence = '';
  window.addEventListener('keydown', (e) => {
    // Avoid capturing inputs while typing in form
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    keySequence += e.key.toLowerCase();
    if (keySequence.length > 10) {
      keySequence = keySequence.slice(-10);
    }
    if (keySequence.endsWith('rick')) {
      keySequence = '';
      openEasterEgg();
    }
  });

  /* ==========================================================================
     14. PURE VANILLA CANVAS CONFETTI ENGINE
     Lightweight particle system rendered directly on canvas.
     ========================================================================== */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#00ff88', '#00d4ff', '#ff2a85', '#ffe600', '#b537f2', '#ff7a00'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.speedX = (Math.random() * 2 - 1) * 8;
      this.speedY = Math.random() * -10 - 4;
      this.gravity = 0.35;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() * 2 - 1) * 10;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      ctx.restore();
    }
  }

  function triggerConfetti() {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.6;
    for (let i = 0; i < 90; i++) {
      particles.push(new Particle(startX, startY));
    }
    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0 || particles[i].y > canvas.height) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Update current year dynamically in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Log welcoming meme in browser console
  console.log(
    "%c💀 Welcome to DevChaos! %cIf you are inspecting this console, you are either a cool developer or looking for vulnerabilities. There are none, only memes.",
    "color: #00ff88; font-size: 16px; font-weight: bold; background: #0a0c10; padding: 6px 12px; border-radius: 4px;",
    "color: #00d4ff; font-size: 13px;"
  );
});

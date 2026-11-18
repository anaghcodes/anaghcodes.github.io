/**
 * ==============================================================================
 * PORTFOLIO JAVASCRIPT (script.js)
 * Features:
 *   1. Dark / Light Theme Toggle with LocalStorage Persistence
 *   2. Random Funny Dev Excuse / Meme Generator
 *   3. Animated Skill Progress Bars (via IntersectionObserver)
 *   4. Smooth Scrolling & Active Navigation Link Tracking
 *   5. Interactive Easter Eggs (Emergency Panic Button, Confetti/Shakes)
 *   6. Copy-to-Clipboard with Custom Toast Notifications
 *   7. Interactive Project Demo / Code Previews
 *   8. Humorous Contact Form Validation & Submission
 *   9. Mobile Hamburger Navigation
 * ==============================================================================
 */

// Wait until DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME SWITCHER (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const htmlRoot = document.documentElement;

  // Check saved theme in localStorage, default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Activated Night Owl Coder Mode' : '☀️ Flashbang Mode Activated! Protect your eyes!');
  });

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark Mode';
    } else {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light Mode';
    }
  }


  /* ==========================================================================
     2. RANDOM DEV EXCUSE & MEME GENERATOR
     ========================================================================== */
  const excuseText = document.getElementById('excuse-text');
  const newExcuseBtn = document.getElementById('new-excuse-btn');

  // A collection of hilarious, relatable developer excuses and quotes
  const devExcuses = [
    "It works on my machine. Maybe we should just ship my laptop to production.",
    "That's not a bug. That's an undocumented feature meant to keep users awake.",
    "I didn't write that messy code. That was my twin brother who doesn't even code.",
    "The code was compiling perfectly fine right before you walked over here.",
    "Have you tried turning the internet off and on again?",
    "It's a hardware issue. Specifically, my brain hardware needs more coffee.",
    "I didn't break production, production broke my code.",
    "The CSS was centering itself yesterday. I suspect cosmic radiation moved it 2 pixels.",
    "I'm not procrastinating. I'm letting my subroutines batch-process in background memory.",
    "Commit message: 'Fixed bug, created 4 new mysteries for future generations.'",
    "There are 10 types of people: those who understand binary, and those who get dates.",
    "Why write 5 lines of clean code when you can write 50 lines of esoteric magic?",
    "StackOverflow was down for 4 minutes today. Worst 3 hours of my career.",
    "I don't test in dev. Real developers test straight on production on Friday afternoon.",
    "Regex is simple. It's just: /^[a-zA-Z0-9_.-]+@[cries-in-corner]+$/",
    "My code doesn't have bugs; it just generates spontaneous puzzle challenges.",
    "Currently waiting for npm to download the remaining half of the internet.",
    "A SQL query walks into a bar, approaches two tables and asks: 'May I join you?'"
  ];

  let lastIndex = -1;

  function getRandomExcuse() {
    let randomIndex;
    // Ensure we don't display the exact same excuse twice in a row
    do {
      randomIndex = Math.floor(Math.random() * devExcuses.length);
    } while (randomIndex === lastIndex && devExcuses.length > 1);

    lastIndex = randomIndex;

    // Smooth fade effect
    excuseText.style.opacity = '0';
    setTimeout(() => {
      excuseText.textContent = `"${devExcuses[randomIndex]}"`;
      excuseText.style.opacity = '1';
    }, 180);
  }

  newExcuseBtn.addEventListener('click', () => {
    getRandomExcuse();
    // Add brief button wobble
    newExcuseBtn.style.transform = 'scale(0.95)';
    setTimeout(() => newExcuseBtn.style.transform = '', 150);
  });


  /* ==========================================================================
     3. ANIMATED SKILL PROGRESS BARS (IntersectionObserver)
     ========================================================================== */
  const progressFills = document.querySelectorAll('.progress-bar-fill');

  const skillsObserverOptions = {
    root: null,
    threshold: 0.25 // Trigger when 25% of the element is visible
  };

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target;
        const targetWidth = fillBar.getAttribute('data-progress');
        fillBar.style.width = targetWidth;
        observer.unobserve(fillBar); // Animate only once
      }
    });
  }, skillsObserverOptions);

  progressFills.forEach(bar => {
    skillsObserver.observe(bar);
  });


  /* ==========================================================================
     4. SMOOTH SCROLLING & ACTIVE NAVIGATION LINK
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Smooth scroll for nav link anchors
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Close mobile menu if opened
        const mobileMenu = document.getElementById('nav-links');
        mobileMenu.classList.remove('nav-open');

        // Scroll with navbar height offset
        const navbarHeight = 68;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active nav item on scroll
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  });

  // Back to Top button in footer
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      showToast('🚀 Zoomed straight back to safety!');
    });
  }


  /* ==========================================================================
     5. PANIC BUTTON & FUN EASTER EGGS
     ========================================================================== */
  const panicBtn = document.getElementById('panic-btn');
  let panicCount = 0;

  const panicMessages = [
    "🚨 Self-destruct sequence aborted! Coffee reserves critically low.",
    "⚠️ Warning: 10,000 unread Slack messages incoming!",
    "😱 Error 418: I'm a teapot, not a panic button!",
    "🔥 Git push --force deployed to AWS production! (Just kidding... or am I?)",
    "🛑 You were explicitly told NOT to click this button."
  ];

  panicBtn.addEventListener('click', () => {
    const msg = panicMessages[panicCount % panicMessages.length];
    panicCount++;
    showToast(msg);

    // Screen wobble effect
    document.body.style.animation = 'shake 0.4s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 400);
  });

  // Carrier pigeon link easter egg
  const pigeonLink = document.getElementById('carrier-pigeon');
  if (pigeonLink) {
    pigeonLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🕊️ Carrier pigeon dispatched with a 2kb breadcrumb payload!');
    });
  }


  /* ==========================================================================
     6. PROJECT CARD INTERACTIVE BUTTONS
     ========================================================================== */
  const demoButtons = document.querySelectorAll('.demo-trigger');
  const sourceButtons = document.querySelectorAll('.source-trigger');

  const funnyDemoAlerts = {
    "BugToFeature Converter": "✨ Transforming your fatal crash into a 'Dynamic Creative Feature'...",
    "Works On My Machine Shipper": "📦 FedEx truck dispatched to load your laptop into bubble wrap!",
    "Reverse Pomodoro Timer": "🍅 Starting 55 minutes of watching raccoon videos on YouTube...",
    "Git Blame Deflector": "🕵️ Blame successfully reassigned to Kevin (Intern class of 2019)!",
    "SleepDebt Calculator": "💤 Result: NaN (You owe yourself approximately 4.7 centuries of sleep).",
    "Forgotten To-Do List": "📝 Adding task: 'Remember to look at this to-do list'. App closed forever."
  };

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project');
      const response = funnyDemoAlerts[projectName] || `Launching ${projectName}...`;
      showToast(response);
    });
  });

  sourceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project');
      showToast(`💾 Stealing source code for ${projectName}... License: "Don't tell my boss"`);
    });
  });


  /* ==========================================================================
     7. COPY EMAIL TO CLIPBOARD
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('my-email').innerText;
  const copyBtnText = document.getElementById('copy-btn-text');

  copyEmailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      copyBtnText.textContent = '✅ Copied!';
      showToast('📋 Email copied! Feel free to send pizza vouchers or recruiter offers.');
      
      setTimeout(() => {
        copyBtnText.textContent = '📋 Copy Email';
      }, 3000);
    }).catch(() => {
      // Fallback for older browsers
      showToast('📧 Address: ' + emailText);
    });
  });


  /* ==========================================================================
     8. HUMOROUS CONTACT FORM SUBMISSION & VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');
  const reasonSelect = document.getElementById('project-type');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset error styles
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    // Validate Email with regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (hasError) {
      showToast('⚠️ Please fix the highlighted fields before blasting off!');
      return;
    }

    // Get selected reason for custom funny toast message
    const reason = reasonSelect.value;
    let replyMsg = '🚀 Message successfully launched into the cyber-void!';

    if (reason === 'job') {
      replyMsg = '🍕 Offer received! I already cleared my schedule for pizza tasting.';
    } else if (reason === 'printer') {
      replyMsg = '🖨️ Printer request received! Have you tried violently smacking the top?';
    } else if (reason === 'meme') {
      replyMsg = '😹 Meme received! Analyzing hilarity index on neural cores...';
    } else if (reason === 'freelance') {
      replyMsg = '💰 $50 and 2% equity? Say no more, buying a yacht in anticipation!';
    }

    showToast(replyMsg);
    contactForm.reset();
  });


  /* ==========================================================================
     9. MOBILE NAVIGATION MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-links');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('nav-open');
    }
  });


  /* ==========================================================================
     10. CUSTOM TOAST NOTIFICATION HELPER
     ========================================================================== */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove('hidden');

    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

});

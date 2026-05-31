/* ============================================
   AMAN AI — CHATBOT LOGIC
   Pure JS, no external APIs
   ============================================ */

(function () {
  'use strict';

  /* ─── Knowledge Base ─────────────────────── */
  const KB = {
    about: {
      keywords: ['who', 'about', 'aman', 'introduction', 'intro', 'yourself', 'tell me', 'describe', 'you are'],
      response: `<strong>Aman Meshram</strong> is a B.Tech Data Science Engineering student at JD College of Engineering and Management, Nagpur — currently in 4th Semester with a CGPA of <strong>8.05/10</strong>.<br><br>He's passionate about Python, machine learning, and data analysis — building practical projects and seeking internship opportunities to apply his skills in real-world settings.`,
    },
    education: {
      keywords: ['education', 'college', 'school', 'degree', 'qualification', 'academic', 'study', 'studied', 'cgpa', 'marks', 'grade', 'university', 'polytechnic', 'diploma', 'b.tech', 'btech', 'hsc', 'ssc'],
      response: `<strong>Academic Background:</strong>
<ul>
  <li>🎓 <strong>B.Tech – Data Science Engg.</strong> · JD College of Engineering, Nagpur · 2025–2028 · CGPA 8.05/10</li>
  <li>📜 <strong>Diploma in IT</strong> · Priyadarshini Polytechnic, Nagpur · 2023–2025 · 78.25%</li>
  <li>📚 <strong>HSC</strong> · Pandharibapu Deshmukh Jr. College · 2021–2022 · 76.33%</li>
  <li>🏫 <strong>SSC</strong> · Bahu Uddeshiya High School · 2019–2020 · 81.60%</li>
</ul>`,
    },
    skills: {
      keywords: ['skill', 'technology', 'tech', 'programming', 'language', 'know', 'tools', 'software', 'python', 'sql', 'ml', 'machine learning', 'data', 'visualization', 'framework', 'library', 'pandas', 'numpy'],
      response: `<strong>Technical Skills:</strong>
<ul>
  <li>💻 <strong>Programming:</strong> Python, C++, HTML, CSS</li>
  <li>🤖 <strong>Data Science & ML:</strong> Pandas, NumPy, Scikit-learn</li>
  <li>📊 <strong>Visualization:</strong> Matplotlib, Seaborn, Power BI</li>
  <li>🛠 <strong>Tools & Databases:</strong> MySQL, Jupyter, Git, MS Excel</li>
</ul>
Proficiency highlights: Python (90%), Data Visualization (80%), Machine Learning (75%), SQL (70%).`,
    },
    projects: {
      keywords: ['project', 'built', 'made', 'created', 'developed', 'work', 'portfolio', 'showcase', 'traffic', 'space', 'bank', 'shooter', 'game'],
      response: `<strong>Projects:</strong>
<ul>
  <li>🚦 <strong>Traffic Signal Controller</strong> — Traffic simulation with timed phase changes and state-based intersection control (Python, C++)</li>
  <li>🚀 <strong>Space Shooter Game</strong> — Real-time game with collision detection, score tracking, and dynamic UI (Python, HTML/CSS)</li>
  <li>🏦 <strong>Bank Management System</strong> — Secure banking app with MySQL persistence, deposits, withdrawals, and interest calculations (Python, MySQL, HTML/CSS)</li>
</ul>`,
    },
    certifications: {
      keywords: ['certification', 'certificate', 'cert', 'course', 'certified', 'nvidia', 'nptel', 'eduskill', 'java', 'soft skill'],
      response: `<strong>Certifications:</strong>
<ul>
  <li>☕ <strong>Java Full Stack Development</strong> — Eduskill</li>
  <li>🤖 <strong>Data Science & Analytics</strong> — NVIDIA</li>
  <li>📊 <strong>Data Visualization and Analysis</strong> — L&T EduTech</li>
  <li>🎯 <strong>Enhancing Soft Skills & Personality</strong> — NPTEL</li>
</ul>`,
    },
    contact: {
      keywords: ['contact', 'email', 'phone', 'call', 'linkedin', 'github', 'reach', 'connect', 'number', 'social', 'profile'],
      response: `<strong>Contact Aman:</strong>
<ul>
  <li>📧 <strong>Email:</strong> amanmeshram454@gmail.com</li>
  <li>📞 <strong>Phone:</strong> +91 80103 26098</li>
  <li>💼 <strong>LinkedIn:</strong> linkedin.com/in/ (see portfolio)</li>
  <li>🐙 <strong>GitHub:</strong> github.com/ (see portfolio)</li>
  <li>📍 <strong>Location:</strong> Nagpur, India</li>
</ul>
He typically responds within 24 hours.`,
    },
    internship: {
      keywords: ['internship', 'intern', 'hire', 'hiring', 'available', 'job', 'career', 'opportunity', 'work', 'role', 'position', 'employment', 'recruit', 'looking', 'open to'],
      response: `Yes, <strong>Aman is actively looking for internship opportunities</strong> in Data Science, Machine Learning, Analytics, and Software Development.<br><br>He's open to remote or on-site roles and is available to start immediately. Reach out at <a href="mailto:amanmeshram454@gmail.com" style="color:#1fd8a4">amanmeshram454@gmail.com</a>`,
    },
    achievements: {
      keywords: ['achievement', 'award', 'hackathon', 'competition', 'won', 'prize', 'accomplishment'],
      response: `<strong>Achievements:</strong>
<ul>
  <li>🏆 Participated in <strong>College-level Hackathon 2026</strong> — demonstrated team collaboration and rapid prototyping skills</li>
</ul>`,
    },
  };

  const FALLBACK = `I currently know only information available in Aman's portfolio. Try asking about his <em>skills, projects, education, certifications</em>, or <em>contact info</em>!`;

  const QUICK_REPLIES = ['About Aman', 'Skills', 'Projects', 'Education', 'Contact'];

  /* ─── State ───────────────────────────────── */
  let isOpen = false;
  let isTyping = false;
  let hasOpened = false;

  /* ─── DOM References ─────────────────────── */
  const fab = document.getElementById('chatbot-fab');
  const win = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const messagesEl = document.getElementById('chatbot-messages');
  const inputEl = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const quickRepliesEl = document.getElementById('chatbot-quickreplies');

  /* ─── Helpers ────────────────────────────── */
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 60);
  }

  function createMsg(role, html) {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'chat-msg-avatar';
    avatarEl.setAttribute('aria-hidden', 'true');
    avatarEl.textContent = role === 'bot' ? '🤖' : 'U';

    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'chat-bubble-wrap';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = html;

    const ts = document.createElement('div');
    ts.className = 'chat-timestamp';
    ts.textContent = getTime();

    bubbleWrap.appendChild(bubble);
    bubbleWrap.appendChild(ts);
    wrap.appendChild(avatarEl);
    wrap.appendChild(bubbleWrap);

    return wrap;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-typing';
    wrap.id = 'chatbot-typing';

    const avatarEl = document.createElement('div');
    avatarEl.className = 'chat-msg-avatar';
    avatarEl.setAttribute('aria-hidden', 'true');
    avatarEl.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'typing-bubble';
    bubble.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;

    wrap.appendChild(avatarEl);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  }

  function appendMessage(role, html) {
    const msg = createMsg(role, html);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function showQuickReplies() {
    quickRepliesEl.innerHTML = '';
    QUICK_REPLIES.forEach(label => {
      const chip = document.createElement('button');
      chip.className = 'qr-chip';
      chip.textContent = label;
      chip.setAttribute('aria-label', `Ask about ${label}`);
      chip.addEventListener('click', () => {
        handleUserMessage(label);
      });
      quickRepliesEl.appendChild(chip);
    });
  }

  function hideQuickReplies() {
    quickRepliesEl.innerHTML = '';
  }

  /* ─── NLP Matching ───────────────────────── */
  function findAnswer(text) {
    const lower = text.toLowerCase();
    const tokens = lower.split(/\s+/);

    // Score each category
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, data] of Object.entries(KB)) {
      let score = 0;
      for (const kw of data.keywords) {
        if (lower.includes(kw)) {
          score += kw.split(' ').length; // multi-word keywords score higher
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = data;
      }
    }

    return bestScore > 0 ? bestMatch.response : FALLBACK;
  }

  /* ─── Message Handling ───────────────────── */
  function handleUserMessage(text) {
    text = text.trim();
    if (!text || isTyping) return;

    hideQuickReplies();
    appendMessage('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isTyping = true;

    const thinkTime = 600 + Math.random() * 600;
    showTyping();

    setTimeout(() => {
      hideTyping();
      const answer = findAnswer(text);
      appendMessage('bot', answer);
      isTyping = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }, thinkTime);
  }

  /* ─── Welcome Message ────────────────────── */
  function showWelcome() {
    const welcomeHtml = `👋 Hi, I'm Aman's AI Assistant.<br><br>I can help you with:
<ul>
  <li>About Aman</li>
  <li>Education</li>
  <li>Skills</li>
  <li>Projects</li>
  <li>Certifications</li>
  <li>Contact Information</li>
</ul>
Ask me anything!`;

    appendMessage('bot', welcomeHtml);
    setTimeout(showQuickReplies, 400);
  }

  /* ─── Open / Close ───────────────────────── */
  function openChat() {
    isOpen = true;
    fab.classList.add('open', 'opened');
    win.classList.add('active');
    win.removeAttribute('aria-hidden');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Close Aman AI chat');

    if (!hasOpened) {
      hasOpened = true;
      setTimeout(showWelcome, 200);
    }

    setTimeout(() => inputEl.focus(), 350);
  }

  function closeChat() {
    isOpen = false;
    fab.classList.remove('open');
    win.classList.remove('active');
    win.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Open Aman AI chat');
    fab.focus();
  }

  /* ─── Event Listeners ────────────────────── */
  fab.addEventListener('click', () => {
    isOpen ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  // Escape key closes chat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // Send on Enter (not Shift+Enter)
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) handleUserMessage(text);
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';

    const hasText = inputEl.value.trim().length > 0;
    sendBtn.disabled = !hasText || isTyping;
  });

  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) handleUserMessage(text);
  });

  // Initial send button state
  sendBtn.disabled = true;

})();

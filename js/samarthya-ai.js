// ============================================
// Samarthya — Dedicated AI Chatbot Engine
// Domain-Restricted Intelligence: Samarthya & Government PwD Schemes
// ============================================

const SamarthyaAI = {
  isOpen: false,
  messages: [],
  isThinking: false,

  // Knowledge base definitions
  knowledgeBase: {
    projectName: "Samarthya",
    projectTagline: "Intelligent Government Scheme Matching Portal for Persons with Disabilities (PwD)",
    coreFeatures: [
      "AI-Powered rule matching across 50+ central and state government schemes",
      "Instant eligibility scoring based on age, disability percentage, state, and income",
      "100% Privacy-First & DPDP Act 2023 compliant (Zero PII or Aadhaar uploads required)",
      "Wispr Flow AI Voice Navigation & Smart Form Auto-fill",
      "NGO & Counselor Camp Mode for bulk beneficiary evaluation",
      "Real-time Application Tracker with deadline alerts & calendar export",
      "Direct WhatsApp alerts for latest government notifications"
    ]
  },

  // Suggested starter prompts
  quickSuggestions: [
    "What is Samarthya and how does it work?",
    "Which scholarships are available for 40%+ disability?",
    "How do I apply for free assistive devices under ADIP?",
    "What documents do I need for NSP scholarships?",
    "Does Samarthya require my Aadhaar card?",
    "How to join the WhatsApp scheme notification group?"
  ],

  init() {
    this.renderWelcome();
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById('aiDrawer');
    const fab = document.getElementById('aiFloatingBtn');
    if (drawer) {
      drawer.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        setTimeout(() => {
          const input = document.getElementById('aiChatInput');
          if (input) input.focus();
        }, 300);
      }
    }
    if (fab) {
      fab.classList.toggle('active', this.isOpen);
    }
  },

  openWithPrompt(text) {
    if (!this.isOpen) this.toggle();
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = text;
      this.handleSend();
    }
  },

  close() {
    this.isOpen = false;
    const drawer = document.getElementById('aiDrawer');
    const fab = document.getElementById('aiFloatingBtn');
    if (drawer) drawer.classList.remove('open');
    if (fab) fab.classList.remove('active');
  },

  renderWelcome() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    chatBody.innerHTML = `
      <div class="ai-msg ai-msg-assistant animate-in">
        <div class="ai-msg-avatar">✨</div>
        <div class="ai-msg-content">
          <div class="ai-bot-badge">Samarthya AI Intelligence</div>
          <p><strong>Namaste! 🙏 I am your dedicated Samarthya AI Assistant.</strong></p>
          <p>I have complete knowledge of the <strong>Samarthya Portal</strong> and all <strong>50+ Central & State Welfare Schemes</strong> for students with disabilities.</p>
          <p style="margin-top:8px;font-size:13px;color:var(--text-muted)">Ask me anything about eligibility criteria, required documents, scholarship allowances, assistive aids, or application procedures!</p>
        </div>
      </div>

      <div class="ai-quick-suggestions">
        <div class="ai-suggestions-title">💡 Frequently Asked Questions:</div>
        <div class="ai-chips-grid">
          ${this.quickSuggestions.map(q => `
            <button type="button" class="ai-chip" onclick="SamarthyaAI.openWithPrompt('${q.replace(/'/g, "\\'")}')">
              ${q}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  handleSend() {
    const input = document.getElementById('aiChatInput');
    if (!input || !input.value.trim() || this.isThinking) return;

    const userText = input.value.trim();
    input.value = '';

    // Render user message
    this.appendUserMessage(userText);

    // Generate intelligent response
    this.isThinking = true;
    this.showThinkingIndicator();

    setTimeout(() => {
      this.removeThinkingIndicator();
      const responseHtml = this.generateResponse(userText);
      this.appendAssistantMessage(responseHtml);
      this.isThinking = false;
      this.scrollToBottom();
    }, 500 + Math.random() * 300);
  },

  appendUserMessage(text) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-user animate-in';
    div.innerHTML = `
      <div class="ai-msg-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;
    chatBody.appendChild(div);
    this.scrollToBottom();
  },

  appendAssistantMessage(html) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-assistant animate-in';
    div.innerHTML = `
      <div class="ai-msg-avatar">✨</div>
      <div class="ai-msg-content">
        ${html}
      </div>
    `;
    chatBody.appendChild(div);
    this.scrollToBottom();
  },

  showThinkingIndicator() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    const div = document.createElement('div');
    div.id = 'aiThinkingIndicator';
    div.className = 'ai-msg ai-msg-assistant thinking animate-in';
    div.innerHTML = `
      <div class="ai-msg-avatar">✨</div>
      <div class="ai-msg-content">
        <div class="ai-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatBody.appendChild(div);
    this.scrollToBottom();
  },

  removeThinkingIndicator() {
    const el = document.getElementById('aiThinkingIndicator');
    if (el) el.remove();
  },

  scrollToBottom() {
    const chatBody = document.getElementById('aiChatBody');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  },

  // Intelligent domain-restricted response engine
  generateResponse(query) {
    const q = query.toLowerCase();

    // 1. Off-topic filter check:
    const offTopicKeywords = [
      'weather', 'cricket', 'football', 'bitcoin', 'crypto', 'recipe', 'movie', 'song',
      'president of usa', 'python code for', 'hack', 'chatgpt', 'openai', 'joke', 'capital of'
    ];

    const isExplicitlyOffTopic = offTopicKeywords.some(w => q.includes(w)) &&
      !q.includes('samarthya') && !q.includes('scheme') && !q.includes('disability') && !q.includes('scholarship');

    if (isExplicitlyOffTopic) {
      return `
        <div class="ai-restricted-notice">
          <span style="font-size:18px">🛡️</span>
          <strong>Samarthya Domain Assistant</strong>
        </div>
        <p>Main kewal <strong>Samarthya Portal</strong> aur <strong>Government PwD Welfare Schemes</strong> ke baare mein jaankari dene ke liye trained hoon.</p>
        <p style="margin-top:8px">Aap mujhse pooch sakte hain:</p>
        <ul style="margin-top:6px;padding-left:18px;font-size:13px;line-height:1.6">
          <li>Aapke liye eligible scholarships & assistive grants</li>
          <li>ADIP, Pre-Matric, Post-Matric yojana ke rules</li>
          <li>Required documents & application links</li>
          <li>Samarthya matching score kaise kaam karta hai</li>
        </ul>
      `;
    }

    // 2. What is Samarthya / About
    if (q.includes('what is samarthya') || q.includes('about samarthya') || q.includes('samarthya kya hai') || q.includes('how does it work') || q.includes('kaise kaam karta')) {
      return `
        <h4 style="color:var(--accent-mint);margin-bottom:6px">🚀 About Samarthya</h4>
        <p><strong>Samarthya</strong> is an intelligent government scheme matching portal designed specifically for special-needs students and persons with disabilities (PwD) across India.</p>
        <div class="ai-feature-card">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">Key Capabilities:</div>
          <ul style="padding-left:18px;font-size:13px;line-height:1.6">
            <li><strong>Instant Multi-Rule Matching:</strong> Cross-references your age, disability severity (40%+), state domicile, and household income against 50+ government welfare policies in &lt;2 seconds.</li>
            <li><strong>100% Privacy & Zero Aadhaar Uploads:</strong> No document uploads or personal ID numbers required. Completely DPDP Act 2023 compliant.</li>
            <li><strong>Wispr Flow AI Voice Assistant:</strong> Fill out forms or ask queries naturally with spoken voice commands.</li>
            <li><strong>Direct Actionable Links:</strong> Direct access to National Scholarship Portal (NSP), Swavlamban UDID, and ALIMCO.</li>
          </ul>
        </div>
        <button class="btn-sm btn-primary" style="margin-top:10px" onclick="App.navigate('match')">Start Finding Schemes →</button>
      `;
    }

    // 3. Privacy / Aadhaar / Document Upload questions
    if (q.includes('aadhaar') || q.includes('document upload') || q.includes('privacy') || q.includes('data') || q.includes('safe')) {
      return `
        <h4 style="color:var(--accent-green);margin-bottom:6px">🔒 100% Privacy & Zero Document Uploads</h4>
        <p><strong>No Aadhaar card or personal document upload is required on Samarthya!</strong></p>
        <ul style="margin-top:8px;padding-left:18px;font-size:13px;line-height:1.6">
          <li>Samarthya matches schemes entirely in your browser using anonymous criteria (age, disability type, percentage, state, and income slab).</li>
          <li>Your personal data is never stored on our servers, ensuring complete alignment with India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.</li>
          <li>When you are ready to apply officially, you directly submit your documents on authorized official government portals like <strong>scholarships.gov.in</strong> or <strong>swavlambancard.gov.in</strong>.</li>
        </ul>
      `;
    }

    // 4. Scholarships (Pre-Matric, Post-Matric, Top Class)
    if (q.includes('scholarship') || q.includes('study') || q.includes('education') || q.includes('padhai') || q.includes('post matric') || q.includes('pre matric')) {
      return `
        <h4 style="color:var(--accent-mint);margin-bottom:6px">🎓 Top Government Scholarships for PwD</h4>
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">
          <div class="ai-scheme-mini-card">
            <strong>1. Pre-Matric Scholarship (Class 9-10)</strong>
            <p style="font-size:12px;color:var(--text-muted)">Eligibility: 40%+ disability, Income ≤ ₹2.5L/yr. Provides maintenance allowance + book grants.</p>
          </div>
          <div class="ai-scheme-mini-card">
            <strong>2. Post-Matric Scholarship (Class 11, 12, Degree, PG)</strong>
            <p style="font-size:12px;color:var(--text-muted)">Eligibility: Class 11+, 40%+ disability, Income ≤ ₹2.5L/yr. Full tuition fee + up to ₹4,000/mo allowance.</p>
          </div>
          <div class="ai-scheme-mini-card">
            <strong>3. Top Class Education Scholarship</strong>
            <p style="font-size:12px;color:var(--text-muted)">For students in premier institutions (IIT, IIM, NIT, AIIMS, Central Univs) with ₹2L/yr tuition + ₹30,000 laptop grant.</p>
          </div>
          <div class="ai-scheme-mini-card">
            <strong>4. National Fellowship for Persons with Disabilities (NFPwD)</strong>
            <p style="font-size:12px;color:var(--text-muted)">For M.Phil and Ph.D. scholars (JRF ₹31,000/mo, SRF ₹35,000/mo).</p>
          </div>
        </div>
        <p style="margin-top:10px;font-size:12px;color:#94a3b8">📌 <em>All these scholarships are processed through the National Scholarship Portal (NSP).</em></p>
      `;
    }

    // 5. Assistive Devices / ADIP / Equipment / Wheelchair / Hearing Aid
    if (q.includes('adip') || q.includes('device') || q.includes('wheelchair') || q.includes('hearing') || q.includes('braille') || q.includes('aid') || q.includes('appliance') || q.includes('equipment')) {
      return `
        <h4 style="color:var(--accent-gold);margin-bottom:6px">🦽 ADIP Scheme (Free Assistive Aids)</h4>
        <p>The <strong>ADIP Scheme</strong> provides free, modern aids and appliances through ALIMCO to improve independence.</p>
        <div class="ai-feature-card">
          <div style="font-weight:700;color:#fff;margin-bottom:4px">Key Entitlements:</div>
          <ul style="padding-left:18px;font-size:13px;line-height:1.6">
            <li><strong>Locomotor:</strong> Motorized tricycles, smart wheelchairs, prosthetic limbs, crutches.</li>
            <li><strong>Visual:</strong> Smart canes (Daisy players), Braille slates, screen-reading tablets, laptops with JAWS.</li>
            <li><strong>Hearing:</strong> Digital behind-the-ear hearing aids, cochlear implants (up to ₹6 Lakh for children under 5).</li>
            <li><strong>Income Limit:</strong> 100% free aid if family income is up to ₹20,000/month; 50% subsidy for ₹20,001–₹30,000/month.</li>
          </ul>
        </div>
      `;
    }

    // 6. Required Documents / Eligibility / UDID
    if (q.includes('document') || q.includes('udid') || q.includes('kya document') || q.includes('eligibility') || q.includes('documents needed')) {
      return `
        <h4 style="color:var(--accent-cyan);margin-bottom:6px">📄 Standard Documents for Government Schemes</h4>
        <p>When applying for government schemes, you will typically need:</p>
        <ol style="margin-top:8px;padding-left:20px;font-size:13px;line-height:1.6">
          <li><strong>Disability Certificate / UDID Card:</strong> Showing minimum 40% benchmark disability.</li>
          <li><strong>Income Certificate:</strong> Issued by Tehsildar / Competent Revenue Officer.</li>
          <li><strong>Educational Marksheets:</strong> Previous class / semester passing certificates.</li>
          <li><strong>Aadhaar Card &amp; Bank Account:</strong> Bank account seeded with Aadhaar for Direct Benefit Transfer (DBT).</li>
          <li><strong>Domicile / Residence Proof:</strong> For state-sponsored welfare schemes.</li>
        </ol>
      `;
    }

    // 7. WhatsApp Channel / Alerts / Notification
    if (q.includes('whatsapp') || q.includes('channel') || q.includes('group') || q.includes('notification') || q.includes('update') || q.includes('alert')) {
      return `
        <h4 style="color:#25D366;margin-bottom:6px">💬 Official WhatsApp Channel</h4>
        <p>Stay ahead with instant alerts whenever the Ministry of Social Justice or State Governments announce new scholarships, deadline extensions, or assistive equipment distribution camps!</p>
        <div style="margin-top:10px">
          <button class="btn-sm btn-primary" onclick="WhatsAppLead.openModal()">
            📱 Enter Number &amp; Join WhatsApp Channel
          </button>
        </div>
      `;
    }

    // 8. General matching query / default response
    return `
      <p>I can help you explore all <strong>50+ Government Schemes</strong> listed on Samarthya:</p>
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:13px">• <strong>Scholarships & Education:</strong> Pre-Matric, Post-Matric, Top Class, National Overseas.</div>
        <div style="font-size:13px">• <strong>Assistive Devices:</strong> ADIP, ALIMCO free kits, Motorized tricycles.</div>
        <div style="font-size:13px">• <strong>Concessions:</strong> Indian Railways 50-75% discount, state bus pass concessions.</div>
        <div style="font-size:13px">• <strong>Skill & Self-Employment:</strong> NHFDC low-interest micro loans.</div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-sm btn-primary" onclick="App.navigate('match')">🎯 Match My Schemes</button>
        <button class="btn-sm btn-secondary" onclick="SamarthyaAI.openWithPrompt('Which scholarships are available for 40%+ disability?')">Scholarship Details</button>
      </div>
    `;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

window.SamarthyaAI = SamarthyaAI;

// ============================================
// Samarthya — WhatsApp Lead Capture & Scheme Updates Modal
// Triggered seamlessly when user matches schemes
// ============================================

const WhatsAppLead = {
  hasPromptedThisSession: false,
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb90zigATRShQNhLtm2j',

  init() {
    // Check if user already joined
    const saved = localStorage.getItem('samarthya_wa_joined');
    if (saved) {
      this.hasPromptedThisSession = true;
    }
  },

  triggerPostMatchModal(schemesCount = 8) {
    if (this.hasPromptedThisSession) return;
    this.hasPromptedThisSession = true;

    setTimeout(() => {
      this.openModal(schemesCount);
    }, 1200);
  },

  openModal(schemesCount = 8) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div class="wa-lead-card animate-in">
        <button class="wa-lead-close" onclick="App.closeModal()">✕</button>

        <div class="wa-lead-badge">
          <span class="wa-pulse-dot"></span>
          <span>Official WhatsApp Channel</span>
        </div>

        <div class="wa-lead-icon-ring">
          <div class="wa-icon-glow"></div>
          <div class="wa-logo-icon">🔔</div>
        </div>

        <h3 class="wa-lead-title">
          New Welfare Schemes Ka <span class="gradient-text">Pehla Notification</span> Paayein!
        </h3>

        <p class="wa-lead-subtitle">
          Aapke liye <strong>${schemesCount}+ schemes</strong> match hui hain. Government ke latest updated schemes, scholarship deadline extensions aur free assistive aid camps ka direct WhatsApp channel alert paane ke liye apna number darj karein.
        </p>

        <form class="wa-lead-form" onsubmit="WhatsAppLead.handleSubmit(event)">
          <div class="wa-input-group">
            <span class="wa-input-prefix">🇮🇳 +91</span>
            <input
              type="tel"
              id="waPhoneNumber"
              class="wa-phone-input"
              placeholder="Enter 10-digit WhatsApp number"
              pattern="[6-9][0-9]{9}"
              maxlength="10"
              required
              autocomplete="tel"
            >
          </div>

          <button type="submit" class="btn btn-wa-submit">
            <span style="font-size:18px">💬</span>
            <span>Get Instant Alerts &amp; Join WhatsApp Channel</span>
            <span>→</span>
          </button>
        </form>

        <div class="wa-lead-perks">
          <div class="wa-perk-item">
            <span class="wa-perk-icon">⚡</span>
            <span>Instant NSP deadline alerts</span>
          </div>
          <div class="wa-perk-item">
            <span class="wa-perk-icon">🛡️</span>
            <span>100% Free &amp; Zero Spam</span>
          </div>
          <div class="wa-perk-item">
            <span class="wa-perk-icon">🦽</span>
            <span>District ALIMCO camp updates</span>
          </div>
        </div>

        <div class="wa-lead-footer">
          <button class="wa-skip-btn" onclick="App.closeModal()">I will check manually later</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    setTimeout(() => {
      const phoneInput = document.getElementById('waPhoneNumber');
      if (phoneInput) phoneInput.focus();
    }, 200);
  },

  handleSubmit(e) {
    if (e) e.preventDefault();
    const phoneInput = document.getElementById('waPhoneNumber');
    if (!phoneInput || !phoneInput.value.trim()) return;

    const phone = phoneInput.value.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // Save lead locally
    const leads = JSON.parse(localStorage.getItem('samarthya_wa_leads') || '[]');
    leads.push({
      phone: phone,
      timestamp: new Date().toISOString(),
      matchedSchemes: App.matchResults ? App.matchResults.length : 0
    });
    localStorage.setItem('samarthya_wa_leads', JSON.stringify(leads));
    localStorage.setItem('samarthya_wa_joined', 'true');

    // Show Success State with Official Channel Link
    const content = document.getElementById('modalContent');
    if (content) {
      content.innerHTML = `
        <div class="wa-lead-card animate-in" style="text-align:center;padding:36px 28px">
          <div style="font-size:54px;margin-bottom:14px">🎉</div>
          <h3 class="wa-lead-title" style="color:var(--accent-mint)">WhatsApp Alerts Activated!</h3>
          <p class="wa-lead-subtitle" style="margin-bottom:24px">
            Aapka number <strong>+91 ${phone}</strong> register ho gaya hai. Latest government scheme updates paane ke liye abhi hamare official WhatsApp Channel ko follow karein.
          </p>

          <a href="${this.whatsappChannelUrl}" target="_blank" rel="noopener" class="btn btn-wa-submit" style="text-decoration:none;display:inline-flex;margin-bottom:16px">
            <span style="font-size:20px">👉</span>
            <span>Join Official WhatsApp Channel</span>
            <span>💬</span>
          </a>

          <div>
            <button class="btn-sm btn-secondary" onclick="App.closeModal()">Back to Matched Schemes</button>
          </div>
        </div>
      `;
    }
  }
};

window.WhatsAppLead = WhatsAppLead;

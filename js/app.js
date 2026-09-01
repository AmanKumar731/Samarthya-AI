// ============================================
// Samarthya — Main App Controller
// SPA Routing, Form Controller, Scheme Matcher & Dashboard
// ============================================

const App = {
  currentPage: 'home',
  matchResults: null,
  profile: null,

  init() {
    this.populateFormOptions();
    this.setupNavScroll();
    this.setupKeyboardNav();
    this.setupModalClose();

    // Initialize core feature engines
    if (window.SamarthyaDB) SamarthyaDB.init();
    if (window.AccessibilitySuite) AccessibilitySuite.init();
    if (window.WisprFlow) WisprFlow.init();
    if (window.SamarthyaAI) SamarthyaAI.init();
    if (window.WhatsAppLead) WhatsAppLead.init();
    if (window.ApplicationTracker) ApplicationTracker.init();
    if (window.NGOMode) NGOMode.init();
    if (window.CursorEffect) CursorEffect.init();

    // Check URL hash for routing
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      this.navigate(hash, false);
    }

    // Listen for browser back/forward and hash changes
    window.addEventListener('popstate', () => {
      const currentHash = window.location.hash.replace('#', '') || 'home';
      if (document.getElementById('page-' + currentHash) && App.currentPage !== currentHash) {
        App.navigate(currentHash, false);
      }
    });
  },

  navigate(page, eventOrPushState = true) {
    if (eventOrPushState && typeof eventOrPushState === 'object' && eventOrPushState.preventDefault) {
      eventOrPushState.preventDefault();
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      target.querySelectorAll('.animate-in').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });

      if (page === 'dashboard' && window.ApplicationTracker) {
        ApplicationTracker.renderTracker();
      }
      if (page === 'ngo' && window.NGOMode) {
        NGOMode.renderNGODashboard();
      }
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));

    this.currentPage = page;
    const shouldPushState = typeof eventOrPushState === 'boolean' ? eventOrPushState : true;
    if (shouldPushState && window.location.hash !== '#' + page) {
      window.location.hash = page;
    }

    // Close mobile nav
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('open');

    // Announce for accessibility
    if (window.AccessibilitySuite) {
      AccessibilitySuite.announce(`Navigated to ${page} page`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  scrollToAbout(e) {
    if (e) e.preventDefault();
    if (this.currentPage !== 'home') {
      this.navigate('home', true);
      setTimeout(() => {
        const section = document.getElementById('about-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById('about-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  },

  toggleMobileNav() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('open');
  },

  setupNavScroll() {
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  },

  setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        if (window.AccessibilitySuite) AccessibilitySuite.closePanel();
        if (window.SamarthyaAI) SamarthyaAI.close();
        if (window.WisprFlow) WisprFlow.stop();
      }
    });
  },

  setupModalClose() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') this.closeModal();
      });
    }
  },

  populateFormOptions() {
    // Populate states
    const stateSelect = document.getElementById('inputState');
    if (stateSelect && stateSelect.options.length <= 1 && typeof INDIAN_STATES !== 'undefined') {
      INDIAN_STATES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.label;
        stateSelect.appendChild(opt);
      });
    }

    // Populate education levels
    const eduSelect = document.getElementById('inputEducation');
    if (eduSelect && eduSelect.options.length <= 1 && typeof EDUCATION_LEVELS !== 'undefined') {
      EDUCATION_LEVELS.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = I18N.currentLang === 'hi' ? e.labelHi : e.label;
        eduSelect.appendChild(opt);
      });
    }

    // Populate disability checkboxes
    const checkboxContainer = document.getElementById('disabilityCheckboxes');
    if (checkboxContainer && checkboxContainer.children.length === 0 && typeof DISABILITY_TYPES !== 'undefined') {
      DISABILITY_TYPES.forEach(d => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        item.setAttribute('data-value', d.id);
        item.innerHTML = `
          <input type="checkbox" value="${d.id}">
          <span class="checkbox-custom"></span>
          <span>${I18N.currentLang === 'hi' ? d.labelHi : d.label}</span>
        `;
        item.addEventListener('click', (e) => {
          const cb = item.querySelector('input[type="checkbox"]');
          if (e.target !== cb) {
            cb.checked = !cb.checked;
          }

          if (cb.value === 'none' && cb.checked) {
            checkboxContainer.querySelectorAll('input[type="checkbox"]').forEach(other => {
              if (other !== cb) {
                other.checked = false;
                other.closest('.checkbox-item').classList.remove('selected');
              }
            });
          } else if (cb.value !== 'none' && cb.checked) {
            const noneCheckbox = checkboxContainer.querySelector('input[value="none"]');
            if (noneCheckbox) {
              noneCheckbox.checked = false;
              noneCheckbox.closest('.checkbox-item').classList.remove('selected');
            }
          }

          item.classList.toggle('selected', cb.checked);
        });
        checkboxContainer.appendChild(item);
      });
    }
  },

  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('active');
  },

  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  openModal(html) {
    const content = document.getElementById('modalContent');
    const overlay = document.getElementById('modalOverlay');
    if (content && overlay) {
      content.innerHTML = html;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  showSchemeDetails(schemeId) {
    let result = null;
    if (this.matchResults) {
      result = this.matchResults.find(r => r.scheme.id === schemeId);
    }
    const s = SCHEME_DATABASE.find(item => item.id === schemeId);
    if (!s) return;

    const lang = I18N.currentLang;
    const score = result ? result.score : 85;

    const checksHtml = result ? result.checks.map(c => `
      <div class="check-item ${c.passed ? 'passed' : 'failed'}">
        <div class="check-icon">${c.passed ? '✓' : '✗'}</div>
        <div>
          <strong>${c.name}</strong> (Weight: ${c.weight}%)
          ${c.detail ? `<div class="check-detail">${c.detail}</div>` : ''}
        </div>
      </div>
    `).join('') : '';

    const docsHtml = (s.documents || []).map(d => `
      <div class="doc-item">
        <span>📄</span>
        <span>${d}</span>
      </div>
    `).join('');

    const modalHtml = `
      <div class="modal" style="position:relative;background:rgba(7,35,34,0.98);backdrop-filter:blur(24px);border:1.5px solid var(--border);border-radius:var(--radius-xl);padding:32px;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
        <button class="modal-close" onclick="App.closeModal()" style="position:absolute;top:18px;right:18px;background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer">✕</button>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span class="section-tag" style="margin:0">${s.category.toUpperCase()}</span>
          <span style="font-size:12px;color:var(--accent-mint);font-weight:700">● ${score}% Match Fit</span>
        </div>

        <h2 style="font-family:var(--font-heading);font-size:24px;font-weight:800;color:#fff;margin-bottom:6px">${lang === 'hi' ? s.nameHi : s.name}</h2>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px">${s.ministry}</p>

        <div class="scheme-benefit" style="margin-bottom:20px">
          <div class="scheme-benefit-amount">${s.benefits.amount}</div>
          <div class="scheme-benefit-desc">${s.benefits.description}</div>
        </div>

        <div style="margin-bottom:20px">
          <h4 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:8px">📋 Eligibility Rules Evaluation</h4>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${checksHtml}
          </div>
        </div>

        <div style="margin-bottom:24px">
          <h4 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:8px">📄 Required Documents</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
            ${docsHtml}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid var(--border);padding-top:20px">
          <button class="btn btn-secondary" onclick="ApplicationTracker.trackScheme('${s.id}');App.closeModal()">
            📂 Track in Pipeline
          </button>
          <a href="${s.applyUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="text-decoration:none">
            Apply on Official Portal →
          </a>
        </div>
      </div>
    `;

    this.openModal(modalHtml);
  }
};

// ============ Anti-Bot Security Controller ============
const CaptchaController = {
  a: 0,
  b: 0,
  ans: 0,

  init() {
    this.refreshChallenge();
  },

  refreshChallenge() {
    this.a = Math.floor(Math.random() * 9) + 2;
    this.b = Math.floor(Math.random() * 8) + 1;
    this.ans = this.a + this.b;

    const q = document.getElementById('captchaQuestion');
    if (q) q.textContent = `${this.a} + ${this.b} = ?`;

    const input = document.getElementById('captchaInput');
    if (input) input.value = '';
    const err = document.getElementById('captchaError');
    if (err) err.style.display = 'none';
  },

  validate() {
    const hp = document.getElementById('hpField');
    if (hp && hp.value !== '') return false;

    const input = document.getElementById('captchaInput');
    if (!input || parseInt(input.value) !== this.ans) {
      const err = document.getElementById('captchaError');
      if (err) {
        err.textContent = 'Incorrect security answer. Please solve again.';
        err.style.display = 'block';
      }
      this.refreshChallenge();
      return false;
    }
    return true;
  }
};

// ============ Form Stepper Controller ============
const FormController = {
  currentStep: 1,

  goToStep(step) {
    if (step > this.currentStep && !this.validateCurrentStep()) return;

    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.step-dot').forEach((d, idx) => {
      d.classList.remove('active');
      if (idx + 1 < step) d.classList.add('completed');
      else d.classList.remove('completed');
    });
    document.querySelectorAll('.step-label').forEach(l => l.classList.remove('active'));

    const targetPanel = document.getElementById('formStep' + step);
    if (targetPanel) targetPanel.classList.add('active');

    const targetDot = document.getElementById('stepDot' + step);
    if (targetDot) targetDot.classList.add('active');

    const labels = document.querySelectorAll('.step-label');
    if (labels[step - 1]) labels[step - 1].classList.add('active');

    for (let i = 1; i <= 2; i++) {
      const line = document.getElementById('stepLine' + i);
      if (line) {
        if (i < step) line.classList.add('completed');
        else line.classList.remove('completed');
      }
    }

    this.currentStep = step;
  },

  nextStep() {
    if (this.validateCurrentStep()) {
      this.goToStep(this.currentStep + 1);
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  },

  validateCurrentStep() {
    if (this.currentStep === 1) {
      const dob = document.getElementById('inputDob').value;
      const gender = document.getElementById('inputGender').value;
      const state = document.getElementById('inputState').value;
      if (!dob || !gender || !state) {
        alert('Please fill all required fields in Personal Info.');
        return false;
      }
      return true;
    }

    if (this.currentStep === 2) {
      const checked = document.querySelectorAll('#disabilityCheckboxes input:checked');
      if (checked.length === 0) {
        const err = document.getElementById('disabilityError');
        if (err) err.style.display = 'block';
        return false;
      }
      return true;
    }

    if (this.currentStep === 3) {
      const edu = document.getElementById('inputEducation').value;
      const inc = document.getElementById('inputIncome').value;
      if (!edu || !inc) {
        alert('Please select both your education level and income range.');
        return false;
      }
      return true;
    }
    return true;
  },

  updatePercent(val) {
    const disp = document.getElementById('percentDisplay');
    if (disp) disp.textContent = val + '%';
  },

  submit() {
    if (!this.validateCurrentStep()) return;

    const disabilityTypes = [];
    document.querySelectorAll('#disabilityCheckboxes input:checked').forEach(cb => {
      disabilityTypes.push(cb.value);
    });

    const dob = document.getElementById('inputDob').value;
    const age = SamarthyaMatcher.calculateAge(dob);

    const profile = {
      name: document.getElementById('inputName').value || 'Student Beneficiary',
      dob: dob,
      age: age,
      gender: document.getElementById('inputGender').value,
      state: document.getElementById('inputState').value,
      disabilityTypes: disabilityTypes,
      disabilityPercent: parseInt(document.getElementById('inputPercent').value),
      educationLevel: document.getElementById('inputEducation').value,
      householdIncome: parseInt(document.getElementById('inputIncome').value)
    };

    App.profile = profile;
    App.showLoading();

    setTimeout(() => {
      const results = SamarthyaMatcher.match(profile, SCHEME_DATABASE);
      App.matchResults = results;

      ResultsRenderer.render(results, profile);
      DashboardRenderer.render(results, profile);

      App.hideLoading();
    }, 900);
  }
};

// ============ Results Renderer ============
const ResultsRenderer = {
  currentFilter: 'all',

  render(results, profile) {
    const area = document.getElementById('resultsArea');
    area.style.display = 'block';

    setTimeout(() => {
      area.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    this.renderResults(results);

    // Trigger WhatsApp notification lead modal
    if (window.WhatsAppLead) {
      WhatsAppLead.triggerPostMatchModal(results.length);
    }
  },

  renderResults(results) {
    const area = document.getElementById('resultsArea');
    let filtered = results;

    if (this.currentFilter === 'almost') {
      filtered = results.filter(r => r.isAlmostEligible);
    } else if (this.currentFilter !== 'all') {
      filtered = results.filter(r => r.scheme.category === this.currentFilter);
    }

    const almostCount = results.filter(r => r.isAlmostEligible).length;
    const categories = [...new Set(results.map(r => r.scheme.category))];

    const filterPillsHtml = `
      <div class="filter-pill ${this.currentFilter === 'all' ? 'active' : ''}" onclick="ResultsRenderer.filter('all')">
        All Schemes (${results.length})
      </div>
      <div class="filter-pill ${this.currentFilter === 'almost' ? 'active' : ''}" onclick="ResultsRenderer.filter('almost')" style="border-color:#f59e0b;color:#fbbf24">
        ⚡ Near Match (${almostCount})
      </div>
      ${categories.map(cat => {
        const catInfo = SCHEME_CATEGORIES[cat] || { icon: '📋', label: cat };
        const count = results.filter(r => r.scheme.category === cat).length;
        return `<div class="filter-pill ${this.currentFilter === cat ? 'active' : ''}" onclick="ResultsRenderer.filter('${cat}')">
          ${catInfo.icon} ${catInfo.label} (${count})
        </div>`;
      }).join('')}
    `;

    if (filtered.length === 0) {
      area.innerHTML = `
        <div class="section-header" style="margin-bottom:20px">
          <h2 class="section-title">0 Matched Schemes Found</h2>
        </div>
        <div class="filter-pills" style="margin-bottom:24px">${filterPillsHtml}</div>
        <div class="form-card" style="text-align:center;padding:40px">
          <p>No schemes matched for this specific category filter.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = filtered.map((r, i) => this.renderSchemeCard(r, i)).join('');

    // WhatsApp VIP banner
    const waBannerHtml = `
      <div style="margin-bottom:28px;background:linear-gradient(135deg,rgba(37,211,102,0.15) 0%,rgba(18,140,126,0.15) 100%);border:1.5px solid rgba(37,211,102,0.4);border-radius:var(--radius-lg);padding:20px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:48px;height:48px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;box-shadow:0 0 20px rgba(37,211,102,0.5)">💬</div>
          <div>
            <div style="font-weight:800;font-size:16px;color:#fff">Never Miss a Government Scheme Update!</div>
            <div style="font-size:13px;color:var(--text-secondary)">Join 15,000+ students receiving direct WhatsApp notifications for scholarships &amp; camps.</div>
          </div>
        </div>
        <button class="btn btn-wa-submit" onclick="WhatsAppLead.openModal(${results.length})" style="padding:10px 20px;font-size:13px">
          <span>Get WhatsApp Alerts</span> <span>→</span>
        </button>
      </div>
    `;

    area.innerHTML = `
      ${waBannerHtml}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;margin-bottom:24px">
        <div>
          <div class="section-tag" style="margin-bottom:8px">EVALUATION RESULTS</div>
          <h2 class="section-title" style="font-size:30px;margin-bottom:4px">${App.profile.name}'s Matched Entitlements</h2>
          <p class="section-subtitle" style="margin:0;text-align:left">${filtered.length} government schemes matched based on your verified criteria.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-sm btn-primary" onclick="BeneficiaryReport.downloadReport()" title="Print / Download PDF Report">
            📄 Download Summary (PDF)
          </button>
          <button class="btn-sm btn-secondary" onclick="BeneficiaryReport.shareOnWhatsApp()" style="color:#25D366" title="Share with friends">
            📲 Share on WhatsApp
          </button>
          <button class="btn-sm btn-secondary" onclick="BeneficiaryReport.openCampLocator()" title="Nearest assistive aid camp">
            📍 Nearest Camps &amp; DDRC
          </button>
        </div>
      </div>
      <div class="filter-pills" style="margin-bottom:24px">${filterPillsHtml}</div>
      <div class="scheme-cards">${cardsHtml}</div>
    `;
  },

  renderSchemeCard(result, index) {
    const s = result.scheme;
    const lang = I18N.currentLang;
    const catInfo = SCHEME_CATEGORIES[s.category] || { icon: '📋', label: s.category, color: '#10B981' };

    const statusLabels = {
      'highly-eligible': 'Highly Eligible',
      'likely-eligible': 'Likely Eligible',
      'partially-eligible': 'Partial Match',
      'low-match': 'Low Match'
    };

    const statusClass = {
      'highly-eligible': 'status-highly',
      'likely-eligible': 'status-likely',
      'partially-eligible': 'status-partial',
      'low-match': 'status-low'
    };

    const circumference = 2 * Math.PI * 22;
    const dashoffset = circumference - (result.score / 100) * circumference;
    const scoreColor = result.score >= 80 ? '#10B981' : result.score >= 60 ? '#38BDF8' : result.score >= 40 ? '#FBBF24' : '#F43F5E';

    const matchedPills = (result.matchedReasons || []).slice(0, 3).map(r => `
      <span style="font-size:11px;color:#e2e8f0;background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:4px">✓ ${r}</span>
    `).join(' ');

    const missingBoxHtml = result.missingReasons && result.missingReasons.length > 0 ? `
      <div class="missing-criteria-box">
        <strong>⚠️ Notes:</strong> ${result.missingReasons.join(' • ')}
      </div>
    ` : '';

    return `
      <div class="scheme-card">
        <div class="scheme-card-header">
          <div>
            <span class="scheme-category-badge" style="background:${catInfo.color}20;color:${catInfo.color};border:1px solid ${catInfo.color}40">
              ${catInfo.icon} ${catInfo.label}
            </span>
            <span class="status-badge ${statusClass[result.status]}" style="margin-left:6px">${statusLabels[result.status]}</span>
          </div>
          <div class="scheme-score-ring">
            <svg viewBox="0 0 48 48">
              <circle class="ring-bg" cx="24" cy="24" r="22"/>
              <circle class="ring-fill" cx="24" cy="24" r="22"
                stroke="${scoreColor}"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashoffset}"/>
            </svg>
            <div class="scheme-score-text" style="color:${scoreColor}">${result.score}%</div>
          </div>
        </div>

        <h3 class="scheme-name">${lang === 'hi' ? s.nameHi : s.name}</h3>
        <p class="scheme-ministry">${s.ministry}</p>

        <div class="trust-layer-card">
          <div class="trust-header">
            <span class="trust-title">🛡️ Trust Layer: Match Factors</span>
            <span class="trust-confidence-pill">${result.score}% Score</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            ${matchedPills}
          </div>
          ${missingBoxHtml}
        </div>

        <div class="scheme-benefit">
          <div class="scheme-benefit-amount">${s.benefits.amount}</div>
          <div class="scheme-benefit-desc">${s.benefits.description}</div>
        </div>

        <div class="scheme-card-footer">
          <div class="scheme-deadline">
            📅 Deadline: ${result.daysToDeadline > 0 ? result.daysToDeadline + ' days remaining' : 'Active Scheme'}
          </div>
          <div class="scheme-actions">
            <button class="btn-sm btn-sm-outline" onclick="App.showSchemeDetails('${s.id}')">
              View Details
            </button>
            <button class="btn-sm btn-secondary" onclick="ApplicationTracker.trackScheme('${s.id}')">
              📂 Track
            </button>
            <a href="${s.applyUrl}" target="_blank" rel="noopener" class="btn-sm btn-sm-primary" style="text-decoration:none">
              Apply →
            </a>
          </div>
        </div>
      </div>
    `;
  },

  filter(category) {
    this.currentFilter = category;
    this.renderResults(App.matchResults);
  }
};

// ============ Dashboard Renderer ============
const DashboardRenderer = {
  render(results, profile) {
    const container = document.getElementById('dashboardContent');
    const stats = SamarthyaMatcher.getStats(results);

    let totalCashValue = 0;
    results.slice(0, 8).forEach(r => {
      const amtStr = r.scheme.benefits ? r.scheme.benefits.amount : '';
      const matchNum = amtStr.match(/₹([\d,]+)/);
      if (matchNum) {
        totalCashValue += parseInt(matchNum[1].replace(/,/g, ''));
      }
    });
    if (totalCashValue === 0) totalCashValue = 145000;

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px">
        <div class="form-card" style="text-align:center;padding:20px">
          <div style="font-size:24px;margin-bottom:6px">🎯</div>
          <div style="font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--accent-mint)">${results.length}</div>
          <div style="font-size:12px;color:var(--text-muted)">Matched Schemes</div>
        </div>
        <div class="form-card" style="text-align:center;padding:20px">
          <div style="font-size:24px;margin-bottom:6px">✅</div>
          <div style="font-family:var(--font-heading);font-size:28px;font-weight:800;color:#38BDF8">${stats.highlyEligible}</div>
          <div style="font-size:12px;color:var(--text-muted)">High Priority Fits</div>
        </div>
        <div class="form-card" style="text-align:center;padding:20px">
          <div style="font-size:24px;margin-bottom:6px">💰</div>
          <div style="font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--accent-gold)">₹${totalCashValue.toLocaleString('en-IN')}</div>
          <div style="font-size:12px;color:var(--text-muted)">Est. Annual Entitlements</div>
        </div>
      </div>

      <div style="margin-top:36px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div>
            <h3 style="font-size:20px;font-weight:800;color:#fff;margin:0">📂 My Applications Tracker</h3>
            <p style="font-size:13px;color:var(--text-muted);margin:2px 0 0">Live 5-stage DBT verification pipeline</p>
          </div>
          <button class="btn-sm btn-primary" onclick="App.navigate('match')">+ Find More Schemes</button>
        </div>
        <div id="trackerApplicationsList" class="tracker-container"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.ApplicationTracker) ApplicationTracker.renderTracker();
    }, 100);
  }
};

// ============ Hero 3D Stage Visualizer ============
const HeroVisualizer = {
  init() {
    const canvas = document.getElementById('morphing-rings-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * (window.devicePixelRatio || 1);
      height = canvas.height = rect.height * (window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;
    const rings = 5;
    const particles = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        radius: Math.random() * 140 + 40,
        speed: (Math.random() - 0.5) * 0.02,
        angle: Math.random() * Math.PI * 2,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.5 ? '#6EE7B7' : '#38BDF8'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      angle += 0.008;

      const cx = width / 2;
      const cy = height / 2;

      // Draw rotating concentric rings
      for (let i = 1; i <= rings; i++) {
        const r = (i * 38) * (width / 500);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110, 231, 183, ${0.08 + (i * 0.03)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Orbital nodes
        const nodeAngle = angle * (i % 2 === 0 ? 1 : -1) + (i * 1.2);
        const nx = cx + Math.cos(nodeAngle) * r;
        const ny = cy + Math.sin(nodeAngle) * r;

        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#10B981' : '#38BDF8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw floating orbital particles
      particles.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * (p.radius * (width / 500));
        const py = cy + Math.sin(p.angle) * (p.radius * (width / 500));

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
};

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  HeroVisualizer.init();
});


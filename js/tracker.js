// ============================================
// Samarthya — Application Tracker & Deadline Alerts
// Feature 5: Lifecycle Stepper, Reminders & Benefit Calculator
// ============================================

const ApplicationTracker = {
  trackedApplications: [],

  init() {
    this.loadFromStorage();
  },

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('samarthya_tracked_apps');
      if (stored) {
        this.trackedApplications = JSON.parse(stored);
      } else {
        // Default initial items
        this.trackedApplications = [
          {
            id: 'app_1',
            schemeId: 'post_matric_pwd',
            schemeName: 'Post-Matric Scholarship for Students with Disabilities',
            ministry: 'Department of Empowerment of Persons with Disabilities',
            appliedDate: '2026-02-10',
            deadline: '2026-03-31',
            status: 'verification', // draft, applied, verification, review, disbursed
            benefitAmount: '₹48,000 / year',
            refNo: 'NSP-2026-PWD-849201'
          },
          {
            id: 'app_2',
            schemeId: 'adip_scheme',
            schemeName: 'ADIP Scheme (Free Assistive Devices)',
            ministry: 'Ministry of Social Justice and Empowerment',
            appliedDate: '2026-01-20',
            deadline: '2026-04-15',
            status: 'review',
            benefitAmount: 'Motorized Tricycle / Braille Kit',
            refNo: 'ALIMCO-CAMP-2026-5531'
          }
        ];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('samarthya_tracked_apps', JSON.stringify(this.trackedApplications));
    } catch (e) {}
  },

  trackScheme(schemeId) {
    const scheme = SCHEME_DATABASE.find(s => s.id === schemeId);
    if (!scheme) return;

    // Check if already tracked
    const existing = this.trackedApplications.find(a => a.schemeId === schemeId);
    if (existing) {
      alert(`"${scheme.name}" is already in your Application Tracker!`);
      App.navigate('dashboard');
      return;
    }

    const newApp = {
      id: 'app_' + Date.now(),
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: scheme.deadline || '2026-05-30',
      status: 'applied',
      benefitAmount: scheme.benefits ? scheme.benefits.amount : 'Financial Grant',
      refNo: 'SAM-' + Math.floor(100000 + Math.random() * 900000)
    };

    this.trackedApplications.unshift(newApp);
    this.saveToStorage();
    this.renderTracker();

    alert(`✓ Added "${scheme.name}" to your Application Tracker!`);
    App.navigate('dashboard');
  },

  updateStatus(appId, newStatus) {
    const app = this.trackedApplications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      this.saveToStorage();
      this.renderTracker();
    }
  },

  removeApplication(appId) {
    if (confirm('Are you sure you want to remove this tracked application?')) {
      this.trackedApplications = this.trackedApplications.filter(a => a.id !== appId);
      this.saveToStorage();
      this.renderTracker();
    }
  },

  renderTracker() {
    const container = document.getElementById('trackerApplicationsList');
    if (!container) return;

    if (this.trackedApplications.length === 0) {
      container.innerHTML = `
        <div class="no-results" style="padding:30px">
          <div class="no-results-icon">📂</div>
          <h4>No Active Applications Tracked</h4>
          <p>Find schemes and click "Track Application" to monitor their approval progress here.</p>
          <button class="btn btn-primary" onclick="App.navigate('match')" style="margin-top:10px">Find Schemes →</button>
        </div>
      `;
      return;
    }

    const stages = [
      { key: 'draft', label: '1. Draft' },
      { key: 'applied', label: '2. Applied' },
      { key: 'verification', label: '3. Doc Verification' },
      { key: 'review', label: '4. State Review' },
      { key: 'disbursed', label: '5. Approved & DBT' }
    ];

    container.innerHTML = this.trackedApplications.map(app => {
      const currentStageIndex = stages.findIndex(s => s.key === app.status);

      const stepperHtml = stages.map((s, idx) => {
        let dotClass = 'tracker-step-dot';
        if (idx < currentStageIndex) dotClass += ' done';
        else if (idx === currentStageIndex) dotClass += ' current';

        return `
          <div class="tracker-step-item" style="flex:1;cursor:pointer" onclick="ApplicationTracker.updateStatus('${app.id}', '${s.key}')" title="Click to update status to ${s.label}">
            <div class="${dotClass}">${idx < currentStageIndex ? '✓' : idx + 1}</div>
            <div class="tracker-step-title">${s.label}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="tracker-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
            <div>
              <span class="status-badge status-likely" style="font-size:11px">Ref: ${app.refNo}</span>
              <h3 style="font-size:17px;font-weight:700;color:#fff;margin:6px 0 2px">${app.schemeName}</h3>
              <p style="font-size:12px;color:var(--text-muted);margin:0">${app.ministry}</p>
            </div>
            <div style="text-align:right">
              <div style="font-size:15px;font-weight:800;color:#34d399">${app.benefitAmount}</div>
              <div style="font-size:11px;color:#f87171">Deadline: ${app.deadline}</div>
            </div>
          </div>

          <!-- Stepper -->
          <div class="tracker-stepper">${stepperHtml}</div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)">
            <div style="font-size:12px;color:#94a3b8">
              Applied on: <strong>${app.appliedDate}</strong>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn-sm btn-secondary" onclick="ApplicationTracker.openReminderModal('${app.schemeName}', '${app.deadline}')">
                🔔 Set Alert
              </button>
              <button class="btn-sm btn-secondary" onclick="ApplicationTracker.downloadCalendar('${app.schemeName}', '${app.deadline}')">
                📅 Add to Calendar
              </button>
              <button class="btn-sm" style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)" onclick="ApplicationTracker.removeApplication('${app.id}')">
                ✕
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openReminderModal(schemeName, deadline) {
    App.openModal(`
      <div style="padding:10px">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">🔔</span>
            <div>
              <h3 style="font-size:18px;font-weight:700;color:#fff;margin:0">Set Application Deadline Alert</h3>
              <p style="font-size:12px;color:#94a3b8;margin:0">Receive SMS & Email notifications before scheme closes</p>
            </div>
          </div>
          <button class="modal-close" onclick="App.closeModal()">✕</button>
        </div>

        <div style="margin:16px 0">
          <div style="font-size:13px;color:#fff;margin-bottom:12px">
            Scheme: <strong>${schemeName}</strong><br>
            Closing Date: <strong style="color:#f87171">${deadline}</strong>
          </div>

          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Mobile Number for SMS Reminders</label>
            <input type="tel" class="form-input" id="alertPhone" placeholder="+91 98765 43210" value="+91 9876543210">
          </div>

          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Email Address for Notifications</label>
            <input type="email" class="form-input" id="alertEmail" placeholder="student@example.com" value="student@samarthya.in">
          </div>

          <div class="form-group">
            <label class="form-label">Alert Frequency</label>
            <select class="form-select" id="alertFreq">
              <option value="7">7 Days Before Deadline</option>
              <option value="15">15 Days Before Deadline</option>
              <option value="30">30 Days Before Deadline</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary" onclick="ApplicationTracker.confirmReminder('${schemeName}')" style="width:100%;justify-content:center">
          ✓ Schedule Automated Alerts
        </button>
      </div>
    `);
  },

  confirmReminder(schemeName) {
    App.closeModal();
    alert(`✓ Reminder Scheduled! You will receive SMS & Email alerts for "${schemeName}".`);
  },

  downloadCalendar(schemeName, deadline) {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Samarthya Portal//Govt Scheme Deadlines//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Deadline: ${schemeName}`,
      `DESCRIPTION:Samarthya Welfare Portal Application Deadline for ${schemeName}. Apply at NSP / Govt Portal.`,
      `DTSTART:${deadline.replace(/-/g, '')}T090000Z`,
      `DTEND:${deadline.replace(/-/g, '')}T180000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${schemeName.slice(0, 20)}_deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

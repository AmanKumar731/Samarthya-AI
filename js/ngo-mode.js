// ============================================
// Samarthya — NGO & Counselor Mode
// Feature 6: Bulk Camp Matching & Aggregate Analytics
// ============================================

const NGOMode = {
  campStudents: [],
  batchResults: [],

  demoDataset: [
    { name: 'Aarav Gupta', dob: '2005-04-12', gender: 'male', state: 'uttar_pradesh', disabilityType: 'locomotor_disability', percent: 60, education: 'higher_secondary', income: 120000 },
    { name: 'Meera Sharma', dob: '2003-08-20', gender: 'female', state: 'delhi', disabilityType: 'blindness', percent: 80, education: 'graduate', income: 80000 },
    { name: 'Kavita Patel', dob: '2007-02-15', gender: 'female', state: 'gujarat', disabilityType: 'deaf', percent: 50, education: 'secondary', income: 150000 },
    { name: 'Rohan Deshmukh', dob: '2004-11-09', gender: 'male', state: 'maharashtra', disabilityType: 'intellectual_disability', percent: 45, education: 'vocational', income: 60000 },
    { name: 'Pooja Reddy', dob: '2002-06-30', gender: 'female', state: 'telangana', disabilityType: 'cerebral_palsy', percent: 70, education: 'post_graduate', income: 200000 },
    { name: 'Vikram Singh', dob: '2006-09-18', gender: 'male', state: 'rajasthan', disabilityType: 'autism_spectrum_disorder', percent: 55, education: 'secondary', income: 90000 },
    { name: 'Ananya Roy', dob: '2004-03-22', gender: 'female', state: 'west_bengal', disabilityType: 'low_vision', percent: 40, education: 'graduate', income: 110000 },
    { name: 'Deepak Kumar', dob: '2001-12-05', gender: 'male', state: 'bihar', disabilityType: 'locomotor_disability', percent: 65, education: 'professional', income: 140000 },
    { name: 'Sneha Nair', dob: '2005-07-14', gender: 'female', state: 'kerala', disabilityType: 'hard_of_hearing', percent: 45, education: 'higher_secondary', income: 180000 },
    { name: 'Manish Verma', dob: '2008-01-28', gender: 'male', state: 'madhya_pradesh', disabilityType: 'mental_illness', percent: 50, education: 'upper_primary', income: 75000 },
    { name: 'Farhan Ali', dob: '2003-10-10', gender: 'male', state: 'karnataka', disabilityType: 'muscular_dystrophy', percent: 75, education: 'graduate', income: 160000 },
    { name: 'Divya Joshi', dob: '2006-05-19', gender: 'female', state: 'uttarakhand', disabilityType: 'multiple_disabilities', percent: 85, education: 'higher_secondary', income: 95000 }
  ],

  init() {
    this.loadDemoBatch();
  },

  loadDemoBatch() {
    this.campStudents = [...this.demoDataset];
    this.processBatch();
  },

  processBatch() {
    this.batchResults = this.campStudents.map(student => {
      const profile = {
        name: student.name,
        dob: student.dob,
        age: SamarthyaMatcher.calculateAge(student.dob),
        gender: student.gender,
        state: student.state,
        disabilityTypes: [student.disabilityType],
        disabilityPercent: student.percent,
        educationLevel: student.education,
        householdIncome: student.income
      };
      const matches = SamarthyaMatcher.match(profile, SCHEME_DATABASE);
      const topMatches = matches.slice(0, 4);

      // Estimate cash benefit
      let totalEstCash = 0;
      topMatches.forEach(m => {
        const amtStr = m.scheme.benefits.amount || '';
        const matchNum = amtStr.match(/₹([\d,]+)/);
        if (matchNum) {
          totalEstCash += parseInt(matchNum[1].replace(/,/g, ''));
        }
      });
      if (totalEstCash === 0) totalEstCash = 35000;

      return {
        student,
        profile,
        matches,
        topMatches,
        estimatedCash: totalEstCash
      };
    });

    this.renderNGODashboard();
  },

  handleCSVUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        alert('CSV appears empty or has only header.');
        return;
      }

      // Simple CSV parser
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 7) {
          parsed.push({
            name: cols[0] || `Student ${i}`,
            dob: cols[1] || '2004-01-01',
            gender: cols[2] || 'male',
            state: cols[3] || 'uttar_pradesh',
            disabilityType: cols[4] || 'locomotor_disability',
            percent: parseInt(cols[5]) || 40,
            education: cols[6] || 'graduate',
            income: parseInt(cols[7]) || 150000
          });
        }
      }

      if (parsed.length > 0) {
        this.campStudents = parsed;
        this.processBatch();
        alert(`✓ Loaded ${parsed.length} student records from CSV successfully!`);
      } else {
        alert('Could not parse CSV format. Please use the template.');
      }
    };
    reader.readAsText(file);
  },

  downloadTemplate() {
    const header = "Name,DOB,Gender,State,DisabilityType,Percent,Education,AnnualIncome\n";
    const sample = "Sunita Sharma,2003-05-14,female,uttar_pradesh,locomotor_disability,55,graduate,150000\n" +
                   "Rahul Verma,2005-09-20,male,delhi,blindness,75,higher_secondary,100000\n";
    const blob = new Blob([header + sample], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "samarthya_ngo_camp_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportBatchCSV() {
    let csv = "Student Name,Age,Gender,State,Disability,Percent,Matched Schemes Count,Top Scheme,Est Benefit Value\n";
    this.batchResults.forEach(r => {
      const topScheme = r.topMatches[0] ? r.topMatches[0].scheme.name.replace(/,/g, ' ') : 'None';
      csv += `"${r.student.name}",${r.profile.age},"${r.student.gender}","${r.student.state}","${r.student.disabilityType}",${r.student.percent}%,${r.matches.length},"${topScheme}","₹${r.estimatedCash.toLocaleString('en-IN')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `ngo_camp_batch_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  renderNGODashboard() {
    const statsContainer = document.getElementById('ngoStatsContainer');
    const tableBody = document.getElementById('ngoStudentTableBody');
    if (!statsContainer || !tableBody) return;

    const totalStudents = this.batchResults.length;
    const totalPotentialGrants = this.batchResults.reduce((sum, r) => sum + r.estimatedCash, 0);
    const avgSchemesPerStudent = totalStudents > 0
      ? (this.batchResults.reduce((sum, r) => sum + r.matches.length, 0) / totalStudents).toFixed(1)
      : 0;

    statsContainer.innerHTML = `
      <div class="ngo-stat-box">
        <div class="ngo-stat-num" style="color:#38bdf8">${totalStudents}</div>
        <div class="ngo-stat-desc">👥 Students in Current Camp Batch</div>
      </div>
      <div class="ngo-stat-box">
        <div class="ngo-stat-num" style="color:#34d399">₹${(totalPotentialGrants / 100000).toFixed(1)} Lakhs</div>
        <div class="ngo-stat-desc">💰 Cumulative Potential Welfare Entitlements</div>
      </div>
      <div class="ngo-stat-box">
        <div class="ngo-stat-num" style="color:#a855f7">${avgSchemesPerStudent}</div>
        <div class="ngo-stat-desc">🎯 Average Schemes Matched per Student</div>
      </div>
      <div class="ngo-stat-box">
        <div class="ngo-stat-num" style="color:#fbbf24">100%</div>
        <div class="ngo-stat-desc">⚡ Direct Benefit Transfer (DBT) Readiness</div>
      </div>
    `;

    tableBody.innerHTML = this.batchResults.map((r, i) => {
      const topPills = r.topMatches.slice(0, 2).map(m => `
        <span class="status-badge status-likely" style="font-size:11px;margin-right:4px;margin-bottom:2px;display:inline-block">
          ${m.scheme.name.slice(0, 26)}... (${m.score}%)
        </span>
      `).join('');

      return `
        <tr>
          <td><strong>#${i + 1}</strong></td>
          <td>
            <div style="font-weight:700;color:#fff">${r.student.name}</div>
            <div style="font-size:11px;color:#94a3b8">${r.student.gender}, ${r.profile.age} yrs • ${r.student.state.replace(/_/g, ' ')}</div>
          </td>
          <td>
            <span style="font-weight:600;color:#38bdf8">${r.student.disabilityType.replace(/_/g, ' ')}</span>
            <div style="font-size:11px;color:#cbd5e1">${r.student.percent}% certified</div>
          </td>
          <td>
            <span style="font-size:14px;font-weight:800;color:#34d399">${r.matches.length} schemes</span>
          </td>
          <td>
            <div style="display:flex;flex-direction:column;gap:4px">${topPills}</div>
          </td>
          <td>
            <strong style="color:#fcd34d">₹${r.estimatedCash.toLocaleString('en-IN')}</strong>
          </td>
          <td>
            <button class="btn-sm btn-secondary" onclick="NGOMode.showStudentDetail(${i})">View Match Slip</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  showStudentDetail(index) {
    const item = this.batchResults[index];
    if (!item) return;

    const schemesList = item.topMatches.map(m => `
      <div style="padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong style="color:#fff">${m.scheme.name}</strong>
          <span style="color:#34d399;font-weight:800">${m.score}% Match</span>
        </div>
        <div style="font-size:12px;color:#38bdf8;margin:2px 0">Benefit: ${m.scheme.benefits.amount}</div>
        <div style="font-size:11px;color:#94a3b8">${m.scheme.benefits.description}</div>
      </div>
    `).join('');

    App.openModal(`
      <div style="padding:10px">
        <div class="modal-header">
          <div>
            <span class="ngo-badge-tag">Camp Beneficiary Match Slip</span>
            <h3 style="font-size:18px;font-weight:700;color:#fff;margin:6px 0 2px">${item.student.name}</h3>
            <p style="font-size:12px;color:#94a3b8;margin:0">${item.student.state} • ${item.student.disabilityType} (${item.student.percent}%)</p>
          </div>
          <button class="modal-close" onclick="App.closeModal()">✕</button>
        </div>

        <div style="margin:16px 0">
          <h4 style="font-size:14px;color:#fff;margin-bottom:10px">Top Eligible Schemes (${item.matches.length} total matched):</h4>
          ${schemesList}
        </div>

        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-secondary" onclick="window.print()" style="flex:1;justify-content:center">
            🖨️ Print Beneficiary Slip
          </button>
          <button class="btn btn-primary" onclick="App.closeModal()" style="flex:1;justify-content:center">
            Done
          </button>
        </div>
      </div>
    `);
  }
};

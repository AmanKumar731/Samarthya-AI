// ============================================
// Samarthya — Internationalization (i18n)
// English ↔ Hindi toggle
// ============================================

const I18N = {
  currentLang: 'en',

  translations: {
    en: {
      // Nav
      navHome: 'Home',
      navMatch: 'Find Schemes',
      navDashboard: 'Dashboard',
      navHow: 'How It Works',
      navAbout: 'About',
      navNGO: 'NGO Camp Mode',
      navTracker: 'Application Tracker',
      navLogin: 'Sign In',
      navProfile: 'Profile',
      langToggle: 'हिंदी',

      // Hero
      heroTitle: 'Samarthya',
      heroTagline: 'Intelligent Government Scheme Matching Portal',
      heroSubtitle: 'Bridging the gap between special student needs and government welfare',
      heroCta: 'Find My Schemes',
      heroStats1: '50+',
      heroStats1Label: 'Government Schemes',
      heroStats2: '2.68 Cr',
      heroStats2Label: 'PwD Population in India',
      heroStats3: '<2s',
      heroStats3Label: 'Instant Matching',
      heroStats4: '100%',
      heroStats4Label: 'Free for Students',

      // Form
      formTitle: 'Student Profile',
      formSubtitle: 'Enter details once. Get all eligible schemes instantly.',
      formStep1: 'Personal Info',
      formStep2: 'Disability Details',
      formStep3: 'Education & Income',
      formName: 'Student Name (optional)',
      formDob: 'Date of Birth',
      formGender: 'Gender',
      formGenderM: 'Male',
      formGenderF: 'Female',
      formGenderO: 'Other',
      formState: 'State / UT',
      formDisabilityType: 'Disability Type(s)',
      formDisabilityPercent: 'Disability Percentage',
      formEducation: 'Current Education Level',
      formIncome: 'Annual Household Income (₹)',
      formRequired: 'Required field',
      formNext: 'Next',
      formPrev: 'Back',
      formSubmit: 'Find Matching Schemes',

      // OCR
      ocrTitle: 'Auto-Fill with UDID / Disability Certificate',
      ocrSubtitle: 'Upload your certificate or UDID card for instant optical character extraction',
      ocrUploadText: 'Drag and drop UDID Card / Disability Certificate or Click to Browse',
      ocrSampleTitle: 'Or Try Sample Demo Cards:',

      // Results
      resultsTitle: 'Matched Schemes',
      resultsSubtitle: 'schemes matched for your profile',
      resultsAll: 'All Matched',
      resultsHighly: 'Highly Eligible',
      resultsLikely: 'Likely Eligible',
      resultsPartial: 'Partial Match',
      resultsAlmost: 'Almost Eligible (Near Match)',
      resultsApply: 'Apply Now',
      resultsDeadline: 'Deadline',
      resultsDaysLeft: 'days left',
      resultsUrgent: 'Urgent',
      resultsNone: 'No schemes found in this category',
      viewDetails: 'Details',
      trackApp: 'Track Application',

      // Dashboard
      dashTitle: 'Dashboard Overview',
      dashTotal: 'Total Matched',
      dashHighly: 'Highly Eligible',
      dashUrgent: 'Urgent Deadlines',
      dashAvgScore: 'Avg. Match Score',
      dashTotalBenefits: 'Estimated Entitlements',

      // How It Works
      howTitle: 'How Samarthya Works',
      howSubtitle: 'Four simple steps to discover your entitled government benefits',
      howStep1Title: 'Enter Your Details',
      howStep1Desc: 'Simple profile form captures essential criteria — DOB, education, disability type, household income.',
      howStep2Title: 'Policy Database Scan',
      howStep2Desc: 'Our engine scans 30+ central and state government scheme policies in real-time.',
      howStep3Title: 'Smart Matching',
      howStep3Desc: 'Rule-based algorithm checks your profile against every scheme\'s eligibility criteria.',
      howStep4Title: 'Instant Results',
      howStep4Desc: 'Get ranked results with confidence scores, document checklists, and direct application links.',

      // About
      aboutTitle: 'About Samarthya',
      aboutMission: 'Engineering equity. Because discovery should never be a barrier to access.',
      aboutPrivacy: 'Your profile is never stored on any server. Profiles are volatile — generated and deleted post-session to protect health data.',

      // Footer
      poweredBy: 'Powered by Samarthya AI Engine',

      // Modal
      close: 'Close',

      // Captcha Security
      captchaTitle: 'Human Verification',
      captchaSubtitle: 'Solve the security challenge to continue',
      captchaRefresh: 'New Question',
      captchaError: 'Incorrect answer. Please try again.',
      captchaBotDetected: 'Bot activity detected. Submission blocked.',
      captchaRateLimit: 'Please wait a few seconds before trying again.',
    },

    hi: {
      // Nav
      navHome: 'होम',
      navMatch: 'योजनाएं खोजें',
      navDashboard: 'डैशबोर्ड',
      navHow: 'कैसे काम करता है',
      navAbout: 'हमारे बारे में',
      navNGO: 'NGO कैम्प मोड',
      navTracker: 'आवेदन ट्रैकर',
      navLogin: 'साइन इन',
      navProfile: 'प्रोफ़ाइल',
      langToggle: 'English',

      // Hero
      heroTitle: 'समर्थ्य',
      heroTagline: 'बुद्धिमान सरकारी योजना मिलान पोर्टल',
      heroSubtitle: 'विशेष छात्रों की आवश्यकताओं और सरकारी कल्याण के बीच की दूरी को पाटना',
      heroCta: 'मेरी योजनाएं खोजें',
      heroStats1: '50+',
      heroStats1Label: 'सरकारी योजनाएं',
      heroStats2: '2.68 करोड़',
      heroStats2Label: 'भारत में PwD जनसंख्या',
      heroStats3: '<2 सेकंड',
      heroStats3Label: 'तुरंत मिलान',
      heroStats4: '100%',
      heroStats4Label: 'छात्रों के लिए निःशुल्क',

      // Form
      formTitle: 'छात्र प्रोफ़ाइल',
      formSubtitle: 'एक बार विवरण दर्ज करें। सभी पात्र योजनाएं तुरंत प्राप्त करें।',
      formStep1: 'व्यक्तिगत जानकारी',
      formStep2: 'दिव्यांगता विवरण',
      formStep3: 'शिक्षा एवं आय',
      formName: 'छात्र का नाम (वैकल्पिक)',
      formDob: 'जन्म तिथि',
      formGender: 'लिंग',
      formGenderM: 'पुरुष',
      formGenderF: 'महिला',
      formGenderO: 'अन्य',
      formState: 'राज्य / केंद्र शासित प्रदेश',
      formDisabilityType: 'दिव्यांगता प्रकार',
      formDisabilityPercent: 'दिव्यांगता प्रतिशत',
      formEducation: 'वर्तमान शिक्षा स्तर',
      formIncome: 'वार्षिक पारिवारिक आय (₹)',
      formRequired: 'आवश्यक फ़ील्ड',
      formNext: 'अगला',
      formPrev: 'पीछे',
      formSubmit: 'मिलती-जुलती योजनाएं खोजें',

      // OCR
      ocrTitle: 'UDID / दिव्यांगता प्रमाण पत्र से ऑटो-फिल',
      ocrSubtitle: 'तुरंत डेटा निकालने के लिए अपना UDID कार्ड या प्रमाण पत्र अपलोड करें',
      ocrUploadText: 'UDID कार्ड / प्रमाण पत्र यहाँ खींचें या चुनने के लिए क्लिक करें',
      ocrSampleTitle: 'या डेमो कार्ड आज़माएं:',

      // Results
      resultsTitle: 'मिलती-जुलती योजनाएं',
      resultsSubtitle: 'योजनाएं आपकी प्रोफ़ाइल से मेल खाती हैं',
      resultsAll: 'सभी मिलान',
      resultsHighly: 'अत्यधिक पात्र',
      resultsLikely: 'संभावित पात्र',
      resultsPartial: 'आंशिक मिलान',
      resultsAlmost: 'लगभग पात्र (Near Match)',
      resultsApply: 'अभी आवेदन करें',
      resultsDeadline: 'अंतिम तिथि',
      resultsDaysLeft: 'दिन शेष',
      resultsUrgent: 'तत्काल',
      resultsNone: 'इस श्रेणी में कोई योजना नहीं मिली',
      viewDetails: 'विवरण',
      trackApp: 'आवेदन ट्रैक करें',

      // Dashboard
      dashTitle: 'डैशबोर्ड अवलोकन',
      dashTotal: 'कुल मिलान',
      dashHighly: 'अत्यधिक पात्र',
      dashUrgent: 'तत्काल अंतिम तिथियां',
      dashAvgScore: 'औसत मिलान स्कोर',
      dashTotalBenefits: 'अनुमानित कुल लाभ',

      // How It Works
      howTitle: 'समर्थ्य कैसे काम करता है',
      howSubtitle: 'अपने अधिकृत सरकारी लाभों की खोज के लिए चार सरल कदम',
      howStep1Title: 'अपना विवरण दर्ज करें',
      howStep1Desc: 'सरल प्रोफ़ाइल फ़ॉर्म आवश्यक मानदंडों को कैप्चर करता है — जन्म तिथि, शिक्षा, दिव्यांगता प्रकार, पारिवारिक आय।',
      howStep2Title: 'नीति डेटाबेस स्कैन',
      howStep2Desc: 'हमारा इंजन 30+ केंद्रीय और राज्य सरकार की योजना नीतियों को रीयल-टाइम में स्कैन करता है।',
      howStep3Title: 'स्मार्ट मिलान',
      howStep3Desc: 'नियम-आधारित एल्गोरिदम आपकी प्रोफ़ाइल को प्रत्येक योजना के पात्रता मानदंडों के विरुद्ध जांचता है।',
      howStep4Title: 'तुरंत परिणाम',
      howStep4Desc: 'विश्वास स्कोर, दस्तावेज़ चेकलिस्ट और सीधे आवेदन लिंक के साथ रैंक किए गए परिणाम प्राप्त करें।',

      // About
      aboutTitle: 'समर्थ्य के बारे में',
      aboutMission: 'समता का अभियंत्रण। क्योंकि खोज कभी पहुंच में बाधा नहीं होनी चाहिए।',
      aboutPrivacy: 'आपकी प्रोफ़ाइल किसी भी सर्वर पर कभी संग्रहीत नहीं की जाती। प्रोफ़ाइल अस्थायी हैं — स्वास्थ्य डेटा की सुरक्षा के लिए सत्र के बाद जनरेट किए जाते हैं और हटा दिए जाते हैं।',

      // Footer
      poweredBy: 'समर्थ्य AI इंजन द्वारा संचालित',

      // Modal
      close: 'बंद करें',

      // Captcha Security
      captchaTitle: 'मानव सत्यापन (सुरक्षा जांच)',
      captchaSubtitle: 'आगे बढ़ने के लिए सुरक्षा प्रश्न हल करें',
      captchaRefresh: 'नया प्रश्न',
      captchaError: 'गलत उत्तर। कृपया पुनः प्रयास करें।',
      captchaBotDetected: 'बॉट गतिविधि का पता चला। अनुरोध अवरुद्ध।',
      captchaRateLimit: 'कृपया पुनः प्रयास करने से पहले कुछ सेकंड प्रतीक्षा करें।',
    },
  },

  /**
   * Get translation for a key
   */
  t(key) {
    const lang = this.translations[this.currentLang];
    return lang[key] || this.translations.en[key] || key;
  },

  /**
   * Toggle between English and Hindi
   */
  toggle() {
    this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.applyTranslations();
  },

  /**
   * Apply all translations to the DOM
   */
  applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    // Update document language
    document.documentElement.lang = this.currentLang === 'hi' ? 'hi' : 'en';

    // Update disability checkbox labels
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    checkboxItems.forEach(item => {
      const value = item.getAttribute('data-value');
      const dtype = DISABILITY_TYPES.find(d => d.id === value);
      if (dtype) {
        const span = item.querySelector('span:last-child');
        if (span) {
          span.textContent = this.currentLang === 'hi' ? dtype.labelHi : dtype.label;
        }
      }
    });

    // Update education level options
    const eduSelect = document.getElementById('inputEducation');
    if (eduSelect) {
      const options = eduSelect.querySelectorAll('option');
      options.forEach(opt => {
        if (opt.value) {
          const level = EDUCATION_LEVELS.find(e => e.id === opt.value);
          if (level) {
            opt.textContent = this.currentLang === 'hi' ? level.labelHi : level.label;
          }
        }
      });
    }
  },
};

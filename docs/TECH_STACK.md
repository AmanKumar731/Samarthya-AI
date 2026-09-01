# Tech Stack Documentation — Samarthya Portal

## 1. System Architecture Overview
**Samarthya** is an intelligent government scheme matching platform designed to connect special-needs students with welfare schemes. It follows a decoupled, modular architecture featuring a high-performance vanilla frontend, a lightweight Python FastAPI microservice, and offline-capable client storage.

```
┌────────────────────────────────────────────────────────┐
│               Frontend Client (SPA)                    │
│  HTML5 • Vanilla CSS3 Tokens • ES6+ Modular Modules    │
└───────────────┬────────────────────────┬───────────────┘
                │ (REST / JSON)          │ (Local State)
┌───────────────▼──────────────┐  ┌──────▼───────────────┐
│     Backend Microservice     │  │ Client-side Storage  │
│  FastAPI • Pydantic • Python │  │ IndexedDB • Storage  │
└──────────────────────────────┘  └──────────────────────┘
```

---

## 2. Frontend Layer
- **Core Structure:** Semantic **HTML5** Single-Page Application (SPA) structure with hash-based view routing.
- **Styling Architecture:** Modular **Vanilla CSS3** leveraging CSS custom properties (Design Tokens), responsive flexbox/grid layouts, and glassmorphism styling.
  - `main.css`: Base variables, ambient glow effects, resets, layout primitives.
  - `components.css`: Buttons, cards, modals, tabs, forms, badges, tooltips.
  - `auth.css` & `admin.css`: Dedicated styling for role auth and administrative panels.
  - `features.css`: Specific styles for OCR upload, NGO camp mode, WhatsApp simulator.
- **JavaScript (Logic & State):** Modular **Vanilla ES6+** without heavy framework overhead for near-instant load times.
- **Typography & Icons:** Google Fonts (`Plus Jakarta Sans`, `Outfit`, `Inter`, `Fira Code`).

---

## 3. Backend & API Services
- **Runtime & Framework:** **Python 3.14+** running on **FastAPI** with **ASGI (Uvicorn)** server.
- **Data Validation & Serialization:** **Pydantic v2** models enforcing type-safe payloads for student profiles and scheme matching.
- **Middleware:** `CORSMiddleware` configured for local and production cross-origin resource requests.
- **API Endpoints:**
  - `GET /api/metadata`: Provides Indian states, education levels, disability classifications, and scheme categories.
  - `GET /api/schemes`: Delivers the complete database of state and central schemes.
  - `POST /api/match`: Server-side scoring engine ranking scheme eligibility by age, disability type/percentage, state, and income.

---

## 4. Data Storage & Persistence
- **Client-Side Database:** **IndexedDB** wrapped with helper layer (`js/db.js`) for storing user profiles, saved scheme bookmarks, application logs, and offline audit trails.
- **Session & Fallback Storage:** `localStorage` / `sessionStorage` for user authentication tokens, active role session, and UI preferences (theme/contrast).
- **Backend Data Source:** Structured `schemes.json` flat-file document store acting as the central knowledge base.

---

## 5. Core Feature Modules
| Module | File | Implementation Details |
| :--- | :--- | :--- |
| **Matching Engine** | `js/matcher.js` & `backend/main.py` | Multi-criteria scoring algorithm (0–100%) weighting disability type, percentage, income ceilings, age brackets, and state residency. |
| **Accessibility Suite** | `js/accessibility.js` | WCAG-compliant high-contrast modes, dyslexia-friendly fonts, font resizing, and Web Speech API / TTS integration. |
| **Multilingual Engine** | `js/i18n.js` | Zero-dependency client-side translation engine supporting 8+ Indian regional languages. |
| **Document OCR** | `js/ocr.js` | Client-side disability certificate parsing and information extraction. |
| **Application Tracker** | `js/tracker.js` | Multi-stage status tracker with `.ics` calendar deadline export. |
| **WhatsApp Assistance** | `js/whatsapp-bot.js` | Guided chatbot simulation with deep-link WhatsApp Web sharing. |
| **NGO Camp Mode** | `js/ngo-mode.js` | Batch processing for multi-student registration and bulk eligibility evaluation. |

---

## 6. Runtime & Tooling
- **Local Dev Server:** Python HTTP Server (Frontend `:5500` / `:3000`) & Uvicorn ASGI Server (Backend `:8001`).
- **Dependencies:** FastAPI (`>=0.100.0`), Uvicorn (`>=0.22.0`), Pydantic (`>=2.0.0`).

# 🌾 Smart Farmer AI

### **Empowering Agriculture with Multimodal Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama--3-f34f29?style=for-the-badge&logo=groq)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Smart Farmer AI** is a professional, high-fidelity agricultural platform designed to bridge the gap between rural farmers and advanced data science. By leveraging multimodal AI (Voice, Vision, and Text), the platform provides real-time crop diagnosis, market intelligence, and financial strategy hubs to ensure sustainable and profitable farming practices.

---

## 🚀 Key Features

### 🤖 **AI & Multimodal Core**

- **Voice Assistant 🎤**: Multilingual (Hindi/Hinglish) support for low-literacy accessibility, providing instant technical farming guidance.
- **AI Advisory Chat 💬**: A senior agricultural reasoning engine for troubleshooting crop issues and soil health management.
- **Crop Image Analysis 📸**: High-fidelity visual diagnosis driven by Google Gemini to detect pests, diseases, and nutrient deficiencies.

### 📈 **Market & Economic Intelligence**

- **Live Mandi Prices 📉**: Real-time tracking of local and global commodity rates with trend analysis and "Farming Advice" insights.
- **Farmer Marketplace 🛒**: A peer-to-peer exchange for trading crops, livestock, seeds, and heavy machinery without intermediaries.
- **Financial Strategy Hub 💰**: AI-driven money advisory for maximizing crop profitability and identifying stable investment protocols.

### 🎨 **UI/UX Architecture**

- **Premium Typography**: Standardized typographic scale (3xl bold titles, xl section headers, base body text) for high readability in field conditions.
- **Geometric Softness**: Global adoption of `rounded-2xl` and `rounded-full` components for a modern, approachable aesthetic.
- **Deep Elevation**: Multi-layered shadow system (`shadow-2xl`) to provide depth and clear visual hierarchy.
- **Micro-Interactions**: Hover-scaling, smooth transitions, and pulse animations for enhanced engagement.
- **Mobile-First Design**: Fully responsive layouts optimized for small-device agricultural use-cases.

### 🌍 **Field Intelligence & Platform Integrity**

- **Weather Protocol 🌦️**: Live meteorological synchronization providing critical data on rainfall, humidity, and temperature drops.
- **Govt Schemes Repository 🏛️**: A centralized, filtered database mapping farmer profiles to eligible national subsidies and support systems.
- **Clean Database Schema**: Fully refactored agricultural models (`FarmerProfile`, `ActivityLog`, `AdvisorySession`) replacing legacy systems.
- **Performance Optimization**: Built on Next.js 15 with static site generation and client-side caching for lightning-fast responsiveness.

---

## 🏗️ Folder Structure

```bash
.
├── frontend/             # Next.js 15 Application
│   ├── app/              # App Router: Marketplace, Market, Voice, Weather, etc.
│   ├── components/       # UI Library: Tailored Agriculture Design System
│   ├── hooks/            # Protocol Logic: Voice Agent, Location, Sync Manager
│   ├── public/           # Static Assets & Global Schemata
│   └── utils/            # API Services & Offline Caching Layer
└── backend/              # FastAPI Ecosystem
    ├── main.py           # Core Application & Logic Controller
    ├── database.py       # SQL Alchemy & Neon PostgreSQL Integration
    ├── models.py         # Agricultural Data Models (Profile, History, Advisory)
    ├── routes/           # Specialized API Routers (Market, Voice, Marketplace)
    └── services/         # Intelligence Engines (Weather, Money Advisor, Schemes)
```

---

## 🧰 Tech Stack

| Layer         | Technologies                                           |
| :------------ | :----------------------------------------------------- |
| **Frontend**  | `Next.js 15`, `React 19`, `Tailwind CSS`, `TypeScript` |
| **Backend**   | `FastAPI (Python)`, `SQLAlchemy`, `Uvicorn`            |
| **Database**  | `PostgreSQL (Neon DB)`, `In-memory Caching`            |
| **AI / ML**   | `Groq (Llama-3)`, `Google Gemini 2.0 Flash`            |
| **APIs**      | `OpenWeather API`, `AlphaVantage`, `Edge-TTS`          |
| **Dev Tools** | `Postman`, `ESLint`, `Git`                             |

---

## 🔢 Version Info

- **Current Version**: `v4.1.0` (Agriculture Ecosystem Refactor)
- **Roadmap**:
  - [ ] Satellite NDVI integration for field-level health monitoring.
  - [ ] Localized Supply Chain Logistics tracking.
  - [ ] Cooperative Farming Network protocols.

---

## ⚖️ Solution Comparison

| Feature               | Traditional Methods              | Smart Farmer AI                       |
| :-------------------- | :------------------------------- | :------------------------------------ |
| **Crop Diagnosis**    | Manual inspection / Expert visit | Instant AI Vision (Gemini) Diagnosis  |
| **Market Data**       | Physical Mandi visits            | Real-time Global & Local Price Sync   |
| **Financial Support** | Manual discovery of schemes      | Profile-mapped Govt Scheme detection  |
| **Accessibility**     | Text-heavy documentation         | Multilingual Voice-to-Action Protocol |
| **Record Keeping**    | Physical notebooks               | Encrypted Activity Bio-Logs           |

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/Rajyagur-Nayan/ai-farmer-guidance-
cd ai-farmer-guidance-
```

### **2. Backend Configuration**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

_Create a `.env` file in the `backend/` directory (see Environment Variables section)._

### **3. Frontend Configuration**

```bash
cd ../frontend
npm install
```

---

## ▶️ How to Run

### **Start the Backend**

```bash
# From /backend
uvicorn main:app --reload --port 8000
```

### **Start the Frontend**

```bash
# From /frontend
npm run dev
```

_Access the platform at `http://localhost:3000`_

---

## 🔐 Environment Variables

Required variables in your `backend/.env` file:

| Variable              | Description                                        |
| :-------------------- | :------------------------------------------------- |
| `GROQ_API_KEY`        | Your Groq API key (Llama-3 modeling)               |
| `Gemini_API_Key`      | Your Google Gemini API key (Vision analysis)       |
| `OPENWEATHER_API_KEY` | API key from OpenWeatherMap                        |
| `DATABASE_URL`        | PostgreSQL connection string (Neon DB recommended) |

---

## 🤝 Contribution Guide

1.  **Fork** the project.
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

_Built with ❤️ for Rural Empowerment by Nayan Rajyagur_

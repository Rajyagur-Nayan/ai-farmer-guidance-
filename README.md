# 🌾 Smart Farmer AI

### **Empowering Agriculture with Multimodal Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama--3-f34f29?style=for-the-badge&logo=groq)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Smart Farmer AI** is a professional, high-fidelity agricultural platform designed to bridge the gap between rural farmers and advanced data science. By leveraging multimodal AI (Voice, Vision, and Text), the platform provides real-time crop diagnosis, market intelligence, and IoT-driven field telemetry to ensure sustainable and profitable farming practices.

---

## 🚀 Key Features

### 🤖 **AI & Multimodal Core**

- **Voice Assistant 🎤**: Multilingual (Hindi/Gujarati/Hinglish) support with language-accurate TTS and ASR, providing instant technical farming guidance.
- **Crop Doctor (AI Vision) 📸**: High-fidelity visual diagnosis driven by **Google Gemini 2.5 Flash** to detect pests, diseases, and nutrient deficiencies with expert precision.
- **AI Advisory Chat 💬**: A senior agricultural reasoning engine for troubleshooting crop issues and soil health management.

### 📡 **IoT & Field Intelligence**

- **Weather Protocol 🌦️**: Live meteorological synchronization providing critical data on rainfall, wind speeds, and temperature drops.
- **UV Index Monitor ☀️**: Real-time UV intensity tracking with localized safety levels and agricultural exposure advice.
- **Soil Moisture Sync 🌱**: High-fidelity IoT telemetry simulating actual field conditions to optimize irrigation schedules.

### 📈 **Market & Economic Intelligence**

- **Live Mandi Prices 📉**: Real-time tracking of local and global commodity rates with trend analysis and "Farming Advice" insights.
- **Farmer Marketplace 🛒**: A peer-to-peer exchange for trading crops, livestock, seeds, and heavy machinery without intermediaries.
- **Financial Strategy Hub 💰**: AI-driven money advisory for maximizing crop profitability and identifying stable investment protocols.

### 🎨 **UI/UX Architecture**

- **Geometric Softness**: Global adoption of `rounded-2xl` and `rounded-full` components for a modern, approachable aesthetic.
- **Deep Elevation**: Multi-layered shadow system to provide depth and clear visual hierarchy in bright field conditions.
- **Micro-Interactions**: Hover-scaling, smooth transitions, and pulse animations for enhanced engagement.
- **Mobile-First Design**: Fully responsive layouts optimized for small-device agricultural use-cases.

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
├── backend/              # FastAPI Ecosystem
│   ├── main.py           # Core Application & Logic Controller
│   ├── database.py       # SQL Alchemy & Neon PostgreSQL Integration
│   ├── models.py         # Agricultural Data Models (Profile, History, Advisory)
│   ├── routes/           # Specialized API Routers (Market, Voice, Marketplace)
│   └── services/         # Intelligence Engines (Weather, Money Advisor, Schemes)
└── render.yaml           # Deployment Blueprint for Backend & Frontend
```

---

## 🧰 Tech Stack

| Layer         | Technologies                                           |
| :------------ | :----------------------------------------------------- |
| **Frontend**  | `Next.js 15`, `React 19`, `Tailwind CSS`, `TypeScript` |
| **Backend**   | `FastAPI (Python)`, `SQLAlchemy`, `Uvicorn`            |
| **Database**  | `PostgreSQL (Neon DB)`, `In-memory Caching`            |
| **AI / ML**   | `Groq (Llama-3.3-70B)`, `Google Gemini 2.5 Flash`      |
| **IoT / APIs**| `OpenWeather OneCall`, `Edge-TTS`, `Overpass API`      |
| **Cloud**     | `Render (Web Services)`, `Vercel (Frontend)`           |

---

## 🔢 Version Info

- **Current Version**: `v4.2.0` (IoT & Vision Stability Refactor)
- **Roadmap**:
  - [ ] Satellite NDVI integration for field-level health monitoring.
  - [ ] Localized Supply Chain Logistics tracking.
  - [ ] Cooperative Farming Network protocols.

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
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### **3. Frontend Configuration**

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Required variables in your `backend/.env` file:

| Variable              | Description                                        |
| :-------------------- | :------------------------------------------------- |
| `GROQ_API_KEY`        | Your Groq API key (Llama modeling)                 |
| `GEMINI_API_KEY`      | Your Google Gemini API key (Vision analysis)       |
| `OPENWEATHER_API_KEY` | API key from OpenWeatherMap                        |
| `DATABASE_URL`        | PostgreSQL connection string (Neon DB recommended) |

_Frontend Environment Variable (`frontend/.env`):_
- `NEXT_PUBLIC_API_URL`: Points to your backend (Defaults to `http://localhost:8000`).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

_Built with ❤️ for Rural Empowerment by Nayan Rajyagur_

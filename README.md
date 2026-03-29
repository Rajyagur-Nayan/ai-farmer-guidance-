# Rural AI Health Dashboard

A modern, responsive healthcare platform migrated to **Next.js 15** and **FastAPI**, designed for rural accessibility with multi-modal AI interaction.

## ✨ Updates & Current Functionality

The platform has recently been overhauled to feature a **premium, minimal medical design** utilizing a soft-green color palette (`#22c55e`), card-based layouts, and clean typographic micro-interactions, ensuring high readability and a calming user experience.

- **AI Healthcare Assistant**: Real-time minimal chat interface powered by Groq LLaMA 3 70B, providing advice in Hindi/Hinglish.
- **Neural Voice Input**: Specialized accessibility component featuring a glowing, animated circular microphone for low-literacy users.
- **Offline Protocol**: Local message queuing that automatically syncs when internet connectivity is restored, featuring clean status indicators.
- **Emergency Detection**: Scans symptoms for life-threatening conditions and provides immediate medical alerts.
- **Doctor Directory**: Minimal profile cards for healthcare professionals with integrated call/book actions (Pill buttons).
- **Clinical Hub (Doctor Dashboard)**: A clean, high-density dashboard for doctors to manage localized queues, execute secure bio-registry syncs, and issue digital prescriptions.
- **Consultation History**: Chronological log of past AI interactions styled uniformly for tracking health progress.
- **Nearby Clinics Map**: Interactive Leaflet map integrated natively into Next.js.
- **Design System**: A fully standardized UI (Cards, Rounded Full Buttons, Soft Shadows) utilizing Tailwind CSS.

## 📁 Project Structure

```bash
.
├── frontend/             # Next.js 15 App Router Project
│   ├── app/              # Routes: Dashboard, Chat, Doctors, History, Hospitals
│   ├── components/       # Soft-Green UI Library (Card, Button, Layouts, ChatUI)
│   ├── hooks/            # Custom React Hooks (Online status, Voice Agent)
│   ├── utils/            # Local Storage Sync & API Services
│   └── public/           # Static Assets
└── backend/              # FastAPI Application
    ├── main.py           # Core Application Logic
    ├── database.py       # DB Connection Management
    ├── models.py         # Data Structures
    ├── routes/           # Separated API routers (Voice, Groq Llama)
    └── .env              # Environment Variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Groq API Key

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and configure `.env`:
   ```bash
   GROQ_API_KEY=your_api_key_here
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the modernized dashboard.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, React Leaflet, TypeScript.
- **Backend**: FastAPI, Groq SDK.
- **Database**: PostgreSQL / SQLAlchemy.
- **Storage**: Browser LocalStorage (for offline data).
- **AI Model**: LLaMA 3 70B (via Groq).

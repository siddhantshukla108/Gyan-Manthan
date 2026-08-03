<div align="center">
  <img src="assets/logo.png" alt="Gyan Manthan Logo" width="250" style="border-radius: 20px;" />
  
  # Gyan Manthan
  *Churn Wisdom from Every Page.*

  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-5.2.1-404D59?style=for-the-badge)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.9.0-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![OpenRouter AI](https://img.shields.io/badge/Powered_by-OpenRouter_AI-f55036?style=for-the-badge)](https://openrouter.ai/)
  [![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  <br/>

  ### 🚀 [Click here for Live Demo](https://gyan-manthan-one.vercel.app/)
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blueviolet?style=for-the-badge)](https://gyan-manthan-one.vercel.app/)

</div>

<br />

> **Gyan Manthan** is an elegant, AI-powered reading companion designed to distill books into structured daily reading schedules, actionable wisdom, and multilingual reading notes. By leveraging cutting-edge LLMs via **OpenRouter**, it creates customized reading plans, generates detailed Markdown study notes, and explains complex literary metaphors in your native language.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Module & Folder Breakdown](#-module--folder-breakdown)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

Reading dense or philosophical books often results in information overload without actionable takeaway. Gyan Manthan solves this by transforming any book into a structured, day-by-day reading curriculum tailored to your schedule (7, 15, or 30 days) and desired depth ("Fast", "Deep Study", "Productivity", "Exam", or "Spiritual").

### Who is it for?
- **Lifelong Learners & Professionals** seeking concise, actionable takeaways from nonfiction and self-help literature.
- **Students & Scholars** wanting deep philosophical analysis, historical context, and metaphor breakdowns.
- **Multilingual Readers** preferring to consume summaries, key ideas, and study notes in their native language.

---

## 🌟 Key Features

- **🧠 AI-Crafted Reading Plans:** Search millions of books via the integrated Google Books API and let the AI syllabus creator split them into structured daily sessions based on your chosen duration (7, 15, or 30 days) and reading mode.
- **📝 On-Demand Detailed AI Reading Notes:** Generate comprehensive, Markdown-formatted study notes directly inside any session. The notes dynamically adapt in style:
  - **Fast Mode:** Highly scannable bullet points, executive summaries, and rapid action steps.
  - **Deep Study / Study Mode:** Long-form essay-style notes exploring literary devices, underlying philosophy, and historical context.
- **🗣️ Multilingual Support:** Generate plans, summaries, and reading notes in your native language, including **English, Hindi, Tamil, Telugu, Urdu, Bengali, Spanish, and French**.
- **✨ Deep AI Metaphor & Highlight Analysis:** Highlight any confusing sentence inside a reading session to receive an instant breakdown of its philosophy, metaphor structure, and real-world implementation task.
- **📈 Progress Tracking:** Track completed daily sessions, monitor overall book progress, and manage active reading schedules from an interactive dashboard.
- **💎 Premium Glassmorphic UI:** Built with **Tailwind CSS v4** and **Framer Motion**, featuring abstract background meshes, fluid page transitions, responsive layouts, and custom typography.
- **🔒 Secure Authentication & Sync:** Uses **Firebase Authentication** (Google OAuth & Email/Password with password reset) synced to a **MongoDB** database via verified Firebase Admin SDK ID tokens.

---

## 📸 Sneak Peek

<img src="assets/screenshot.png" alt="Gyan Manthan Dashboard" width="100%" style="border-radius: 12px;" />

---

## 🛠 Tech Stack

| Layer | Technology / Library | Description |
|---|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) | High-performance Single Page Application (SPA) with code splitting |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS framework with custom design tokens |
| **Animations & Icons** | [Framer Motion 12](https://www.framer.com/motion/) + [Lucide React](https://lucide.dev/) | Smooth page transitions, modal animations, and UI icons |
| **HTTP & Routing** | [Axios](https://axios-http.com/) + [React Router v7](https://reactrouter.com/) | Declarative client-side routing and API HTTP client |
| **Markdown Rendering** | [React Markdown](https://github.com/remarkjs/react-markdown) | Formatted rendering for AI study notes and highlight analysis |
| **Backend Server** | [Node.js](https://nodejs.org/) + [Express.js 5](https://expressjs.com/) | REST API backend handling authentication, DB operations, and AI orchestration |
| **Database & ORM** | [MongoDB](https://www.mongodb.com/) + [Mongoose 8.9](https://mongoosejs.com/) | NoSQL database modeling users, books, plans, sessions, and highlights |
| **AI Layer** | [OpenRouter API](https://openrouter.ai/) | High-speed LLM generation (`openai/gpt-oss-20b:free`, `nvidia/nemotron-nano-9b-v2:free`, etc.) |
| **Security & Auth** | [Firebase Auth](https://firebase.google.com/) + [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) + [Helmet](https://helmetjs.github.io/) | Token-based authentication, HTTP header protection, and API rate limiting |

---

## 📁 Project Structure

```
Gyan-Manthan/
├── assets/                          # Static assets (logo, screenshots)
├── client/                          # React frontend (Vite)
│   ├── public/                      # Static assets & custom Open Book SVG favicon
│   ├── src/                         # Frontend application source code
│   │   ├── api/                     # Axios instance configured with Firebase token interceptors
│   │   ├── components/              # Reusable UI components (Navbar, modals, cards)
│   │   ├── context/                 # AuthContext for Firebase authentication state
│   │   ├── pages/                   # Application pages (Dashboard, Login, BookSearch, etc.)
│   │   └── firebase.js              # Firebase client SDK initialization
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── vercel.json                  # SPA routing rewrite rules for production deployment
│   └── vite.config.js               # Vite bundler configuration
├── server/                          # Express REST API backend
│   ├── middleware/                  # Firebase ID token verification & Express Rate Limiter
│   ├── models/                      # Mongoose schemas (User, Book, ReadingPlan, Session, Highlight)
│   ├── routes/                      # API endpoint routers (auth, books, plans, sessions, highlights)
│   ├── services/                    # AI orchestration service connecting to OpenRouter
│   ├── index.js                     # Express server entry point & MongoDB connection
│   └── package.json                 # Backend dependencies and scripts
├── .gitignore                       # Root git ignore rules
├── LICENSE                          # MIT License
└── README.md                        # Project documentation
```

---

## 📦 Module & Folder Breakdown

### `/client/src` (Frontend)
- **`api/axios.js`**: Configures an Axios client with an interceptor that automatically attaches the active Firebase Auth ID token (`Bearer <idToken>`) to every backend API request.
- **`components/`**:
  - `Navbar.jsx`: Responsive navigation bar displaying user status, profile picture, and logout action.
- **`context/AuthContext.jsx`**: Wraps the application in Firebase Authentication state, providing `signup`, `login`, `loginWithGoogle`, `logout`, and `forgotPassword` methods while unblocking UI rendering immediately on load.
- **`pages/`**:
  - `Login.jsx`: User authentication screen supporting Google OAuth and Email/Password credentials.
  - `Dashboard.jsx`: Main user hub showing active reading plans, completion progress bars, and recent books.
  - `BookSearch.jsx`: Discovery interface querying Google Books API with cover previews and metadata.
  - `PlanCreator.jsx`: Interactive wizard for selecting plan duration (7/15/30 days), reading mode (Fast/Deep Study/etc.), and native output language.
  - `SessionReader.jsx`: Core reading workspace displaying daily session targets, AI summaries, metaphors, actionable tasks, highlight analysis modal, and on-demand Markdown reading notes.

### `/server` (Backend)
- **`routes/`**:
  - `auth.js`: Handles user synchronization between Firebase Authentication and MongoDB (`/api/auth/sync`).
  - `books.js`: Manages Google Books API proxy searches and saving selected books to MongoDB (`/api/books/*`).
  - `plans.js`: Orchestrates reading plan creation, schema validation with Zod, and plan retrieval (`/api/plans/*`).
  - `sessions.js`: Handles daily session completion toggling and on-demand AI reading notes generation (`/api/sessions/*`).
  - `highlights.js`: Provides AI-driven metaphor and philosophical analysis for selected text excerpts (`/api/highlights/*`).
- **`services/aiService.js`**: Interfaces with **OpenRouter**, maintaining a prioritized fallback sequence of models (`openai/gpt-oss-20b:free`, `nvidia/nemotron-nano-9b-v2:free`, etc.) and enforcing strict duration pacing and mode focus rules.
- **`middleware/auth.js`**: Verifies incoming Firebase `Bearer` tokens via `firebase-admin` and attaches decoded user metadata to Express requests.

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed and configured:

- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MongoDB**: A local instance or MongoDB Atlas Cloud URI ([Free Tier on MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **OpenRouter API Key**: Required for AI syllabus and note generation ([Get an API Key](https://openrouter.ai/keys))
- **Firebase Project**: Web app and service account credentials ([Create Firebase Project](https://console.firebase.google.com/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/siddhantshukla108/Gyan-Manthan.git
cd Gyan-Manthan
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### 1. Backend Configuration (`/server/.env`)

Create a `.env` file inside the `server/` directory:

```env
# Express Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gyan-manthan?retryWrites=true&w=majority

# OpenRouter AI API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

#### Firebase Service Account Key Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) → Select your Project → **⚙️ Project Settings**.
2. Navigate to the **Service Accounts** tab.
3. Click **"Generate new private key"** and download the JSON credentials file.
4. Rename the downloaded file to `firebaseServiceAccountKey.json` and place it in the root of the `/server` folder:
   ```
   server/
   ├── firebaseServiceAccountKey.json   # ← Local development key (excluded via .gitignore)
   ├── .env
   └── index.js
   ```
> **Note for Production:** You can alternatively set the JSON contents directly inside the environment variable `FIREBASE_SERVICE_ACCOUNT` on your hosting provider.

---

### 2. Frontend Configuration (`/client/.env`)

Create a `.env` file inside the `client/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Firebase Web Application Credentials
# Obtain from Firebase Console → Project Settings → General → Your Apps → Web App
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 💻 Usage

### Starting Local Development Servers

1. **Start the Backend API Server** (runs on port `5000` by default):
   ```bash
   cd server
   npm run dev
   ```
   *Expected output:*
   ```
   [nodemon] starting `node index.js`
   ✅ Firebase Admin SDK initialized successfully
   Connected to MongoDB
   Server running on port 5000
   ```

2. **Start the Frontend Development Server** (runs on port `5173` by default):
   ```bash
   # In a new terminal window
   cd client
   npm run dev
   ```
   *Expected output:*
   ```
   VITE v8.0.12  ready in 320 ms
   ➜  Local:   http://localhost:5173/
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Reference

All protected API endpoints require an `Authorization` header containing a valid Firebase ID token:
```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

### Authentication Endpoints

#### `POST /api/auth/sync`
Synchronizes the authenticated Firebase user profile with the MongoDB database.
- **Headers:** `Authorization: Bearer <token>`
- **Response Example:**
  ```json
  {
    "message": "User synchronized successfully",
    "user": {
      "_id": "64f1b2c3a01...",
      "firebaseUid": "abc123xyz...",
      "email": "reader@example.com",
      "displayName": "Aarav Sharma"
    }
  }
  ```

#### `GET /api/auth/me`
Retrieves the MongoDB user profile for the current authenticated user.
- **Headers:** `Authorization: Bearer <token>`

---

### Books & Discovery Endpoints

#### `GET /api/books/search?q={query}`
Searches Google Books API and returns normalized metadata.
- **Query Parameters:**
  - `q` (string, required): Search query (book title, author, or keyword).
- **Response Example:**
  ```json
  {
    "books": [
      {
        "title": "Atomic Habits",
        "author": "James Clear",
        "thumbnail": "https://books.google.com/books/content?id=...",
        "description": "An easy and proven way to build good habits...",
        "pageCount": 320
      }
    ]
  }
  ```

#### `POST /api/books/save`
Saves a selected book to the MongoDB database.
- **Request Body:**
  ```json
  {
    "title": "Atomic Habits",
    "author": "James Clear",
    "thumbnail": "https://...",
    "description": "An easy and proven way...",
    "pageCount": 320
  }
  ```

---

### Reading Plans & Sessions Endpoints

#### `POST /api/plans/generate`
Generates a customized reading schedule using OpenRouter AI.
- **Request Body:**
  ```json
  {
    "bookId": "64f1c9d8b1...",
    "durationDays": 7,
    "readingMode": "Deep Study",
    "language": "Hindi"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Reading plan generated successfully",
    "plan": {
      "_id": "64f1d0a1b2...",
      "durationDays": 7,
      "readingMode": "Deep Study",
      "language": "Hindi",
      "sessions": [
        {
          "_id": "64f1d0a1b3...",
          "dayNumber": 1,
          "content": "Chapters 1 to 3",
          "summary": "आदतें छोटे सुधारों का परिणाम होती हैं...",
          "keyIdea": "1% बेहतर बनने का नियम।",
          "metaphor": "चक्रवृद्धि ब्याज की तरह आदतों का प्रभाव।",
          "implementationTask": "अपनी एक छोटी आदत को आज ही सुधारें।",
          "reflectionQuestion": "क्या आपके दैनिक निर्णय आपके लक्ष्यों से मेल खाते हैं?",
          "isCompleted": false
        }
      ]
    }
  }
  ```

#### `GET /api/plans/:planId`
Retrieves a specific reading plan and its associated daily sessions.

#### `GET /api/sessions/user/plans`
Lists all reading plans belonging to the authenticated user.

#### `PATCH /api/sessions/:sessionId/complete`
Toggles the completed status (`true` / `false`) of a specific reading session.

#### `POST /api/sessions/:sessionId/notes`
Generates comprehensive Markdown-formatted reading notes for the session on demand.
- **Response Example:**
  ```json
  {
    "notes": "# गहन अध्ययन नोट्स: अध्याय 1 से 3\n\n## मुख्य सिद्धांत\n- **1% का नियम:** छोटे बदलाव समय के साथ विशाल परिणाम देते हैं..."
  }
  ```

---

### AI Highlight Analysis Endpoints

#### `POST /api/highlights/analyze`
Analyzes a highlighted text excerpt for philosophical depth and metaphor meaning.
- **Request Body:**
  ```json
  {
    "bookTitle": "Atomic Habits",
    "bookAuthor": "James Clear",
    "highlightedText": "You do not rise to the level of your goals. You fall to the level of your systems.",
    "language": "Hindi"
  }
  ```
- **Response Example:**
  ```json
  {
    "metaphor": "प्रणाली एक नींव की तरह है जिस पर इमारत टिकती है...",
    "philosophy": "लक्ष्य दिशा तय करते हैं, लेकिन प्रगति प्रणाली से होती है।",
    "realWorldApplication": "केवल लक्ष्य न बनाएं, दैनिक प्रक्रिया तय करें।"
  }
  ```

---

## 🧪 Testing

### 1. Frontend ESLint Verification
To check the React frontend for code quality, syntax, and linting rules:
```bash
cd client
npm run lint
```

### 2. Production Build Verification
To ensure the Vite production bundle compiles cleanly with all code splitting chunks:
```bash
cd client
npm run build
```
*Expected result:* An optimized `dist/` directory generated with zero errors.

### 3. Backend API Manual Verification
To test authenticated endpoints locally using `curl`:
```bash
# Verify API running status
curl http://localhost:5000/

# Test authenticated endpoint (replace <FIREBASE_ID_TOKEN> with a valid bearer token)
curl -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" http://localhost:5000/api/auth/me
```
> **Note:** Formal automated test runners (such as Vitest or Jest) are not currently included in this repository.

---

## 🌐 Deployment

### 1. Deploying the Frontend (Vercel)
1. Push your code to a GitHub repository.
2. Import the project in [Vercel](https://vercel.com/).
3. Set the **Root Directory** to `client`.
4. Add all environment variables from `client/.env` in the Vercel project settings (`VITE_API_URL`, Firebase credentials).
5. Deploy.
> **Note:** The `/client/vercel.json` file is already included to rewrite SPA paths `/(.*)` to `/index.html`, preventing `404 Not Found` errors when refreshing routes in production.

### 2. Deploying the Backend (Render / Railway / VPS)
1. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/).
2. Set the **Root Directory** to `server`.
3. Configure the **Build Command**: `npm install`
4. Configure the **Start Command**: `npm start` (executes `node index.js`).
5. Add the required environment variables in your hosting dashboard:
   - `PORT=5000`
   - `MONGODB_URI=<your-production-mongodb-uri>`
   - `OPENROUTER_API_KEY=<your-openrouter-key>`
   - `CLIENT_URL=<your-vercel-frontend-url>`
   - `FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}` (full JSON string of your Firebase service account)

---

## 🤝 Contributing

Contributions are welcome! Here is how to get started:

1. **Fork the repository** on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch.

Please ensure your code follows standard JavaScript formatting and linting guidelines before submitting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute it.

---

## 👏 Acknowledgments

<div align="center">
  <i>"Churn Wisdom from Every Page."</i>
  <br/><br/>
  Made with ❤️ by <a href="https://github.com/siddhantshukla108">Siddhant Shukla</a>
</div>


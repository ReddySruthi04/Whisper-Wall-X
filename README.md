# Whisper-Wall-X

**Whisper-Wall-X** is an intelligent security wall and honeypot decoy defense platform designed to protect sensitive employee and user data against unauthorized access and data exfiltration.

By combining real-time anomaly detection (IP tracking, Geolocation lookup, and access timestamp validation) with dynamic decoy data generation, Whisper-Wall-X deceives potential attackers by serving realistic fake data while silently logging suspicious activities and dispatching security alerts.

---

## Key Features

- **Honeytoken / Decoy Defense System**:
  - When suspicious activity is detected, the API transparently responds with fake data generated on-the-fly using `@faker-js/faker`.
  - Attackers receive plausible dummy data while real enterprise data remains completely untouched and undisclosed.
- **Real-Time Anomaly & Threat Detection**:
  - **IP Mismatch Tracking**: Flags logins or data requests originating from unexpected IP addresses.
  - **Geolocation Verification**: Uses `geoip-lite` to detect geographical location anomalies (country/city changes).
  - **Timestamp Anomaly Detection**: Identifies suspicious frequency patterns or login intervals.
- **Firebase Firestore Security Logging**:
  - Logs threat intelligence metrics across dedicated collections: `suspicious_logins`, `suspicious_reads`, `suspicious_updates`, `suspicious_deletions`, and `suspicious_bulk_reads`.
- **Automated Security & Emergency Alerts**:
  - Sends immediate email notifications using `Nodemailer` for registration confirmation, suspicious login attempts, failed logins, and emergency SOS alerts.
- **Emergency Hardware & Mobile Triggers**:
  - Includes custom React hooks (`useShakeDetection` for device motion and `useGestureRecognition` for gesture drawing) to trigger quick SOS alerts.
- **Modern Web Architecture**:
  - Full-stack application built with Express.js Node.js backend and a React + TypeScript + Tailwind CSS frontend built with Vite.

---

## Repository Structure

```
Whisper-Wall-X/
├── Backend/
│   ├── app.js               # Node.js Express server, Firebase DB, Geolocation & Decoy Engine
│   └── package.json         # Backend Node dependencies
└── Frontend/
    ├── index.html           # HTML entry point
    ├── vite.config.ts       # Vite configuration
    ├── tailwind.config.js   # Tailwind CSS setup
    ├── package.json         # Frontend React dependencies
    └── src/
        ├── App.tsx          # Application routing & protected routes
        ├── main.tsx         # React root renderer
        ├── components/      # UI Components (Login, Register, EmployeeInfo, EmployeeList, Navbar)
        ├── context/         # AuthContext provider
        └── hooks/           # Hardware hooks (useShakeDetection, useGestureRecognition)
```

---

## Technology Stack

### Backend
- **Node.js** & **Express.js**
- **Firebase Firestore** (Database & Security Audit Logging)
- **Bcrypt** (Password Hashing)
- **Nodemailer** (Email Notifications & Security Alerts)
- **@faker-js/faker** (Dynamic Decoy Data Generation)
- **GeoIP-Lite** (IP-based Geolocation Lookup)

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router DOM v6** (Client-side Routing)

---

## Getting Started

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node app.js
   ```
   The backend server will start on `http://localhost:3000`.

### 2. Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

---

## API Endpoints Summary

| Method | Endpoint | Description | Security Action |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Registers a new user with hashed password | Logs metadata, generates decoy profiles |
| `POST` | `/login` | Authenticates user & checks for anomalies | Serves real data if legitimate; serves fake data & alerts if suspicious |
| `POST` | `/send-alert` | Sends an emergency SOS alert email | Dispatches location info to emergency contact |
| `POST` | `/employee-info` | Creates employee details for a user | Stores real employee records |
| `GET` | `/employee-info/:email` | Fetches employee details | Returns real data or decoy data based on threat detection |
| `PUT` | `/employee-info/:email` | Updates employee details | Updates real data or logs fake update request if suspicious |
| `DELETE` | `/employee-info/:email` | Deletes employee details | Clears real data or logs fake deletion request if suspicious |
| `GET` | `/employees` | Admin endpoint to fetch all employees | Serves real or fake employee list based on admin session security |

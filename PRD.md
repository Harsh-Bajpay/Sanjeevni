Title: PRD - Project Sanjeevani (Smart Health PHC Dashboard)
Objective: Build a lightweight, offline-first Progressive Web App (PWA) to manage Primary Health Centre (PHC) medicine stock, patient footfall, bed availability, and doctor attendance without relying on paper registers [5].

1. Tech Stack (Zero-Cost Architecture):

Frontend: React.js + Vite (configured as a Progressive Web App for offline functionality).
Backend & Database: Firebase Firestore (NoSQL) for data storage and offline caching (100% free tier).
Hosting: Firebase Hosting (free tier).
AI Integration: Gemini 1.5 Flash via standard API calls (high speed, generous free tier).

2. Core Workflows to Build:

Module A: Smart Patient Triage: A simple text input where a nurse types patient symptoms. The Gemini API processes this text, extracts vital entities, assigns a triage priority (High/Medium/Low), and adds the patient to the Firestore patients collection.

Module B: Inventory Management: A dashboard showing current medicine stocks. When a doctor marks a patient as "treated" and prescribes medicine, the system must deterministically decrement the stock in Firestore.

Module C: Staff Attendance: A simple one-click "Check-In" button for doctors, recording their timestamp and updating the live staff roster.

Module D: Offline Sync (Crucial): If the internet drops, all triage and inventory updates must save locally via Firebase's offline persistence and automatically sync to the cloud when connectivity returns.

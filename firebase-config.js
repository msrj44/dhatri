// ============================================
// DHATRI VILLAGE — Firebase + Cloudinary Config
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXmSKLwo3vzA9jRTJfxekL8PSeTdTevvk",
  authDomain: "dhatrivillage.firebaseapp.com",
  projectId: "dhatrivillage",
  storageBucket: "dhatrivillage.firebasestorage.app",
  messagingSenderId: "276959513549",
  appId: "1:276959513549:web:ea077c8b53e12daa3d9284",
  measurementId: "G-WQY17W7NR0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const ADMIN_EMAILS = [
  "dhatri.raj.in@gmail.com",
  "thesinwarshabrj44@gmail.com", // Mukesh Sinwar
  "rdx.hq.in@gmail.com"          // RDX
];

const CLOUDINARY_CLOUD_NAME = "921376924598641";
const CLOUDINARY_UPLOAD_PRESET = "dhatri_gallery"; // ⚠️ Unsigned preset name

const VILLAGE_INFO = {
  nameHindi: "धात्री",
  nameEnglish: "Dhatri",
  tehsil: "Sujangarh",
  district: "Churu",
  state: "Rajasthan",
  division: "Bikaner",
  pinCode: "331505",
  postOffice: "Parihara (Churu)",
  stdCode: "01569",
  population: 3169,
  households: 523,
  area: "2,471.64 hectares",
  sexRatio: 942,
  literacy: "65.38%",
  maleLiteracy: "80.66%",
  femaleLiteracy: "49.41%",
  scPopulation: 1052,
  stPopulation: 2,
  sarpanch: "Rampratap",
  assembly: "Ratangarh",
  mla: "Poosaram Godara",
  lokSabha: "Churu",
  mp: "Rahul Kaswan",
  nearestTown: "Chhapar (25 km)",
  nearestRailway: "Parihara (4.6 km)",
  nearestAirport: "Nal Airport (108 km)",
  nh: "NH52 (61.4 km)",
  elevation: "318 m",
  coordinates: "27.9336° N, 74.5157° E",
  crops: "Bajra, Guar, Moth",
  domain: "https://dhatri.mywire.org",
  contactEmail: "info@dhaatri.mywire.org"
};

const DEFAULT_THEME = {
  primary: "#0a1f44",
  accent: "#ff9933",
  bg: "#f8f9fa",
  text: "#212529"
};

export {
  app, auth, db, provider,
  ADMIN_EMAILS, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET,
  VILLAGE_INFO, DEFAULT_THEME, firebaseConfig
};
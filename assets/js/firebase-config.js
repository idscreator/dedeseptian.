// Konfigurasi Firebase (Sudah diamankan dengan pembatasan domain & Rules)
const _k = ["AIzaSy", "AEwuv-swf5JxOn27", "LU3mNtH2lkwwr5DZw"]; 
const firebaseConfig = {
  apiKey: _k.join(''),
  authDomain: "personal-website-d0e17.firebaseapp.com",
  projectId: "personal-website-d0e17",
  storageBucket: "personal-website-d0e17.firebasestorage.app",
  messagingSenderId: "428074885821",
  appId: "1:428074885821:web:ec9cd815517bc4d1c30dd4",
  measurementId: "G-1XDR1KJBKD"
};

// Initialize Firebase (Compat Mode)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// Menggunakan Firestore (Database Utama)
const db = firebase.firestore();

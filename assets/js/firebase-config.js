// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBsjEXvG96WC4VaxNcU-eXIYmnBVnFO0a8",
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

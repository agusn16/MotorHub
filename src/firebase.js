// src/firebase.js
// Conexión a Firebase (Firestore + Authentication) con la configuración directa, sin .env

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: "AIzaSyD-e88II4TiX6Fv8fJQjBNp_x51WXVYyU8",
    authDomain: "motor-hub-27ac6.firebaseapp.com",
    projectId: "motor-hub-27ac6",
    storageBucket: "motor-hub-27ac6.firebasestorage.app",
    messagingSenderId: "45622108252",
    appId: "1:45622108252:web:0ac794b90ee625d7a0c699",
    measurementId: "G-R44XHGXVYM"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)

export const analytics = getAnalytics(app)

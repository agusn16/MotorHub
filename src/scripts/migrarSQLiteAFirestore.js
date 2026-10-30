// scripts/migrarSQLiteAFirestore.js
//
// Copia los productos de server/database.db (SQLite) a Firestore.
// Se ejecuta UNA sola vez, desde la raíz del proyecto:
//
//     node scripts/migrarSQLiteAFirestore.js
//
// (necesita que better-sqlite3 siga instalado)
// Conserva el id original como id del documento, así los links
// /detalle/:id que ya tenías siguen funcionando.

import Database from 'better-sqlite3'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const app = initializeApp({
    apiKey: "AIzaSyD-e88II4TiX6Fv8fJQjBNp_x51WXVYyU8",
    authDomain: "motor-hub-27ac6.firebaseapp.com",
    projectId: "motor-hub-27ac6",
    storageBucket: "motor-hub-27ac6.firebasestorage.app",
    messagingSenderId: "45622108252",
    appId: "1:45622108252:web:0ac794b90ee625d7a0c699",
})

const firestore = getFirestore(app)

const sqlite = new Database('server/database.db', { readonly: true })

const productos = sqlite
    .prepare('SELECT * FROM productos ORDER BY id')
    .all()

console.log(`Productos encontrados en SQLite: ${productos.length}`)

const base = Date.now()

for (const p of productos) {

    await setDoc(doc(firestore, 'productos', String(p.id)), {
        nombre: p.nombre,
        descripcion: p.descripcion,
        codigo: p.codigo,
        precio: Number(p.precio),
        stock: Number(p.stock),
        imagen: p.imagen || '',
        anio: p.anio,
        // mantiene el orden original de carga
        creadoEn: base + p.id,
    })

    console.log(`✔ ${p.id} - ${p.nombre}`)
}

console.log('Migración terminada.')
process.exit(0)
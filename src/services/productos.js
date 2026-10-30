// src/services/productos.js
// Todas las operaciones con la colección "productos" de Firestore.
// Reemplaza al servidor Express + SQLite.

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    limit,
} from 'firebase/firestore'

import { db } from '../firebase'

const productosRef = collection(db, 'productos')

// En SQLite el código era UNIQUE. Firestore no tiene esa restricción,
// así que se controla acá antes de guardar.
async function codigoEnUso(codigo, idActual = null) {

    const consulta = query(
        productosRef,
        where('codigo', '==', codigo),
        limit(2)
    )

    const resultado = await getDocs(consulta)

    return resultado.docs.some(d => d.id !== idActual)
}

// =========================
// LEER TODOS
// =========================

export async function obtenerProductos() {

    const resultado = await getDocs(productosRef)

    const productos = resultado.docs.map(d => ({
        id: d.id,
        ...d.data(),
    }))

    // Orden de carga: los más viejos primero (igual que antes con el id)
    return productos.sort(
        (a, b) => (a.creadoEn ?? 0) - (b.creadoEn ?? 0)
    )
}

// =========================
// LEER UNO
// =========================

export async function obtenerProducto(id) {

    const resultado = await getDoc(doc(db, 'productos', String(id)))

    if (!resultado.exists()) {
        return null
    }

    return {
        id: resultado.id,
        ...resultado.data(),
    }
}

// =========================
// CREAR
// =========================

export async function crearProducto(datos) {

    if (await codigoEnUso(datos.codigo)) {
        throw new Error('CODIGO_DUPLICADO')
    }

    const nuevo = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        codigo: datos.codigo,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        imagen: datos.imagen || '',
        anio: datos.anio,
        creadoEn: Date.now(),
    }

    const referencia = await addDoc(productosRef, nuevo)

    return {
        id: referencia.id,
        ...nuevo,
    }
}

// =========================
// ACTUALIZAR
// =========================

export async function actualizarProducto(id, datos) {

    if (await codigoEnUso(datos.codigo, String(id))) {
        throw new Error('CODIGO_DUPLICADO')
    }

    const cambios = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        codigo: datos.codigo,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        imagen: datos.imagen || '',
        anio: datos.anio,
    }

    await updateDoc(doc(db, 'productos', String(id)), cambios)

    return {
        id: String(id),
        ...cambios,
    }
}

// =========================
// ELIMINAR
// =========================

export async function eliminarProductoPorId(id) {

    await deleteDoc(doc(db, 'productos', String(id)))
}

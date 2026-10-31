// src/services/chat.js
// Chat entre usuarios y administrador sobre Firestore (tiempo real).
//
//   chats/{uidUsuario}                 -> resumen de la conversación
//   chats/{uidUsuario}/mensajes/{id}   -> cada mensaje { texto, de, creadoEn }

import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    writeBatch
} from 'firebase/firestore'

import { db } from '../firebase'

function aMensaje(documento) {

    // "estimate": mientras el servidor no confirma, usa la hora local
    const datos = documento.data({ serverTimestamps: 'estimate' })

    return {
        id: documento.id,
        texto: datos.texto,
        de: datos.de,
        fecha: datos.creadoEn?.toDate ? datos.creadoEn.toDate() : new Date()
    }
}

export function suscribirMensajes(uid, alCambiar, alFallar) {

    const consulta = query(
        collection(db, 'chats', uid, 'mensajes'),
        orderBy('creadoEn', 'asc')
    )

    return onSnapshot(
        consulta,
        (snap) => alCambiar(snap.docs.map(aMensaje)),
        alFallar
    )
}

export function suscribirChat(uid, alCambiar) {

    return onSnapshot(
        doc(db, 'chats', uid),
        (snap) => alCambiar(snap.exists() ? { id: snap.id, ...snap.data() } : null),
        () => alCambiar(null)
    )
}

// Para el administrador: todas las conversaciones, la más reciente primero
export function suscribirChats(alCambiar, alFallar) {

    const consulta = query(
        collection(db, 'chats'),
        orderBy('actualizadoEn', 'desc')
    )

    return onSnapshot(
        consulta,
        (snap) => alCambiar(
            snap.docs.map(d => ({
                id: d.id,
                ...d.data({ serverTimestamps: 'estimate' })
            }))
        ),
        alFallar
    )
}

export async function enviarMensajeUsuario(uid, { nombre, usuario }, texto) {

    const lote = writeBatch(db)

    lote.set(
        doc(db, 'chats', uid),
        {
            usuarioNombre: nombre,
            usuario,
            ultimoMensaje: texto,
            actualizadoEn: serverTimestamp(),
            noLeidoAdmin: true
        },
        { merge: true }
    )

    lote.set(
        doc(collection(db, 'chats', uid, 'mensajes')),
        { texto, de: 'usuario', creadoEn: serverTimestamp() }
    )

    await lote.commit()
}

export async function enviarMensajeAdmin(uid, texto) {

    const lote = writeBatch(db)

    lote.set(
        doc(db, 'chats', uid),
        {
            ultimoMensaje: texto,
            actualizadoEn: serverTimestamp(),
            noLeidoAdmin: false,
            noLeidoUsuario: true
        },
        { merge: true }
    )

    lote.set(
        doc(collection(db, 'chats', uid, 'mensajes')),
        { texto, de: 'admin', creadoEn: serverTimestamp() }
    )

    await lote.commit()
}

export function marcarLeidoUsuario(uid) {
    return setDoc(doc(db, 'chats', uid), { noLeidoUsuario: false }, { merge: true })
}

export function marcarLeidoAdmin(uid) {
    return setDoc(doc(db, 'chats', uid), { noLeidoAdmin: false }, { merge: true })
}

// AdminMensajes.jsx
// Bandeja del administrador: conversaciones a la izquierda, mensajes a la derecha.

import { useEffect, useState } from 'react'
import ListaMensajes from './ListaMensajes'
import EntradaMensaje from './EntradaMensaje'
import {
    enviarMensajeAdmin,
    marcarLeidoAdmin,
    suscribirChats,
    suscribirMensajes
} from '../services/chat'
import './AdminMensajes.css'

function AdminMensajes() {

    const [chats, setChats] = useState([])
    const [seleccionado, setSeleccionado] = useState(null)
    const [mensajes, setMensajes] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {

        return suscribirChats(
            setChats,
            (e) => {
                console.error('Mensajes:', e)
                setError('No se pudieron cargar los mensajes. Revisá que las reglas de Firestore estén publicadas.')
            }
        )

    }, [])

    useEffect(() => {

        if (!seleccionado) return

        return suscribirMensajes(
            seleccionado,
            setMensajes,
            (e) => console.error('Mensajes:', e)
        )

    }, [seleccionado])

    const chatActual = chats.find(c => c.id === seleccionado)

    const hayNoLeido = Boolean(chatActual?.noLeidoAdmin)

    // Al abrir una conversación (o llegar un mensaje nuevo en ella) se marca como leída
    useEffect(() => {

        if (seleccionado && hayNoLeido) {
            marcarLeidoAdmin(seleccionado).catch(() => { })
        }

    }, [seleccionado, hayNoLeido, mensajes.length])

    function elegir(id) {
        setMensajes([])
        setSeleccionado(id)
    }

    const pendientes = chats.filter(c => c.noLeidoAdmin).length

    return (

        <section className="products-section mensajes-admin tema-claro">

            <h2>
                Mensajes
                {pendientes > 0 && (
                    <span className="mensajes-admin-contador">{pendientes}</span>
                )}
            </h2>

            {error && <p className="mensajes-admin-error">{error}</p>}

            <div className="mensajes-admin-grilla">

                {/* CONVERSACIONES */}

                <aside className="mensajes-admin-lista">

                    {chats.length === 0 && !error && (
                        <p className="mensajes-admin-vacio">Todavía no hay conversaciones.</p>
                    )}

                    {chats.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            className={
                                c.id === seleccionado
                                    ? 'mensajes-admin-item mensajes-admin-item--activo'
                                    : 'mensajes-admin-item'
                            }
                            onClick={() => elegir(c.id)}
                        >

                            <span className="mensajes-admin-item-nombre">
                                {c.usuarioNombre || 'Usuario'}
                                {c.noLeidoAdmin && <i className="mensajes-admin-punto" />}
                            </span>

                            <span className="mensajes-admin-item-texto">
                                {c.ultimoMensaje}
                            </span>

                        </button>
                    ))}

                </aside>

                {/* CONVERSACIÓN ABIERTA */}

                <div className="mensajes-admin-hilo">

                    {!chatActual && (
                        <p className="mensajes-admin-vacio mensajes-admin-vacio--centro">
                            Elegí una conversación para leerla y responder.
                        </p>
                    )}

                    {chatActual && (
                        <>

                            <header className="mensajes-admin-hilo-cabecera">
                                <strong>{chatActual.usuarioNombre}</strong>
                                {chatActual.usuario && <small>@{chatActual.usuario}</small>}
                            </header>

                            <ListaMensajes mensajes={mensajes} propio="admin" />

                            <EntradaMensaje
                                placeholder="Escribí tu respuesta..."
                                onEnviar={(texto) => enviarMensajeAdmin(seleccionado, texto)}
                            />

                        </>
                    )}

                </div>

            </div>

        </section>
    )
}

export default AdminMensajes

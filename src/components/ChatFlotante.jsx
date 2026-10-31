// ChatFlotante.jsx
// Botón flotante con dos pestañas:
//   - Preguntas: chatbot con preguntas frecuentes (siempre disponible)
//   - Chat: mensajes con el equipo (hay que iniciar sesión para escribir)

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icono from './Iconos'
import ListaMensajes from './ListaMensajes'
import EntradaMensaje from './EntradaMensaje'
import { useAuth } from '../context/AuthContext'
import { PREGUNTAS, SALUDO } from '../data/faq'
import {
    enviarMensajeUsuario,
    marcarLeidoUsuario,
    suscribirChat,
    suscribirMensajes
} from '../services/chat'
import './Chat.css'

const OCULTO_EN = ['/admin', '/administrador']

function ChatInterno() {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { usuario, perfil, rol, alias, nombreCompleto } = useAuth()

    const [abierto, setAbierto] = useState(false)
    const [pestana, setPestana] = useState('preguntas')
    const [conversacion, setConversacion] = useState([])
    const [mensajes, setMensajes] = useState([])
    const [sinLeer, setSinLeer] = useState(false)

    const cuerpoBot = useRef(null)

    const uid = usuario?.uid
    const puedeChatear = Boolean(usuario) && rol !== 'admin'

    // Mensajes y aviso de "sin leer" en tiempo real
    useEffect(() => {

        if (!puedeChatear) return

        const cortarMensajes = suscribirMensajes(
            uid,
            setMensajes,
            (error) => console.error('Chat:', error)
        )

        const cortarChat = suscribirChat(
            uid,
            (chat) => setSinLeer(Boolean(chat?.noLeidoUsuario))
        )

        return () => {
            cortarMensajes()
            cortarChat()
        }

    }, [puedeChatear, uid])

    // Al mirar la pestaña de chat se marcan como leídos
    useEffect(() => {

        if (abierto && pestana === 'chat' && sinLeer && puedeChatear) {
            marcarLeidoUsuario(uid).catch(() => { })
        }

    }, [abierto, pestana, sinLeer, puedeChatear, uid])

    // El chatbot siempre muestra lo último
    useEffect(() => {
        const el = cuerpoBot.current
        if (el) el.scrollTop = el.scrollHeight
    }, [conversacion.length, abierto, pestana])

    function preguntar(p) {
        setConversacion(actual => [
            ...actual,
            { tipo: 'usuario', texto: p.pregunta },
            { tipo: 'bot', texto: p.respuesta, accion: p.accion }
        ])
    }

    function irALogin() {
        setAbierto(false)
        navigate('/login', { state: { desde: pathname } })
    }

    function irAlPanel() {
        setAbierto(false)
        navigate('/admin')
    }

    const mostrarPunto = sinLeer && !(abierto && pestana === 'chat')

    return (
        <>

            {abierto && (

                <div className="chat-panel tema-oscuro" role="dialog" aria-label="Asistente de MotorHub">

                    <header className="chat-cabecera">

                        <span className="chat-cabecera-icono">
                            <Icono nombre="moto" tamano={20} />
                        </span>

                        <div className="chat-cabecera-texto">
                            <strong>MotorHub</strong>
                            <small>Asistente y chat con el equipo</small>
                        </div>

                        <button
                            type="button"
                            className="chat-cerrar"
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar"
                        >
                            <Icono nombre="cerrar" tamano={18} />
                        </button>

                    </header>

                    <div className="chat-pestanas">

                        <button
                            type="button"
                            className={pestana === 'preguntas' ? 'chat-pestana chat-pestana--activa' : 'chat-pestana'}
                            onClick={() => setPestana('preguntas')}
                        >
                            Preguntas
                        </button>

                        <button
                            type="button"
                            className={pestana === 'chat' ? 'chat-pestana chat-pestana--activa' : 'chat-pestana'}
                            onClick={() => setPestana('chat')}
                        >
                            Chat
                            {mostrarPunto && <span className="chat-pestana-punto" />}
                        </button>

                    </div>

                    {/* ---------- CHATBOT ---------- */}

                    {pestana === 'preguntas' && (
                        <>
                            <div className="mensajes-lista" ref={cuerpoBot}>

                                <div className="burbuja burbuja--otra">{SALUDO}</div>

                                {conversacion.map((item, i) => (
                                    <div key={i} style={{ display: 'contents' }}>

                                        <div
                                            className={
                                                item.tipo === 'usuario'
                                                    ? 'burbuja burbuja--propia'
                                                    : 'burbuja burbuja--otra'
                                            }
                                        >
                                            {item.texto}
                                        </div>

                                        {item.accion === 'chat' && (
                                            <button
                                                type="button"
                                                className="chat-accion"
                                                onClick={() => setPestana('chat')}
                                            >
                                                Abrir el chat
                                            </button>
                                        )}

                                    </div>
                                ))}

                            </div>

                            <div className="chat-preguntas">
                                {PREGUNTAS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className="chat-pregunta"
                                        onClick={() => preguntar(p)}
                                    >
                                        {p.pregunta}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ---------- CHAT PERSONALIZADO ---------- */}

                    {pestana === 'chat' && (
                        <>

                            {puedeChatear && (
                                <ListaMensajes
                                    mensajes={mensajes}
                                    propio="usuario"
                                    vacio="Escribinos tu consulta y te respondemos por acá."
                                />
                            )}

                            {!usuario && (
                                <div className="chat-aviso">

                                    <Icono nombre="persona" tamano={30} />

                                    <p>Para poder enviar mensajes, logueate.</p>

                                    <button type="button" className="chat-accion" onClick={irALogin}>
                                        Iniciar sesión o crear usuario
                                    </button>

                                </div>
                            )}

                            {usuario && rol === 'admin' && (
                                <div className="chat-aviso">

                                    <Icono nombre="panel" tamano={30} />

                                    <p>Estás como administrador. Respondé los mensajes desde el panel.</p>

                                    <button type="button" className="chat-accion" onClick={irAlPanel}>
                                        Ir al panel
                                    </button>

                                </div>
                            )}

                            <EntradaMensaje
                                deshabilitado={!puedeChatear}
                                placeholder={puedeChatear ? 'Escribí un mensaje...' : 'Logueate para escribir'}
                                onEnviar={(texto) =>
                                    enviarMensajeUsuario(
                                        uid,
                                        { nombre: nombreCompleto, usuario: perfil?.usuario || alias },
                                        texto
                                    )
                                }
                            />

                        </>
                    )}

                </div>

            )}

            <button
                type="button"
                className="chat-lanzador"
                onClick={() => setAbierto(!abierto)}
                aria-label={abierto ? 'Cerrar el chat' : 'Abrir el chat'}
            >
                <Icono nombre={abierto ? 'cerrar' : 'chat'} tamano={26} />
                {mostrarPunto && !abierto && <span className="chat-punto" />}
            </button>

        </>
    )
}

// Al cambiar de usuario se reinicia todo el estado del chat
function ChatFlotante() {

    const { pathname } = useLocation()
    const { usuario } = useAuth()

    if (OCULTO_EN.includes(pathname)) return null

    return <ChatInterno key={usuario?.uid ?? 'anonimo'} />
}

export default ChatFlotante

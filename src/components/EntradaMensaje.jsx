// EntradaMensaje.jsx
// Input + botón de enviar (como en WhatsApp)

import { useState } from 'react'
import Icono from './Iconos'
import './Mensajes.css'

function EntradaMensaje({ onEnviar, deshabilitado = false, placeholder = 'Escribí un mensaje...' }) {

    const [texto, setTexto] = useState('')

    const enviar = async (e) => {

        e.preventDefault()

        const limpio = texto.trim()

        if (!limpio || deshabilitado) return

        // Se limpia al instante; si falla, se devuelve el texto
        setTexto('')

        try {

            await onEnviar(limpio)

        } catch (error) {

            console.error('No se pudo enviar el mensaje:', error)

            setTexto(limpio)

        }
    }

    return (
        <form className="entrada-mensaje" onSubmit={enviar}>

            <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={placeholder}
                maxLength={1000}
                disabled={deshabilitado}
                autoComplete="off"
            />

            <button
                type="submit"
                aria-label="Enviar"
                disabled={deshabilitado || texto.trim() === ''}
            >
                <Icono nombre="enviar" tamano={18} />
            </button>

        </form>
    )
}

export default EntradaMensaje

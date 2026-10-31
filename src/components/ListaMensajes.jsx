// ListaMensajes.jsx
// Lista de burbujas agrupadas por día. Sin horas ni checks de lectura.

import { useEffect, useRef } from 'react'
import { agruparPorDia } from '../utils/fechas'
import './Mensajes.css'

// propio: 'usuario' | 'admin' -> las burbujas de ese emisor van a la derecha
function ListaMensajes({ mensajes, propio, vacio }) {

    const contenedor = useRef(null)

    useEffect(() => {
        const el = contenedor.current
        if (el) el.scrollTop = el.scrollHeight
    }, [mensajes.length])

    const grupos = agruparPorDia(mensajes)

    return (
        <div className="mensajes-lista" ref={contenedor}>

            {mensajes.length === 0 && vacio && (
                <p className="mensajes-vacio">{vacio}</p>
            )}

            {grupos.map(grupo => (
                <div key={grupo.etiqueta} style={{ display: 'contents' }}>

                    <span className="mensajes-dia">{grupo.etiqueta}</span>

                    {grupo.mensajes.map(m => (
                        <div
                            key={m.id}
                            className={
                                m.de === propio
                                    ? 'burbuja burbuja--propia'
                                    : 'burbuja burbuja--otra'
                            }
                        >
                            {m.texto}
                        </div>
                    ))}

                </div>
            ))}

        </div>
    )
}

export default ListaMensajes

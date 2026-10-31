// Agrupa los mensajes por día ("Hoy", "Ayer" o la fecha). Sin horas.

function mismoDia(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

export function etiquetaDia(fecha, ahora = new Date()) {

    if (mismoDia(fecha, ahora)) return 'Hoy'

    const ayer = new Date(ahora)
    ayer.setDate(ayer.getDate() - 1)

    if (mismoDia(fecha, ayer)) return 'Ayer'

    return fecha.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function agruparPorDia(mensajes) {

    const grupos = []

    for (const mensaje of mensajes) {

        const etiqueta = etiquetaDia(mensaje.fecha)
        const ultimo = grupos[grupos.length - 1]

        if (ultimo && ultimo.etiqueta === etiqueta) {
            ultimo.mensajes.push(mensaje)
        } else {
            grupos.push({ etiqueta, mensajes: [mensaje] })
        }
    }

    return grupos
}

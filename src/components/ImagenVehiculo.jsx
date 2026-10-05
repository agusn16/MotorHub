import { useEffect, useState } from 'react'

// Muestra la foto. Si no se encuentra el archivo, muestra "Sin imagen"
// en lugar de dejar un ícono roto.
function ImagenVehiculo({ src, alt = '' }) {

    const [fallo, setFallo] = useState(false)

    useEffect(() => {
        setFallo(false)
    }, [src])

    if (!src || fallo) {
        return <div className="imagen-vacia">Sin imagen</div>
    }

    return <img src={src} alt={alt} onError={() => setFallo(true)} />
}

export default ImagenVehiculo

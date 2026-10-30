// Detalle.jsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './detalle.css'

function Detalle() {

    const { id } = useParams()

    const [producto, setProducto] = useState(null)

    useEffect(() => {

        fetch('http://localhost:3000/productos')
            .then(respuesta => respuesta.json())
            .then(datos => {

                const productoEncontrado = datos.find(
                    producto => producto.id === Number(id)
                )

                setProducto(productoEncontrado)

            })
            .catch(error => {
                console.error(
                    'Error al obtener el vehículo:',
                    error
                )
            })

    }, [id])

    if (!producto) {

        return (
            <div>
                <h1>
                    Vehículo no encontrado
                </h1>
            </div>
        )

    }

    return (

        <div className="detalle-container">

            <div className="detalle-card">

                <div className="detalle-image">

                    {producto.imagen ? (
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                        />
                    ) : (
                        <span>
                            Sin imagen
                        </span>
                    )}

                </div>

                <div className="detalle-info">

                    <h1>
                        {producto.nombre}
                    </h1>

                    <p className="detalle-descripcion">
                        {producto.descripcion}
                    </p>

                    <p>
                        <strong>Código:</strong> {producto.codigo}
                    </p>

                    <p className="detalle-precio">
                        $ {Number(producto.precio).toLocaleString('es-AR')}
                    </p>

                    <p>
                        <strong>Stock:</strong> {producto.stock}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Detalle
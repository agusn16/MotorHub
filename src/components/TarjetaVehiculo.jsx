import ImagenVehiculo from './ImagenVehiculo'

// Una tarjeta de la grilla (la de la izquierda).
// En PC, al tocar la tarjeta se muestra el detalle a la derecha.
// En celular aparece el botón "Ver detalles", que abre el modal.

function TarjetaVehiculo({ vehiculo, activa, alElegir, alVerDetalles }) {

    return (
        <div
            className={activa ? 'tarjeta tarjeta--activa' : 'tarjeta'}
            onClick={() => alElegir(vehiculo.id)}
        >

            <div className="tarjeta-imagen">
                <ImagenVehiculo
                    src={vehiculo.imagen}
                    alt={vehiculo.nombre}
                />
            </div>

            <div className="tarjeta-info">

                <h3>{vehiculo.nombre}</h3>

                <p className="tarjeta-linea">
                    {vehiculo.descripcion}
                </p>

                <p className="tarjeta-linea">
                    Código: {vehiculo.codigo}
                </p>

                <div className="tarjeta-precio">
                    $ {Number(vehiculo.precio).toLocaleString('es-AR')}
                </div>

                <p className="tarjeta-linea">
                    Stock: {vehiculo.stock}
                </p>

                <button
                    type="button"
                    className="tarjeta-boton"
                    onClick={(e) => {
                        e.stopPropagation()
                        alVerDetalles(vehiculo.id)
                    }}
                >
                    Ver detalles
                </button>

            </div>

        </div>
    )
}

export default TarjetaVehiculo

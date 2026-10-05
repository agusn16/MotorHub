// =====================================================
// DetalleVehiculo.jsx
// =====================================================

import { useState } from 'react'
import Icono from './Iconos'
import ImagenVehiculo from './ImagenVehiculo'
import './DetalleVehiculo.css'

const CANTIDAD_FOTOS = 8

const CARACTERISTICAS = [
    'Frenos ABS',
    'Inyección electrónica',
    'Tablero digital',
    'Llantas deportivas',
    'Excelente estado',
]

function DetalleVehiculo({ vehiculo }) {

    const [indice, setIndice] = useState(0)
    const [zoom, setZoom] = useState(false)

    const fotos = Array(CANTIDAD_FOTOS).fill(vehiculo.imagen)
    const total = fotos.length

    const hayMas = total > 5
    const miniaturas = hayMas ? fotos.slice(0, 4) : fotos
    const restantes = total - 4

    function anterior() {
        setIndice((indice - 1 + total) % total)
    }

    function siguiente() {
        setIndice((indice + 1) % total)
    }

    return (
        <div className="detalle">

            {/* GALERÍA */}

            <div className="detalle-galeria">

                <div className="detalle-miniaturas">

                    {miniaturas.map((foto, i) => (
                        <button
                            key={i}
                            type="button"
                            className={
                                i === indice
                                    ? 'miniatura miniatura--activa'
                                    : 'miniatura'
                            }
                            onClick={() => setIndice(i)}
                        >
                            <ImagenVehiculo src={foto} />
                        </button>
                    ))}

                    {hayMas && (
                        <button
                            type="button"
                            className="miniatura miniatura--mas"
                            onClick={() => setIndice(4)}
                        >
                            <ImagenVehiculo src={fotos[4]} />
                            <span>+{restantes}</span>
                        </button>
                    )}

                </div>


                <div className="detalle-principal">

                    <ImagenVehiculo
                        src={fotos[indice]}
                        alt={vehiculo.nombre}
                    />

                    <button
                        type="button"
                        className="detalle-zoom"
                        onClick={() => setZoom(true)}
                    >
                        <Icono nombre="zoom" tamano={14} />
                        Zoom
                    </button>

                    <button
                        type="button"
                        className="detalle-flecha detalle-flecha--izq"
                        onClick={anterior}
                        aria-label="Foto anterior"
                    >
                        <Icono nombre="izquierda" tamano={16} />
                    </button>

                    <button
                        type="button"
                        className="detalle-flecha detalle-flecha--der"
                        onClick={siguiente}
                        aria-label="Foto siguiente"
                    >
                        <Icono nombre="derecha" tamano={16} />
                    </button>

                    <span className="detalle-contador">
                        {indice + 1}/{total}
                    </span>

                </div>

            </div>


            {/* DATOS */}

            <div className="detalle-cuerpo">

                <div className="detalle-datos">

                    <h2>{vehiculo.nombre}</h2>

                    <div className="detalle-resumen">

                        <span className="detalle-estado">
                            <Icono nombre="check" tamano={13} />
                            Vehículo disponible
                        </span>

                        <span>· {vehiculo.anio}</span>

                    </div>

                    <p className="detalle-corta">
                        {vehiculo.descripcion}
                    </p>

                    <div className="detalle-precio">
                        $ {Number(
                            vehiculo.precio
                        ).toLocaleString('es-AR')}
                    </div>

                    <span
                        className={
                            Number(vehiculo.stock) === 0
                                ? 'detalle-stock detalle-stock--sin'
                                : 'detalle-stock'
                        }
                    >

                        <Icono
                            nombre="etiqueta"
                            tamano={14}
                        />

                        {Number(vehiculo.stock) === 0
                            ? 'Sin stock'
                            : `Stock: ${vehiculo.stock} ${
                                Number(vehiculo.stock) === 1
                                    ? 'unidad'
                                    : 'unidades'
                            }`
                        }

                    </span>


                    <div className="detalle-especificaciones">

                        <div className="especificacion">

                            <Icono
                                nombre="anio"
                                tamano={22}
                            />

                            <div>
                                <small>Año</small>
                                <strong>
                                    {vehiculo.anio}
                                </strong>
                            </div>

                        </div>

                        <div className="especificacion">

                            <Icono
                                nombre="etiqueta"
                                tamano={22}
                            />

                            <div>
                                <small>Código</small>
                                <strong>
                                    {vehiculo.codigo}
                                </strong>
                            </div>

                        </div>

                    </div>


                    <h4>Características principales</h4>

                    <div className="detalle-chips">

                        {CARACTERISTICAS.map(c => (
                            <span key={c}>
                                {c}
                            </span>
                        ))}

                    </div>

                </div>

            </div>


            {/* DESCRIPCIÓN */}

            <div className="detalle-descripcion">

                <h4>Descripción del vehículo</h4>

                <p>
                    {vehiculo.descripcion}
                </p>

            </div>


            {/* ZOOM */}

            {zoom && (

                <div
                    className="zoom-fondo"
                    onClick={() => setZoom(false)}
                >

                    <button
                        type="button"
                        className="zoom-cerrar"
                        onClick={() => setZoom(false)}
                        aria-label="Cerrar"
                    >
                        <Icono
                            nombre="cerrar"
                            tamano={22}
                        />
                    </button>

                    <img
                        src={fotos[indice]}
                        alt={vehiculo.nombre}
                        onClick={e =>
                            e.stopPropagation()
                        }
                    />

                </div>

            )}

        </div>
    )
}

export default DetalleVehiculo

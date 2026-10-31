// Home.jsx

import './Home.css'
import { useEffect, useState } from 'react'
import Icono from '../components/Iconos'
import TarjetaVehiculo from '../components/TarjetaVehiculo'
import DetalleVehiculo from '../components/DetalleVehiculo'
import { obtenerProductos } from '../services/productos'

const FILTROS_VACIOS = { desde: '', hasta: '', disponibilidad: '' }

function Home() {

    // =========================
    // PRODUCTOS DE FIRESTORE
    // =========================

    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const datos = await obtenerProductos()

                setProductos(datos)

            } catch (error) {

                console.error('Error al obtener los vehículos:', error)
                setError(true)

            } finally {

                setCargando(false)

            }

        }

        cargarProductos()

    }, [])

    // Firestore es la fuente de verdad: no completamos datos con valores ficticios.
    const vehiculos = productos

    // =========================
    // ESTADO DE LA PANTALLA
    // =========================

    const [seleccionadoId, setSeleccionadoId] = useState(null)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const [orden, setOrden] = useState('relevantes')
    const [panelAbierto, setPanelAbierto] = useState(false)

    // lo que se va escribiendo en el panel / lo que ya se aplicó a la lista
    const [borrador, setBorrador] = useState(FILTROS_VACIOS)
    const [filtros, setFiltros] = useState(FILTROS_VACIOS)

    // En PC: tocar una tarjeta muestra su detalle a la derecha
    function elegirVehiculo(id) {
        setSeleccionadoId(id)
    }

    // En celular: el botón "Ver detalles" abre el modal
    function verDetalles(id) {
        setSeleccionadoId(id)
        setModalAbierto(true)
    }

    function cerrarModal() {
        setModalAbierto(false)
    }

    // Mientras el modal está abierto: no se mueve la página de atrás y Esc lo cierra
    useEffect(() => {
        if (!modalAbierto) return

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        function alTocarTecla(e) {
            if (e.key === 'Escape') setModalAbierto(false)
        }
        window.addEventListener('keydown', alTocarTecla)

        return () => {
            document.body.style.overflow = overflowAnterior
            window.removeEventListener('keydown', alTocarTecla)
        }
    }, [modalAbierto])

    function aplicarFiltros() {
        setFiltros(borrador)
        setPanelAbierto(false)
    }

    function limpiarFiltros() {
        setBorrador(FILTROS_VACIOS)
        setFiltros(FILTROS_VACIOS)
    }

    // =========================
    // LISTA QUE SE MUESTRA
    // =========================

    const texto = busqueda.trim().toLowerCase()

    let lista = vehiculos.filter(v => {

        const datosParaBuscar = `${v.nombre} ${v.marca || ''} ${v.modelo || ''} ${v.categoria || ''} ${v.tipoVehiculo || ''} ${v.codigo} ${v.descripcion}`.toLowerCase()
        if (texto && !datosParaBuscar.includes(texto)) return false

        const precio = Number(v.precio)
        if (filtros.desde !== '' && precio < Number(filtros.desde)) return false
        if (filtros.hasta !== '' && precio > Number(filtros.hasta)) return false

        if (filtros.disponibilidad === 'con' && Number(v.stock) <= 0) return false
        if (filtros.disponibilidad === 'sin' && Number(v.stock) > 0) return false

        return true
    })

    if (orden === 'menor') {
        lista = [...lista].sort((a, b) => Number(a.precio) - Number(b.precio))
    } else if (orden === 'mayor') {
        lista = [...lista].sort((a, b) => Number(b.precio) - Number(a.precio))
    }

    // Si todavía no se eligió ninguno, se muestra el primero
    const seleccionado =
        vehiculos.find(v => v.id === seleccionadoId) || vehiculos[0]

    // =========================
    // INTERFAZ
    // =========================

    return (

        <div className="home">

            {/* PORTADA */}

            <header className="home-portada">

                <div className="home-portada-texto">
                    <h1>Autos y motos</h1>
                    <p>Encontrá el vehículo que estás buscando.</p>
                </div>

            </header>


            <div className="home-cuerpo">

                {/* IZQUIERDA: BUSCADOR + GRILLA */}

                <section className="home-lista">

                    <div className="home-barra">

                        <div className="home-buscador">
                            <Icono nombre="buscar" tamano={16} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, marca o modelo..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>

                        <div className="home-filtros-caja">

                            <button
                                type="button"
                                className="home-boton-barra home-boton-filtros"
                                onClick={() => setPanelAbierto(!panelAbierto)}
                            >
                                <Icono nombre="filtros" tamano={15} />
                                Filtros
                            </button>

                            {panelAbierto && (
                                <div className="home-panel-filtros">

                                    <div className="home-panel-columnas">

                                        <div>
                                            <h4>Precio</h4>
                                            <input
                                                type="number"
                                                placeholder="Desde"
                                                value={borrador.desde}
                                                onChange={e => setBorrador({ ...borrador, desde: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Hasta"
                                                value={borrador.hasta}
                                                onChange={e => setBorrador({ ...borrador, hasta: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <h4>Disponibilidad</h4>
                                            <select
                                                value={borrador.disponibilidad}
                                                onChange={e => setBorrador({ ...borrador, disponibilidad: e.target.value })}
                                            >
                                                <option value="">Todos</option>
                                                <option value="con">Con stock</option>
                                                <option value="sin">Sin stock</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="home-panel-acciones">
                                        <button
                                            type="button"
                                            className="home-panel-limpiar"
                                            onClick={limpiarFiltros}
                                        >
                                            Limpiar filtros
                                        </button>
                                        <button
                                            type="button"
                                            className="home-panel-aplicar"
                                            onClick={aplicarFiltros}
                                        >
                                            Aplicar filtros
                                        </button>
                                    </div>

                                </div>
                            )}

                        </div>

                        <div className="home-orden">
                            <select
                                value={orden}
                                onChange={e => setOrden(e.target.value)}
                            >
                                <option value="relevantes">Ordenar: Más relevantes</option>
                                <option value="menor">Ordenar: Menor precio</option>
                                <option value="mayor">Ordenar: Mayor precio</option>
                            </select>
                            <Icono nombre="abajo" tamano={14} />
                        </div>

                    </div>


                    {/* BUCLE: una tarjeta por cada producto */}

                    <div className="home-grilla">
                        {lista.map(v => (
                            <TarjetaVehiculo
                                key={v.id}
                                vehiculo={v}
                                activa={seleccionado && v.id === seleccionado.id}
                                alElegir={elegirVehiculo}
                                alVerDetalles={verDetalles}
                            />
                        ))}
                    </div>

                    {cargando && (
                        <p className="home-vacio">Cargando vehículos...</p>
                    )}

                    {!cargando && error && (
                        <p className="home-vacio">
                            No pudimos conectar con la base de datos. Revisá tu conexión y la configuración de Firebase.
                        </p>
                    )}

                    {!cargando && !error && vehiculos.length === 0 && (
                        <p className="home-vacio">Todavía no hay vehículos cargados.</p>
                    )}

                    {!cargando && !error && vehiculos.length > 0 && lista.length === 0 && (
                        <p className="home-vacio">
                            No encontramos vehículos con esa búsqueda.
                        </p>
                    )}

                </section>


                {/* DERECHA: DETALLE (solo se ve en PC) */}

                <section className="home-detalle">
                    {seleccionado ? (
                        <DetalleVehiculo key={seleccionado.id} vehiculo={seleccionado} />
                    ) : (
                        <p className="home-vacio">Elegí un vehículo para ver su detalle.</p>
                    )}
                </section>

            </div>


            {/* MODAL: DETALLE EN CELULAR */}

            {modalAbierto && seleccionado && (
                <div className="modal-fondo" onClick={cerrarModal}>

                    <div className="modal-caja" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-barra">
                            <button
                                type="button"
                                className="modal-cerrar"
                                onClick={cerrarModal}
                                aria-label="Cerrar"
                            >
                                <Icono nombre="cerrar" tamano={18} />
                            </button>
                        </div>

                        <DetalleVehiculo key={seleccionado.id} vehiculo={seleccionado} />

                    </div>

                </div>
            )}

        </div>
    )
}

export default Home
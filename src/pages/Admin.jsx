// Admi.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import Navbar from '../components/Navbar'

function Admin() {

    // =========================
    // ESTADO DE LOS PRODUCTOS
    // =========================

    const [productos, setProductos] = useState([])

    // =========================
    // ESTADO DEL PRODUCTO
    // =========================

    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        codigo: '',
        precio: '',
        stock: '',
        imagen: '',
        anio: ''
    })

    const [indiceEditando, setIndiceEditando] = useState(null)

    const [busqueda, setBusqueda] = useState('')

    const [filtroStock, setFiltroStock] = useState('todos')

    const [errores, setErrores] = useState({})

    // =========================
    // CARGAR PRODUCTOS
    // =========================

    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const respuesta = await fetch(
                    'http://localhost:3000/productos'
                )

                if (!respuesta.ok) {
                    throw new Error('No se pudieron cargar los productos')
                }

                const datos = await respuesta.json()

                setProductos(datos)

            } catch (error) {

                console.error('Error al cargar productos:', error)

            }

        }

        cargarProductos()

    }, [])

    // =========================
    // CAMBIAR LOS INPUTS
    // =========================

    const handleChange = (name, value) => {

        setProducto({
            ...producto,
            [name]: value
        })

    }

    // =========================
    // NAVEGACIÓN
    // =========================

    const navigate = useNavigate()

    // =========================
    // CERRAR SESIÓN
    // =========================

    const logout = () => {

        localStorage.removeItem('isAuthenticated')

        navigate('/login')

    }

    // =========================
    // AGREGAR / EDITAR PRODUCTO
    // =========================

    const handleSubmit = async () => {

        const nuevosErrores = {}

        if (producto.nombre.trim() === '') {
            nuevosErrores.nombre = 'El nombre es obligatorio'
        }

        if (producto.descripcion.trim() === '') {
            nuevosErrores.descripcion = 'La descripción es obligatoria'
        }

        if (producto.codigo.trim() === '') {
            nuevosErrores.codigo = 'El código es obligatorio'
        }

        if (producto.anio.trim() === '') {
            nuevosErrores.anio = 'El año es obligatorio'
        } else if (isNaN(String(producto.anio))) {
            nuevosErrores.anio = 'El año debe contener solo números'
        }

        if (producto.precio.trim() === '') {

            nuevosErrores.precio = 'El precio es obligatorio'

        } else if (isNaN(Number(producto.precio))) {

            nuevosErrores.precio =
                'El precio debe contener solo números'

        }

        if (producto.stock.trim() === '') {

            nuevosErrores.stock = 'El stock es obligatorio'

        } else if (isNaN(Number(producto.stock))) {

            nuevosErrores.stock =
                'El stock debe contener solo números'

        }

        setErrores(nuevosErrores)

        if (Object.keys(nuevosErrores).length > 0) {
            return
        }

        try {

            // =========================
            // EDITAR
            // =========================

            if (indiceEditando !== null) {

                const productoEditado =
                    productos[indiceEditando]

                const respuesta = await fetch(
                    `http://localhost:3000/productos/${productoEditado.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre: producto.nombre,
                            descripcion: producto.descripcion,
                            codigo: producto.codigo,
                            anio: producto.anio,
                            precio: Number(producto.precio),
                            stock: Number(producto.stock),
                            imagen: producto.imagen
                        })
                    }
                )

                if (!respuesta.ok) {
                    throw new Error(
                        'No se pudo actualizar el producto'
                    )
                }

                const datos = await respuesta.json()

                console.log(datos)

                const nuevosProductos = [...productos]

                nuevosProductos[indiceEditando] = {
                    id: productoEditado.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    codigo: producto.codigo,
                    precio: Number(producto.precio),
                    stock: Number(producto.stock),
                    anio: producto.anio
                }

                setProductos(nuevosProductos)

                setIndiceEditando(null)

            } else {

                // =========================
                // AGREGAR
                // =========================

                const respuesta = await fetch(
                    'http://localhost:3000/productos',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre: producto.nombre,
                            descripcion: producto.descripcion,
                            codigo: producto.codigo,
                            precio: Number(producto.precio),
                            stock: Number(producto.stock),
                            imagen: producto.imagen,
                            anio: producto.anio
                        })
                    }
                )

                if (!respuesta.ok) {
                    throw new Error(
                        'No se pudo crear el producto'
                    )
                }

                const datos = await respuesta.json()

                setProductos([
                    ...productos,
                    {
                        id: datos.id,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        codigo: producto.codigo,
                        precio: Number(producto.precio),
                        stock: Number(producto.stock),
                        anio: producto.anio
                    }
                ])

            }

            // =========================
            // LIMPIAR FORMULARIO
            // =========================

            setProducto({
                nombre: '',
                descripcion: '',
                codigo: '',
                precio: '',
                stock: '',
                imagen: '',
                anio: ''
            })

            setErrores({})

            setFiltroStock('todos')

        } catch (error) {

            console.error(
                'Error al guardar producto:',
                error
            )

        }

    }

    // =========================
    // VER PRODUCTOS EN CONSOLA
    // =========================

    const ver = () => {
        console.log(productos)
    }

    // =========================
    // ELIMINAR PRODUCTO
    // =========================

    
    const eliminarProducto = async (index) => {

        const confirmar = window.confirm(
            '¿Seguro que querés eliminar este producto?'
        )

        if (!confirmar) {
            return
        }

        const producto = productos[index]

        try {

            const respuesta = await fetch(
                `http://localhost:3000/productos/${producto.id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!respuesta.ok) {
                throw new Error(
                    'No se pudo eliminar el producto'
                )
            }

            const datos = await respuesta.json()

            console.log(datos)

            const nuevosProductos = productos.filter(
                (_, i) => i !== index
            )

            setProductos(nuevosProductos)

        } catch (error) {

            console.error(
                'Error al eliminar producto:',
                error
            )

        }

    }


    // =========================
    // EDITAR PRODUCTO
    // =========================

    const editarProducto = (index) => {

        const productoSeleccionado = productos[index]

        setProducto({
            nombre: productoSeleccionado.nombre,
            descripcion: productoSeleccionado.descripcion,
            codigo: productoSeleccionado.codigo,
            anio: productoSeleccionado.anio,
            precio: String(productoSeleccionado.precio),
            stock: String(productoSeleccionado.stock),
            imagen: productoSeleccionado.imagen || ''
        })

        setIndiceEditando(index)

    }

    // =========================
    // ESTADO DEL STOCK
    // =========================

    const obtenerEstadoStock = (stock) => {

        const cantidad = Number(stock)

        if (cantidad === 0) {
            return 'Sin stock'
        }

        if (cantidad <= 10) {
            return 'Stock bajo'
        }

        return 'Disponible'

    }

    // =========================
    // FORMATEAR PRECIO
    // =========================

    const formatearPrecio = (precio) => {

        return Number(precio).toLocaleString('es-AR')

    }

    // =========================
    // FILTRAR PRODUCTOS
    // =========================

    const productosFiltrados = productos
        .map((producto, index) => ({
            producto,
            index
        }))
        .filter(({ producto }) => {

            const coincideBusqueda =
                producto.nombre
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())

            const stock = Number(producto.stock)

            const coincideStock =
                filtroStock === 'todos' ||
                (
                    filtroStock === 'bajo' &&
                    stock > 0 &&
                    stock <= 10
                ) ||
                (
                    filtroStock === 'sin-stock' &&
                    stock === 0
                )

            return coincideBusqueda && coincideStock

        })

    // =========================
    // INTERFAZ
    // =========================

    return (

        <div className="admin-container">

            {/* ENCABEZADO */}

            <header className="admin-header">

                <h1>
                    Panel de administración
                </h1>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>

            </header>

            <section className="stats-container">

                <div
                    className="start-card"
                    onClick={() => setFiltroStock('todos')}
                >

                    <div className="start-icon">
                        📦
                    </div>

                    <div>

                        <p>
                            Total de productos
                        </p>

                        <h3>
                            {productos.length}
                        </h3>

                    </div>

                </div>

                <div
                    className="start-card"
                    onClick={() => setFiltroStock('sin-stock')}
                >

                    <div className="start-icon">
                        ⚠️
                    </div>

                    <div>

                        <p>
                            Productos sin stock
                        </p>

                        <h3>
                            {
                                productos.filter(
                                    (producto) =>
                                        Number(producto.stock) === 0
                                ).length
                            }
                        </h3>

                    </div>

                </div>

                <div className="start-card">

                    <div className="start-icon">
                        📊
                    </div>

                    <div>

                        <p>
                            Unidades en stock
                        </p>

                        <h3>
                            {
                                productos.reduce(
                                    (total, producto) =>
                                        total +
                                        Number(
                                            producto.stock || 0
                                        ),
                                    0
                                )
                            }
                        </h3>

                    </div>

                </div>

                <div
                    className="start-card"
                    onClick={() => setFiltroStock('bajo')}
                >

                    <div className="start-icon">
                        🟡
                    </div>

                    <div>

                        <p>
                            Productos con stock bajo
                        </p>

                        <h3>
                            {
                                productos.filter(
                                    (producto) =>
                                        Number(producto.stock) > 0 &&
                                        Number(producto.stock) <= 10
                                ).length
                            }
                        </h3>

                    </div>

                </div>

                <div className="start-card">

                    <div className="start-icon">
                        💰
                    </div>

                    <div>

                        <p>
                            Valor total
                        </p>

                        <h3>
                            $
                            {
                                productos.reduce(
                                    (total, producto) =>
                                        total +
                                        Number(
                                            producto.precio || 0
                                        ),
                                    0
                                )
                            }
                        </h3>

                    </div>

                </div>

            </section>

            {/* FORMULARIO */}

            <section className="product-form">

                <h2>
                    {
                        indiceEditando !== null
                            ? 'Editar producto'
                            : 'Agregar producto'
                    }
                </h2>

                <div className="form-grid">

                    {/* NOMBRE */}

                    <div className="form-group">

                        <label>
                            Nombre del producto
                        </label>

                        <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) =>
                                handleChange(
                                    'nombre',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: Repuestos para motos"
                        />

                        {errores.nombre && (
                            <span className="error-message">
                                {errores.nombre}
                            </span>
                        )}

                    </div>

                    {/* CÓDIGO */}

                    <div className="form-group">

                        <label>
                            Código
                        </label>

                        <input
                            type="text"
                            value={producto.codigo}
                            onChange={(e) =>
                                handleChange(
                                    'codigo',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: PROD001"
                        />

                        {errores.codigo && (
                            <span className="error-message">
                                {errores.codigo}
                            </span>
                        )}

                    </div>

                    {/* PRECIO */}

                    <div className="form-group">

                        <label>
                            Precio
                        </label>

                        <input
                            type="text"
                            value={producto.precio}
                            onChange={(e) =>
                                handleChange(
                                    'precio',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: $50.000"
                        />

                        {errores.precio && (
                            <span className="error-message">
                                {errores.precio}
                            </span>
                        )}

                    </div>

                    {/* AÑO */}

                    <div className="form-group">
                        <label>
                            Año
                        </label>
                        <input
                            type="text"
                            value={producto.anio}
                            onChange={(e) =>
                                handleChange(
                                    'anio',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: 2020"
                        />
                        {errores.anio && (
                            <span className="error-message">
                                {errores.anio}
                            </span>
                        )}
                    </div>

                    {/* DESCRIPCIÓN */}

                    <div className="form-group">

                        <label>
                            Descripción
                        </label>

                        <input
                            type="text"
                            value={producto.descripcion}
                            onChange={(e) =>
                                handleChange(
                                    'descripcion',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: Pastillas de freno"
                        />

                        {errores.descripcion && (
                            <span className="error-message">
                                {errores.descripcion}
                            </span>
                        )}

                    </div>

                    {/* IMAGEN */}

                    <div className="form-group">

                        <label>
                            Imagen
                        </label>

                        <input
                            type="text"
                            value={producto.imagen}
                            onChange={(e) =>
                                handleChange(
                                    'imagen',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: https://ejemplo.com/vehiculo.jpg"
                        />

                    </div>

                    {/* STOCK */}

                    <div className="form-group">

                        <label>
                            Stock
                        </label>

                        <input
                            type="text"
                            value={producto.stock}
                            onChange={(e) =>
                                handleChange(
                                    'stock',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: 100"
                        />

                        {errores.stock && (
                            <span className="error-message">
                                {errores.stock}
                            </span>
                        )}

                    </div>

                </div>

                {/* BOTONES */}

                <div className="form-buttons">

                    <button
                        className="add-button"
                        onClick={handleSubmit}
                    >
                        {
                            indiceEditando !== null
                                ? 'Guardar cambios'
                                : 'Agregar producto'
                        }
                    </button>

                    {indiceEditando !== null && (

                        <button
                            className="cancel-button"
                            onClick={() => {

                                setIndiceEditando(null)

                                setProducto({
                                    nombre: '',
                                    descripcion: '',
                                    codigo: '',
                                    precio: '',
                                    stock: '',
                                    imagen: ''
                                })

                                setErrores({})

                            }}
                        >
                            Cancelar
                        </button>

                    )}

                </div>

            </section>

            {/* TABLA DE PRODUCTOS */}

            <section className="products-section">

                <h2>
                    Productos
                </h2>

                {/* BUSCADOR */}

                <div className="search-container">

                    <label>
                        Buscar producto
                    </label>

                    <input
                        type="text"
                        placeholder="Ej: Yamaha/Honda/Suzuki..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                    />

                </div>

                {/* TABLA */}

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Nombre
                                </th>

                                <th>
                                    Código
                                </th>

                                <th>
                                    Precio
                                </th>

                                <th>
                                    Año
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th>
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                productosFiltrados.map(
                                    ({ producto, index }) => (

                                        <tr key={producto.id}>

                                            <td>
                                                {producto.nombre}
                                            </td>

                                            <td>
                                                {producto.codigo}
                                            </td>

                                            <td>
                                                $
                                                {formatearPrecio(
                                                    producto.precio
                                                )}
                                            </td>

                                            <td>
                                                {producto.anio}
                                            </td>

                                            <td>
                                                {producto.stock}
                                            </td>

                                            <td>

                                                <span
                                                    className={`stock-status ${obtenerEstadoStock(
                                                        producto.stock
                                                    )
                                                        .toLowerCase()
                                                        .replace(
                                                            ' ',
                                                            '-'
                                                        )}`}
                                                >
                                                    {
                                                        obtenerEstadoStock(
                                                            producto.stock
                                                        )
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        editarProducto(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        eliminarProducto(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    )

}

export default Admin

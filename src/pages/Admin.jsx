import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

function Admin() {

    const [productos, setProductos] = useState([])

    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        año: '',
        codigo: '',
        precio: ''
    })

    const handleChange = (name, value) => {
        setProducto({
            ...producto,
            [name]: value
        })
    }

    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('isAuthenticated')
        navigate('/login')
    }

    const handleSubmit = () => {

        setProductos([
            ...productos,
            producto
        ])

        setProducto({
            nombre: '',
            descripcion: '',
            año: '',
            codigo: '',
            precio: ''
        })

    }

    const ver = () => {
        console.log(productos)
        // alert(localStorage.getItem('isAuthenticated'))
    }

    return (

        <div className="container">
            <button onClick={logout}>cerrar sesión</button>
            <h1>Agregar producto</h1>

            <div>
                <label>Nombre del producto</label>

                <input
                    type="text"
                    value={producto.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="repuestos para motos"
                />
            </div>

            <div>
                <label>Descripción</label>

                <input
                    type="text"
                    value={producto.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    placeholder="Modelo"
                />
            </div>

            <div>
                <label>Año</label>

                <input
                    type="text"
                    value={producto.año}
                    onChange={(e) => handleChange('año', e.target.value)}
                    placeholder="Año de modelo"
                />
            </div>

            <div>
                <label>Código</label>

                <input
                    type="text"
                    value={producto.codigo}
                    onChange={(e) => handleChange('codigo', e.target.value)}
                    placeholder="cod: PROD001"
                />
            </div>

            <div>
                <label>Precio</label>

                <input
                    type="text"
                    value={producto.precio}
                    onChange={(e) => handleChange('precio', e.target.value)}
                    placeholder="precio en pesos Arg"
                />
            </div>

            <br />

            <button onClick={handleSubmit}>
                Agregar producto
            </button>

            <br />
            <br />

            <button onClick={ver}>
                Ver productos
            </button>

            <br />

            <h2>Productos</h2>

            <table>

                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Año</th>
                        <th>Código</th>
                        <th>Precio</th>
                    </tr>
                </thead>

                <tbody>

                    {productos.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.año}</td>
                            <td>{producto.codigo}</td>
                            <td>{producto.precio}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>

    )
}

export default Admin
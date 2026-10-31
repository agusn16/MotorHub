// Login.jsx
// Un solo componente para:
//   - /login          -> usuarios (con opción de crear usuario nuevo)
//   - /administrador  -> administrador (modo="admin", sin registro)

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mensajeError } from '../utils/erroresAuth'
import Icono from '../components/Iconos'
import './Login.css'

const REGISTRO_VACIO = {
    nombre: '',
    apellido: '',
    usuario: '',
    password: '',
    telefono: ''
}

const USUARIO_VALIDO = /^[a-z0-9._-]{3,20}$/
const TELEFONO_VALIDO = /^\+?[0-9\s-]{6,20}$/

function Campo({ etiqueta, error, ...props }) {

    return (
        <label className="login-campo">

            <span>{etiqueta}</span>

            <input {...props} />

            {error && (
                <em className="login-error">{error}</em>
            )}

        </label>
    )
}

function Login({ modo = 'usuario' }) {

    const esAdmin = modo === 'admin'

    const navigate = useNavigate()
    const location = useLocation()

    const { usuario, rol, cargando, iniciarSesion, registrar } = useAuth()

    const [vista, setVista] = useState('login')

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [datos, setDatos] = useState(REGISTRO_VACIO)

    const [errores, setErrores] = useState({})
    const [enviando, setEnviando] = useState(false)

    const destino = esAdmin ? '/admin' : (location.state?.desde || '/')

    // Si ya hay sesión (o se acaba de iniciar), se sale de esta pantalla
    useEffect(() => {

        if (cargando || !usuario) return

        if (esAdmin && rol !== 'admin') return

        navigate(destino, { replace: true })

    }, [cargando, usuario, rol, esAdmin, destino, navigate])

    function cambiarVista(nueva) {
        setVista(nueva)
        setErrores({})
    }

    function cambiarDato(campo, valor) {
        setDatos({ ...datos, [campo]: valor })
    }

    // =========================
    // INICIAR SESIÓN
    // =========================

    const handleLogin = async (e) => {

        e.preventDefault()

        const nuevos = {}

        if (user.trim() === '') nuevos.user = 'Ingresá tu usuario'
        if (password === '') nuevos.password = 'Ingresá tu contraseña'

        setErrores(nuevos)

        if (Object.keys(nuevos).length > 0) return

        setEnviando(true)

        try {

            await iniciarSesion(user, password, { soloAdmin: esAdmin })

        } catch (error) {

            setErrores({
                general:
                    error.message === 'NO_ADMIN'
                        ? 'Usuario o contraseña incorrectos'
                        : mensajeError(error)
            })

        } finally {

            setEnviando(false)

        }
    }

    // =========================
    // CREAR USUARIO NUEVO
    // =========================

    const handleRegistro = async (e) => {

        e.preventDefault()

        const nuevos = {}

        if (datos.nombre.trim() === '') nuevos.nombre = 'Ingresá tu nombre'
        if (datos.apellido.trim() === '') nuevos.apellido = 'Ingresá tu apellido'

        if (!USUARIO_VALIDO.test(datos.usuario.trim().toLowerCase())) {
            nuevos.usuario = '3 a 20 caracteres: letras, números, punto, guion o guion bajo'
        }

        if (datos.password.length < 6) {
            nuevos.password = 'Mínimo 6 caracteres'
        }

        if (!TELEFONO_VALIDO.test(datos.telefono.trim())) {
            nuevos.telefono = 'Ingresá un número válido (solo números)'
        }

        setErrores(nuevos)

        if (Object.keys(nuevos).length > 0) return

        setEnviando(true)

        try {

            await registrar(datos)

        } catch (error) {

            if (error.code === 'auth/email-already-in-use') {
                setErrores({ usuario: 'Ese usuario ya existe. Probá con otro' })
            } else {
                setErrores({ general: mensajeError(error) })
            }

        } finally {

            setEnviando(false)

        }
    }

    const enRegistro = vista === 'registro' && !esAdmin

    return (

        <main className="login-pagina">

            <div className={enRegistro ? 'login-tarjeta login-tarjeta--ancha' : 'login-tarjeta'}>

                <span className="login-icono">
                    <Icono nombre={esAdmin ? 'panel' : 'persona'} tamano={26} />
                </span>

                <h1>
                    {esAdmin
                        ? 'Acceso administrador'
                        : enRegistro
                            ? 'Crear usuario'
                            : 'Iniciar sesión'}
                </h1>

                <p className="login-subtitulo">
                    {esAdmin
                        ? 'Ingresá con tu cuenta de administrador.'
                        : enRegistro
                            ? 'Completá tus datos para crear tu cuenta.'
                            : 'Ingresá para chatear con nosotros.'}
                </p>

                {errores.general && (
                    <div className="login-alerta" role="alert">
                        {errores.general}
                    </div>
                )}

                {/* ---------- LOGIN ---------- */}

                {!enRegistro && (

                    <form onSubmit={handleLogin} noValidate>

                        <Campo
                            etiqueta="Usuario"
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="tu usuario"
                            autoComplete="username"
                            error={errores.user}
                        />

                        <Campo
                            etiqueta="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            error={errores.password}
                        />

                        <button
                            className="login-boton"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? 'Ingresando...' : 'Entrar'}
                        </button>

                    </form>

                )}

                {/* ---------- REGISTRO ---------- */}

                {enRegistro && (

                    <form onSubmit={handleRegistro} noValidate>

                        <div className="login-fila">

                            <Campo
                                etiqueta="Nombre"
                                type="text"
                                value={datos.nombre}
                                onChange={(e) => cambiarDato('nombre', e.target.value)}
                                autoComplete="given-name"
                                error={errores.nombre}
                            />

                            <Campo
                                etiqueta="Apellido"
                                type="text"
                                value={datos.apellido}
                                onChange={(e) => cambiarDato('apellido', e.target.value)}
                                autoComplete="family-name"
                                error={errores.apellido}
                            />

                        </div>

                        <Campo
                            etiqueta="Usuario"
                            type="text"
                            value={datos.usuario}
                            onChange={(e) => cambiarDato('usuario', e.target.value)}
                            placeholder="Ej: juanperez"
                            autoComplete="username"
                            error={errores.usuario}
                        />

                        <Campo
                            etiqueta="Contraseña"
                            type="password"
                            value={datos.password}
                            onChange={(e) => cambiarDato('password', e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                            error={errores.password}
                        />

                        <Campo
                            etiqueta="Contacto (teléfono)"
                            type="tel"
                            value={datos.telefono}
                            onChange={(e) => cambiarDato('telefono', e.target.value)}
                            placeholder="Ej: 299 123 4567"
                            autoComplete="tel"
                            error={errores.telefono}
                        />

                        <button
                            className="login-boton"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? 'Creando...' : 'Crear usuario'}
                        </button>

                    </form>

                )}

                {/* ---------- CAMBIO ENTRE LOGIN Y REGISTRO ---------- */}

                {!esAdmin && (

                    <p className="login-cambio">

                        {enRegistro ? '¿Ya tenés usuario?' : '¿No tenés usuario?'}

                        {' '}

                        <button
                            type="button"
                            className="login-enlace"
                            onClick={() => cambiarVista(enRegistro ? 'login' : 'registro')}
                        >
                            {enRegistro ? 'Iniciá sesión' : 'Creá uno nuevo'}
                        </button>

                    </p>

                )}

            </div>

        </main>

    )
}

export default Login

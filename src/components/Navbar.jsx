// Navbar.jsx

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icono from './Iconos'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

// En estas pantallas el menú es transparente y se ve el fondo de la moto
const RUTAS_TRANSPARENTES = ['/', '/login', '/administrador']

function Navbar() {

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const {
    usuario,
    perfil,
    rol,
    cargando,
    alias,
    iniciales,
    nombreCompleto,
    cerrarSesion
  } = useAuth()

  const [menuAbierto, setMenuAbierto] = useState(false)
  const caja = useRef(null)

  const transparente = RUTAS_TRANSPARENTES.includes(pathname)

  // Cerrar el menú al tocar afuera o con Esc
  useEffect(() => {

    if (!menuAbierto) return

    const alTocarAfuera = (e) => {
      if (caja.current && !caja.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }

    const alTocarTecla = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }

    document.addEventListener('mousedown', alTocarAfuera)
    document.addEventListener('keydown', alTocarTecla)

    return () => {
      document.removeEventListener('mousedown', alTocarAfuera)
      document.removeEventListener('keydown', alTocarTecla)
    }

  }, [menuAbierto])

  const salir = async () => {
    setMenuAbierto(false)
    await cerrarSesion()
    navigate('/')
  }

  return (
    <nav className={transparente ? 'navbar navbar--transparente' : 'navbar'}>

      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <Icono nombre="moto" tamano={26} />
          MotorHub
        </Link>

        <div className="navbar-derecha">

          <div className="navbar-links">

            <Link to="/">
              Home
            </Link>

            {!usuario && !cargando && (
              <Link to="/login">
                Login
              </Link>
            )}

          </div>

          {usuario && (

            <div className="navbar-usuario" ref={caja}>

              <button
                type="button"
                className={
                  menuAbierto
                    ? 'navbar-avatar navbar-avatar--abierto'
                    : 'navbar-avatar'
                }
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-haspopup="menu"
                aria-expanded={menuAbierto}
                aria-label="Menú de usuario"
              >
                {iniciales}
              </button>

              {menuAbierto && (

                <div className="navbar-menu" role="menu">

                  <div className="navbar-menu-cabecera">

                    <span className="navbar-avatar navbar-avatar--grande">
                      {iniciales}
                    </span>

                    <div className="navbar-menu-datos">
                      <strong>{nombreCompleto}</strong>
                      <small>
                        {rol === 'admin' ? 'Administrador' : `@${perfil?.usuario || alias}`}
                      </small>
                    </div>

                  </div>

                  {rol === 'admin' && (
                    <Link
                      to="/admin"
                      className="navbar-menu-item"
                      role="menuitem"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <Icono nombre="panel" tamano={18} />
                      Panel de administración
                    </Link>
                  )}

                  <button
                    type="button"
                    className="navbar-menu-item navbar-menu-item--salir"
                    role="menuitem"
                    onClick={salir}
                  >
                    <Icono nombre="salir" tamano={18} />
                    Cerrar sesión
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </nav>
  )
}

export default Navbar

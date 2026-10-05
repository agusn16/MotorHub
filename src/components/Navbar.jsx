import { Link, useLocation } from 'react-router-dom'
import Icono from './Iconos'
import './Navbar.css'

function Navbar() {

  const { pathname } = useLocation()

  const transparente = pathname === '/'

  return (
    <nav className={transparente ? 'navbar navbar--transparente' : 'navbar'}>

      <div className="navbar-container">

        <div className="navbar-logo">
          <Icono nombre="moto" tamano={26} />
          MotorHub
        </div>

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/admin">
            Admin
          </Link>

        </div>

      </div>

    </nav>
  )
}

export default Navbar
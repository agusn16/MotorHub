import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          Mi Aplicación
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

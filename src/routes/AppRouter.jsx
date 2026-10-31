// AppRouter.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AuthProvider, useAuth } from '../context/AuthContext'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Detalle from '../pages/detalle'
import Navbar from '../components/Navbar'
import ChatFlotante from '../components/ChatFlotante'

// Solo entra el administrador. Si no lo es, vuelve al Home
// (sin mostrar la dirección del login oculto).
function RutaAdmin({ children }) {

  const { rol, cargando } = useAuth()

  if (cargando) {
    return null
  }

  if (rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRouter() {
  return (
    <BrowserRouter>

      <AuthProvider>

        {/* Un solo Navbar para toda la aplicación */}
        <Navbar />

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* LOGIN DE USUARIOS */}
          <Route
            path="/login"
            element={<Login modo="usuario" />}
          />

          {/* LOGIN DEL ADMINISTRADOR (dirección oculta, sin link en la web) */}
          <Route
            path="/administrador"
            element={<Login modo="admin" />}
          />

          {/* PANEL DE ADMINISTRACIÓN */}
          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <Admin />
              </RutaAdmin>
            }
          />

          {/* DETALLE */}
          <Route
            path="/detalle/:id"
            element={<Detalle />}
          />

          {/* RUTA NO EXISTENTE */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

        {/* Chatbot y chat, flotando en todas las pantallas públicas */}
        <ChatFlotante />

      </AuthProvider>

    </BrowserRouter>
  )
}

export default AppRouter

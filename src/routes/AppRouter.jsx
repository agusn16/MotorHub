import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Detalle from '../pages/detalle'
import Navbar from '../components/Navbar'

function ProtectedRoute({ children }) {

  const isAuthenticated =
    localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRouter() {
  return (
    <BrowserRouter>

      {/* Un solo Navbar para toda la aplicación */}
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
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

    </BrowserRouter>
  )
}

export default AppRouter
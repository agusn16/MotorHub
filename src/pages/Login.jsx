import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Navbar from '../components/Navbar'

function Login() {

    const navigate = useNavigate()

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {

        e.preventDefault()

        if (user === "a" && password === "1") {

            localStorage.setItem('isAuthenticated', 'true')

            navigate('/admin')

        } else {

            alert('Usuario o contraseña incorrectos')

        }

    }

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Iniciar sesión</h1>

                <form onSubmit={handleSubmit}>

                    <div className="login-field">

                        <label>
                            Usuario
                        </label>

                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="abcde"
                        />

                    </div>

                    <div className="login-field">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="12345"
                        />

                    </div>

                    <button
                        className="login-button"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>

                </form>

            </div>

        </div>

    )
}

export default Login

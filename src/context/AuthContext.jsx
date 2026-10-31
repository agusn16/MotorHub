// src/context/AuthContext.jsx
// Sesión de usuarios y administradores con Firebase Authentication.
//
// - El "usuario" se guarda en Auth como un correo interno: usuario@motorhub.app
//   (si se escribe un correo real con @, se usa tal cual).
// - Datos de personas: colección "usuarios"
// - Administradores: colección "administradores" (se cargan SOLO con el script
//   scripts/crear-admin.mjs; desde la web no se puede crear ninguno).

/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'

const AuthContext = createContext(null)

const DOMINIO_INTERNO = 'motorhub.app'

export function aEmail(usuario) {

    const limpio = usuario.trim().toLowerCase()

    return limpio.includes('@') ? limpio : `${limpio}@${DOMINIO_INTERNO}`
}

// Busca primero en administradores y después en usuarios
async function cargarPerfil(uid) {

    const admin = await getDoc(doc(db, 'administradores', uid))

    if (admin.exists()) {
        return { rol: 'admin', perfil: admin.data() }
    }

    const persona = await getDoc(doc(db, 'usuarios', uid))

    return {
        rol: 'usuario',
        perfil: persona.exists() ? persona.data() : null
    }
}

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null)
    const [perfil, setPerfil] = useState(null)
    const [rol, setRol] = useState(null)
    const [cargando, setCargando] = useState(true)

    // Mientras se registra o inicia sesión a mano, el listener no pisa el estado
    const ocupado = useRef(false)

    const aplicar = useCallback((u, p, r) => {
        setUsuario(u)
        setPerfil(p)
        setRol(r)
    }, [])

    useEffect(() => {

        const cancelar = onAuthStateChanged(auth, async (u) => {

            if (ocupado.current) return

            if (!u) {
                aplicar(null, null, null)
                setCargando(false)
                return
            }

            try {

                const datos = await cargarPerfil(u.uid)

                aplicar(u, datos.perfil, datos.rol)

            } catch (error) {

                console.error('Error al cargar el perfil:', error)

                aplicar(u, null, 'usuario')

            }

            setCargando(false)
        })

        return cancelar

    }, [aplicar])

    // =========================
    // INICIAR SESIÓN
    // =========================

    const iniciarSesion = useCallback(async (usuarioTexto, password, { soloAdmin = false } = {}) => {

        ocupado.current = true

        try {

            const credencial = await signInWithEmailAndPassword(
                auth,
                aEmail(usuarioTexto),
                password
            )

            const datos = await cargarPerfil(credencial.user.uid)

            if (soloAdmin && datos.rol !== 'admin') {
                await signOut(auth)
                aplicar(null, null, null)
                throw new Error('NO_ADMIN')
            }

            aplicar(credencial.user, datos.perfil, datos.rol)

            return datos.rol

        } finally {

            ocupado.current = false

        }

    }, [aplicar])

    // =========================
    // CREAR USUARIO NUEVO
    // =========================

    const registrar = useCallback(async ({ nombre, apellido, usuario: nombreUsuario, password, telefono }) => {

        ocupado.current = true

        try {

            const credencial = await createUserWithEmailAndPassword(
                auth,
                aEmail(nombreUsuario),
                password
            )

            const datos = {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                usuario: nombreUsuario.trim().toLowerCase(),
                telefono: telefono.trim(),
                creadoEn: Date.now()
            }

            try {

                await setDoc(doc(db, 'usuarios', credencial.user.uid), datos)

            } catch (error) {

                // Para no dejar un usuario "a medias" en Authentication
                await deleteUser(credencial.user).catch(() => { })

                throw error
            }

            aplicar(credencial.user, datos, 'usuario')

        } finally {

            ocupado.current = false

        }

    }, [aplicar])

    // =========================
    // CERRAR SESIÓN
    // =========================

    const cerrarSesion = useCallback(async () => {
        await signOut(auth)
    }, [])

    // =========================
    // DATOS DERIVADOS
    // =========================

    const valor = useMemo(() => {

        const correoLocal = usuario?.email ? usuario.email.split('@')[0] : ''

        const alias = perfil?.usuario || correoLocal

        const nombreCompleto = perfil?.nombre
            ? `${perfil.nombre} ${perfil.apellido || ''}`.trim()
            : alias

        // Primera letra del nombre + primera letra del apellido
        const iniciales = (
            perfil?.nombre && perfil?.apellido
                ? perfil.nombre[0] + perfil.apellido[0]
                : (alias || '?').slice(0, 2)
        ).toUpperCase()

        return {
            usuario,
            perfil,
            rol,
            cargando,
            esAdmin: rol === 'admin',
            alias,
            nombreCompleto,
            iniciales,
            iniciarSesion,
            registrar,
            cerrarSesion
        }

    }, [usuario, perfil, rol, cargando, iniciarSesion, registrar, cerrarSesion])

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

    const contexto = useContext(AuthContext)

    if (!contexto) {
        throw new Error('useAuth debe usarse dentro de <AuthProvider>')
    }

    return contexto
}

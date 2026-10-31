// Traduce los errores de Firebase a mensajes para el usuario

export function mensajeError(error) {

    switch (error?.code) {

        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
            return 'Usuario o contraseña incorrectos'

        case 'auth/email-already-in-use':
            return 'Ese nombre de usuario ya está en uso. Probá con otro'

        case 'auth/weak-password':
            return 'La contraseña es muy débil (mínimo 6 caracteres)'

        case 'auth/too-many-requests':
            return 'Demasiados intentos. Esperá unos minutos y volvé a probar'

        case 'auth/network-request-failed':
            return 'Sin conexión. Revisá tu internet e intentá de nuevo'

        case 'auth/operation-not-allowed':
            return 'Falta habilitar "Correo/contraseña" en Firebase Authentication'

        case 'permission-denied':
            return 'Firestore rechazó la operación. Publicá las reglas nuevas (firestore.rules)'

        default:
            return 'Ocurrió un error inesperado. Intentá de nuevo'
    }
}

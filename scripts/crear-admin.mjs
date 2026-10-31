// scripts/crear-admin.mjs
// Crea (o actualiza) el administrador de MotorHub.
//
// Uso:   npm run crear-admin
//
// Requisitos:
//   1) npm install                      (instala firebase-admin)
//   2) serviceAccountKey.json en la raíz del proyecto (junto a package.json)
//      Firebase Console -> Configuración del proyecto -> Cuentas de servicio
//      -> "Generar nueva clave privada".  ¡No la subas a GitHub!

import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const DOMINIO_INTERNO = 'motorhub.app'
const USUARIO_VALIDO = /^[a-z0-9._-]{3,20}$/

const aqui = dirname(fileURLToPath(import.meta.url))
const rutaClave = join(aqui, '..', 'serviceAccountKey.json')

if (!existsSync(rutaClave)) {
    console.error('\n✗ No encuentro serviceAccountKey.json en la raíz del proyecto.')
    console.error('  Descargalo desde Firebase Console -> Configuración del proyecto -> Cuentas de servicio.\n')
    process.exit(1)
}

initializeApp({
    credential: cert(JSON.parse(readFileSync(rutaClave, 'utf8')))
})

const auth = getAuth()
const db = getFirestore()

function preguntar(texto, oculto = false) {

    return new Promise((resolver) => {

        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        })

        let silenciado = false

        // Para no mostrar la contraseña mientras se escribe
        rl._writeToOutput = (s) => {
            rl.output.write(silenciado ? '*' : s)
        }

        rl.question(texto, (respuesta) => {
            rl.close()
            if (oculto) console.log()
            resolver(respuesta.trim())
        })

        silenciado = oculto
    })
}

async function main() {

    console.log('\n=== Crear administrador de MotorHub ===\n')

    const nombre = await preguntar('Nombre: ')
    const apellido = await preguntar('Apellido: ')
    const usuarioIngresado = (await preguntar('Usuario (o correo real): ')).toLowerCase()
    const password = await preguntar('Contraseña (mínimo 6 caracteres): ', true)

    if (!nombre || !apellido) {
        throw new Error('El nombre y el apellido son obligatorios.')
    }

    const esCorreo = usuarioIngresado.includes('@')

    if (!esCorreo && !USUARIO_VALIDO.test(usuarioIngresado)) {
        throw new Error('Usuario inválido: 3 a 20 caracteres (letras, números, punto, guion o guion bajo).')
    }

    if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.')
    }

    const email = esCorreo ? usuarioIngresado : `${usuarioIngresado}@${DOMINIO_INTERNO}`
    const displayName = `${nombre} ${apellido}`

    let cuenta

    try {

        cuenta = await auth.getUserByEmail(email)

        await auth.updateUser(cuenta.uid, { password, displayName })

        console.log('\n• Ya existía esa cuenta: se actualizó la contraseña.')

    } catch (error) {

        if (error.code !== 'auth/user-not-found') throw error

        cuenta = await auth.createUser({ email, password, displayName })

        console.log('\n• Cuenta creada en Authentication.')
    }

    await db.collection('administradores').doc(cuenta.uid).set(
        {
            nombre,
            apellido,
            usuario: esCorreo ? usuarioIngresado.split('@')[0] : usuarioIngresado,
            creadoEn: Date.now()
        },
        { merge: true }
    )

    console.log('• Registrado en la colección "administradores".')
    console.log('\n✓ Listo. Ingresá en  /administrador  con ese usuario y contraseña.\n')
}

main().catch((error) => {
    console.error('\n✗ Error:', error.message, '\n')
    process.exit(1)
}).then(() => process.exit(0))

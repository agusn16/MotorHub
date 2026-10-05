import Database from 'better-sqlite3'

const db = new Database('server/database.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS productos (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nombre TEXT NOT NULL,

        descripcion TEXT NOT NULL,

        codigo TEXT NOT NULL UNIQUE,

        precio REAL NOT NULL,

        stock INTEGER NOT NULL,

        anio TEXT NOT NULL

    )
`)

const columnas = db
    .prepare(`
        PRAGMA table_info(productos)
    `)
    .all()

const existeImagen = columnas.some(
    columna => columna.name === 'imagen'
)

if (!existeImagen) {

    db.exec(`
        ALTER TABLE productos
        ADD COLUMN imagen TEXT
    `)

}

export default db

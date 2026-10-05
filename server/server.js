import './database.js'
import express from 'express'
import cors from 'cors'
import db from './database.js'


const app = express()

const PORT = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente')
})

app.get('/productos', (req, res) => {

    const productos = db.prepare('SELECT * FROM productos').all()

    res.json(productos)
})

app.post('/productos', (req, res) => {

    console.log(req.body)

    const {
        nombre,
        descripcion,
        codigo,
        precio,
        stock,
        imagen,
        anio
    } = req.body

    const resultado = db.prepare(`
        INSERT INTO productos (
            nombre,
            descripcion,
            codigo,
            precio,
            stock,
            imagen,
            anio
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        nombre,
        descripcion,
        codigo,
        precio,
        stock,
        imagen,
        anio
    )

    res.json({
        mensaje: 'Producto creado correctamente',
        id: resultado.lastInsertRowid
    })
})

app.put('/productos/:id', (req, res) => {

    console.log('EDITANDO:', req.params.id, req.body)

    const {
        nombre,
        descripcion,
        codigo,
        precio,
        stock,
        imagen,
        anio,
    } = req.body

    const resultado = db.prepare(`
        UPDATE productos
        SET
            nombre = ?,
            descripcion = ?,
            codigo = ?,
            precio = ?,
            stock = ?,
            imagen = ?,
            anio = ?
        WHERE id = ?
    `).run(
        nombre,
        descripcion,
        codigo,
        precio,
        stock,
        imagen,
        anio,
        req.params.id
    )

    console.log('FILAS MODIFICADAS:', resultado.changes)

    res.json({
        mensaje: 'Producto actualizado correctamente',
        cambios: resultado.changes
    })
})

app.delete('/productos/:id', (req, res) => {

    console.log('ELIMINANDO:', req.params.id)

    const resultado = db.prepare(`
        DELETE FROM productos
        WHERE id = ?
    `).run(
        req.params.id
    )

    console.log('FILAS ELIMINADAS:', resultado.changes)

    res.json({
        mensaje: 'Producto eliminado correctamente',
        cambios: resultado.changes
    })
})


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})

const express = require('express');
const router = express.Router();
const pool = require('../database');

const upload = require('../lib/uploadMiddleware');
const Resize = require('../lib/resize');
const path = require('path');


const { isLoggedIn } = require('../lib/auth');


router.get('/catalogo', async(req, res) => {
    let paquete = {};
    const libros = await pool.query('select * from productos where id_categoria = 1');
    const peliculas = await pool.query('select * from productos where id_categoria = 2');
    const musica = await pool.query('select * from productos where id_categoria = 3');
    res.render('store/list', { libros, peliculas, musica });
});

router.get('/catalogo/add', isLoggedIn, (req, res) => {
    res.render('auth/add');
});

router.post('/catalogo/add', upload.single('img'), async(req, res) => {
    const { name, descripction, price, id_categoria } = req.body;
    const id_user = req.app.locals.user.id;
    const imagePath = path.join('src/public/images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    }
    const img_name = await fileUpload.save(req.file.buffer);
    const newProduct = {
        name,
        descripction,
        price,
        img_name,
        id_categoria,
        id_user
    };

    await pool.query('INSERT INTO productos set ?', [newProduct]);
    res.redirect('/catalogo');
});

router.get('/carrito', isLoggedIn, (req, res) => {
    const total = req.app.locals.carrito.total;
    const productos = req.app.locals.carrito.productos
    res.render('store/carrito', { productos, total });
});




module.exports = router;
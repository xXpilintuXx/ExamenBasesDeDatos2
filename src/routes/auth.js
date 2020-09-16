const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('auth/profile');
});

router.get('/profile/products', isLoggedIn, async(req, res) => {
    const { id } = req.app.locals.user;
    const rows = await pool.query('SELECT * FROM productos WHERE id_user = ?', [id]);
    const productos = rows;
    res.render('auth/list', { productos });
});

//productos

router.get('/producto/delete/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    req.flash('message', 'Producto eliminado satisfactoriamente!');
    res.redirect('/profile/products');
});

router.get('/producto/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const producto = await pool.query('select * from productos where id = ?', [id]);
    res.render('auth/edit', { producto: producto[0] });
});

router.post('/producto/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const { name, descripction, price } = req.body;
    const newMovie = {
        name,
        descripction,
        price
    }
    await pool.query('UPDATE productos set ? WHERE id = ?', [newMovie, id]);
    req.flash('message', 'Producto editado satisfactoriamente!');
    res.redirect('/profile/products');
});



//inicio de sesion
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup',
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }));


router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;
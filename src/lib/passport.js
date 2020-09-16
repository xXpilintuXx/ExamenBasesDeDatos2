const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

//inicio de sesion 
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const valid = await helpers.matchPassword(password, user.password);
        if (valid) {
            req.flash('message', 'Bienvenido!');
            done(null, user);
        } else {
            req.flash('message', 'Contraseña Incorrecta!');
            done(null, false);
        }
    } else {
        req.flash('message', 'Usuario no registrado!');
        return done(null, false);
    }
}));





//registro

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const { email, frist_name, last_name } = req.body;
    const newUser = {
        username,
        password,
        email,
        frist_name,
        last_name
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser], (err, result) => {
        if (err) {
            req.flash('message', 'Error, usuario ya registrado!')
            return done(null, false);
        }
        newUser.id = result.insertId;
        req.flash('message', 'Bienvenido!')
        return done(null, newUser);
    });
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
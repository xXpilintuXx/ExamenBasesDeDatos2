module.exports = {

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('message', 'Debes Iniciar Sesion!');
            return res.redirect('/login');
        }
    },

    isNotLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/profile');
        } else {
            return next();
        }
    }
}
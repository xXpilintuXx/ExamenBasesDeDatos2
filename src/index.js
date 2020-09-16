const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');



//init
const app = express();
require('./lib/passport')


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'StoreSession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

//global var
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    if (!app.locals.carrito) {
        app.locals.carrito = {
            total: 0,
            productos: []
        }
    }
    next();
});

//public
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use(require('./routes/store'));
app.use(require('./routes/404'));



//run
app.listen(app.get('port'), () => {
    console.log('server listen on port :', app.get('port'));
});
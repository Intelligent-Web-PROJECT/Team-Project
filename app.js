var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport")
const flash = require('express-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouters = require('./routes/authRoutes');
const {sessionSetup, passportStrategy, passportSerializeUser, passportDeserializeUser, sessionErrorHandler} = require("./auth/passportAuth");
const {isAuthenticated, authInfo} = require("./middlewares/auth");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




/* Static files */
app.use("/stylesheets", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/jquery/dist")))


app.use(sessionSetup);
app.use(passport.authenticate('session'))
/* Session Error Handler */
app.use(sessionErrorHandler);

app.use(flash())

/* Passport setup */
passport.use(passportStrategy)
passport.serializeUser(passportSerializeUser)
passport.deserializeUser(passportDeserializeUser)

app.use('/', authInfo, indexRouter);
app.use('/', authRouters);
app.use('/', isAuthenticated, usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

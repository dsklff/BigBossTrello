const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const path = require('path')
// var morgan = require('morgan')

const history = require('connect-history-api-fallback');
// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());
// tell the browser to load history of app
// app.use(morgan('dev'))

// app.use(history())

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authRoutes = require('./server/routes/auth');
app.use('/auth', authRoutes);

const apiRoutes = require('./server/routes/api');
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware, apiRoutes);

// const statusCheckMiddleware = require('./server/middleware/status-check');
// const profileRoutes = require('./server/routes/profile');
// app.use('/profile', statusCheckMiddleware, profileRoutes);


app.get('/*', function (request, response){
  response.sendFile(path.resolve(__dirname, './server/static', 'index.html'))
})


// start the server
app.listen(7777, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:7777');
});

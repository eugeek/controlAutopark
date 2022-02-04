const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const app = express();
const config = require('./config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require("body-parser").urlencoded({extended:true}));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}));

app.use(express.static('public'));
app.use(routes);

app.use((err, req, res, next) => {
    // console.log(err);
    return res.send('Internal Server Error');
});

app.listen(config.config.port, () => console.log(`Server is running on port ${config.config.port}`));
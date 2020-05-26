const express = require('express');
const app = express()


app.use(require('./vendedor'));
app.use(require('./categoria'));
app.use(require('./anuncio'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./like'));
app.use(require('./mensaje'));
// app.use(require('./'));


module.exports = app;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const auth = require('./services/auth.js');
const PORT = 5000
require('dotenv').config()

mongoose
  .connect(
    process.env.MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB bağlandı'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true,  limit: '50mb' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
res.header('Access-Control-Allow-Headers', '*');
res.header('Access-Control-Allow-Methods', '*');
  next()
})
app.get('/', function (req, res) {
    res.json({ message: 'backend aktif' })
})

app.use('/api/auth', require('./router/auth.js'));
app.use('/api/admin', require('./router/admin.js'));
app.use('/api/owner', require('./router/owner.js'));
app.use('/api/film-bilgi', require('./router/film.js'));
app.use('/api/islem', require('./router/islem.js'));


app.options("*", (req, res) => {
  res.status(200).send("Preflight request allowed");
});

app.listen(PORT, console.log('Backend Started PORT:' + PORT))

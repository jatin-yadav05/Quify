const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Quify API is running!'
  });
});

app.use('/api', require('./routes'));

module.exports = app;
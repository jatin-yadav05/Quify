const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080;
const connectDB = require('./config/db');

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


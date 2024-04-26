// server.js
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes')

const app = express();
const port = process.env.PORT || 3001;
const upload = multer()

//middlewares
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(upload.none())

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tourism')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log(error));

// Routes
app.use("/api/auth",userRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

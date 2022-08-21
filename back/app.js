const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');
const app = express();
const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api', saucesRoutes);

mongoose.connect('mongodb+srv://sean:secretpassword@cluster0.sc0ja.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

module.exports = app;
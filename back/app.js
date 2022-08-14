const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const app = express();

app.use('/api/auth', userRoutes);
mongoose.connect('mongodb+srv://sean:secretpassword@cluster0.sc0ja.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

module.exports = app;
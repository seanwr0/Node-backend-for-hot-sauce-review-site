const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sean:secretpassword@cluster0.sc0ja.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });


const app = express();

app.use((req, res) => {
   res.json({ message: 'Your request was successful!' }); 
});

module.exports = app
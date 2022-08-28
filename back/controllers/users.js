const users = require('../models/users');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

// saves email and password to data base, checks if email is unique, hashes the password
exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = new users({
        email: req.body.email,
        password: hash,
      });
      user.save().then(
        () => {
          res.status(201).json({
            message: 'user saved to database!'
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    })
};

// checks if user exists, and if the passwords match, returns a token
exports.checkUser = (req, res, next) => {
  users.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          res.status(200).json({
            userId: user._id,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}


const express = require('express');
const router = express.Router(); //eslint-disable-line
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const User = require('../models/user');

router
  .post('/signup', bodyParser, (req, res, next) => {
    const { username, password } = req.body;
    delete req.body.password;

    if(!username || !password) {
      return next({
        code: 400,
        error: 'username and password required'
      });
    }

    User.find({ username })
      .count()
      .then(count => {
        if(count > 0) throw {
          code: 400,
          error: `username ${username} already exists`
        };
        const user = new User(req.body);
        user.generateHash(password);
        return user.save();
      })
      .then(user => token.sign(user))
      .then(token => res.send({ token, username }))
      .catch(next);
  })

  .post('/signin', bodyParser, (req, res, next) => {
    const { username, password } = req.body;
    delete req.body.password;
    let communityId;
    let communityName;

    User
      .findOne({ username })
      .then(user => {
        if (!user || !user.compareHash(password)) {
          throw({
            code: 400,
            error: 'Invalid username or password.'
          });
        }
        communityId = user.communityId;
        communityName = user.communityName;
        return token.sign(user);
      })
      .then(token => res.send({ token, username, communityName, communityId }))
      .catch(next);
  });

module.exports = router;
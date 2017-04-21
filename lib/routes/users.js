

const express = require('express');
const router = express.Router(); //eslint-disable-line
const User = require('../models/user');
const bodyParser = require('body-parser').json();

router
  // Use "me" to indicate that the /users/:id is current user
  .get('/me/favorites', (req, res, next) => { 
    // you could have done this much more cleanly with .aggregate
    User
      .findById(req.user.id)
      .select('favoriteUsers')
      .lean()
      .then(user => {
        // use $in to select favs in one go!
        return User
          .find({ _id: { $in: user.favoriteUsers }})
          .select('username')
          .lean();
      })
      .then(favNames => {
        res.send(favNames);
      })
    .catch(next);
  })
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .select('communityId')
      .lean()
      .then(commId => res.send(commId))
      .catch(next);
  })

  // This should be a query against /users
  .get('/id/:name', (req, res, next) => {
    User
      .find({ username: req.params.name })
      .select('communityId')
      .lean()
      .then(commId => {
        res.send(commId[0].communityId);
      })
      .catch(next);
  })


  .put('/favorites', bodyParser, (req, res, next) => {
    let favUser;
    // use id's!
    User.find({username: req.body.username})
      .then(user => {
        favUser = user[0]._id;
      })
      .then(() => {
        return User.findByIdAndUpdate(req.user.id,
        {$push: {favoriteUsers: favUser}}, 
        {new:true, upsert:true});
      })
      .then(user => {
        res.send(user);
      })
      .catch(next);
  });

module.exports = router;
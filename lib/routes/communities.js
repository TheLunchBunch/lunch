

const express = require('express');
const router = express.Router(); //eslint-disable-line
const bodyParser = require('body-parser').json();
const Experience = require('../models/experience');
const Community = require('../models/community');
const User = require('../models/user');

router
  // calledAhead is a query param, not a resource path.
  // DRY: don't repeat the same get code twice :(
  .get('/', (req, res, next) => {
    // a seperate middleware function 
    // separtes making query filter from main data fetch

    // I would add the communityId to info in jwt payload, 
    // so don't have to get the fetch user's communityId...
    User
      .findById(req.user.id)
      // don't retrieve more than you need...
      .select(communityId)
      .lean()
      .then(user => user.communityId)
      .then(communityId => {
        const filter = req.filter = { communityId };
        const { calledAhead } = req.query;
        if(calledAhead === 'true') filter.calledAhead = true;
        else if(calledAhead === 'false') filter.calledAhead = false;
        next();
      });
  }, (req, res, next) => {
    Experience
      .find(filter)
      .populate('userId', 'username')
      .populate('communityId', 'name')
      .limit(25)
      // are you trying to time sort?
      .sort([['_id', -1]])
      .then(experiences => {
        experiences.forEach(item => {
          // if you add timestamp option to schema,
          // it would auto add item.createOn.
          // Otherwise, move this to a virtual property on the model...
          item.postedOn = item._id.getTimestamp();
        });
        res.send(experiences);
      })
      .catch(next);
  })
  
  // This should be put to /:id/users
  .put('/:id/users', bodyParser, (req, res, next) => {
    // Use _id, not name to "id"entify resources
    const {name} = req.body;
    // use findOne to only get one. Better yet, use Id.
    // Then you could skip this find alltogether
    Community.findOne({name})
    .then(community => {
      if(!community) { 
        throw {
          // probably better as a 404
          code: 400,
          error: `Community ${name} does not yet exist!`
        };
      }
      // throw short-circuits, no need for "else"

      const { communityId, communityName } = community;
      return User.findByIdAndUpdate(req.user.id, {communityId, communityName}, {new:true}); 
    })
    .then(() => {
      // odd return...
      res.send({communityId});
    })
    .catch(next);
  })

  .post
    ('/', bodyParser, (req, res, next) => {
      const {name} = req.body;
      Community.find({name})
        .then(commArr => {
          if(commArr.length > 0) throw {
            code: 400,
            error: `Community ${name} already exists!`
          };
          const comm = new Community(req.body);
          let communityId;
          let communityName;
          comm.save()
            .then(newComm => {
              communityId = newComm._id;
              communityName = newComm.name;
              return User.findByIdAndUpdate(req.user.id, {communityId, communityName}, {new:true});
            })
            .then(() => {
              // should send back community object here...
              res.send({communityId});
            });
        })
        .catch(next);
    });

module.exports = router;
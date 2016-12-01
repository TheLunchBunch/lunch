

const express = require('express');
const router = express.Router(); //eslint-disable-line
const bodyParser = require('body-parser').json();
const Experience = require('../models/experience');
const Community = require('../models/community');
const token = require('../auth/token'); //eslint-disable-line
const User = require('../models/user');

router
  .get('/advance', (req, res, next) => { 
    User
      .findById(req.user.id)
      .then(user => {
        return user.communityId;        
      })
      .then(id => {
        Experience
          .find({communityId: id, calledAhead: true})
          .populate('userId', 'username')
          .populate('communityId', 'name')
          .limit(25)
          .sort([['_id', -1]])
          .then(experiences => {
            experiences.forEach(item => {
              item.postedOn = item._id.getTimestamp();
            });
            res.send(experiences);
          })
          .catch(next);
      })
      .catch(next); 
  })
  
  .get('/:id', (req, res, next) => { 

    Experience
      .find({communityId: req.params.id})
      .populate('userId', 'username')
      .populate('communityId', 'name')
      .limit(25)
      .sort([['_id', -1]])
      .then(experiences => {
        experiences.forEach(item => {
          item.postedOn = item._id.getTimestamp();
        });
        res.send(experiences);
      })
      .catch(next);
  })


  .post('/join', bodyParser, (req, res, next) => {
    const {name} = req.body;
    let communityId;
    let communityName;
    Community.find({name})
    .then(commArr => {
      if(commArr.length === 0) { 
        throw {
          code: 400,
          error: `Community ${name} does not yet exist!`
        };
      } else {
        communityId = commArr[0]._id;
        communityName = commArr[0].name;
        return User.findByIdAndUpdate(req.user.id, {communityId, communityName}, {new:true}); 
      }
    })
    .then(user => { //eslint-disable-line
      res.send({communityId});
    })
    .catch(err => {
      next(err);
    });
  })

  .post
    ('/create', bodyParser, (req, res, next) => {
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
            .then(user => { //eslint-disable-line
              res.send({communityId});
            });
        })
        .catch(next);
    });

module.exports = router;
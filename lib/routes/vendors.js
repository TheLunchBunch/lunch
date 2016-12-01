

const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router(); //eslint-disable-line
const Experience = require('../models/experience');
const User = require('../models/user');

router
  .get('/', (req, res, next) => {
    User
      .findById(req.user.id)
      .then(user => {
        return user.communityId;        
      })
      .then(id => {
        Experience
        .find({ communityId: id})
        .select('name')
        .lean()
        .then(rawVendors => {
          return rawVendors.map(item => {
            return item.name;
          });
        })
        .then(vendors => {
          // boo, O(n^2)! :(
          // Remember using a hash map? O(n log n)
          return vendors.filter((item, i) => {
            return vendors.indexOf(item) === i;
          });
          // Doesn't make a lot of sense to do this anyway...
        })
        .then(uniqVendors => {
          return Promise.all(
            uniqVendors.map(vendor => {
              // this whole thing should be part of a single aggregate pipeline
              return Experience.aggregate([
                { $match: { name: vendor } },
                // limit line length to fit so you can see ALL code
                { $group: { _id: '$name', howFast: { $avg: '$howFast' }, cost: { $avg: '$cost' }, worthIt: { $avg: '$worthIt' } } }
              ])
              .exec();
            })
          );
        })
          .then(promiseReturn => {
            res.send(promiseReturn);
          });
      })
      .catch(next);
  });

// compare above to:
router.get('/', (req, res, next) => {
  Experience
    .aggegate([
      { $match: { communityId: req.user.communityId }},
      { $group: { 
        _id: '$name', 
        howFast: { $avg: '$howFast' }, 
        cost: { $avg: '$cost' }, 
        worthIt: { $avg: '$worthIt' } 
      }}
    ])
    .exec()
    .then(experiences => res.send(experiences))
    .catch(next);
})

module.exports = router;
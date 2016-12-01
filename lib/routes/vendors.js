

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
          return vendors.filter((item, i) => {
            return vendors.indexOf(item) === i;
          });
        })
        .then(uniqVendors => {
          return Promise.all(
            uniqVendors.map(vendor => {
              return Experience.aggregate([
                { $match: { name: vendor } },
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

module.exports = router;
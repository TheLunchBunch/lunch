

const jwt = require('jsonwebtoken');
const sekrit = process.env.APP_SECRET || 'lunchmeat';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {
      const payload = {
        id: user._id,
        // add this so you don't have to fetch to 
        // go from user to their community
        communityId: user.communityId,
        roles: user.roles
      };

      jwt.sign(payload, sekrit, null, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, sekrit, (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      });
    });
  }
};
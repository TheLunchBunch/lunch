
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({ //eslint-disable-line
  username: {type: String, required: true},
  password: {type: String, required: true},
  roles: {type: [String], default: 'user'},
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  },
  communityName: {
    type: String
  },
  favoriteUsers: {type: Array}
});

userSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
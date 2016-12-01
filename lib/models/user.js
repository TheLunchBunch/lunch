
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  roles: {type: [String], default: 'user'},
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  },
  // why store the name as well?
  communityName: {
    type: String
  },
  // be explicit on what type of array
  favoriteUsers: [{ 
    type : Schmea.Types.ObjectId, 
    ref: 'User' 
  }]
});

userSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
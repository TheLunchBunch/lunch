

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  communityId: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'Community'
  },
  userId: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'User'
  },

  postedOn: {
    type: String
  },

  name: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true,
    // default: Date.now
  },

  howFast: {
    type: Number,
    required: true
  },

  calledAhead: {
    type: Boolean,
    required: true
  },

  cost: {
    type: Number
  },

  worthIt: {
    type: Number
  },

  advice: {
    type: String
  }
});

module.exports = mongoose.model('Experience', schema);

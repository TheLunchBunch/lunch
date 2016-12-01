
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({ //eslint-disable-line
  name: {type: String, required: true}
});

module.exports = mongoose.model('Community', communitySchema);
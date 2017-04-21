
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {type: String, required: true},
  Address: {type: String},
  cuisine: {type: String}
});

module.exports = mongoose.model('vendor', vendorSchema);



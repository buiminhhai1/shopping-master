 var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    id:  Schema.Types.ObjectId,
    email: String,
    phone:   String,
    image: String,
    address: String
  });

  var userModel = mongoose.model('user', userSchema );

  module.exports  = userModel;
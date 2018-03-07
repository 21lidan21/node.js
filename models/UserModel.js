var mongoose = require('mongoose'); 
 
var User = mongoose.model('user', new mongoose.Schema({   
      email: String,    
      pwd: String,    
      nicheng: String, 
      realname:String,
      idnumber:String,
      photoName:String,
      preview:String,
      photoPath:String,
      role:Number,
      msgNum:Number
    },{_id:true}));   
 
module.exports = User; 
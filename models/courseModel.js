var mongoose = require('mongoose'); 
 
var Course = mongoose.model('course', new mongoose.Schema({   
     title: String,        
      type:Number, 
      photoName:String,
      photoPath:String,
      brief:String,
      uid:String,
      uname:String,
      status:Number,
      date:Date
    },{_id:true}));   
 
module.exports = Course; 
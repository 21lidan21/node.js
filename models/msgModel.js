var mongoose = require('mongoose'); 
 
var Msg = mongoose.model('msg', new mongoose.Schema({   
      send: String,    
      sendname: String,    
      to:String,
      message:String,
      sendtime :Date
      
    },{_id:true}));   
 
module.exports = Msg; 
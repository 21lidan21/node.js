var mongoose = require('mongoose');    
  var ChapterModel = mongoose.model('chapter', new mongoose.Schema({  
      title: String,
      content: String,
      courseid: String,
      uid: String,
      status:Number,
      msgid:String
    },{_id:true}));

module.exports=ChapterModel;  
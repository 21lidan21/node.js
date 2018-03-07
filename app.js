var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  ,mongoose = require('mongoose'); 
  mongoose.Promise = global.Promise;  //初始化 
// //mongoose.Promise = require('bluebird');  //疑似高效 
  
 var session = require('koa-generic-session');
//const mongoose = require('mongoose');
const MongooseStore = require('koa-session-mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var admin = require('./routes/admin');
var msg = require('./routes/msg');
var course = require('./routes/course');
var upload = require('./routes/upload');
// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
 //将public设置成静态资源默认路径 
app.use(require('koa-static')(__dirname + '/public'));
app.keys = ['edulineKey'];  // needed for cookie-signing,设置一个签名 Cookie 的密钥
app.use(session({store:new MongooseStore()}));
//拦截器
// app.use(function *(next){
//   var url=this.originalUrl;
//   if(url!="/users/login" && !this.session.loginbean && url!="/users/zhuce"){
//     //console.log("bbbbbbbbbbbb")
//       return this.redirect("/users/login")
//   }
//     yield next
// })
//升级版 访问任何页面钱都会先加载这一段
app.use(function *(next){
   var url=this.originalUrl;
   var allowPages=["/","/users/login","/users/zhuce","/users/loginOut"];
   if(allowPages.indexOf(url)>-1){
    yield next;
  }else{
    if(!this.session.loginbean){
     return this.redirect("/")
    }else{
       yield next;
    }
  }
   
 })
  // }
// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(home.routes(), home.allowedMethods());
app.use(admin.routes(), admin.allowedMethods());
app.use(msg.routes(), msg.allowedMethods());
app.use(course.routes(), course.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());

 mongoose.connect('mongodb://localhost/eduline'); 

 module.exports = app;

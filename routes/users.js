var router = require('koa-router')();
  //  var mongoose = require('mongoose');    
 //mongoose.Promise = global.Promise;  //初始化 
// //mongoose.Promise = require('bluebird');  //疑似高效 
 let User = require('../models/UserModel.js'); 


router.prefix('/users');

router.get('/', function *(next) {
  //this.body = 'this is a users response!';
    yield this.render('login', {});
    //console.log(loginbean)
});
router.get('/login', function *(next) {
	yield this.render('login', {});
})
router.all('/login', function *(next) {
   // yield this.render('login', {});
     console.log("loginlogin")
  let email = this.request.body['email'];
  let pwd = this.request.body['pwd'];
  let nicheng=this.request.body['nicheng'];
  
  let rs = yield User.findOne({email:email,pwd:pwd});
  var loginbean={};
  console.log(rs)
  if(rs!=null && rs.email!=undefined){
  	loginbean.nicheng=rs.nicheng;
    loginbean.pwd=rs.pwd;
    loginbean.id=rs._id;
    loginbean.role=rs.role;
    loginbean.msgNum=rs.msgNum;
   this.session.loginbean=loginbean;
console.log("loginbean.id"+loginbean.id)
    //this.body = '登录成功';
    this.redirect("/")
  }else{
    this.body = '账号/密码错误';
  }
  //yield this.render('login', {});
});
router.get('/bar', function *(next) {
  this.body = 'this is a users/bar response!';
});
router.get('/zhuce', function *(next) {
  //this.body = 'this is a users response!';
    yield this.render('login', {});
    //console.log(loginbean)
});
router.all('/zhuce', function *(next) {  
  //let email = this.query['email'];       //get  
 // let email = this.request.body['email'];     //post
 // let flag = this.query['flag']; 
  //this.body = '收到'+email+flag;  
  //yield this.render('login', {}); 
  console.log("aaaaaaaaaaaa")
  let user = new User(); //user 是关键词 插入的表叫users
  user.email = this.request.body['email']; 
  user.pwd = this.request.body['pwd']; 
  user.nicheng = this.request.body['nicheng']; 
  user.role=1;
  user.msgNum=0;
  try{
  	yield user.save();

  	this.status = 307;  //http重定向状态码
    this.redirect('/users/login');                     
//this.redirect("../")
  }catch(err){
  	console.log(err);
  	    if(err.toString().indexOf('nicheng_1 dup')>1){
	       this.body = 'email重复';
	    }else if(err.toString().indexOf('email_1 dup')>1){
	       this.body = '昵称重复';
	    }
	    return;
  }
    
  this.body = user._id;  
});
router.get('/loginOut', function *(next) {
	delete this.session.loginbean;
	this.redirect("/")
})
module.exports = router;

var router = require('koa-router')();
var formidable = require('formidable'); 
 let User = require('../models/UserModel.js'); 
  let Msg = require('../models/msgModel.js'); 
router.prefix('/admin');


router.get('/', function *(next) {
	//console.log("home")
	let loginbean=this.session.loginbean;
	this.state.loginbean=this.session.loginbean;
	if(loginbean.role!=0){		
		this.body="<script>alert('没有管理员权限');location.href='/';</script>";
		return;
	}
	   yield this.render('admin', {
	   loginbean:this.state.loginbean
	   });
   
});
router.get('/teacherapplylist', function *(next) {
     
   let rs=yield User.find({role:2});

	 yield this.render('teacherapplylist', {
	   rs:rs
	   });
});
router.get('/pass', function *(next) {
   let loginbean=this.session.loginbean;
   let id=this.query['id'];
   if(loginbean.role==0){ //权限
	   let updateRes=  yield User.update({_id:id},{$set:{role:3},$inc:{msgNum:1}});
	
	   if(updateRes.ok){
	   	let msg = new Msg();
		   	
		   msg.send=loginbean.id;
		   msg.sendname=loginbean.nicheng;
		   msg.to=id;
	      msg.message="您的讲师申请已审核通过";
	      msg.sendtime=new Date();
	      let refuseRs= yield msg.save();
	     if(refuseRs._id){
	     	this.body=1
	     }else{
	     	this.body=2
	     }
	  
	   	
	   }else{
	   	this.body=0
	   }
   }  
   
   
});
router.get('/refuse', function *(next) {
   let loginbean=this.session.loginbean;
   let id=this.query['uid'];
   
   console.log(id);
   //console.log(msg)
   if(loginbean.role==0){ //权限
	   let updateRes=  yield User.update({_id:id},{$set:{role:1},$inc:{msgNum:1}});
	   if(updateRes.ok){
		   	let msg = new Msg();
		   	let message1=this.query['message'];
		   msg.send=loginbean.id;
		   msg.sendname=loginbean.nicheng;
		   msg.to=id;
	      msg.message=message1;
	      msg.sendtime=new Date();
	     let refuseRs= yield msg.save();
	     if(refuseRs._id){
	     	this.body=1
	     }else{
	     	this.body=2
	     }
	 }else{
	 	this.body=0
	 }
	   
   }  
   
   
});
module.exports = router;

var router = require('koa-router')();
var formidable = require('formidable'); 
let User = require('../models/UserModel.js'); 
let Msg = require('../models/msgModel.js'); 
router.prefix('/msg');


router.post('/reply', function *(next) {
	console.log("reply")
	let loginbean=this.session.loginbean;
	this.state.loginbean=this.session.loginbean;
	if(loginbean.role==0){		
		this.body="<script>alert('没有操作权限');location.href='/';</script>";
		return;
	}

	let msg=new Msg();
	msg.send=loginbean.id;
	msg.message=this.request.body['message'];    
      msg.sendname= loginbean.nicheng;   
      msg.to=this.request.body['rid'];      
      msg.sendtime=new Date();
      let replyRs=yield msg.save();
      console.log(replyRs)
	   if(replyRs.to){
	   	let rs = yield User.update({_id:msg.to},{$inc:{msgNum:1}})
		   	 if(rs.ok){
		   	 	this.body=1
		   	 }else{
		   	 	this.body=2
		   	 }
	   	
	   }else{
	   	this.body=0
	   }
   
});
router.post('/newmsg', function *(next) {
	let loginbean=this.session.loginbean;
	this.state.loginbean=this.session.loginbean;
	if(loginbean.role==0){		
		this.body="<script>alert('没有操作权限');location.href='/';</script>";
		return;
	}

	let msg=new Msg();
	 msg.sendname= this.request.body['nicheng'];
	 let urs=yield User.findOne({nicheng:msg.sendname});
	 console.log(msg.sendname)
	 console.log(urs)  
	 if(urs!=null){
			msg.send=loginbean.id;
			msg.message=this.request.body['message'];    
		    msg.to=urs._id;
		    console.log(urs)    
		    console.log(msg.to)  
		    msg.sendtime=new Date();
		    let replyRs=yield msg.save();
		      //console.log(replyRs)
			   if(replyRs.to){
			   	let rs = yield User.update({_id:msg.to},{$inc:{msgNum:1}})
				   	 if(rs.ok){
				   	 	this.body=1
				   	 }else{
				   	 	this.body=2
				   	 }
			   	
			   }else{
			   	this.body=0
			   }
		 }else{
		 	this.body=-1
		 }
	
   
});

router.get('/del', function *(next) {
	let loginbean=this.session.loginbean;
	this.state.loginbean=this.session.loginbean;
	if(loginbean.role==0){		
		this.body="<script>alert('没有操作权限');location.href='/';</script>";
		return;
	}

	let msgId=this.request.query['id'];
	let toId=loginbean.id;
	let delrs=yield Msg.remove({_id:msgId,to:toId});
	console.log("delrs"+delrs);
     console.log("delrsok"+delrs.ok);
	   if(delrs){
	   	
	   	//let rs = yield User.update({_id:toId},{$inc:{msgNum:-1}});
	   	//let rs2 = yield User.findOne({_id:toId});
  
	   //	this.session.loginbean.msgNum=rs2.msgNum;
	   // this.state.loginbean=this.session.loginbean;
	
	   	
	   //	console.log("rsok"+rs.ok)
		   	 //if(rs.ok){
		   	 	this.body="<script>alert('删除成功');location.href='/home';</script>";

		   	 	//this.redirect("/home")
		   	// }else{
		   	 	
		   	// }
	   	
	   }else{
	   	//this.body=0
	   	this.body="<script>alert('删除失败')</script>";
	   }
   
});
module.exports = router;
var router = require('koa-router')();
var formidable = require('formidable'); 
 let User = require('../models/UserModel.js'); 
   let Msg = require('../models/msgModel.js'); 
router.prefix('/home');


router.get('/', function *(next) {
	//console.log("home")
	this.state.loginbean=this.session.loginbean
	if(this.session.loginbean.role==0){		
		this.body="<script>alert('没有操作权限');location.href='/';</script>";
		return;
	}
   yield this.render('home', {
   loginbean:this.state.loginbean
   });
});
router.get('/apply', function *(next) {
	
	
   yield this.render('apply', {});
});
router.all('/apply', function *(next) {
		function uploadFile(req,form){
			return new Promise(function(resolve,reject){
		        form.parse(req,function(err,fields,files){
		    	  if(err){ 
		            console.log(err); 
		        } 
		       console.log("aaaaaaaa");
		       console.log( fields)//这里就是post的XXX 的数据 
		       //console.log( files.photo)//这里就是上传的文件,注意,客户端file框必须有name属性 
		       console.log('上传的文件名:'+files.photo.name);//与客户端file同名 
		       console.log('文件路径:'+files.photo.path);
		           resolve({fields:fields,files:files}) 
		       })
		            
		  })
		}
	//将 申请讲师的数据保存入库
function teacherUpload(loginbean,fields,files){
	return new Promise(function(resolve,reject){
		let teacher={};
        teacher.realname=fields.realname;
        teacher.idnumber=fields.idnumber;
        teacher.photoName=files.photo.name;
        teacher.photoPath=(files.photo.path).replace('public/','');
        teacher.preview=fields.preview;
        teacher.role=2;
        User.update({_id:loginbean.id},{$set:teacher},function(err,rs){
			if(err){
				console.log(err);
				return;
			}
			resolve('申请成功');
		});

	})
}
	//let realname = this.request.body['realname'];
  // this.body='realname:'+realname //body 里面必须要有内容，否则返回的是空页面，以204状态码响应
    var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding="utf-8";
    form.uploadDir="./public/images/";
     form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    loginbean=this.session.loginbean;
    //得保证loginbean 能取到值
     if(!loginbean){
    	this.body = '<script>alert("登录过期,请重新登录");location.href="/";</script>';
    	return;
    }
  let rs=yield uploadFile(this.req,form); //接收数据 fields files
  let rs1=yield teacherUpload(loginbean,rs.fields,rs.files);
  this.session.loginbean.role=2;//保存成功后要将角色状态改掉
  
  // (this.req[0]).forEach(function(item){
  // 	  console.log("item:"+item)
  // })
     this.body=rs1;
     console.log("bbbbbbb"); 
});
router.get('/msgList', function *(next) {
	this.session.loginbean.msgNum=0;
	let loginbean=this.session.loginbean;
	this.state.loginbean=loginbean;
	//得保证loginbean 能取到值
     if(!loginbean){
    	this.body = '<script>alert("登录过期,请重新登录");location.href="/";</script>';
    	return;
    }
	let msgNumRs=yield User.update({_id:loginbean.id},{$set:{msgNum:0}});
	let msgrs=yield Msg.find({to:loginbean.id})
	console.log(msgrs)
    yield this.render('msgList', {
       msgrs:msgrs
   });
});
module.exports = router;

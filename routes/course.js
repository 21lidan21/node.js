var router = require('koa-router')();
var formidable = require('formidable'); 
 let User = require('../models/UserModel.js'); 
let Msg = require('../models/msgModel.js'); 
let Course = require('../models/courseModel.js');
let Chapter = require('../models/ChapterModel.js'); 
router.prefix('/course');


router.get('/list', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	// if(loginbean.role!=0){		
	// 	this.body="<script>alert('没有管理员权限');location.href='/';</script>";
	// 	return;
	// }
	let courseRs=yield Course.find({uid:loginbean.id});
	console.log(courseRs)
	   yield this.render('courseList', {
	   loginbean:this.state.loginbean,
	   courseRs:courseRs
	   });
   
});

router.get('/Newcourse', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	// if(loginbean.role!=0){		
	// 	this.body="<script>alert('没有管理员权限');location.href='/';</script>";
	// 	return;
	// }
	   yield this.render('Newcourse', {
	   loginbean:this.state.loginbean
	   });
   
});
//提交创建课程
router.post('/createCourse', function *(next) {
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	
	function uploadFile(req,form){
		return new Promise(function(resolve,reject){
	        form.parse(req,function(err,fields,files){
	    	  if(err){ 
	            console.log(err); 
	        } 
	       //console.log("aaaaaaaa");
	       //console.log( fields)//这里就是post的XXX 的数据 
	       //console.log( files.photo)//这里就是上传的文件,注意,客户端file框必须有name属性 
	       //console.log('上传的文件名:'+files.clogo.name);//与客户端file同名 
	      // console.log('文件路径:'+files.clogo.path);
	           resolve({fields:fields,files:files}) 
	       })
	            
	  })
	}
	
	// if(loginbean.role!=0){		
	// 	this.body="<script>alert('没有管理员权限');location.href='/';</script>";
	// 	return;
	// }
	var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding="utf-8";
    form.uploadDir="./public/images/";
     form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 

    
	let rs=yield uploadFile(this.req,form); //接收数据 fields files
	let course=new Course({});
      
      course.title=rs.fields.title;
      course.type=rs.fields.type;
      course.photoName=rs.files.clogo.name;
      course.photoPath=(rs.files.clogo.path).replace('public/','');
      course.brief=rs.fields.brief;
      course.uid=loginbean.id;
      course.uname=loginbean.nicheng;
      course.status=0;
      course.date=new Date();
      console.log(rs.files.clogo.path);
      console.log((rs.files.clogo.path).replace('public/',''))
      let rs1=yield course.save(function(err,rs){
      	if (err) {
      		console.log("数据库错误"+err)
      	}else{
      		console.log(rs)
      	}
      });
      
      if (rs1._id) {
      	this.body="<script>alert('course success');location.href='./course/list'</script>";
      }else{
      	this.body="failed"
      }
	//yield saveNewcourse(loginbean,rs.fields,rs.files);
	   // yield this.render('Newcourse', {
	   // loginbean:this.state.loginbean
	   // });
   
});
router.get('/chapter', function *(next) {
	let title=this.request.query['title'];
	let cid=this.request.query['cid'];
	let loginbean=this.session.loginbean;
	let uid=loginbean.id;
	 this.state.loginbean=this.session.loginbean;
	// if(loginbean.role!=0){		
	// 	this.body="<script>alert('没有管理员权限');location.href='/';</script>";
	// 	return;
	// }
	
	let count=yield Chapter.count({courseid:cid,uid:uid});
	let countRs=yield Chapter.count({courseid:cid,uid:loginbean.id}); 
	let limit=2;
	console.log("count"+countRs);
	let sumpage=Math.ceil(count/limit);
	let cpage=parseInt(this.request.query['page']);

	let url="/course/chapter?cid="+cid+"&&title="+title ;
	let page=1;
	if(cpage){
		page=cpage;
		console.log("cpage"+cpage)
	}
	if (page<1){
		page=1
	}else if(sumpage!=0&&page>sumpage){
		page=sumpage
	}
	
	let startPoint=(page-1)*limit;
	console.log(startPoint)
	//查找章节
	let rs=yield Chapter.find({courseid:cid,uid:uid}).skip(startPoint).limit(limit);
	console.log("chapterchapterchapter")
	console.log(rs);
	console.log("page"+page)
	   yield this.render('chapter', {
	   loginbean:this.state.loginbean,
	   title:title,
	   cid:cid,
	   rs:rs,
	   url:url,
	   page:parseInt(page),
	   sumpage:parseInt(sumpage),
	   count:count
	   });
   
});

router.post('/createChapter', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	// if(loginbean.role!=0){		
	// 	this.body="<script>alert('没有管理员权限');location.href='/';</script>";
	// 	return;
	// }
	let chapter=new Chapter();
	 chapter.title=this.request.body['title'];
	  chapter.content=this.request.body['content'];
	  chapter.courseid=this.request.body['courseid'];
	  chapter.uid=loginbean.id;
	  //console.log(this.request.body['courseid'])
	  let myurl=this.request.body['myurl'];
	 let chapterRs= yield chapter.save();
	 if(chapterRs){
	 	this.redirect(myurl)
	 	//this.body="<script>alert('chapter success')</script>";
	 	
	 }else{
	 	this.body="chapter err"
	 }
   
});

router.get('/delChapter', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	if(!loginbean){		
		this.body="<script>alert('没有操作权限');location.href='/';</script>";
		return;
	}
	let id=this.request.query['id'];
	let cid=this.request.query['cid'];
	let title=this.request.query['title'];
	//let page=this.request.query['page'];
	let uid=loginbean.id;
	let rs=yield Chapter.remove({_id:id,uid:uid});
	if(rs.ok){
		this.redirect("/course/chapter?cid="+cid+"&&title="+title)
		//this.body="<script>alert('删除成功');location.href='/course/chapter?cid=+"cid"+'&&title='+"title"'+</script>"
	}else{
		this.redirect("/course/chapter?cid="+cid+"&&title="+title)
		
	}
});	
	router.get('/getChapter', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	 let uid=loginbean.id;
	let id=this.request.query['id'];
	console.log(id)
	console.log(uid)

	let rs=yield Chapter.findOne({_id:id,uid:uid});
	console.log(rs)
	if(rs){
		this.body=rs
	}else{
		this.body="查询出错"
	}
   

});
	
router.post('/updChapter', function *(next) {
	
	let loginbean=this.session.loginbean;
	this.state.loginbean=this.session.loginbean;
	let chapterUpd={}
	let uid=loginbean.id;
	let id=this.request.body['id'];
	chapterUpd.title=this.request.body['title'];
	chapterUpd.content=this.request.body['content'];
	let cid=this.request.body['courseid'];
	let myurl=this.request.body['myurl'];
	console.log("id"+id)
	 console.log("cid"+cid)
	 console.log(chapterUpd.title)

	let rs=yield Chapter.update({_id:id,uid:uid},{$set:chapterUpd});
	console.log(rs)
	if(rs){
		
		//url="/course/chapter?cid="+cid+"&&title="+chapterUpd.title ;
         this.redirect(myurl)
	}else{
		this.body="修改出错"
	}
   

});
router.get('/shenhe', function *(next) {
	
	let loginbean=this.session.loginbean;
	 this.state.loginbean=this.session.loginbean;
	 let uid=loginbean.id;
	let id=this.request.query['id'];
	// console.log(id)
	// console.log(uid)

	let rs=yield Course.update({_id:id,uid:uid},{$set:{status:1}});
	console.log(rs)
	if(rs.ok){
		this.redirect("/course/list");
	}else{
		this.body="提交审核出错"
	}
   

});
module.exports = router;
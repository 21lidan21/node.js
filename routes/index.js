var router = require('koa-router')();

router.get('/', function *(next) {
	//根目录下设置
	this.state.loginbean=this.session.loginbean
	console.log(this.session.loginbean)
  yield this.render('index', {
    // title: 'Hello World Koa!'
   loginbean:this.state.loginbean
  });
 // var aa= yield new Promise(function(resolve,reject){
 //  	  setTimeout(function(){
 //  	  	console.log("结果");
 //  	  	resolve("执行结果");
 //  	  },1000)
 //  })
 // console.log(222+aa)
  
});
router.get('/foo', function *(next) {
 this.body = 'this is foo!';
});

module.exports = router;

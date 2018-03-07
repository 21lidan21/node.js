var router = require('koa-router')();


router.get('/', function *(next) {
 this.body = 'this is index1!';
});

module.exports = router;

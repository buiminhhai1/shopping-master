var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('customer/index', { title: 'Express' });
  next();
});

router.get('/login', function(req, res, next) {
  res.render('customer/login', { title: 'Express' });
  next();
});

router.get('/blank', (req,res,next)=>{
  res.render('customer/blank');
  next();
})

module.exports = router;

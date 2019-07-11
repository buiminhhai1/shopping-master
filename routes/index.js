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

router.get('/register', function(req, res, next) {
  res.render('customer/register', { title: 'Express' });
  next();
});

router.get('/cartdetail', (req,res,next)=>{
  res.render('customer/blank');
  next();
})

router.get('/checkout', (req,res,next)=>{
  res.render('customer/checkout');
  next();
})

router.get('/store', (req,res,next)=>{
  res.render('customer/store');
  next();
})

router.get('/product', (req,res,next) =>{
  res.render('customer/product');
  next();
})
module.exports = router;

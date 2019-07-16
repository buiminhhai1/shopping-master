var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', function(req, res, next) {
  res.render('admin/user/userlist');
  next();
});

router.get("/productlist", (req,res,next)=>{
  res.render('admin/product/products');
  next();
});

router.get("/product/:product", (req,res,next) =>{
  res.render("admin/product/productdetail");
  next();
}); 

router.get("/brandlist",(req,res,next)=>{
  res.render("admin/brand/brand");
  next();
});

router.get("/orderlist", (req,res,next) => {
  res.render("/admin/order/orders");
  next();
});

// router order detail

router.get("/salesfigures", (req,res,next)=>{
  res.render("/admin/salesfigures");
  next();
});

router.get("/supplierlist", (req,res,next)=>{
  res.render("admin/supplierlist");
  next();
});
//supplier detail


module.exports = router;


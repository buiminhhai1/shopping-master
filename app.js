var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const multer = require('multer');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

// try to create new schema
const ObjectID = require("mongodb").ObjectID;
const joi = require("joi");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const supplier = joi.object().keys({
  displayName: joi.string(),
  email: joi.string(),
  phone: joi.string(),
  address: joi.string(),
  avatar:joi.string()
});
/////
//


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/admin/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

var uri = "mongodb+srv://admin:admin@cluster0-hs8pp.mongodb.net/ShoppingDB";
mongoose.connect(uri, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database connected, the application listening on port 3003");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

//// try to create supplier

const getPrimaryKey = (_id) => ObjectID(_id);
// render view and show data
app.get("/admin/supplier", (req,res,next) =>{
  res.render("admin/supplier/supplierlist");
});
// read admin/getSupplier?pageNo=<value>&size=<value>
app.get("/admin/getSupplier", (req,res) =>{
  let pageNo = parseInt(req.query.pageNo);
  let size = parseInt(req.query.size);
  let query = {};
  if(pageNo< 0 || pageNo ===0 ){
    pageNo = 1;  
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  db.collection("Supplier").find({},query).toArray((err,documents) =>{
    if(err){
      console.log("error get supplier " + err);
    } else {
      res.json(documents);
    }
  });
})

// read one by id 
app.get("/admin/supplier/:id", (req,res,next)=> {
  const idSupplier = req.params.id;
  db.collection("Supplier").findOne(ObjectID(idSupplier),(err,result)=>{
    res.json(result);
    console.log("value " + result);
   
  })
})
// Create supplier
app.post("/admin/supplier",upload,(req,res,next) =>{
    console.log("acces appjs!!!!!!!!!!!");
    
    const objSupplier = JSON.parse(req.body.data);
    
    if(req.file){
      objSupplier.avatar =  req.file.filename; 
    }
    console.log(objSupplier);

    joi.validate(objSupplier,supplier, (err,result) =>{
      if(err){
        const error = new Error("Invalid Input");
        error.status = 400;
        next(error);
      }else{
        db.collection("Supplier").insertOne(objSupplier,(err,result)=> {
          if(err){
            const error = new Error("failed to insert supplier document");
            error.status = 400;
            next(error);
          }else {
            res.json({result: result, document: result.ops[0], msg: "Success to insert suppier"});
            console.log("create supplier docment success");      
          }
        });
      }
    })

});
// Update supplier 
app.put("/admin/supplier/:id",upload, (req,res) =>{
  const supplierID = req.params.id;

  const supplierInput = JSON.parse(req.body.data);

    if(req.file){
      supplierInput.avatar =  req.file.filename; 
    }
  console.log(supplierInput);
  
  // Find document by Id and Update 
  db.collection("Supplier").findOneAndUpdate({_id: getPrimaryKey(supplierID)},
  {$set: {avatar:supplierInput.avatar, displayName: supplierInput.displayName, email: supplierInput.email, phone: supplierInput.phone, address: supplierInput.address}},
  {returnOriginal: false}, 
  (err,result) =>{
    if(err){
      console.log("update error " + err);
    }else {
      res.json(result);
    }
  });
});

app.delete("/admin/supplier/:id", (req,res) =>{
  // get primary key of supplier
  const supplierID = req.params.id;
  // find Docment by Id and delete document from record
  db.collection("Supplier").findOneAndDelete({_id: getPrimaryKey(supplierID)},
  (err,result) => {
    if(err)
      console.log("err delete is " + err)
      else 
      res.json(result);
  });
});




////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

// try to create new schema
const ObjectID = require("mongodb").ObjectID;
const joi = require("joi");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

const supplier = joi.object().keys({
  displayName: joi.string(),
  email: joi.string(),
  phone: joi.string(),
  address: joi.string()
});
/////
//mongodb+srv://admin:admin@cluster0-hs8pp.mongodb.net/ShoppingDB

var uri = "mongodb://localhost:27017/ShoppingDB";
mongoose.connect(uri, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database connected, the application listening on port 3003");
});


// //test write to database
// db.collection("User").insert(  {id : "1"} 

//     , function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });

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
// read
app.get("/admin/getSupplier", (req,res) =>{
  db.collection("Supplier").find({}).toArray((err,documents) =>{
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
app.post("/admin/supplier",(req,res,next) =>{
    
    const objSupplier = req.body;
  
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
app.put("/admin/supplier/:id", (req,res) =>{
  const supplierID = req.params.id;

  const supplierInput = req.body;
  
  // Find document by Id and Update 
  db.collection("Supplier").findOneAndUpdate({_id: getPrimaryKey(supplierID)},
  {$set: {displayName: supplierInput.displayName, email: supplierInput.email, phone: supplierInput.phone, address: supplierInput.address}},
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

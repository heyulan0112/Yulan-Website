
var express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const mysql = require("mysql");
var router  = express.Router();
const app = express();
app.use(express.static("public"));

// Personal Web Page
app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.html",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

//Jas Eating-Snake
app.get("/snake.html",function(req,res){
  res.sendFile(__dirname + "/snake.html");
});

// Jas Bubble Shooter
app.get("/hellobubble.html",function(req,res){
  res.sendFile(__dirname + "/hellobubble.html");
});

// LiBrain Display page
app.get("/library.html", function(req,res){
  res.sendFile(__dirname + "/library.html");
});

// let connectInfo = mysql.createConnection({
//   host:'localhost',
//   port: 3306,
//   user:'root',
//   password:'123456',
//   database:'wow'
// });
//
// const pool = mysql.createPool({
//   host:'localhost',
//   port: 3306,
//   user:'root',
//   // password:'123456',
//   database:'mysql'
// });
//
// pool.getConnection(function(err,connection){
//
// });


// var conn = pool.getConnection(function(err,conn){
//   if(err){
//     callback(err,null,null);
//   }
//   else{
//     conn.query(sql,function(err,results,fields){
//       callback(err,results,fields);
//     });
//     conn.release();
//   }
// });
//
// connectInfo.connect();

//JasCar
// Mongoose version
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://jasmine:jasmine123456@cluster0.ugqojny.mongodb.net/JasCarDB",{useNewUrlParser: true});

const VehicleClassSchema = new mongoose.Schema({
  over_mileage_fee: Number,
  rental_rate: Number,
  class_name: String
});
const VehicleClass = mongoose.model('VehicleClass',VehicleClassSchema,'VehicleClass');

const OfficeSchema = new mongoose.Schema({
  country: String,
  state: String,
  street: String,
  unit: String,
  zipcode: String,
  phone_number: String,
  city: String
});
const Office = mongoose.model('Office',OfficeSchema,'Offices');

const VehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Date,
  vin: String,
  lic_plt_num: String,
  class: String,
  available: String,
  office_id: OfficeSchema
});
const Vehicle = mongoose.model('Vehicle',VehicleSchema,'Vehicles');

const OngoingOrderSchema = new mongoose.Schema({
  customer_id: Number,
  pickup_address: String,
  pickup_date: String,
  vin: String,
  start_odometer: Number,
  daily_odometer: Number,
  payment_method: String,
  card_number: String,
  card_holder: String,
  expiry_date: Date,
  cvc: String
});

const OngoingOrder = mongoose.model('OngoingOrder',OngoingOrderSchema,'ongoingorders');

const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  password: String
});
const Employee = mongoose.model('Employee',EmployeeSchema,'Employees');

const OrderSchema = new mongoose.Schema({
  pickup_date: String,
  dropoff_date: String,
  start_odometer: Number,
  end_odometer: Number,
  daily_odometer: Number,
  vin: String,
  customer_id: Number
});

const Order = mongoose.model('Order',OrderSchema);

const InvoiceSchema = new mongoose.Schema({
  invoice_date: String,
  invoice_amount: Number,
  order: OrderSchema
});

const Invoice = mongoose.model('Invoice',InvoiceSchema);

const PaymentSchema = new mongoose.Schema({
  payment_method: String,
  card_number: String,
  card_holder: String,
  expiry_date: Date,
  cvc: String,
  invoice: InvoiceSchema
});

const Payment = mongoose.model('Payment',PaymentSchema);

// schema is template for all docs in this collection
// create
// const VehicleTypeSchema = new mongoose.Schema({
//   name:{
//     type: String,
//     required:[true, "no type name"]
//   }
// });
//
// const Type = mongoose.model("Type",VehicleTypeSchema);
// const type1 = new type1({
//   name: "SUV"
// });
//
//
// const VehicleSchema = new mongoose.Schema({
//   // Number String, ...
//   make: {
//     type: String,
//     // like mandatory field
//     required:[true, "no vehicle make"]
//   },
//   rating:{
//     type: Number,
//     // this field value has a range
//     min: 1,
//     max: 10
//   },
//   // this is like a foreign key
//   vehicleType: VehicleTypeSchema
// });
//
// // create a new collection called vehicles in VehicleSchema, MongoDB will trans singular form to multiple form
// // model is collection
// const Vehicle = mongoose.model("Vehicle",VehicleSchema);
// // insert
// const v1 = new Vehicle({
//   make: "Audi",
//   vehicleType: type1
// });
//
// const v2 = new Vehicle({
//   make: "BMW",
//   vehicleType: type1
// });
//
// Vehicle.insertMany([v1,v2],function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("successfully saved");
//   }
// });
//

// Find Vehicles by mongoose
// return all vehicle docs in Vehicle collection
// Vehicle.find(finction(err,vehicles){
//   if(err){
//     console.log(err);
//   }
//   else{
//     // console.log(vehicles);
//     // once done then close connection by this line
//     // mongoose.connection.close();
//     // Traverse query result
//     vehicles.forEach(function(v){
//       console.log(v.make);
//     });
//   }
// });
//
// // Update by mongoose
// Vehicle.updateOne({_id:"..."},{make:"Posche"}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("successfully updated");
//   }
// });
//
// // Delete by Mongoose
// Vehicle.deleteOne({_id:"..."}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("successfully deleted");
//   }
// });
//
// Vehicle.deleteMany({make:"..."},function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("successfully deleted many docs");
//   }
// });

// Establish a relationship


// v1.save(); should run once otherwise this function will save v1 into Vehicle once and once again

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const url = 'mongodb://localhost:27017';
// const dbName = 'JasCarDB';
// const client = new MongoClient(url, {useNewUrlParser: true});
// client.connect(function(err){
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   // insert data but can be modify here
//   findDocuments(db,function(){
//       client.close();
//   });
// });
//
// app.use(bodyParser.urlencoded({extended:true}));
//
// // MongoDB operation
// const insertDocuments = function(db,callback) {
//   const collection = db.collection("vehicles");
//   collection.insertMany([
//     // insert some data here, has a field named 'a'
//     {a : 1},
//     {a : 2},
//     {a : 3}
//   ], function(err,result){
//     assert.equal(err,null);
//     assert.equal(3,result.result.n);
//     assert.equal(3,result.ops.length);
//     console.log("Inserted 3 documents into collection");
//     callback(result);
//   });
// }
//
// const findDocuments = function(db,callback){
//   const collection = db.collection('vehicles');
//   collection.find({}).toArray(function(err, vehicles)){
//     assert.equal(err,null);
//     console.log(vehicles);
//     callback(vehicles);
//   }
// }

app.get("/",function(req,res){
  res.sendFile(__dirname + "/homepage.html");
});

app.get("/homepage.html",function(req,res){
  res.sendFile(__dirname + "/homepage.html");
});

app.get("/login.html",function(req,res){
  res.sendFile(__dirname + "/login.html");
});

app.post("/login.html",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  const url = "https://us11.api.mailchimp.com/3.0/lists/c168d18af8/members";
  const options = {
    method: "GET",
    auth:"yulan:8bdbfe1f518fd3dcf7e8c6ae64a88218-us11"
  }

  var get = https.get(url,options,function(response){
    response.on("data",function(jsondata){
      const memberdata = JSON.parse(jsondata);
      var members = memberdata.members;
      var flag = false;
      for (var i=0;i<members.length;i++){
        if(members[i].merge_fields.USER == username && members[i].merge_fields.PWD == password){
          flag = true;
          break;
        }
      }
      console.log(flag);
      if(flag === true){
        window.sessionStorage.setItem('username', username);
        res.redirect("/rent.html");
      }
      else{
        res.redirect("/login.html");
      }
    })
  })
});

app.get("/explore.html",function(req,res){
  res.sendFile(__dirname + "/explore.html");
});

app.post("/getcar",function(req,res){
  Vehicle.find(function(err,result){
    if(err){
      console.log(err);
    }
    else{
      var pics = ["image/72-721371_bmw-m3-hd-png-download.png"];
      res.json(result);
    }
  });
});

app.get("/payment.html",function(req,res){
  res.sendFile(__dirname + "/payment.html");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.post("/checkout",function(req,res){
  // var username = req.body.username;
  var vin = req.body.vin;
  var payment_method = req.body.payment_method;
  var card_number = req.body.card_number;
  var card_holder = req.body.card_holder;
  var expiry_date = req.body.expiry_date;
  var cvc = req.body.cvc;
  var date = new Date();
  var pickup_date = String(date.getFullYear()) + "-" + String(date.getMonth()+1) + "-" + String(date.getDate());
  var customer_id = 1;
  var pickup_address = "Hundson Street Unit 203, Manhattan, NY, 11211";
  var start_odometer = 0;
  var daily_odometer = 500;
  // update car to be not available
  Vehicle.updateOne({vin:vin},{available:"no"},function(err){
    if(err){
      console.log(err);
      alert(err);
    }
    else{
      console.log("successfully update car to be not available.");
    }
  })
  // insert into on-going order collection
  const order = new OngoingOrder({
    customer_id: customer_id,
    pickup_address: pickup_address,
    pickup_date: pickup_date,
    vin: vin,
    start_odometer: start_odometer,
    daily_odometer: daily_odometer,
    payment_method: payment_method,
    card_number: card_number,
    card_holder: card_holder,
    expiry_date: expiry_date,
    cvc: cvc
  });
  order.save(function(err){
    if(err){
      console.log(err);
      alert(err);
    }
    else{
      console.log("successfully insert on-going order.");
      res.redirect('/paymentSuccess.html');
    }
  });
});

app.get("/paymentSuccess.html",function(req,res){
  res.sendFile(__dirname + "/paymentSuccess.html");
});

app.get("/employeeLogin.html",function(req,res){
  res.sendFile(__dirname + "/employeeLogin.html");
});

app.get("/employee.html",function(req,res){
  res.sendFile(__dirname + "/employee.html");
});

app.post("/staffLogin",function(req,res){
  var employee_id = req.body.employeeid;
  var password = req.body.password;
  Employee.find({employee_id:employee_id, password:password},function(err,result){
    if(err){
      console.log(err);
      res.send("Error!");
    }
    else{
      if(result.length == 0){
        console.log("Employee login information incorrect");
        res.redirect('/employeeLogin.html');
      }
      else{
        console.log("Employee login success!");
        res.redirect('/employee.html');
      }
    }
  });
});

app.post("/employeeFindCar",function(req,res){
  var vin = req.body.vin;
  Vehicle.find({vin:vin},function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log("Query Success");
      res.json(result);
    }
  });
});

function getDaysBetween(startDate, enDate) {
  const sDate = Date.parse(startDate)
  const eDate = Date.parse(enDate)
  if (sDate > eDate) {
    return 0
  }
  if (sDate === eDate) {
    return 1
  }
  const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

app.get('/returnSuccess.html',function(req, res){
  res.sendFile(__dirname + "/returnSuccess.html");
});

app.post("/returncar",function(req,res){
  var vin = req.body.vin;
  var end_odometer = req.body.end_odometer;
  var date = new Date();
  var dropoff_date = String(date.getFullYear()) + "-" + String(date.getMonth()+1) + "-" + String(date.getDate());
  Vehicle.updateOne({vin:vin},{available:"yes"},function(err){
    if(err){
      console.log(err);
      res.end();
    }
    else{
      console.log("update available success");
    }
  });

  OngoingOrder.findOne({vin:vin},function(err,result){
    if(err){
      console.log(err);
      // Actually it should rollback
      res.end();
    }
    else{

      if(result != null){
        const order = new Order({
          pickup_date: result.pickup_date,
          dropoff_date: dropoff_date,
          start_odometer: result.start_odometer,
          end_odometer: parseFloat(end_odometer),
          daily_odometer: result.daily_odometer,
          vin: vin,
          customer_id: result.customer_id
        });

        order.save(function(err){
          if(err){
            console.log(err);
            res.end();
          }
          else{
            console.log("Insert new finished order success.");
          }
        });

        var days = getDaysBetween(result.pickup_date,dropoff_date);
        var limitation = days * result.daily_odometer;
        var total_o = parseFloat(end_odometer) - result.start_odometer;

        if(total_o > limitation){
          total_o = total_o - limitation;
        }
        else{
          total_o = 0;
        }

        Vehicle.findOne({vin:vin},function(err,vehicle){
          if(err){
            console.log(err);
          }
          else{
            console.log("vehicle:"+vehicle);
            VehicleClass.findOne({class_name:vehicle.class},function(err,vclass){
              console.log("vclass:"+vclass);
              if(err){
                console.log(err);
              }
              else{
                // console.log("vclass:"+vehicle.class);
                var over_mileage_fee = parseFloat(vclass.over_mileage_fee);
                var rental_rate = parseFloat(vclass.rental_rate);
                var amount = rental_rate * days + total_o * over_mileage_fee;
                const invoice = new Invoice({
                  invoice_date: dropoff_date,
                  invoice_amount: amount,
                  order: order
                });

                invoice.save(function(err){
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log("Generate invoice success.");
                  }
                });

                const payment = new Payment({
                  payment_method: result.payment_method,
                  card_number: result.card_number,
                  card_holder: result.card_holder,
                  expiry_date: result.expiry_date,
                  cvc: result.cvc,
                  invoice: invoice
                });
                payment.save(function(err){
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log("Generate payment record success.");
                  }
                });

                OngoingOrder.deleteOne({vin:vin},function(err){
                  if(err){
                    console.log(err);
                    res.end();
                  }
                  else{
                    console.log("Ongoing order delete success.");
                    alert("Return Success.");
                  }
                });
              }
            });
          }
        });
      }
    }
  });
  // res.redirect('/returnSuccess.html');
});

app.get("/vehicleEdit.html",function(req,res){
  res.sendFile(__dirname + "/vehicleEdit.html");
});

app.post("/caredit",function(req,res){
  var vin = req.body.vin;
  var editinfo = req.body.editinfo;
  var newinfo = req.body.newinfo;
  if(editinfo == "make"){
    Vehicle.updateOne({vin:vin},{make:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "model"){
    Vehicle.updateOne({vin:vin},{model:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "year"){
    Vehicle.updateOne({vin:vin},{year:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "vehicle indentification"){
    Vehicle.updateOne({vin:vin},{vin:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "license plate number"){
    Vehicle.updateOne({vin:vin},{lic_plt_num:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "vehicle class"){
    Vehicle.updateOne({vin:vin},{class:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
        // alert("vehicle information update success.");
      }
      res.end();
    });
  }
  else if(editinfo == "available status"){
    Vehicle.updateOne({vin:vin},{available:newinfo},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("vehicle information update success.");
        res.send("vehicle information update success.");
      }
      res.end();
    });
  }
  // console.log(vin);
  // console.log(editinfo);
  // console.log(newinfo);
});

app.post("/explore.html",function(req,res){
  Vehicle.find(function(err,result){
    if(err){
      console.log(err);
    }
    else{
      var pics = ["image/72-721371_bmw-m3-hd-png-download.png"];
      res.json(result);
      res.send();
    }
  });
});

app.get("/about.html",function(req,res){
  res.sendFile(__dirname + "/about.html");
});

app.get("/register.html",function(req,res){
  res.sendFile(__dirname + "/register.html");
});

app.get("/register",function(req,res){
  res.sendFile(__dirname + "/register-success.html");
});

app.post("/register.html",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const middlename = req.body.middlename;
  const license = req.body.license;
  const insurence = req.body.insurence;
  const insurencenumber = req.body.insurencenumber;
  const email = req.body.email;
  const phone = req.body.phonenumber;

  const cooperatename = req.body.cooperatename;
  const registernumber = req.body.registernumber;
  const employeeid = req.body.employeeid;
  const country = req.body.country;
  const state = req.body.state;
  const city = req.body.city;
  const street = req.body.street;
  const unit = req.body.unit;
  const zipcode = req.body.zipcode;

  //post
  const data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          USER: username,
          PWD: password,
          PHONE: phone,
          FNAME: firstname,
          LNAME: lastname,
          MNAME: middlename,
          LICENSE: license,
          INSURENCE: insurence,
          POLICY: insurencenumber,
          COOPERATE: cooperatename,
          REGISTER: registernumber,
          EMPLOYEE: employeeid,
          COUNTRY: country,
          STATE: state,
          CITY: city,
          STREET: street,
          UNIT: unit,
          ZIPCODE: zipcode
        }
      }
    ]
  };

  const jsondata = JSON.stringify(data);
  const url = "https://us11.api.mailchimp.com/3.0/lists/c168d18af8";
  const options = {
    method: "POST",
    auth:"yulan:8bdbfe1f518fd3dcf7e8c6ae64a88218-us11"
  }
  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsondata);
  request.end();

  if(res.statusCode === 200){
    res.redirect("/register");
  }
  else{
    alert("Please Check Your Information Again.");
  }
});

app.get("/rent.html",function(req,res){
  res.sendFile(__dirname + "/rent.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});

// API keyframes
// 8bdbfe1f518fd3dcf7e8c6ae64a88218-us11

//List ID
// c168d18af8

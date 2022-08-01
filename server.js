
var express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const mysql = require("mysql");
var router  = express.Router();
const app = express();
app.use(express.static("public"));

//Jas Eating-Snake
app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.html",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/snake.html",function(req,res){
  res.sendFile(__dirname + "/snake.html");
});


//JasCar


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
app.use(bodyParser.urlencoded({extended:true}));

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

//
// app.get("/rent.html",function(req,res){
//   res.sendFile(__dirname + "/rent.html");
//   // var query = pool.getConnection(function(err,connection){
//   //
//   // });
//
//
//   // var pagenum = 2;
//   // var page = 0;
//   // if(req.query.page!=undefined){
//   //     page=parseInt(req.query.page)-1;
//   // }
//   // console.log("page="+page);
//   // var sql="select * from sjd_vehicles limit "+page*pagenum+"," + pagenum;
//   // var sql2="select * from sjd_vehicles";
//   // var count=0;
//   // var conn = pool.getConnection(function(err,conn){
//   //   if(err){
//   //     callback(err,null,null);
//   //   }
//   //   else{
//   //     // record total lines in this table.
//   //     conn.query(sql2,function(err,results,fields){
//   //       if(result.length % pagenum != 0){
//   //           count = parseInt(result.length/pagenum+1);
//   //       }
//   //       else{
//   //           count = parseInt(result.length/pagenum);
//   //       }
//   //       console.log("Length=" + count);
//   //     });
//   //
//   //     conn.query(sql,function(err,result,fields){
//   //       if(err){
//   //         return "Fail";
//   //       }
//   //       console.log(result);
//   //       var nums=new Array();
//   //       for(var i=1;i<=count;i++){
//   //           nums.push(i);
//   //       }
//   //       console.log("Page No.="+nums);
//   //       res.render('index.html',{
//   //           students: result,
//   //           nums:nums,
//   //           page:page
//   //       });
//   //     })
//   //
//   //   }
//   // });
// });

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});

// API keyframes
// 8bdbfe1f518fd3dcf7e8c6ae64a88218-us11

//List ID
// c168d18af8

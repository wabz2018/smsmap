 const express = require('express');
 const path = require('path');
 const ejs = require('ejs');
 const bodyParser = require('body-parser');
 const multer = require('multer');
 const mysql = require('mysql');
 const connection = require('./config');
 const cors = require('cors');
 const fs = require('fs');
 const fastcsv = require('fast-csv');

 //file stream
 //constants
 const port = 2500;
 let staticBasePath = './static';

 const app = express();
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 app.use(bodyParser.json({
   limit: "50mb"
 }));
 app.use(bodyParser.urlencoded({
   limit: "50mb",
   extended: true,
   parameterLimit: 50000
 }));
 app.set('public', path.join(__dirname, 'public'));
 app.use('/uploads', express.static('uploads'));
 app.use('/images', express.static('images'));

 // parse requests of content-type - application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({
   extended: true
 }));

 app.use(cors());

//email

const sendgridapikey='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';
const sgMail = require('@sendgrid/mail');
//sms


 //controllers 
 let authenticateController = require('./controllers/authenticate-controller');
 let registerController = require('./controllers/register-controller');
 let addschoolcontroller = require('./controllers/addschool-controller');
 let addcompanycontroller=require('./controllers/addcompany-controller');

 app.post('/api/register', registerController.register);
 app.post('/api/authenticate', authenticateController.authenticate);
 app.post('/api/addschool', addschoolcontroller.addschool);
 app.post('/api/addcompany', addcompanycontroller.addcompany);

 app.post('/controllers/authenticate-controller', authenticateController.authenticate);
 app.post('/controllers/register-controller', registerController.register);
 app.post('/controllers/addschool-controller', addschoolcontroller.addschool);
 app.post('/controllers/addcompany-controller',addcompanycontroller.addcompany);
 //views 
 app.get('/', function (req, res) {
   res.sendFile(__dirname + '/' + "login.html");
 });

 //register
 app.get('/register', function (req, res) {
   res.render('register', {
     title: 'SMS | Solution',
     hd: 'ADD USER '
   });
 });

 app.get('/users', (req, res) => {
   let sql = "SELECT * FROM users";
   connection.query(sql, (err, rows) => {
     if (err) throw err;
     res.render('users', {
       title: 'SMS |Solution',
       hd: 'REGISTERED USERS',
       users: rows
     });
   });
 });

 app.get('/edit/:userId',(req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from users where id = ${userId}`;
  connection.query(sql,(err, result) => {
      if(err) throw err;
      res.render('useredit', {
          title :'SMS | Solution',
          hd:'EDIT USER',
          user : result[0]
      });
  });
});
app.post('/update',(req, res) => {
  const userId = req.body.id;
  let sql = "update users SET firstname='"+req.body.firstname+"',  lastname='"+req.body.lastname+"',  phonenumber='"+req.body.phonenumber+"' where id ="+userId;
 connection.query(sql,(err, result) => {
      if(err) throw err;
      res.redirect('/users');
  });
});

app.get('/delete/:userId',(req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from users where id = ${userId}`;
   connection.query(sql,(err, result) => {
      if(err) throw err;
      res.redirect('/users');
  });
});
 //add customer
 app.get('/addcustomer', function (req, res) {
   res.render('addcustomer', {
     title: 'SMS | Solution',
     hd: 'ADD CUSTOMER'
   });
 });
 //add student
 app.get('/addstudent', function (req, res) {
   res.render('addstudent', {
     title: 'SMS | Solution',
     hd: 'ADD STUDENT'
   });
 });
 //add teacher
 app.get('/addteacher', function (req, res) {
   res.render('addteacher', {
     title: 'SMS | Solution',
     hd: 'ADD TEACHER'
   });
 });
 app.get('/addcompany', (req, res) => {
   res.render('addcompany', {
     title: 'SMS |Solution',
     hd: 'ADD COMPANY'
   });
 });
 app.get('/companys', (req, res) => {
   let sql = "SELECT * from companydetails";
   connection.query(sql, (err, rows) => {
     if (err) throw err;
     res.render('companys', {
       title: 'SMS | Solution',
       hd: 'REGISTERED COMPANIES',
       companies: rows
     })
   });
 });
 //add school
 app.get('/addschool', function (req, res) {
   res.render('addschool', {
     title: 'SMS | Solution',
     hd: 'ADD SCHOOL'
   });
 });
 //view schools
 app.get('/schools', function (req, res) {
   let sql = "SELECT * FROM schooldetails";
   connection.query(sql, (err, rows) => {
     if (err) throw err;
     res.render('schools', {
       title: 'SMS | Solution',
       hd: 'REGISTERED SCHOOLS',
       schools: rows
     });
   });
 });
 //add term
 app.get('/addterm', function (req, res) {
   res.render('addterm', {
     title: 'SMS | Solution',
     hd: 'ADD TERM'
   });
 });

 //add class
 app.get('/addclass', function (req, res) {
   res.render('addclass', {
     title: 'SMS | Solution',
     hd: 'ADD CLASS'
   });
 });
 //summary
 app.get('/summary', function (req, res) {
   res.render('summary', {
     title: 'SMS | Solution',
     hd: 'SUMMARY'
   });
 });
 app.get('/home', function (req, res) {
   let numsch='',numcomp='', numstudent='', numteachers='', numcampaigns='';
   let sql="SELECT * from schooldetails";
   connection.query(sql,(err, result)=>{
     if(err)throw err;
     numsch=result.length;
 let sql2="select * from companydetails";
 connection.query(sql2,(err,result)=>{
if(err)throw err;
numcomp=result.length;
    res.render('home', {
      title: 'SMS | Solution',
      hd: 'SUMMARY DASHBOARD',
      schools:numsch,
      companies : numcomp,
      campaigns: 3,
      teachers:4,
      students:3400,
      messages:45,
      offers:4500
   });
  });
  });
 });


 app.get('/dashboard', function (req, res) {
   res.render('dashboard', {
     title: 'SMS Dashboard',
     hd: 'Main Panel'
   })
 });
 //list schools
 //list companies
 //list campaigns
 function checklistedloginid() {
 }

 function generateterms() {
 }

 function generateschoolcodes() {
 }

 function generateStudentID() {
 }

 function generateteacherid() {
 }

 function generatesmscode() {
   let smstypes = ['Alert', 'Notification', 'Campaign', 'Message', 'Receipt'];
   for (let i = 0; i < smstypes.length; i++) {
     console.log("type is :" + smstypes[i]);
   }
   return smstypes;
 }
 app.post('/messagecategory', function (req, res) {
   let fileLoc = path.resolve(staticBasePath);
   fileLoc = path.join(fileLoc, req.body.file);
   let stream = fs.createReadStream(fileLoc);
   let csvData = [];
   let csvStream = fastcsv
     .parse()
     .on("data", function (data) {
       csvData.push(data);
     })
     .on("end", function () {
       // remove the first line: header
       csvData.shift();
       const connection = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "",
         database: "simap"
       });
       // open the connection
       connection.connect(error => {
         if (error) {
           console.error(error);
         } else {
           let query =
             "INSERT INTO messagecategory (id, type, description, class, charge) VALUES ?";
           connection.query(query, [csvData], (error, response) => {
             console.log(error || response);
           });
         }
       });
     });
   stream.pipe(csvStream);
   res.render('home', {
     title: 'SMS | Solution',
     hd: 'Upload Panel '
   });

 });
 app.post('/bulkcategory', function (req, res) {
   let fileLoc = path.resolve(staticBasePath);
   fileLoc = path.join(fileLoc, req.body.file);
   let stream = fs.createReadStream(fileLoc);
   let csvData = [];
   let csvStream = fastcsv
     .parse()
     .on("data", function (data) {
       csvData.push(data);
     })
     .on("end", function () {
       // remove the first line: header
       csvData.shift();
       const connection = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "",
         database: "simap"
       });
       // open the connection
       connection.connect(error => {
         if (error) {
           console.error(error);
         } else {
           let query =
             "INSERT INTO category (id, name, description, created_at) VALUES ?";
           connection.query(query, [csvData], (error, response) => {
             console.log(error || response);
           });
         }
       });
     });
   stream.pipe(csvStream);
   res.render('home', {
     title: 'SMS | Solution',
     hd: 'Upload Panel '
   });

 });

app.get('/sendemail',(req, res)=>
{
sgMail.setApiKey(sendgridapikey);
const msg = {
  from: 'vincent.wabwoba18@gmail.com',
  to: 'betapps2020@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
});


//bulk email 
app.get('/sendbulkemails', (req, res)=>{
  sgMail.setApiKey(sendgridapikey);
  let sql="SELECT * from emails where status='send'";
  connection.query(sql, (err, rows, fields)=>{
 if(err) throw err;
 for(let i in rows)
 {
   const email={
     from:'vincent.wabwoba18@gmail.com',
     to:rows[i].email,
     subject:'Bulk Email',
     text: rows[i].message,
     html:rows[i].message
   };
   sgMail.send(email,(err, results)=>{
     if(err) {console.log("Error occured"+err);}
     else{console.log("Email sent");}
   });
   let sql2='update emails set status="sent" where id="'+rows[i].id+'"';
   connection.query(sql2, (err, result)=>{
     if(err) throw err;
   });
   console.log("Email sent to:" +rows[i].email);
 }
  });
});
 app.listen(port, () => {
   console.log('server running on port:' + port);
 });

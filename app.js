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
 const session = require('express-session');

 const port = 2500;
 let staticBasePath = './static';
 //file stream
 //constants
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

 app.use(bodyParser.urlencoded({
   extended: true
 }));
 app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
 }));
 //email

 const sendgridapikey = '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';
 const sgMail = require('@sendgrid/mail');
 //sms
 //controllers 
 let authenticateController = require('./controllers/authenticate-controller');
 let registerController = require('./controllers/register-controller');
 let addschoolController = require('./controllers/addschool-controller');
 let addcompanyController = require('./controllers/addcompany-controller');
 let addclassController = require('./controllers/addclass-controller');

 app.post('/api/register', registerController.register);
 app.post('/api/authenticate', authenticateController.authenticate);
 app.post('/api/addschool', addschoolController.addschool);
 app.post('/api/addcompany', addcompanyController.addcompany);
 app.post('/api/addclass', addclassController.addclass);

 app.post('/controllers/authenticate-controller', authenticateController.authenticate);
 app.post('/controllers/register-controller', registerController.register);
 app.post('/controllers/addschool-controller', addschoolController.addschool);
 app.post('/controllers/addcompany-controller', addcompanyController.addcompany);
 app.post('/controllers/addclass-controller', addclassController.addclass);
 //views 

 app.get('/', function (req, res) {
   res.sendFile(__dirname + '/' + "login.html");
 });
 //render auth
 app.post('/auth', (req, res) => {
   let username = req.body.username;
   let password = req.body.password;
   if (username && password) {
     connection.query('SELECT * FROM users WHERE username = ?  AND password = ?', [username, password], (error, results, fields) => {
       if (results.length > 0) {
         req.session.loggedin = true;
         req.session.username = username;
         res.redirect('/dashboard');
       } else {
         res.send('Incorrect Username and/or Password!');
       }
       res.end();
     });
   } else {
     res.send('Please enter Username and Password!');
     res.end();
   }
 });
 app.get('/register', (req, res) => {
   if (req.session.loggedin) {
     res.render('register', {
       title: 'SMS | Solution',
       hd: 'ADD USER '
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });

 app.get('/users', (req, res) => {
   if (req.session.loggedin) {
     let sql = "SELECT * FROM users";
     connection.query(sql, (err, rows) => {
       if (err) throw err;
       res.render('users', {
         title: 'SMS |Solution',
         hd: 'REGISTERED USERS',
         users: rows
       });
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });

 app.get('/edit/:userId', (req, res) => {
   if (req.session.loggedin) {
     const userId = req.params.userId;
     let sql = `Select * from users where id = ${userId}`;
     connection.query(sql, (err, result) => {
       if (err) throw err;
       res.render('useredit', {
         title: 'SMS | Solution',
         hd: 'EDIT USER',
         user: result[0]
       });
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 app.post('/update', (req, res) => {
   if (req.session.loggedin) {
     const userId = req.body.id;
     let sql = "update users SET firstname='" + req.body.firstname + "',  lastname='" + req.body.lastname + "',  phonenumber='" + req.body.phonenumber + "' where id =" + userId;
     connection.query(sql, (err, result) => {
       if (err) throw err;
       res.redirect('/users');
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });

 app.get('/delete/:userId', (req, res) => {
   if (req.session.loggedin) {
     const userId = req.params.userId;
     let sql = `DELETE from users where id = ${userId}`;
     connection.query(sql, (err, result) => {
       if (err) throw err;
       res.redirect('/users');
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add customer
 app.get('/addcustomer', function (req, res) {
   if (req.session.loggedin) {
     res.render('addcustomer', {
       title: 'SMS | Solution',
       hd: 'ADD CUSTOMER'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add student
 app.get('/addstudent', function (req, res) {
   if (req.session.loggedin) {
     res.render('addstudent', {
       title: 'SMS | Solution',
       hd: 'ADD STUDENT'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add teacher
 app.get('/addteacher', function (req, res) {
   if (req.session.loggedin) {
     res.render('addteacher', {
       title: 'SMS | Solution',
       hd: 'ADD TEACHER'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 app.get('/addcompany', (req, res) => {
   if (req.session.loggedin) {
     res.render('addcompany', {
       title: 'SMS |Solution',
       hd: 'ADD COMPANY'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 app.get('/companys', (req, res) => {
   if (req.session.loggedin) {
     let sql = "SELECT * from companydetails";
     connection.query(sql, (err, rows) => {
       if (err) throw err;
       res.render('companys', {
         title: 'SMS | Solution',
         hd: 'REGISTERED COMPANIES',
         companies: rows
       })
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add school
 app.get('/addschool', function (req, res) {
   if (req.session.loggedin) {
     res.render('addschool', {
       title: 'SMS | Solution',
       hd: 'ADD SCHOOL'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //view schools
 app.get('/schools', function (req, res) {
   if (req.session.loggedin) {
     let sql = "SELECT * FROM schooldetails";
     connection.query(sql, (err, rows) => {
       if (err) throw err;
       res.render('schools', {
         title: 'SMS | Solution',
         hd: 'REGISTERED SCHOOLS',
         schools: rows
       });
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add term
 app.get('/addterm', function (req, res) {
   if (req.session.loggedin) {
     res.render('addterm', {
       title: 'SMS | Solution',
       hd: 'ADD TERM'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //add class
 app.get('/addclass', (req, res) => {
   if (req.session.loggedin) {
     let sql = "Select schoolcode, schoolname from schooldetails";
     connection.query(sql, (err, rows) => {
       if (err) throw err;
       res.render('addclass', {
         title: 'SMS | Solution',
         hd: 'ADD CLASS',
         schools: rows
       });
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //summary
 app.get('/summary', (req, res) => {
   if (req.session.loggedin) {
     res.render('summary', {
       title: 'SMS | Solution',
       hd: 'SUMMARY'
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 app.get('/home', (req, res) => {
   if (req.session.loggedin) {
     let numsch = '',
       numcomp = '',
       numstudents = '',
       numteachers = '',
       numclasses = '',
       numsms = '',
       numemails = '',
       numcampaigns = '';
     let sql = "SELECT * from schooldetails";
     connection.query(sql, (err, result) => {
       if (err) throw err;
       numsch = result.length;
       let sql2 = "select * from companydetails";
       connection.query(sql2, (err, result) => {
         if (err) throw err;
         numcomp = result.length;
         let sql3 = "select * from schoolclass";
         connection.query(sql3, (err, result) => {
           if (err) throw err;
           numclasses = result.length;
           let sql4 = "select * from campaigns";
           connection.query(sql4, (err, result) => {
             if (err) throw err;
             numcampaigns = result.length;

             connection.query("select * from teachers", (err, result) => {
               if (err) throw err;
               numteachers = result.length;
               connection.query("select * from students", (err, result) => {
                 if (err) throw err;
                 numstudents = result.length;
                 connection.query("select * from sms", (err, result) => {
                   if (err) throw err;
                   numsms = result.length;
                   connection.query("select * from emails", (err, result) => {
                     if (err) throw err;
                     numemails = result.length;

                     res.render('home', {
                       title: 'SMS | Solution',
                       hd: 'SUMMARY DASHBOARD',
                       schools: numsch,
                       companies: numcomp,
                       campaigns: numcampaigns,
                       teachers: numteachers,
                       products: 300,
                       students: numstudents,
                       messages: numsms,
                       emails: numemails,
                       offers: 4500,
                       classes: numclasses
                     });
                   });
                 });
               });
             });
           });
         });
       });
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 //with access
 app.get('/dashboard', (req, res) => {
   if (req.session.loggedin) {
     res.render('dashboard', {
       title: 'SMS  | DASHBOARD',
       hd: 'Main Panel',
       username: req.session.username
     });
   } else {
     res.sendFile(__dirname + '/' + "login.html");
   }
 });
 app.get('/logout', (req, res) => {
   req.session.destroy();
   res.sendFile(__dirname + '/' + "login.html");
 });

 function generateterms() {}

 function generateschoolcodes() {}

 function generateStudentID() {}

 function generateteacherid() {}

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

 app.get('/sendemail', (req, res) => {
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
 app.get('/sendbulkemails', (req, res) => {
   sgMail.setApiKey(sendgridapikey);
   let sql = "SELECT * from emails where status='send'";
   connection.query(sql, (err, rows, fields) => {
     if (err) throw err;
     for (let i in rows) {
       const email = {
         from: 'vincent.wabwoba18@gmail.com',
         to: rows[i].email,
         subject: 'Bulk Email',
         text: rows[i].message,
         html: rows[i].message
       };
       sgMail.send(email, (err, results) => {
         if (err) {
           console.log("Error occured" + err);
         } else {
           console.log("Email sent");
         }
       });
       let sql2 = 'update emails set status="sent" where id="' + rows[i].id + '"';
       connection.query(sql2, (err, result) => {
         if (err) throw err;
       });
       console.log("Email sent to:" + rows[i].email);
     }
   });
 });
 app.listen(port, () => {
   console.log('server running on port:' + port);
 });
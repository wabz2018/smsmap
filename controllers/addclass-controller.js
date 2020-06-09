
ACCOUNT_SID = 'ACa1308a0913638d16472f22089ee52a41'
AUTH_TOKEN = '0e2a77ed469fc17ffed3cffde2bac0a2'
SERVICE_SID = 'ISadb22c5c8bd65262c6914ec0b901b7d9'
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN); 
   
// User-defined function to send bulk SMS to desired 
// numbers bypassing numbers list as parameter 
function sendBulkMessages(messageBody, numberList) 
{ 
    var numbers = []; 
    for(i = 0; i < numberList.length; i++) 
    { 
        numbers.push(JSON.stringify({  
            binding_type: 'sms', address: numberList[i]})) 
    } 
   
    const notificationOpts = { 
      toBinding: numbers, 
      body: messageBody, 
    }; 
   
    client.notify 
    .services(SERVICE_SID) 
    .notifications.create(notificationOpts) 
    .then(notification => console.log(notification.sid)) 
    .catch(error => console.log(error)); 
} 
  

let express=require("express");
let connection = require('./../config');
 var date= new Date();
module.exports.register=function(req,res){
    let users={
        "username":req.body.username,
        "email":req.body.email,
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "role": req.body.role,
        "istatus":'A',
        "token":'4567',
        "phonenumber":req.body.phonenumber,
        "datecreated":date,
        "password":req.body.password
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
            console.log(error);
        }else{           
        sendBulkMessages('Greetings from Vincent Wabwoba| Simple systems, Keep safe', 
   [users.phonenumber, '+25784797517']) 
    
            res.render('index',{
                title:'SMS | System',
                hd:'Login now'
            })
        }
    });
}
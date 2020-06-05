
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
     
// Sending our custom message to all numbers 
// mentioned in array. 
//sendBulkMessages('Greetings from Vincent Wabwoba| Simple systems, Keep safe', 
  //  ['+254705778658', '+254729424631','+254715560734','+254715463283']) 

   //email integration
 const express= require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer=require('multer');
const connection=require('./config');

const port =2500;

const app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('public',path.join(__dirname, 'public'));
app.use('/uploads',express.static('uploads'));
app.use('/images', express.static('images'));
  
//controllers 
let authenticateController= require('./controllers/authenticate-controller');
let registerController= require('./controllers/register-controller');

app.post('/api/register',registerController.register);
app.post('/api/authenticate', authenticateController.authenticate)

app.post('/controllers/authenticate-controller',authenticateController.authenticate);
app.post('/controllers/register-controller', registerController.register);
//views 
app.get('/', function (req, res) {
    res.sendFile( __dirname +'/'+ "login.html" );
});

//register
app.get('/register', function(req, res) {
     res.render('register',{
        title:'SMS | Solution',
         hd: 'Registration Panel '
     });
    }
);
app.listen(port,()=>{
    console.log('server running on port:'+port);
});

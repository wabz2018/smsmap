
const  session= require('express-session');
let connection = require('./../config');
module.exports.authenticate=function(req,res){
    let email=req.body.email;
    let password=req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        }else{
            if(results.length >0){
                let   userrole= results[0].role;
                let pass= results[0].password;
                if(pass ==password){
                    if(userrole=="Admin"){
                        res.render('dashboard', {
                            title: 'SHOPAPP Buy |Sell |Finance',
                            hd:'Admin Panel'
                        });
                    }
                    else (userrole=="User")
                    {
                        res.render('dashboard', {
                            title: 'SHOPAPP Buy |Sell |Finance',
                            hd:'User Panel'
                        });
                    }
                }
                else{
                    res.json({
                        status:false,
                        message:"Email and password does not match"
                    });
                }}
            else{
                res.json({
                    status:false,
                    message:"Email does not exits"
                });
            }
        }
    });
}
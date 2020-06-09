
let express=require("express");
let connection = require('./../config');
let schoolcode='';
let formatedphone='';
module.exports.addschool=function(req,res){
    let stype= req.body.stype;
    let phone=req.body.schoolcontact;
    let st=phone.charAt(0);
    if(st=='0')
    { formatedphone='+254'+phone.substring(1);}
    else if(st=='+')
    {formatedphone=phone;}
    if(stype=='Primary')
    {
        schoolcode='PR'+Math.random().toString().slice(2,6);
    }
    else if(stype=='Private'){
        schoolcode='PV'+Math.random().toString().slice(2,6);
    }
    else if(stype=='Secondary'){
        schoolcode='SR'+Math.random().toString().slice(2,6);
    }
    let schools={
        "schoolcode":schoolcode,
        "schoolname":req.body.schoolname,
        "schoolcontact":formatedphone,
        "schoolemail":req.body.schoolemail,
        "schooladdress": req.body.schooladdress
    }
    connection.query('INSERT INTO schooldetails SET ?',schools, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
            console.log(error);
        }else{           
            res.render('addschool',{
                title:'SMS | System',
                hd:'Home Panel'
            })
        }
    });
}
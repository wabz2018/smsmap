let express = require("express");
let connection = require('./../config');
module.exports.addcompany = function (req, res) {
    let phone = req.body.companycontact;
    let contact = '';
    if (phone.charAt(0) == '0') {
        contact = '+254' + phone.substring(1);
    } else if (phone.charAt(0) == '+') {
        contact = phone;
    }
    let code = 'CR' + Math.random().toString().slice(2, 8);
    let companies = {
        "companycode": code,
        "companyname": req.body.companyname,
        "companycontact": contact,
        "companyemail": req.body.companyemail,
        "companyaddress": req.body.companyaddress
    }
    connection.query('INSERT INTO companydetails SET ?', companies, function (error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })
            console.log(error);
        } else {
            res.render('addcompany', {
                title: 'SMS | Solution',
                hd: 'Home Panel'
            })
        }
    });
}
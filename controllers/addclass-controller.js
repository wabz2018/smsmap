 let express = require("express");
 let connection = require('./../config');
 module.exports.addclass = function (req, res) {
     let scode = req.body.schoolcode;
     let  code = scode + Math.random().toString().slice(2, 5);
     let classes = {
         "classname": req.body.classname,
         "schoolcode": req.body.schoolcode,
         "classcode": code
     }
     connection.query('INSERT INTO schoolclass SET ?', classes, function (error, results, fields) {
         if (error) {
             res.json({
                 status: false,
                 message: 'there are some error with query'
             })
             console.log(error);
         } else {
             res.render('dashboard', {
                 title: 'SMS | System',
                 hd: 'Home Panel'
             })
         }
     });
 }
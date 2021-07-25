const express = require('express');
const app = express();
var nodemailer = require('nodemailer');


//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pinkysell.1031@gmail.com',
        pass: 'pinky.1031'
    }
});

function sendmail(options){
  //發送信件方法
  transporter.sendMail(options, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('訊息發送: ' + info.response);
    }
  });

}

exports.sendmailtouser=sendmail
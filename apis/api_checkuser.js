const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const db = require('../sql_database.js');

const app = express();

app.use(express.json()); 

app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))
const router = express.Router();

//登入檢查
router.get('/userinfo',function(req,res){
    if(req.session.userid !=  undefined || req.session.userid == "未登入"){
           console.log(req.session.userid,"個人頁面session~~~~")
           let data = {"login":true,"userid":req.session.userid};
        res.end(JSON.stringify(data)) 
     }
    else{
        res.end(JSON.stringify({"login":false})) 
    }
 });


 module.exports = router;
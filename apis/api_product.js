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

//取得商品資料
router.get('/product/:id',async function(req,res){
    try
    { 
        let info = {"proid": req.params.id,"loginuser":req.session.userid};
        let result = await db.get_product(info);
        result = await JSON.parse(result);
        res.end(JSON.stringify(result)) 
        
    }
    catch(message){
        message = await JSON.parse(message);
        console.log('拒絕後跑這~~Error:'+message)
        res.end(JSON.stringify(message)) 
    }
 });

 //修改商品狀態
 router.patch('/product',async function(req,res){
    try
    { 
        let status = {"proid": req.body.proid,"action": req.body.action};
        let result = await db.modify_status(status);
        result = await JSON.parse(result);
        res.end(JSON.stringify(result)) 
        
    }
    catch(message){
        message = await JSON.parse(message);
        console.log('拒絕後跑這~~Error:'+message)
        res.end(JSON.stringify(message)) 
    }
 });
 




module.exports = router;
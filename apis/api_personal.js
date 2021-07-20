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

//載入個人資料
router.get('/personal/:id',async function(req,res){
    try
    { 
        let info = {"id": req.params.id};
        let result = await db.get_personal(info);
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
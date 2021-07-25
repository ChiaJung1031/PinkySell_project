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

router.get('/itemlist/:id',async function(req,res){
     let param = req.params.id;
     if(param == "buy"){
        let info = {"id":req.session.userid};
        let result = await db.get_buyitem(info);
        result = await JSON.parse(result);
        res.end(JSON.stringify(result))
     }
     else if(param == "sale"){
        let info = {"id":req.session.userid};
        let result = await db.get_saleitem(info);
        result = await JSON.parse(result);
        res.end(JSON.stringify(result))
     }
    
})



module.exports = router;
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


//會員註冊
router.post('/user',async function(req,res){
   try{
        let name= req.body.name;
        let password= req.body.password;
        let email= req.body.email;
        let userid= req.body.userid;
        let allinfo = {"name":name,"password":password,"email":email,"userid":userid}
        let result = await db.singup_user(allinfo);
        result = await JSON.parse(result);
        if(result["error"] == null)
        {
            res.end(JSON.stringify(result))
        }
    }
   catch(message){
       message = await JSON.parse(message);
       console.log('拒絕後跑這~~Error:'+message)
       res.end(JSON.stringify(message)) 
       
   }

});



//會員登入
router.patch('/user',async function(req,res){
    try{
        let password= req.body.password;
        let userid= req.body.userid;
        let response;
        let allinfo = {"password":password,"userid":userid}
        let result = await db.singin_user(allinfo);
        result = await JSON.parse(result);
        if(result["error"] == null)
        {
            req.session.userid = userid;
            res.end(JSON.stringify(result))
        }
    }
   catch(message){
       message = await JSON.parse(message);
       req.session.userid ="未登入";
       console.log('拒絕後跑這~~Error:'+message)
       res.end(JSON.stringify(message)) 
       
   }
});

//檢查會員登入狀態
router.get('/user',async function(req,res){
   if(req.session.userid !=  undefined ){
      let info = {"id":req.session.userid}
      let result = await db.get_profile(info);
      result = await JSON.parse(result);
      let data = {"login":true,"userid":req.session.userid,"photo":result["data"]["photo"]};
      res.end(JSON.stringify(data)) 
    }
   else{
    res.end(JSON.stringify({"login":false})) 
   }
});

//登出
router.delete('/user',function(req,res){
    req.session.destroy((err) => {
        if(err){
            throw err;
        } else {
            res.clearCookie('sessionId');
            return res.json({ 'ok': true });
        }
    })
 });



module.exports = router;
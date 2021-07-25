const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const db = require('../sql_database.js');
const emailService = require('../email.js');

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
 

//購買商品
router.post('/product/:id',async function(req,res){
    try
    { 
        if(req.session.userid != undefined ){
            let seller = req.body["seller"];
            let memo = req.body["memo"];
            if(memo ==""){
                memo="無";
            }
            let info = {"proid": req.params.id,"buyer":req.session.userid,"seller":seller,"memo":memo};
            let result = await db.buy_product(info);
            let user = {"buyer":req.session.userid,"seller":seller,"proid": req.params.id}
            let userinfo =  await db.user_info(user);
            userinfo = await JSON.parse(userinfo);
            let buyer_email="";
            let seller_email="";
            let pro_name="";
            if(userinfo[0]["userid"]==req.session.userid)
            {
                buyer_email=userinfo[0]["email"];
                seller_email=userinfo[1]["email"];
                pro_name=userinfo[1]["proname"];
            }
            else if(userinfo[0]["userid"]==seller)
            {
                seller_email=userinfo[0]["email"];
                buyer_email=userinfo[1]["email"];
                pro_name=userinfo[0]["proname"];
            }
            var options = {
                //寄件者
                from: 'pinkysell.1031@gmail.com',
                //收件者
                to: seller_email, 
                //主旨
                subject: '商品['+pro_name+']購買確認信件',
                //嵌入 html 的內文
                html: '<h2><p>買家@'+seller+'想購買您的商品，請透過'+buyer_email+'與買家聯繫！</p></h2><br><p>買家備註：'+memo+'</p><br><p>此信件為系統自動發送，請勿回覆！</p>', 
            };
            await emailService.sendmailtouser(options);
            result = await JSON.parse(result);
            res.end(JSON.stringify(result)) 
        }
        else if(req.session.userid == undefined){
            let result ={"error":true,"msg":"請先登入"}   
            res.end(JSON.stringify(result)) 
        }

        
    }
    catch(message){
        message = await JSON.parse(message);
        console.log('拒絕後跑這~~Error:'+message)
        res.end(JSON.stringify(message)) 
    }
 });


module.exports = router;
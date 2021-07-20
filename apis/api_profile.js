const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const db = require('../sql_database.js');
const aws = require('../awsS3.js');
require('dotenv').config()

//上傳照片會用到
const multer  = require('multer');
const upload = multer({dest:'uploads/'});

const app = express();
app.use(express.json()); 

app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))

const formData = require('express-form-data');

app.use(formData.parse());
const router = express.Router();
const CDN=process.env.AWS_CDN

 //編輯個人頁面
 router.get('/profile',async function(req,res){
    try
    { 
        let info = {"id": req.session.userid};
        let result = await db.get_profile(info);
        result = await JSON.parse(result);
        res.end(JSON.stringify(result)) 
       
    }
    catch(message){
        message = await JSON.parse(message);
        console.log('拒絕後跑這~~Error:'+message)
        res.end(JSON.stringify(message)) 
    }
 });

 //更改密碼或個人資料
 router.patch('/profile',upload.single('file'),async function(req,res){
        try{  
            let form = req.body["form"];
            let myfile = req.file;
            //修改個人資料
            if(form == "form1")
            {
              if(myfile != undefined)
              { 
                let picfile = req.file;
                let resultpic=await aws.uploadtoS3(picfile);
                let picurl= CDN + resultpic.key;
                let data = {
                    "uname":req.body["uname"],
                    "uintro":req.body["uintro"],
                    "city":req.body["city"],
                    "gender":req.body["gender"],
                    "userid":req.session.userid,
                    "photo":picurl
                    };
                    let result = await db.change_self(data);
                    result = await JSON.parse(result);
                    if(result["error"] == null)
                    {
                        res.end(JSON.stringify(result))
                    }
              }
              else if(myfile == undefined)   //沒有上傳檔案
              { 
                let data = {
                    "uname":req.body["uname"],
                    "uintro":req.body["uintro"],
                    "city":req.body["city"],
                    "gender":req.body["gender"],
                    "userid":req.session.userid,
                    "photo": req.body["userphoto"]
                    };
                    let result = await db.change_self(data);
                    result = await JSON.parse(result);
                    if(result["error"] == null)
                    {
                        res.end(JSON.stringify(result))
                    }
              }
          
            }
            //修改密碼
            if(form == "form2")
            {
                let npsw =  req.body["psw"];
                let data = {"psw":npsw,"userid":req.session.userid};
                let result = await db.change_psw(data);
                result = await JSON.parse(result);
                if(result["error"] == null)
                {
                    res.end(JSON.stringify(result))
                }
            }
           
        } 
        catch(message){
           console.log('拒絕後跑這~~Error:'+message)
       }   
    

 });




module.exports = router;
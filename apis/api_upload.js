const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const db = require('../sql_database.js');
const aws = require('../awsS3.js');

require('dotenv').config()
//上傳照片會用到
const multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })
   
var upload = multer({storage})


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



router.post('/uploadpic/:id',upload.array('file'),async function(req,res){
    try
    {  
        let myfile = req.files;
        let resultpic ="";
        let allurl="";
        for(let i=0;i<myfile.length;i++){
            resultpic=await aws.uploadtoS3(myfile[i]);
            allurl+= CDN + resultpic.key +",";
        }
        let product_info = {
            "category": req.body["category"],
            "proname": req.body["proname"],
            "brand": req.body["brand"],
            "p_status": req.body["p_status"],
            "price": req.body["price"],
            "describe": req.body["describe"],
            "quantity": req.body["quantity"],
            "keyword1": req.body["keyword1"],
            "keyword2": req.body["keyword2"],
            "keyword3": req.body["keyword3"],
            "trans_1": req.body["trans_1"],
            "trans_2": req.body["trans_2"],
            "trans_3": req.body["trans_3"],
            "t_des1": req.body["t_des1"],
            "t_des2": req.body["t_des2"],
            "t_des3": req.body["t_des3"],
            "photo": allurl,
            "userid":req.session.userid
        };
        let result = await db.upload_pro(product_info);
        result = await JSON.parse(result);
        if(result["error"] == null)
        {
            res.end(JSON.stringify(result))
        }
    }
    catch(message)
    {
        console.log('拒絕後跑這~~Error:'+message)
    }   
    
});


router.get('/uploadpic/:id',async function(req,res){
  try
  {  
      let proid=req.params.id;
      let info={"proid":proid};
      let result = await db.get_uploadpro(info);
      result = await JSON.parse(result);
      if(result["error"] == null)
      {
          res.end(JSON.stringify(result))
      }
  }
  catch(message)
  {
      console.log('拒絕後跑這~~Error:'+message)
  }   
  
});



router.patch('/uploadpic/:id',upload.array('file'),async function(req,res){
  try
  {  
      let myfile = req.files;
      let resultpic ="";
      let allurl="";
      for(let i=0;i<myfile.length;i++){
          resultpic=await aws.uploadtoS3(myfile[i]);
          allurl+= CDN + resultpic.key +",";
      }
      let all_photo=req.body["existfile"]+allurl;
      let product_info = {
          "id":req.params.id,
          "category": req.body["category"],
          "proname": req.body["proname"],
          "brand": req.body["brand"],
          "p_status": req.body["p_status"],
          "price": req.body["price"],
          "describe": req.body["describe"],
          "quantity": req.body["quantity"],
          "keyword1": req.body["keyword1"],
          "keyword2": req.body["keyword2"],
          "keyword3": req.body["keyword3"],
          "trans_1": req.body["trans_1"],
          "trans_2": req.body["trans_2"],
          "trans_3": req.body["trans_3"],
          "t_des1": req.body["t_des1"],
          "t_des2": req.body["t_des2"],
          "t_des3": req.body["t_des3"],
          "photo": all_photo,
          "userid":req.session.userid
      };
      let result = await db.update_pro(product_info);
      result = await JSON.parse(result);
      if(result["error"] == null)
      {
          res.end(JSON.stringify(result))
      }
  }
  catch(message)
  {
      console.log('拒絕後跑這~~Error:'+message)
  }   
  
});

module.exports = router;

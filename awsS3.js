//上傳S3需要的
const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config()
const express = require('express');
const app = express();

const accessKeyId=process.env.AWS_ACCESS_KEY
const secretAccessKey=process.env.AWS_SECRET_KEY
const region=process.env.region

const S3=require('aws-sdk/clients/s3');
const s3 = new AWS.S3({
    region,
    secretAccessKey,
    accessKeyId,
});

function uplodafile(file){
        const fileContent = fs.createReadStream(file.path)
        const params = {
            Bucket: "bucketweek1", 
            Body: fileContent, 
            Key: file["originalname"] 
          };
         let ans =  s3.upload(params).promise();
         return ans
  
  
}

exports.uploadtoS3=uplodafile
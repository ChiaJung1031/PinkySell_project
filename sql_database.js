const express = require('express');
const app = express();
const router = express.Router();
const dateFormat = require("dateformat");
require('dotenv').config()

const mysql = require("mysql2");


const conn = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345",
    database:"apunsell",
    waitForConnections: true,
    connectionLimit: 10,
});

//註冊會員
exports.singup_user = function(req)
{
    return new Promise(function(resolve,reject)
    {
        let msg="";
        let select_sql= "select user_id from tb_user where user_id = '"+req["userid"]+"'";
        conn.query(select_sql, function(err, results, fields)
        {      
            if (err) 
            {
                throw err;
            }
            else
            {
                if (results.length != 0) 
                { 
                    msg={'error': true,'errmsg':"帳號已註冊過，請重新輸入"};
                    reject(JSON.stringify(msg))
                }
                else
                {
                    let datetime=dateFormat(new Date(), "yyyy-mm-dd");
                    let insert_sql = "insert into tb_user(user_id,name,password,email,datetime) values (?,?,?,?,?)";
                    let insert_val = [req["userid"],req["name"],req["password"],req["email"],datetime];
                    conn.query(insert_sql,insert_val, function(err, results, fields)
                    {      
                        if (err) 
                        { 
                            msg={'error': true,'errmsg':err};
                            reject(JSON.stringify(msg))
                        }
                        else if(results.affectedRows == 1)
                        {
                            let insert1_sql = "insert into tb_profile(user_id,introduce,city,gender,photo) values (?,?,?,?,?)";
                            let insert1_val = [req["userid"],"","","","https://d1wcop1hy1uawh.cloudfront.net/nopic.png"];
                            conn.query(insert1_sql,insert1_val, function(err, results, fields)
                            {      
                                if (err) 
                                { 
                                    msg={'error': true,'errmsg':err};
                                    reject(JSON.stringify(msg))
                                }
                                else if(results.affectedRows == 1)
                                {
                                   msg = {'error':null};
                                   resolve(JSON.stringify(msg))
                                }
                            });
                        }
                    });
                  
                }
            }
          
        });

    });
};


//會員登入
exports.singin_user = function(req)
{
    return new Promise(function(resolve,reject)
    {
        let errmsg="";
        let select_sql= "select user_id from tb_user where user_id = '"+req["userid"]+"' and password = '"+req["password"]+"'";
        conn.query(select_sql, function(err, results, fields)
        {      
            if (err) 
            {
                throw err;
            }
            else
            {
                if (results.length == 0) 
                { 
                    msg={'error': true,'errmsg':"查無此帳號，請重新輸入"};
                    reject(JSON.stringify(msg))
                }
                else
                {
                    msg = {'error':null};
                    resolve(JSON.stringify(msg))
                }
            }
        });
    });
};

//更改密碼
exports.change_psw = function(req)
{
    return new Promise(function(resolve,reject)
    {
        let msg="";
        let update_sql= "update tb_user set password = '"+req["psw"]+"' where user_id = '"+req["userid"]+"'";
        conn.query(update_sql, function(err, results, fields)
        {   
            if (err) 
            { 
                msg={'error': true,'errmsg':err};
                reject(JSON.stringify(msg))
            }
            else if(results.affectedRows == 1)
            {
                msg = {'error':null,'userid':req["userid"]};
               resolve(JSON.stringify(msg))
            }

        });
    });
}

//修改個人資料
exports.change_self = function(req)
{
    return new Promise(function(resolve,reject)
    {
        if(req["file"] == undefined)
        {
            let msg="";
            let update_sql= "update tb_profile set introduce='"+req["uintro"]+"',city='"+req["city"]+"',gender='"+req["gender"]+"',photo='"+req["photo"]+"' where user_id = '"+req["userid"]+"'";
            conn.query(update_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows == 1)
                {
                    msg = {'error':null,'userid':req["userid"]};
                   resolve(JSON.stringify(msg))
                }
    
            });
        }
        else
        {
            let picS3 = pictoaws.uploadtoS3(req["file"]);
        }
      
    });
}



//抓個人資料
exports.get_profile = function(req)
{
    return new Promise(function(resolve,reject)
    { 
            let msg="";
            let select_sql= "select A.email,A.name,B.introduce,B.city,B.gender,B.photo from apunsell.tb_user AS A left join apunsell.tb_profile AS B  on A.user_id = B.user_id where A.user_id='"+req["id"]+"'";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length == 1)
                { 
                    let picture;
                    if(results[0]["photo"] == ""){
                        picture = "https://d1wcop1hy1uawh.cloudfront.net/nopic.png"
                    }
                    else if(results[0]["photo"] != ""){
                        picture = results[0]["photo"];
                    }

                    msg = {
                        'error':null,
                        'data':{
                             "name":results[0]["name"],
                             "email":results[0]["email"],
                             "intro":results[0]["introduce"],
                             "city":results[0]["city"],
                             "gender":results[0]["gender"],
                             "photo":picture
                            }
                        };
                    resolve(JSON.stringify(msg))
                }
    
            });
    });
}

//載入個人頁面(personal)資料
exports.get_personal = function(req)
{
    return new Promise(function(resolve,reject)
    {  
            let msg="";
            let select_sql= "select A.user_id, A.name as u_name ,B.introduce,B.city,B.photo as selfphoto,C.id,C.name as pro_name,C.price,C.photo as prophoto from tb_user AS A left join tb_profile AS B on A.user_id = B.user_id left join tb_product AS C on A.user_id = C.user_id where A.user_id='"+req["id"]+"' order by C.cre_datetime desc";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length !=0)
                { 
                    let allmsg=[];
                    for(let i=0;i<results.length;i++)
                    {
                        msg = {
                            "loginID":req["loginID"],
                            "userid":results[i]["user_id"],
                            "name":results[i]["u_name"],
                            "intro":results[i]["introduce"],
                            "city":results[i]["city"],
                            "selfphoto":results[i]["selfphoto"],
                            "pro_id":results[i]["id"],
                            "pro_name":results[i]["pro_name"],
                            "price":results[i]["price"],
                            "prophoto":results[i]["prophoto"] 
                       };
                       allmsg.push(msg);
                    }
                
                    resolve(JSON.stringify(allmsg))
                }
            });
    });
}

//上傳商品
exports.upload_pro= function(req)
{
    return new Promise(function(resolve,reject)
    {                           
            let idnum=dateFormat(new Date(), "yyyymmddHHMMss");
            let datetime=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let msg="";
            let insert_sql= "insert into tb_product(id,user_id,name,brand,price,cat_sub_id,newold,"+
                "description,quantity,keyword1,keyword2,keyword3,transaction_1,transaction_info_1,transaction_2,"+
                "transaction_info_2,transaction_3,transaction_info_3,cre_datetime,photo)"+
                "value(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
             let insert_val = [idnum,req["userid"],req["proname"],req["brand"],req["price"],req["category"],req["p_status"],
                req["describe"],req["quantity"],req["keyword1"],req["keyword2"],req["keyword3"],
                req["trans_1"],req["t_des1"],req["trans_2"],req["t_des2"],req["trans_3"],req["t_des3"],datetime,req["photo"]];
            conn.query(insert_sql,insert_val, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows == 1)
                { 
                    //商品一上架狀態是pp(上架中)
                    let insert1_sql= "insert into tb_pro_status(pro_id,status,mod_datetime) value(?,?,?)"
                    let insert1_val = [idnum,"pp",datetime]
                    conn.query(insert1_sql,insert1_val, function(err, results, fields)
                    {
                        if (err) 
                        { 
                            msg={'error': true,'errmsg':err};
                            reject(JSON.stringify(msg))
                        }
                        else if(results.affectedRows == 1)
                        {
                            msg = {'error':null,"userid":req["userid"]};
                            resolve(JSON.stringify(msg))
                        }
                    })
                }
    
            });
    
      
    });
}

//修改商品
exports.update_pro= function(req)
{
    return new Promise(function(resolve,reject)
    {                        
            let idnum=dateFormat(new Date(), "yyyymmddHHMMss");
            let datetime=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let msg="";
            let update_sql= "update tb_product set name='"+req["proname"]+"',brand='"+req["brand"]+"',price='"+req["price"]+"',cat_sub_id='"+req["category"]+"',newold='"+req["p_status"]+"',description='"+req["describe"]+"',quantity='"+req["quantity"]+"',keyword1='"+req["keyword1"]+"',keyword2='"+req["keyword2"]+"',keyword3='"+req["keyword3"]+"',transaction_1='"+req["trans_1"]+"',transaction_2='"+req["trans_2"]+"',transaction_3='"+req["trans_3"]+"',transaction_info_1='"+req["t_des1"]+"',transaction_info_2='"+req["t_des2"]+"',transaction_info_3='"+req["t_des3"]+"',photo='"+req["photo"]+"' where id='"+req["id"]+"'";
          
            conn.query(update_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows == 1)
                { 
                    msg = {'error':null,"userid":req["userid"]};
                    resolve(JSON.stringify(msg))
                }
    
            });
    
      
    });
}



//載入首頁(首頁)資料
exports.get_index = function(req)
{
    return new Promise(function(resolve,reject)
    {  
            let msg="";
            let select_sql="select A.id,A.name,A.price,A.photo AS prophoto,A.user_id,C.photo AS selfphoto from tb_product as A left join tb_pro_status AS B on A.id=B.pro_id and B.status in('pp','po') left join tb_profile AS C on A.user_id=C.user_id order by A.cre_datetime desc";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length !=0)
                { 
                    let allmsg=[];
                    for(let i=0;i<results.length;i++)
                    {
                        msg = {
                            "userid":results[i]["user_id"],
                            "selfphoto":results[i]["selfphoto"],
                            "pro_id":results[i]["id"],
                            "pro_name":results[i]["name"],
                            "price":results[i]["price"],
                            "prophoto":results[i]["prophoto"] 
                       };
                       allmsg.push(msg);
                    }
                
                    resolve(JSON.stringify(allmsg))
                }
                else if(results.length ==0){
                    msg = {"data":null}
                    resolve(JSON.stringify(msg))
                }
            });
    });
}


//載入首頁(首頁)資料
exports.index_search = function(req)
{
    return new Promise(function(resolve,reject)
    {   
            let msg="";
            let select_sql="select A.id,A.name,A.price,A.photo AS prophoto,A.user_id,C.photo AS selfphoto from tb_product as A left join tb_pro_status AS B on A.id=B.pro_id and B.status in('pp','po') left join tb_profile AS C on A.user_id=C.user_id where A.user_id='"+req["search"]+"' or A.name like'%"+req["search"]+"%' or  A.keyword1 like'%"+req["search"]+"%'  or  A.keyword2 like'%"+req["search"]+"%' or A.keyword3 like'%"+req["search"]+"%' order by A.cre_datetime desc";
            conn.query(select_sql, function(err, results, fields)
            { 
                if (err) 
                { 
                    msg={"error": true,"errmsg":err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length ==0){
                    msg={"data": "nodata"};
                    resolve(JSON.stringify(msg))
                }
                else if(results.length !=0)
                {    
                    let allmsg=[];
                    for(let i=0;i<results.length;i++)
                    {
                        msg = {
                            "userid":results[i]["user_id"],
                            "selfphoto":results[i]["selfphoto"],
                            "pro_id":results[i]["id"],
                            "pro_name":results[i]["name"],
                            "price":results[i]["price"],
                            "prophoto":results[i]["prophoto"] 
                       };
                       allmsg.push(msg);
                    }
                
                    resolve(JSON.stringify(allmsg))
                }
            });
    });
}


//載入各商品資料
exports.get_product = function(req)
{
    return new Promise(function(resolve,reject)
    {   
            let msg="";
            let select_sql="select A.*,C.code_name_1 as statusname,D.city,D.photo as u_photo,E.code_name_1 as newoldname from tb_product as A left join tb_pro_status as B on A.id=B.pro_id left join list_code as C on B.status=C.code_sub_id_1 left join list_code as E on A.newold=E.code_sub_id_1 left join tb_profile as D on A.user_id=D.user_id where A.id='"+req["proid"]+"'";
            conn.query(select_sql, function(err, results, fields)
            {  
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length ==1 )
                { 
                  
                        msg = {"error":null,
                        "data":{
                            "id":results[0]["id"],
                            "name":results[0]["name"],
                            "price":results[0]["price"],
                            "newold":results[0]["newoldname"],
                            "brand":results[0]["brand"],
                            "city":results[0]["city"],
                            "description":results[0]["description"],
                            "quantity":results[0]["quantity"],
                            "photo":results[0]["photo"], 
                            "transaction_1":results[0]["transaction_1"],
                            "transaction_info_1":results[0]["transaction_info_1"],
                            "transaction_2":results[0]["transaction_2"],
                            "transaction_info_2":results[0]["transaction_info_2"], 
                            "transaction_3":results[0]["transaction_3"],
                            "transaction_info_3":results[0]["transaction_info_3"],
                            "user_id":results[0]["user_id"],
                            "status":results[0]["statusname"], 
                            "datetime":results[0]["cre_datetime"],
                            "loginuser":req["loginuser"],
                            "u_photo":results[0]["u_photo"]
                        }
                           
                       }
                
                    resolve(JSON.stringify(msg))
                }
            });
    });
}

//修改商品狀態
exports.modify_status = function(req)
{
    return new Promise(function(resolve,reject)
    {   
        let action = req["action"];
        let proid = req["proid"];
        let datetime=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        let update_keep ="update tb_pro_status set status='po',mod_datetime='"+datetime+"' where pro_id='"+proid+"'";
        let update_sold  ="update tb_pro_status set status='ps',mod_datetime='"+datetime+"' where pro_id='"+proid+"'";
        let delete_prostatus ="delete from tb_pro_status where pro_id='"+proid+"'";
        let delete_product ="delete from tb_product where id='"+proid+"'";
        let msg="";
        if(action =="keep")
        {
            conn.query(update_keep, function(err, results, fields)
            {  
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows ==1 )
                { 
                   msg = {"error":null,"OK":"商品預定成功！"}
                   resolve(JSON.stringify(msg))
                }
            });
        }
        else if(action =="sale")
        {
            conn.query(update_sold, function(err, results, fields)
            {  
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows ==1 )
                { 
                   msg = {"error":null,"OK":"商品售出成功！"}
                   resolve(JSON.stringify(msg))
                }
            });
        }
        else if(action =="delete")
        {
            conn.query(delete_prostatus, function(err, results, fields)
            {  
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows ==1 )
                { 
                    conn.query(delete_product, function(err, results, fields)
                    {  console.log("有刪除嗎????????????")
                        if (err) 
                        { 
                            msg={'error': true,'errmsg':err};
                            reject(JSON.stringify(msg))
                        }
                        else if(results.affectedRows ==1 )
                        { 
                            msg = {"error":null,"OK":"商品刪除成功！"}
                            resolve(JSON.stringify(msg))
                        }
                    });
                }
            });
        }
           
    });
}


//修改商品狀態
exports.get_uploadpro = function(req)
{
    return new Promise(function(resolve,reject)
    { 
        let proid = req["proid"];
        let select_product ="select * from tb_product where id='"+proid+"'";
        let msg="";
        conn.query(select_product, function(err, results, fields)
            { 
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length ==1 )
                { 
                        msg = {"error":null,
                        "data":{
                            "id":results[0]["id"],
                            "cat_sub_id":results[0]["cat_sub_id"],
                            "name":results[0]["name"],
                            "price":results[0]["price"],
                            "newold":results[0]["newold"],
                            "brand":results[0]["brand"],
                            "description":results[0]["description"],
                            "quantity":results[0]["quantity"],
                            "photo":results[0]["photo"], 
                            "keyword1":results[0]["keyword1"], 
                            "keyword2":results[0]["keyword2"], 
                            "keyword3":results[0]["keyword3"], 
                            "transaction_1":results[0]["transaction_1"],
                            "transaction_info_1":results[0]["transaction_info_1"],
                            "transaction_2":results[0]["transaction_2"],
                            "transaction_info_2":results[0]["transaction_info_2"], 
                            "transaction_3":results[0]["transaction_3"],
                            "transaction_info_3":results[0]["transaction_info_3"]
                           }
                           
                       }
                    resolve(JSON.stringify(msg))
                }
            });
           
    });
}

//抓分類的商品
exports.get_category = function(req)
{
    return new Promise(function(resolve,reject)
    { 
        let category = req["cat"];
        let select_product ="select A.id,A.name,A.price,A.photo,A.user_id,C.photo as selfphoto,B.code_name_1 from tb_product as A left join tb_profile as C on A.user_id = C.user_id left join list_code as B on A.cat_sub_id=B.code_sub_id_2 and B.code_sub_id_1='"+category+"' where   B.code_sub_id_1='"+category+"' order by A.cre_datetime desc";
        let msg="";
        conn.query(select_product, function(err, results, fields)
            { 
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length != 0 )
                { 
                    let allmsg=[];
                    for(let i=0;i<results.length;i++)
                    {
                        msg = {
                            "pro_id":results[i]["id"],
                            "name":results[i]["name"],
                            "price":results[i]["price"],
                            "photo":results[i]["photo"],
                            "catname":results[i]["code_name_1"],
                            "selfphoto":results[i]["selfphoto"],
                            "userid":results[i]["user_id"]
                           }
                       allmsg.push(msg);
                    }
                    resolve(JSON.stringify(allmsg))
                }
                else if(results.length == 0){
                    let msg ={"error":"nodata"};
                    resolve(JSON.stringify(msg))
                }
            });
           
    });
}

//確定購買
exports.buy_product= function(req)
{
    return new Promise(function(resolve,reject)
    {                
            let datetime=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let msg="";
            let insert_sql= "insert into tb_buy(pro_id,buyer_id,seller_id,cre_datetime) value(?,?,?,?)";
            let insert_val = [req["proid"],req["buyer"],req["seller"],datetime];
            conn.query(insert_sql,insert_val, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.affectedRows == 1)
                {      
                    let insert1_sql= "insert into tb_message(pro_id,buyer_id,seller_id,msg,cre_datetime) value(?,?,?,?,?)"
                    let insert1_val =  [req["proid"],req["buyer"],req["seller"],req["memo"],datetime];
                    conn.query(insert1_sql,insert1_val, function(err, results, fields)
                    {
                        if (err) 
                        { 
                            msg={'error': true,'errmsg':err};
                            reject(JSON.stringify(msg))
                        }
                        else if(results.affectedRows == 1)
                        {
                            msg = {'error':null};
                            resolve(JSON.stringify(msg))
                        }
                    })
                }
    
            });
    
      
    });
}

//發信要的信箱資料
exports.user_info = function(req)
{
    return new Promise(function(resolve,reject)
    { 
            let msg="";
            let select_sql= "select A.user_id,email,B.name from tb_user as A left join tb_product as B on A.user_id=B.user_id and B.id='"+req["proid"]+"' where A.user_id in ('"+req["buyer"]+"','"+req["seller"]+"')";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length != 0 )
                { 
                    let allmsg=[];
                   for(let i=0;i<results.length;i++){
                        msg = {
                            "userid":results[i]["user_id"],
                            "email":results[i]["email"],
                            "proname":results[i]["name"]
                         };
                         allmsg.push(msg);
                   }
                  
                    resolve(JSON.stringify(allmsg))
                }
    
            });
    });
}

//抓所有購買紀錄
exports.get_buyitem = function(req)
{
    return new Promise(function(resolve,reject)
    { 
            let msg="";
            let select_sql= "select B.name,B.price,A.cre_datetime,A.seller_id from tb_buy as A left join tb_product as B on A.pro_id=B.id where A.buyer_id='"+req["id"]+"' order by cre_datetime desc";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length != 0 )
                { 
                    let allmsg=[];
                   for(let i=0;i<results.length;i++){
                        msg = {
                            "seller_id":results[i]["seller_id"],
                            "name":results[i]["name"],
                            "price":results[i]["price"],
                            "cre_datetime":results[i]["cre_datetime"]
                         };
                         allmsg.push(msg);
                   }
                  
                    resolve(JSON.stringify(allmsg))
                }
                else if(results.length == 0 ){
                    let msg = {"data":"nodata"}
                    resolve(JSON.stringify(msg))
                }
    
            });
    });
}

//抓所有銷售劑鹿
exports.get_saleitem = function(req)
{
    return new Promise(function(resolve,reject)
    { 
            let msg="";
            let select_sql= "select B.name,B.price,A.cre_datetime,A.buyer_id from tb_buy as A left join tb_product as B on A.pro_id=B.id where A.seller_id='"+req["id"]+"' order by cre_datetime desc";
            conn.query(select_sql, function(err, results, fields)
            {   
                if (err) 
                { 
                    msg={'error': true,'errmsg':err};
                    reject(JSON.stringify(msg))
                }
                else if(results.length != 0 )
                { 
                    let allmsg=[];
                   for(let i=0;i<results.length;i++){
                        msg = {
                            "buyer_id":results[i]["buyer_id"],
                            "name":results[i]["name"],
                            "price":results[i]["price"],
                            "cre_datetime":results[i]["cre_datetime"]
                         };
                         allmsg.push(msg);
                   }
                  
                    resolve(JSON.stringify(allmsg))
                }
                else if(results.length == 0 ){
                    let msg = {"data":"nodata"}
                    resolve(JSON.stringify(msg))
                }
    
            });
    });
}

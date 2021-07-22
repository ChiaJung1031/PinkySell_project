window.onload = function(){
    checkuser();
    load_data();

}

var allcount="";
var allfiles=[];
function  load_data(){
    let personalID=location.href.split('/personal/')[1]; //取得人員ID
    fetch("/api/personal/"+personalID,{
        method:"get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data.length == 1 && data[0]["pro_id"]  == undefined)
        {
            document.getElementById("itemtitle").innerHTML="尚未刊登商品，點選售出即可刊登！"
            document.getElementById("seemore").style.display="none";
            document.getElementById("pic").setAttribute("src",data[0]["selfphoto"]);
            document.getElementById("u_acc").innerHTML= "帳號：@" + data[0]["userid"];
            document.getElementById("u_name").innerHTML= "姓名："+　data[0]["name"];
            document.getElementById("u_des").innerHTML= "簡介："+　data[0]["intro"];
            document.getElementById("u_pos").innerHTML= "居住地："+　data[0]["city"];
        }
        else if(data.length >= 1 && data[0]["pro_id"] !="")
        {
            allcount=data.length;
            allfiles=data;
            document.getElementById("pic").setAttribute("src",data[0]["selfphoto"]);
            document.getElementById("u_acc").innerHTML= "帳號：@" + data[0]["userid"];
            document.getElementById("u_name").innerHTML= "姓名："+　data[0]["name"];
            document.getElementById("u_des").innerHTML= "簡介："+　data[0]["intro"];
            document.getElementById("u_pos").innerHTML= "居住地："+　data[0]["city"];
          
            if(data[0]["loginID"] != data[0]["userid"]){
                document.getElementById("modify").style.display="none";
            }
            
           for(let i=0;i<6;i++)
           {
                let allitem = document.getElementById("allitem");

                let pic_a = document.createElement("a"); //加上圖片超聯結
                let a_href = "/product/"+ data[i]["pro_id"];
                pic_a.setAttribute("href",a_href); 
              

                let picurl = data[i]["prophoto"].split(',')[0]; //圖片取第一張
                let epd = document.createElement("div");
                epd.className="epd";

                let pdimg = document.createElement("img");
                pdimg.className="pdimg";
                pdimg.setAttribute("src",picurl);
                pic_a.appendChild(pdimg);
    
                let pdname = document.createElement("div");
                let pdname_txt = document.createTextNode(data[i]["pro_name"])
                pdname.className="pdn";
                pdname.appendChild(pdname_txt);
            
                let pdprice = document.createElement("div");
                let pdprice_txt = document.createTextNode("NT$"+data[i]["price"])
                pdprice.appendChild(pdprice_txt);
                pdprice.className="pdn";
                
                epd.appendChild(pic_a);
                epd.appendChild(pdname);
                epd.appendChild(pdprice);
                allitem.appendChild(epd);
           }
          

        }
    });
}


function modifyfile(){
    fetch("/api/userinfo",{
            method:"get"
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data["login"]  == true){
                window.location.href = "/profile/"+data["userid"];
            }
        });
}

var allnum=0;;
var totalnum=6;
function seemore()
{
    allnum = allnum +6;
    totalnum=totalnum+6;
    for(allnum;allnum<totalnum;allnum++)
    {
                let allitem = document.getElementById("allitem");

                let pic_a = document.createElement("a"); //加上圖片超聯結
                let a_href = "/product/"+ allfiles[allnum]["pro_id"];
                pic_a.setAttribute("href",a_href); 
              

                let picurl = allfiles[allnum]["prophoto"].split(',')[0]; //圖片取第一張
                let epd = document.createElement("div");
                epd.className="epd";

                let pdimg = document.createElement("img");
                pdimg.className="pdimg";
                pdimg.setAttribute("src",picurl);
                pic_a.appendChild(pdimg);
    
                let pdname = document.createElement("div");
                let pdname_txt = document.createTextNode(allfiles[allnum]["pro_name"])
                pdname.className="pdn";
                pdname.appendChild(pdname_txt);
            
                let pdprice = document.createElement("div");
                let pdprice_txt = document.createTextNode("NT$"+allfiles[allnum]["price"])
                pdprice.appendChild(pdprice_txt);
                pdprice.className="pdn";
                
                epd.appendChild(pic_a);
                epd.appendChild(pdname);
                epd.appendChild(pdprice);
                allitem.appendChild(epd);
    }
    allnum=allnum-6;
}
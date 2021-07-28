window.onload = function(){
    checkuser();
    load_data();
}
var allcount="";
var allfiles=[];
function load_data(){
    fetch("/api/index",{
        method:"get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data.length >0)
        {
            allfiles=data;
            allcount=data.length;
            load_all_item(8,data);  //一開始只會顯示8筆
        }
           
    });
}

function searchitem(){
    let txt_search = document.getElementById("t_search").value;
    if(txt_search==""){
        load_data();
    }
    else (txt_search!="")
    {
        fetch("/api/index/"+txt_search,{
            method:"GET"
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data["data"] == "nodata")
            {
                document.getElementById("t_search").value="";
                alert("查無符合搜尋資料！")
         
            }
            else
            {
                let allitem = document.getElementById("allitem");
                allitem.innerHTML="";
                allfiles=data;
                load_all_item(data.length,data);
            }
               
        });
    }
  
}

function load_all_item(count,data){
        for(let i=0;i<count;i++)
        {
             let allitem = document.getElementById("allitem");
           
             let epd = document.createElement("div");
             epd.className="epd";
    
             let eid = document.createElement("div");
             eid.className="eid";
    
             let eid_1 = document.createElement("div");
             eid_1.className="eid_1";
             let edipic = document.createElement("img");
             edipic.setAttribute("src",data[i]["selfphoto"]);
             eid_1.appendChild(edipic);
    

            let eid_2 = document.createElement("a");
            eid_2.className="account";
            eid_2.innerHTML="@"+data[i]["userid"];
            let a_userid = "/personal/"+ data[i]["userid"];
            eid_2.setAttribute("href",a_userid);
    
             eid.appendChild(eid_1);
             eid.appendChild(eid_2);

    
             let pic_a = document.createElement("a"); //加上圖片超聯結
             let a_href = "/product/"+ data[i]["pro_id"];
             pic_a.setAttribute("href",a_href);
    
             let picurl = data[i]["prophoto"].split(',')[0]; //圖片取第一張
          
             let propicdiv = document.createElement("div");
             let pdimg = document.createElement("img");
             pdimg.className="pdimg";
             pdimg.setAttribute("src",picurl);
             propicdiv.appendChild(pic_a);
             pic_a.appendChild(pdimg)
    
             let pdname = document.createElement("div");
             let pdname_txt = document.createTextNode(data[i]["pro_name"])
             pdname.className="pdn";
             pdname.appendChild(pdname_txt);
         
             let pdprice = document.createElement("div");
             let pdprice_txt = document.createTextNode("NT$"+data[i]["price"])
             pdprice.appendChild(pdprice_txt);
             pdprice.className="txtcolor";
    
             epd.appendChild(eid);
             epd.appendChild(propicdiv);
             epd.appendChild(pdname);
             epd.appendChild(pdprice);
             allitem.appendChild(epd);
        }
}

var allnum=0;;
var totalnum=8;
function seemore(){
    if(totalnum<=allcount)
    {     
        allnum = allnum +8;
        totalnum=totalnum+8;
        for(allnum;allnum<totalnum;allnum++)
        {
             let allitem = document.getElementById("allitem");
           
             let epd = document.createElement("div");
             epd.className="epd";
    
             let eid = document.createElement("div");
             eid.className="eid";
    
             let eid_1 = document.createElement("div");
             eid_1.className="eid_1";
             let edipic = document.createElement("img");
             edipic.setAttribute("src",allfiles[allnum]["selfphoto"]);
             eid_1.appendChild(edipic);
    
             let eid_2 = document.createElement("div");
             eid_2.className="account";
             let userid_txt = document.createTextNode("@"+allfiles[allnum]["userid"])
             eid_2.appendChild(userid_txt)
    
             eid.appendChild(eid_1);
             eid.appendChild(eid_2);
    
             let pic_a = document.createElement("a"); //加上圖片超聯結
             let a_href = "/product/"+ allfiles[allnum]["pro_id"];
             pic_a.setAttribute("href",a_href);
    
             let picurl = allfiles[allnum]["prophoto"].split(',')[0]; //圖片取第一張
          
             let propicdiv = document.createElement("div");
             let pdimg = document.createElement("img");
             pdimg.className="pdimg";
             pdimg.setAttribute("src",picurl);
             propicdiv.appendChild(pic_a);
             pic_a.appendChild(pdimg)
    
             let pdname = document.createElement("div");
             let pdname_txt = document.createTextNode(allfiles[allnum]["pro_name"])
             pdname.className="pdn";
             pdname.appendChild(pdname_txt);
         
             let pdprice = document.createElement("div");
             let pdprice_txt = document.createTextNode("NT$"+allfiles[allnum]["price"])
             pdprice.appendChild(pdprice_txt);
             pdprice.className="txtcolor";
    
             epd.appendChild(eid);
             epd.appendChild(propicdiv);
             epd.appendChild(pdname);
             epd.appendChild(pdprice);
             allitem.appendChild(epd);
        }
        allnum=allnum-8;
    }

}
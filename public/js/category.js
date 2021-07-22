window.onload=function(){
    checkuser();
    load_data();
}


function load_data(){
    let categoryID=location.href.split('/category/')[1]; //取得category
    fetch("/api/category/"+categoryID,{
        method:"get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["error"] != "nodata"){
            let catname =  data[0]["catname"];
            document.getElementById("cat_name").innerHTML=catname; //寫入類別名稱
            for(let i=0;i<10;i++)
            {
                 let allitem = document.getElementById("allitem");
 
                 let pic_a = document.createElement("a"); //加上圖片超聯結
                 let a_href = "/product/"+ data[i]["pro_id"];
                 pic_a.setAttribute("href",a_href); 
               
 
                 let picurl = data[i]["photo"].split(',')[0]; //圖片取第一張
                 let epd = document.createElement("div");
                 epd.className="epd";
 
                 let pdimg = document.createElement("img");
                 pdimg.className="pdimg";
                 pdimg.setAttribute("src",picurl);
                 pic_a.appendChild(pdimg);
     
                 let pdname = document.createElement("div");
                 let pdname_txt = document.createTextNode(data[i]["name"])
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
        else{
            document.getElementById("noitem").style.display="block";
            document.getElementById("noitem").innerHTML="查無此分類商品";
        }
      
    });

}
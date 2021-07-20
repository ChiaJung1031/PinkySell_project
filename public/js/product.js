window.onload = function ()
{
    checkuser();
    getproinfo();
}

function edit_status(e){
    if(e=="keep"){
       change_status("keep");    
    }
    else if(e=="sale"){
       change_status("sale");
   
    }
    else if(e=="delete"){
        change_status("delete");
    }
}

function change_status(action){
    let proid=location.href.split('/product/')[1]; //取得商品ID
    let change_info = {"action":action,"proid":proid}
    fetch("/api/product",{
        method:"PATCH",
        body: JSON.stringify(change_info),
        headers: {
            "Content-Type": "application/json"
            }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["error"]== null){
            if(action == "delete"){
                alert(data["OK"])
                window.location.href ="/";
            }
            else{
                alert(data["OK"])
                window.location.href ="/product/"+proid;
            }
          
        }
    })
}

//取得商品資訊
function  getproinfo(){
    let productID=location.href.split('/product/')[1]; //取得商品ID
    fetch("/api/product/"+productID,{
        method:"GET"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["error"]  == null)
        {
            if(data["data"]["user_id"] == data["data"]["loginuser"])
            {
                document.getElementById("c_sell").style.display="block";
                document.getElementById("c_buy").style.display="none";
                document.getElementById('acc2').innerHTML ="@"+ data["data"]["user_id"];
                document.getElementById('upic2').setAttribute("src",data["data"]["u_photo"])
            }
            else
            {
                document.getElementById("c_sell").style.display="none";
                document.getElementById("c_buy").style.display="block";
                document.getElementById('acc1').innerHTML ="@"+ data["data"]["user_id"];
                let a_href = "/personal/"+ data["data"]["user_id"];
                document.getElementById('acc1').setAttribute("href",a_href);
             
                document.getElementById('upic1').setAttribute("src",data["data"]["u_photo"])
            }
            let alltrans="";
            let alldes="";
            let t1="";let d1=""; let t2="";let d2=""; let t3="";let d3="";
        
            document.getElementById('prostatus').innerHTML = data["data"]["status"];
            document.getElementById('proname').innerHTML = data["data"]["name"];
            document.getElementById('price').innerHTML = "NT$" + data["data"]["price"];
            document.getElementById('newold').innerHTML = data["data"]["newold"];
            document.getElementById('city').innerHTML = data["data"]["city"];
            document.getElementById('count').innerHTML = "數量："+data["data"]["quantity"];
            if(data["data"]["transaction_1"] != "false"){
                 t1 = "711取貨付款";
                 d1=data["data"]["transaction_info_1"];
            }
            if(data["data"]["transaction_2"] != "false"){
                 t2="郵寄或宅配";
                 d2=data["data"]["transaction_info_2"];
            }
            if(data["data"]["transaction_3"] != "false"){
                 t3="面交";
                 d3=data["data"]["transaction_info_3"];
            }
            alltrans=t1+"  "+t2+"  "+t3;
            alldes=d1 +"  "+ d2 +"  " +d3;
          
            document.getElementById('transation').innerHTML=alltrans;
            document.getElementById('trandes').innerHTML = alldes;
            document.getElementById('datetime').innerHTML ="Posted at："+ (data["data"]["datetime"]).substring(0,10);
            document.getElementById('brand').innerHTML = data["data"]["brand"];
            document.getElementById('des').innerHTML = data["data"]["description"];
            let allpic =  (data["data"]["photo"]).substring(0,data["data"]["photo"].length-1);
            let countpic = allpic.split(',').length;
            
            let picList = document.getElementById("list"); //圖片div
            let PicLast = document.createElement("img");//產生最後一張圖片
            PicLast.setAttribute("src",allpic.split(',')[countpic-1]);//插入最後一張圖片
            picList.appendChild(PicLast);
            for(i=0;i<countpic;i++)
            {
               let allPic = document.createElement("img");//產生所有圖片
               allPic.setAttribute("src",allpic.split(',')[i]);//插入圖片
               picList.appendChild(allPic);
            }
            let PicFirst = document.createElement("img");//產生第一張圖片
            PicFirst.setAttribute("src",allpic.split(',')[0]);//插入圖片
            picList.appendChild(PicFirst);

            //輪播
            let container = document.getElementById('container');
            let list = document.getElementById('list');
            let prev = document.getElementById('prev');
            let next = document.getElementById('next');
            function animate (offset) {
                let newLeft = parseInt(list.style.left) + offset;
                    list.style.left = newLeft + 'px';
                    //一直滾動
                    if (newLeft > -600) {
                        list.style.left = -600 * (countpic) + 'px';
                    }
                    if (newLeft < -600 * (countpic)) {
                        list.style.left = -600 + 'px';
                    }
            }

         prev.onclick = function () {
             animate(600);
         };

         next.onclick = function () {
             animate(-600);
         
         };


        }
    });
}

//編輯商品
function edititem(){
    let productID=location.href.split('/product/')[1]; //取得商品ID
    window.location.href ="/uploadpic/"+productID;
}



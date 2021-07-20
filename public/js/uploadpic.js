window.onload = function(){
    load_old_product();
    checkuser();
 
        //立即刊登
        let form = document.getElementById("sellfrom");
        let trans_1 = document.getElementById("trans_1");
        let trans_2 = document.getElementById("trans_2");
        let trans_3 = document.getElementById("trans_3");
        form.addEventListener('submit',(event)=>{
            event.preventDefault();  
            let checkpage=location.href.split('/uploadpic/')[1]; 
            if(checkpage == "sell")
            {   
                let transdata = checktrans();
                if(savelfile.length == 0){
                    alert("刊登商品至少上傳一張照片！")
                }
                else if(trans_1.checked==false && trans_2.checked == false && trans_3.checked == false){
                    alert("交易方式至少選一種！")
                }
                else if (transdata==false){
                    return;
                }
                else{
                    let rbtval = RadioValue();
                    let form_Data = new FormData();
                    //把上傳圖片取出
                    let count = savelfile.length;
                    let allpic="";
                    for(let i=0;i<count;i++){
                        let item = savelfile[i];
                        form_Data.append("file", item);
                    }
                    form_Data.append("category", document.getElementById("infos").value);
                    form_Data.append("proname", document.getElementById("proname").value);
                    form_Data.append("brand", document.getElementById("brand").value);
                    form_Data.append("p_status", rbtval);
                    form_Data.append("price", document.getElementById("price").value);
                    form_Data.append("describe", document.getElementById("describe").value);
                    form_Data.append("quantity", document.getElementById("quantity").value);
                    form_Data.append("keyword1", document.getElementById("keyword1").value);
                    form_Data.append("keyword2", document.getElementById("keyword2").value);
                    form_Data.append("keyword3", document.getElementById("keyword3").value);
                    form_Data.append("trans_1", document.getElementById("trans_1").checked);
                    form_Data.append("trans_2", document.getElementById("trans_2").checked);
                    form_Data.append("trans_3", document.getElementById("trans_3").checked);
                    form_Data.append("t_des1", document.getElementById("t_des1").value);
                    form_Data.append("t_des2", document.getElementById("t_des2").value);
                    form_Data.append("t_des3", document.getElementById("t_des3").value);
                    console.log(form_Data)
                    fetch("/api/uploadpic/sell",{
                        method:"POST",
                        body: form_Data,
                        contentType: 'multipart/form-data',
                    }).then((response)=>{
                        return response.json();
                    }).then((data)=>{
                        if(data["error"] == null){
                            alert("刊登商品成功！")
                            window.location.href = "/personal/"+data["userid"]
                        }
                        else{
                            alert("刊登商品失敗，請洽管理員")
                        }
                    });
                }
            }

            else{
                    let transdata = checktrans();
                    //查看目前有幾張照片
                    let countpic=document.getElementById("show").getElementsByTagName("img").length;
                    if(countpic.length == 0){
                        alert("刊登商品至少上傳一張照片！")
                    }
                    else if(trans_1.checked==false && trans_2.checked == false && trans_3.checked == false){
                        alert("交易方式至少選一種！")
                    }
                    else if (transdata==false){
                        return;
                    }
                    else{
                        let rbtval = RadioValue();
                        let form_Data = new FormData();
                        //把上傳圖片取出
                        let count = savelfile.length;
                        let allpic="";
                        for(let i=0;i<count;i++){
                            let item = savelfile[i];
                            form_Data.append("file", item);
                        }
                        let allurl="";
                        for(let n=0;n<countpic;n++){
                        let c_https = document.getElementById("show").getElementsByTagName("img")[n].src.substring(0,5);
                        if(c_https=="https"){
                            allurl+=document.getElementById("show").getElementsByTagName("img")[n].src +",";
                            }
                        }       
                        form_Data.append("existfile", allurl);     
                        form_Data.append("category", document.getElementById("infos").value);
                        form_Data.append("proname", document.getElementById("proname").value);
                        form_Data.append("brand", document.getElementById("brand").value);
                        form_Data.append("p_status", rbtval);
                        form_Data.append("price", document.getElementById("price").value);
                        form_Data.append("describe", document.getElementById("describe").value);
                        form_Data.append("quantity", document.getElementById("quantity").value);
                        form_Data.append("keyword1", document.getElementById("keyword1").value);
                        form_Data.append("keyword2", document.getElementById("keyword2").value);
                        form_Data.append("keyword3", document.getElementById("keyword3").value);
                        form_Data.append("trans_1", document.getElementById("trans_1").checked);
                        form_Data.append("trans_2", document.getElementById("trans_2").checked);
                        form_Data.append("trans_3", document.getElementById("trans_3").checked);
                        form_Data.append("t_des1", document.getElementById("t_des1").value);
                        form_Data.append("t_des2", document.getElementById("t_des2").value);
                        form_Data.append("t_des3", document.getElementById("t_des3").value);
                        console.log(form_Data)
                        fetch("/api/uploadpic/"+checkpage,{
                            method:"PATCH",
                            body: form_Data,
                            contentType: 'multipart/form-data',
                        }).then((response)=>{
                            return response.json();
                        }).then((data)=>{
                            if(data["error"] == null){
                                alert("商品修改成功！")
                                window.location.href = "/personal/"+data["userid"]
                            }
                            else{
                                alert("刊登修改失敗，請洽管理員")
                            }
                        });
                    }
            }

         

        });
}


function checktrans(){
    let trans_1 = document.getElementById("trans_1");
    let trans_2 = document.getElementById("trans_2");
    let trans_3 = document.getElementById("trans_3");
    let t_des1 = document.getElementById("t_des1").value;
    let t_des2 = document.getElementById("t_des2").value;
    let t_des3 = document.getElementById("t_des3").value;
    if(trans_1.checked && t_des1 ==""){
        alert("7-Eleven 取貨付款相關資訊未填寫")
        return false;
    }
    if(trans_2.checked && t_des2 ==""){
        alert("郵寄宅配相關資訊未填寫")
        return false;
    }
    if(trans_3.checked && t_des3 ==""){
        alert("面交相關資訊未填寫")
        return false;
    }
    
}



//取得radio btn 的值
function RadioValue() {
    var ele = document.getElementsByName('p_status');
    for(let i = 0; i < ele.length; i++) {
        if(ele[i].checked == true){
            var rbt =  ele[i].value;
        }
    }
    return rbt;
} 


//上傳商品照片區
var savelfile=[];
var fileid=[];
function uploadpic(){
    var imgs="";
    let count=document.getElementById("show").getElementsByTagName("img").length;
    imgs = document.getElementById("show").getElementsByTagName("img");
    var len = imgs.length
   for (var i = 0; i < imgs.length; i++) 
   {
     if(len!=0){
      var bb = imgs[i].id;
     }
     else{
        len = 0;
     }
   }
    if(count >5){
        alert("上傳照片上限6張！")
    }
    else{
        if(len != 0){
            var newlen = bb.substring(bb.length-1);
            var nenew=parseInt(newlen)+1;
        }
        else{
            nenew = 0;
        }
        let file = document.getElementById("file").files;
        if(file.length > 0){
            let filereader = new FileReader();
            filereader.readAsDataURL(file[0]);
            filereader.onload=function(e)
            {
                let divshow=document.getElementById("show");
                let showpic =document.createElement("div");
                let show_id="show"+nenew;
                showpic.setAttribute("id",show_id);
                showpic.className="showpic";
                let pic = document.createElement("img");
                pic.setAttribute("src",e.target.result);
                let pic_id="pic"+nenew;
                pic.setAttribute("id",pic_id);
                pic.className="everypic";
                let p_x = document.createElement("p");
                p_x.setAttribute("onclick","deletepic("+show_id+","+pic_id+")");
                p_x.className="dele";
                p_x.innerHTML="X";
                showpic.appendChild(pic);
                showpic.appendChild(p_x);
                divshow.appendChild(showpic);
                savelfile.push(file[0]); //陣列紀錄上傳的圖片
                fileid.push(pic_id);//陣列紀錄上傳的圖片ID
                console.log(savelfile)
                console.log(savelfile[0])
                console.log(fileid)
            }
        }
    }
}

function deletepic(showid,picid){
    document.getElementById(showid.id).remove();
    let pic_id=picid.id;
    if(fileid.indexOf(picid)){
        let num=fileid.indexOf(pic_id);
        fileid.splice(num,1);
        savelfile.splice(num,1);
        console.log(num)
    }
}

function clk1(){
   let trans_1 = document.getElementById("trans_1").checked;
   if(trans_1 == true){
        t_des1.style.display="block";
   }
   else{
        t_des1.style.display="none";
   }
}

function clk2(){
    let trans_2 = document.getElementById("trans_2").checked;
    if(trans_2 == true){
         t_des2.style.display="block";
    }
    else{
         t_des2.style.display="none";
    }
 }

 function clk3(){
    let trans_3 = document.getElementById("trans_3").checked;
    if(trans_3 == true){
         t_des3.style.display="block";
    }
    else{
         t_des3.style.display="none";
    }
 }


 //回到個人頁面
 function gopersonal(){
    fetch("/api/personal",{
        method:"get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["login"]  == true){
            window.location.href = "/personal/"+data["userid"]
        }
    });
 }


 //編輯商品
 function load_old_product(){
    let uploadID=location.href.split('/uploadpic/')[1]; //取得商品ID
    let info ={"id":uploadID};
    fetch("/api/uploadpic/"+uploadID,{
        method:"GET"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["error"]  == null)
        {
            document.getElementById("infos").value=data["data"]["cat_sub_id"];
            document.getElementById("proname").value=data["data"]["name"];
            document.getElementById("brand").value=data["data"]["brand"];
            let pstatus = data["data"]["newold"];
            if(pstatus == "n1"){
                document.getElementById("new").checked=true;
            }
            if(pstatus == "n2"){
                document.getElementById("almostnew").checked=true;
            }
            if(pstatus == "n3"){
                document.getElementById("good").checked=true;
            }
            if(pstatus == "n4"){
                document.getElementById("soso").checked=true;
            }          
            document.getElementById("price").value=data["data"]["price"];
            document.getElementById("describe").value=data["data"]["description"];
            document.getElementById("quantity").value=data["data"]["quantity"];
            document.getElementById("keyword1").value=data["data"]["keyword1"];
            document.getElementById("keyword2").value=data["data"]["keyword2"];
            document.getElementById("keyword3").value=data["data"]["keyword3"];
            let check1 = data["data"]["transaction_1"];
            if(check1 == "true"){
                document.getElementById("trans_1").checked=true;
                document.getElementById("t_des1").value=data["data"]["transaction_info_1"];
                document.getElementById("t_des1").style.display="block";
            }
            let check2 = data["data"]["transaction_2"];
            if(check2 == "true"){
                document.getElementById("trans_2").checked=true;
                document.getElementById("t_des2").value=data["data"]["transaction_info_2"];
                document.getElementById("t_des2").style.display="block";
            }
            let check3 = data["data"]["transaction_3"];
            if(check3 == "true"){
                document.getElementById("trans_3").checked=true;
                document.getElementById("t_des3").value=data["data"]["transaction_info_3"];
                document.getElementById("t_des3").style.display="block";
            }
 
            let allphoto = (data["data"]["photo"]).substring(0,data["data"]["photo"].length-1).split(',');
            let count = allphoto.length;
            for(let i=0;i<count;i++){
                let divshow=document.getElementById("show");
                let showpic =document.createElement("div");
                let show_id="show"+i;
                showpic.setAttribute("id",show_id);
                showpic.className="showpic";
                let pic = document.createElement("img");
                pic.setAttribute("src",allphoto[i]);
                let pic_id="pic"+i;
                pic.setAttribute("id",pic_id);
                pic.className="everypic";
                let p_x = document.createElement("p");
                p_x.setAttribute("onclick","deletepic("+show_id+","+pic_id+")");
                p_x.className="dele";
                p_x.innerHTML="X";
                showpic.appendChild(pic);
                showpic.appendChild(p_x);
                divshow.appendChild(showpic);
            }
        }
    }).catch((e) => {
        console.log(e,",登入data失敗內容~~~~~~~~~~~")
    });
 }
window.onload = function(){
    checkuser();
    //提交個人檔案
    let form1 = document.getElementById("form1");
    form1.addEventListener('submit',(event)=>{
        event.preventDefault();   
        let nopic = "https://d1wcop1hy1uawh.cloudfront.net/nopic.png";
        let files;
        let uploadfile =  document.getElementById("file").files[0];
        let userphoto =document.getElementById("uppic").src;
        let picture;
        if(uploadfile != undefined){
            files = document.getElementById("file").files[0];
        }
        else{
            if(userphoto == nopic){
                files = undefined;
                picture="";
            }
            else{
                files = undefined;
                picture=userphoto;
            }
        }
            
        let form_Data = new FormData();
        form_Data.append("form", "form1");
        form_Data.append("file", files);
        form_Data.append("userphoto", picture);
        form_Data.append("uname", document.getElementById("uname").value);
        form_Data.append("uintro", document.getElementById("uintro").value);
        form_Data.append("city", document.getElementById("mycity").value);
        form_Data.append("gender", document.getElementById("gender").value);
        fetch("/api/profile",{
            method:"PATCH",
            body: form_Data,
            contentType: 'multipart/form-data',
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data["error"] == null){
                alert("個人資料修改成功！")
                window.location.href = "/personal/"+data["userid"]
            }
            else{
                alert("個人資料修改失敗，請洽管理員")
            }
        });

    });
    
    //提交修改密碼
    let form2 = document.getElementById("form2");
    form2.addEventListener('submit',(event)=>{
        event.preventDefault();
        let oldpsw = document.getElementById("oldpsw").value;
        let newpsw = document.getElementById("newpsw").value;
        let chnewpsw = document.getElementById("chnewpsw").value;
        if(newpsw == oldpsw){
            alert("新密碼與舊密碼不可相同")
        }
        else if(newpsw != chnewpsw){
            alert("新密碼與新密碼確認不符")
        }
        else{
            let form_Data = new FormData();
            form_Data.append("form", "form2");
            form_Data.append("psw", newpsw);
            fetch("/api/profile",{
                method:"PATCH",
                body: form_Data
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                if(data["error"] == null){
                    alert("密碼修改成功！")
                    window.location.href = "/personal/"+data["userid"]
                }
                else{
                    alert("密碼修改失敗，請洽管理員")
                }
            });
        }
    });

        //一進來先載入個人資料
        myprofile();

}

//個人資料
function myprofile(){
    fetch("/api/profile",{
        method:"GET"
    }).then((response)=>{
        return response.json();
    }).then((val)=>{
        if(val["error"] == null){
            document.getElementById("email").value=val["data"]["email"];
            document.getElementById("uname").value=val["data"]["name"];
            document.getElementById("uintro").value=val["data"]["intro"];
            if(val["data"]["gender"] == ""){
                document.getElementById("gender").value="0";
            }
            else{
                document.getElementById("gender").value=val["data"]["gender"];
            }
            if(val["data"]["city"] == ""){
                document.getElementById("mycity").value="0";
            }
            else{
                document.getElementById("mycity").value=val["data"]["city"];
            }
            document.getElementById("uppic").setAttribute("src",val["data"]["photo"]);
        }
        else{
            alert("頁面發生問題，請洽管理員")
        }
       
    });
}

function changepic(){
    let file = document.getElementById("file").files;
    if(file.length > 0){
        let filereader = new FileReader();
        filereader.readAsDataURL(file[0]);
        filereader.onload=function(e){
            document.getElementById("uppic").setAttribute("src",e.target.result);
        }
    }
}

function m_profile(){
    let ct1 = document.getElementById("ct1");
    let ct2 = document.getElementById("ct2");
    ct1.style.display="block";
    ct2.style.display="none";
}

function m_password(){
    let ct1 = document.getElementById("ct1");
    let ct2 = document.getElementById("ct2");
    ct1.style.display="none";
    ct2.style.display="block";
}






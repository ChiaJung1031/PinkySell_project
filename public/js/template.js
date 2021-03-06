window.onload = function(){
    checkuser();
}

function checkuser(){
    fetch("/api/user",{
        method:"GET"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["login"] == true){
            document.getElementById("userid").style.display="block";
            document.getElementById("logout").style.display="block";
            document.getElementById("signup").style.display="none";
            document.getElementById("signin").style.display="none";
            document.getElementById("userid").innerHTML="HELLO,@"+data["userid"];
            document.getElementById("selfpic").src=data["photo"];
        }
        else{
            let signin_content = document.getElementById("signin_content");
            signin_content.style.display = "block"
            let addcss = document.getElementById("addcss");
            addcss.style.marginLeft="35px";

        }
    }).catch((e) => {
        console.log(e)
    });
}

function login(){
    let msg = document.getElementById("errmsg_login");
    msg.style.display = "none";
    document.getElementById("id_account").value="";
    document.getElementById("id_pwd").value="";
    let modal = document.getElementById("myModal");
    let close = document.getElementById("close");
    let signup_content = document.getElementById("signup_content");
    signup_content.style.display = "none"
    let signin_content = document.getElementById("signin_content");
    signin_content.style.display = "block"
    modal.style.display = "block";
    close.onclick = function()
    {
        modal.style.display = "none";
    }

    window.onclick = function(event) 
    {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function signup(){
    let signup_content = document.getElementById("signup_content");
    signup_content.style.display = "block"
    let msg = document.getElementById("errmsg");
    msg.style.display = "none";
    let modal = document.getElementById("myModal");
    let signin_content = document.getElementById("signin_content");
    signin_content.style.display = "none"
    modal.style.display = "block";

    let signupclose = document.getElementById("signupclose");
    
    document.getElementById("sign_account").value="";
    document.getElementById("sign_email").value="";
    document.getElementById("sign_pwd").value="";
    document.getElementById("sign_name").value="";
    signupclose.onclick = function()
    {
        modal.style.display = "none";
    }
    window.onclick = function(event) 
    {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

//??????????????????????????????
function haveAccount(){
    document.getElementById("id_account").value="";
    document.getElementById("id_pwd").value="";
    let modal = document.getElementById("myModal");
    let signin_content = document.getElementById("signin_content");
    signin_content.style.display = "block"
    let signup_content = document.getElementById("signup_content");
    signup_content.style.display = "none"
    let close = document.getElementById("close");
    close.onclick = function()
    {
        modal.style.display = "none";
    }
    window.onclick = function(event) 
    {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

//????????????????????????
function btn_signup(){
    let req = new XMLHttpRequest();
    let userid = document.getElementById("sign_account").value;
    let name = document.getElementById("sign_name").value;
    let email = document.getElementById("sign_email").value;
    let pwd = document.getElementById("sign_pwd").value;
    if (name== "" || email == "" || pwd=="" || userid=="")
    {
        let msg = document.getElementById("errmsg");
        msg.style.display = "block";
        msg.innerHTML="???????????????";
    }
    else
    {
        if(email.includes("@"))
        {
            let msg = document.getElementById("errmsg");
            msg.style.display = "none";
            let register_info ={"name":name,"email":email,"password":pwd,"userid":userid};
            console.log(register_info)
            fetch("/api/user",{
                method:"POST",   
                body: JSON.stringify(register_info),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                if(data["error"] == null){
                    alert("???????????????")
                    document.getElementById("signup_content").style.display="none";
                    document.getElementById("signin_content").style.display="block";
                }
                else{
                    msg.style.display = "block";
                    msg.innerHTML="???????????????"+data["errmsg"];
                }
            }).catch((e) => {
                console.log(e,",data????????????~~~~~~~~~~~")
            });
        }
        else{
            msg.style.display = "block";
            msg.innerHTML="??????????????????";
        }
    }
}

//??????????????????
function btn_signin(){
    let userid = document.getElementById("id_account").value;
    let pwd = document.getElementById("id_pwd").value;
    let errmsg_login = document.getElementById("errmsg_login");
    let login_info = {"userid": userid, "password": pwd};
    if (pwd=="" || userid=="")
    {
        errmsg.style.display = "block";
        errmsg.innerHTML="???????????????";
    }
    else{
        fetch("/api/user",{
            method:"PATCH",   
            body: JSON.stringify(login_info),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data["error"]  != null){
                errmsg_login.style.display="block";
                errmsg_login.innerHTML="???????????????????????????";
            }
            else{
                //???????????????????????????
                location.reload();
            }
        }).catch((e) => {
            console.log(e,",??????data????????????~~~~~~~~~~~")
        });
    }
}


//??????
function logout(){
    fetch("/api/user",{
        method:"DELETE",  
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["ok"]  == true){
            window.location.href = '/'
        }
    });
}


//??????????????????
function gotoself(){
    fetch("/api/userinfo",{
        method:"get"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["login"]  == true){
            window.location.href = "/personal/"+data["userid"]
        }
    });
}

//?????????
function goindex(){
    window.location.href = "/";
}

function index(){
    window.location.href = "/";
}

//????????????
function gosell(){
    fetch("/api/userinfo",{
        method:"GET"
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["login"]  == true){
            window.location.href = "/uploadpic/sell";
        }
        else{
            alert("?????????????????????")
        }
    });
}
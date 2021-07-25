window.onload=function(){
    checkuser();
    let page=location.href.split('/itemlist/')[1];
    if(page == "buy"){
        getitemlist();
    }
    else if(page == "sale"){
        saledata();
    }
  
}

function getitemlist(){
    document.getElementById("ct2").style.display="none";
    document.getElementById("ct1").style.display="block";
    fetch("/api/itemlist/"+"buy"
          ).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data["data"] != "nodata"){
            let tbody = document.getElementById("tbody");
            for(let i=0;i<data.length;i++){
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                let td3 = document.createElement("td");
                let td4 = document.createElement("td");
                let td1_txt = document.createTextNode(data[i]["name"]);
                let td2_txt = document.createTextNode("NT$"+data[i]["price"]);
                let td3_txt = document.createTextNode(data[i]["cre_datetime"].substring(0,10));
                let td4_txt = document.createTextNode(data[i]["seller_id"]);
                td1.appendChild(td1_txt);
                td2.appendChild(td2_txt);
                td3.appendChild(td3_txt);
                td4.appendChild(td4_txt);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tbody.appendChild(tr);
            }
        }
        else{
           let ct1 = document.getElementById("ct1");
           let div = document.createElement("div");
           div.className="nodata";
           let div_txt = document.createTextNode("無購買紀錄");
           div.appendChild(div_txt);
           ct1.appendChild(div);
           document.getElementById("table").style.display="none";
        }
    });
}

//點選我的購買清單
function m_buy(){
    window.location.href = "/itemlist/"+"buy";
}

//點選我的銷售清單
function m_sale(){
    window.location.href = "/itemlist/"+"sale";
}

function saledata(){
    document.getElementById("ct1").style.display="none";
    document.getElementById("ct2").style.display="block";
        fetch("/api/itemlist/"+"sale"
        ).then((response)=>{
    return response.json();
    }).then((data)=>{
    if(data["data"] != "nodata"){
            let tbody = document.getElementById("tbody2");
            for(let i=0;i<data.length;i++){
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                let td3 = document.createElement("td");
                let td4 = document.createElement("td");
                let td1_txt = document.createTextNode(data[i]["name"]);
                let td2_txt = document.createTextNode("NT$"+data[i]["price"]);
                let td3_txt = document.createTextNode(data[i]["cre_datetime"].substring(0,10));
                let td4_txt = document.createTextNode(data[i]["buyer_id"]);
                td1.appendChild(td1_txt);
                td2.appendChild(td2_txt);
                td3.appendChild(td3_txt);
                td4.appendChild(td4_txt);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tbody.appendChild(tr);
            }
        }
        else{
            let ct1 = document.getElementById("ct1");
            let div = document.createElement("div");
            div.className="nodata";
            let div_txt = document.createTextNode("無銷售紀錄");
            div.appendChild(div_txt);
            ct1.appendChild(div);
            document.getElementById("table").style.display="none";
            document.getElementById("table2").style.display="none";
        }
    });
}
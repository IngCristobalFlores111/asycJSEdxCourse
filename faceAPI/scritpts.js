(function(){
let img = document.getElementById("img");
let listResults = document.getElementById("list");
let btn = document.getElementById("btn");
let urlInput = document.getElementById("urlInput");
 const checkImageExists=(imageUrl, callBack)=> {
    var imageData = new Image();
    imageData.onload = function() {
    callBack(true);
    };
    imageData.onerror = function() {
    callBack(false);
    };
    imageData.src = imageUrl;
    }
    const handleResponse = (response)=>{
        if(response.ok){
          return response.json();
        }else{
          return Promise.reject(new Error(response.statusText));
        }
      }
    const handleData = (data)=>{
     
     img.setAttribute("src",url);
     img.style.display ="block";
     console.log(data);


    }
    const analyseImg = (Imgurl)=>{
 
    checkImageExists(Imgurl,(exists)=>{
        if(!exists){
        alert("not valid image url");
        return;
        }
        
        let reqBody = {
            "url": Imgurl
        }
        let myHeader =  new Headers({
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key':'f91b5507cdfe48e89ac57f509b35ff0f'
        });
        let initObject = {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: myHeader
                }
        var url  ="https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    
        let request = new Request(url,initObject);

         fetch(request).then(handleResponse).then(handleData).catch((err)=>{
            img.style.display ="none"; 
            alert("upss... "+err);
         });
    });

 


    }
    btn.addEventListener("click",()=>{
        analyseImg(urlInput.value);
    });





})()
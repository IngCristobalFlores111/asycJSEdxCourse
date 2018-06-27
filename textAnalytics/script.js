
(function(){
    let btn=document.getElementById("btn");
    let query = document.getElementById("query");
    let result = document.getElementById("results");
    let cachedResults ={};
    let recentQuery = "";
    const handleResponse = (response)=>{
      if(response.ok){
        return response.json();
      }else{
        return Promise.reject(new Error(response.statusText));
      }
    }
    const handleData = (data)=>{
      if(!cachedResults[recentQuery]){
        cachedResults[recentQuery] = data;
      }
     let keyPhrases = data.documents[0].keyPhrases;
    let title = document.createElement("h4");
    title.innerHTML ="Number of key phrases:"+keyPhrases.length+" "+new Date().toLocaleString();
    let ulist = document.createElement("ul");
     for(let k of keyPhrases){
       let li = document.createElement("li");
       li.innerHTML = k;
       ulist.appendChild(li);
     }
     let details = document.createElement("details");
     details.innerHTML="<summary>Show Query made</summary><p>"+recentQuery+"</p>";

     let cont = document.createElement("div");
     cont.appendChild(title);
     cont.appendChild(details);
     cont.appendChild(ulist);
     result.prepend(cont);
     
    }

    const analyse = (inputText)=>{
       inputText = inputText.trim();
        if(inputText.length==0){
             alert("input text cant be empty");
             return;
        }
        recentQuery = inputText; 
        if(cachedResults[recentQuery]){
            handleData(cachedResults[recentQuery]);
            return;
        }
      var reqBody = {
          "documents": [
              {
              "language":"en",
              "id" : 1,
              "text": inputText
              }
          ]
      };
  
      var myHeader =  new Headers({
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key':'81d46840b5434a428e7bdc38d79b8dc6'
      });
        var initObject = {
          method: 'POST',
          body: JSON.stringify(reqBody),
          headers: myHeader,
          mode:"cors"
      }
      let url = 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases';
     var request = new Request(url, initObject);
    fetch(request).then(handleResponse).then(handleData).catch((err)=>{
     alert("Upss..."+err);

    });
        
      
    }
    
    btn.onclick = function(){
       analyse(query.value);

    }

    
    
    
  })()
  
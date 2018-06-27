(function(){

let input = document.getElementById("input");
let filmsText = document.getElementById("filmsText");
let charactersList = document.getElementById("charactersList");
let btn = document.getElementById("btn");
function *gen(){

    let value = input.value;
    if(value>7 || value<1){
        throw new Error("Invalid Input - Enter a number between 1 and 7");
    }
    let initObject = {
        headers: new Headers(),
        mode:"cors",
        method:"GET"
    }
    let filmResponse = yield fetch("https://swapi.co/api/films/" + value,initObject);
    let film = yield filmResponse.json();
    let characters = film.characters;
     filmsText.innerHTML ="Film:<br>"+film.title+"<br><blockquote>"+film.opening_crawl+"</blockquote>";
    for(let c of characters){
        let charactersResp = yield fetch(c,initObject);
        let character = yield charactersResp.json();
        console.log(character);
        charactersList.innerHTML+="<li>"+character.name+"</li>";
    }


}

    const run=(genFunc)=>{
        const genObject= genFunc(); //creating a generator object
    
        function iterate(iteration){ //recursive function to iterate through promises
            if(iteration.done) //stop iterating when done and return the final value wrapped in a promise
                return Promise.resolve(iteration.value);
            return Promise.resolve(iteration.value) //returns a promise with its then() and catch() methods filled
            .then(x => iterate(genObject.next(x))) //calls recursive function on the next value to be iterated
            .catch(x => iterate(genObject.throw(x))); //throws an error if a rejection is encountered
        }
    
        try {
            return iterate(genObject.next()); //starts the recursive loop
        } catch (ex) {
            return Promise.reject(ex); //returns a rejected promise if an exception is caught
        }
    }

   btn.addEventListener("click",()=>{
       run(gen).catch((err)=>{
           alert("upss..."+err);
       });
   }); 


})()
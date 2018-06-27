(function(){
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
    // select controls
    let shipsSelect1 = document.getElementById("ships1");
    let shipsSelect2 = document.getElementById("ships2");
    //table td
    let shipsDom = {
        "name":document.getElementsByClassName("starShipName"),
        "cost_in_credits":document.getElementsByClassName("starShipCost"),
        "max_atmosphering_speed": document.getElementsByClassName("starShipSpeed"),
        "cargo_capacity":document.getElementsByClassName("starShipCargo"),
        "passengers":document.getElementsByClassName("starShipPassangers")
    }
 
    fetch("ships.json").then((resp)=>resp.json()).then((ships)=>{
      let html ="";
        for(ship of ships){
       html+='<option value="'+ship.value+'">'+ship.name+'</option>';
      }
      shipsSelect1.innerHTML = html;
      shipsSelect2.innerHTML = html;
    }).catch((resp)=>alert);

function* gen(){
    let ship1Value = shipsSelect1.value;
    let ship2Value = shipsSelect2.value;
    let url ="https://swapi.co/api/starships/";
    let initObject = {
        headers: new Headers(),
        mode:"cors",
        method:"GET"
    }
    let resp1 = yield fetch(`${url}${ship1Value}/`,initObject);
    let ship1 = yield resp1.json();
    let resp2 = yield fetch(`${url}${ship2Value}/`,initObject);
    let ship2 = yield resp2.json();

    for(let data in shipsDom){
        let value1 = ship1[data];
        let value2  = ship2[data];
        shipsDom[data][0].innerHTML = value1;
        shipsDom[data][1].innerHTML = value2;
        if(data!=='name'){
            value1 = parseInt(value1);
            value2 = parseInt(value2);
            if(value1!==value2){
                if(value1>value2){
                    shipsDom[data][0].style.backgroundColor ="red";
                    shipsDom[data][1].style.backgroundColor ="";
                }else{
                    shipsDom[data][0].style.backgroundColor ="";
                    shipsDom[data][1].style.backgroundColor ="red";
                }
            }else{
                shipsDom[data][0].style.backgroundColor ="";
                shipsDom[data][1].style.backgroundColor ="";
            }
        }
    }
}

document.getElementById("btn").addEventListener("click",function(){
run(gen).catch((err)=>{
    alert("upsss"+err);
});

});

})()
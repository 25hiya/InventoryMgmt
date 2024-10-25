var button = document.getElementById("orderMore");
var grandTotal = document.getElementById("grandTotal")
var rows = document.getElementsByClassName("order")
var eventListener = document.querySelectorAll(".eventListener")
var date = document.querySelectorAll("#date")


eventListener.forEach(function(input){
    input.addEventListener("input", function(){
        calculatingTotal(calculatingGrandTotal);
    })
})

function calculatingTotal(callBackFun){
    for(var i=0; i<rows.length;i++){
        //total[i].value = price[i].value*orderQuantity[i].value;
        rows[i].querySelector("#total").value = rows[i].querySelector("#price").value * rows[i].querySelector("#qty").value 
        
    }
    callBackFun()
}   

function calculatingGrandTotal(){
    var sum = 0;
     for(var i = 0; i<rows.length; i++){
        sum+= parseInt(rows[i].querySelector("#total").value) 
     }
     grandTotal.value = sum
}

j=1
button.addEventListener("click", function(e){
    e.preventDefault();
    var table = document.querySelector("#table");
    j++;    
    var row= document.querySelector(".order");
    var newRow = row.cloneNode(true);
    var tds = newRow.querySelectorAll("td");
    tds[2].querySelector("input").value = ""
    tds[3].querySelector("input").value = ""    
    tds[1].querySelector("input").value = ""    
    newRow.setAttribute("id", "order" + j )
    newRow.addEventListener("input", function(){
        calculatingTotal(calculatingGrandTotal)
    })
    table.appendChild(newRow);

})


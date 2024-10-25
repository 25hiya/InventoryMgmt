var eventListener = document.querySelectorAll(".eventListener")
var products = document.querySelector("#product");
var sales = document.querySelectorAll("#sales")
var totals = document.querySelectorAll("#total")
var prices = document.querySelectorAll("#price")
var out = document.querySelectorAll("#out");
var ret = document.querySelectorAll("#returned")
var grandTotalValue = document.querySelector("#grandTotal")
var subButton = document.querySelector("#sub")
var subInput = document.querySelector("#deductions")
var collections= document.querySelector("#collections")


function main(){
    eventListener.forEach(function (input) {                        //eventListener is the name of the variable.
        input.addEventListener("input", function (e) {
            calculatingSales();
            calculatingTotal(calculatingGrandTotal);
        });
    })
    calculatingCashSales()
}

function calculatingSales(){
    for(var i =0; i<sales.length; i++){
        sales[i].value = out[i].value - ret[i].value
   }
}

function calculatingTotal(callBackFun){
    for(var i =0; i<totals.length; i++){
        totals[i].value = sales[i].value*prices[i].value 
    }
    callBackFun();
}

function calculatingGrandTotal(){
    var sum = 0;

    for(var i = 0; i<totals.length; i++){
        sum+= parseInt(totals[i].value) 
    }
    grandTotalValue.value = sum
    collections.value = grandTotalValue.value
}

prices.forEach(function(price){
    price.addEventListener("input", function(){
        calculatingTotal(calculatingGrandTotal);

    })
})

function calculatingCashSales(){
    collections.value=grandTotalValue.value
    var inputs = td.querySelectorAll("input");
    var collectionValue = grandTotalValue.value;
    for(let input of inputs){
       collectionValue -= input.value;
    }
    collections.value = collectionValue;
}

var td = document.querySelector("#moreSubtractions");
subButton.addEventListener("click", function(e){
    e.preventDefault()
    newInput = subInput.cloneNode(true);
    newInput.value = "";
    newInput.addEventListener("input", function(){
        calculatingCashSales();
    })
    td.append(newInput);   
})




main();



function monthlyReport(){
    
}

let purchaseAmts=[]
let purchaseQty=[]
let salesAmts=[]
let salesQty=[]
const salesSheets = await SalesSheets.find();
let salesAmt=0
const purchaseOrders = await PurchaseOrder.find();
let purchaseAmt = 0
let total=0
date=new Date()
let currentMonth = date.getMonth()+1
const products = await Product.find()
let dairyProducts=[]
for(let product of products){
    if(product.categories == "Creambell"){
        let dairyProduct = product.product
        dairyProducts.push(dairyProduct)
        for(let salesSheet of salesSheets){
            for(let products of salesSheet.productName){
                if(products==product){
                    let month = salesSheet.date.getMonth()+1
                    if(month == currentMonth){
                        let index = salesSheet.productName.indexOf(products)
                        salesAmt+=salesSheet.total[index]
                        total += salesSheet.sales[index]
                    }
    
                }
            }
        } 
        salesAmts.push(salesAmt)
        salesQty.push(total)
        console.log(salesAmts, total)
    }
}
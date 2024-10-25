const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const CustomerCredits = require("../models/customerCredit")
const SalesSheets = require("../models/salesSheets")
const Product=  require("../models/products")
const {requireLogin} = require("../middleware");
const PurchaseOrder = require("../models/purchaseOrder");
app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())


router.get("/home", requireLogin, async(req, res)=>{
    const customerCredit = await CustomerCredits.find();
    const purchaseOrders = await PurchaseOrder.find();
    const products = await Product.find()
    let dairyProducts = []  
    let productSales = []
    let totalSales=0
    let dailySales = 0
    let cashSales = 0
    const Currentdate = new Date();
    currentMonth = Currentdate.getMonth()+1
    const salesSheets = await SalesSheets.find();
    for(let salesSheet of salesSheets){
        let month = salesSheet.date.getMonth()+1
        if(month == currentMonth){
            totalSales += salesSheet.grandTotal
        }
        if(Currentdate.toDateString() == salesSheet.date.toDateString()){
            cashSales += salesSheet.collections
        }
    }
    var totalSalesCE = []
    var total=0
    var printedNames =[];
    for(i=0; i<salesSheets.length; i++){
        while(!(printedNames.includes(salesSheets[i].ceName))){
            printedNames.push(salesSheets[i].ceName);
        }
    }
    for(let printedName of printedNames){
        for(let salesSheet of salesSheets){
            if(salesSheet.ceName == printedName){
                total += salesSheet.grandTotal
            }
        }
        totalSalesCE.push(total);
    }
    let newArray = totalSalesCE.sort().reverse();

    for(let product of products){
        if(product.categories == "Creambell"){
            let dairyProduct= product.product
            dairyProducts.push(dairyProduct)
            let qtyTotal = 0
            for(let salesSheet of salesSheets){
                month = salesSheet.date.getMonth()+1;
                if(month == currentMonth){
                    for(let saleItems of salesSheet.productName){
                        if(saleItems == dairyProduct){
                            let index = salesSheet.productName.indexOf(saleItems);
                            qtyTotal +=salesSheet.sales[index]
                        }
                    }
                }
                         
            }
            productSales.push(qtyTotal)

        }
    }

    let orderedArray = productSales.sort().reverse()
    res.render("home", {customerCredit, totalSales, dailySales, cashSales, printedNames, totalSalesCE, newArray,  purchaseOrders, orderedArray, productSales, dairyProducts})
})

module.exports = router;
const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/products");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const PurchaseOrder = require("../models/purchaseOrder");
const SalesSheets = require("../models/salesSheets");
const {requireLogin} = require("../middleware")

app.use(methodOverride("_method"));

app.use("/public", express.static("./public/"));
app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())


router.get("/", requireLogin, (req, res)=>{
    res.render("monthlyReports/new")
})


router.get("/new", requireLogin, async(req, res)=>{
    const products = await Product.find();
    const salesSheets  = await SalesSheets.find();
    const purchaseOrders = await PurchaseOrder.find();
    let purchaseAmts = []
    let beverageProducts = []
    let salesAmts=[]
    let salesQty = []
    let purchaseQty = []
    let dairyProducts = []
    let beverageSales = []
    let beverageSalesQty = []
    let beveragePurchase=[]
    let beveragePurchaseQty=[]
    let currentDate = new Date();
    currentMonth = currentDate.getMonth()+1
    for(let product of products){
        if(product.categories == "Creambell"){
            let dairyProduct= product.product
            dairyProducts.push(dairyProduct)
            let salesAmt = 0
            let purchaseAmt = 0
            let qtyTotal = 0
            let qtyTotalPurchase=0
            for(let salesSheet of salesSheets){
                month = salesSheet.date.getMonth()+1;
                if(month == currentMonth){
                    for(let saleItems of salesSheet.productName){
                        if(saleItems == dairyProduct){
                            let index = salesSheet.productName.indexOf(saleItems);
                            qtyTotal +=salesSheet.sales[index]
                            salesAmt+=salesSheet.total[index]
                        }
                    }
                }
                         
            }
            salesQty.push(qtyTotal)
            salesAmts.push(salesAmt);
            for(let purchaseOrder of purchaseOrders){
                month = purchaseOrder.date.getMonth()+1;
                if(month == currentMonth){
                    for(let purchaseItems of purchaseOrder.itemsOrdered){
                        if(purchaseItems == dairyProduct){
                            console.log(purchaseItems)
                            let index = purchaseOrder.itemsOrdered.indexOf(purchaseItems);
                            qtyTotalPurchase = purchaseOrder.quantity[index]
                            purchaseAmt+=purchaseOrder.total[index]
                        }
                    }
                }
            }
            purchaseQty.push(qtyTotalPurchase)
            purchaseAmts.push(purchaseAmt);
        }else if(product.categories == "Pepsi"){
            let beverage = product.product;
            beverageProducts.push(beverage)
            let salesAmt = 0
            let purchaseAmt = 0
            let qtyTotal = 0
            let qtyTotalPurchase=0
            for(let salesSheet of salesSheets){
                month = salesSheet.date.getMonth()+1;
                if(month == currentMonth){
                    for(let saleItems of salesSheet.productName){
                        if(saleItems == beverage){
                            let index = salesSheet.productName.indexOf(saleItems);
                            qtyTotal +=salesSheet.sales[index]
                            salesAmt+=salesSheet.total[index]
                        }
                    }
                }
                         
            }
            beverageSales.push(salesAmt)
            beverageSalesQty.push(qtyTotal)
            for(let purchaseOrder of purchaseOrders){
                month = purchaseOrder.date.getMonth()+1;
                if(month == currentMonth){
                    for(let purchaseItems of purchaseOrder.itemsOrdered){
                        if(purchaseItems == beverage){
                            console.log(purchaseItems)
                            let index = purchaseOrder.itemsOrdered.indexOf(purchaseItems);
                            qtyTotalPurchase = purchaseOrder.quantity[index]
                            purchaseAmt+=purchaseOrder.total[index]
                        }
                    }
                }
            }
            beveragePurchase.push(qtyTotalPurchase)
            beveragePurchaseQty.push(purchaseAmt);
        }
    }
    res.render("monthlyReports/new", {dairyProducts, salesAmts, purchaseAmts, salesQty, purchaseQty, beverageProducts, beverageSales, beverageSalesQty, beveragePurchaseQty, beveragePurchase})    
})


module.exports=router
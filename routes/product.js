const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/products");
const PurchaseOrders = require("../models/purchaseOrder")
const SalesSheets = require("../models/salesSheets")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {productSchema} = require("../schemas");
const {requireLogin} = require("../middleware")
app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const validateProduct = (req, res, next)=>{   
    const {error} = productSchema.validate(req.body); 
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const products = await Product.find();
    res.render("products/index", {products});
}));


router.get("/new", requireLogin, catchAsync(async(req, res)=>{
    const categories = await Product.schema.path("categories").enumValues;
    res.render("products/new", {categories});
}));

router.post("/", validateProduct, catchAsync(async(req, res)=>{ 
    //if(!req.body) throw new ExpressError("Invalid form input", 400);
    const newProduct= new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect("/products/"); 
    
}));

router.get("/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params;
    var qty=0 
    var purchase = 0
    const purchaseOrders  = await PurchaseOrders.find();
    const salesSheets = await SalesSheets.find();
    const foundProduct = await Product.findById(id);

    for(let salesSheet of salesSheets){
        const foundProduct = await Product.findById(id);
        for(let product of salesSheet.productName){
            if(product == foundProduct.product){
                let index = salesSheet.productName.indexOf(product)
                qty += salesSheet.sales[index];   
            }
        }
    }
    for(let purchaseOrder of purchaseOrders){
        for(let product of purchaseOrder.itemsOrdered){
        const foundProduct = await Product.findById(id);
            console.log(product)
            if(product == foundProduct.product){
                console.log(product)
                let index = purchaseOrder.itemsOrdered.indexOf(product)
                purchase += purchaseOrder.quantity[index];
            }
        }
    }
    console.log(purchase)
    res.render("products/details", {foundProduct});
}));


router.get("/update/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params; 
    const foundProduct = await Product.findById(id);
    const categories = Product.schema.path("categories").enumValues;
    res.render("products/edit", {foundProduct, categories});
}));

router.put("/edit/:id", requireLogin, validateProduct, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new:true})
    res.redirect(`/products/${updated._id}`)
}));

router.delete("/delete/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params; 
    await Product.findByIdAndDelete(id);
    res.redirect("/products/")
}));

router.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404))
})

router.use((err, req, res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) err.message="Something went wrong. Please try again"
    res.status(statusCode).render("error", {err})
    res.redirect("/products/")
})


 
module.exports = router;

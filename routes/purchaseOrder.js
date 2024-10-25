const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/products");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const PurchaseOrder = require("../models/purchaseOrder");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const {purchaseOrderSchema} = require("../schemas");
const {requireLogin} = require("../middleware")
app.use(methodOverride("_method"));

app.use("/public", express.static("./public/"));
app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const validatePurchaseOrder = (req, res, next)=>{
    const {error} = purchaseOrderSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const purchaseOrders = await PurchaseOrder.find();
    res.render("purchaseOrders/index", {purchaseOrders});
}))


router.get("/new", requireLogin, catchAsync(async(req, res)=>{
    const products = await Product.find();
    res.render("purchaseOrders/new", {products});
}))


router.post("/", validatePurchaseOrder, catchAsync(async(req, res)=>{
    const newPurchaseOrder = new PurchaseOrder(req.body)
    await newPurchaseOrder.save();
    res.redirect("/purchaseOrders/")
}))

router.get("/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const foundOrders = await PurchaseOrder.findById(id)
    res.render("purchaseOrders/details", {foundOrders})
}))

router.get("/:id/edit", requireLogin, catchAsync(async(req, res)=>{
    let id = req.params.id
    foundOrders = await PurchaseOrder.findById(id);
    res.render("purchaseOrders/edit", {foundOrders})
}))

router.put("/:id/update", validatePurchaseOrder, catchAsync(async(req, res)=>{
    const {id} = req.params
    const updatedRemark = await PurchaseOrder.findByIdAndUpdate(id, req.body, {runValidators: true, new:true})
    res.redirect(`/purchaseOrders/${updatedRemark._id}`)
}))

router.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404))
})

router.use((err, req, res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) err.message="Something went wrong. Please try again"
    res.status(statusCode).render("error", {err})
})


module.exports = router;

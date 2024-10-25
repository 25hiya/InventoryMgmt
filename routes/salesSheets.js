const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/products");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const SalesSheet = require("../models/salesSheets");
const {requireLogin} = require("../middleware")

app.use(methodOverride("_method"));

app.use("/public", express.static("./public/"));
app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const {salesSheetSchema} = require("../schemas");

const validateSalesSheets = (req, res, next)=>{
    const {error} = salesSheetSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const salesSheets = await SalesSheet.find()
    var printedNames =[];
    for(i=0; i<salesSheets.length; i++){
        while(!(printedNames.includes(salesSheets[i].ceName))){
            printedNames.push(salesSheets[i].ceName);
        }
    }
    res.render("salesSheets/index", {salesSheets, printedNames})
}))

router.get("/new", requireLogin, catchAsync(async(req, res)=>{
    const products = await Product.find()
    res.render("salesSheets/new", {products})
}))
router.post("/", validateSalesSheets, catchAsync(async(req, res)=>{
    const newSalesSheet = new SalesSheet(req.body);
    await newSalesSheet.save();
    res.redirect("/salesSheets/");
}))

router.get("/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const salesSheet = await SalesSheet.findById(id);
    let date = salesSheet.date
    let day = date.getDate()
    let month = date.getMonth()+1
    if(month < 10){
        month=`0${month}`
    }
    let year = date.getFullYear()
    let newDate = `${year}/${month}/${day}`
    res.render("salesSheets/update", {salesSheet, newDate})
}))

router.put("/:id/update", catchAsync(async(req, res)=>{
    const {id} = req.params
    const newSalesSheet = await SalesSheet.findByIdAndUpdate(id, req.body, {runValidators: true, new:true}) 
    res.redirect(`/salesSheets/${newSalesSheet._id}`)
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
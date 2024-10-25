const express = require("express");
const app = express();
const router = express.Router();
const CustomerCredits = require("../models/customerCredit");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("../utils/catchAsync");
const {customerCreditSchema} = require("../schemas")
const ExpressError = require("../utils/ExpressError")
const {requireLogin} = require("../middleware")


app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const validateCustomerCredit= (req, res, next)=>{
    const {error} = customerCreditSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const customerCredits = await CustomerCredits.find()
    res.render("customerCredits/index", {customerCredits})
}))

router.get("/new",requireLogin, (req, res)=>{
    res.render("customerCredits/new")
})

router.post("/", validateCustomerCredit, catchAsync(async(req, res)=>{
    const newCredit = new CustomerCredits(req.body)
    await newCredit.save()
    res.redirect("/customerCredits/")
}))

router.delete("/:id/delete", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params
    await CustomerCredits.findByIdAndDelete(id);
    res.redirect("/customerCredits/")
}))

router.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404))
})

router.use((err, req, res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) err.message="Something went wrong. Please try again"
    res.status(statusCode).render("error", {err})
})

module.exports = router
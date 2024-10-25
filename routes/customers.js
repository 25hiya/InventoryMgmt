const express = require("express");
const app = express();
const router = express.Router();
const Customer = require("../models/customers");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const {customerSchema} = require("../schemas");
const{requireLogin} = require("../middleware")

app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const validateCustomer = (req, res, next)=>{
    const {error} = customerSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}
router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const customers = await Customer.find();
    res.render("customers/index", {customers});
}));

router.get("/new", requireLogin, (req, res)=>{
    res.render("customers/new");
})

router.post("/", validateCustomer, catchAsync(async(req, res)=>{
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.redirect("/customers/");
}))

router.get("/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const customer = await Customer.findById(id);
    res.render("customers/details", {customer});
}))

router.get("/update/:id", requireLogin, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const foundCustomer = await Customer.findById(id);
    res.render("customers/edit", {foundCustomer});
}))

router.put("/update/:id", validateCustomer, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {runValidators: true, new:true})
    res.redirect(`/customers/${updatedCustomer._id}`);
}))

router.delete("/delete/:id", catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Customer.findByIdAndDelete(id);
    res.redirect("/customers/");
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
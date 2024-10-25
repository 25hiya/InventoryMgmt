const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/products");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("../utils/catchAsync");
const {requireLogin} = require("../middleware")

app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

router.get("/", requireLogin, catchAsync(async(req, res)=>{
    const categories = await Product.schema.path("categories").enumValues;
    res.render("categories/index", {categories});
}))

router.get("/details/:category", requireLogin, catchAsync(async(req, res)=>{
    const {category} = req.params;
    const products = await Product.find({categories: category});
    res.render("categories/details", {products});
}))

module.exports = router;


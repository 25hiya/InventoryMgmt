const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const bcrypt = require("bcrypt")
const session = require("express-session");
const flash = require("connect-flash")

app.use(methodOverride("_method"));

app.use(express.static(path.join("public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
const sessionConfig = {
    secret: "ThisBetterBeAGoodSecret!",
    resave: false, 
    saveUnintialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(express.json())


router.get("/register", (req, res)=>{
    res.render("user/register")
})

router.post("/register", catchAsync(async(req, res)=>{
        const{email, password, username} = req.body
        const user = new User({email, username, password})
        await user.save();
        res.redirect("/login")    
}))

router.get("/login", (req, res)=>{
    res.render("user/login")
})

router.post("/login", async(req, res)=>{
    const {username, password} = req.body
    const foundUser = await User.findAndValidate(username, password)
    if(foundUser){
        req.session.user_id = foundUser._id
        res.redirect("/home/home");
    }
    else{
        res.redirect("/login")
    }
})

router.post('/logout', (req, res)=>{
    //req.session.user_id = null;
    req.session.destroy();
    res.redirect("/login")
})
module.exports = router
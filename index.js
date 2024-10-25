const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path")
const mongoose = require("mongoose");
const productRoutes = require("./routes/product");
const categoriesRoutes = require("./routes/categories");
const customerRoutes = require("./routes/customers");
const salesSheetsRoutes = require("./routes/salesSheets");
const purchaseOrders = require("./routes/purchaseOrder");
const customerCredits = require("./routes/customerCredits")
const monthlyReports = require("./routes/monthlyReport")
const homeRoute = require("./routes/home");
const userRoute = require("./routes/user")
const methodOverride = require("method-override");
const session = require("express-session")

app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost:27017/db-mgmt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use("/public", express.static("./public/"));
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
        expires: Date.now() +1000 *60 *60 *24 * 7,
        maxAge: 1000 *60 *60 *24 * 7
    }
}
app.use(session(sessionConfig))
app.use(express.json())

app.use("/monthlyreports", monthlyReports)
app.use("/customerCredits", customerCredits);
app.use("/purchaseOrders", purchaseOrders);
app.use("/salesSheets", salesSheetsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/home", homeRoute)
app.use("",userRoute)



app.listen(3000, ()=>{
    console.log("listening on port 3000");
})
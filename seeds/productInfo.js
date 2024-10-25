const mongoose = require("mongoose");
const Product = require("../models/products");

mongoose.connect('mongodb://localhost:27017/db-mgmt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedProducts = [
    {
        product: "ESL Milk 500ml",
        categories: "Creambell",
        price: 165,
        shelfLife: 3
    },

    {
        product: "ESL Milk 250ml",
        categories: "Creambell",
        price: 170,
        shelfLife: 3
    },

    {
        product: "Tetra Milk 500ml",
        categories: "Creambell",
        price: 210,
        shelfLife: 3
    },

    {
        product: "ESL Milk 1ltr",
        categories: "Creambell",
        price: 185,
        shelfLife: 3
    }, 

    {
        product: "Pepsi 600ml",
        categories: "Pepsi",
        price: 90,
        shelfLife: 3
    },
    
    {
        product: "Pepsi-lite 600ml",
        categories: "Pepsi",
        price: 90,
        shelfLife: 3
    },

    {
        product: "Mirinda-Fruity 600ml",
        categories: "Pepsi",
        price: 90,
        shelfLife: 3
    },
]

Product.insertMany(seedProducts)
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log("err");
    })



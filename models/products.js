const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProductSchema = new Schema({
    product: {
        type: String
    },
    categories: {
        type: String,
        enum: ["Creambell", "Pepsi"]
    }, 
    price: {
        type: Number
    },
    shelfLife: {
        type: Number
    },
    stock: {
        type: Number
    }
})

module.exports = mongoose.model("Product", ProductSchema);



const mongoose = require("mongoose");
const {Schema} = mongoose;

const CustomerSchema = new Schema({
    name: String, 
    area: String, 
    avgSales: Number, 
    contact: Number, 
    CEAssigned: String
})

module.exports = mongoose.model("Customer", CustomerSchema);

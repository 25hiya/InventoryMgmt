const mongoose = require("mongoose");
const {Schema} = mongoose;



const SalesSheetSchema = new Schema({
    ceName : String,
    date: Date,
    productName: [{type: String}], 
    price: [{type: Number}], 
    out: [{type: Number}],
    returned: [{type: Number}], 
    sales: [{type: Number}], 
    total: [{type: Number}],
    grandTotal: Number, 
    deductions: [{type: Number}],
    collections: {type: Number},
    remarks: String
})

module.exports = mongoose.model("SalesSheet", SalesSheetSchema);
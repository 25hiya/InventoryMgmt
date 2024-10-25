const mongoose = require("mongoose");
const {Schema} = mongoose;

const PurchaseOrderSchema = new Schema({
    date: Date, 
    itemsOrdered:[{type: String}],
    quantity: [{type: Number}], 
    pricePu: [{ type: Number }], 
    totalForEach: [{type: Number}], 
    grandTotal: Number,
    remarks: String
})

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);

const mongoose = require("mongoose");
const {Schema} = mongoose;

const customerCreditSchema = new Schema({
    name: String, 
    CEAssigned: String, 
    totalSales: Number, 
    amtPending: Number
})

module.exports =  mongoose.model("CustomerCredit", customerCreditSchema)
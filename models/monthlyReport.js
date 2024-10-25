const mongoose = require("mongoose");
const {Schema} = mongoose;

const monthlyReportSchema = new Schema({
    month: String,
    products: [{type: String}],
    productPurcahse: [{type: Number}],
    productSales: [{type: Number}],
    totalPurchase: Number,
    totalSales: Number,
    productProfit: Number, 
    totalProfit: Number,
    target: Number,
}) 

module.exports = mongoose.model("MonthlyReport", monthlyReportSchema)
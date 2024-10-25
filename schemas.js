const Joi = require("joi")

module.exports.productSchema =Joi.object({
        product: Joi.string().required(),
        price: Joi.number().required().min(0), 
        shelfLife: Joi.number().required(),
        categories: Joi.string().required() 
    }) 

module.exports.customerCreditSchema=Joi.object({
    name:Joi.string().required(),
    CEAssigned: Joi.string().required(),
    totalSales: Joi.number().required().min(0),
    amtPending: Joi.number().required().min(0)
})

module.exports.customerSchema = Joi.object({
    name: Joi.string().required(),
    area: Joi.string().required(),
    avgSales: Joi.number().required().min(0),
    contact: Joi.number().required(),
    CEAssigned: Joi.string().required()
})

module.exports.purchaseOrderSchema = Joi.object({
    date: Joi.date().required(),
    itemsOrdered: Joi.array().items(Joi.string()).required(),
    quantity: Joi.array().items(Joi.number().min(0)).required(),
    pricePu: Joi.array().items(Joi.number().min(0)).required(),
    totalForEach: Joi.array().items(Joi.number().min(0)).required(),
    grandTotal: Joi.number().required(),
    remarks: Joi.string().required()
})

module.exports.salesSheetSchema = Joi.object({
    ceName: Joi.string().required(),
    date: Joi.date().required(),
    productName: Joi.array().items(Joi.string()).required(),
    price: Joi.array().items(Joi.number().min(0)).required(),
    out:Joi.array().items(Joi.number().min(0)).required(),
    returned: Joi.array().items(Joi.number().min(0)).required(),
    sales: Joi.array().items(Joi.number().min(0)).required(),
    total: Joi.array().items(Joi.number().min(0)).required(),
    grandTotal: Joi.number().required(),
    deductions: Joi.array().min(0).items(Joi.number()),
    collections: Joi.number().required(),
    remarks: Joi.string().required()
})
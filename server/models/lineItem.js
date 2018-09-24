const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lineItemSchema = new Schema({
    // dont need to define id for schema, as mongoDB automatically defines it for us!
    name: String,

    //price refers to the the total price of line item product
    price: Number,

    //foreign key
    productID: String,
    orderID: String
});

module.exports = mongoose.model('LineItem',lineItemSchema);

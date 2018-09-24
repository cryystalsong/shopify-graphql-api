const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // dont need to define id for schema, as mongoDB automatically defines it for us!
    total: Number,

    //foreign key
    shopID: String
});

module.exports = mongoose.model('Order',orderSchema);

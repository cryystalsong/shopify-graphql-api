const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // dont need to define id for schema, as mongoDB automatically defines it for us!
    name: String,
    price: Number,

    //foreign key
    shopID: String
});

module.exports = mongoose.model('Product',productSchema);

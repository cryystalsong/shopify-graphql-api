const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    // dont need to define id for schema, as mongoDB automatically defines it for us!
    name: String
});

module.exports = mongoose.model('Shop',shopSchema);
//model refers to collection of "Shop" with shopSchema
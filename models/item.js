const mongoose = require('mongoose');

//Item schema

const itemSchema = mongoose.Schema({
    name: {type: String},
    type: {type: String},
    include: {type: Boolean}
});

//Export model
module.exports = mongoose.model('Item', itemSchema);
const mongoose = require('mongoose');

//Item schema

const itemSchema = mongoose.Schema({
    title: {type: String},
    type: {type: String},
    include: {type: Boolean}
});

//Export model
module.exports = mongoose.model('Item', itemSchema);
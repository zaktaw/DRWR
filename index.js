const mongoose = require('mongoose');

//Map global promise (to get rid of warning)
mongoose.Promise = global.Promise;

//Connect to database
mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
const db = mongoose.connection;

//Import model
const Item = require('./models/item');

//Add item
const addItem = (item) => {
    Item.create(item).then(item => {
        console.info('New item added');
        db.close();
    });
}

module.exports = {
    addItem
}
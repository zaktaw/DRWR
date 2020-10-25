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

//List all items
const listItems = () => {
    Item.find()
        .then(items => {
            console.info(items);
            db.close();
        });
}

//Find an item
const findItem = (title) => {
    //make case insesitive
    const search = new RegExp(title, 'i');
    Item.find({title: search})
        .then(item => {
            console.info(`${item.length} matches`);
            console.info(item);
            db.close();
        });
}

module.exports = {
    addItem,
    listItems,
    findItem
}
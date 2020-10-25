const mongoose = require('mongoose');
const utilities = require('./utilites');

//Map global promise (to get rid of warning)
mongoose.Promise = global.Promise;

//Import model
const Item = require('./models/item');

//Add item
const addItem = (item) => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.create(item).then(item => {
        console.info('New item added');
        db.close();
    });
}

//List all items
const listItems = () => {
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.find()
        .then(items => {
            console.info(items);
            db.close();
        });
}

//Find an item
const findItem = (title) => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    //make case insesitive
    const search = new RegExp(title, 'i');

    Item.find({title: search})
        .then(item => {
            console.info(`${item.length} matches`);
            console.info(item);
            db.close();
        });
}

//Update an item
const updateItem = (_id, item) => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.updateOne({_id}, item)
        .then(item => {
            console.info('Item updated');
            db.close();
        });
}

//Delete an item
const deleteItem = (_id) => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.deleteOne({_id})
        .then((item) => {
            //Check if any items has been deleted
            if (item.deletedCount > 0) console.info('Item deleted');
            else console.info("Couldn't find any items with matching id. No items deleted.");
            db.close();
        });
}

//Delete all items
const deleteAllItems = () => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.deleteMany({})
        .then(() => {
            console.info('All items deleted');
            db.close();
        });
}

//Draw random item
const drawItem = () => {
    //Connect to database
    mongoose.connect('mongodb://localhost:27017/drwr', {useNewUrlParser: true,  useUnifiedTopology: true});
    const db = mongoose.connection;

    Item.find()
        .then((items) => {
        if (items.length > 0) {
            let randNum = utilities.genRandNum(0,items.length-1); //generate a random number between start and end of item list.length
            let randItem = items[randNum];
            console.info(randItem.type + ': ' + randItem.title);
        }
        else console.info('There are no items in the database');
        db.close();
    });
}

module.exports = {
    addItem,
    listItems,
    findItem,
    updateItem,
    deleteItem,
    deleteAllItems,
    drawItem
}
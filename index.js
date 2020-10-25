const mongoose = require('mongoose');
const utilities = require('./utilites');
const chalk = require('chalk');

//Map global promise (to get rid of warning)
mongoose.Promise = global.Promise;

//Database url
let url = 'mongodb://localhost:27017/drwr'

//Database options
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

//Import model
const Item = require('./models/item');

//Add item
const addItem = (item) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    Item.create(item).then(item => {
        console.info(chalk.green('New item added'));
        db.close();
    });
}

//List all items
const listItems = (type) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;
  
    // list items of given type
    if (type) {
        Item.find({type: type})
        .then(items => {
            console.info(chalk.bold(type + ':'));
            items.forEach((item) => console.info(chalk.blue(item.title)));
            db.close();
        });
    }

    // list all items
    else {
        Item.find()
        .then(items => {
            items.forEach((item) => console.info(item.type + ': ' + chalk.bold.blue(item.title)));
            db.close();
        });
    }
    
    
}

//Find an item
const findItem = (title) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    //make case insensitive
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
    mongoose.connect(url, options);
    const db = mongoose.connection;

    Item.updateOne({_id}, item)
        .then(item => {
            console.info(chalk.green('Item updated'));
            db.close();
        });
}

//Delete an item
const deleteItem = (title) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    //make case insensitive
    const search = new RegExp(title, 'i');

    Item.deleteOne({title: search})
        .then((item) => {
            //Check if any items has been deleted
            if (item.deletedCount > 0) console.info(chalk.green('Item deleted'));
            else console.info(chalk.red("Couldn't find any items with matching title. No items deleted."));
            db.close();
        });
}

//Delete all items
const deleteAllItems = () => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    Item.deleteMany({})
        .then(() => {
            console.info(chalk.green('All items deleted'));
            db.close();
        });
}

//Draw random item
const randomItem = (type, exclude) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    let search = type ? {type: type} : null;  //Search for specific type or any type
    let randItem;

    Item.find(search)
        .then((items) => {
        if (items.length > 0) {
            let randNum = utilities.genRandNum(0,items.length-1); //generate a random number between start and end of item list.length
            randItem = items[randNum];
            console.info(chalk.white(randItem.type + ': ') + chalk.bold.blue(randItem.title));  
        }

        else {
            console.info(chalk.red('There are no items ' + (type?('remaining of type: ' + type):'remaining in the database')));    
        }
    })
    .then(() => {
        if (exclude) {
            Item.updateOne(randItem._id, {include: false});
            console.info(chalk.green('Item is now excluded'));
        }
    })
    .then(() => db.close());
}

module.exports = {
    addItem,
    listItems,
    findItem,
    updateItem,
    deleteItem,
    deleteAllItems,
    randomItem
}
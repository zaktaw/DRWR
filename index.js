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
const { setMaxListeners } = require('./models/item');

//Add item
const addItem = async(item) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    const items = await Item.find();

    // check if an item with the same title and type already exists
    for (i=0; i<items.length; i++) {
        if (item.title == items[i].title && item.type == items[i].type) {
            console.info(chalk.red("An item already exists with these values!"));
            db.close();
            return;
        }
    }

    // if it doesn't exist, add it
    Item.create(item).then(item => {
        console.info(chalk.green('New item added'));
        db.close();
    });
}

//List all items
const listItems = async(type, exclude) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    const search = {
    type: type?type:{$exists: true}, //Search for any type or a specific type
    include: exclude?{$exists: true}:true //Also show excluded items or not
    };

    const items = await Item.find(search);

    if (items.length > 0) {
        console.info(chalk.green(`Found ${items.length} item${items.length==1?'':'s'}:\n`))
        items.forEach((item) => {
            if (!item.include) console.info(chalk.yellow(item.title + ' (' + item.type + ')'));
            else console.info(item.title + ' (' + item.type + ')');
        });
    }

    else {
        console.info(chalk.red('Found no items'));
    }

    db.close();
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
const deleteItem = (title, type, all) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    //Delete all items
    if (all) {
        Item.deleteMany({})
        .then(() => {
            console.info(chalk.green('All items deleted'));
            db.close();
        });
    }

    else {
    //make case insensitive
    const searchTitle = new RegExp(title, 'i');
    const searchType = new RegExp(type, 'i');
    let search;

    // delete all items matching input type
    if (type && !title) {
        search = {type: searchType};
        Item.deleteMany(search)
        .then((items) => {
            //Check if any items has been deleted
            if (items.deletedCount > 0) console.info(chalk.green('Items deleted'));
            else console.info(chalk.red("Couldn't find any items with matching type. No items deleted."));
            db.close();
        });
    }

    // delete all items matching input title
    else if (title && !type) {
        search = {tile: searchTitle};
        Item.deleteMany(search)
        .then((items) => {
            //Check if any items has been deleted
            if (items.deletedCount > 0) console.info(chalk.green('Items deleted'));
            else console.info(chalk.red("Couldn't find any items with matching title. No items deleted."));
            db.close();
        });
    }

    // delete item matching input title and item (should find 0 or 1 item)
    else if (title && type) {
        search = {title: searchTitle, type: searchType};
        Item.deleteOne(search)
        .then((item) => {
            //Check if any items has been deleted
            if (item.deletedCount > 0) console.info(chalk.green('Item deleted'));
            else console.info(chalk.red("Couldn't find any items with matching title and type. No items deleted."));
            db.close();
        });
    }
    else {
        console.info("Nothing specified, nothing deleted");
        db.close();
    } 
    }
}

//Draw random item
const randomItem = async(type, exclude) => {
    //Connect to database
    mongoose.connect(url, options);
    const db = mongoose.connection;

    let search = {type: type?type:{$exists: true}, include: true}; //Search items with a specific type or any type ($exists: true) and only included items
   
    const items = await Item.find(search);
    let randNum = utilities.genRandNum(0,items.length-1); //generate a random number between start and end of items list

    if (items.length > 0) {
        let randItem = items[randNum];
        console.info(chalk.white(randItem.type + ': ') + chalk.bold.blue(randItem.title)); 

        //Exclude the drawn item
        if (exclude) {
            Item.findOneAndUpdate({_id: randItem._id}, {include: false}, {useFindAndModify: false})
                .then(() => {
                    console.info(chalk.yellow(randItem.title + ' is now excluded'));
                    db.close();
                });
        }
        else {
            db.close(); 
        }
    }

    //No more items left
    else {
        console.info(chalk.red('There are no items ' + (type?('remaining of type: ' + type):'remaining in the database')));
        db.close(); 
    }
}

module.exports = {
    addItem,
    listItems,
    findItem,
    updateItem,
    deleteItem,
    randomItem
}
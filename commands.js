#!/usr/bin/env node
const program = require('commander');
const {
    addItem,
    listItems,
    listItemsOfType,
    findItem,
    updateItem,
    deleteItem,
    deleteAllItems,
    drawItem
} = require('./index');

program
    .version('1.0.0')
    .description('Command line interface application to perform CRUD-operations on a multimedia title database. Items can be drawn randomly.')

//Command: add item
program
    .command('add <title> <type>')
    .alias('a')
    .description('Add an item to the database')
    .action((title, type) => {
        addItem({title, type, include: true});
    });

//Command: list all items
program
    .command('list [type]')
    .alias('l')
    .description('List all items in the database')
    .action((type) => {
        if (type) listItemsOfType(type); // if more than one argument is given
        else listItems();
    });

//Command: find an item
program
    .command('find <title>')
    .alias('f')
    .description('Find an item with given title in the database')
    .action((title) => findItem(title));

//Command: update item
program
    .command('update <_id> <title> <type>')
    .alias('u')
    .description('Updates an item with given id')
    .action((_id, title, type) => updateItem(_id, {title, type, include: true}));

//Command: delete item
program
    .command('delete [_id]')
    .alias('del')
    .description('Deletes an item with given id from the database.')
    .option('-a, --all', 'Delete all items')
    .action((_id, cmdObj) => {
        if (cmdObj.all) deleteAllItems(); //if --all or -a is passed as an argument
        else if (_id) deleteItem(_id) // if an ID is passed as an argument
        else console.info('Nothing specified, nothing added.');
    });

//Command: draw a random item
program
    .command('draw')
    .alias('d')
    .description('Draws a random item from the database')
    .action(() => {
        drawItem();
    });

program.parse(process.argv);
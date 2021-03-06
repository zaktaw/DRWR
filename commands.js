#!/usr/bin/env node
const program = require('commander');
const {
    addItem,
    listItems,
    findItem,
    updateItem,
    deleteItem,
    randomItem
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
    .option('-e, --exclude', 'Also show excluded items.')
    .action((type, cmdObj) => {
        listItems(type, cmdObj.exclude);
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
    .command('delete [title] [type]')
    .alias('del')
    .description('Deletes a given title with given id from the database.')
    .option('-a, --all', 'Delete all items')
    .action((title, type, cmdObj) => {
        deleteItem(title, type, cmdObj.all);
    });

//Command: draw a random item
program
    .command('random [type]')
    .alias('r')
    .description('Draws a random item from the database')
    .option('-e, --exclude', 'Exclude the drawn item')
    .action((type, cmdObj) => {
        if (cmdObj.exclude) randomItem(type, true);
        else randomItem(type, false);
    });

program.parse(process.argv);
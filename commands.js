const program = require('commander');
const {addItem, listItems, findItem} = require('./index');

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
    .command('list')
    .alias('l')
    .description('List all items in the database')
    .action(() => listItems());

//Command: find an item
program
    .command('find <title>')
    .alias('f')
    .description('Find an item in the database')
    .action((title) => findItem(title));

program.parse(process.argv);
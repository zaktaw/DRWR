const program = require('commander');
const {addItem} = require('./index');

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

program.parse(process.argv);
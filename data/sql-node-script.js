var path = require('path');

var config = {
    client: 'pg',
    tablename: 'userscores',
    username: 'postgres',
    tablespace_dirname: 'tablespace'
}

var knex = require('knex')({
    client: config.client
});

var cwd = path.join(process.cwd(), config.tablespace_dirname);

console.log(knex('test').select('title', 'author', 'year').from('books').toString());
var query = knex.schema.createTable(config.tablename);

console.log(query);



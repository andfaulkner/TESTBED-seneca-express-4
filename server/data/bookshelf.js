var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'postgres',
    password : '123456',
    database : 'postgres',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
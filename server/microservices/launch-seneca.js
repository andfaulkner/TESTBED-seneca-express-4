/***************************************************************************************************
*
*       launch-seneca - initializer for Seneca microservices architecture
*       Creates main Seneca instance.
*       Calls in various microservices.
*       Returns constructed Seneca object to caller
*
*/

var config = require('config/default');

//Create Seneca instance
var seneca = require('seneca')(config.seneca);


//--------------------------------------------------------------------//
//********************************************************************//
//** PLUGINS
//*********************************//
seneca
    .use(require('server/microservices/express/express-plugin'))
    .use(require('server/microservices/log-msg-plugin/log-msg-plugin'));

/**
 * Response from {role:'test_plugin', cmd:'cmd1'}
 *     @param  {Object} err     Error object, present if call fails
 *     @param  {Object} result     Error object if call fails
 */
seneca
    .act({role:'test_plugin', cmd:'cmd1'}, function(err, result) {
        return (err)
            ? log.error(err)
            : log.info(result);
    })
    .act({
        role:'log_msg',
        cmd:'block',
        title:'LOG BLOCK!',
        data:'DATA TO LOG'
    }, function(err, result){
            return (err)
                ? log.error(err)
                : log.info(result);
        });



////////////////////////////////////////////////////////////////////////
//END PLUGINS
////////////////////////////////////////////////////////////////////////



seneca.add({role:'math', cmd:'sum'}, function(msg, respond) {
    var sum = msg.left + msg.right
    respond( null, { answer: sum });
})

.act({role:'math', cmd:'sum', left:1, right:2}, function(err, result){
    if (err) return console.error(err);
    console.log(result);
})

.act({role:'basic', note:true, cmd:'set', key:'key1', value:'value1'}, console.log)
.act({role:'basic', note:true, cmd:'get', key:'key1'}, function(err, value){
    console.log(value);
})
.act({role:'basic', note:true, cmd:'push', key:'list1', value:'list1_item1'})
.act({role:'basic', note:true, cmd:'push', key:'list1', value:'list1_item2'})
.act({role:'basic', note:true, cmd:'list', key:'list1'}, function(err, value){
    console.log('role:basic,note:true,cmd:list,key:list1');
    console.log(value);
})
.act({role:'basic', note:true, cmd:'pop', key:'list1'}, function(err, value){
    console.log('role:basic,note:true,cmd:pop,key:list1');
    console.log(value);
});

log.cli.senecaMsgOut("DATA!!!");
log.cli.senecaMsgOut({ arg1: 'key1' });
log.cli.senecaMsgOut({ 'caller$': 'caller$! so it\'s a seneca object!', role: 'someRole'});
log.cli.senecaMsgOut({ 'caller$': 'Action call arguments and location: Error: { init: \'log_msg\',  tag: undefined,  \'default$\': {},  \'gate$\': true,  \'fatal$\': true,  \'local$\': true }', role: 'someRole'});

//@EXPORT seneca instance
module.exports = seneca;
/***************************************************************************************************
*
*       launch-seneca - initializer for Seneca microservices architecture
*       Creates main Seneca instance.
*       Calls in various microservices.
*       Returns constructed Seneca object to caller
*
*/

var path = require('path');

var config = require('config/default');

//Create Seneca instance
var seneca = require('seneca')(config.seneca);

console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ seneca.start ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
console.log(seneca.start());
console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

//--------------------------------------------------------------------//
//********************************************************************//
//** PLUGINS
//*********************************//

var pluginDirPath = 'server/microservices';

var senPluginsList = [
    'express/express-plugin',
    'log-msg-plugin/log-msg-plugin',
    'api/api',
    'api/math_api',
    'api/meta_api',
    'ultra-basic/basic-plugin-1',
    'data-entities/data-entity-test-1'
];

async.each(senPluginsList,
    function loadPlugin(pluginFile, callback) {
        log.info('loadPlugin ran, on ' + pluginFile);
        seneca.use(require(path.join(__projrootdir, pluginDirPath, pluginFile)));
        seneca.on('ready', callback.bind(this, null));
    },
    function(err) {
        if (err) {
            log.error('a plugin failed to load into Seneca: ' + err);
            // console.dir(err);
            return;
        }
        log.info('all Seneca plugins successfully requested!');
        return setLocalSenActs();
    }
);


function setLocalSenActs() {

    seneca.act(
        {role:'test-plugins',cmd:'ret-random-num',tag:'tp-rrn'},
        function(err, msg){
            if (err) console.log(err);
            // log.silly('role:test-plugins,cmd:ret-random-num,tag:tp-rrn msg:::');
            // log.silly(msg);
            return;
        }
    );

    seneca.act(
        {role:'test-plugins',cmd:'ret-random-num',tag:'tp-rrn2'},
        function(err, msg){
            // if (err) console.log(err);
            // log.silly(msg);
            return;
        }
    );

    /**
     * Response from {role:'test_plugin', cmd:'cmd1'}
     *     @param  {Object} err     Error object, present if call fails
     *     @param  {Object} result     Error object if call fails
     */
    seneca
        .act({  role:   'test_plugin',
                cmd:    'cmd1'          },
            function(err, result) {
                if (err) return log.error(err);
                else return result;
            }
        )
        .act({  role:   'log_msg',
                cmd:    'block',
                title:  'LOG BLOCK!',
                data:   'DATA TO LOG' },
            function(err, result) {
                if (err) return log.error(err);
                else return result;
            }
        );



    ////////////////////////////////////////////////////////////////////////
    //END PLUGINS
    ////////////////////////////////////////////////////////////////////////

    function act_roleMathCmdSum_cb(err, result){
        if (err) return log.error(err);
        log.info('act_roleMathCmdSum_cb result: ' + result);
    }

    function act_roleBasicNoteTrueCmdSet_cb(err, value){
        log.info('act_roleBasicNoteTrueCmdSet_cb');
        log.info(value);
    }

    function act_roleBasicNoteTrueCmdPop_cb(err, value){
        log.info('role:basic,note:true,cmd:list,key:list1');
        log.info(value);
        // this.good(value) // calling this === infinite recursion
        // console.log(this.good(value));
        // console.log(this.bad.toString());
        console.dir(this);
    }

    seneca
        .act({role:'math', cmd:'sum', left:1, right:2}, act_roleMathCmdSum_cb)
        .act({role:'basic', note:true, cmd:'set', key:'key1', value:'value1'}, log.info)
        .act({role:'basic', note:true, cmd:'get', key:'key1'}, _.rearg(log.info, 1, 0))
        .act({
            role: 'basic', cmd: 'push', note: true,
            key: 'list1', value: 'list1_item1'
        }, log.silly)

        .act({role:'basic', note:true, cmd:'push', key:'list1', value:'list1_item2'})
        .act({role:'basic', note:true, cmd:'list', key:'list1'}, act_roleBasicNoteTrueCmdPop_cb)
        .act({role:'basic', note:true, cmd:'pop', key:'list1'},
            function(err, value){
                log.info('role:basic,note:true,cmd:pop,key:list1');
                // log.info(typeof value);
                // log.info(value);
            }
        );

    // log.cli.senecaMsgOut("DATA!!!");
    // log.cli.senecaMsgOut({ arg1: 'key1' });
    // log.cli.senecaMsgOut({ 'caller$': 'caller$! so it\'s a seneca object!', role: 'someRole'});
    // log.cli.senecaMsgOut({
    //     'caller$': 'Action call arguments and location: Error: { init: \'log_msg\',  tag: undefined,  \'default$\': {},  \'gate$\': true,  \'fatal$\': true,  \'local$\': true }',
    //     role: 'someRole'
    // });

    seneca.act('role:data_entity_test,cmd:cmd1', function(err, msg){
        log.info(msg);
    });

}

//@EXPORT seneca instance
module.exports = seneca;
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

var log = require('server/debug/winston-logger')('launch-seneca');

//Create Seneca instance
var seneca = require('seneca')(config.seneca);

log.debug('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ seneca.start ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
log.debug(seneca.start());
log.debug('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

//--------------------------------------------------------------------//
//********************************************************************//
//** PLUGINS
//*********************************//

var pluginDirPath = 'server/microservices';

var senPluginsList = [
    'express/express-plugin',
    'log-msg-plugin/log-msg-plugin',
    ['seneca-postgresql-store', config.postgres],
    'api/api',
    'api/math_api',
    'api/meta_api',
    'api/form-handler-api',
    'ultra-basic/basic-plugin-1',
    'data-entities/data-entity-test-1'
];

async.each(senPluginsList,
    function loadPlugin(pluginFile, callback) {
        log.info('loadPlugin ran, on ' + pluginFile);
        //handle array items with options
        if (_.isArray(pluginFile)){
        	log.block('info', 'pluginFile', pluginFile);
        	console.dir(this);
        	seneca.use.apply(seneca, [require(pluginFile[0])].concat(_.rest(pluginFile)));
        } else if (_.includes(pluginFile, '/')) {
	        console.log('in "includes"');
		      seneca.use(require(path.join(__projrootdir, pluginDirPath, pluginFile)));
	      //Include installed plugins / npm modules
	      } else {
	        	console.log('in "plugins"');
	        	seneca.use(require(pluginFile));
	      }
        //Include filepaths
        seneca.on('ready', callback.bind(this, null));
    },
    function(err) {
        if (err) {
            log.error('a plugin failed to load into Seneca: ' + err);
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
            if (err) log.error(err);
            // log.silly('role:test-plugins,cmd:ret-random-num,tag:tp-rrn msg:::');
            // log.silly(msg);
            return;
        }
    );

    seneca.act(
        {role:'test-plugins',cmd:'ret-random-num',tag:'tp-rrn2'},
        function(err, msg){
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
        log.debug('act_roleMathCmdSum_cb result: ' + result);
    }

    function act_roleBasicNoteTrueCmdSet_cb(err, value){
        log.debug('act_roleBasicNoteTrueCmdSet_cb');
        log.debug(value);
    }

    function act_roleBasicNoteTrueCmdPop_cb(err, value){
        log.debug('role:basic,note:true,cmd:list,key:list1');
        log.debug(value);
        log.verbose(this);
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
            }
        );

    var entities = [];

    // for (var ii = 0; ii < 10; ii++){
    //     seneca.act({ role: 'data_entity_test', cmd: 'newentity', entNum: ii }, function(err, msg) {
    //         log.verbose(msg);
    //         entities.push(msg.entity);
    //         seneca.act(msg, function(err, msg) {
    //             log.silly(entities);
    //         });
    //     });
    // }
}

//@EXPORT seneca instance
module.exports = seneca;
var log = require('server/debug/winston-logger')('server/microservices/api/meta_api');

module.exports = function api_SenecaPlugin(options) {

    var plugin = 'metaapi';

    this.add('role:metaapi,cmd:search', search_cb);
    this.add('role:metaapi,cmd:caller$clearerstack', caller$clearerstack_cb);
    this.add('role:metaapi,cmd:caller$', caller$_cb);
    this.add('role:metaapi,cmd:meta$', meta$_cb);
    this.add('role:metaapi,cmd:keys', keys_cb);


    this.act('role:web', {
        use: {
            prefix: '/metaapi',
            pin: 'role:metaapi,cmd:*',
            map: {
                'search': { 'redirect': 'http://www.google.com' },
                'caller$clearerstack': { GET: true },
                'keys': { GET: true },
                'caller$': { GET: true, POST: true },
                'meta$': true, //GET by default
            }
        }}
    );


    function search_cb(msg, callback){
        log.info('~~~~~~~~~~~~ role:metaapi,cmd:search ~~~~~~~~~~~~');
        callback(null, { result: 'redirecting to google...' });
    }


    function caller$clearerstack_cb(msg, callback){
        log.info('~~~~~~~~~~~~ role:metaapi,cmd:caller$clearerstack ~~~~~~~~~~~~');
        callback(null, {
            result: JSON.stringify(msg.caller$).replace('Error: ', '')
                .replace(/\/home\/andfaulkner\/Projects\/testbed/g, './')
                .replace(/node_modules/g, 'nm')
                .replace('node_modules', 'n_m')
                .replace(/\s\s\sat\s/g, '        :::::: AT ::::::       ')
                .replace(/\\n/g, '')
        });
    }

    function caller$_cb(msg, callback){
        log.info('~~~~~~~~~~~~ role:metaapi,cmd:caller$ ~~~~~~~~~~~~');
        callback(null, {
            result: JSON.stringify(msg.caller$).replace('Error: ', '')
        });
    }

    function meta$_cb(msg, callback){
        log.info('~~~~~~~~~~~~ role:metaapi,cmd:meta$ ~~~~~~~~~~~~');
        callback(null, { meta$: msg.meta$ });
    }

    function keys_cb(msg, callback){
        log.info('~~~~~~~~~~~~ role:metaapi,cmd:keys ~~~~~~~~~~~~');
        // console.dir(Object.keys(msg));
        callback(null, { 'Seneca msg Object Keys': Object.keys(msg) });
    }
};
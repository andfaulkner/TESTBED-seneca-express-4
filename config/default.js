var path = require('path');

module.exports = {

    appName: 'testbed-seneca-4',
    '__projrootdir': path.join(__dirname, '..'),

    server: {
        port: 3000
    },

    'client': {
        levelOfLog: 'debug'
    },

    winstonLogs: {
        exitOnError: false,
        consoleLogLevel: 'info',
        senecaLogLevel: 'warn',
    },

    // Redis configuration settings
    'redis': {
        port : 9999,
        host : '127.0.0.1',
        options : {
            parser : 'javascript',
            return_buffer : false
        },
    },

    postgres: {
		  name:'postgres',
		  host:'127.0.0.1',
		  port:5432,
		  username: 'postgres',
		  password:'123456'
		},

    'seneca': {
        define_plugins: {
            basic: true
        },
        zig: {
            trace: true
        },
        trace:{
            act:     false,
            stack:   false,
            unknown: 'warn'
        },
        debug: {
            act_caller: true,
            // short_logs: true,
            callpoint: true,
            print: {
                options: true
            },
            repl: {
                post: 30303,
                host: '127.0.0.1'
            }
        },
        actcache: true,
        idlen: 4
    }
};
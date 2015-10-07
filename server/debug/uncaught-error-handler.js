var log = require('server/debug/winston-logger');
var _ = require('lodash');
require('colors');
require('string').extendPrototype();
var config = require('config/default');

module.exports = (function uncaughtErrorHandler(){

    //Any uncaught errors should trigger this. Makes pretty and readable error output,
    //with error itself displayed, the app-specific error messages on the stacktrace highlighted
    //at the bottom, and the full stacktrace displayed above.
    process.on('uncaughtException', function onUncaughtException (err) {
        console.log('\n' + '_'.times(100) + '\n' + '_'.times(100));
        console.log('________________UNCAUGHT EXCEPTION________________'
            .red.bgBlack.bold.underline);

        console.log('FULL STACKTRACE:'.magenta.bold);
        log.error(err.stack);

        console.log('_'.times(100) + ' ');
        console.log('((FULL STACKTRACE ABOVE))'.red.bgBlack + '\n');

        console.log('ERROR:'.red.bold.bgBlack);
        log.cli.dir(err);

        var splitStack = (err.stack).split('\n    ');

        var mainArg = _.filter(splitStack, function createMainOutput(str) {
            return str.contains(config.appName) && !str.contains('node_modules');
        }).join('\n');

        if (mainArg.length > 0) {
            log.cli.title(mainArg, '   ');
        }

        console.log('_'.times(100) + '\n' + '_'.times(100));
        process.exit(1);
    });

}());
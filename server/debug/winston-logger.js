(function winstonLogger_module(){

    //node modules
    var fs = require('fs');
    var path = require('path');
    var winston = require('winston');
    // var lodash = require('lodash');
    var jsBeautify = require('js-beautify');
    var circularJSON = require('circular-json');

    //Prototype modifying modules
    require('colors');
    require('string');

    //app config
    var config = require('config/default');
    var __projrootdir = config.__projrootdir;
    config = config.winstonLogs;

    //TODO FIX THIS::: DANGEROUS RACE CONDITION
    //Make a log directory if one didn't exist already
    fs.mkdir(path.join(__projrootdir, 'logs'), function mkLogsDir(err){
        return (err)
            ? err
            : 'log directory created';
    });

    //TODO this is not DRY - the filenames are declared twice
    var logFileNames = ['excessive-data-log.log', 'all-logs.log', 'console-log-record.log'];

    //***************************** UTILITIES *****************************//
    //Asynchronously check if a file exists
    //TODO Make part of a utilities module
    var fileExists = function fileExists(filePath, callback) {
        return fs.stat(filePath, function finalFileExistCheck(err, stats) {
            return (err)
                ? callback(false)
                : callback(stats.isFile());
        });
    };
    //*********************************************************************//


    //*************************** BASIC LOGGERS ***************************//
    //Creates logging object
    var logger = function logger(loggerTypeLabel, consoleLogLevel, options){
        options = options || {};

        /*eslint complexity: 0*/
        var timeStamp = function timeStamp() {
            var date = new Date(Date.now());
            var mon = (date.getMonth() > 9) ? date.getMonth() : '0' + date.getMonth(),
                dtOfMon = (date.getDate() > 9) ? date.getDate() : '0' + date.getDate(),
                hr = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours(),
                min = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes(),
                sec = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();

            return ('|' + mon + '/' + dtOfMon + '--' + hr + ':' + min + ':' + sec + '|').gray.bold;
        };

        //Builds transports into specific files
        var fileTransportFactory = function fileTransportFactory(logLvl, logNm, logFilePath, opts) {
            opts = opts || {};
            return new (winston.transports.File)({
                label: (loggerTypeLabel || ''),
                name: logNm,
                level: logLvl,
                filename: path.join(__projrootdir, 'logs', logFilePath),
                handleExceptions: true,
                json: opts.jsonOut || false,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            });
        };

        return new (winston.Logger)({
            transports: [   //specify appenders here

                //DATA --> CONSOLE
                new winston.transports.Console({
                    label: (loggerTypeLabel || ''),
                    level: consoleLogLevel ,
                    timestamp: timeStamp,
                    handleExceptions: true,
                    json: false,
                    colorize: true,
                }),

                //COMPLETE (EXCESSIVE) DATA --> FILE LOG
                fileTransportFactory('silly', 'silly-log',
                                     'lvl1-excessive-data-log.log'),

                //COMPLETE (EXCESSIVE) DATA --> FILE LOG
                fileTransportFactory('debug', 'debug-log',
                                     'lvl2-debug-log.log'),

                //INFO --> FILE LOG
                fileTransportFactory('info', 'info-log',
                                     'lvl3-info-log.log'),

                //WARN --> FILE LOG
                fileTransportFactory('warn', 'warn-log',
                                     'lvl4-warn-log.log'),

                //WARN --> FILE LOG
                fileTransportFactory('error', 'error-log',
                                     'lvl5-error-log.log'),

                //CONSOLE --> FILE LOG
                fileTransportFactory(consoleLogLevel, 'console-log',
                                     'console-log-record.log')
            ],

            exitOnError: config.exitOnError
        });
    };
    //*********************************************************************//


/***************************************************************************************************
*
*       EXPORTS
*
*/

    module.exports = logger('', config.consoleLogLevel);

    module.exports.seneca = logger('seneca'.bgBlack.green.bold, config.senecaLogLevel);

    module.exports.stream = {
        write: function write(message, encoding) {
            logger().info(message);
        }
    };



    //--------------------------------------------------------------------//
    //********************************************************************//
    //** CLI OUTPUT FUNCTIONS (all exports)
    //*********************************//
    /**
     * Logging functions specificlaly for output to the CLI
     */
    module.exports.cli = {

        /**
         * Fill-in for console.dir, with better default options (and use of output cleaners)
         * @param  {Object} str     Object to output
         * @param  {Number} depth   Num levels deep to show obj. If set, uses regular console.dir
         *                          instead of special parsers. If not given, unlimited depth shown
         * @return {Function} Log-emitting function - which runs immediately on return.
         */
        dir: function dir(obj, depth){
            return (depth)
                ? console.dir(obj, { depth: depth, colors: true })
                : console.log(jsBeautify(circularJSON.stringify(obj)));
        },

        /**
         * Emits a pretty heading to separate upcoming cli output from earlier output
         * @param  {String} str     string to output to  console
         * @param  {String} lpadStr Character to use for padding; none used by default
         * @return {Function} Log-emitting function - which runs immediately on return.
         */
        title: function title(str, lpadStr){
            return logger().log('info',
                                '\n' + (lpadStr || '') +
                                       str.capitalize().underline.bgYellow.black + '\n' );
        },

        /**
         * Emits a very pretty block of log text to the CLI
         * @param  {String} title  - heading - centred in the spacer at the top of the block
         * @param  {String|Object|Function} data  - data to output to the cli
         * @param  {Object} opts
         *           doDir:      if true, log param data as obj (a la console.dir) {default: false}
         *           isEndSpace: if true, add a blank space to the end of block    {default: false}
         * @return {Function} Log-emitting function; outputs final msg; runs immediately on return
         */
        block: function block(title, data, opts) {
            var chk50 = _.repeat('!', 50);
            console.log('\n\n');
            console.log(chk50 + ' ' + _.trim(title) + ' ' + chk50);
            if (opts && opts.doDir) {
                this.dir(data);
            } else {
                console.log(data);
            }
            return (opts && opts.isEndSpace)
                ? console.log(_.repeat('!', 140))
                : console.log(_.repeat('!', 140) + '\n\n');
        },

        error: function error(msg){
            console.log('this');
            console.log(this);
            if (_.isString(msg))
                return console.error(msg);
            else (_.isObject(msg))
                return this.dir(msg);
        },

        /**
         * Get the type of an item (object?), with high granularity
         * @param  {ANY} msg - object/data item to get the type of
         * @param  {Boolean} noDOMType - if true, return only generic 'htmldomelement' (no
         *                   specific el type) if DOM element detected
         * @return {String} name of data type. Possible vals:
         *            'array', 'null', 'regexp', 'string', 'typedarray', 'error',
         *            'htmldomelement', 'nan', 'boolean', 'undefined', 'number',
         *            'object'; or a specific DOM element type e.g. 'htmldivelement'
         */
        getType: function getType(msg, noDOMType){
            return    _.isTypedArray(msg)
                        ? 'typedarray'
                    : _.isArray(msg)
                        ? 'array'
                    : _.isNull(msg)
                        ? 'null'
                    : _.isNaN(msg)
                        ? 'nan'
                    : _.isRegExp(msg)
                        ? 'regexp'
                    : _.isError(msg)
                        ? 'error'
                    : _.isElement(msg)
                        ? (!noDOMType && msg.constructor.name)
                            ? msg.constructor.name
                            : 'htmldomelement'
                    : typeof msg;
        },

        /**
         * Logging function designed to output a Seneca object to the CLI. If msg isn't a Seneca
         * obj, it'll log the obj anyway, minus the special processing.
         * @param  {Object} msg - Seneca object to have contents displayed on the CLI
         * @return {Function}     function that does actual logging - to run immediately on return
         */
        senecaMsgOut: function senecaMsgOut(msg){
            // Handle msg if it isn't an object
            if (!_.isObject(msg)){
                return log.block('arg sent to senecaMsgOut isn\'t an object; Seneca obj required',
                    { valueOfMsg: msg.toString(), typeOfMsg: this.getType(msg) });
            }

            var senecaClueProps = ['tag', 'tx$', 'init', 'caller$', 'meta$', 'default$'];

            if (!(senecaClueProps.some( function(el){ return _.has(msg, el); } ))) {
                return log.block('arg sent to senecaMsgOut isn\'t a Seneca object', {
                                    valueOfMsg: circularJSON.stringify(msg),
                                    typeOfMsg: this.getType(msg),
                                    keys: Object.keys(msg)
                });
            }

            // Handle msg if it's an object but not a seneca object
            // if (!(_.has(msg, 'tag') || _.has(msg, 'tx$') || _.has(msg, 'init') ||
            //         _.has(msg, 'caller$') || _.has(msg, 'meta$'))) {

            //-------- Handle msg if it's a Seneca object (from here to end of function) --------//
            var logMsg = _.merge({}, _.pick(msg, senecaClueProps),
                                    { argsPassedToAction: _.omit(msg, senecaClueProps) });

            //Clean up 'caller$' prop of Seneca msg obj if it's present (it's usually a mess)
            if (_.has(msg, 'caller$')) {
                logMsg.actionAndActionCallStack = msg.caller$.replace(/[^\{]*\{/, '{')
            }

            //Return the contents of the seneca object
            return log.block('msg OBJECT FOR SENECA ACTION PATTERN: ' +
                                (_.has(msg,'meta$.pattern')
                                    ? msg.meta$.pattern
                                    : circularJSON.stringify(logMsg.argsPassedToAction)),
                             jsBeautify(circularJSON.stringify(logMsg)) +
                             '\n\n' + 'STACK FOR CURRENT ACTION PATTERN::'.green + '\n' +
                             logMsg.actionAndActionCallStack);
            //-----------------------------------------------------------------------------------//
        }
    };
    //********************************************************************//
    //-- END CLI OUTPUT FUNCTIONS --
    //********************************************************************//
    //--------------------------------------------------------------------//


    module.exports.dir = module.exports.cli.dir;
    module.exports.dataBlock = module.exports.block = module.exports.cli.block;
    module.exports.error = module.exports.cli.error;
    module.exports.getType = module.exports.cli.getType;
    module.exports.senecaMsgOut = module.exports.cli.senecaMsgOut;
/**************************************************************************************************/

    //API:
    //  log.info
    //  log.log('info', msg)
    //  log.dir
    //  log,block
    //  log.error
    //  log.getType
    //  log.cli.title
    //
    //
}());
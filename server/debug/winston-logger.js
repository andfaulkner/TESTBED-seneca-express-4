//Prototype modifying modules
require('colors');
require('string');


/***************************************************************************************************
*
*			Logging functionality.
*
*/
(function winstonLogger_module(){

		//node modules
		var fs = require('fs');
		var path = require('path');
		var winston = require('winston');
		// var lodash = require('lodash');
		var jsBeautify = require('js-beautify');
		var circularJSON = require('circular-json');

		//app config
		var config = require('config/default');
		var __projrootdir = config.__projrootdir;
		config = config.winstonLogs;

		//List of all acceptable log levels
		var logLevelsArr = ['silly','verbose','debug','info','warn','error'];

		var logLvl = getLogLevelNum(config.consoleLogLevel);

		function getLogLevelNum(logLevel){
			switch(logLevel || config.consoleLogLevel){
				case 'silly': return 1;
				case 'verbose': return 2;
				case 'debug': return 3;
				case 'info': return 4;
				case 'warn': return 5;
				case 'error': return 6;
				default: return 4;
			}
		}


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


		//************************************* BASIC LOGGERS *************************************//
		//Creates logging object
		var logger = function logger(filename, loggerTypeLabel, consoleLogLevel, options) {
				options = options || {};

				/*eslint complexity: 0*/
				var timeStamp = function timeStamp() {
						var date = new Date(Date.now());
						var mon = (date.getMonth() > 9) ? date.getMonth() : '0' + date.getMonth(),
								dtOfMon = (date.getDate() > 9) ? date.getDate() : '0' + date.getDate(),
								hr = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours(),
								min = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes(),
								sec = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();

						return ('|' + mon + '/' + dtOfMon + '-' + hr + ':' + min + ':' + sec + '|').gray.bold;
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
						transports: [	 //specify appenders here

								//DATA --> CONSOLE
								new winston.transports.Console({
										label: (filename + (loggerTypeLabel || '')),
										// label: (loggerTypeLabel || ''),
										level: consoleLogLevel,
										timestamp: timeStamp,
										handleExceptions: true,
										json: false,
										colorize: true,
								}),

								//COMPLETE (EXCESSIVE) DATA --> FILE LOG
								fileTransportFactory('silly', 'silly-log', 'lvl1-excessive-data-log.log'),

								//COMPLETE (EXCESSIVE) DATA --> FILE LOG
								fileTransportFactory('verbose', 'verbose-log', 'lvl2-verbose-log.log'),

								//COMPLETE (EXCESSIVE) DATA --> FILE LOG
								fileTransportFactory('debug', 'debug-log', 'lvl3-debug-log.log'),

								//INFO --> FILE LOG
								fileTransportFactory('info', 'info-log', 'lvl4-info-log.log'),

								//WARN --> FILE LOG
								fileTransportFactory('warn', 'warn-log', 'lvl5-warn-log.log'),

								//WARN --> FILE LOG
								fileTransportFactory('error', 'error-log', 'lvl6-error-log.log'),

								//CONSOLE --> FILE LOG
								fileTransportFactory(consoleLogLevel, 'console-log', 'console-log-record.log')
						],

						exitOnError: config.exitOnError
				});
		};

		//*****************************************************************************************//


/***************************************************************************************************
*
*			 EXPORTS
*
*/
		// module.exports.seneca = logger('seneca'.bgBlack.green.bold, config.senecaLogLevel);

		//--------------------------------------------------------------------//
		//********************************************************************//
		//** CLI OUTPUT FUNCTIONS (all exports)
		//*********************************//
		/**
		 * Logging functions specificlaly for output to the CLI
		 */
		var cli = module.exports.cli = (function(){


			//See below - made public as cli.block - or just [logObject].block
			var _logBlock = function _logBlock(filename, logLevel, title, data, opts) {
				var chk50 = _.repeat('!', 50);

				// check for inclusion of a log level - if none given, assume var logLevel contains title
				if (!_.includes(logLevelsArr, logLevel)){
					if (data) opts = data;
					if (title) data = title;
					title = logLevel;
					logLevel = 'info';
				}

				//Don't display if logLevel is too low
				if (logLvl > getLogLevelNum(logLevel)) return;

				console.log('*** ' + filename + ' ***');
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
			};

			//
			return {
				/**
				 * Fill-in for console.dir, with better default options (and use of output cleaners)
				 * @param	{Object} str		 Object to output
				 * @param	{Number} depth	 Num levels deep to show obj. If set, uses regular console.dir
				 *													instead of special parsers. If not given, unlimited depth shown
				 * @return {Function} Log-emitting function - which runs immediately on return.
				 */
				dir: function dir(filename, logLevel, obj, depth){
					console.log('in dir?');
					if (_.isObject(logLevel)) {
						if (_.isNumber(obj)) depth = obj;
						obj = logLevel;
						logLevel = 'info';
					}
					console.log(getLogLevelNum(logLevel));
					console.log(logLvl);
					if (getLogLevelNum(logLevel) < logLvl) return;

					console.log('*** ' + filename + ' ***');
					return (depth)
						? console.dir(obj, { depth: depth, colors: true })
						: console.log(jsBeautify(circularJSON.stringify(obj)));
				},

				/**
				 * Emits a pretty heading to separate upcoming cli output from earlier output
				 * @param	{String} str		 string to output to	console
				 * @param	{String} lpadStr Character to use for padding; none used by default
				 * @return {Function} Log-emitting function - which runs immediately on return.
				 */
				title: function title(filename, str, lpadStr){
					console.log('*** ' + filename + ' ***');
					return console.log('\n' + (lpadStr || '') +
						str.capitalize().bgYellow.black.underline + '\n');
				},

				/**
				 * Emits a large, highly visible heading
				 * @param	{String} str		 string to output to	console
				 * @param	{String} lpadStr Character to use for padding; none used by default
				 * @return {Function} Log-emitting function - which runs immediately on return.
				 */
				heading: function heading(filename, str){
					var chk50 = _.repeat('#', 50);
					console.log('\n\n');
					console.log(_.repeat('-', filename.length + 4));
					console.log('| ' + filename + ' |');
					console.log(chk50 + ' ' +
						str.toUpperCase().underline.bgYellow.black +
						' ' + chk50 + '\n');
				},

				/**
				 * Emits a very pretty block of log text to the CLI
				 * @param	{String} title	- heading - centred in the spacer at the top of the block
				 * @param	{String|Object|Function} data	- data to output to the cli
				 * @param	{Object} opts
				 *					 doDir:			if true, log param data as obj (a la console.dir) {default: false}
				 *					 isEndSpace: if true, add a blank space to the end of block		{default: false}
				 * @return {Function} Log-emitting function; outputs final msg; runs immediately on return
				 */
				block: _logBlock,

				/**
				 * Log errors
				 * @param	{Object|String} msg - message to log, or error object
				 */
				error: function error(filename, msg){
					console.log('*** ' + filename + ' ***');
					return (_.isString(msg))
						? console.error(msg)
						: (_.isObject(msg))
							? this.dir(msg)
							: console.log('ERROR');
				},

				/**
				 * Get the type of an item (object?), with high granularity
				 * @param	{ANY} msg - object/data item to get the type of
				 * @param	{Boolean} noDOMType - if true, return only generic 'htmldomelement' (no
				 *									 specific el type) if DOM element detected
				 * @return {String} name of data type. Possible vals:
				 *						'array', 'null', 'regexp', 'string', 'typedarray', 'error',
				 *						'htmldomelement', 'nan', 'boolean', 'undefined', 'number',
				 *						'object'; or a specific DOM element type e.g. 'htmldivelement'
				 */
				getType: function getType(filename, msg, noDOMType) {
					if (config.consoleLogLevel === silly) {
						console.log('**************************************************');
						console.log('*** ' + filename + ': getting type of item: ' + msg);
						console.log('**************************************************');
					}
					return	_.isTypedArray(msg)
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
				 * @param	{Object} msg - Seneca object to have contents displayed on the CLI
				 * @return {Function}		 function that does actual logging - to run immediately on return
				 */
				senecaMsgOut: function senecaMsgOut(filename, msg) {

					// Handle msg if it isn't an object
					if (!_.isObject(msg)){
							return _logBlock('arg sent to senecaMsgOut isn\'t an object; Seneca obj required',
									{ valueOfMsg: msg.toString(), typeOfMsg: this.getType(msg) });
					}

					var senecaClueProps = ['tag', 'tx$', 'init', 'caller$', 'meta$', 'default$'];

					if (!(senecaClueProps.some( function(el){ return _.has(msg, el); } ))) {
							return _logBlock('arg sent to senecaMsgOut isn\'t a Seneca object',
								{ valueOfMsg: circularJSON.stringify(msg),
									typeOfMsg: this.getType(msg),
									keys: Object.keys(msg) }
							);
					}

					//-------- Handle msg if it's a Seneca object (from here to end of function) --------//
					var logMsg = _.merge({}, _.pick(msg, senecaClueProps),
						{ argsPassedToAction: _.omit(msg, senecaClueProps) });
					//Clean up 'caller$' prop of Seneca msg obj if it's present (it's usually a mess)
					if (_.has(msg, 'caller$')) {
						logMsg.actionAndActionCallStack = msg.caller$.replace(/[^\{]*\{/, '{')
					}

					//Return the contents of the seneca object
					return _logBlock('msg OBJECT FOR SENECA ACTION PATTERN: ' +
						(_.has(msg,'meta$.pattern')
							? msg.meta$.pattern
							: circularJSON.stringify(logMsg.argsPassedToAction)),
						jsBeautify(circularJSON.stringify(logMsg)) +
							'\n\n' + 'STACK FOR CURRENT ACTION PATTERN::'.green + '\n' +
							logMsg.actionAndActionCallStack);
					//-----------------------------------------------------------------------------------//
				}
			};
		}());
		//********************************************************************//
		//-- END CLI OUTPUT FUNCTIONS --
		//********************************************************************//
		//--------------------------------------------------------------------//
/**************************************************************************************************/

	/**
	 * @export
	 * @param  {String} filename - name of file logging the data
	 * @return {Object} Log object - containing a set of logging functions
	 */
	module.exports = function(filename){
		var logObj = logger(filename, '', config.consoleLogLevel);
		logObj.transports.console.level = config.consoleLogLevel || 'info';

		// bind 'cli' object to log; return fully built log module
		return _.reduce(cli, function(fnObj, fn, fnNm){
			logObj[fnNm] = fn.bind(this, filename || '');
			return logObj;
		}, logObj);
	};

		//API:
		//  log('name_of_file.js')
		//	log.info
		//	log.log('info', msg)
		//	log.dir
		//	log.block
		//	log.error
		//	log.getType
		//	log.cli.title
		//
		//
}());
//Fix root path referenced by require
require('rootpath')();
require('trace');
require('clarify');
require('colors');

var gulp = require('gulp');

//NODE MODULES & JS LIBRARIES
var path    = require('path'),
    childProcess = require('child_process'),
    fs      = require('fs-extra'),
    yargs   = require('yargs'),
    merge   = require('merge2'),
    _       = require('lodash'),
    del     = require('del'),
    async   = require('async'),
    tcpPortUsed = require('tcp-port-used');

require('shelljs/global');

//ECMA 6 POLYFILL
//require('babel');
//require('babel/register');
//Object.getPrototypeOf.toString = function() {
//    return Object.toString();
//};

//var nodemonConfig = require('config/nodemon.json');

//------------------------------- PLUGINS --------------------------------//
//PACKAGED GULP PLUGINS --- AVAILABLE VIA 'p.nameOfPackage'
var p = require('gulp-packages')(gulp, [
    'autoprefixer',             // prefix css for multiple browsers
    'babel',                    // compile ECMA6 --> ECMA5
    'concat',
    'debug',                    // lists all files run thru it
    'dev',                      // Toggle html comments on & off
    'display-help',             // Display help file
    'dust',                     // Compile Dust templates
    'express',                  // Launch express framework
    'exit',                     // Force quit Gulp process
    'filter',                   // Filter out unwanted files from stream
    'if-else',                  // if-else statements mid-stream
    'jshint',                   // display Javascript errors
    'newer',                    // Only push item through pipe if newer
    'livereload',               // Relaunch in browser automatically
    'nodemon',                  // Keep server running - restart on crash
    'notify',                   // Tells you if a reload happens
    'plumber',                  // keep running if error occurs
    'print',                    // output errors to console
    'rename',                   // Rename files
    'replace',                  // find-and-replace text in files
    'requirejs-optimize',
    'rimraf',                   // remove files
    'sass',                     // compile scss and sass --> css
    'shell',                    // run shell commands with gulp
    'size',                     // output file size
    'sourcemaps',               // link up precompile and postcompile code
    'stats',                    // provides stats on files passed thru stream
    'sweetjs',                  // expand macros
    'tap',                      // run function mid-stream
    'webpack'                   // compile webpack
]);

//UNPACKAGEABLE GULP PLUGINS
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var wait = require('gulp-wait');
//------------------------------------------------------------------------//

// var handleLiveReloadInUseErr = function handleLiveReloadInUseErr(err){

    //Any uncaught errors should trigger this. Makes pretty and readable error output,
    //with error itself displayed, the app-specific error messages on the stacktrace highlighted
    //at the bottom, and the full stacktrace displayed above.
// };
//------------------------------ CONSTANTS -------------------------------//
var SRC = {
    'root': ['!./node_modules/**', './**'],
    'client': 'client/**',
    'clientJS': 'client/**/*.js',
    'clientStatic': [
    	'client/**/*.html',
    	'client/**/*.png',
    	'client/**/*.gif',
    	'client/**/*.ico',
    	//HACK - not actually static - but here for now since no rendering being done yet
    	'client/**/*.css',
    	'client/**/*.less',
    	'client/**/*.sass',
    	'client/**/*.scss'
    	//////////////////////////////////////////////////////////////
//    'clientStatic': [
//       'client/**',
//        '!client/**/*.js',
//        '!client/js/**'
    ],
    'clientTemplates': 'client/**/*.dust'
};

var DEST = {
    'root': '.build',
    'clientStatic': '.build',
    'clientroot': 'client',
};

var liveReloadPort = 35729;
//------------------------------------------------------------------------//


//------------------ COMMAND LINE PARAMETER HANDLING ---------------------//
//Command line flags accepted by gulp
var cmds = ['test', 'production', 'stats', 'once'];

/**
 * Populate args object w/ command line args, setting each that was received to
  * true in the args object, & all others to false. Referenced by argument name.
  * @example args.production set to true if gulp launched w/ gulp --production.
  */
var args = (function populateArgs(argList, argObj){
    argList.forEach(function createArgObjFromArgArray(arg){
        argObj[arg] = (yargs.argv[arg] === true);
    });
    return argObj;
}(cmds, {}));
//------------------------------------------------------------------------//


//----------------------------------------------------------------------------------------------//
//------------------------------------------ UTILITIES -----------------------------------------//
/**
 * Output webpack errors when caught.
 */
var onError = function onError(err) {
    gutil.beep();
    console.log(gutil.colors.red.bgWhite('-----------------------------------'));
    console.log('ERROR OCCURRED');
    console.log(typeof err);
    console.log(gutil.colors.red.bgWhite(err.toString()));
    console.log(gutil.colors.red.bgWhite('-----------------------------------'));
    this.emit('restart');
    this.emit('end');
};

var fileExists = function fileExists(filePath, callback){
    fs.stat(filePath, function(err, stats) {
        if (err) return callback(false);
        return callback(stats.isFile());
    });
};


//---- LIVERELOAD LAUNCHER ----------------------------------------------------//
/**
 * Launches the livereload server, then watches frontend files, reloading when any change occurs
 * @return {undefined} no return - this is self-contained
 */
var launchLivereloadWatch = function launchLivereloadWatch() {
    livereload.listen(liveReloadPort);
    gulp.watch(SRC.clientJS, ['webpack', 'reload']);
    gulp.watch(SRC.clientTemplates, ['dust2', 'reload']);
};


/**
 * Kills port-blocking process, waits 1/2 a second to relaunch server
 * @param  {Error}  e       Error
 * @param  {String} stdo    stdout - what would emit to shell if no error results
 * @param  {String} stde    stderr - what would emit to shell if an error occurred
 * @return {Function}       next function to run after error chack completes
 */
var portBlockerKilled = function portBlockerKilled(e, stdo, stde) {
    if (e) return console.error(e, { depth: 5 });
    console.log('port blocking process killed!');

    //Brief pause, then launch live reload server
    return setTimeout(launchLivereloadWatch, 500);
};


/**
 * If the livereload server port is blocked by a process, triggers function to kill it.
 * If not, triggers function to start livereload server and file watcher.
 * @param {Boolean} inUse - true if the port is in use; false if not.
 */
var handlePortCheckResult = function handlePortCheckResult(inUse) {
    if (inUse !== true) return launchLivereloadWatch();

    var freePortCmd = 'netstat -tulpn | grep ' + liveReloadPort;
    console.log('Port ' + liveReloadPort + ' is in use!');

    //Figures out the pid of the process blocking the port
    childProcess.exec(freePortCmd, function findPortToKill(err, stdout, stderr) {
        if (err) return console.error(err);
        var pidBlockingPort =
            _.first(_(stdout)
                .thru(function(outstr){
                    return outstr
                        .replace('\n', ' ')
                        .split(' ');
                })
                .compact()
                .last()
                .split('/'));

        //Kills the port-blocking process
        childProcess.exec('kill -9 ' + pidBlockingPort, portBlockerKilled);
    });
};


//TODO what a mess. Callback hell erupted here. Refactor later. Too many named callbacks.
/**
 * Initializes setup of livereload server
 * @return {[type]} [description]
 */
var initLivereloadWatchSetup = function initLivereloadWatchSetup(){
    tcpPortUsed.check(liveReloadPort, '127.0.0.1')

        //handlePortCheckResult if port use check succeeds; below cb if it fails
        .then(handlePortCheckResult,
            function liveReloadPortInUseErr(err) {
                console.error('Error on check:', err.message);
                console.dir(err, { depth: 10 });
            });
};
//---- END LIVERELOAD LAUNCHER ------------------------------------------------//

//---------------------------------------- END UTILITIES ---------------------------------------//
//----------------------------------------------------------------------------------------------//



//################################################################################
//#~~~~~~~~~~~~~~~~~~~~~~~~~~~ REUSABLE PIPE COMPONENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~
//################################################################################
var catchErrors = lazypipe()
    .pipe(p.plumber, { errorHandler: onError });

var consoleTaskReport = lazypipe()
    .pipe(catchErrors)
    .pipe(p.print);

var newerThanRootIfNotProduction = lazypipe()
    .pipe(p.ifElse, !args.production, p.newer.bind(this, DEST.root));


//
// Lightweight templates for removing debug code when production flag set
//
// Removes single-line sections of javascript bookended by: /*<%*/  and  /*%>*/
// E.g.  /*<%*/ console.log('this line of JS gets removed'); /*%>*/
// Removes multiline js blocks bookended by: /*<{{DEBUG*/  and  /*DEBUG}}>*/
//                                    ...OR: /*<{{TEST*/   and   /*TEST}}>*/
//
var rmDebugCode = lazypipe()
    .pipe(p.ifElse, !!args.production,
        p.replace.bind(this, /\/\*<\%.*\%\>\*\//g, ''))
    .pipe(p.ifElse, !!args.production,
        p.replace.bind(this, /\/\*<\{\{DEBUG\*\/[\s\S]*?\/\*DEBUG\}\}\>\*\//gm, ''))
    .pipe(p.ifElse, !!args.production,
        p.replace.bind(this, /\/\*<\{\{TEST\*\/[\s\S]*?\/\*TEST\}\}\>\*\//gm, ''));
//#################################################################################

//################################################################################
//#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LIST ALL GULP TASKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//################################################################################
gulp.task('get-tasks', function() {
    return process.nextTick(function() {
        console.log('\n_________ALL REGISTERED GULP TASKS_________');
        Object.keys(gulp.tasks).forEach(function(t) {
              return (t === 'install' || t === 'uninstall')
                        ? null
                        : console.log('-- ' + t.bgBlack.green)
        });
        console.log('___________________________________________\n');
    })
});
//#################################################################################


//################################################################################
//#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LIVERELOAD SERVER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//################################################################################
gulp.task('server', function livereloadServer(){
    // livereload.listen();
    return consoleTaskReport()
        .pipe(p.nodemon({
            script: 'server.js',
            ext: 'js, html, css, scss, json, less, ico',
            watch: ['./server', './config', 'server.js'],
            execMap: {
                'js': 'node --harmony --harmony_modules --stack-trace-limit=1000'
            }
        })
        .on('restart', function restartServerOnNodemonReset(){
            return gulp.src('server')   // when the app restarts, run livereload.
                .pipe(consoleTaskReport())
                .pipe(p.tap(function() {
                    console.log('\n' + gutil.colors.white.bold.bgGreen('\n' +
                    '     .......... RELOADING PAGE, PLEASE WAIT ..........\n'));
                }))
                //.pipe(notify({message: 'RELOADING PAGE, PLEASE WAIT', onLast: true}))
                // .pipe(wait(1000));
                .pipe(livereload());
        }));
});
//################################################################################

gulp.task('webpack', function webpackTask() {
    return gulp.src(SRC.clientJS)
        .pipe(newerThanRootIfNotProduction())
        .pipe(p.webpack(require('./webpack.config.js')))
        //.pipe(notify({
        //    onLast: true,
        //    message: 'WEBPACKING COMPLETED'
        //}))
        .pipe(gulp.dest(DEST.root));
});

gulp.task('dust', function dustTask(){
    return gulp.src(SRC.tpl)
        .pipe(p.dust({
            name: function(file)  {
                var basename = path.basename(file.relative);
                return basename.substring(0, basename.lastIndexOf('.'));
            }
        }))
        .pipe(gulp.dest(DEST.root))
});

gulp.task('dust2', function dustTask2(){
  return gulp.src(SRC.clientTemplates)
		.pipe(p.dust({
			// Customize template name
			name: function (file) {
				var basename = path.basename(file.relative);
				return basename.substring(0, basename.lastIndexOf('.'));
			}
		}))
		.pipe(p.concat('dustTemplates.js'))
    .pipe(gulp.dest(DEST.root))
    .pipe(gulp.dest(DEST.clientroot))
});

gulp.task('copy-static', function copyStaticTask(){
    return gulp.src(SRC.clientStatic)
        .pipe(newerThanRootIfNotProduction())
        .pipe(gulp.dest(DEST.clientStatic))
});

gulp.task('reload', function reloadTask() {
    return gulp.src(DEST.root)
        .pipe(livereload(liveReloadPort));
});

//################################################################################
//#~~~~~~~~~~~~~~~~~ CONVERT COMMONJS LIBS TO AND FROM REQUIREJS ~~~~~~~~~~~~~~~~~~
//################################################################################

//################################################################################

//gulp.task('build', ['copy-static', 'dust', 'webpack']);
gulp.task('build', function(){ return runSequence(['copy-static', 'webpack'], 'reload'); });

//gulp.task('build', ['copy-static', 'dust', 'webpack']);
gulp.task('full-build', function(){ return runSequence(['dust2', 'copy-static', 'webpack'], 'reload'); });

/**
 * Checks if the livereload port is in use. Finds the process tying it up if so, & kills it.
 * Relaunches livereload server if true
 * @return {[type]}       [description]
 */
gulp.task('default', ['full-build'], function(){ return initLivereloadWatchSetup(); });
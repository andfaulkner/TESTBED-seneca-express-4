console.log('in webpack file!');

//Fix root path referenced by require
require('rootpath')();
require('babel');

// require('babel/register');
Object.getPrototypeOf.toString = function() {
    return Object.toString();
};

/**
 * Webpack configuration for module handling
 */
var path = require('path');
var _      = require('lodash');
var webpack = require('webpack');


/** @type {Objecty} Webpack config export */
module.exports = {

    //location from which all other routes are derived - base path
    'context': __dirname,

    //left side is output file; right side is input file (left used for [name] in output)
    'entry': {
        'index.js':
         './client/index.js'
     },

    'output': {
        path: path.join(__dirname, '\.build'),
        filename: '[name]'
    },

    //Handle SCSS files - convert to CSS    //TODO make this work with '.less' files
    'module': {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "file-loader" }

        ]
    },

    'cache': false,

    //compile for use in a browser environment
    'target': 'web',

    //Keep going even if an error occurs
    'bail': false,

    //Rebuild when any file pointed to changes
    'watch': false,

    //Find libraries in the following locations
    'resolve': {
        root: [path.join(__dirname, 'node_modules')],
        fallback: [path.join(__dirname, 'node_modules')],
        extensions: ['', '.js', '.json'],
        modulesDirectories: ['node_modules']
    },

    'debug': true,

    'plugins': [

        //Remove duplicate JS code
        new webpack.optimize.DedupePlugin(),

        //make the following globally available
        new webpack.ProvidePlugin({
            _: 'lodash',
            async: 'async',
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jquery': 'jquery',
            bootstrap: 'bootstrap',
            Backbone: 'backbone',
            dust: 'dustjs-linkedin'
        })
    ],

    stats: {
        // Nice colored output
        colors: true
    }
};
// var log = require('server/debug/winston-logger')();

(function indexPage(){

  //LIBRARIES
  var $ = require('jquery');
  var _ = require('lodash');
  var Bootstrap = require('bootstrap/dist/js/bootstrap');
  var ie10workaround = require('bootstrap/dist/js/ie10-viewport-bug-workaround');
  var URLs = require('./urls.js');

  var AppRouter = require('./routing/router_main.js');

  //Launch the app when the DOM is ready
  $(function(){
  	console.log('\n\nINDEX.JS::: DOM READY CALLBACK!\n\n');
    new AppRouter();
		Backbone.history.start()
  });
}());
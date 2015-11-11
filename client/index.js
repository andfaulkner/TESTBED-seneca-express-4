// var log = require('server/debug/winston-logger')();

(function indexPage(){

  //LIBRARIES
  var $ = require('jquery');
  var _ = require('lodash');
  var Bootstrap = require('bootstrap/dist/js/bootstrap');
  var ie10workaround = require('bootstrap/dist/js/ie10-viewport-bug-workaround');
  var URLs = require('./urls.js');

  //**************************************************************************//
  //** MODELS
  //*********************************//
  //Example model - does nothing.
  var BackboneModel = Backbone.Model.extend({
  	//Optional constructor
  	initialize: function initialize(){ }
  });

  /**
   * Dummy model data
   */
  var BearDummyData = require('./models/bear-dummy-data.js');

  //Testing crap
  //-------------------- Instantiating dummy data --------------------//
  (function testingCrapModels(){
	  /**
	   * More dummy model data
	   */
	  var meekaBearDummyData = new BearDummyData({
	  	firstName: 'Meeka',
	  	lastName: 'PeekaFaulkner'
	  });
	  meekaBearDummyData.set({
	  	'favoriteBear': 'Sun Bear',
	  	'colour': 'black',
	  	'rar': true
	  });
	  console.log(meekaBearDummyData.get('favoriteBear'));
	  var meekamooBearDummyData = new BearDummyData({ firstName: 'Meekamoo' });
	  console.log(meekamooBearDummyData.get('firstName'));
	  console.log(meekamooBearDummyData.get('favoriteBear'));

	  var meekaPeekaBearDummyData = new BearDummyData({ firstName: 'Meeka', lastName: 'Peeka' });
	  console.log(meekaPeekaBearDummyData.get('firstName'));
	  meekaPeekaBearDummyData.set({ favoriteBear: 'Sun Bear' });
  }());
  //------------------------------------------------------------------//

  // One request to server, no clue where to get the URLs.
  var BearDisplayData = require('./models/bear-display-data.js');
  //-- END MODELS --
  //**************************************************************************//
  //**************************************************************************//
  //** COLLECTIONS
  //*********************************//
  var BearDisplayDataCollection = require('./collections/bear-display-data-collection.js');
  //**************************************************************************//
  //**************************************************************************//
  //** VIEWS
  //*********************************//
  //Top level view - all others inherit from it
  var BackboneAppView = require('./core_views/backbone-view.js');

  /**
   * Handles View containing Home / index content
   */
  var HomeContentView = require('./core_views/home-content-view.js');


	/**
	 * Builds basic content views by running this - an instantiator
	 * @type {Object}
	 */
  var BaseContentViewFactory = require('./core_views/base-content-view-factory.js');

  //Top level view - all others inherit from it
  var BearDisplayView = require('./core_views/bear-display-view.js');

  //-- END VIEWS --
  //**************************************************************************//

	//**************************************************************************//
	//** ROUTING
	//*********************************//
  var AppRouter = require('./routing/router_main.js');

//-- END ROUTING --
//**************************************************************************//

  //Launch the app when the DOM is ready
  $(function(){
  	console.log('\n\nINDEX.JS::: DOM READY CALLBACK!\n\n');
    new AppRouter();
		Backbone.history.start()
  });


  console.log('bottom of index.js!');

}());
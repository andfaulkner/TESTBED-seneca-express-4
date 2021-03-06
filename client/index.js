// var log = require('server/debug/winston-logger')();

(function indexPage(){

  //LIBRARIES
  var $ = require('jquery');
  var _ = require('lodash');
  var Bootstrap = require('bootstrap/dist/js/bootstrap');
  var ie10workaround = require('bootstrap/dist/js/ie10-viewport-bug-workaround');

  //**************************************************************************//
  //** MODELS
  //*********************************//
  //code starts here
  var BackboneModel = Backbone.Model.extend({

  	//Optional constructor
  	initialize: function initialize(){
  	}

  });

  //-- END MODELS --
  //**************************************************************************//

  //**************************************************************************//
  //** VIEWS
  //*********************************//
  //Top level view
  var BackboneAppView = Backbone.View.extend({
  	getComponent: function getComponent(route){
    	return $.get(route, function(data) {
      	return data;
      }.bind(this));
  	},

   	initialize:  function initialize() {
   		this.render();
  	},

  	render: function render() {
			this.getComponent(options.route).then(function(data){
  			this.$el.html(data);
			}.bind(this));
		}
  });



	//Builds content views
  var BaseContentViewFactory = function ContentViewFactory(options) {

  	return new (BackboneAppView.extend({
    	initialize:  function initialize() {
    		this.render();
    	},

    	render: function render() {
				this.getComponent(options.route).then(function(data) {
    			this.$el.html(data);
				}.bind(this));
			}
  	}))({ el: options.el });
  };

  // var baseContentViewFactory = function ContentViewFactory(options){

  //-- END VIEWS --
  //**************************************************************************//

	//**************************************************************************//
	//** ROUTING
	//*********************************//
  var AppRouter = Backbone.Router.extend({

  	routes: {
  		'': 'flipToIndex',
  		'index': 'flipToIndex',
  		'display': 'flipToDisplay',
  		':otherdata': 'other'
  	},

  	baseTopbar: false,

  	_loadBaseTopbar: function _loadBaseTopbar(){
  		var topBarView = BaseContentViewFactory({
  			route: 'components/topbar/topbar.html',
  			el: $('#topbar')
  		});
  	},

  	flipToIndex: function flipToIndex(){
  		if (this.baseTopbar === false) {
    		this.baseTopbar = this._loadBaseTopbar();
  		}
  		var indexContentView = BaseContentViewFactory({
  			route: 'components/forms_page/forms.html',
  			el: $('#container')
  		});
  	},

  	flipToDisplay: function flipToDisplay(){
  		if (this.baseTopbar === false) {
    		this.baseTopbar = this._loadBaseTopbar();
  		}
			var aboutView = BaseContentViewFactory({
				route: 'components/index_page/index_content.html',
				el: $('#container')
			});
  	},

  	other: function other(otherdata){
  		console.log(otherdata);
  	}
  });
//-- END ROUTING --
//**************************************************************************//

  //Launch the app when the DOM is ready
  $(function(){
    new AppRouter();
		Backbone.history.start()
  });


  console.log('bottom of index.js!');

}());
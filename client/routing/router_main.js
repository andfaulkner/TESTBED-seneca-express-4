var BaseContentViewFactory = require('../core_views/base-content-view-factory.js');
var HomeContentView = require('../core_views/home-content-view.js');
var BearDisplayView = require('../core_views/bear-display-view.js');
var TopbarView = require('../core_views/topbar-view.js');
var BearDisplayDataCollection = require('../collections/bear-display-data-collection.js');
var style = 'color:white; background:black';

	module.exports = Backbone.Router.extend({

  	routes: {
  		'': 'flipToIndex',
  		'index': 'flipToIndex',
  		'display': 'flipToDisplay',
  		':otherdata': 'other'
  	},

  	baseTopbar: false,

  	views: {},

  	_loadBaseTopbar: function _loadBaseTopbar(){
			console.log('%c\n\nROUTER_MAIN::: ENTERED _LOADBASETOPBAR\n\n', style);
  		return new TopbarView({
  			el: $('#topbar'),
  			router: this
  		});
  	},

  	flipToIndex: function flipToIndex(){
			console.log('%c\n\nROUTER_MAIN::: ENTERED FLIPTOINDEX\n\n', style);
  		this.baseTopbar = this.baseTopbar || this._loadBaseTopbar();
  		var homeContentView = new HomeContentView({
  			el: $('#container'),
  			router: this
  		});
  	},

  	flipToDisplay: function flipToDisplay(){
  		console.log(_.repeat('^', 200));
			console.log('%c\n\nROUTER_MAIN::: ENTERED FLIPTODISPLAY\n\n', style);

  		this.baseTopbar = this.baseTopbar || this._loadBaseTopbar();

  		if (!_.includes(this.views, 'bearDisplayView')){
	  		this.views.bearDisplayView = new BearDisplayView({
	  			el: $('#container'),
	  			collection: new BearDisplayDataCollection,
	  			router: this
	  		});
	  	} else {
	  		this.views.bearDisplayView.render();
	  	}
  		console.log('%cin router_main::: fillToDisplay:: bearDisplayView:', style);
  		console.log(this.views.bearDisplayView);
  	},

  	other: function other(otherdata){
			console.log('%c\n\nROUTER_MAIN::: ENTERED other\n\n', style);
  		console.log(otherdata);
  	}
  });
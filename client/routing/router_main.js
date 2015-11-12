var BaseContentViewFactory = require('../core_views/base-content-view-factory.js');
var HomeContentView = require('../core_views/home-content-view.js');
var BearDisplayView = require('../core_views/bear-display-view.js');
var TopbarView = require('../core_views/topbar-view.js');
var BearDisplayDataCollection = require('../collections/bear-display-data-collection.js');
var style = 'color:white; font-weight:bold; background:black; font-size: medium';
var modNm = '%c\n\n\/\\\/\\\/-{ ROUTER_MAIN }-\\\/\\\/\\ : ';


module.exports = Backbone.Router.extend({

	routes: {
		'': 'flipToIndex',
		'home': 'flipToIndex',
		'index': 'flipToIndex',
		'display': 'flipToDisplay',
		':otherdata': 'other'
	},

	baseTopbar: false,

	views: {},

	_loadBaseTopbar: function _loadBaseTopbar(){
		console.log(modNm + 'ENTERED _LOADBASETOPBAR\n\n', style);
		return new TopbarView({
			el: $('#topbar'),
			router: this
		});
	},

	_grabView: function _grabView(viewName, ViewClass, opts){
		this.baseTopbar = this.baseTopbar || this._loadBaseTopbar();
		if (!_.has(this.views, viewName)){
  		this.views[viewName] = new ViewClass(_.extend({
  			el: $('#container'),
  			router: this
  		}, opts || {}));
  	} else {
  		this.views[viewName].render();
  	}
	},

	flipToIndex: function flipToIndex(){
		console.log(modNm + 'ENTERED FLIPTOINDEX\n\n', style);
		this._grabView('homeContentView', HomeContentView);
	},

	flipToDisplay: function flipToDisplay(e){
		console.log(_.repeat('^', 200));
		console.log(modNm + 'ENTERED FLIPTODISPLAY\n\n', style);
		this._grabView('bearDisplayView', BearDisplayView, {
			collection: new BearDisplayDataCollection
		});
		console.log(modNm + 'fillToDisplay:: bearDisplayView:', style);
		console.log(this.views.bearDisplayView);
	},

	other: function other(otherdata){
		console.log(modNm + 'ENTERED other\n\n', style);
		console.log(otherdata);
	}
});
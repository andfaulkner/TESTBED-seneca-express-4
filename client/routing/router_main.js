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
		return new TopbarView({
			el: $('#topbar'),
			router: this
		});
	},

	_grabView: function _grabView(viewName, ViewClass, opts) {
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
		this._grabView('homeContentView', HomeContentView);
	},

	flipToDisplay: function flipToDisplay(e){
		this._grabView('bearDisplayView', BearDisplayView, {
			collection: BearDisplayDataCollection
		});
	},

	other: function other(otherdata){
		console.log(modNm + 'ENTERED other\n\n', style);
	}
});
var style = 'color:white; background:magenta; font-weight: bold';
var fileInfo = '%c\n\nBACKBONE-VIEW::: ';

//Top level view - all others inherit from it
var BackboneAppView = Backbone.View.extend({

	getComponent: function getComponent(route){
  	return $.get(route, function(component) {
    	return component;
    });
	},

	loadHTMLSnippetFileIntoEl: function loadHTMLSnippetFileIntoEl(route, noRender, cb) {
		var that = this;
		this.getComponent(route).then(function(htmlSnippet) {
			if (that.noRender) {
				return (cb) ? cb(htmlSnippet) : htmlSnippet;
			}
			that.$el.empty();
			that.$el.html(htmlSnippet);
			return (cb) ? cb(htmlSnippet) : htmlSnippet;
		});
	},

 	initialize: function initialize() {
 		this.render();
	}
});

module.exports = BackboneAppView;
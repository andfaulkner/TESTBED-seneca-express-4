var style = 'color:white; background:magenta; font-weight: bold';
var fileInfo = '%c\n\nBACKBONE-VIEW::: ';

//Top level view - all others inherit from it
var BackboneAppView = Backbone.View.extend({

	getComponent: function getComponent(route){
		console.log(fileInfo, style, 'ENTERED GETCOMPONENT\n\n');
  	return $.get(route, function(component) {
			console.log(fileInfo, style, 'GETCOMPONENT:: $.get CB\n\n');
    	return component;
    });
	},

	loadHTMLSnippetFileIntoEl: function loadHTMLSnippetFileIntoEl(route) {
		var that = this;
		console.log(fileInfo, style, 'ENTERED loadHTMLSnippetFileIntoEl\n\n');
		this.getComponent(route).then(function(htmlSnippet) {
			console.log(fileInfo, style, 'loadHTMLSnippetFileIntoEl:: getcomponent CB\n\n');
			that.$el.empty();
			that.$el.html(htmlSnippet);
		});
	},


 	initialize: function initialize() {
		console.log(fileInfo, style, 'ENTERED INITIALIZE\n\n');
 		this.render();
	}
});

module.exports = BackboneAppView;
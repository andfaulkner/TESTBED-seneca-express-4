var BackboneAppView = require('./backbone-view.js');

var style = 'text-decoration: underline; font-weight: bold; color:Purple ';
var route = 'components/display_page/display_page.html';

var BearDisplayView = BackboneAppView.extend({

	initialize: function(){
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: ENTERED INITIALIZE\n\n', style);
		console.dir(this);
		console.dir(this.collection);
		console.log(this.displayCollection);
		//Rerender when collection being rendered changes
		this.listenTo(this.collection, 'reset', this.displayCollection);
		this.render();
	},

	displayCollection: function(){
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: ENTERED DISPLAYCOLLECTION\n\n', style);
		console.log('displayCollection!');
	},

	show: function(model){
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: ENTERED SHOW\n\n', style);
		this.model = model;
		var firstNames = _.pluck(model, 'firstName');
		console.log('BearDisplayView:: show: model: '); console.log(model);
		console.log('firstNames:'); console.log(firstNames);
		this.render();
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: BOTTOM OF SHOW\n\n', style);
	},

	render: function render(){
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: ENTERED RENDER\n\n', style);
		console.log(route);
		console.log(this.$el);
		this.loadHTMLSnippetFileIntoEl(route);
		console.log('BearDisplayView::::::::::::::::::::::::::::::: BOTTOM OF render');
	}
});

module.exports = BearDisplayView;
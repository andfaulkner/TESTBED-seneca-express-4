var BackboneAppView = require('./backbone-view.js');
var modNm = '%c\n\n--- TOPBAR-VIEW --- ';
var style = 'color:white; background: green; font-size: medium';

var TopbarView = BackboneAppView.extend({
	events: {
		'click #topbar_home': 'loadHomeContent',
		'click #topbar_display': 'loadDisplayContent'
	},
	initialize: function initialize(options){
		this.router = options.router;
		this.render();
	},
	render: function render(){
		this.loadHTMLSnippetFileIntoEl('/components/topbar/topbar.html')
	},
	loadHomeContent: function loadHomeContent(event){
		event.preventDefault();
		this.router.navigate('home', { trigger: true });
	},
	loadDisplayContent: function loadDisplayContent(event){
		event.preventDefault();
		this.router.navigate('display', { trigger: true });
	}
});

module.exports = TopbarView;
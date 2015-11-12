var BackboneAppView = require('./backbone-view.js');
var modNm = '%c\n\n--- TOPBAR-VIEW --- ';
var style = 'color:white; background: green; font-size: medium';

var TopbarView = BackboneAppView.extend({
	events: {
		'click #topbar_home': 'loadHomeContent',
		'click #topbar_display': 'loadDisplayContent'
	},
	initialize: function initialize(options){
		console.log(modNm, style, 'fn INITIALIZE: options.router:');
		this.router = options.router;
		console.log(this.router);
		this.render();
	},
	render: function render(){
		console.log(modNm, style, 'fn RENDER');
		this.loadHTMLSnippetFileIntoEl('/components/topbar/topbar.html')
	},
	loadHomeContent: function loadHomeContent(event){
		event.preventDefault();
		console.log(modNm, style, 'fn loadHomeContent');
		console.log('loadHomeContent');
		this.router.navigate('home', { trigger: true });
	},
	loadDisplayContent: function loadDisplayContent(event){
		event.preventDefault();
		console.log(modNm, style, 'fn loadDisplayContent');
		this.router.navigate('display', { trigger: true });
	}
});

module.exports = TopbarView;
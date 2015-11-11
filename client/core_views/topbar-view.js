var BackboneAppView = require('./backbone-view.js');

var TopbarView = BackboneAppView.extend({
	events: {
		'click #topbar_home': 'loadHomeContent',
		'click #topbar_display': 'loadDisplayContent'
	},
	initialize: function initialize(options){
		console.log('options.router');
		this.router = options.router;
		console.log(this.router);
		this.render();
	},
	render: function render(){
		this.loadHTMLSnippetFileIntoEl('/components/topbar/topbar.html')
	},
	loadHomeContent: function loadHomeContent(event){
		console.log('loadHomeContent');
		this.router.navigate('home', { trigger: true });
	},
	loadDisplayContent: function loadDisplayContent(event){
		console.log('loadDisplayContent');
		this.router.navigate('display', { trigger: true });
	}
});

module.exports = TopbarView;
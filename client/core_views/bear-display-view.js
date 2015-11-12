var BackboneAppView = require('./backbone-view.js');

var style = 'text-decoration: underline; font-weight: bold; color:Purple ';
var modNm = '%c\n\nBEAR-DISPLAY-VIEW::: ';
var route = 'components/display_page/display_page.dust';
// var dust = require('../lib/dustjs-linkedin/dist/dust-full.js');
console.log(dust);
require('../dustTemplates.js');

var BearDisplayView = BackboneAppView.extend({

	initialize: function(options){
		this.collection = new options.collection;

		//Rerender when collection being rendered changes
		this.listenTo(this.collection, 'reset', this.resetCollFired);
		this.collection.grabData();
		console.log(modNm + 'ENTERED INITIALIZE\n\n', style);
		console.dir(this);
		console.dir(this.collection);
		console.log(this.displayCollection);
		this.render();
	},

	_html: {
		td: function htmlCol(str){
			return '<td>' + str + '</td>';
		}
	},

	hasResetFiredOnce: false,

	resetCollFired: function resetCollFired(){
		this.hasResetFiredOnce = true;
		this.displayCollection();
	},

	displayCollection: function(){
		console.log(modNm + 'ENTERED DISPLAYCOLLECTION\n\n', style);
		console.log('displayCollection!');
		console.log(this.collection);
		$('#display_page_table_data').empty();

		this.collHtml = this.collection.reduce(function(memo, item){
			memo = memo || '';
			console.log('memo'); console.log(memo);
			console.log('item'); console.log(item);
			return memo + '<tr>' +
				'<td>' + item.get('firstName') + '</td>' +
				'<td>' + item.get('lastName') + '</td>' +
				'<td>' + item.get('favoriteBear') + '</td>' +
				'</tr>';
		});
		this.render();
	},

	show: function(model){
		console.log(modNm + 'ENTERED SHOW\n\n', style);
		this.model = model;
		var firstNames = _.pluck(model, 'firstName');
		console.log(modNm + 'show: model: '); console.log(model);
		console.log('firstNames:'); console.log(firstNames);
		this.render();
		console.log(modNm + 'BOTTOM OF SHOW\n\n', style);
	},

	render: function render(){
		console.log(modNm + 'ENTERED RENDER\n\n', style);
		console.log(route); console.log(this.$el);
		var that = this;
		// this.loadHTMLSnippetFileIntoEl(route, true, function(htmlSnippet){
		console.log(modNm + 'ENTERED loadHTMLSnippetFileIntoEl CB\n\n', style);
		var renderObj = { collHtml: that.collHtml };
		dust.render('display_page_tpl', renderObj, function displayPageTplRender(err, out) {
			console.log(out);
			that.$el.html(out);
		});
		console.log(modNm + '::::::::::::::::::::::::::::::: BOTTOM OF render');
	}
});

module.exports = BearDisplayView;
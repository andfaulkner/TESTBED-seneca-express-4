var BackboneAppView = require('./backbone-view.js');

var style = 'text-decoration: underline; font-weight: bold; color:Purple ';
var modNm = '%c\n\nBEAR-DISPLAY-VIEW::: ';
var route = 'components/display_page/display_page.dust';
require('../dustTemplates.js');

var BearDisplayView = BackboneAppView.extend({

	initialize: function(options){
		this.collection = new options.collection;

		//Rerender when collection being rendered changes
		this.listenTo(this.collection, 'reset', this.resetCollFired);
		this.collection.grabData();
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
		$('#display_page_table_data').empty();

		this.collHtml = this.collection.reduce(function(memo, item){
			memo = memo || '';
			return memo + '<tr>' +
				'<td>' + item.get('firstName') + '</td>' +
				'<td>' + item.get('lastName') + '</td>' +
				'<td>' + item.get('favoriteBear') + '</td>' +
				'</tr>';
		});
		this.render();
	},

	show: function(model){
		this.model = model;
		var firstNames = _.pluck(model, 'firstName');
		this.render();
	},

	render: function render(){
		var that = this;
		var renderObj = { collHtml: that.collHtml };
		dust.render('display_page_tpl', renderObj, function displayPageTplRender(err, out) {
			that.$el.html(out);
		});
	}
});

module.exports = BearDisplayView;
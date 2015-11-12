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

	_html: {
		td: function htmlCol(str){
			return '<td>' + str + '</td>';
		}
	},

	displayCollection: function(){
		console.log('%c\n\nBEAR-DISPLAY-VIEW::: ENTERED DISPLAYCOLLECTION\n\n', style);
		console.log('displayCollection!');
		console.log(this.collection);
		$('#display_page_table_data').empty();
		$('#display_page_table_data')
			.html(this.collection.reduce(function(memo, item){
				memo = memo || '';
				console.log('memo');
				console.log(memo);
				console.log('item');
				console.log(item);
				return memo + '<tr>' +
					'<td>' + item.get('firstName') + '</td>' +
					'<td>' + item.get('lastName') + '</td>' +
					'<td>' + item.get('favoriteBear') + '</td>' +
					'</tr>';
		}));
		// console.log(htmlStr);
		// this._createRow();
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
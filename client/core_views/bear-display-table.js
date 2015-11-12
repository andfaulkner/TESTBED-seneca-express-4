var BearDisplayTable = BackboneAppView.extend({
	el: $('#display_page_table_data'),
	render: function render(){
 		this.loadHTMLSnippetFileIntoEl('components/forms_page/forms.html');
	},

});

module.exports = BearDisplayTable;
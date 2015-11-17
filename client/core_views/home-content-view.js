var BackboneAppView = require('./backbone-view.js');
var URLs = require('../urls.js');

module.exports = BackboneAppView.extend({
  	events: {
  		'click #forms_page--form__submitBtn': 'submitForm'
  	},
  	render: function render() {
  		var that = this;
  		this.loadHTMLSnippetFileIntoEl('components/forms_page/forms.html');
		},
		//Submit button; TODO also send this to the model?
		submitForm: function submitForm(event){
			event.preventDefault();
      $.ajax({
      		url: URLs.indexBearDataReceiver,
      		type: 'post',
      		data: $("#forms_page--form-target").serialize(),
      		success: function(data, textStatus, xhr) {
	          console.log('form submission complete!');
	        }
      });
		}
  });
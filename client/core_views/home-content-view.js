var BackboneAppView = require('./backbone-view.js');

module.exports = BackboneAppView.extend({
  	events: {
  		'click #forms_page--form__submitBtn': 'submitForm'
  	},
  	render: function render() {
			console.log('%c\n\nHOME-CONTENT-VIEW::: ENTERED RENDER\n\n', "color:blue");
  		var that = this;
  		this.loadHTMLSnippetFileIntoEl('components/forms_page/forms.html');
		},
		//Submit button
		//TODO also send this to the model?
		submitForm: function submitForm(event){
			console.log('%c\n\nHOME-CONTENT-VIEW::: ENTERED SUBMIT-FORM\n\n', "color:blue");
			event.preventDefault();
      $.ajax({
      		url: URLs.indexBearDataReceiver,
      		type: 'post',
      		data: $("#forms_page--form-target").serialize(),
      		success: function(data, textStatus, xhr) {
						console.log('%c\n\nHOME-CONTENT-VIEW::: ' +
								'ENTERED SUBMIT-FORM SUCCESS CB\n\n', "color:blue");
	        	console.log(data);
	          console.log('form submission complete!');
	        }
      });
			console.log('SUBMITTED!');
		}
  });
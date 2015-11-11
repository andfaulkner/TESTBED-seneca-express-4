var BackboneAppView = require('./backbone-view.js');

module.exports = BackboneAppView.extend({
  	events: {
  		'click #forms_page--form__submitBtn': 'submitForm'
  	},
  	render: function render() {
			console.log('%c\n\nHOME-CONTENT-VIEW::: ENTERED RENDER\n\n', "color:blue");
  		var that = this;
  		this.loadHTMLSnippetFileIntoEl('components/forms_page/forms.html');
			// this.getComponent('components/forms_page/forms.html').then(function(data){
			// 	console.log('%c\n\nHOME-CONTENT-VIEW::: ENTERED RENDER getComponent CB\n\n', "color:blue");
  	// 		that.$el.html(data);
			// });
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
// FRONTEND

(function components_forms_MODULE (){

	var URLs = {
		indexBearDataReceiver: 'api/form_handler'
	}

	var BearModel = Backbone.Model.extend({

	});

	var BearView = Backbone.View.extend({
		onRender: function onRender(){

		},
		events: {
			'click #forms_page--form__submitBtn': 'submitForm'
		},

		submitForm: function submitForm(){
			console.log('in submitForm!');
		}
	});


    $('body').on('submit', '#forms_page--form-target', function(event) {
        event.preventDefault();
        console.dir('submit override!');
        console.log($(this)[0]);
        console.log($(this).html());
        $.ajax({
        		url: URLs.indexBearDataReceiver,
        		type: 'post',
        		data: $("#forms_page--form-target").serialize(),
        		success: function(data, textStatus, xhr) {
		        	console.log(data);
		          console.log('form submission complete!');
		        }
        });
    });

    module.exports = { };
}());
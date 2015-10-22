(function components_forms_MODULE (){

    $('body').on('submit', '#forms_page--form-target', function(event) {
        event.preventDefault();
        console.dir('submit override!');
        $.post('api/form_handler', $(this).html(), function(data, textStatus, xhr) {
            console.log('form submission complete!');
        });
    });

    module.exports = { };
}());
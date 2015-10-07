(function components_forms_MODULE (){

    $('body').on('submit', '#forms_page--form-target', function(event) {
        event.preventDefault();
        console.log('submit override!');
        $.post('api/form-hander', $(this).html(), function(data, textStatus, xhr) {
            console.log('form submission complete!');
        });
    });

    module.exports = { };
}());
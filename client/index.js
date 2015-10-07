(function indexPage(){

    //LIBRARIES
    var $ = require('jquery');
    var _ = require('lodash');
    var Bootstrap = require('bootstrap/dist/js/bootstrap');
    var ie10workaround = require('bootstrap/dist/js/ie10-viewport-bug-workaround');

    //CONTENT PAGES
    var formsPage = require('./components/forms_page/forms');

    // ********** Component handler *********** //
    var getIndexContent = function getIndexContent(event){
        return $.get('components/forms_page/forms.html', function(data) {
            $('#container').html(data);
        });
    };

    //Default page - on load
    getIndexContent();

    // ********** Components *********** //
    $('body').on('click', '#topbar_home', getIndexContent);

    $('body').on('click', '#topbar_about', function(event) {
        $.get('components/index_page/index_content.html', function(data) {
            $('#container').html(data);
        });
    });
    // ********************************* //

    console.log('index.js ran!');

}());
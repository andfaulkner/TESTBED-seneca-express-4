module.exports = function formHandlerAPI_SenecaPlugin(options) {

    this.add('role:api,cmd:form_handler', form_handler_cb);
    this.add('role:api,cmd:form_handler_2', form_handler_2_cb);
    this.add('role:api,cmd:form_handler_3', form_handler_3_cb);


    this.act('role:web', {
        use: {
            prefix: '/api',
            pin: 'role:api,cmd:*',
            map: {
                'form_handler': { GET: true, POST: true },
                'form_handler_2': { GET: true, POST: true },
                'form_handler_3': true //GET by default
            }
        }}
    );


    function form_handler_cb(msg, callback){
    		console.log('form handler cb ran!');
    		console.dir(msg);
    		console.log(Object.keys(msg));
    		console.log( arguments);
        //operations here
        callback(null, { some_key: 'some_result'});
    }


    function form_handler_2_cb(msg, callback){
        //operations here
        callback(null, { some_key: 'some_result'});
    }


    function form_handler_3_cb(msg, callback){
        //operations here
        callback(null, { some_key: 'some_result'});
    }
};
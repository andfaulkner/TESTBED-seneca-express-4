var log = require('server/debug/winston-logger')('server/microservices/api/form-handler-api');

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
    		log.info('form handler cb ran!');

    		log.heading('request messages - with log');
    		log.dir('info', msg);

    		log.heading('request message - with log');
    		log.dir(msg.req$.body);

    		log.heading('request message - body - with console');
    		console.dir(msg.req$.body);

    		log.heading('request message - body keys');
    		console.log(Object.keys(msg.req$.body));

    		log.verbose(Object.keys(msg));
    		log.silly(arguments);
        //operations here

				var starter_data = this.make('starter_data');

				starter_data.first_name = msg.req$.body.name.first;
				starter_data.last_name = msg.req$.body.name.last;
				starter_data.colour = msg.req$.body.colour;
				starter_data.favorite_bear = msg.req$.body.favorite_bear;
				starter_data.rar = msg.req$.body.rar;

        starter_data.save$(function(err, starter_data_ret) {
	    		log.heading('starter_data_ret var after data save:::');
        	console.log(starter_data_ret);
        	console.log('\n\nType:');
        	console.log(typeof starter_data_ret);
        	console.log('\n\nstarter_data_ret object output: ');
        	console.dir(starter_data_ret);
        	console.log('\n\nlog$ function source: ');
        	console.log(starter_data_ret.log$.toString());
        	console.log('\n\nprivate$.seneca.log function (as called by log$) source: ');
        	console.log(starter_data_ret.private$.seneca.log.toString());
        	console.log('\n\nprivate$.seneca object: ');
        	console.dir(starter_data_ret.private$.seneca);
        	console.log('\n\nprivate$.seneca.delegate function source: ');
        	console.log(starter_data_ret.private$.seneca.delegate.toString());
        	console.log('####################### END starter_data #######################\n\n');
        	console.log('success!');

        	console.log('\n\nCalling this: ');
        	console.dir(this);

        	var senecaFixedArgs = this.delegate({foo: 'original'});
        	console.log('\n\nsenecaFixedArgs object returned by running delegate::');
        	console.log(senecaFixedArgs);
        	console.log('\n\nnewly assigned fixed arg in senecaFixedArgs object ret by delegate::');
        	console.log(senecaFixedArgs.fixedargs.foo);

        	console.log('\n\nsenecaFixedArgs object root - senecaFixedArgs.root.delegate({}) ::');
        	console.log(senecaFixedArgs.root.delegate({}));

//        	console.log('\n\nthis.prior call in senecaFixedArgs::');
//        	console.log(senecaFixedArgs.prior());

        	console.log('\n\nSeneca object - after delegate used to assign "fixed args" ::');
        	console.dir(this);
        	console.log('\n\nsrc of "parent" fn of seneca obj, after delegate assigned fixed args :');
        	console.log(this.parent.toString());

        	console.log('\n\nthis.root::');
        	console.log(this.root);

        	console.log('\n\nthis.version::');
        	console.log(this.fixedargs);

        	console.log('###################################################################');

//        	var senecaFixedArgsOverridden = this.delegate({foo: 'overriddenValue'});
//        	console.log('\n\nSeneca fixed args - after delegate run::');
//        	console.log(senecaFixedArgsOverridden);

            // log.info(starter_data_ret);
            // callback(null, {
            //     role: 'data_entity_test',
            //     cmd: 'loadentity',
            //     id: starter_data.id,
            //     entity: starter_data
            // });
        });

        // this.act({ role: 'data_entity_test', cmd: 'newentity' }, function(err, msg) {
	        // var starter_data = this.make('starter_data');
            // entities.push(msg.entity);
            // seneca.act(msg, function(err, msg) {
            //     log.silly(entities);
            // });
        // });



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
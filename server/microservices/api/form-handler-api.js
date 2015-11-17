var log = require('server/debug/winston-logger')('server/microservices/api/form-handler-api');
var bookshelf = require('../../data/bookshelf.js');

var StarterDataModel = bookshelf.Model.extend({
	tableName: 'starter_data',
	idAttribute: 'starter_id',
	roles: function(){
		return this.belongsToMany(Role);
	}
});

var Role = bookshelf.Model.extend({
	tableName: 'roles',
	idAttribute: 'role_id',
	starterDataModels: function(){
		return this.belongsToMany(StarterDataModel);
	}
});

module.exports = function formHandlerAPI_SenecaPlugin(options) {

    this.add('role:api,cmd:form_handler', save_form_data_cb);
    this.add('role:api,cmd:return_bear_display_collection', return_bear_display_collection_cb);

    this.act('role:web', {
        use: {
            prefix: '/api',
            pin: 'role:api,cmd:*',
            map: {
                'form_handler': { GET: true, POST: true },
                'return_bear_display_collection': { GET: true, POST: true }
            }
        }}
    );


    /**
     * Handles data submitted by the 'bear form' on the main page
     * @param  {Object}   msg      Seneca args. access msg via msg.req$.body.
     * @param  {Function} callback Send successful result to callback
     * @return {[type]}            [description]
     */
    function save_form_data_cb(msg, callback){
    	var roles = _.map(msg.req$.body.roles.split(','), _.trim);

    	new Role().fetchAll().then(function(roleColl){
    		var withoutRolesSpread = _.spread(_.partial(_.without, roles));
				var rolesToAdd = (roleColl)
					? withoutRolesSpread(_.uniq(roleColl.pluck('role')))
    			: roles;
				async.eachSeries(rolesToAdd, function(role, next){
					new Role({ role: role }).save().then(function(){
						next(null);
					});
				}, function(err){
					return;
				});

    	}).then(function(){
	      new StarterDataModel({
	      	first_name: msg.req$.body.name.first,
	      	last_name: msg.req$.body.name.last,
	      	colour: msg.req$.body.colour,
	      	favorite_bear: msg.req$.body.favorite_bear,
	      	rar: msg.req$.body.rar,

	      }).save().then(function(model){
	      	console.log('model saved!');
	      	console.dir(model);
	        callback(null, { some_key: 'some_result'});
	      });
    	});
    }

    /**
     * Send back ALL the data.
     * @param  {[type]}   msg      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function return_bear_display_collection_cb(msg, callback){
			new StarterDataModel().fetchAll()
				.then(function(data){
					var finalDataObj = _.reduce(data.models, function(outputData, collItem){
						outputData.push({
							firstName: collItem.get('first_name'),
							lastName: collItem.get('last_name'),
							colour: collItem.get('colour'),
							favoriteBear: collItem.get('favorite_bear'),
							rar: collItem.get('rar') || false
						});
						return outputData;
					}, []);
					callback(null, finalDataObj);
				});
    }
};
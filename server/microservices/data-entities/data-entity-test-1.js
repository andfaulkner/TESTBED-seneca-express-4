module.exports = function data_entity_test_SenecaPlugin(options) {

    var pluginName = 'data_entity_test';


    this.add( { role: pluginName, cmd: 'newentity' }, newentity_callback);
    this.add( { role: pluginName, cmd: 'loadentity' }, loadentity_callback);


    function newentity_callback(msg, callback) {
        var test_entity_1 = this.make('test_entity_1');
        test_entity_1.omnom = 'omnomnomnom';
        test_entity_1.name = 'omnomnom man';
        test_entity_1.type = 'omnomnom-er';
        test_entity_1.price = 1.42;
        test_entity_1.entNum = msg.entNum;
        test_entity_1.save$(function(err, test_entity_1){
            console.log(test_entity_1);
            callback(null, {
                role: pluginName,
                cmd: 'loadentity',
                id: test_entity_1.id,
                entity: test_entity_1
            });
        });
    }


    function loadentity_callback(msg, callback) {
        log.info('in loadentity!');
        msg.entity.load$(msg.id, function(err, test_entity_1){
            callback(null, { 'some_key': 'some_result'});
        });
    }

    return pluginName;
};
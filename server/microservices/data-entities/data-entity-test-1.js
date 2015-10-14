module.exports = function data_entity_test_SenecaPlugin(options) {

    var pluginName = 'data_entity_test';


    this.add( { role: pluginName, cmd: 'cmd1' }, cmd1_callback);
    this.add( { role: pluginName, cmd: 'cmd2' }, cmd2_callback);


    function cmd1_callback(msg, callback) {
        callback(null, { 'some_key': 'some_result'});
    }


    function cmd2_callback(msg, callback) {
        callback(null, { 'some_key': 'some_result'});
    }

    return pluginName;
};
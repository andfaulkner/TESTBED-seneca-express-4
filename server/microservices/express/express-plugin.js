var jsBeautify = require('js-beautify');
var circularJSON = require('circular-json');


module.exports = function express_plugin(options) {


    this.add({role:'test_plugin', cmd:'cmd1'}, function cmd1(msg, respond){
        respond(null, {answer:'response from cmd1!'});
    });


    this.wrap({role:'test_plugin'}, function(msg, respond){
        // log.block('MSG NEXT IN {role: "test_plugin"}', msg, {doDir:true});
        // log.block('JSON PARSED MSG NEXT IN {role: "test_plugin"}',
        //               circularJSON.stringify(msg));
        // log.block('PRETTY MSG NEXT IN {role: "test_plugin"}',
        //               jsBeautify(circularJSON.stringify(msg)));
        // log.block('Pretty msg.caller$ arg NEXT IN {role: "test_plugin"}',
        //             msg.caller$.replace(/\s\s\s\s\sAction/, 'Action')
        //                        .replace(/:\sError:/, '\n Error:'));
        this.prior(msg, respond);
    });

};
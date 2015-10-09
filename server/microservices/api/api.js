module.exports = function test_API_microservice_module(options) {
    var seneca = this;
    var plugin = 'api';

    this.add({ role: 'offer', cmd: 'provide' },
        function(args, done){
            done(null, { });
        }
    );

    this.add({ role: plugin, cmd: 'withdraw' }, roleAPICmdWithdraw_action);
    this.add({ role: plugin, cmd: 'offer' }, roleAPICmdOffer_action);

    this.act(
        'role:web',
        { use: {
            prefix: '/api',
            pin: 'role:api,cmd:*',
            map: {
                'offer': { GET: true },
                'withdraw': { GET: true, POST: true }
            }
        }}
    );

    function roleAPICmdOffer_action(msg, callback) {
        var jsonResponsePayload = {
            msgReceived: msg,
            fn: 'roleAPICmdOffer_action',
            isOfferOnTable: true,
            responseText: 'offer was put on the table'
        };
        callback(null, jsonResponsePayload);
    }

    function roleAPICmdWithdraw_action(msg, callback) {
        var jsonResponsePayload = {
            msgReceived: msg,
            fn: 'roleAPICmdWithdraw_action',
            isOfferOnTable: false,
            responseText: 'offer was withdrawn!'
        };
        callback(null, jsonResponsePayload);
    }


    // function roleAPIEndOffer_action(args, done) {
    //     var user = args.req$.seneca.user || {};
    //     this.act('role:offer,cmd:provide', { nick: user.nick }, done);
    // }


    // return { name: plugin };
}
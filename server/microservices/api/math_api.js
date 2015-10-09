module.exports = function api(options) {

    var valid_ops = { sum: 'sum', product: 'product' };

    this.add(
        { role: 'math', cmd: 'product'},
        function(msg, respond) {
            log.info('~~~~~~~~~~~~ role:api,path:calculate,cmd:sum ~~~~~~~~~~~~');
            console.dir(msg);
            respond(null, { answer: msg.left * msg.right });
        }
    );


    this.add(
        { role: 'math', cmd: 'sum'},
        function(msg, respond) {
            log.info('~~~~~~~~~~~~ role:api,path:calculate,cmd:sum ~~~~~~~~~~~~');
            log.info(msg);
            respond(null, { answer: msg.left + msg.right });
        }
    );


    this.add(
        { role: 'api', path:'calculate' },
        function(msg, respond) {
            log.info('~~~~~~~~~~~~ role:api,path:calculate ~~~~~~~~~~~~');
            log.info(msg);
            this.act(
                { role: 'math' },
                { cmd:    valid_ops[msg.operation],
                  left:   msg.left,
                  right:  msg.right
                }, respond
            )
        }
    );


    this.add(
        { init:'api' },
        function(msg, respond) {
            this.act(
                'role:web',
                {use: {
                    prefix: '/api',
                    pin: 'role:api,path:*',
                    map: {
                        calculate: { GET: true, suffix: '/:operation' }
                    }
                }},
                respond);
        }
    );
}
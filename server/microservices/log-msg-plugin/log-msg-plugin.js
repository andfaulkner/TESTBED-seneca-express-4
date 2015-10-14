module.exports = function log_msg(options) {

    //--------------------------------------------------------------------//
    //********************************************************************//
    //** LOOSE FUNCTIONS
    //*********************************//

    function init(msg, respond) {
        // // log.block('in log-msg-plugin init function!', msg);
        log.debug('in log-msg-plugin init function!');
        respond();
    }

    //-- END LOOSE FUNCTIONS --
    //********************************************************************//
    //--------------------------------------------------------------------//


    this.add( 'init:log_msg', init);


    /**
     * PATTERN:        {role: 'log_msg', cmd: 'block'}
     *
     * ARGS ACCEPTED (as properties in message object):
     *     data:  {String|Object|Function} - actual data to display on the CLI
     *     title: {String} - name in the log title heading,
     *     opts:  {Object} - options object:
     *               doDir:      if true, log param data as obj (a la console.dir) {default: false}
     *               isEndSpace: if true, add a blank space to the end of block    {default: false}
     *
     * CALLBACK:
     *     @param {Object} msg - Object used to make call. Contains the pattern itself, &
     *                any args attached, all as separate msg object properties
     *     @param {Function} respond - callback - must run with null as 1st arg
     *     @return {Object} - returns via callback. 2nd arg passed to 'respond' gets returned e.g.
     *                            respond(null, {someResponse: 'some response string'});
     */
    this.add({role:'log_msg', cmd:'block'}, function log_msg__block(msg, respond){
        if (!_.has(msg, 'data')) {
            respond(new Error('More info needed for role:log_msg,cmd:block to log data'),
                    {didLog: false});
        } else {
            // log.dataBlock((msg.title || ''), msg.data, (msg.opts || {}));
            respond(null, {didLog:true});
        }
    });


    /**
     * PATTERN:        {role: 'log_msg', cmd: 'error'}
     * ARGS ACCEPTED:
     *     data:  {String|Object|Function} - actual data to display on the CLI
     *
     * CALLBACK:
     *     @param {Object} msg - Object used to make call. Contains the pattern itself, &
     *                any args attached, all as separate msg object properties
     *     @param {Function} respond - callback - must run with null as 1st arg
     *     @return {Object} - returns via callback. 2nd arg passed to 'respond' gets returned e.g.
     *                ---  respond(null, {someResponse: 'some response string'});
     */
    this.add({role:'log_msg', cmd:'error'}, function log_msg__error(msg, respond){
        if (!_.has(msg, 'data')) {
            // log.error(msg);
            respond(null, {didLog: true});
        } else {
            respond(new Error('More info needed for role:log_msg,cmd:error to log data'),
                    {didLog: false});
        }
        respond(null, {answer:'response from cmd1!'});
    });


    /**
     * Runs prior to any fn triggered by calls starting w/ role:'log_msg'; actual call triggered by
     * this.prior below. E.g. for a call to {role:'log_msg', cmd:'block'}, the run order would be:
     *     [this.wrap -> this.prior ==]==> this.add({role:'log_msg', cmd:'block'}) callback
     * @param  {[type]} msg        [description]
     * @param  {[type]} respond){                     log.block('DATA SENT TO {role: 'log_msg plugin'}', msg);        this.prior(msg, respond);    } [description]
     * @return {[type]}            [description]
     */
    this.wrap({role:'log_msg'}, function(msg, respond){
        log.silly('in log-msg-plugin wrapper function')
        this.prior(msg, respond);
    });

};
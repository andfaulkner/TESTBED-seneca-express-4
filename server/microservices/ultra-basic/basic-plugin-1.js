module.exports = function basicSenecaPlugin1(options) {

    this.add(
        {role:'test-plugins', cmd:'ret-random-num'},
        function(args, respond) {
            // console.log(args);
            // console.log(options);
            respond(null, Math.random());
        }
    );

}
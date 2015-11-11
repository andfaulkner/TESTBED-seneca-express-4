var BearDummyData = Backbone.Model.extend({
    defaults: {
        firstName: '',
        lastName: '',
        colour: 'brown',
        favoriteBear: 'Grizzly',
        rar: false
    },
    //triggered whenever you create a new instance of a model
    initialize: function initialize() {
        console.log('\'dummy\' BearDummyData initialized!');
        this.on('change:favoriteBear', function(model) {
            console.log('favoriteBear has been changed to: ' + model.get('favoriteBear'));
        });
    }
});

module.exports = BearDummyData;
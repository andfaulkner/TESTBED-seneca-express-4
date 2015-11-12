var BearDisplayData = require('../models/bear-display-data.js');

var styleSync = 'color:white; background:green; font-size: large'
var modName = '%c\n\nBEAR-DISPLAY-DATA-COLLECTION::: '


Backbone.sync = function backboneSync(method, modelOrColl, options) {
	console.log(modName + 'ENTERED SYNC\n\n', styleSync);

	if (method === 'read') {
		$.ajax({
    	url: modelOrColl.url,
      type: 'get',
      success: function(collData, textStatus, xhr) {
				console.log(modName + 'ENTERED SYNC SUCCESS CB FOR READ METHOD\n\n', styleSync);
		    console.dir(collData);

				modelOrColl.reset(_.reduce(collData, function resetCollReducer(modelDataObj, val, key) {
					modelDataObj = modelDataObj || [];
					modelDataObj.push({
						firstName: val.firstName,
						lastName: val.lastName,
						favoriteBear: val.favoriteBear
					});
					return modelDataObj;
				}, []));

				console.log(modName + 'SYNC::: SUCCESS CB END::: modelOrColl:::\n\n', styleSync);
		    console.dir(modelOrColl);
			}
		});
	}
};

//CLASS//
var BearDisplayDataCollection = Backbone.Collection.extend({
	model: BearDisplayData,
	url: '/api/return_bear_display_collection',
	events: {
		'change': 'handleNewData'
	},
	handleNewData: function handleNewData(){
		console.log('handleNewData');
	},
	grabData: function grabData(){
		this.fetch();
	},
	initialize: function initialize(){
		console.log('initializing BearDisplayDataCollection!')
	}
});

// var bearDisplayDataColl1 = new BearDisplayDataCollection();

// bearDisplayDataColl1.fetch();
// console.log('bearDisplayDataColl1');  console.log(bearDisplayDataColl1);

// var bearDisplayDataCollItem = bearDisplayDataColl1.get(1);

module.exports = BearDisplayDataCollection;
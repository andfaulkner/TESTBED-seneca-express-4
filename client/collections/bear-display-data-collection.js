var BearDisplayData = require('../models/bear-display-data.js');

var styleSync = 'color:white; background:green; font-size: large'

Backbone.sync = function(method, modelOrColl, options){
	console.log('%c\n\nBEAR-DISPLAY-DATA-COLLECTION::: ENTERED SYNC\n\n', styleSync);
	if (method === 'read') {
		$.ajax({
    	url: modelOrColl.url,
      type: 'get',
      success: function(collData, textStatus, xhr) {
				console.log('%c\n\nBEAR-DISPLAY-DATA-COLLECTION::: ' +
					'ENTERED SYNC SUCCESS CB FOR READ METHOD\n\n', styleSync);
		    console.log(collData);
				console.log('%c\n\nBEAR-DISPLAY-DATA-COLLECTION::: SYNC::: SUCCESS CB::: modelOrColl:::\n\n',
					styleSync);
				modelOrColl.reset(_.reduce(collData, function(modelDataObj, val, key) {
					modelDataObj = modelDataObj || [];
					modelDataObj.push({
						firstName: val.firstName,
						lastName: val.lastName,
						favoriteBear: val.favoriteBear
					});
					return modelDataObj;
				}, []));

				// _.forEach(collData, function(val, key){
				// 	modelOrColl.add({
				// 		firstName: val.firstName,
				// 		lastName: val.lastName,
				// 		favoriteBear: val.favoriteBear
				// 	});
				// 	console.log(val);
				// 	console.log(key);
				// });
		    console.dir(modelOrColl);

	      // Backbone.trigger('bearDisplayDataCollection:dataArrived', collData);
			}
		});
	}
}

//CLASS//
var BearDisplayDataCollection = Backbone.Collection.extend({
	model: BearDisplayData,
	url: '/api/return_bear_display_collection',
	events: {
		'change': 'handleNewData'
	},
	handleNewData: function handleNewData(){
		console.log('handleNewData');
	}
});

// var bearDisplayDataColl1 = new BearDisplayDataCollection();

// bearDisplayDataColl1.fetch();
// console.log('bearDisplayDataColl1');  console.log(bearDisplayDataColl1);

// var bearDisplayDataCollItem = bearDisplayDataColl1.get(1);

module.exports = BearDisplayDataCollection;
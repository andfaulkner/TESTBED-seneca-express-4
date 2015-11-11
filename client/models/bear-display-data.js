//FETCH ONE SINGLE PIECE OF DATA FROM THE SERVER VIA GET REQUEST
//HAS NO IDEA WHERE TO GET URLS FROM\

var style = 'color:black; background:yellow; font-size: large'

var BearDisplayData = Backbone.Model.extend({
	urlRoot: '/api/returnbear',

	onChange: function onChange(){
		console.log('%c\n\nBEAR-DISPLAY-DATA::: ENTERED ONCHANGE\n\n', style);
	},

	initialize: function bearDisplayDataIntialize(){
		console.log('%c\n\nBEAR-DISPLAY-DATA::: ENTERED INITIALIZE\n\n', style);
	}
});

var bearData1 = new BearDisplayData({ firstName: 'meeka', id: 'meeka' });
console.log(bearData1);

// fetches from [root]/api/returnbear/meeka
bearData1.fetch({
	success: function bearData1Fetched(data){
		console.log('%c\n\nBEAR-DISPLAY-DATA::: ENTERED FETCH SUCCESS CB\n\n', style);
		console.log(typeof data);
		console.log(JSON.stringify(data));
	}
})

module.exports = BearDisplayData;
/**
 * Handle sending back and forth to and from server
 */

module.exports = function backboneSync(method, modelOrColl, options) {
	if (method === 'read') {
		$.ajax({
    	url: modelOrColl.url,
      type: 'get',
      success: function(collData, textStatus, xhr) {
				modelOrColl.reset(_.reduce(collData, function resetCollReducer(modelDataObj, val, key) {
					modelDataObj = modelDataObj || [];
					modelDataObj.push({
						firstName: val.firstName,
						lastName: val.lastName,
						favoriteBear: val.favoriteBear
					});
					return modelDataObj;
				}, []));
			}
		});
	}
};
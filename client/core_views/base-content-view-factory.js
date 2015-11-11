var BackboneAppView = require('./backbone-view.js');

module.exports = function BaseContentViewFactory(options) {
		console.log('%c\n\nBCVF::BASE-CONTENT-VIEW-FACTORY::: ENTERED EXPORT FN\n\n',"color:green");

  	return new (BackboneAppView.extend({
    	initialize:  function initialize() {
				console.log('%c\n\nBCVF::BASE-CONTENT-VIEW-FACTORY:::' +
					' ENTERED INITIALIZE\n\n',"color:green");
    		this.render();
    	},

    	render: function render() {
				console.log('%c\n\nBCVF::BASE-CONTENT-VIEW-FACTORY::: ENTERED RENDER\n\n',"color:green");
				this.loadHTMLSnippetFileIntoEl(options.route);
				// this.getComponent(options.route).then(function(data) {
				// 	console.log('%c\n\nBCVF::BASE-CONTENT-VIEW-FACTORY::: RENDER:: ' +
				// 		'getComponent cb\n\n',"color:green");
    // 			this.$el.html(data);
				// }.bind(this));
			}
  	}))({ el: options.el });
  };

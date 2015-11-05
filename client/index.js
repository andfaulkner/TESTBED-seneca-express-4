// var log = require('server/debug/winston-logger')();

(function indexPage(){

  //LIBRARIES
  var $ = require('jquery');
  var _ = require('lodash');
  var Bootstrap = require('bootstrap/dist/js/bootstrap');
  var ie10workaround = require('bootstrap/dist/js/ie10-viewport-bug-workaround');

	var URLs = {
		indexBearDataReceiver: 'api/form_handler'
	}

  //**************************************************************************//
  //** MODELS
  //*********************************//
  //code starts here
  var BackboneModel = Backbone.Model.extend({

  	//Optional constructor
  	initialize: function initialize(){ }

  });

  var BearData = Backbone.Model.extend({

  	defaults: {
  		firstName: '',
  		lastName: '',
  		colour: 'brown',
  		favoriteBear: 'Grizzly',
  		rar: false
  	},

  	//triggered whenever you create a new instance of a model
  	initialize: function initialize(){
  		console.log('\'dummy\' BearData initialized!');
  		this.on('change:favoriteBear', function(model){
  			console.log('favoriteBear has been changed to: ' + model.get('favoriteBear'));
  		});
  	}
  });

  var meekaBearData = new BearData({ 
  	firstName: 'Meeka',
  	lastName: 'PeekaFaulkner'
  }); 
  meekaBearData.set({ 
  	'favoriteBear': 'Sun Bear',
  	'colour': 'black',
  	'rar': true
  });
  console.log(meekaBearData.get('favoriteBear'));

  var meekamooBearData = new BearData({ firstName: 'Meekamoo' });
  console.log(meekamooBearData.get('firstName'));
  console.log(meekamooBearData.get('favoriteBear'));

  var meekaPeekaBearData = new BearData({ firstName: 'Meeka', lastName: 'Peeka' });
  console.log(meekaPeekaBearData.get('firstName'));
  meekaPeekaBearData.set({ favoriteBear: 'Sun Bear' });


  //-- END MODELS --
  //**************************************************************************//

  //**************************************************************************//
  //** VIEWS
  //*********************************//
  //Top level view
  var BackboneAppView = Backbone.View.extend({
  	getComponent: function getComponent(route){
    	return $.get(route, function(data) {
      	return data;
      }.bind(this));
  	},

   	initialize:  function initialize() {
   		this.render();
  	},

  });


  var IndexContentView = BackboneAppView.extend({
  	events: {
  		'click #forms_page--form__submitBtn': 'submitForm'
  	},
  	render: function render() {
			this.getComponent('components/forms_page/forms.html').then(function(data){
  			this.$el.html(data);
			}.bind(this));
		},
		submitForm: function submitForm(event){
			event.preventDefault();
      $.ajax({
      		url: URLs.indexBearDataReceiver,
      		type: 'post',
      		data: $("#forms_page--form-target").serialize(),
      		success: function(data, textStatus, xhr) {
	        	console.log(data);
	          console.log('form submission complete!');
	        }
      });

			console.log('SUBMITTED!');
		}
  });


	//Builds content views
  var BaseContentViewFactory = function ContentViewFactory(options) {

  	return new (BackboneAppView.extend({
    	initialize:  function initialize() {
    		this.render();
    	},

    	render: function render() {
				this.getComponent(options.route).then(function(data) {
    			this.$el.html(data);
				}.bind(this));
			}
  	}))({ el: options.el });
  };

  // var baseContentViewFactory = function ContentViewFactory(options){

  //-- END VIEWS --
  //**************************************************************************//

	//**************************************************************************//
	//** ROUTING
	//*********************************//
  var AppRouter = Backbone.Router.extend({

  	routes: {
  		'': 'flipToIndex',
  		'index': 'flipToIndex',
  		'display': 'flipToDisplay',
  		':otherdata': 'other'
  	},

  	baseTopbar: false,

  	_loadBaseTopbar: function _loadBaseTopbar(){
  		var topBarView = BaseContentViewFactory({
  			route: 'components/topbar/topbar.html',
  			el: $('#topbar')
  		});
  	},

  	flipToIndex: function flipToIndex(){
  		if (this.baseTopbar === false) {
    		this.baseTopbar = this._loadBaseTopbar();
  		}
  		var indexContentView = new IndexContentView({ el: $('#container') });
  	},

  	flipToDisplay: function flipToDisplay(){
  		if (this.baseTopbar === false) {
    		this.baseTopbar = this._loadBaseTopbar();
  		}
			var aboutView = BaseContentViewFactory({
				route: 'components/index_page/index_content.html',
				el: $('#container')
			});
  	},

  	other: function other(otherdata){
  		console.log(otherdata);
  	}
  });
//-- END ROUTING --
//**************************************************************************//

  //Launch the app when the DOM is ready
  $(function(){
    new AppRouter();
		Backbone.history.start()
  });


  console.log('bottom of index.js!');

}());
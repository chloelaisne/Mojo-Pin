App.UserView = Backbone.View.extend({

	initialize: function(){
		console.log('initialize UserView');
		this.activityView = new App.ActivityView();
	},

	render: function(){
		console.log('render UserView');
	}

});
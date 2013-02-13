App.UserView = Backbone.View.extend({

	template: _.template(Templates.User),

	initialize: function(){
		console.log('initialize UserView');

		_.bindAll(this, 'render');

		this.activitiesView = new App.ActivitiesView();
		//this.mapView = new App.MapModuleView();
	},

	render: function(){
		console.log('render UserView');

		this.$el.html(this.template);
		//this.activitiesView.render();
		//this.mapView.render();

		this.mapView.setElement(this.$('#map')).render();
		this.activitiesView.setElement(this.$("#sidebar")).render();

		//$("#sidebar").append(this.activitiesView.el);
		//$("#map").html(this.mapView.el);

		//$('#global').html(this.el);

		return this;
	}

});
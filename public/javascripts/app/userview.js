App.UserView = Backbone.View.extend({

	template: _.template(Templates.Profile),

	initialize: function()
	{
		_.bindAll(this, 'render');

		//this.activitiesView = new App.ActivitiesView();
		this.mapModuleView = new App.MapModuleView({ id: "map_profile" });
	},

	render: function()
	{
		//this.activitiesView.render();
		//this.activitiesView.setElement(this.$("#sidebar")).render();
		//$("#sidebar").append(this.activitiesView.el);
		
		$(this.el).html(this.template);
		$(this.el).append((this.mapModuleView.render()).el);
		this.setElement($(this.el));
		return this;
	}

});
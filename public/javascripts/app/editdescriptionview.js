App.EditDescriptionView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'renderDescriptionModule', 'renderMapModule', 'render')
		this.mapModuleView = new App.MapModuleView({ id: "map_description" });
		this.model = new App.Description();
	},

	renderDescriptionModule: function()
	{
		$(this.el).append(Templates.EditDescription);
	},

	renderMapModule: function(model)
	{
		this.model.set({ "map": this.mapModuleView.map});
		if(model != undefined)
		{
			this.mapModuleView.addNoticeMarker(model);
		}
		$(this.el).prepend((this.mapModuleView.render()).el);
	},

	render: function()
	{

		this.renderDescriptionModule();

		this.renderMapModule();

		return this;
	}

})
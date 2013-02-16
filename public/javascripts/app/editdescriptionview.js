App.EditDescriptionView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'renderDescriptionModule', 'renderMapModule', 'render')
		this.mapModuleView = new App.MapModuleView({ id: "map_description" });
	},

	renderDescriptionModule: function()
	{
		$(this.el).append(Templates.EditDescription);
	},

	renderMapModule: function()
	{
		this.model.set({ "map": this.mapModuleView.map});
		this.mapModuleView.addNoticeMarker(this.model);
		$(this.el).prepend((this.mapModuleView.render()).el);
	},

	render: function()
	{

		this.renderDescriptionModule();

		this.renderMapModule();

		return this;
	}

})
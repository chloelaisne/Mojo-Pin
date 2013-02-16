App.EditDescriptionView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'resizeView', 'renderDescriptionModule', 'renderMapModule', 'render')
		this.mapModuleView = new App.MapModuleView({ id: "map_description" });

		$(window).bind("resize", this.resizeView);
	},

	resizeView: function()
	{
		var height = $("body").height() - ($("#global").offset()).top - $("#page-bottom").outerHeight();
		$("#map_description").height(height);
	},

	renderDescriptionModule: function()
	{
		$(this.el).append(Templates.EditDescription);
	},

	renderMapModule: function()
	{
		$(this.el).prepend((this.mapModuleView.render()).el);
	},

	render: function()
	{

		this.renderDescriptionModule();

		this.renderMapModule();

		return this;
	}

})
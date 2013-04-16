App.EditDescriptionView = Backbone.View.extend({
	
	attributes:
	{
		id 		: "description",
		class	: "edit"
	},

	events:
	{
		"click textarea"	: "onClick",
		"keyup textarea"	: "onKeyUp"
	},

	initialize: function()
	{
		_.bindAll(this, 'onClick', 'onKeyUp', 'setModels', 'renderMapModule', 'render')

		$(this.el).html(Templates.Description);

		this.isEmpty 		= true;
		this.valueDefault 	= this.$("textarea").html();

		this.mapModuleView = new App.EditDescriptionMapView({el: this.$(".map#description")});
		this.model = new Backbone.Model();
		this.model.bind("change:location_latitude", this.setModels);
		this.model.set({ description: "" });
	},

	onClick: function(e)
	{
		if(this.isEmpty == true)
		{
			this.$("textarea").prop("selectionStart", 0);
			this.$("textarea").prop("selectionEnd", 0);
		}
	},

	onKeyUp: function(e)
	{
		if(this.isEmpty == true && this.$("textarea").hasClass("inactive"))
		{
			// Clear default value
			this.$("textarea").attr("value", this.$("textarea").attr("value").replace(this.valueDefault, ""));
			this.isEmpty = false;
			this.$("textarea").removeClass("inactive");
		}

		this.model.set({ description: this.$("textarea").attr("value") });
		App.Events.trigger("changeDescription");
	},

	setModels: function()
	{
		this.mapModuleView.model.set({ latitude: this.model.get("location_latitude"), longitude: this.model.get("location_longitude") });
		this.mapModuleView.addMarker(this.model);
	},

	renderMapModule: function()
	{
		this.mapModuleView.render();
	},

	render: function()
	{
		this.renderMapModule();
		return this;
	}

})
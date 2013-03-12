App.EditLocationView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'setLocation', 'renderSearchModule', 'renderMapModule', 'render');
		this.searchLocationModuleView = new App.SearchLocationModuleView();
		this.mapModuleView = new App.MapModuleView({ id: "map_location" });

		if(typeof this.model == "undefined" || this.model.get("reference") == null)
		{
			this.model = new App.Location();
		}
		else
		{
			this.setLocation({
				reference 	: this.model.get("reference"),
				description : this.model.get("description")
			});
			this.model.getDetails();
		}

		this.model.bind("change:reference", this.model.getDetails);

		App.Events.on("setLocation", this.setLocation);
		App.Events.on("delLocation", this.setLocation);
		App.Events.on("LocationDetailsLoaded", this.renderMapModule);
	},

	setLocation: function(model)
	{
		if(model != null) 	// setLocation
		{
			this.model.set
			({
				"description"	: model.description,
				"reference"		: model.reference,
				"map" 			: this.mapModuleView
			});
		}
		else 				// delLocation
		{
			this.model.unset("description", { silent: true });
			this.model.unset("reference", { silent: true });
		}
	},

	renderSearchModule: function()
	{
		$(this.el).append((this.searchLocationModuleView.render()).el);
	},

	renderMapModule: function(model)
	{
		if(model != undefined)
		{
			this.mapModuleView.addConfirmationMarker(model);
		}
		$(this.el).prepend((this.mapModuleView.render()).el);
	},

	render: function()
	{
		this.renderSearchModule();
		this.renderMapModule();
		this.setElement($(this.el));
		return this;
	}

});
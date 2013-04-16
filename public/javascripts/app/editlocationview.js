App.EditLocationView = Backbone.View.extend({
	
attributes:
	{
		id		: "location",
		class	: "edit"
	},

	initialize: function()
	{
		_.bindAll(this, 'setLocation', 'renderMapModule', 'render');

		$(this.el).html(Templates.Location);

		this.searchLocationModuleView = new App.SearchLocationModuleView();
		this.mapModuleView = new App.MapModuleView({el: this.$(".map#location")});

		this.model = new App.Location();
		this.model.bind("change:reference", this.model.getDetails);

		// Triggers when pin location is set
		App.Events.on("setLocation", this.setLocation);
		App.Events.on("delLocation", this.setLocation);
		App.Events.on("LocationDetailsLoaded", this.renderMapModule);

		// Set model coordinates to Facebook user's current city
		var self = this;
		App.Events.on('FacebookCredentialsSet', function(){
			self.mapModuleView.model.set({ latitude: App.FACEBOOK['user_location']['latitude'], longitude: App.FACEBOOK['user_location']['longitude'] });
		});
	},

	setLocation: function(model)
	{
		if(model != null)
		{
			this.model.set({ map: this.mapModuleView, reference: model.reference, description: model.description });
		}
		else
		{
			this.model.unset("description", { silent: true });
			this.model.unset("reference", { silent: true });
		}
	},

	renderMapModule: function(model)
	{
		if(model != undefined)
			this.mapModuleView.addConfirmationMarker(model);
		
		this.mapModuleView.render();
	},

	render: function()
	{
		this.$("#page-bottom").html((this.searchLocationModuleView.render()).el);
		this.renderMapModule();
		return this;
	}

});
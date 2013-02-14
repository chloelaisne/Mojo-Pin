App.EditLocationView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'setLocation', 'renderSearchModule', 'renderMapModule', 'render');
		this.searchLocationModuleView = new App.SearchLocationModuleView();
		this.mapModuleView = new App.MapModuleView();

		App.Events.on("LocationSelected", this.setLocation);
		App.Events.on("LocationDetailsLoaded", this.renderMapModule);
	},

	setLocation: function(model)
	{
		this.location = new App.Location
		({
			description	: model.description,
			reference	: model.reference,
			map 		: this.mapModuleView
		});
		App.Events.trigger("EditLocationComplete");
	},

	renderSearchModule: function()
	{
		$(this.el).append((this.searchLocationModuleView.render()).el);
	},

	renderMapModule: function(model)
	{
		if(model != undefined)
		{
			this.mapModuleView.addMarker(model);
		}
		$(this.el).prepend((this.mapModuleView.render()).el);
	},

	render: function()
	{

		this.renderSearchModule();

		this.renderMapModule();
		
		return this;
	}

});
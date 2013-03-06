App.SearchLocationModuleView = Backbone.View.extend({

	template: Templates.SearchLocation,

	events:
	{
		"keyup input": "searching"
	},

	initialize: function()
	{
		_.bindAll(this, 'setLocation', 'searching', 'renderCollection', 'render');
		this.locationsView = new App.LocationsView();
		this.locationsCollection = new App.LocationsCollection();
		this.locationsCollection.on("reset", this.renderCollection, this);

		App.Events.on("setLocation", this.setLocation);
	},

	setLocation: function(location)
	{
		this.$("#results").hide();
		this.$("input").attr("value", location.description);
	},

	searching: function(e)
	{
		var self = this;
		$.ajax
		({
			type 		: 'GET',
			dataType 	: 'json',
			url 		: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + $(e.target).val() + '&types=geocode&sensor=true&key=AIzaSyD9YAvbWKUsUhJfMZeZqKjROLrcM9kgCcQ',
		})
		.done(function(data, textStatus, jqXHR){
			self.locationsCollection.reset(data.predictions);
		})
		.fail(function(jqXHR, textStatus, errorThrown){});
	},

	renderCollection: function()
	{
		this.locationsView.collection = this.locationsCollection;

		this.$("#results").children().remove();

		if(this.locationsCollection.length > 0)
		{
			this.$("#results").html((this.locationsView.render()).el);
			this.$("#results").show();
		}
		else
		{
			this.$("#results").hide();
		}
	},

	render: function()
	{
		this.setElement(this.template);
		this.$("#results").hide();
		return this;
	}
});
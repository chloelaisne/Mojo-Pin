App.LocationsView = Backbone.View.extend({

	tagName: 'ul',

	initialize: function()
	{
		_.bindAll(this, 'renderLocation', 'render');
	},

	renderLocation: function(data)
	{
		var locationView = new App.LocationView({ model: data });
		$(this.el).append((locationView.render()).el);
	},

	render: function()
	{
		$(this.el).children().remove();
		this.collection.forEach(this.renderLocation);
		return this;
	}
});
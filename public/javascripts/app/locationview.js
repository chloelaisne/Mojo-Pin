App.LocationView = Backbone.View.extend({

	tagName: 'li',

	events:
	{
		"click": "locationClick"
	},

	initialize: function()
	{
		_.bindAll(this, 'locationClick', 'render');
	},

	locationClick: function(e)
	{
		e.preventDefault();
		App.Events.trigger("LocationSelected", { reference: this.model.get('reference'), description: this.model.get('description') });
	},

	
	render: function(){
		$(this.el).append(this.model.get('description'));
		return this;
	}
})
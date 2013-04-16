App.LocationView = Backbone.View.extend({

	tagName: 'li',

	events:
	{
		"click": "locationClick"
	},

	initialize: function()
	{
		_.bindAll(this, 'locationClick', 'locationEnter', 'render');
		App.Events.on("locationEnter", this.locationEnter);
	},

	locationEnter: function(e)
	{
		if($(this.el).hasClass("active"))
			this.locationClick();
	},

	locationClick: function(e)
	{
		if(typeof e != 'undefined')
			e.preventDefault();

		App.Events.trigger("setLocation", { reference: this.model.get('reference'), description: this.model.get('description')	});
	},

	
	render: function(){
		$(this.el).append(this.model.get('description'));
		return this;
	}
})
App.ActivityView = Backbone.View.extend({

	events: {
		"click": "clickActivity"
	},

	template: _.template(Templates.Activity),

	initialize: function()
	{
		_.bindAll(this, 'clickActivity', 'render');

		this.model.bind("change", this.render);
	},

	clickActivity: function(e)
	{
		$("#sidebar li").removeClass();
		$(e.currentTarget).addClass("active");
		App.Events.trigger("ActivitySelected", this.model);
	},

	render: function()
	{

		this.templateSettings = {
			type		: this.model.get("type"),
			title		: this.model.get("title"),
			artists		: this.model.get("artists"),
			location	: this.model.get("description")
		};

		this.setElement(this.template(this.templateSettings));

		return this;
	}
	
});
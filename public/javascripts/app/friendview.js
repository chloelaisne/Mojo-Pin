App.FriendView = Backbone.View.extend({

	template: _.template(Templates.Friend),

	events: {
		"click a"				: "gotoUser",
		"mouseenter .picture"	: "toggleButton",
		"mouseleave .picture"	: "toggleButton"
	},

	initialize: function()
	{
		_.bindAll(this, 'toggleButton', 'gotoUser', 'render');
	},

	gotoUser: function(e)
	{
		e.preventDefault();
		App.router.navigate('/user/' + this.model.get("id"), true);
	},

	toggleButton: function(e)
	{
		if($(e.currentTarget).children("button").css("display") == "none")
		{
			$(e.currentTarget).children("button").show();
		}
		else
		{
			$(e.currentTarget).children("button").hide();
		}
	},

	render: function()
	{
		this.templateSettings = {
			picture		: this.model.get("picture"),
			name		: this.model.get("name"),
			active		: this.model.get("active"),
			display		: this.model.get("display")
		};

		this.setElement($(this.template(this.templateSettings)));

		return this;
	}

});
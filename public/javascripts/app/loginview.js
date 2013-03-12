App.LoginView = Backbone.View.extend({

	events: {
		"click .mp-login": "authDialog"
	},

	initialize: function()
	{
		_.bindAll(this,'render');
	},

	authDialog: function(e)
	{
		e.preventDefault();
		App.Events.trigger('FacebookAuthDialog');
	},

	render: function()
	{
		this.$el.html(Templates.Login);
		this.setElement(this.el);
		return this;
	}

});
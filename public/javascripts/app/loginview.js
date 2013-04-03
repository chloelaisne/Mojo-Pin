App.LoginView = Backbone.View.extend({

	events: {
		"click button.mp-login": "authDialog"
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

		// Vertically center Login button
		$("button.sp-facebook").css({"margin-top": ($("body").outerHeight() / 2) - ($("button.sp-facebook").outerHeight() / 2) + "px"});

		return this;
	}

});
App.FriendView = Backbone.View.extend({

	template: _.template(Templates.Friend),

	initialize: function(){

	},

	render: function(){

		this.templateSettings = {
			picture		: this.model.get("picture"),
			name		: this.model.get("name"),
			display		: this.model.get("display")
		};

		this.el = $(this.template(this.templateSettings));

		return this;

	}

});
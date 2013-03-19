App.FriendsView = Backbone.View.extend({

	template: _.template(Templates.Friends),

	events: {
		"keyup input": "filter"
	},

	initialize: function()
	{	
		_.bindAll(this, 'renderFriendlist', 'setCollectionUrl', 'render', 'filter');

		this.collection = new App.FriendsCollection();
		this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.render, this);

        App.Events.on("changeAccessToken", this.setCollectionUrl);
	},

	setCollectionUrl: function(access_token)
	{
		//this.collection.url = "https://graph.facebook.com/me/friends?access_token=" + access_token;
		//this.collection.fetch();
	},

	renderFriendlist: function()
	{
		if(this.$(".friendslist"))
			this.$(".friendslist").children().remove();

		_(this.collection.models).each(function(friend)
		{
			var friendView = new App.FriendView({ model: new App.Friend(friend) });
			this.$(".friendslist").append((friendView.render()).el);
		});

		return this;
	},

	filter: function(e)
	{
		this.collection.filter($(e.target).val());

		this.renderFriendlist();
	},

	render: function()
	{
		$(this.el).html(this.template);

		this.renderFriendlist();

		return this;
	}
	
});
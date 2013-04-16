App.FriendsView = Backbone.View.extend({

	events: {
		"keyup input"			: "filter",
		"click button.mp-invite": "invite"
	},

	initialize: function()
	{	
		_.bindAll(this, 'collectionFetched', 'renderFriends', 'setCollectionUrl', 'render', 'filter', 'invite');

		this.collection = new App.Friends();
		App.Events.on('FacebookCredentialsSet', this.setCollectionUrl);

		// Call method when collection is done fetching
		this.collection.bind('reset', this.collectionFetched);
	},

	invite: function()
	{
		// Dialog metas
		var title = "Invite your friends to Mojo Pin";
		var message = "Mojo Pin is a Spotify App that helps people share their personal attachment to the music they listen to.";
		var redirect_uri = "http://www.chloelaisne.com";

		Spotify.Auth.showAuthenticationDialog("http://www.facebook.com/dialog/apprequests?app_id="+App.FACEBOOK["app_identifier"]+"&title="+encodeURIComponent(title)+"&message="+encodeURIComponent(message)+"&display=popup&redirect_uri="+encodeURIComponent(redirect_uri), redirect_uri, {
			onSuccess 	: function(response) {},
			onFailure 	: function(error) {},
			onComplete	: function() {}
		});
	},

	/*
	 * Execute various operations on the models: sorting, ordering.
	 */
	collectionFetched: function()
	{
		// Bind this to self for functions below
		var self = this

		// Return a string with the id of all Facebook Friends by alphabetical order
		var ids = this.collection.getIDs();
		
		// Compare Facebook friends to users in the dabase
		$.ajax({
			url 		: 'http://localhost:3000/json/friends',
			type 		: 'POST',
			dataType 	: 'json',
			data 		: { data: ids }
		})
		.done(function (data, textStatus, jqXHR){

			_(self.collection.models).each(function(friend)
			{
				var isActive = false;

				_.each(data, function (value, key, list){
					// Set to true if the user signed up to the App
					if(value.facebook_id == friend.get("id"))
						isActive = true
				});

				friend.set({ active: isActive, display: "block" });
			});

			// Group Facebook friends by registered and are not registered
			self.collectionGroups = _.groupBy(self.collection.models, function(num){ return num.get("active"); });

			self.renderFriends();

		});
	},

	setCollectionUrl: function()
	{
		this.collection.url = "https://graph.facebook.com/me/friends?access_token=" + App.FACEBOOK['access_token'];
		this.collection.fetch();
	},

	renderFriends: function()
	{
		$("#global").css({"height": $("body").height() - 52 + "px"});

		// Bind this to self for functions below
		var self = this;

		if(typeof this.collectionGroups != 'undefined')
		{
			_(this.collectionGroups.true).each(function(friend, index){
				// Create model and view
				var friendView = new App.FriendView({ model: new App.Friend(friend.attributes) });
				self.$("#friendslist ul").append((friendView.render()).el);
			});
		}

		return this;
	},

	filter: function(e)
	{
		var pattern = new RegExp("\s*\w*" + $(e.target).val() + "\s*\w*", "ig");

		this.collectionFilter = _.filter(this.collection.model, function(friend)
		{
			// Hide friends not matching the input from the filtering
			if(pattern.test(friend.get("name")) == true)
				friend.set({ display: "block" });
			else
				friend.set({ display: "none" });
		});

		this.renderFriends();
	},

	render: function()
	{
		$(this.el).html(Templates.Friends);

		// Re-render friends list
		if(typeof this.collection.url != 'undefined' && this.collection.url != null)
			this.renderFriends();

		return this;
	}
	
});
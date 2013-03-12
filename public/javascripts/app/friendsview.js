App.FriendsView = Backbone.View.extend({

	template: _.template(Templates.Friends),

	events: {
		"keyup input": "filter"
	},

	initialize: function(){
		
		_.bindAll(this, 'render', 'filter');

		this.collection = new App.FriendsCollection();
		this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.render, this);

        //this.collection.fetch();

	},

	render: function(){
		$(this.el).html(this.template);

		var self = this;

		this.renderFriendslist();

		return this;
	},

	renderFriendslist: function(){
		if(this.$(".friendslist"))
			this.$(".friendslist").children().remove();

		_(this.collection.models).each(function(friend) {
			var friendView = new App.FriendView({ model: new App.Friend(friend) });
			this.$(".friendslist").append((friendView.render()).el);
		});

		return this;
	},

	filter: function(e){
		this.collection.filter($(e.target).val());

		this.renderFriendslist();
	}
	
});
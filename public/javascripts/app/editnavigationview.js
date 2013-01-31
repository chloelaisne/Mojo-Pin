App.EditNavigationView = Backbone.View.extend({

	template : _.template(Templates.EditNavigation),

	events:
	{
		"click #previous"	: "clickPrevious",
		"click #next"		: "clickNext",
		"click #cancel"		: "clickCancel"
	},

	initialize: function()
	{
		_.bindAll(this, 'render', 'clickPrevious', 'clickNext', 'clickCancel', 'editMusicViewNavigation', 'editLocationViewNavigation', 'editDescriptionViewNavigation');
	},

	editMusicViewNavigation: function()
	{
		this.previous = { label: "Cancel", theme: "dark", icon: 0, state: "active", route: "/user/chloelaisne" };
		this.next = { label: "Next", theme: "crossbreed", icon: 1, state: "active", route: "edit/location" };
		this.cancel = { route: null };
	},

	editLocationViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: "active", route: "edit/music" };
		this.next = { label: "Next", theme: "light", icon: 1, state: "active", route: "edit/description" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	editDescriptionViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: "active", route: "edit/location" };
		this.next = { label: "Done", theme: "primary", icon: 0, state: "inactive", route: "/user/chloelaisne" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	clickPrevious: function(e)
	{
		e.preventDefault();
		if(this.previous.route != null && this.previous.state == "active")
		{
			App.router.navigate(this.previous.route, true);
		}
	},

	clickNext: function(e)
	{
		e.preventDefault();
		if(this.next.route != null && this.next.state == "active")
		{
			App.router.navigate(this.next.route, true);
		}
	},

	clickCancel: function(e)
	{
		e.preventDefault();
		if(this.cancel.route != null)
		{
			App.router.navigate(this.cancel.route, true);
			this.unrender();
		}
	},

	render: function()
	{

		this.unrender();

		switch(Backbone.history.fragment)
		{
			case "edit/music":
				this.editMusicViewNavigation();
				break;

			case "edit/location":
				this.editLocationViewNavigation();
				break;

			case "edit/description":
				this.editDescriptionViewNavigation();
				break;
		}

		this.templateSettings =
		{
			previous 	: this.previous,
			next 		: this.next,
			cancel 		: this.cancel
		}

		this.setElement(this.template(this.templateSettings));
		
		$("#global").append(this.el);

		return this;
	},

	unrender: function()
	{
		if($(this.el))
			$(this.el).remove();
	}
});
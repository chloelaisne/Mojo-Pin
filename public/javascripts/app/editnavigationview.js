App.EditNavigationView = Backbone.View.extend({

	template : _.template(Templates.EditNavigation),

	events:
	{
		"click #previous"	: "clickPrevious",
		"click #next"		: "clickNext",
		"click #cancel"		: "clickCancel"
	},

	elements: {
		music 			: false,
		location 		: false,
		description 	: false
	},

	initialize: function()
	{
		_.bindAll(this, 'render', 'clickPrevious', 'clickNext', 'clickCancel', 'elementStateChange', 'editMusicViewNavigation', 'editLocationViewNavigation', 'editDescriptionViewNavigation');

		App.Events.on("all", this.elementStateChange);
	},

	elementStateChange: function(e)
	{
		switch(e)
		{
			case "EditMusicComplete":
				this.elements.music = true;
				break;
			case "EditLocationComplete":
				this.elements.location = true;
				break;
			case "EditDescriptionComplete":
				this.elements.description = true;
				break;
		}

		this.render();
	},

	editMusicViewNavigation: function()
	{
		this.previous = { label: "Cancel", theme: "dark", icon: 0, state: 1, route: "/user/chloelaisne" };
		this.next = { label: "Next", theme: "crossbreed", icon: 1, state: this.elements.music, route: "edit/location" };
		this.cancel = { route: null };
	},

	editLocationViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: 1, route: "edit/music" };
		this.next = { label: "Next", theme: "light", icon: 1, state: this.elements.location, route: "edit/description" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	editDescriptionViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: 1, route: "edit/location" };
		this.next = { label: "Done", theme: "primary", icon: 0, state: this.elements.description, route: "/user/chloelaisne" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	clickPrevious: function(e)
	{
		console.log("Previous", this.previous.route);
		e.preventDefault();
		if(this.previous.route != null && this.previous.state == true)
		{
			App.router.navigate(this.previous.route, true);
		}
	},

	clickNext: function(e)
	{
		console.log("Next", this.next.route);
		e.preventDefault();
		if(this.next.route != null && this.next.state == true)
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
			case "edit/location":
				this.editLocationViewNavigation();
				break;

			case "edit/description":
				this.editDescriptionViewNavigation();
				break;

			default:
				this.editMusicViewNavigation();
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
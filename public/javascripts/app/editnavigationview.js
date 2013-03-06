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
		_.bindAll(this,'setMusicNavigationState', 'setLocationNavigationState', 'setDescriptionNavigationState', 'render', 'clickPrevious', 'clickNext', 'clickCancel', 'editMusicViewNavigation', 'editLocationViewNavigation', 'editDescriptionViewNavigation');

		this.model 							= new App.EditNavigation();
		this.model.bind("change:music"		, this.setMusicNavigationState);
		this.model.bind("change:location"	, this.setLocationNavigationState);
		this.model.bind("change:description", this.setDescriptionNavigationState);

		this.editMusicViewNavigation();
	},

	setMusicNavigationState: function()
	{
		this.editMusicViewNavigation();
		this.render();
	},

	setLocationNavigationState: function()
	{
		this.editLocationViewNavigation();
		this.render();
	},

	setDescriptionNavigationState: function()
	{
		this.editDescriptionViewNavigation();
		this.render();
	},

	editMusicViewNavigation: function()
	{
		this.previous = { label: "Cancel", theme: "dark", icon: 0, state: 1, route: "/user/chloelaisne" };
		this.next = { id: 'music', goto: 'location', label: "Next", theme: "crossbreed", icon: 1, state: this.model.get("music"), route: "edit/location" };
		this.cancel = { route: null };
	},

	editLocationViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: 1, route: "edit/music" };
		this.next = { id: 'location', goto: 'description', label: "Next", theme: "light", icon: 1, state: this.model.get("location"), route: "edit/description" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	editDescriptionViewNavigation: function()
	{
		this.previous = { label: "Previous", theme: "light", icon: 1, state: 1, route: "edit/location" };
		this.next = { id: 'description', goto: null, label: "Done", theme: "primary", icon: 0, state: this.model.get("description"), route: "/user/chloelaisne" };
		this.cancel = { route: "/user/chloelaisne" };
	},

	clickPrevious: function(e)
	{
		e.preventDefault();
		if(this.previous.route != null && this.previous.state == true)
		{
			App.router.navigate(this.previous.route, true);
		}
	},

	clickNext: function(e)
	{
		console.log("clickNext", this.next.id, this.next.goto);
		e.preventDefault();
		if(this.next.route != null && this.next.state == true)
		{
			App.Events.trigger('setSession', this.next.id);
			App.Events.trigger('changeRoute', this.next.goto);
		}

	},

	clickCancel: function(e)
	{
		e.preventDefault();
		if(this.cancel.route != null)
		{
			App.Events.trigger('delSession');
			App.router.navigate(this.cancel.route, true);
			this.unrender();
		}
	},

	render: function()
	{
		// Unrender navigation
		this.unrender();

		//console.log('setButtonState', this.next.state);

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
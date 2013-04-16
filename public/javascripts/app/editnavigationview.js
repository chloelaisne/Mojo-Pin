App.EditNavigationView = Backbone.View.extend({

	template : _.template(Templates.EditNavigation),

	events:
	{
		"click #previous"		: "clickPrevious",
		"click #next"			: "clickNext",
		"click #cancel"			: "clickCancel",
	},

	initialize: function()
	{
		_.bindAll(this,'setMusicNavigation', 'setLocationNavigation', 'setDescriptionNavigation', 'render', 'clickPrevious', 'clickNext', 'clickCancel');

		this.model 							= new Backbone.Model({ music: false, location: false, description: true });
		this.model.bind("change:music"		, this.setMusicNavigation);
		this.model.bind("change:location"	, this.setLocationNavigation);
		this.model.bind("change:description", this.setDescriptionNavigation);
	},

	setMusicNavigation: function()
	{
		this.previous = { id: null, label: "Cancel", theme: "dark", icon: 0, state: 1 };
		this.next = { id: "location", label: "Next", theme: "crossbreed", icon: 1, state: this.model.get("music") };
		this.cancel = null;

		// Set current view
		this.model.set({ view: "music" });

		// Re-render navigation
		this.render();
	},

	setLocationNavigation: function()
	{
		this.previous = { id: "music", label: "Previous", theme: "light", icon: 1, state: 1};
		this.next = { id: "description", label: "Next", theme: "light", icon: 1, state: this.model.get("location") };
		this.cancel = { id: null };

		// Set current view
		this.model.set({ view: "location" });

		// Re-render navigation
		this.render();
	},

	setDescriptionNavigation: function()
	{
		this.previous = { id: "location", label: "Previous", theme: "light", icon: 1, state: 1};
		this.next = { id: "save", label: "Done", theme: "primary", icon: 0, state: this.model.get("description") };
		this.cancel = { id: null };

		// Set current view
		this.model.set({ view: "description" });

		// Re-render navigation
		this.render();
	},

	clickPrevious: function(e)
	{
		e.preventDefault();

		App.Events.trigger('navigationRoute', this.previous.id);
	},

	clickNext: function(e)
	{
		e.preventDefault();

		if(this.next.state == true)
		{
			App.Events.trigger('navigationRoute', { route: this.next.id, silent: this.next.silent });
		}

	},

	clickCancel: function(e)
	{
		e.preventDefault();

		App.Events.trigger('navigationRoute', this.cancel.id);
	},

	render: function()
	{
		// Re-delegate events to new DOM elements
		this.delegateEvents();

		this.templateSettings = { previous: this.previous, next: this.next, cancel: this.cancel };

		this.$el.html(this.template(this.templateSettings));

		return this;
	}
});
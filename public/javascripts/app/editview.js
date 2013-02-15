App.EditView = Backbone.View.extend({

	events:
	{
		"click #save"	: "savePin"
	},

	views: {},

	initialize: function()
	{
		_.bindAll(this, 'renderEditMusic', 'renderEditLocation', 'renderEditDescription', 'render', 'savePin');

		this.editNavigation 	= new App.EditNavigationView();
		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();

		this.model 					= new App.Pin();

		this.model.bind("change:music"			, this.editNavigation.render);
		this.model.bind("change:location"		, this.editNavigation.render);
		this.model.bind("change:description"	, this.editNavigation.render);
	},

	renderEditMusic: function(uri)
	{
		if(uri != undefined)
		{
			this.views.editMusic.music.set({ uri: uri });
		}

		this.views.editMusic.render();
		$(this.el).html(this.views.editMusic.el);
	},

	renderEditLocation: function()
	{
		this.views.editLocation.render();
		$(this.el).html(this.views.editLocation.el);
	},

	renderEditDescription: function()
	{
		this.views.editDescription.render();
		$(this.el).html(this.views.editDescription.el);
	},

	render: function()
	{
		//App.router.navigate('/edit/music', true);
		return this;
	},

	savePin: function()
	{
		if(this.model.get("music") != null && this.model.get("music") != "" && this.model.get("location") != null && this.model.get("music") != "")
		{
			$.ajax({
				type	: 'POST',
				url		: '/json/pin',
				data	:
				{
					music		: this.model.get("music"),
					location	: this.model.get("location"),
					description	: this.model.get("description")
				}
			})
			.done(function(data, textStatus, jqXHR){
				console.log("done");
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log("fail");
			});
		}
	}

});
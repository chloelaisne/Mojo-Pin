App.EditView = Backbone.View.extend({

	views: {},

	initialize: function()
	{
		_.bindAll(this, 'saveEdit', 'setRoute', 'setMusicModel', 'setLocationModel', 'setDescriptionModel', 'renderMusic', 'renderLocation', 'renderDescription', 'render');

		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();
		this.editNavigation 		= new App.EditNavigationView();

		this.model 		= new App.Pin();
		this.model.set({ route: "music" });
		this.model.bind("change:route", this.render);

		App.Events.on("changeMusic"			, this.setMusicModel);
		App.Events.on("changeLocation"		, this.setLocationModel);
		App.Events.on("changeDescription"	, this.setDescriptionModel);

		// Event caught when any navigation button clicked
		App.Events.on("delLocation"			, this.setLocationModel);
		App.Events.on("navigationRoute"		, this.setRoute);
	},

	setRoute: function(data)
	{
		this.model.set({ route: data.route });
	},

	saveEdit: function(description)
	{
		console.log('Saving with id: ' + App.FACEBOOK["user_id"]);

		if(typeof this.model.get("description") == "undefined" || this.model.get("description") == null)
			this.model.set({ "description": "" });

		var data =
		{
			music_uri 				: this.model.get("music_uri"),
			location_reference		: this.model.get("location_reference"),
			location_latitude		: this.model.get("location_latitude"),
			location_longitude		: this.model.get("location_longitude"),
			location_description	: this.model.get("location_description"),
			description 			: this.model.get("description"),
			user 					: App.FACEBOOK["user_id"]
		};

		$.ajax({
			type 	: 'POST',
			url 	: 'http://localhost:3000/json/pin',
			data 	: data
		})
		.done(function (data, textStatus, jqXHR){
			console.log(data);
		});
	},

	resetEdit: function()
	{
		// Clear all models previously set
		this.model.clear();
		this.views.editMusic.model.clear({ silent: true });
		this.views.editLocation.model.clear({ silent: true });
		// Reset map to Facebook user's location
		this.views.editLocation.mapModuleView.model.set({ latitude: App.FACEBOOK['user_location']['latitude'], longitude: App.FACEBOOK['user_location']['longitude'] });
		// Clear marker and info window from the map
		this.views.editLocation.mapModuleView.unsetLocation();
		this.views.editDescription.model.clear({ silent: true });
		this.editNavigation.model.set({ music: false, location: false, description: false });

		App.router.navigate("/user/" + App.FACEBOOK["user_id"], true);
	},

	render: function()
	{
		switch(this.model.get("route"))
		{
			case null:
				this.resetEdit();
				break;
			case "save":
				this.saveEdit();
				this.resetEdit();
				break;
			case "description":
				this.editNavigation.setDescriptionNavigation();
				this.renderDescription();
				break;
			case "location":
				this.editNavigation.setLocationNavigation();
				this.renderLocation();
				break;
			case "music":
			default:
				this.editNavigation.setMusicNavigation();
				this.renderMusic();
				break;
		}

		return this;
	},

 /* ==================================================
	===== Description model and view
	================================================== */

	setDescriptionModel: function()
	{
		this.model.set({ description: this.views.editDescription.model.get("description") });
	},

	renderDescription: function()
	{
		this.views.editDescription.model.set(this.model.toJSON());

		$(this.el).html((this.views.editDescription.render()).el);

		if($("div.pagination").length != 0)
			$("div.pagination").remove();

		$(this.el).append((this.editNavigation.render()).el);

		google.maps.event.trigger(this.views.editDescription.mapModuleView.map, "resize");
		this.views.editDescription.mapModuleView.setCenter();

		// Delegate events when view is re-rendered
		this.views.editDescription.delegateEvents();

		return this;
	},

 /* ==================================================
	===== Location model and view
	================================================== */

	setLocationModel: function(reference)
	{
		if(typeof reference != 'undefined')
		{
			this.model.set
			({
				"location_reference"	: this.views.editLocation.model.get("reference"),
				"location_latitude"		: this.views.editLocation.model.get("latitude"),
				"location_longitude"	: this.views.editLocation.model.get("longitude"),
				"location_description"	: this.views.editLocation.model.get("description")
			});
			this.editNavigation.model.set({ location: true });
		}
		else
		{
			this.model.unset("location_reference");
			this.model.unset("location_latitude");
			this.model.unset("location_longitude");
			this.model.unset("location_description");
			// Clear marker and info window from the map
			this.views.editLocation.mapModuleView.unsetLocation();
			this.editNavigation.model.set({ location: false });
		}
	},

	renderLocation: function()
	{
		$(this.el).html((this.views.editLocation.render()).el);

		if($("div.pagination").length != 0)
			$("div.pagination").remove();

		$(this.el).append((this.editNavigation.render()).el);

		// Set timer to resize the map panes when all DOM rendered
		var self = this;
		setTimeout(function() {
			google.maps.event.trigger(self.views.editLocation.mapModuleView.map, "resize");
			self.views.editLocation.mapModuleView.setCenter();
		}, 10)

		// Delegate events when view is re-rendered
		this.views.editLocation.delegateEvents();
		this.views.editLocation.searchLocationModuleView.delegateEvents();

		return this;
	},

 /* ==================================================
	===== Music model and view
	================================================== */

	setMusicModel: function(model)
	{
		if(typeof model.get("uri") != 'undefined')
		{
			// If Music model set from outside the view e.g. LINKSCHANGED event
			if(Backbone.history.fragment != "edit") {
				App.router.navigate("/edit", true);
			}

			this.model.set({
				"music_uri"		: model.get("uri"),
				"music_track"	: model.get("track"),
				"music_artists"	: model.get("artists")
			});
			this.editNavigation.model.set({ music: true });
		}
		else
		{
			
			this.model.unset("music_uri");
			this.model.unset("music_track");
			this.model.unset("music_artists");
			this.editNavigation.model.set({ music: false });
		}
	},

	renderMusic: function()
	{
		$(this.el).html((this.views.editMusic.render()).el);

		if($("div.pagination").length != 0)
			$("div.pagination").remove();

		$(this.el).append((this.editNavigation.render()).el);

		// Delegate events when view is re-rendered
		this.views.editMusic.delegateEvents();

		return this;
	}

});
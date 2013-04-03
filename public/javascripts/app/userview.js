App.UserView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'setMapCenter', 'renderProfile', 'renderPins', 'renderMap', 'render');

		this.model.bind("change:first_name", this.renderProfile);

		// Initialize the collection of pins
		this.pins = new Backbone.Collection();
		this.pins.url = 'http://localhost:3000/json/pins/'+ this.model.get("facebook_id");
		this.pins.bind('reset', this.renderPins);
		// Load collection
		this.pins.fetch();

		this.mapModuleView = new App.MapModuleView({ id: "map_profile" });

		this.location = new App.Location();
		// Get Google Maps details from the Search Query API
		this.location.on("change:address", this.location.setLocationDetails);
		this.location.on("change:latitude", this.setMapCenter);
	},

	renderMap: function()
	{
		// Set Map center to default location: Stockholm, Sweden
		this.setMapCenter();

		this.$("#middle").append((this.mapModuleView.render()).el);
	},

	setMapCenter: function()
	{
		// Set Map center
		this.mapModuleView.setCenter(this.location.get("latitude"), this.location.get("longitude"));
	},

	renderProfile: function()
	{
		if(typeof this.model.get("first_name") != 'undefined')
		{
			this.location.set({ "address": this.model.get("location") });

			var templateSettings = {
				fullname	: this.model.get("first_name") + " " + this.model.get("last_name"),
				location	: this.model.get("location"),
				pins 		: this.pins.length,
				image 		: "https://graph.facebook.com/" + this.model.get("facebook_id") + "/picture?width=130&height=130&access_token=" + App.FACEBOOK["access_token"]
			};

			this.$("#top").html(_.template(Templates.ProfileHeader)(templateSettings));
			console.log('render map', this.$("#top").outerHeight());
		}
	},

	renderPins: function()
	{
		// Bind this to self for functions below
		var self = this;

		// ===== If pin collection is empty ===== //
		if(this.pins.length == 0)
		{
			var isLoggedInUser;

			// Logged in user
			if(App.FACEBOOK["user_id"] == this.model.get("facebook_id")) {
				isLoggedInUser = true;
			}
			// Logged in user's friends
			else {
				isLoggedInUser = false;
			}


			var templateSettings = { "isLoggedInUser": isLoggedInUser };

			this.$("#sidebar").html(_.template(Templates.EmptyPins)(templateSettings));

			this.resizeView();
		}
		// ===== If pin collection is not empty ===== //
		else {
			var list = document.createElement("ul");

			// Reset markers array
			this.mapModuleView.markers = [];

			_(this.pins.models).each(function(activity)
			{
				// Append row of pin-related information to the sidebar
				var activityView = new App.ActivityView({ model: new App.Activity(activity.attributes) });
				$(list).append((activityView.render()).el);

				// Append pin marker to the map
				self.mapModuleView.addMarker(activityView.model);
			});

			this.$("#sidebar").html(list);
		}
	},

	resizeView: function()
	{
		// Resize Map
		this.$(".map").css("height", $(window).height() - (this.$("#top").height() + this.$("#top").offset().top) + "px");

		// Vertically center the DOM element
		this.$("#sidebar .alert").css("top", (this.$("#sidebar").outerHeight() / 2) - (this.$("#sidebar .alert").outerHeight() / 2) + "px");
	},

	render: function()
	{
		this.$el.html(Templates.Profile);

		this.renderMap();

		this.setElement($(this.el));
		return this;
	}

});
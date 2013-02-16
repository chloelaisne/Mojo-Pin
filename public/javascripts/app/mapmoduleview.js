App.MapModuleView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'addMarker', 'removeMarker', 'render');

		App.Events.on("RemoveMarker", this.removeMarker);

		this.options =
		{
			MapTypeId			: google.maps.MapTypeId.ROADMAP,
			panControl			: false,
			mapTypeControl		: false,
			streetViewControl	: false,
			zoom				: 15
		},

		this.latlng = new google.maps.LatLng(-34.397, 150.644);
		this.map = new google.maps.Map(this.el, this.options);
		this.map.setCenter(this.latlng);
	},

	removeMarker: function()
	{
		if(this.marker != undefined)
		{
			this.marker.setMap(null);
			this.marker = null;
			this.confirmationWindowView.onRemove();
			this.confirmationWindowView = null;
		}
	},

	addMarker: function(model)
	{
		this.removeMarker();
		this.position = new google.maps.LatLng(model.latitude, model.longitude);
		this.markerOptions = {
			position: this.position,
			map: model.map.map
		};
		this.marker = new google.maps.Marker(this.markerOptions);
		this.map.setCenter(this.position);
		this.confirmationWindowView = new App.ConfirmationWindowView({ map: model.map, latlng: this.position });
	},

	render: function()
	{
		$(this.el).css({
			width: "100%",
			height: $("body").height() - ($("#global").offset()).top - $("#page-bottom").outerHeight()
		});

		return this;
	}

});
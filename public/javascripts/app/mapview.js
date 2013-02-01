App.MapModuleView = Backbone.View.extend({

	attributes: function(){
		return {
			id : "map_canvas"
		};
	},

	options: {
		MapTypeId			: google.maps.MapTypeId.ROADMAP,
		panControl			: false,
		mapTypeControl		: false,
		streetViewControl	: false,
		zoom				: 8

	},
	
	initialize: function()
	{
		_.bindAll(this, 'setMarker', 'render');

		this.latlng = new google.maps.LatLng(-34.397, 150.644);
		this.map = new google.maps.Map(this.el, this.options);
		this.map.setCenter(this.latlng);
	},

	setMarker: function(model)
	{
		console.log("latitude", model.latitude);
		console.log("longitude", model.longitude);
		console.log("map", model.map);

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
			height: "500px"
		});

		return this;
	}

});
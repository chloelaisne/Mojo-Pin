App.EditDescriptionMapView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'setCenter', 'addMarker', 'removeMarker', 'render');

		var options =
		{
			draggable				: false,
			zoomControl				: false,
			scrollwheel				: false,
			disableDoubleClickZoom	: true,
			MapTypeId				: google.maps.MapTypeId.ROADMAP,
			panControl				: false,
			mapTypeControl			: false,
			streetViewControl		: false,
			zoom					: 13
		};

		this.model = new Backbone.Model();
		this.model.bind("change:latitude", this.setCenter);

		this.map = new google.maps.Map(this.el, options);
		
		//$(window).bind("resize", this.render);
	},

	setCenter: function()
	{
		var latlng = new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude"));
		this.map.setCenter(latlng);
	},

	removeMarker: function(marker)
	{
		if(typeof marker != 'undefined' && marker.getMap() != null)
		{
			marker.setMap(null);
		}
	},

	/*
	 * Append marker to map
	 * @param latitude 	: latitude coordinate
	 * @param longitude : longitude coordinate
	 * @param map 		: instance of a map object
	 */
	addMarker: function(model)
	{
		// Remove existing marker
		this.removeMarker(this.marker);
		// Create marker instance
		var position = new google.maps.LatLng(model.get("location_latitude"), model.get("location_longitude"));
		var markerOptions = {
			position: position
		};
		this.marker = new google.maps.Marker(markerOptions);
		this.marker.setMap(this.map);

		// Remove existing window
		if(typeof this.windowView != 'undefined' && this.windowView != null && this.windowView.getMap() != null){
			this.windowView.setMap(null);
			this.windowView = null;
		}

		this.windowView = new App.NoticeWindowView({ data: model });
		this.windowView.setMap(this.map);
		console.log(this.windowView.$el);
	},

	render: function()
	{
		this.$("div:first-child div:first-child div:first-child div:first-child div:first-child").css("position", "relative");

		$(this.el).css({
			width: $("body").width() - $("#sidebar").outerWidth(),
			height: $("body").height() - ($("#global").offset()).top - $("#page-bottom").outerHeight()
		});
		return this;
	}

});

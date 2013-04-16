App.MapModuleView = Backbone.View.extend({

	//className: "map",

	// Array of all markers on the map
	markers: [],

	initialize: function()
	{
		_.bindAll(this, 'unsetLocation', 'setCenter', 'addMarker', 'onActivitySelected', 'addWindow', 'removeWindow', 'addNewMarker', 'addNoticeMarker', 'addConfirmationMarker', 'removeMarker', 'render');

		App.Events.on("RemoveMarker", this.unsetLocation);
		App.Events.on("ActivitySelected", this.onActivitySelected);

		this.options =
		{
			MapTypeId			: google.maps.MapTypeId.ROADMAP,
			panControl			: false,
			mapTypeControl		: false,
			streetViewControl	: false,
			zoom				: 11
		},

		this.model = new Backbone.Model();
		this.model.bind("change:latitude", this.setCenter);

		this.map = new google.maps.Map(this.el, this.options);
		
		//$(window).bind("resize", this.render);
	},

	setCenter: function()
	{
		var latlng = new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude"));
		this.map.setCenter(latlng);
	},

	unsetLocation: function()
	{
		if(typeof this.confirmationMarker != 'undefined' && this.confirmationMarker.getMap() != null)
		{
			this.confirmationMarker.setMap(null);
			this.confirmationWindowView.remove();
		}
	},

	removeMarker: function(marker)
	{
		if(typeof marker != 'undefined' && marker.getMap() != null)
		{
			marker.setMap(null);
			if(typeof this.confirmationWindowView != 'undefined')
				this.confirmationWindowView.remove();
			if(typeof this.noticeWindowView != 'undefined')
				this.noticeWindowView.remove();
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
		var self = this;

		// Create marker instance
		var position = new google.maps.LatLng(model.get("latitude_location"), model.get("longitude_location"));
		var markerOptions = {
			position: position,
			map: this.map
		};
		var marker = new google.maps.Marker(markerOptions);
		// Set map canter to marker position
		this.map.setCenter(position);

		// ===== Google Maps events ===== //
		this.toggleFlag = false;
		var markerEventListener = google.maps.event.addListener(marker, 'click', function(e){
			if(this.toggleFlag == false){
				// Add window overlay
				self.addWindow(model, 'details');
				this.toggleFlag = true;
				// Set map center with animated transition
				self.map.panTo(position);
			}
			else {
				// Remove window overlay
				self.removeWindow();
				this.toggleFlag = false
			}
		});

		this.markers.push({ "object": marker, "data": model });
	},

	onActivitySelected: function(model)
	{
		for(i = 0; i < this.markers.length; i++){
			if(model.get("id_pin") == this.markers[i].data.get("id_pin")){
				google.maps.event.trigger(this.markers[i].object, 'click');
				break;
			}
		}
	},

	/*
	 * Append window overlay to map
	 * @param index 	: index of the marker target
	 * @param position 	: latitude and longitude of the marker target
	 * @param layout	: type of visual layout
	 */
	addWindow: function(model, layout)
	{
		switch(layout){
			case 'details':
				// Remove existing window overlay if does exist
				this.removeWindow();
				this.windowView = new App.InformationWindowView(model);
			break;
			case 'confirmation':
				this.windowView = new App.ConfirmationWindowView({ map: model.map, latlng: this.position });
			break;
			case 'notification':
				this.windowView = new App.NoticeWindowView({ map: model.map, latlng: this.position, description: model.location_description });
			break;
		}
		this.windowView.setMap(this.map);
	},

	/*
	 * Remove window overlay from map
	 * @param index 	: index of the marker target
	 * @param position 	: latitude and longitude of the marker target
	 * @param layout	: type of visual layout
	 */

	removeWindow: function()
	{
		if(typeof this.windowView != 'undefined' && this.windowView != null && this.windowView.getMap() != null){
			this.windowView.setMap(null);
			this.windowView = null;
		}
	},

	addNewMarker: function(model)
	{
		this.removeMarker(this.noticeMarker);
		this.position = new google.maps.LatLng(model.location_latitude, model.location_longitude);
		this.noticeMarkerOptions = {
			position: this.position,
			map: this.map
		};
		this.noticeMarker = new google.maps.Marker(this.noticeMarkerOptions);
		this.map.setCenter(this.position);
		this.noticeWindowView = new App.NoticeWindowView({ map: this.map, latlng: this.position, description: model.location_description });
	},

	addNoticeMarker: function(model)
	{
		this.removeMarker(this.noticeMarker);
		this.position = new google.maps.LatLng(model.location_latitude, model.location_longitude);
		this.noticeMarkerOptions = {
			position: this.position,
			map: model.map.map
		};
		this.noticeMarker = new google.maps.Marker(this.noticeMarkerOptions);
		this.map.setCenter(this.position);
		this.noticeWindowView = new App.NoticeWindowView({ map: model.map, latlng: this.position, description: model.location_description });
	},

	addConfirmationMarker: function(model)
	{
		this.removeMarker(this.confirmationMarker);

		this.model.set({ latitude: model.latitude, longitude: model.longitude});
		var position = new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude"));
		this.confirmationMarkerOptions = {
			position: position,
			map: model.map.map
		};
		this.confirmationMarker = new google.maps.Marker(this.confirmationMarkerOptions);
		this.confirmationWindowView = new App.ConfirmationWindowView({ map: model.map, latlng: position });
	},

	render: function()
	{
		$(this.el).css({
			width: $("body").width() - $("#sidebar").outerWidth(),
			height: $("body").height() - ($("#global").offset()).top - $("#page-bottom").outerHeight()
		});
		return this;
	}

});
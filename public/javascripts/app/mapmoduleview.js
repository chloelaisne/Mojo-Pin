App.MapModuleView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'addNoticeMarker', 'addConfirmationMarker', 'removeMarker', 'render');

		App.Events.on("RemoveMarker", this.removeMarker);

		this.options =
		{
			MapTypeId			: google.maps.MapTypeId.ROADMAP,
			panControl			: false,
			mapTypeControl		: false,
			streetViewControl	: false,
			zoom				: 10
		},

		this.latlng = new google.maps.LatLng(-34.397, 150.644);
		this.map = new google.maps.Map(this.el, this.options);
		this.map.setCenter(this.latlng);

		$(window).bind("resize", this.render);
	},

	setCenter: function(latitude, longitude)
	{
		this.latlng = new google.maps.LatLng(latitude, longitude);
		this.map.setCenter(this.latlng);
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
		this.position = new google.maps.LatLng(model.latitude, model.longitude);
		this.confirmationMarkerOptions = {
			position: this.position,
			map: model.map.map
		};
		this.confirmationMarker = new google.maps.Marker(this.confirmationMarkerOptions);
		this.map.setCenter(this.position);
		this.confirmationWindowView = new App.ConfirmationWindowView({ map: model.map, latlng: this.position });
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
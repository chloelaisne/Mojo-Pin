App.ResultLocationView = Backbone.View.extend({
	tagName: 'li',
	events: {
		"click": "onClick"
	},
	onClick: function(){
		this.resultLocation = new App.ResultLocation({
			description	: this.model.get('description'),
			reference	: this.model.get('reference')
		});
		App.Events.on("hasDetails", this.createMarker);
	},

	createMarker: function(){
		this.position = new google.maps.LatLng(this.resultLocation.get("latitude"),this.resultLocation.get("longitude"));
		this.markerOptions = {
			position: this.position,
			map: App.mapView.map
		};
		this.marker = new google.maps.Marker(this.markerOptions);
		App.mapView.map.setCenter(this.position);
		this.confirmationWindowView = new App.ConfirmationWindowView({ latlng: this.position });
	},

	initialize: function(){
		_.bindAll(this, 'render', 'onClick', 'createMarker');
	},
	render: function(){
		$(this.el).html(this.model.get('description'));

		return this;
	}
})
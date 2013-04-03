App.InformationWindowView = Backbone.View.extend();

App.InformationWindowView.prototype = _.extend(Backbone.View.prototype, google.maps.OverlayView.prototype, {

	initialize: function(model)
	{
		_.bindAll(this, 'onAdd', 'draw', 'onRemove');

		this.model = model;
	},

	onAdd: function()
	{
		// Main wrapper DOM element
		div = document.createElement('div');
		div.className = "window information";

		// Player wrapper DOM element
		var player = document.createElement('div');
		player.className = "player";

		// Left column DOM element
		var leftColumn = document.createElement('div');
		leftColumn.className = "left";
		// Image DOM element
		this.image = document.createElement('span');
		this.image.className = "image";
		this.image.style.backgroundImage = "url(" + this.model.get("image") + ")";
		this.image.style.backgroundSize = "100% 100%";

		leftColumn.appendChild(this.image);

		// Right column DOM element
		rightColumn = document.createElement('div');
		rightColumn.className = "right";
		// Track DOM element
		this.track = document.createElement('p');
		this.track.className = "track";
		this.track.innerHTML = this.model.get("title");
		// Artist DOM element
		this.artist = document.createElement('p');
		this.artist.className = "artist";
		this.artist.innerHTML = this.model.get("artists");
		// Location DOM element
		this.location = document.createElement('p');
		this.location.className = "location";
		this.location.innerHTML = '<span class="mp-locationsmall"></span>' + this.model.get("description_location");
		
		rightColumn.appendChild(this.track);
		rightColumn.appendChild(this.artist);
		rightColumn.appendChild(this.location);

		player.appendChild(leftColumn);
		player.appendChild(rightColumn);

		// Description wrapper DOM
		var description = document.createElement('div');
		description.className = "description";
		// Description DOM element
		this.text = document.createElement('p');
		this.text.innerHTML = this.model.get("description_pin");

		description.appendChild(this.text);

		div.appendChild(player);
		div.appendChild(description);

		this.div_ = div;
		
		var panes = this.getPanes();
		// Render overlay view to floatPane that contains info windows
		panes.floatPane.appendChild(this.div_);
	},

	draw: function()
	{
		var latlng = new google.maps.LatLng(this.model.get("latitude_location"), this.model.get("longitude_location"));
		var position = this.getProjection().fromLatLngToDivPixel(latlng);

		this.div_.style.left = position.x - ($(div).outerWidth() / 2) + "px";
		this.div_.style.top = position.y - $(div).outerHeight() - 42 - 6 + "px";
	},

	onRemove: function()
	{
		google.maps.event.removeListener(this.mousemoveListener);
		google.maps.event.removeListener(this.clickListener);
		google.maps.event.removeListener(this.dragendListener);
		this.div_.parentNode.removeChild(this.div_);
	}

});
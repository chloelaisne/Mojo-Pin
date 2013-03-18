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

		leftColumn.appendChild(this.image);

		// Right column DOM element
		rightColumn = document.createElement('div');
		rightColumn.className = "right";
		// Track DOM element
		this.track = document.createElement('p');
		this.track.className = "track";
		this.track.innerHTML = 'Distance (feat. Chritine and...';
		// Artist DOM element
		this.artist = document.createElement('p');
		this.artist.innerHTML = 'The Name, Christine and The Queens';
		this.artist.className = "artist";
		// Location DOM element
		this.location = document.createElement('p');
		this.location.className = "location";
		this.location.innerHTML = '<span class="mp-locationsmall"></span>Saint Oberholz, Berlin, Germany';
		
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
		this.text.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sodales enim vel ligula dictum vel dictum diam vestibulum. Mauris lacinia, tortor sit amet semper blandit, massa justo eleifend diam, pretium.';

		description.appendChild(this.text);

		div.appendChild(player);
		div.appendChild(description);

		this.div_ = div;
		
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);
	},

	draw: function()
	{
		this.position = this.getProjection().fromLatLngToDivPixel(this.model.latlng);

		this.div_.style.left = this.position.x - ($(div).outerWidth() / 2) + "px";
		this.div_.style.top = this.position.y - $(div).outerHeight() - 42 - 6 + "px";
	},

	onRemove: function()
	{
		google.maps.event.removeListener(this.mousemoveListener);
		google.maps.event.removeListener(this.clickListener);
		google.maps.event.removeListener(this.dragendListener);
		this.div_.parentNode.removeChild(this.div_);
	}

});
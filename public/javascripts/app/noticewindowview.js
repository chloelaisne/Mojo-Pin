App.NoticeWindowView = Backbone.View.extend();

App.NoticeWindowView.prototype = _.extend(Backbone.View.prototype, google.maps.OverlayView.prototype,{

	initialize: function(model)
	{
		_.bindAll(this, 'onAdd', 'draw', 'onRemove');
		
		this.model = model.data;
	},

	onAdd: function()
	{
		var div = document.createElement('div');
		div.className = "window notice";

		this.music = document.createElement('div');
		this.music.className = "music";
		this.music.innerHTML = '<span class="mp-track"></span><span class="track">' + this.model.get("music_track") + '</span> by <span class="artists">' + this.model.get("music_artists") + '</span>';

		this.location = document.createElement('div');
		this.location.className = "location";
		this.location.innerHTML = '<span class="mp-location"></span>' + this.model.get("location_description");

		div.appendChild(this.music);
		div.appendChild(this.location);

		this.div_ = div;
		
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);

		this.width = $(div).outerWidth();
		this.height = $(div).outerHeight();
		this.radius = 6;
		this.arrowwidth = 17;
		this.arrowheight = 7;

		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', this.width + 1 + 'px');
		canvas.setAttribute('height', this.height + this.arrowheight + 1 + 'px');
		var context = canvas.getContext('2d');
		context.moveTo(this.radius + 0.5, 0.5);
		context.lineTo(this.width - this.radius + 0.5, 0.5);
		context.arc(this.width - this.radius + 0.5, this.radius + 0.5, this.radius,1.5*Math.PI, 2*Math.PI);
		context.lineTo(this.width + 0.5, this.height - this.radius + 0.5);
		context.arc(this.width - this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0*Math.PI, 0.5*Math.PI);
		context.lineTo((this.width / 2) + Math.floor(this.arrowwidth / 2) + 0.5, this.height + 0.5);
		context.lineTo((this.width / 2), this.height + this.arrowheight + 0.5);
		context.lineTo((this.width / 2) - Math.floor(this.arrowwidth / 2) + 0.5, this.height + 0.5);
		context.lineTo(this.radius + 0.5, this.height  + 0.5);
		context.arc(this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0.5*Math.PI, 1*Math.PI);
		context.lineTo(0.5, this.radius + 0.5);
		context.arc(this.radius + 0.5, this.radius + 0.5, this.radius, 1*Math.PI, 1.5*Math.PI);
		context.strokeStyle = '#212121';
		context.stroke();
		var gradient = context.createLinearGradient(0,0,0,45);
		gradient.addColorStop(0,'#363636');
		gradient.addColorStop(1,'#212121');
		context.fillStyle = gradient;
		context.fill();

		div.appendChild(canvas);

		div.insertBefore(canvas, div.firstChild);

		panes.overlayLayer.removeChild(div);
		panes.overlayLayer.appendChild(div);
	},

	draw: function()
	{
		var latlng = new google.maps.LatLng(this.model.get("location_latitude"), this.model.get("location_longitude"));
		this.position = this.getProjection().fromLatLngToDivPixel(latlng);
		this.yMargin = 45;

		this.div_.style.left = this.position.x - (this.width / 2) + "px";
		this.div_.style.top = this.position.y - this.height - this.yMargin + "px";
	},

	onRemove: function()
	{
		this.div_.parentNode.removeChild(this.div_);
	}

});
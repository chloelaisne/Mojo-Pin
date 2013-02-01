App.ConfirmationWindowView = Backbone.View.extend({

	initialize: function(){
		Backbone.View.apply(this, arguments);
        google.maps.OverlayView.apply(this, arguments);
	}
	
});

_.extend(App.ConfirmationWindowView.prototype, Backbone.View.prototype, google.maps.OverlayView.prototype,{

	initialize: function(options){
		this.setMap(this.options.map.map);
	},

	onAdd: function(){
		var div = document.createElement('div');
		div.className = "window confirmation";

		var buttonleft = document.createElement('button');
		buttonleft.className = 'sp-button';
		//buttonleft.style.marginRight = '10px';
		buttonleft.innerHTML = 'Remove';

		/*var buttonright = document.createElement('button');
		buttonright.className = 'sp-button';
		buttonright.innerHTML = 'Confirm';*/

		div.appendChild(buttonleft);
		//div.appendChild(buttonright);

		this.div_ = div;

		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);

		//$(div).width($(buttonleft).outerWidth() + parseInt(buttonleft.style.marginRight) + $(buttonright).outerWidth());
		this.width = $(div).outerWidth();
		this.height = $(div).outerHeight();
		this.radius = 6;
		this.arrowwidth = 7;
		this.arrowheight = 17;

		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', this.width + 1 + 'px');
		canvas.setAttribute('height', this.height + 1 + 'px');
		var context = canvas.getContext('2d');
		context.moveTo(this.arrowwidth + this.radius + 0.5, 0.5);
		context.lineTo(this.width - this.radius + 0.5, 0.5);
		context.arc(this.width - this.radius + 0.5, this.radius + 0.5, this.radius,1.5*Math.PI, 2*Math.PI);
		context.lineTo(this.width + 0.5, this.height - this.radius + 0.5);
		context.arc(this.width - this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0*Math.PI, 0.5*Math.PI);
		context.lineTo(this.arrowwidth + this.radius + 0.5, this.height  + 0.5);
		context.arc(this.arrowwidth + this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0.5*Math.PI, 1*Math.PI);
		context.lineTo(this.arrowwidth + 0.5, (this.height / 2) + Math.floor(this.arrowheight / 2) + 0.5);
		context.lineTo(0.5 + 0.5, (this.height / 2) + 0.5);
		context.lineTo(this.arrowwidth + 0.5, (this.height / 2) - Math.floor(this.arrowheight / 2) + 0.5);
		context.lineTo(this.arrowwidth + 0.5, this.radius + 0.5);
		context.arc(this.arrowwidth + this.radius + 0.5, this.radius + 0.5, this.radius, 1*Math.PI, 1.5*Math.PI);
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

	draw: function(){
		var position = this.getProjection().fromLatLngToDivPixel(this.options.latlng);
		this.div_.style.left = position.x + (this.arrowwidth * 2) + "px";
		this.div_.style.top = position.y - 45 + "px";
	},

	onRemove: function(){
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	}

});
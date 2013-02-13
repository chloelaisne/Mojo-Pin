/*require(['gmaps'], function(maps){

	App.ConfirmationWindowView = Backbone.View.extend({

		initialize: function()
		{
			
		}
		
	});

	_.extend(App.ConfirmationWindowView.prototype, Backbone.View.prototype, google.maps.OverlayView.prototype,{

		initialize: function(options)
		{
			this.setMap(this.options.map.map);
		},

		onAdd: function()
		{
			var div = document.createElement('div');
			div.className = "window confirmation";

			this.buttonleft = document.createElement('button');
			this.buttonleft.className = 'sp-button';
			this.buttonleft.innerHTML = 'Remove';

			div.appendChild(this.buttonleft);

			this.div_ = div;

			var panes = this.getPanes();
			panes.overlayLayer.appendChild(div);

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

		draw: function()
		{
			var position = this.getProjection().fromLatLngToDivPixel(this.options.latlng);
			var xMargin = (this.arrowwidth * 2);
			var yMargin = 45;

			console.log($(".window.confirmation").width() - $(".window.confirmation").css("padding-left") - $(".window.confirmation").css("padding-left"));
			console.log($(".window.confirmation").height() - $(".window.confirmation").css("padding-top") - $(".window.confirmation").css("padding-bottom"));

			this.div_.style.left = position.x + xMargin + "px";
			this.div_.style.top = position.y - yMargin + "px";

			var trPixel = {
				x: position.x + xMargin + this.width,
				y: position.y - yMargin
			};
			var blPixel = {
				x: position.x + xMargin,
				y: position.y - yMargin + this.height
			};

			var map = this.options.map;

			google.maps.event.addListener(this.map, 'mousemove', function(e) {
	        	if(e.pixel.x > blPixel.x && e.pixel.x < trPixel.x && e.pixel.y > trPixel.y && e.pixel.y < blPixel.y)
	        	{
	        		map.map.setOptions({ draggableCursor: 'default' });
	        	}
	        	else
	        	{
					map.map.setOptions({ draggableCursor: 'url(http://maps.google.com/mapfiles/openhand.cur), move' });
				}
	    	});
		},

		onRemove: function()
		{
			this.div_.parentNode.removeChild(this.div_);
			this.div_ = null;
		}

	});

});
*/
window.App = {

	initialize: function(){
		this.resizeSidebar();
		console.log('1');
//		this.mapView = new App.MapView().render();
	},

	resizeSidebar: function(){
		this.topoffset = "209";
		this.leftoffset = "183";
		$("#sidebar").css("height", $(window).height() - this.topoffset);
		$("#map").css("height", $(window).height() - this.topoffset);
		$("#map").css("width", $(window).width() - this.leftoffset);
	},

	/*
	 * Shorten the text inside a DOM element
	 * and replace the offset text by 3 dots
	 *
	 * @param: element 	DOM Element of the text to shorten
	 * @param: maxwidth Maximum width of text inside the DOM element
	 */
	stringShortener: function(element,maxwidth){
		var stringwidth = element.width();
		var string = element.text();
		console.log(stringwidth);
		console.log(string);
		if(stringwidth == maxwidth && element.css("height") > element.css("line-height")) {
			var pattern = "...";
			var shortenedelement = element;
			var shortenedstring = shortenedelement.prepend(pattern).text();
			while(shortenedelement.css("height") > shortenedelement.css("line-height")) {
				shortenedstring = shortenedstring.slice(0,shortenedstring.length - 1);
				shortenedelement.text(shortenedstring);
			}
			shortenedstring = $.trim(shortenedstring.slice(pattern.length,shortenedstring.length));
			shortenedelement.text(shortenedstring + pattern);
		}
	}

};

App.Events = _.extend({}, Backbone.Events);
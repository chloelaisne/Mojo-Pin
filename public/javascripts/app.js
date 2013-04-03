// Declare namespace
window.App = {

	// Facebook credentials
	FACEBOOK: new Array(),

	// Google Maps credentials
	GOOGLE_MAPS: new Array(),

	initialize: function()
	{

		// Set Facebook Credentials
		this.FACEBOOK["app_identifier"]	= "476683619043995";
		this.FACEBOOK["app_permissions"]	= ['user_location','friends_location', 'publish_actions'];

		// Set Google Maps Credentials
		// this.GOOGLE_MAPS["key"] = "AIzaSyD9YAvbWKUsUhJfMZeZqKjROLrcM9kgCcQ";
		this.GOOGLE_MAPS["key"] = "AIzaSyCSTzcjJfXnNFlnhe6x9hBzxCo5AxTOk88";
		this.GOOGLE_MAPS["sensor"] = false;

		var self = this;

		// Verify if user session exists
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/json/session/user'
		})
		.done(function (data, textStatus, jqXHR){
			// If user session does not exist, redirect to Facebook Auth Dialog
			if(data.action == 'authenticateWithFacebook') {
				App.Events.trigger('FacebookAuthDialog');
			}
			// If user session does exist, return user session
			else {
				App.Events.trigger("FacebookCredentialsGet", data);
			}
		});
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
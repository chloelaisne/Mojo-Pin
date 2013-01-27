window.App = {

	initialize: function(){
		this.resizeSidebar();
	},

	resizeSidebar: function(){
		this.topoffset = "209";
		this.leftoffset = "183";
		$("#sidebar").css("height", $(window).height() - this.topoffset);
		$("#map").css("height", $(window).height() - this.topoffset);
		$("#map").css("width", $(window).width() - this.leftoffset);
	}

};
App.Friend = Backbone.Model.extend({

	initialize: function(){

		var picture = "https://graph.facebook.com/" + this.id + "/picture?width=130&height=130";

		if(typeof this.display === 'undefined')
			this.display = "block";

		this.set({
			picture: picture
		});
		
	}
	
});
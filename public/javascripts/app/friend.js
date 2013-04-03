App.Friend = Backbone.Model.extend({

	initialize: function()
	{
		// Set link to user's profile picture
		this.set({ "picture": "https://graph.facebook.com/" + this.id + "/picture?width=130&height=130" });

		if(typeof this.get("display") === 'undefined')
		{
			this.set({ "display": "block" });
		}
		
	}
	
});
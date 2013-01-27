App.FriendsCollection = Backbone.Collection.extend({

	url: "https://graph.facebook.com/me/friends?access_token=AAAGxio3IipsBAM6umHu2VJ8j9RoV2yQAEJspN2nnWAHm3B3xDDJ9RZCnRslcnNYWsj6lNqitUml6TUak5ojkMa95ZCGZAZBmas0IduaLoAZDZD",

	initialize: function(){
//		console.log('initialize FriendsCollection');
	},

	parse: function(response) {
        return response.data;
    },

    comparator: function(model) {
		return model.get('name');
	},

	filter: function(string){
		console.log(string);

		var pattern = new RegExp("\s*\w*" + string + "\s*\w*", "ig");
		var models = _.filter(this.models, function(model){
			if(pattern.test(model.get("name")) == true){
				model.set({ display: "block" });
			} else{
				model.set({ display: "none" });
			}
			return model;
		});

		this.models = models;
	}

});
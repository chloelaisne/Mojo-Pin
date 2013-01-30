App.PaginationView = Backbone.View.extend({
	template : Templates.Pagination,

	events: {
		"click .left button": "onClickLeftButton",
		"click .right button": "onClickRightButton",
	},

	onClickLeftButton: function(e){
		e.preventDefault();
		App.router.navigate('/user/chloelaisne', true);
	},

	onClickRightButton: function(e){
		e.preventDefault();
		App.router.navigate('/editLocation', true);
	},

	initialize: function(){
		_.bindAll(this, 'render', 'onClickLeftButton', 'onClickRightButton');
	},

	render: function(){
		this.setElement(this.template);
		return this;
	}
});
$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	App.Models.Guild = Backbone.Model.extend({
		initialize: function (curr_user) {
			user = curr_user
		}
	});

	App.Collections.Guild = Backbone.Collection.extend({
	model: App.Models.Guild,
	url: 'http://localhost:3000/messages.json',
	initialize: function () {
		this.fetch();
	}
	});

	App.Views.Something = Backbone.View.extend({
		initialize: function () {
			$('#something').html("<%= @guilds %> ")
		}
	});

	new App.Views.Something();
	col = new App.Collections.Guild();
	console.log('here');
	console.log(col);
	console.log('here');
}());
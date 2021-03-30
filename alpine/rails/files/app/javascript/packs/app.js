$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	}

	App.Models.Page = Backbone.Model.extend({
		initialize: function () {
			this.get_access();
		},
		get_access: function () {
			console.log("GET ACCESS");
			// fetch("/get_is_logged_in")
			// .then(resp => resp.json())
			// .then(auth => {
			// 	this.access = auth;
			// })
		}
	});

	App.Views.LogIn = Backbone.View.extend({
		el: '#pageContent',
		events: {
			'click #LogInForm': 'login'
		},
		login: function () {
			fetch("/login")
			// user_marvin_omniauth_authorize_path
		}
	})

	App.Views.TestPage = Backbone.View.extend({
		page_template: _.template($("#UserPageTemplate").html()),
		form_template: _.template($("#FormTemplate").html()),
		auth: false,
		initialize: function () {
			console.log("VIEW TEST");
			// fetch("/get_is_logged_in")
			// .then(resp => resp.json())
			// .then(auth => {
			// 	if (auth == false) {
			// 		this.$el.html(this.form_template);
			// 		this.render_form()
			// 	}
			// 	else {
					this.$el.html(this.page_template);
					this.render_page();
			// 	}
			// })
		},
		render_page: function () {
			$('#pageContent').html(this.el);
			new AppUser.Views.UserPage();
		},
		render_form: function () {
			$('#pageContent').html(this.el);
			new App.Views.LogIn();
		}
	});

	App.Views.HomePage = Backbone.View.extend({
		page_template: _.template($("#HomePageTemplate").html()),	
		form_template: _.template($("#FormTemplate").html()),
		auth: false,
		initialize: function () {
			console.log("VIEW HOME");
			// fetch("/get_is_logged_in")
			// .then(resp => resp.json())
			// .then(auth => {
			// 	if (auth == false) {
			// 		this.$el.html(this.form_template);
			// 		this.render_form()
			// 	}
				// else {
					this.$el.html(this.page_template);
					this.render_page();
			// 	}
			// })
		},
		render_page: function () {
			$('#pageContent').html(this.el);
		},
		render_form: function () {
			$('#pageContent').html(this.el);
			new App.Views.LogIn();
		}
	});

	App.Views.TournamentPage = Backbone.View.extend({
		page_template: _.template($("#TournamentPageTemplate").html()),
		form_template: _.template($("#FormTemplate").html()),
		auth: false,
		initialize: function () {
			// fetch("/get_is_logged_in")
			// .then(resp => resp.json())
			// .then(auth => {
			// 	if (auth == false) {
			// 		this.$el.html(this.form_template);
			// 		this.render_form()
			// 	}
			// 	else {
					this.$el.html(this.page_template);
					this.render_page();
			// 	}
			// })
		},
		render_page: function () {
			$('#pageContent').html(this.el);
		},
		render_form: function () {
			$('#pageContent').html(this.el);
			new App.Views.LogIn();
		}
	});

	App.Router = Backbone.Router.extend({
		routes: {
			''			: 'home_page',
			'tournament': 'tournament_page',
			'test'		: 'test_page',
			'logout'	: 'logout_page',
			'login'		: 'home_page'
		},
		home_page: function () {
			console.log("ROUTER HOME");
			var homePage = new App.Views.HomePage();
		},
		tournament_page: function () {
			console.log("ROUTER TOURNAMENT");
			var tournamentPage = new App.Views.TournamentPage();
		},
		test_page: function () {
			console.log("ROUTER TEST");
			var testPage = new App.Views.TestPage();
		},
		logout_page: function () {
			fetch("/logout")
				.then(resp => {
					var homePage = new App.Views.HomePage();
			})
		}
	});

	console.log("HISTORY START");
	start = new App.Router();
	Backbone.history.start();


}());
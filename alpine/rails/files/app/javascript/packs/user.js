window.AppUser = {
	Models: {},
	Views: {},
	Collections: {},
	Router: {}
}


/*
** MODEL of a user from DB
*/
AppUser.Models.User = Backbone.Model.extend({
	initialize: function (curr_user) {
		this.user_id = curr_user.user_id;
		this.intra = curr_user.intra;
		this.nick = curr_user.nick;
		this.guild_id = curr_user.guild_id;
		this.guild_join_time = curr_user.guild_join_time;
		this.avatar = curr_user.avatar;
	},
});

/*
** COLLECTION of users (of models)
** collection automaticly fills with the DB users (by fetch request)
*/
AppUser.Collections.User = Backbone.Collection.extend({
	model: AppUser.Models.User,
	url: 'http://localhost:3000/users',
	initialize: function () {
		this.fetch();
	}
});

/*
** VIEW of a user (view of a single user (string with buttons))
*/
AppUser.Views.User = Backbone.View.extend({
	tagName: 'li',
	template: _.template($("#UserTemplate").html()),
	initialize: function () {
		this.model.on('destroy', this.remove, this);
	},
	render: function () {
		var template = this.template(this.model);
		this.$el.append(template);
		return this;
	},
	events: {
		'click #delete_user': 'delete_user'
	},
	remove: function () {
		this.$el.remove();
	},
	delete_user: function () {
		this.model.destroy();
	}
});

/*
** VIEW of a list of users
*/
AppUser.Views.Users = Backbone.View.extend({
	tagName: 'ul',
	initialize: function () {
		this.collection.on('add', this.addOne, this);
		this.render();
	},
	render: function () {
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne: function (task) {
		var task_view = new AppUser.Views.User({ model: task });
		this.$el.append(task_view.render().el);
	},
	draw: function () {
		$('#userDiv').append(this.el);
	}
});

/*
** VIEW of user creation form
*/
AppUser.Views.AddUser = Backbone.View.extend({
	template:	'<div class="class row" style="margin-left: 20px">' +
					'<div class="col-3">' +
						'<form class="row">' +
							'<label for="userFromIntra" class="visually-hidden">Email</label>' +
							'<input placeholder="Intra login" type="text" class="form-control col" id="userFromIntra" value="">' +
						'</form>' +
						'<form class="row">' +
							'<label for="userFromNick" class="visually-hidden">Email</label>' +
							'<input placeholder="Nickname" type="text" class="form-control col" id="userFromNick" value="">' +
						'</form>' +
						'<form class="row">' +
							'<label for="inputPassword2" class="visually-hidden">Email</label>' +
							'<input placeholder="Guild" type="text" class="form-control col" id="userFromGuild" value="">' +
						'</form>' +
						'<form class="row">' +
							'<input type="submit" class="btn btn-outline-dark mb-3 col" value="create">' +
						'</form>' +
					'</div>' +
				'</div>',
	initialize: function () {
		this.$el.html(this.template);
	},
	draw: function () {
		$('#userForm').html(this.el);
	},
	events: {
		'submit': 'submit'
	},
	submit: function (e) {
		e.preventDefault();
		this.getUserId().then(resp => {
			resp.json().then(id => {
				this.createUser(id + 1, e);
			})
		})
	},
	getUserId: async () => {
		return fetch('http://localhost:3000/get_user_id')
	},
	createUser: function (newUserId, e) {
		let user = {
			user_id: newUserId,
			intra:  $(e.currentTarget).find('input[id=userFromIntra]').val(),
			nick: $(e.currentTarget).find('input[id=userFromNick]').val(),
			is_online: true,
			guild_id: 1,
			guild_join_time: Date(),
			wins: 0,
			loses: 0,
			score: 0
		}
		fetch("http://localhost:3000/users", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then(res => res.ok ? res.json() : Promise.reject(res))
		.then(user => {
			new_user = new AppUser.Models.User(user);
			this.collection.add(new_user);
		})
		.catch(() => {
			alert('Error! Unable to create user!')
		})
	}
});


/*
** VIEW of a whole users page
*/
AppUser.Views.UserPage = Backbone.View.extend({
	initialize: function () {
		var coll = new AppUser.Collections.User();
		var usersView = new AppUser.Views.Users({ collection: coll });
		usersView.draw();
		var usersForm = new AppUser.Views.AddUser({ collection: coll });
		usersForm.draw();
	}
})

window.App = {
	Models: {},
	Views: {},
	Collections: {},
	Router: {}
};


// -----------------------------------------
//  USER              MODEL
// -----------------------------------------
App.Models.User = Backbone.Model.extend({
	initialize: function (data) {
		this.id 	  = data.user.id
		this.nickname = data.user.nickname
		this.avatar   = data.user.avatar
		this.email	  = data.user.email
		this.guild_id = data.user.guild_id
		this.loses	  = data.user.loses
		this.wins	  = data.user.wins
		this.score	  = data.user.score
	}
})


// -----------------------------------------
//  USER_FRIENDS       MODEL and COLLECTION
// -----------------------------------------
App.Models.UserFriend = Backbone.Model.extend({
	urlRoot: "/profile/get_user_friends",
	initialize: function (user) {
		this.nickname = user.nickname;
		this.avatar = user.avatar;
		this.id = user.id;
		console.log(this.nickname)
	}
})

App.Collections.UserFriends = Backbone.Collection.extend({
	model: App.Models.UserFriend,
	url: "/profile/get_user_friends",
	initialize: function (data) {
		this.url += ('/' + data.user_id)
		this.fetch()
	}
})


// -----------------------------------------
//  USER           INFO CARD VIEW
// -----------------------------------------
App.Views.UserInfo = Backbone.View.extend({
	template: _.template($("#UserInfoTemplate").html()),
	render: function () {
		var template = this.template(this.model)
		this.$el.html(template)
		$("#UserInfo").html(this.el)
		this.renderButtons()
	},
	renderButtons: function () {
		button = new App.Views.UserInfoBtn({ model: this.model })
		button.render()
	}
})

// -----------------------------------------
//  USER        INFO BUTTONS VIEW
// -----------------------------------------
App.Views.UserInfoBtn = Backbone.View.extend({
	id: 'UserButtons',
	templateEditBtn: _.template($("#UserInfoEditBtnTemplate").html()),
	templateAddBtn: _.template($("#UserInfoAddBtnTemplate").html()),
	templateDelBtn: _.template($("#UserInfoDelBtnTemplate").html()),

	render: function () {
		if (current_user.id == this.model.id)
			this.$el.html(this.templateEditBtn)
		// DEBUG: добавить проверку на то, в друзьях ли пользователь
		else
			this.$el.html(this.templateAddBtn)
		$('#UserInfoBtn').html(this.el)
	}
})


// -----------------------------------------
//  USER           FRIENDS CARD VIEW
// -----------------------------------------
App.Views.UserFriends = Backbone.View.extend({
	template: _.template($("#UserFriendsTemplate").html()),
	initialize: function (data) {
		this.model = data.model
		// this.collection = data.collection
		// this.user = data.user
		// console.log(this.user.nickname)
		// console.log(this.collection)
	},
	render: function () {
		var template = this.template(this.model)
		this.$el.html(template)
		$("#UserFriends").html(this.el)
		this.renderFriendIcons()
		// console.log(this.collection)
	},
	renderFriendIcons: function () {
		i = 0
		while (i < 6) {
			icon = new App.Views.UserFriendsIcon({ model: this.model })
			icon.render()
			$("#UserFriendsIcons").append(icon.el);
			icon = new App.Views.UserFriendsIcon({ model: this.model })
			icon.render()
			$("#UserFriendsIconsAll").append(icon.el);
			icon = new App.Views.UserFriendsIcon({ model: this.model })
			icon.render()
			$("#UserFriendsIconsAll").append(icon.el);
			i++
		}
	}
})


// -----------------------------------------
//  USER_FRIENDS      MODEL VIEW (ICON)
// -----------------------------------------
App.Views.UserFriendsIcon = Backbone.View.extend({
	template: _.template($("#UserFriendsIconTemplate").html()),
	className: 'col-2 UserFriendIcon', 
	render: function () {
		var template = this.template(this.model);
		this.$el.html(template);
	}
})


// -----------------------------------------
//  USER      		GUILD CARD VIEW
// -----------------------------------------
App.Views.UserGuild = Backbone.View.extend({
	template: _.template($("#UserGuildTemplate").html()),
	template_none: _.template($("#UserNoGuildTemplate").html()),
	render: function () {
		$("#UserGuild").css({ "display": "block" })
		if (this.model.guild_id) {
			fetch("/profile/get_guild", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					guild_id: this.model.guild_id
				})
			})
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind(res => {
					var template = this.template(res);
					this.$el.html(template);
					$("#UserGuild").html(this.el)
				}, this))
		}
		else if (current_user.id == this.model.id) {
			var template = this.template_none();
			this.$el.html(template);
			$("#UserGuild").html(this.el)
		}
		else
			$("#UserGuild").css({ "display": "none" })
	}
})


// -----------------------------------------
//  USER      		MATCHES CARD VIEW
// -----------------------------------------
App.Views.UserMatches = Backbone.View.extend({
	template: _.template($("#UserMatchesTemplate").html()),
	render: function () {
		var template = this.template();
		this.$el.html(template);
		$("#UserMatches").html(this.el)
	}
})

const urlArray = window.jQuery.ajaxSettings.url.split('/')
const user_id = urlArray[urlArray.length - 1]
fetch("/profile/get_curr_user")
.then(res => res.ok ? res.json() : Promise.reject(res))
.then(function (res) {
	window.current_user = new App.Models.User({ user: res })
	if (user_id == current_user.id || user_id == 0) {
		user = current_user

		userInfoView = new App.Views.UserInfo({ model: user })
		userInfoView.render()

		// UserFriends = new App.Collections.UserFriends({ user_id: user.id })
		// console.log(UserFriends)
		// UserFriendsView = new App.Views.UserFriends({ collection: UserFriends, user: user })
		// UserFriendsView.render()

		UserFriendsView = new App.Views.UserFriends({ model: user })
		UserFriendsView.render()

		UserGuildView = new App.Views.UserGuild({ model: user })
		UserGuildView.render()

		UserMatchesView = new App.Views.UserMatches({ model: user })
		UserMatchesView.render()
	}
	else {
		fetch(("/profile/get_user/" + user_id))
		.then(result => result.ok ? result.json() : Promise.reject(result))
		.then(function (result) {
			user = new App.Models.User({ user: result })

			userInfoView = new App.Views.UserInfo({ model: user })
			userInfoView.render()

			UserFriendsView = new App.Views.UserFriends({ model: user })
			UserFriendsView.render()

			UserGuildView = new App.Views.UserGuild({ model: user })
			UserGuildView.render()

			UserMatchesView = new App.Views.UserMatches({ model: user })
			UserMatchesView.render()
		})
	}
})

// col = new App.Collections.User
// new App.Views.UserInfo({ collection: col})


// userInfoView = new App.Views.UserInfo({ model: user })
// userInfoView.render()
// const urlArray = window.jQuery.ajaxSettings.url.split('/')
// console.log(this)
// 	console.log('------')
// console.log(window)
// console.log(urlArray[urlArray.length - 1])

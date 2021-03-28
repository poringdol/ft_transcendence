window.App = {
	Models: {},
	Views: {},
	Collections: {},
	Router: {}
};

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

// App.Collections.User = Backbone.Collection.extend({
// 	model: App.Models.User,
// 	url: 'http://localhost:3000/user',
// 	initialize: function () {
// 		this.fetch()
// 	}
// })

App.Views.UserInfo = Backbone.View.extend({
	template: _.template($("#UserInfoTemplate").html()),
	render: function () {
		var template = this.template(this.model)
		this.$el.html(template)
		$("#UserInfo").html(this.el)
	}
})

App.Views.UserFriends = Backbone.View.extend({
	template: _.template($("#UserFriendsTemplate").html()),
	render: function () {
		var template = this.template(this.model)
		this.$el.html(template)
		$("#UserFriends").html(this.el)
		this.renderFriendIcons()
	},
	renderFriendIcons: function () {
		i = 0
		while (i < 6) {
			icon = new App.Views.UserFriendsIcon({ model: this.model })
			icon.render()
			icon = new App.Views.UserFriendsIcon({ model: this.model })
			i++
		}
	}
})

App.Views.UserFriendsIcon = Backbone.View.extend({
	template: _.template($("#UserFriendsIconTemplate").html()),
	className: 'col-2 UserFriendIcon', 
	render: function () {
		var template = this.template(this.model);
		this.$el.html(template);
		$("#UserFriendsIcons").append(this.el);
	}
})

fetch("http://localhost:3000/profile/get_curr_user")
.then(res => res.ok ? res.json() : Promise.reject(res))
.then(function (res) {
	user = new App.Models.User({ user: res })
	userInfoView = new App.Views.UserInfo({ model: user })
	userInfoView.render()
	UserFriendsView = new App.Views.UserFriends({ model: user })
	UserFriendsView.render()
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

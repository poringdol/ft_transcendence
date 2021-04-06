$(function () {

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
			this.id = data.user.id
			this.nickname = data.user.nickname
			this.avatar = data.user.avatar
			this.email = data.user.email
			this.guild_id = data.user.guild_id
			this.loses = data.user.loses
			this.wins = data.user.wins
			this.score = data.user.score
			this.is_banned = data.user.is_banned
			this.is_admin = data.user.is_admin
		}
	})

	// -----------------------------------------
	//  USER_FRIENDS       MODEL and COLLECTION
	// -----------------------------------------
	App.Models.UserFriend = Backbone.Model.extend({
		urlRoot: "/friends/get_friends/",
		initialize: function (data) {
			this.urlRoot += usr_id
			if (typeof data.friend === "undefined")
				return;
			this.id = data.friend.friend_id
			this.nickname = data.friend.nickname
			this.avatar = data.friend.avatar
		}
	})

	App.Collections.UserFriends = Backbone.Collection.extend({
		model: App.Models.UserFriend,
		url: "/friends/get_friends/",
		initialize: function () {
			this.url += usr_id
			this.fetch()
		}
	})


	// -----------------------------------------
	//  USER_FOLLOWERS       MODEL and COLLECTION
	// -----------------------------------------
	App.Models.UserFollower = Backbone.Model.extend({
		urlRoot: "/friends/get_followers/",
		initialize: function (data) {
			this.urlRoot += usr_id
			if (typeof data.user === "undefined")
				return;
			this.id = data.user.user_id
			this.nickname = data.user.nickname
			this.avatar = data.user.avatar
		}
	})

	App.Collections.UserFollowers = Backbone.Collection.extend({
		model: App.Models.UserFollower,
		url: "/friends/get_followers/",
		initialize: function () {
			this.url += usr_id
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
		templateEditBtn:		_.template($("#UserInfoEditBtnTemplate").html()),
		templateAddBtn:			_.template($("#UserInfoAddBtnTemplate").html()),
		templateDelBtn:			_.template($("#UserInfoDelBtnTemplate").html()),
		templateUnfollowBtn:	_.template($("#UserInfoUnfollowBtnTemplate").html()),
		templateFollowBackBtn:	_.template($("#UserInfoFollowBackBtnTemplate").html()),
		templateBanBtn:			_.template($("#UserInfoBanBtnTemplate").html()),
		templateUnbanBtn:		_.template($("#UserInfoUnbanBtnTemplate").html()),
		templateBannedStatus:	_.template($("#UserInfoBannedStatusTemplate").html()),
		
		events: {
			'click #UserInfoAddBtn':		'addFriend',
			'click #UserInfoDelBtn':		'deleteFriend',
			'click #UserInfoUnfollowBtn': 	'unfollowUser',
			'click #UserInfoFollowBackBtn': 'followBackUser',
			'click #UserInfoBanBtn': 		'banUser',
			'click #UserInfoUnbanBtn': 		'unbanUser'
		},
		render: function () {
			if (current_user.id == this.model.id)
				this.$el.html(this.templateEditBtn)
			else
				this.drawBtn()
			$('#UserInfoBtn').html(this.el)
		},
		addFriend: function () {
			fetch(("/friends/send_request/" + this.model.id))
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((res) => {
				if (res == 1)
					alert('You sent request to ' + this.model.nickname + '!')
				else
					alert(res)
				this.render()
			}, this))
		},
		followBackUser: function () {
			fetch(("/friends/follow_back/" + this.model.id))
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((res) => {
				if (res == 1)
					alert('You and ' + this.model.nickname + ' became friends!')
				this.render()
			}, this))
			.catch(() => alert('some error'));
		},
		deleteFriend: function () {
			fetch(("/friends/delete_from_friends/" + this.model.id))
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((res) => {
				if (res == 1)
					alert('You deleted ' + this.model.nickname + ' from friends :(')
				else
					alert(res)
				this.render()
			}, this))
			.catch(() => alert('some error'));
		},
		unfollowUser: function () {
			fetch(("/friends/unfollow_user/" + this.model.id))
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((res) => {
				if (res == 1)
					alert('You unfollowed ' + this.model.nickname + ' :(')
				else
					alert(res)
				this.render()
			}, this))
			.catch(() => alert('some error'));
		},
		banUser: function () {
			if (current_user.is_admin == true) {
				fetch(("/profile/ban_user/" + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					if (res == 1)
						alert('You banned ' + this.model.nickname + ' :(')
					else
						alert(res)
					this.model.is_banned = true;
					this.render()
				}, this))
				.catch(() => alert('some error'));
			}
			else
				alert("You don't have a permission!")
		},
		unbanUser: function () {
			if (current_user.is_admin == true) {
				fetch(("/profile/unban_user/" + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					if (res == 1)
						alert('You unbanned ' + this.model.nickname + ' :)')
					else
						alert(res)
					this.model.is_banned = false;
					this.render()
				}, this))
				.catch(() => alert('some error'));
			}
			else
				alert("You don't have a permission!")
		},
		drawBtn: function () {
			fetch(("/friends/is_friend/" + this.model.id))
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(function (res) {
				if (this.model.is_banned)
					this.$el.html(this.templateBannedStatus);
				else
					this.$el.html("");
				if (res == 0 && !this.model.is_banned)
					this.$el.append(this.templateAddBtn);
				else if (res == 1)
					this.$el.append(this.templateDelBtn);
				else if (res == 2)
					this.$el.append(this.templateUnfollowBtn);
				else if (!this.model.is_banned)
					this.$el.append(this.templateFollowBackBtn);
				if (!this.model.is_admin) {
					if (current_user.is_admin == true && !this.model.is_banned)
						this.$el.append(this.templateBanBtn);
					else if (current_user.is_admin == true && this.model.is_banned)
						this.$el.append(this.templateUnbanBtn);
				}
			}, this))
		}
	})


	// -----------------------------------------
	//  USER           FRIENDS CARD VIEW
	// -----------------------------------------
	App.Views.UserFriends = Backbone.View.extend({
		template: _.template($("#UserFriendsTemplate").html()),
		initialize: function () {
			this.collection.on('sync', this.renderIcons, this)
		},
		render: function () {
			var template = this.template()
			this.$el.html(template)
			$("#UserFriends").html(this.el)
			return this
		},
		renderIcons: function () {
			this.n = 0
			this.collection.each(this.addOne, this)
			return this
		},
		addOne: function (user) {
			if (this.n < 6) {
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendsIcons").append(icon.el);
				this.n += 1
			}
			else if (this.n > 5) {
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendsIconsAll").append(icon.el);
				this.n += 1
			}
		},
	})


	// -----------------------------------------
	//  USER       FRIEND REQUESTS CARD VIEW
	// -----------------------------------------
	App.Views.UserFriendRequests = Backbone.View.extend({
		template: _.template($("#UserFriendRequestsTemplate").html()),
		initialize: function () {
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			if (this.collection.length != 0) {
				var template = this.template()
				this.$el.html(template)
				$("#UserFriendRequests").html(this.el)
				this.renderIcons()
			}
			return this
		},
		renderIcons: function () {
			this.n = 0
			this.collection.each(this.addOne, this)
			return this
		},
		addOne: function (user) {
			if (this.n < 6) {
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendRequestsIcons").append(icon.el);
				this.n += 1
			}
			else if (this.n > 5) {
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendRequestsIconsAll").append(icon.el);
				this.n += 1
			}
		},
	})


	// -----------------------------------------
	//  USER_FRIENDS      MODEL VIEW (ICON)
	// -----------------------------------------
	App.Views.UserFriendsIcon = Backbone.View.extend({
		template: _.template($("#UserFriendsIconTemplate").html()),
		tagName: 'a',
		className: 'col-2 UserFriendIcon SimpleHref',
		render: function () {
			var template = this.template(this.model);
		
			this.$el.attr({ 'href': ("/profile/" + this.model.id) });
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
				fetch(("/guilds/get_guild/" + this.model.guild_id))
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


	// -----------------------------------------
	//           		MAIN
	// -----------------------------------------
	const urlArray = window.jQuery.ajaxSettings.url.split('/')
	const user_id = urlArray[urlArray.length - 1]
	fetch("/profile/get_curr_user")
	.then(res => res.ok ? res.json() : Promise.reject(res))
	.then(function (res) {
		window.current_user = new App.Models.User({ user: res })
		if (user_id == current_user.id || user_id == 0) {
			user = current_user
			renderPage(user)
		}
		else {
			fetch(("/profile/get_user/" + user_id))
			.then(result => result.ok ? result.json() : Promise.reject(result))
			.then(function (result) {
				user = new App.Models.User({ user: result })
				renderPage(user)
			})
		}
	})
	function renderPage(user) {
		if (!current_user.is_banned) {
			window.usr_id = user.id
	
			userInfoView = new App.Views.UserInfo({ model: user })
			userInfoView.render()
	
			UserFriends = new App.Collections.UserFriends()
			UserFriendsView = new App.Views.UserFriends({ collection: UserFriends })
			UserFriendsView.render()
	
			if (user.id == current_user.id) {
				UserFriendRequests = new App.Collections.UserFollowers()
				UserFriendRequestsView = new App.Views.UserFriendRequests({ collection: UserFriendRequests })
			}
	
			UserGuildView = new App.Views.UserGuild({ model: user })
			UserGuildView.render()
	
			UserMatchesView = new App.Views.UserMatches({ model: user })
			UserMatchesView.render()

			// fetch("/profile/block_list_detailed/" + user.id)
			// .then(result => result.ok ? result.json() : Promise.reject(result))
			// .then(function (result) {
			// 	console.log(result);
			// })
		}
		else
			$(".content").html("<h3>You account was blocked by administrator</h3>")
	}
}());

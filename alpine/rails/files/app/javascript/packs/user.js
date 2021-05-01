const { template } = require("underscore");

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
			this.is_moderator = data.user.is_moderator
		}
	})


// ---------------------------------------------------------------------------------------------------------------------------
//                                                   F R I E N D S
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  FRIENDS       MODEL and COLLECTION
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
	//             FRIENDS CARD VIEW
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
			$("#accordionFlushExample").css({ 'display': 'none' })
			$("#UserFriendsCard").css({ 'border-bottom': '0px' })
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
				$("#accordionFlushExample").css({ 'display': 'block' })
				$("#UserFriendsCard").css({ 'border-bottom': '1px solid rgba(0, 0, 0, 0.125)' })
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendsIconsAll").append(icon.el);
				this.n += 1
			}
		},
	})

	// -----------------------------------------
	//  FRIENDS      MODEL VIEW (ICON)
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



// ---------------------------------------------------------------------------------------------------------------------------
//                                                  F O L L O W E R S
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  FOLLOWERS       MODEL and COLLECTION
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
	//  FOLLOWERS     FRIEND REQUESTS CARD VIEW
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
				$("#UserFriendRequestsIconsFlash").css({ 'display': 'none' })
				$("#UserFriendRequestsCard").css({ 'border-bottom': '0px' })
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
				$("#accordionFlushExample").css({ 'display': 'block' })
				$("#UserFriendRequestsCard").css({ 'border-bottom': '1px solid rgba(0, 0, 0, 0.125)' })
				icon = new App.Views.UserFriendsIcon({ model: user })
				icon.render()
				$("#UserFriendRequestsIconsAll").append(icon.el);
				this.n += 1
			}
		},
	})


// ---------------------------------------------------------------------------------------------------------------------------
//                                                  B L O C K L I S T
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  BLOCKLIST      MODEL and COLLECTION
	// -----------------------------------------
	App.Models.Blocklist = Backbone.Model.extend({
		urlRoot: "/profile/block_list_detailed/",
		initialize: function (data) {
			this.urlRoot += usr_id
			if (typeof data.blocked_user === "undefined")
				return;
			this.id = data.blocked_user.blocked_user_id
			this.nickname = data.blocked_user.blocked_nickname
			this.avatar = data.blocked_user.blocked_avatar
			this.block_id = data.id
		}
	})

	App.Collections.Blocklist = Backbone.Collection.extend({
		model: App.Models.Blocklist,
		url: "/profile/block_list_detailed/",
		initialize: function () {
			this.url += usr_id
			this.fetch()
		}
	})

	// -----------------------------------------
	//  BLOCKLIST    	BLOCKLIST CARD VIEW
	// -----------------------------------------
	App.Views.UserBlocklist = Backbone.View.extend({
		template: _.template($("#UserBlocklistTemplate").html()),
		initialize: function () {
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			if (this.collection.length != 0) {
				this.n = 0
				var template = this.template();
				this.$el.html(template);
				$("#UserBlocklist").html(this.el)
				$("#accordionFlushExample3").css({ 'display': 'none' })
				$("#UserBlocklistCard").css({ 'border-bottom': '0px' })
				this.collection.each(this.addOne, this)
			}
			return this;
		},
		addOne: function (user) {
			if (this.n < 3) {
				icon = new App.Views.UserBlocklistIcon({ model: user })
				icon.render()
				$("#UserBlocklistIcons").append(icon.el);
				$("#BlocklistHref" + user.id).attr({ 'href': ("/profile/" + user.id) });
				$("#BlocklistHrefName" + user.id).attr({ 'href': ("/profile/" + user.id) });
				this.n += 1
			}
			else if (this.n > 2) {
				$("#accordionFlushExample3").css({ 'display': 'block' })
				$("#UserBlocklistCard").css({ 'border-bottom': '1px solid rgba(0, 0, 0, 0.125)' })
				icon = new App.Views.UserBlocklistIcon({ model: user })
				icon.render()
				$("#UserBlocklistIconsAll").append(icon.el);
				$("#BlocklistHref" + user.id).attr({ 'href': ("/profile/" + user.id) });
				$("#BlocklistHrefName" + user.id).attr({ 'href': ("/profile/" + user.id) });
				this.n += 1
			}
		},
	})

	// -----------------------------------------
	//  BLOCKLIST      MODEL VIEW (ICON)
	// -----------------------------------------

	App.Views.UserBlocklistIcon = Backbone.View.extend({
		template_list: _.template($("#BlocklistIconTemplate").html()),
		tagName: 'div',
		className: 'row',
		events: {
			'click #UserUnblockBtn': 'unblockUser'
		},
		render: function () {
			var template_list = this.template_list(this.model);
			this.$el.html(template_list);
		},
		unblockUser: function () {
			fetch(('/blocklists/unblock_user/' + this.model.block_id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					alert('You unblocked ' + this.model.nickname + '!');
					this.$el.remove();
				}, this))
				.catch(function (res) {
					alert("Error accured! Try again!")
				})
		}
	})


// ---------------------------------------------------------------------------------------------------------------------------
//                                                      G U I L D
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  GUILD_INVITES  MODEL and COLLECTION
	// -----------------------------------------
	App.Models.GuildInvite = Backbone.Model.extend({
		urlRoot: "/guild_invites/users_invites/",
		initialize: function () {
		}
	})

	App.Collections.GuildInvites = Backbone.Collection.extend({
		model: App.Models.GuildInvite,
		url: "/guild_invites/users_invites/",
		initialize: function () {
			this.url += current_user.id
		}
	})

	// -----------------------------------------
	//  GUILD      		GUILD CARD VIEW
	// -----------------------------------------
	App.Views.UserGuild = Backbone.View.extend({
		template: _.template($("#UserGuildTemplate").html()),
		template_none: _.template($("#UserNoGuildTemplate").html()),
		initialize: function (data) {
			this.model = data.model
			this.invitesCollection = data.invitesCollection
		},
		events: {
			'click #UserInfoInviteBtn': 'inviteUser',
		},
		render: function () {
			if (this.model.guild_id) {
				fetch(("/guilds/get_guild/" + this.model.guild_id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind(res => {
						var template = this.template(res);
						this.$el.html(template);
						$("#UserGuild").html(this.el)
						this.drawInviteBtn()
						this.drawInvitesList()
					}, this))
			}
			else {
				var template = this.template_none()
				this.$el.html(template)
				$("#UserGuild").html(this.el)
				if (current_user.id == this.model.id)
					$("#inviteGuildBtn").css({ "display": "none" })
				else {
					$("#guildInfo").css({ "display": "none" })
					this.drawInviteBtn()
				}
				this.drawInvitesList()
			}
		},
		drawInviteBtn: function () {
			if ((current_user.id != this.model.id) &&
				(current_user.guild_id) &&
				(current_user.guild_id != this.model.guild_id)) {
				$("#inviteGuildBtn").css({ 'display': 'block' })
			}
			else
				$("#inviteGuildBtn").css({ "display": "none" })
		},
		inviteUser: function () {
			fetch(('/guild_invites/invite_to_guild/' + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind(function (res) {
					alert('You succesfully invited ' + this.model.nickname + ' to your guild!')
				}, this))
				.catch(() => {
					alert('Some error accured!')
				})
		},
		drawInvitesList: function () {
			if (current_user.id != this.model.id) {
				$("#accordionFlushGuild").css({ "display": "none" })
				$("#UserGuildCard").css({ 'border-bottom': '0px solid rgba(0, 0, 0, 0.125)' })
			}
			else {
				this.invitesCollection.fetch()
					.then(_.bind(function () {
						this.drawCollection()
					}, this))
			}
		},
		drawCollection: function () {
			if (this.invitesCollection.length != 0) {
				this.invitesCollection.each(this.addOne, this)
			}
			else {
				$("#accordionFlushGuild").css({ 'display': 'none' })
				$("#UserGuildCard").css({ 'border-bottom': '0px solid rgba(0, 0, 0, 0.125)' })
			}
		},
		addOne: function (invite) {
			icon = new App.Views.UserGuildInvite({ model: invite, guildView: this })
			icon.render()
			$("#UserGuildInvites").append(icon.el);
		}
	})

	// -----------------------------------------
	//  GUILD_INVITES      MODEL VIEW
	// -----------------------------------------

	App.Views.UserGuildInvite = Backbone.View.extend({
		template_list: _.template($("#GuildInviteTemplate").html()),
		tagName: 'div',
		className: 'row GuildInvitesList',
		initialize: function (data) {
			this.model = data.model;
			this.guildView = data.guildView;
		},
		events: {
			'click #AcceptGuildInvitationBtn': 'AcceptInvitation',
			'click #DeclineGuildInvitationBtn': 'DeclineInvitation'
		},
		render: function () {
			var template_list = this.template_list(this.model.attributes);
			this.$el.html(template_list);
		},
		AcceptInvitation: function () {
			if (current_user.guild_id) {
				if (confirm("You are already in guild. Are you sure that you want change the guild?")) {
					fetch("/guilds/exit", {
						method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(this.model)
					})
					.then(_.bind(() => {
						this.AcceptInvitationRequest()
					}, this))
				}
			}
			else
				this.AcceptInvitationRequest()
		},
		AcceptInvitationRequest: function () {
			fetch(('/guild_invites/accept_invitation/' + this.model.get('id')))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					alert('You accepted invitation!');
					this.$el.remove();
					current_user.guild_id = this.model.attributes.guild.id
					this.guildView.render()
				}, this))
				.catch(function (res) {
					alert("Error accured! Try again!")
				})
		},
		DeclineInvitation: function () {
			fetch(('/guild_invites/decline_invitation/' + this.model.get('id')))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					this.$el.remove();
				}, this))
				.catch(function (res) {
					alert("Error accured! Try again!")
				})
		}
	})


// ---------------------------------------------------------------------------------------------------------------------------
//                                             P R O F I L E      I N F O
// ---------------------------------------------------------------------------------------------------------------------------

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
			block_button = new App.Views.UserBlockBtn({ model: this.model, btns: button})
			block_button.render()
		}
	})

	// -----------------------------------------
	//  USER        INFO BUTTONS VIEW
	// -----------------------------------------
	App.Views.UserBlockBtn = Backbone.View.extend({
		template:		_.template($("#UserInfoBtnTemplate").html()),
		adm_template:	_.template($("#UserInfoAdminBtnTemplate").html()),
		initialize: function (data) {
			this.model = data.model
			this.btns = data.btns
		},
		events: {
			'click #UserInfoBlockBtn':			'blockUser',
			'click #UserInfoUnblockBtn':		'unblockUser',

			'click #UserInfoBanBtn': 			'banUser',
			'click #UserInfoUnbanBtn': 			'unbanUser',

			'click #UserInfoDoModeratorBtn': 	'doModeratorUser',
			'click #UserInfoUndoModeratorBtn': 	'undoModeratorUser',
		},
		render: function () {
			this.$el.html("")
			if (current_user.id != this.model.id) {
				if (!this.model.is_admin) {
					if ((current_user.is_admin == true || current_user.is_moderator == true) && !this.model.is_banned)
						this.$el.html(this.adm_template({ btn_title: "Ban", btn_text: "Ban user" }));
					else if ((current_user.is_admin == true || current_user.is_moderator == true) && this.model.is_banned)
						this.$el.html(this.adm_template({ btn_title: "Unban", btn_text: "Unban user" }));
					if (current_user.is_admin == true && !this.model.is_moderator)
						this.$el.append(this.adm_template({ btn_title: "DoModerator", btn_text: "Do moderator" }));
					else if (current_user.is_admin == true && this.model.is_moderator)
						this.$el.append(this.adm_template({ btn_title: "UndoModerator", btn_text: "Undo moderator" }));
				}
				fetch(('/blocklists/is_blocked/' + this.model.id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind(function (res) {
						if (res == 0)
							this.$el.append(this.template({ btn_title: "Block", btn_text: "Block user" }));
						else if (res == 1)
							this.$el.append(this.template({ btn_title: "Unblock", btn_text: "Unblock user" }));
					}, this))
				$('#BlockUnblockUser').html(this.el)
			}
			else
				$("#LastBlockUserInfo").css({'display': 'none'})
		},
		blockUser: function () {
			fetch(('/blocklists/block_user/' + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					if (res == 1)
						alert('You blocked ' + this.model.nickname + '! Now he/she cannot send you messages!')
					this.render()
				}, this))
				.catch(() => alert('some error'));
		},
		unblockUser: function () {
			fetch(('/blocklists/unblock_user_by_id/' + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind((res) => {
					if (res == 1)
						alert('You unblocked ' + this.model.nickname + '!')
					this.render()
				}, this))
				.catch(() => alert('some error'));
		},
		banUser: function () {
			if (current_user.is_admin == true || current_user.is_moderator == true) {
				fetch(("/profile/ban_user/" + this.model.id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind((res) => {
						if (res == 1)
							alert('You banned ' + this.model.nickname + ' :(')
						else
							alert(res)
						this.model.is_banned = true;
						this.render()
						this.btns.render()
					}, this))
					.catch(() => alert('some error'));
			}
			else
				alert("You don't have a permission!")
		},
		unbanUser: function () {
			if (current_user.is_admin == true || current_user.is_moderator == true) {
				fetch(("/profile/unban_user/" + this.model.id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind((res) => {
						if (res == 1)
							alert('You unbanned ' + this.model.nickname + ' :)')
						else
							alert(res)
						this.model.is_banned = false;
						this.render()
						this.btns.render()
					}, this))
					.catch(() => alert('some error'));
			}
			else
				alert("You don't have a permission!")
		},
		doModeratorUser: function () {
			if (current_user.is_admin == true) {
				fetch(("/profile/do_moderator_user/" + this.model.id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind((res) => {
						if (res == 1)
							alert(this.model.nickname + ' is now a moderator! :)')
						else
							alert(res)
						this.model.is_moderator = true;
						this.render()
						this.btns.render()
					}, this))
					.catch(() => alert('Some error accured!'));
			}
			else
				alert("You don't have a permission!")
		},
		undoModeratorUser: function () {
			if (current_user.is_admin == true) {
				fetch(("/profile/undo_moderator_user/" + this.model.id))
					.then(res => res.ok ? res.json() : Promise.reject(res))
					.then(_.bind((res) => {
						if (res == 1)
							alert(this.model.nickname + ' is not a moderator anymore!')
						else
							alert(res)
						this.model.is_moderator = false;
						this.render()
						this.btns.render()
					}, this))
					.catch(() => alert('Some error accured!'));
			}
			else
				alert("You don't have a permission!")
		}
	})

	App.Views.UserInfoBtn = Backbone.View.extend({
		id: 'UserButtons',

		template:				_.template($("#UserInfoBtnTemplate").html()),
		templateEditBtn:		_.template($("#UserInfoEditBtnTemplate").html()),
		templateBannedStatus:	_.template($("#UserInfoBannedStatusTemplate").html()),

		events: {
			'click #UserInfoAddBtn':		'addFriend',
			'click #UserInfoDelBtn':		'deleteFriend',
			'click #UserInfoUnfollowBtn': 	'unfollowUser',
			'click #UserInfoFollowBackBtn': 'followBackUser',
			'click #UserInfoSendBtn':		'sendMessage',
			'click #UserInfoInviteBtn':		'inviteToGame'
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
		sendMessage: function () {
			fetch("/rooms/create", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: this.model.nickname, password: "" })
			})
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind(function (res) {
					window.location.href = "/rooms/" + res.id
				}, this))
				.catch(() => alert('some error'));
		},
		inviteToGame: function () {
			let match = { player2: usr_id }
			fetch("/new_match_profile/" + usr_id + ".json")
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else
					Turbolinks.visit("/matches/" + res.id);
			}, this))
		},
		drawBtn: function () {
			fetch(("/friends/is_friend/" + this.model.id))
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(_.bind(function (res) {
					if (this.model.is_banned)
						this.$el.html(this.templateBannedStatus);
					else
						this.$el.html("");
					this.$el.append(this.template({ btn_title: "Send", btn_text: "SEND MESSAGE" }));
					this.$el.append(this.template({ btn_title: "Invite", btn_text: "INVITE TO GAME" }));
					if (res == 0 && !this.model.is_banned)
						this.$el.append(this.template({ btn_title: "Add", btn_text: "ADD TO FRIENDS" }))
					else if (res == 1)
						this.$el.append(this.template({ btn_title: "Del", btn_text: "REMOVE FROM FRIENDS" }))
					else if (res == 2)
						this.$el.append(this.template({ btn_title: "Unfollow", btn_text: "UNFOLLOW" }))
					else if (!this.model.is_banned)
						this.$el.append(this.template({ btn_title: "FollowBack", btn_text: "FOLLOW BACK" }))
				}, this))
		}
	})



// ---------------------------------------------------------------------------------------------------------------------------
//                                                   M A T C H E S
// ---------------------------------------------------------------------------------------------------------------------------

	App.Models.UserMatches = Backbone.Model.extend({
		urlRoot: '/matches/users_matches/',
		initialize: function () {
			this.url += usr_id
		}
	})

	App.Collections.UserMatches = Backbone.Collection.extend({
		url: '/matches/users_matches/',
		initialize: function () {
			this.url += usr_id
			this.fetch()
		}
	})

	// -----------------------------------------
	//  USER      		MATCHES CARD VIEW
	// -----------------------------------------
	App.Views.UserMatches = Backbone.View.extend({
		template: _.template($("#UserMatchesTemplate").html()),
		initialize: function (data) {
			this.user = data.user
			this.collection = data.collection

			this.collection.on('sync', this.render, this)
		},
		render: function () {
			var template = this.template();
			$("#UserMatches").html(template)

			this.n = 0
			if (this.collection.length <= 3) {
				$("#accordionFlushMatches").css({ 'display': 'none' })
				$("#MatchesCard").css({ 'border-bottom': '0px' })
				if (this.collection.length == 0)
					$("#MacthesList").html("No matches yet")
			}
			this.collection.each(this.addOne, this)
			return this
		},
		addOne: function (match) {
			if (this.n <= 4) {
				var row = new App.Views.UserMatch({ model: match });
				$("#MacthesList").append(row.render().el)
				this.n += 1
			}
			else {
				var row = new App.Views.UserMatch({ model: match });
				$("#MacthesListAll").append(row.render().el)
				this.n += 1
			}
		}
	})

	App.Views.UserMatch = Backbone.View.extend({
		template: _.template($("#MatchesRowTemplate").html()),
		className: 'row',
		render: function () {
			this.model.attributes.status = "future"
			if (this.model.attributes.is_end)
				this.model.attributes.status = "end"
			else if (this.model.attributes.is_inprogress)
				this.model.attributes.status = "now"
			this.$el.html(this.template(this.model.attributes))
			return this;
		},
	});

//------------------------------------------------------------------------
//	CHANGE ONLINE STATUS
//------------------------------------------------------------------------
	var OnlineUsersModel = Backbone.Model.extend({ urlRoot: "/users/online" });
	var OnlineUsersCollection = Backbone.Collection.extend({
		url: "/users/online",
		model: OnlineUsersModel,
		initialize: function(current_user_id, profile_id) {
			_.bindAll(this, 'online');
			this.profile_id = profile_id;
			this.current_user_id = current_user_id;
			this.fetch({
				success: () => { this.online(); }
			})
		},
		online: function() {
			this.each((friend) => {
				$(`#ProfileOnlineStatus${this.current_user_id}`).css("color", "#0ec82d");
				$(`#ProfileOnlineStatus${this.current_user_id}`).html("online");
				
				$(`#FriendOnlineStatus${friend.get("id")}`).css("background", "#0ec82d")
				
				if (friend.get("id") == this.profile_id) {
					$(`#ProfileOnlineStatus${this.profile_id}`).css("color", "#0ec82d");
					$(`#ProfileOnlineStatus${this.profile_id}`).html("online");
				}
			})
		}
	});

// ---------------------------------------------------------------------------------------------------------------------------
//                                                    M A I N
// ---------------------------------------------------------------------------------------------------------------------------

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

			InvitesCollection = new App.Collections.GuildInvites()
			UserGuildView = new App.Views.UserGuild({ model: user, invitesCollection: InvitesCollection })
			UserGuildView.render()

			UserMatches = new App.Collections.UserMatches
			UserMatchesView = new App.Views.UserMatches({ user: user, collection: UserMatches })
			UserMatchesView.render()

			if (user.id == current_user.id) {
				UserBlocklist = new App.Collections.Blocklist()
				UserBlocklistView = new App.Views.UserBlocklist({ collection: UserBlocklist })
			}
			setTimeout( () => { new OnlineUsersCollection(current_user.id, user_id)}, 1500);
		}
		else
			$(".content").html("<h3>You account was blocked by administrator</h3>")
	}
}());

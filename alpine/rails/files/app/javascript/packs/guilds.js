/*
** -------------------------------------------------------
** VIEWS of all guilds: (App.Views.)
**   - Guilds
**
** VIEWS of a single guild: (App.Views.)
**   - AllGuildViews:
**        - GuildListEl
**        - GuildCard
**        - GuildCardBtn
**        - GuildMemberList
** -------------------------------------------------------
*/


$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	App.Views.AllGuildViews = Backbone.View.extend({
		initialize: function (data) {
			this.newGuildListEl(data);
			this.newGuildCard(data);
			this.guild_id = data.model.id;
			this.guild = data.model;
		},
		newGuildListEl: function (data) {
			this.GuildListEl = new App.Views.GuildListEl({ model: data.model, view: this });
		},
		newGuildCard: function (data) {
			this.GuildCard = new App.Views.GuildCard({ model: data.model, view: this });
		},
		newGuildCardBtn: function (data) {
			this.GuildCardBtn = new App.Views.GuildCardBtn({ model: data.model, view: this });
		},
		newGuildMemberList: function (data) {
			this.MemberCol = new App.Collections.GuildMember({ guild: data.model.id })
			this.GuildMemberList = new App.Views.GuildMembers({ collection: this.MemberCol, view: this })
		},
		newGuildOfficerList: function (data) {
			col = new App.Collections.GuildMember({ guild: data.model.id })
			this.GuildOfficerList = new App.Views.GuildOfficers({ collection: col, view: this })
		}
	})

	// ------------------------------------
	// GUILD      MODEL and COLLECTION
	// ------------------------------------
	App.Models.Guild = Backbone.Model.extend({
		urlRoot: "/guilds",
		initialize: function (curr_guild) {
			this.id = curr_guild.id;
			this.name = curr_guild.name;
			this.logo = curr_guild.logo;
			this.anagram = curr_guild.anagram;
			this.score = curr_guild.score;
			this.owner_id = curr_guild.owner_id;
			this.created_at = curr_guild.created_at;
			this.updated_at = curr_guild.updated_at;
			this.rating = curr_guild.rating;
		}
	});

	App.Collections.Guild = Backbone.Collection.extend({
		model: App.Models.Guild,
		url: "/guilds",
		initialize: function () {
			this.fetch();
		}
	});
	

	// -----------------------------------------
	// GUILD_MEMBERS     MODEL and COLLECTION
	// -----------------------------------------
	App.Models.GuildMember = Backbone.Model.extend({
		urlRoot: "/get_guild_users",
		initialize: function (user) {
			this.nickname = user.nickname;
			this.avatar = user.avatar;
			this.is_officer = user.is_officer;
		}
	})

	App.Collections.GuildMember = Backbone.Collection.extend({
		model: App.Models.GuildMember,
		url: "/get_guild_users",
		initialize: function (data) {
			this.url += ('/' + data.guild)
			this.fetch();
		}
	})


	// -----------------------------------------
	// GUILD_MEMBERS          COLLECTION VIEW
	// -----------------------------------------
	App.Views.GuildMembers = Backbone.View.extend({
		className: 'list-group',
		initialize: function (data) {
			this.collection = data.collection;
			this.view = data.view;

			this.collection.on('add', this.addOne, this);
			this.collection.on('sync', this.render, this);
			this.collection.on('change', this.addOne, this);
		},
		render: function () {
			this.$el.html("")
			this.collection.each(this.addOne, this);
			$('#GuildContent').html(this.el);
			return this;
		},
		addOne: function (user) {
			if (user.nickname) {
				var userView = new App.Views.GuildMember({ model: user });
				this.$el.append(userView.render().el);
				if ((curr_user.is_admin == true || curr_user.is_moderator == true)
					|| (curr_user.is_officer && this.view.guild_id == curr_user.guild_id)
					|| curr_user.id == this.view.guild.owner_id) {
					var userViewBtn = new App.Views.GuildMemberBtn({ model: user, view: this.view, parent: this});
					this.$el.append(userViewBtn.render().el);
				}
			}
		}
	})


	// -----------------------------------------
	// GUILD_OFFICERS         COLLECTION VIEW
	// -----------------------------------------
	App.Views.GuildOfficers = Backbone.View.extend({
		className: 'list-group',
		initialize: function (data) {
			this.collection = data.collection;
			this.view = data.view;

			this.collection.on('add', this.addOne, this);
			this.collection.on('change', this.addOne, this);
			this.collection.on('sync', this.render, this);
		},
		render: function () {
			this.$el.html("")
			console.log('render')
			this.collection.each(this.addOne, this);
			$('#GuildContent').html(this.el);
			return this;
		},
		addOne: function (user) {
			if (user.nickname && user.is_officer) {
				var userView = new App.Views.GuildMember({ model: user });
				this.$el.append(userView.render().el);
				if ((curr_user.is_admin == true || curr_user.is_moderator == true)
					|| curr_user.id == this.view.guild.owner_id) {
					var userViewBtn = new App.Views.GuildMemberBtn({ model: user, view: this.view, parent: this});
					this.$el.append(userViewBtn.render().el);
				}
			}
		}
	})


	// -----------------------------------------
	// GUILD_MEMBERS          MODEL VIEW
	// -----------------------------------------
	App.Views.GuildMember = Backbone.View.extend({
		tagName: 'a',
		className: 'list-group-item',
		templateList: _.template($("#GuildMemberListTemplate").html()),

		initialize: function () {
			this.model.on('destroy', this.remove, this);
		},
		render: function () {
			this.$el.attr({ 'href': ("/profile/" + this.model.id) });
			var template = this.templateList(this.model);
			this.$el.append(template);
			
			return this;
		},
		remove: function () {
			this.$el.remove();
		}
	})

	App.Views.GuildMemberBtn = Backbone.View.extend({
		tagName: 'div',
		className: 'list-group-item',

		template_exit:		_.template($("#AdminExitMemberBtnTemplate").html()),
		template_officer:	_.template($("#AdminDoOfficerBtnTemplate").html()),
		template_unofficer: _.template($("#AdminUndoOfficerBtnTemplate").html()),
		template_owner:		_.template($("#AdminDoOwnerBtnTemplate").html()),

		initialize: function (data) {
			this.model = data.model
			this.view = data.view
			this.parent = data.parent

			this.model.on('destroy', this.remove, this);
			this.model.on('sync', this.render, this);
		},
		events: {
			'click #AdminExitMember':	'exitMember',
			'click #AdminDoOfficer':	'doOfficer',
			'click #AdminUndoOfficer':	'undoOfficer',
			'click #AdminDoOwner':		'doOwner'
		},
		render: function () {
			this.$el.html("")
			this.$el.attr({ 'style': 'text-align: center;' });

			if ((curr_user.is_admin == true || curr_user.is_moderator == true) ||
				curr_user.id == this.view.guild.owner_id)
				var role = 'owner-admin'
			else if (curr_user.is_officer == true && curr_user.guild_id == this.view.guild_id)
				var role = 'officer'

			if ((role == 'owner-admin'
				|| (role == 'officer' && this.model.is_officer == false && this.model.id != this.model.attributes.guild.owner_id))
				&& this.model.id != curr_user.id) {
				var template_exit = this.template_exit(this.model);
				this.$el.append(template_exit);
			}

			if (this.model.is_officer != true) {
				var template_officer = this.template_officer(this.model);
				this.$el.append(template_officer);
			}
			else if (role == 'owner-admin'
					|| (role == 'officer' && this.model.id == curr_user.id)) {
				var template_unofficer = this.template_unofficer(this.model);
				this.$el.append(template_unofficer);
			}

			if (this.model.id != this.model.attributes.guild.owner_id && role == 'owner-admin') {
				var template_owner = this.template_owner(this.model);
				this.$el.append(template_owner);
			}

			return this;
		},
		exitMember: function () {
			fetch("/guilds/exit_user/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(res => {
				alert('Success! User ' + this.model.nickname + ' removed from guild!')
				if (res != 0) {
					this.view.GuildCard.render()
					this.parent.collection.fetch()
				}
				else {
					$(this.parent.el).html("")
					this.view.GuildCard.model.destroy()
				}
			}, this))
			.catch(() => alert("You are not able to do that"))
		},
		undoOfficer: function () {
			fetch("/guilds/undo_officer/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(res => {
				alert('Success! User ' + this.model.nickname + ' is not an officer anymore!')
				this.model.is_officer = false
				// this.view.GuildCard.render()
				this.render()
				// window.location.reload()
			}, this))
			.catch(() => alert("You are not able to do that"))
		},
		doOfficer: function () {
			fetch("/guilds/do_officer/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(res => {
				alert('Success! User ' + this.model.nickname + ' became an officer!')
				this.model.is_officer = true
				// this.view.GuildCard.render()
				this.render()
				// window.location.reload()
			}, this))
			.catch(() => alert("You are not able to do that"))
		},
		doOwner: function () {
			fetch("/guilds/do_owner/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(res => {
				alert('Success! User ' + this.model.nickname + ' became an owner!')
				this.model.attributes.guild.owner_id = this.model.id
				this.view.GuildCard.render()
				this.parent.collection.fetch()
				// this.view.MemberCol.fetch()
				this.render()
				// window.location.reload()
			}, this))
			.catch(() => alert("You are not able to do that"))
		},
		remove: function () {
			this.$el.remove();
		}
	})


	// -----------------------------------------
	// GUILD          MODEL LIST VIEW
	// -----------------------------------------
	App.Views.GuildListEl = Backbone.View.extend({
		tagName: 'a',
		className: 'list-group-item list-group-item-action',
		templateList: _.template($("#GuildListElTemplate").html()),

		initialize: function (data) {
			this.model = data.model;
			this.view = data.view;
			this.model.on('destroy', this.remove, this);
		},
		events: {
			'click #GuildNameList' : 'showCard'
		},
		render: function () {
			this.$el.attr({'data-bs-toggle': "list"});
			this.$el.css({ "padding": "0px" })
			if (curr_user.guild_id == this.model.id)
				this.$el.attr({ 'id': "usersguild" });
			var template = this.templateList(this.model);
			this.$el.append(template);

			return this;
		},
		remove: function () {
			this.$el.remove();
		},
		showCard: function () {
			$('#GuildContent').html("");
			this.view.GuildCard.render();
		}
	})


	// -----------------------------------------
	// GUILD          MODEL CARD VIEW
	// -----------------------------------------
	App.Views.GuildCard = Backbone.View.extend({
		templateCard: _.template($("#GuildCardTemplate").html()),

		initialize: function (data) {
			this.model = data.model;
			this.view = data.view;

			this.model.on('destroy', this.remove, this);
			this.model.on('change', this.render, this);
		},
		events: {
			'click #GuildCardMembers': 	'renderMemberList',
			'click #GuildCardOfficers': 'renderOfficerList',
			'click #GuildCardWars':		'renderWarList',
		},
		remove: function () {
			this.$el.remove();
		},
		render: function () {
			fetch("/get_owner_nick/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(owner => this.renderCard(owner), this))
			return this;
		},
		renderCard: function (owner) {
			window.current_guild_id = this.model.id;
			this.model.owner_nickname = owner.nickname;
			var template = this.templateCard(this.model);
			this.$el.html(template);
			$('#GuildCard').html(this.el);
			this.renderButtons();
		},
		renderButtons: function () {
			this.view.newGuildCardBtn({ model: this.model });
			this.view.GuildCardBtn.render();
		},
		renderMemberList: function () {
			if (!this.view.GuildMemberList) {
				this.view.newGuildMemberList({ model: this.model })
				this.view.GuildMemberList.render();
			}
			else {
				this.view.GuildMemberList.collection.fetch()
				.then(() => this.view.GuildMemberList.render())
			}
		},
		renderOfficerList: function () {
			if (!this.view.GuildOfficerList) {
				this.view.newGuildOfficerList({ model: this.model })
				this.view.GuildOfficerList.render();
			}
			else {
				this.view.GuildOfficerList.collection.fetch()
				.then(() => this.view.GuildOfficerList.render())
			}
		},
		renderWarList: function () {
			$('#GuildContent').html("");
		}
	})


	// -----------------------------------------
	// GUILD          MODEL CARD BUTTON VIEW
	// -----------------------------------------
	App.Views.GuildCardBtn = Backbone.View.extend({
		templateDeleteBtn: _.template($("#GuildDelBtnTemplate").html()),
		templateJoinBtn:   _.template($("#GuildJoinBtnTemplate").html()),
		templateLeaveBtn:  _.template($("#GuildLeaveBtnTemplate").html()),
		templateEditeBtn:  _.template($("#GuildEditBtnTemplate").html()),
		templateEdite:     _.template($("#GuildEditTemplate").html()),
		initialize: function (data) {
			this.model = data.model;
			this.view = data.view;
		},
		render: function () {
			if (curr_user.id == this.model.owner_id) {
				this.$el.html(this.templateEditeBtn)
				this.$el.append(this.templateLeaveBtn)
				this.$el.append(this.templateDeleteBtn)
			}
			else if (!curr_user.guild_id)
				this.$el.html(this.templateJoinBtn)
			else if (curr_user.guild_id == this.model.id)
				this.$el.html(this.templateLeaveBtn)
			else
				this.$el.html("")
			$('#GuildCardBtn').html(this.el);
		},
		events: {
			'click #DelGuildBtn':   'deleteGuild',
			'click #JoinGuildBtn':  'joinGuild',
			'click #LeaveGuildBtn': 'leaveGuild',
			'click #EditGuildBtn':  'editGuild',
		},
		deleteGuild: function () {
			alert("DELETE");
			var promise = this.model.destroy([], {
				dataType: "text"
			})
			$.when(promise).done(
				_.bind(function () {
					$('#GuildForm').css({ "display": "block" })
					$('#GuildContent').html("");
				}, this)
			);
			curr_user.guild_id = 0
		},
		joinGuild: function () {
			fetch("/guilds/join", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.model)
			})
			// .then(res => res.error ? Promise.reject(res) : res.json())
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(() => {
				alert('You joined guild ' + this.model.name + '!');
				curr_user.guild_id = this.model.id;
				this.render();
				$('#GuildForm').css({ "display": "none" });
				$('#GuildContent').html("");
				this.view.GuildListEl.$el.attr({ 'id': "usersguild" });
			}, this))
			return this;
		},
		leaveGuild: function () {
			fetch("/guilds/exit", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.model)
			})
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((response) => {
				alert('You left guild ' + this.model.name + '!');
				curr_user.guild_id = 0;
				if (response == 0)
					this.model.destroy();
				else {
					this.model.owner_id = response.id;
					this.render();
					this.view.GuildCard.render();
					this.view.GuildListEl.$el.attr({ 'id': "" });
				}
				$('#GuildForm').css({ "display": "block" });
				$('#GuildContent').html("");
			}, this))
			return this;
		},
		editGuild: function () {
			this.$el.html(this.templateEdite);
			$('#GuildContent').html(this.el);
			
		}
	})


	// -----------------------------------------
	// GUILD          COLLECTION VIEW
	// -----------------------------------------
	App.Views.Guilds = Backbone.View.extend({
		className: 'list-group',
		initialize: function () {
			this.collection.on('add', this.addOne, this);
			this.collection.on('change', this.addOne, this);
			this.render();
		},
		render: function () {
			this.collection.each(this.addOne, this);
			$('#GuildList').html(this.el);
			return this;
		},
		addOne: function (guild) {
			var guildView = new App.Views.AllGuildViews({ model: guild });
			this.$el.append(guildView.GuildListEl.render().el);
		}
	});


	// -----------------------------------------
	// FORM         CREATING GUILD FORM VIEW
	// -----------------------------------------
	App.Views.NewGuild = Backbone.View.extend({
		template: _.template($("#GuildFormTemplate").html()),
		events: {
			'submit': 'submit'
		},
		render: function () {
			this.$el.html(this.template) 
			$('#GuildForm').html(this.el);
		},
		submit: function (e) {
			e.preventDefault();
			let guild = {
				name: $(e.currentTarget).find('input[id=guildFormName]').val(),
				anagram: $(e.currentTarget).find('input[id=guildFormAnagram]').val()
			}
			new_guild = new App.Models.Guild(guild);

			var promise = new_guild.save([], {
				dataType: "text"
			})

			$.when(promise).done(
				_.bind(function (data) {
    				alert('success');
					this.collection.fetch()
					$('#GuildForm').css({ "display": "none" });
					$('#GuildCard').html("");
					$('#GuildContent').html("");
					curr_user.guild_id = new_guild.id
				}, this)
			);

			$.when(promise).fail(function (resp) {
				alert(resp.responseText);
			});
		},

	})


	// -----------------------------------------
	// MAIN
	// -----------------------------------------
	fetch("/get_curr_user")
	.then(res => res.ok ? res.json() : Promise.reject(res))
	.then(function(curr_user) {
		if (!curr_user.is_banned) {
			window.curr_user = curr_user;
			col = new App.Collections.Guild();
			form = new App.Views.NewGuild({ collection: col });
			form.render();
			guilds_view = new App.Views.Guilds({ collection: col });
		}
		else
			$(".content").html("<h3>You account was blocked by administrator</h3>")
	})	
}());

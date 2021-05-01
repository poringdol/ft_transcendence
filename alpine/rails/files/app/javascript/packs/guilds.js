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
// ** -------------------------------------------------------
*/

// const TOKEN = document.querySelector('meta[name="csrf-token"]').content;

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
			if (!this.MemberCol)
				this.MemberCol = new App.Collections.GuildMember({ guild: data.model.id })
			this.GuildMemberList = new App.Views.GuildMembers({ collection: this.MemberCol, view: this })
		},
		newGuildOfficerList: function (data) {
			if (!this.MemberCol)
				this.MemberCol = new App.Collections.GuildMember({ guild: data.model.id })
			this.GuildOfficerList = new App.Views.GuildOfficers({ collection: this.MemberCol, view: this })
		},
		newGuildWarList: function (data) {
			this.WarCol = new App.Collections.GuildWar({ guild: data.model.id })
			this.GuildWarList = new App.Views.GuildWars({ collection: this.WarCol, view: this, guild: data.model.id })
		}
	})

	// ------------------------------------
	// WAR      MODEL and COLLECTION
	// ------------------------------------
	App.Models.GuildWar = Backbone.Model.extend({
		urlRoot: "/wars/guild_wars/",
	});

	App.Collections.GuildWar = Backbone.Collection.extend({
		model: App.Models.GuildWar,
		url: "/wars/guild_wars/",
		initialize: function (data) {
			this.url += data.guild
			this.fetch();
		}
	});

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
				if ((curr_user.attributes.is_admin == true || curr_user.attributes.is_moderator == true)
					|| (curr_user.attributes.is_officer && this.view.guild_id == curr_user.attributes.guild_id)
					|| curr_user.attributes.id == this.view.guild.owner_id) {
					var userViewBtn = new App.Views.GuildMemberBtn({ model: user, view: this.view, parent: this});
					this.$el.append(userViewBtn.render().el);
				}
			}
		}
	})

	// -----------------------------------------
	// GUILD_WARS         COLLECTION VIEW
	// -----------------------------------------
	App.Views.GuildWars = Backbone.View.extend({
		template: _.template($("#GuildWarListHeaderTemplate").html()),
		className: 'list-group',
		initialize: function (data) {
			this.collection = data.collection;
			this.view = data.view;
			this.guild_id = data.guild

			this.collection.on('sync', this.render, this);
		},
		render: function () {
			this.$el.html(this.template())
			this.collection.each(this.addOne, this);
			$('#GuildContent').html(this.el);
			return this;
		},
		addOne: function (war) {
			// var warView = new App.Views.GuildWar({ model: war.attributes, guild_id: this.guild_id });
			// Обычному члену гильдии показываются только принятые войны
			if (war.attributes.is_accepted == true || curr_user.attributes.id == this.view.guild.owner_id ||
				(curr_user.attributes.is_officer == true && curr_user.attributes.guild_id == this.view.guild_id)) {
				// var warViewBtn = new App.Views.GuildWarBtn({ model: war, view: this.view, parent: this });
				var warView = new App.Views.GuildWar({ model: war.attributes, guild_id: this.guild_id });
				this.$el.append(warView.render().el);

				if (war.attributes.is_accepted == false &&
					(curr_user.attributes.id == this.view.guild.owner_id ||
						(curr_user.attributes.is_officer == true && curr_user.attributes.guild_id == this.view.guild_id))) {
					var warViewBtn = new App.Views.GuildWarBtn({ model: war, view: this.view, parent: this, warView: warView });
					this.$el.append(warViewBtn.render().el);
				}
			// }
			// if (war.attributes.is_accepted == false && (curr_user.attributes.id == this.view.guild.owner_id ||
			// 	(curr_user.attributes.is_officer == true && curr_user.attributes.guild_id == this.view.guild_id))) {
			// 	var warViewBtn = new App.Views.GuildWarBtn({ model: war, view: this.view, parent: this });
			// 	this.$el.append(warViewBtn.render().el);
			}
		}
	})

	// -----------------------------------------
	// GUILD_WARS          MODEL VIEW
	// -----------------------------------------
	App.Views.GuildWar = Backbone.View.extend({
		tagName: 'a',
		className: 'list-group-item',
		templateList: _.template($("#GuildWarListTemplate").html()),
		initialize: function (data) {
			this.model = data.model
			this.guild_id = data.guild_id
		},
		render: function () {
			// this.model.start_date = new Date(this.model.start).toUTCString()
			this.model.start_date = new Date(this.model.start)
			this.model.end_date = new Date(this.model.end)
			// console.log(this.model.start_date.day)
			if (this.model.guild1.id != this.guild_id)
				this.model.enemy = this.model.guild1
			else
				this.model.enemy = this.model.guild2
			this.$el.attr({ 'href': ("/wars/" + this.model.id) });
			var template = this.templateList(this.model);
			this.$el.append(template);

			return this;
		}
	})

	App.Views.GuildWarBtn = Backbone.View.extend({
		tagName: 'div',
		className: 'list-group-item',

		template_accept:	_.template($("#AcceptWarBtnTemplate").html()),
		template_decline:	_.template($("#DeclineWarBtnTemplate").html()),
		template_vaiting:	_.template($("#VaitingWarBtnTemplate").html()),

		initialize: function (data) {
			this.model = data.model
			this.view = data.view
			this.parent = data.parent
			this.warView = data.warView

			this.model.on('destroy', this.remove, this);
			this.model.on('sync', this.render, this);
		},
		events: {
			'click #AcceptWarBtn':	'acceptWar',
			'click #DeclineWarBtn':	'declineWar',
		},
		render: function () {
			this.$el.html("")
			this.$el.attr({ 'style': 'text-align: center;' });

			if (curr_user.attributes.id == this.view.guild.owner_id)
				var role = 'owner'
			else if (curr_user.attributes.is_officer == true && curr_user.attributes.guild_id == this.view.guild_id)
				var role = 'officer'

			if (role == 'owner' || role == 'officer') {
				if (this.model.attributes.is_accepted == false && this.model.attributes.guild1.id == this.view.guild_id)
					this.$el.append(this.template_vaiting);
				else {
					this.$el.append(this.template_accept);
					this.$el.append(this.template_decline);
				}
				// this.$el.append(this.template_accept);
				// this.$el.append(this.template_decline);
			}

			return this;
		},
		declineWar: function () {
			fetch("/wars/decline/" + this.model.id)
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else {
					alert('You successfully declined a war!')
					this.$el.remove();
					this.warView.$el.remove()
				}
			}, this))
		},
		acceptWar: function () {
			fetch("/wars/accept/" + this.model.id)
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else {
					alert('You successfully accepted a war!')
					this.$el.remove()
					// this.parent.render()
				}
			}, this))
		},
		remove: function () {
			this.$el.remove();
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
			this.collection.each(this.addOne, this);
			$('#GuildContent').html(this.el);
			return this;
		},
		addOne: function (user) {
			if (user.nickname && user.is_officer) {
				var userView = new App.Views.GuildMember({ model: user });
				this.$el.append(userView.render().el);
				if ((curr_user.attributes.is_admin == true || curr_user.attributes.is_moderator == true)
					|| curr_user.attributes.id == this.view.guild.owner_id) {
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

			if ((curr_user.attributes.is_admin == true || curr_user.attributes.is_moderator == true) ||
				curr_user.attributes.id == this.view.guild.owner_id)
				var role = 'owner-admin'
			else if (curr_user.attributes.is_officer == true && curr_user.attributes.guild_id == this.view.guild_id)
				var role = 'officer'

			if ((role == 'owner-admin'
				|| (role == 'officer' && this.model.is_officer == false && this.model.id != this.model.attributes.guild.owner_id))
				&& this.model.id != curr_user.attributes.id) {
				var template_exit = this.template_exit(this.model);
				this.$el.append(template_exit);
			}

			if (this.model.is_officer != true) {
				var template_officer = this.template_officer(this.model);
				this.$el.append(template_officer);
			}
			else if (role == 'owner-admin'
					|| (role == 'officer' && this.model.id == curr_user.attributes.id)) {
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
				curr_user.fetch()
				this.model.is_officer = false
				this.model.save()
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
				curr_user.fetch()
				this.model.is_officer = true
				this.model.save()
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
				curr_user.fetch()
				this.model.attributes.guild.owner_id = this.model.id
				this.view.guild.owner_id = this.model.id
				this.model.save()
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
			if (curr_user.attributes.guild_id == this.model.id)
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
				this.view.GuildMemberList.collection.fetch()
					.then(() => this.view.GuildMemberList.render())
			}
			else {
				this.view.GuildMemberList.collection.fetch()
				.then(() => this.view.GuildMemberList.render())
			}
		},
		renderOfficerList: function () {
			if (!this.view.GuildOfficerList) {
				this.view.newGuildOfficerList({ model: this.model })
				this.view.GuildOfficerList.collection.fetch()
					.then(() => this.view.GuildOfficerList.render())
			}
			else {
				this.view.GuildOfficerList.collection.fetch()
				.then(() => this.view.GuildOfficerList.render())
			}
		},
		renderWarList: function () {
			if (!this.view.GuildWarList)
				this.view.newGuildWarList({ model: this.model })
			else
				this.view.GuildWarList.collection.fetch()
				.then(() => this.view.GuildWarList.render())
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
		templateWarBtn:    _.template($("#GuildWarBtnTemplate").html()),

		initialize: function (data) {
			this.model = data.model;
			this.view = data.view;
		},
		render: function () {
			if (curr_user.attributes.id == this.model.owner_id) {
				this.$el.html(this.templateEditeBtn)
				this.$el.append(this.templateLeaveBtn)
				this.$el.append(this.templateDeleteBtn)
			}
			else if (!curr_user.attributes.guild_id)
				this.$el.html(this.templateJoinBtn)
			else if (curr_user.attributes.guild_id == this.model.id)
				this.$el.html(this.templateLeaveBtn)
			else if (curr_user.attributes.guild_id != this.model.id &&
					(curr_user.attributes.is_officer ||
					 curr_user.attributes.guild.owner_id == curr_user.attributes.id))
				this.$el.html(this.templateWarBtn)
			else
				this.$el.html("")
			$('#GuildCardBtn').html(this.el);
		},
		events: {
			'click #DelGuildBtn':   'deleteGuild',
			'click #JoinGuildBtn':  'joinGuild',
			'click #LeaveGuildBtn': 'leaveGuild',
			'click #EditGuildBtn':  'editGuild',
			'click #WarGuildBtn':   'warGuild',
		},
		deleteGuild: function () {
			// alert("DELETE");
			if (confirm('Are you sure you want to DELETE the guild?') == false)
				return;

			var promise = this.model.destroy([], {
				dataType: "text"
			})
			$.when(promise).done(
				_.bind(function () {
					$('#GuildForm').css({ "display": "block" })
					$('#GuildContent').html("");
				}, this)
			);
			curr_user.fetch()
			// curr_user.attributes.guild_id = null
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
				curr_user.attributes.guild_id = this.model.id;
				this.render();
				$('#GuildForm').css({ "display": "none" });
				$('#GuildContent').html("");
				this.view.GuildListEl.$el.attr({ 'id': "usersguild" });
				curr_user.fetch()
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
				curr_user.attributes.guild_id = null;
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
				curr_user.fetch()
			}, this))
			return this;
		},
		editGuild: function () {
			this.$el.html(this.templateEdite);
			$('#GuildContent').html(this.el);
		},
		warGuild: function () {
			warView = new App.Views.FormWar({ guild2: this.model.name })
			warView.render()
		}
	})


	App.Views.FormWar = Backbone.View.extend({

		template: _.template($("#WarCreateTemplate").html()),

		initialize: function (data) {
			this.guild2 = data.guild2
			this.$el.html(this.template())
			$("#GuildContent").html(this.el)
		},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			let war = {
				guild2:	this.guild2,
				date_start: $(e.currentTarget).find('input[id=formWarDateStart]').val(),
				time_start: $(e.currentTarget).find('input[id=formWarTimeStart]').val(),
				date_end:	$(e.currentTarget).find('input[id=formWarDateEnd]').val(),
				time_end:	$(e.currentTarget).find('input[id=formWarTimeEnd]').val(),
				addons:		$(e.currentTarget).find('input[id=formAddons]').val(),
				prize:		$(e.currentTarget).find('input[id=formPrize]').val(),
			}
			fetch("/wars", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(war)
			})
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
					else
						alert('You successfully sent an invitation to a war!')
				}, this))
		},
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
					curr_user.attributes.guild_id = new_guild.id
				}, this)
			);

			$.when(promise).fail(function (resp) {
				alert(resp.responseText);
			});
		},

	});

	App.Models.CurrentUser = Backbone.Model.extend({
		url: "/get_curr_user",
		initialize: function () {
			this.fetch()
		}
	})

	App.Views.Page = Backbone.View.extend({
		initialize: function (data) {
			this.curr_user = data.curr_user
			this.curr_user.on('sync', this.render(), this)
		},
		render: function () {
			window.curr_user = this.curr_user
			if (!this.curr_user.get("is_banned")) {
				col = new App.Collections.Guild();
				form = new App.Views.NewGuild({ collection: col });
				form.render();
				guilds_view = new App.Views.Guilds({ collection: col });
			}
			else
				$(".content").html("<h3>You account was blocked by administrator</h3>")
		}
	})

	// -----------------------------------------
	// MAIN
	// -----------------------------------------
	curr_user = new App.Models.CurrentUser()
	page = new App.Views.Page({ curr_user: curr_user })
}());

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
			col = new App.Collections.GuildMember({ guild: data.model.id })
			this.GuildMemberList = new App.Views.GuildMembers({ collection: col, view: this })
		}
	})

	// ------------------------------------
	// GUILD      MODEL and COLLECTION
	// ------------------------------------
	App.Models.Guild = Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/guilds',
		initialize: function (curr_guild) {
			this.id = curr_guild.id;
			this.name = curr_guild.name;
			this.guild_avatar = curr_guild.guild_avatar;
			this.anagram = curr_guild.anagram;
			this.score = curr_guild.score;
			this.owner_id = curr_guild.owner_id;
			this.created_at = curr_guild.created_at;
			this.updated_at = curr_guild.updated_at;
		}
	});

	App.Collections.Guild = Backbone.Collection.extend({
		model: App.Models.Guild,
		url: 'http://localhost:3000/guilds',
		initialize: function () {
			this.fetch();
		}
	});
	

	// -----------------------------------------
	// GUILD_MEMBERS     MODEL and COLLECTION
	// -----------------------------------------
	App.Models.GuildMember = Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/get_guild_users',
		initialize: function (user) {
			this.nickname = user.nickname;
			this.avatar = user.avatar;
		}
	})

	App.Collections.GuildMember = Backbone.Collection.extend({
		model: App.Models.GuildMember,
		url: 'http://localhost:3000/get_guild_users',
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
				var userView = new App.Views.GuildMember({ model: user});
				this.$el.append(userView.render().el);
			}
			
		}
	})


	// -----------------------------------------
	// GUILD_MEMBERS          MODEL VIEW
	// -----------------------------------------
	App.Views.GuildMember = Backbone.View.extend({
		tagName: 'a',
		className: 'list-group-item list-group-item-action',
		templateList: _.template($("#GuildMemberListTemplate").html()),

		initialize: function () {
			this.model.on('destroy', this.remove, this);
		},
		events: {
			// 'click #GuildNameList' : 'showCard'
		},
		render: function () {
			this.$el.attr({'data-bs-toggle': "list"});
			var template = this.templateList(this.model);
			this.$el.append(template);
			return this;
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
			console.log("________________________________");
			console.log(this.model);
			console.log("________________________________");
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
			'click #GuildCardWars':		'renderWarList'
		},
		remove: function () {
			this.$el.remove();
		},
		render: function () {
			fetch("http://localhost:3000/get_owner_nick/" + this.model.id)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind(owner => this.renderCard(owner), this))
			return this;
		},
		renderCard: function (owner) {
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
			$('#GuildContent').html("");
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
		initialize: function (data) {
			this.model = data.model;
			this.view = data.view;
		},
		render: function () {
			if (curr_user.id == this.model.owner_id) {
				this.$el.html(this.templateDeleteBtn)
				this.$el.append(this.templateLeaveBtn)
			}
			else if (curr_user.guild_id == 0)
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
			var promise = fetch("http://localhost:3000/guilds/join", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.model)
			})
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
			var promise = fetch("http://localhost:3000/guilds/exit", {
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
	fetch("http://localhost:3000/get_curr_user")
	.then(res => res.ok ? res.json() : Promise.reject(res))
	.then(function(curr_user) {
		window.curr_user = curr_user;
		col = new App.Collections.Guild();
		form = new App.Views.NewGuild({ collection: col });
		form.render();
		guilds_view = new App.Views.Guilds({ collection: col });
	})	
}());
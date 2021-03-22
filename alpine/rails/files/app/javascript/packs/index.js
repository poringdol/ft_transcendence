$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	App.Models.Guild = Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/guilds',
		initialize: function (curr_guild) {
			this.id = curr_guild.id;
			this.name = curr_guild.name;
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
	
	App.Views.GuildList = Backbone.View.extend({
		tagName: 'a',
		className: 'list-group-item list-group-item-action',
		templateList: _.template($("#GuildListTemplate").html()),

		initialize: function (data) {
			this.model = data.model;
			this.user_id = data.user_id;

			this.model.on('destroy', this.remove, this);
		},
		events: {
			'click #GuildNameList' : 'showCard'
		},
		render: function () {
			this.$el.attr({'data-bs-toggle': "list"});
			var template = this.templateList(this.model);
			this.$el.append(template);
			return this;
		},
		remove: function () {
			this.$el.remove();
		},
		showCard: function () {
			new App.Views.GuildCard({ model: this.model, user_id: this.user_id })
		}
	})

	App.Views.GuildCard = Backbone.View.extend({
		templateCard: _.template($("#GuildCardTemplate").html()),

		initialize: function (data) {
			this.model	 = data.model;
			this.user_id = data.user_id;

			this.model.on('destroy', this.remove, this);

			this.render();
		},
		remove: function () {
			this.$el.remove();
		},
		render: function () {
			var promise = fetch("http://localhost:3000/get_owner_nickname", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.model)
			})
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
			new App.Views.GuildCardBtn({ model: this.model })
		}
	})

	App.Views.GuildCardBtn = Backbone.View.extend({
		templateDeleteBtn: _.template($("#GuildDelBtnTemplate").html()),
		templateJoinBtn:   _.template($("#GuildJoinBtnTemplate").html()),
		templateLeaveBtn:  _.template($("#GuildLeaveBtnTemplate").html()),
		initialize: function () {
			this.render()
			console.log('here' + curr_user.guild_id)
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
			'click #DelGuildBtn':  'deleteGuild',
			'click #JoinGuildBtn': 'joinGuild',
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
			.then(_.bind(() => {
				alert('You left guild ' + this.model.name + '!');
				curr_user.guild_id = 0;
				this.render();
				$('#GuildForm').css({ "display": "block" });
			}, this))
			return this;
		}
	})

	App.Views.Guilds = Backbone.View.extend({
		className: 'list-group',
		initialize: function (data) {
			this.collection = data.collection;
			this.user_id = data.user_id;

			this.collection.on('add', this.addOne, this);
			this.collection.on('change', this.addOne, this);
			this.render();
		},
		render: function () {
			this.collection.each(this.addOne, this);
			$('#GuildList').append(this.el);
			return this;
		},
		addOne: function (guild) {
			var guildView = new App.Views.GuildList({ model: guild, user_id: this.user_id });
			this.$el.append(guildView.render().el);
		}
	});

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
	fetch("http://localhost:3000/get_curr_user")
	.then(res => res.ok ? res.json() : Promise.reject(res))
	.then(function(curr_user) {
		window.curr_user = curr_user;
		col = new App.Collections.Guild();
		form = new App.Views.NewGuild({ collection: col });
		form.render();
		guilds_view = new App.Views.Guilds( {collection: col, user_id: curr_user.id} );
	})	
}());
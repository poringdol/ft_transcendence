import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
	
	const KEYS = {	start_ball: 13,
					up: 87,
					down: 83,
					reset_ball: 128,
					visit_page: 129,
					leave_page: 130,
					goal: 131,
					end_game: 132,
					start_game: 133,
					update_state: 134, };
	const MAX_RATE = 7;
	const BRACKET_SPEED = 50;

	const match_element = $("#MatchID");
	const MATCH_ID = (match_element != null) ? parseInt(match_element.attr("data-MatchID")) : -1;

	let MATCH;
	let subscribe = 0;

	if (typeof MATCH_ID !== "undefined" && MATCH_ID > 0) {

		$("a").on("click", function () {

			if (typeof game !== "undefined" && typeof MATCH !== "undefined" && MATCH.player != 0) {

			}

		})
	}

	subscribe = consumer.subscriptions.create({ channel: "MatchChannel", match_id: MATCH_ID}, {

		connected() {
			if (MATCH_ID > 0) {
				console.log(`Connected to match ${MATCH_ID}`);

				//При подключении к каналу создаем модель матча (фетчим данные из бд), создаем вью, в которой стартуем игру
				MATCH = new App.Views.Match({ model: new App.Models.Match() });
			}
		},
			
		disconnected() {
			if (MATCH_ID > 0)
				console.log(`Disconnected from match ${MATCH_ID}`);
		},

		received(data) {

		},
	});

	//////////////////////////////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////////////////////////////////

	window.App = {
		Models: {},
		Views: {}
	};
	
	//  MATCH              MODEL
	App.Models.Match = Backbone.Model.extend({ url: `/matches/match_users/${MATCH_ID}` });

	App.Views.Match = Backbone.View.extend({
		start_template: _.template($("#GameStartTemplate").html()),
		profile1_template: _.template($("#MatchUser1ProfileTemplate").html()),
		profile2_template: _.template($("#MatchUser2ProfileTemplate").html()),
		result_template: _.template($("#MatchResultTemplate").html()),

		initialize: function () {
			this.player = 0;
	
			_.bindAll(this, "init");
			this.model.fetch({
				success: this.init
			})
		},

		init: function () {
			// 0 - наблюдатель, 1 или 2 - игрок
			this.player = (this.model.get("player1").id == this.model.get("current_user").id) ? 1 :
						  (this.model.get("player2").id == this.model.get("current_user").id) ? 2 : 0;
			
			if (this.player != 0) {
				this.model.set(`is_player${this.player}_online`, true);
				subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.visit_page, player: this.player });
			}
			if (this.model.get("is_player1_online") && this.model.get("is_player2_online")) {
				this.model.set("is_inprogress", true);
				console.log("in progress 5")
				subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.start_game });
			}
			this.model.save();
			this.render();
		},
	})
})
import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
	
	const KEYS = {start: 13, up: 87, down: 83};

	const match_element = $("#MatchID");
	const match_id = (match_element != null) ? match_element.attr("data-MatchID") : -1;

	consumer.subscriptions.create({ channel: "MatchChannel", match_id: match_id}, {
		connected() {
			$.post("/users/connected");
			if (match_id > 0)
				console.log("Connected to match " + match_id);
			},
			
		disconnected() {
			$.post("/users/disconnected");
			console.log("Disconnected from match " + match_id);
		},
		
		received(data) {
			// if (game.objects.bracket1.y != data.bracket1_pos) {
			// 	game.objects.bracket1.y = data.bracket1_pos
			// 	game.objects.bracket2.y = data.bracket2_pos
			// 	game.objects.ball = data.ball_pos
			// }
			let key_code = data.key_code;
			// W - up
			if(key_code == KEYS.up) {
				data.player == 1
				// ? game.objects.bracket1.y = parseInt(data.bracket)
				// : game.objects.bracket2.y = parseInt(data.bracket);
				? game.objects.bracket1.y = game.objects.bracket1.y - game.objects.bracket1.speed
        		: game.objects.bracket2.y = game.objects.bracket2.y - game.objects.bracket2.speed;
			} 
			// S - down
			if(key_code == KEYS.down) {
				data.player == 1
				// ? game.objects.bracket1.y = parseInt(data.bracket)
				// : game.objects.bracket2.y = parseInt(data.bracket);
				? game.objects.bracket1.y = game.objects.bracket1.y + game.objects.bracket1.speed
				: game.objects.bracket2.y = game.objects.bracket2.y + game.objects.bracket2.speed;
			}
			//Enter - пуск шарика
			if(key_code == KEYS.start) {
				game.kickBall();
			}
		},

		update() {
			this.documentIsActive ? $.post("/users/connected") : $.post("/users/disconnected");
		},

	});

})

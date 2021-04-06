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
      let kCode = data.key_code;
      // W - up
      if(kCode == KEYS.up) {
        data.player == 1 
          ? game.objects.bracket1.y = game.objects.bracket1.y - game.objects.bracket1.speed
          : game.objects.bracket2.y = game.objects.bracket2.y - game.objects.bracket2.speed;
      } 
      // S - down
      if(kCode == KEYS.down) {
        data.player == 1
          ? game.objects.bracket1.y = game.objects.bracket1.y + game.objects.bracket1.speed
          : game.objects.bracket2.y = game.objects.bracket2.y + game.objects.bracket2.speed;
      } 
      //R - рестарт игры
      if(kCode == 82) {
        game.restartGame();
      }
      //Enter - пуск шарика
      if(kCode == 13 && game.params.state === 'playerwait') {
        game.kickBall();
      }
    },

    update() {
      this.documentIsActive ? $.post("/users/connected") : $.post("/users/disconnected");
    },

  });

})

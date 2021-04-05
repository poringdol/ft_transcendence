import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
  
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
    },
    
    received(data) {
      console.log("Match " + data.match_id + ", Клавиша " + data.key_code);
      let kCode = data.key_code;

      if(kCode == 49) {
        game.objects.bracket1.y = game.objects.bracket1.y + game.objects.bracket1.speed;
      } 
      //2-вниз
      if(kCode == 50) {
        game.objects.bracket1.y = game.objects.bracket1.y - game.objects.bracket1.speed;
      } 
      //9-вверх 
      if(kCode == 57) {
        game.objects.bracket2.y = game.objects.bracket2.y + game.objects.bracket2.speed;
      } 
      //0-вниз
      if(kCode == 48) {
        game.objects.bracket2.y = game.objects.bracket2.y - game.objects.bracket2.speed;
      } 
      //E - рестарт шарика
      if(kCode == 69) {
        game.restartBall();
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

import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
  
  const match_element = $("#MatchID");
  const match_id = (match_element != null) ? match_element.attr("data-MatchID") : -1;

  consumer.subscriptions.create({ channel: "MatchChannel", match_id: match_id}, {
    connected() {
      $.get("/users/connected");
      if (match_id > 0)
        console.log("Connected to match " + match_id);
      },
      
    disconnected() {
      $.get("/users/disconnected");
    },
    
    received(data) {
      console.log(data);
    },

    update() {
      this.documentIsActive ? $.get("/users/connected") : $.get("/users/disconnected");
    },

  });

})

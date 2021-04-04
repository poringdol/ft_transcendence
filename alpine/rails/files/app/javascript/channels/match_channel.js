import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
  
  const match_element = $("#MatchID");
  const match_id = (match_element != null) ? match_element.attr("data-MatchID") : -1;

  consumer.subscriptions.create({ channel: "MatchChannel", match_id: match_id}, {
    connected() {
      if (match_id > 0)
        console.log("Connected to match " + match_id);
        $.get("/users/connected");
      },
      
    disconnected() {
      $.get("/users/disconnected");
    },
    
    received(data) {
      console.log(data);
    }
  });

})

import consumer from "./consumer"

consumer.subscriptions.create({ channel: "PingpongChannel" }, {
  connected() {
    console.log("Connected to pingpong");
  },
  
  disconnected() {
    // Called when the subscription has been terminated by the server
  },
  
  received(data) {
    console.log(data);
  }
});

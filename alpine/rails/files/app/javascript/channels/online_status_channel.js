import consumer from "./consumer"

consumer.subscriptions.create("OnlineStatusChannel", {

  connected() {
    this.perform("connected");
  },

  disconnected() {
    this.perform("disconnected");
  },

  received(data) {
  }
});

import consumer from "./consumer"

consumer.subscriptions.create("OnlineChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log(data)

    // console.log("-----------------------------")
    let online2 = $(`.OnlineStatus${data.id}`);
    if (data.status === "online")
      online2.prepend("online" )
    else
      online2.prepend("offline ")
    
    let online = document.querySelectorAll("#online")
    let el

    if (online != null) {
      for (let i = 0; i < online.length; i++) {
        el = online[i].querySelector(`[data-id="${data.id}"]`)
        if (el != null) {
          // console.log(el.dataset.id)
          // console.log(data.id)
          if (el.dataset.id == data.id) {
            if (data.status === "online") {
              // console.log("ONNNNN")
              online[i].innerHTML = data.html
            } else if (data.status === "offline") {
              // console.log("OFFFFF")
              online[i].innerHTML = data.html
            }
          }
        }
      }
      // console.log("++++++++++++++++++++++++++++++")
    }
  }
});

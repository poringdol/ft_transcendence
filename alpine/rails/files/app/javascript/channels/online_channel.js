import consumer from "./consumer"

consumer.subscriptions.create("OnlineChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    let online = document.querySelectorAll("#online")
    let el

    if (online != null) {
      for (let i = 0; i < online.length; i++) {
        el = online[i].querySelector(`[data-id="${data.id}"]`)
        if (el != null) {
          if (el.dataset.id == data.id) {
            online[i].innerHTML = data.html
          }
        }
      }
    }

    let online_friend = $(`#FriendOnlineStatus${data.id}`);
    let online_profile = $(`#ProfileOnlineStatus${data.id}`);
    if (data.status === "online") {
      online_friend.css("background", "#37d00a");
      online_profile.css("color", "#37d00a");
      online_profile.html("online");
    }
    else if (data.status === 'offline') {
      online_friend.css("background", "#d41e1e");
      online_profile.css("color", "#d41e1e");
      online_profile.html("offline");
    }
    else {
      online_friend.css("background", "#ff870a");
      online_profile.css("color", "#ff870a");
      online_profile.html("in game");
    }
  }
});

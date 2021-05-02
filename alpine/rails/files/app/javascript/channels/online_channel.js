import consumer from "./consumer"

consumer.subscriptions.create("OnlineChannel", {
  connected() {},

  disconnected() {},

  received(data) {
    
    let online = document.querySelectorAll("#online")
    let el

    if (online != null) {
      for (let i = 0; i < online.length; i++) {
        el = online[i].querySelector(`[data-id="${data.id}"]`)
        if (el != null) {
          if (el.dataset.id == data.id) {
            if (data.status === "online") {
              online[i].innerHTML = data.html
            } else if (data.status === "offline") {
              online[i].innerHTML = data.html
            }
          }
        }
      }
    }

    let online_friend = $(`#FriendOnlineStatus${data.id}`);
    let online_profile = $(`#ProfileOnlineStatus${data.id}`);
    if (data.status === "online") {
      online_friend.css("background", "#0ec82d");
      online_profile.css("color", "#0ec82d");
      online_profile.html("online");
    }
    else {
      online_friend.css("background", "#d10d0d");
      online_profile.css("color", "#d10d0d");
      online_profile.html("offline");
    }
  }
});

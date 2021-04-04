import consumer from "./consumer"

document.addEventListener('turbolinks:load', () => {
  
  const room_element = document.getElementById('room-id');
  const room_id = (room_element != null) ? room_element.getAttribute('data-room-id') : -1;

    // эта хрень не дает создавать новые подключения. Выяснить, зачем она была нужна
  // consumer.subscriptions.subscriptions.forEach((subscription) => {
  //   consumer.subscriptions.remove(subscription)
  // })

  consumer.subscriptions.create({ channel: "RoomChannel", room_id: room_id }, {
    connected() {
      if (room_id > 0)
        console.log("Connected to room " + room_id);
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      const user_element = document.getElementById('user-id');
      const user_id = Number(user_element.getAttribute('data-user-id'));

      let html;
      let blocked = [];

      fetch("/block_list")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(function(blocked_user) {

        for (var i = 0; blocked_user.length != i; i++) {
          blocked.push(blocked_user[i].blocked_user_id)
        }

        if (user_id === data.message.user_id) {
          html = data.mine;
          const messageContainer = document.getElementById('messages');
          messageContainer.innerHTML = messageContainer.innerHTML + html;
        } else if (blocked.includes(data.message.user_id) === false) {
          html = data.theirs;
          const messageContainer = document.getElementById('messages');
          messageContainer.innerHTML = messageContainer.innerHTML + html;
        }
      })
    }
  });
})

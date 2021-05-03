import consumer from "./consumer"

consumer.subscriptions.create("NotificationChannel", {
  connected() {},
  disconnected() {},
  received(data) {

    let emptyNotify = document.querySelector("#emptyNotify")
    if (emptyNotify) {
      emptyNotify.remove()
    }

    let notify = document.querySelector("#Notify")
    if (notify) {
      notify.insertAdjacentHTML("beforeend", data.html)
    }

    let nNotify = $("#N-Notify")
    if (nNotify) {
      nNotify.html(data.html2)
    }
  }
});

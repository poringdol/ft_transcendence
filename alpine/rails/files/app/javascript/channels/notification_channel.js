import consumer from "./consumer"

consumer.subscriptions.create("NotificationChannel", {
  connected() {},
  disconnected() {},
  received(data) {
    let notify = document.querySelector("#Notify")
    if (notify) {
      notify.insertAdjacentHTML('beforeend', data.html)
    }
    let count = $('#N-Notify')
    if (count) {
      count.html(data.html2)
    }
    // let count = $(`#N-Notify`);
    // if (count) {
    //   count.css("color", "#2fff2f");
    // }
  }
});

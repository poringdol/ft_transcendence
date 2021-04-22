import consumer from "./consumer"

consumer.subscriptions.create("NotificationChannel", {
  connected() {},
  disconnected() {},
  received(data) {
    let notify = document.querySelector("#Notify")
    // console.log("---------------------")
    // console.log(data)
    // console.log(notify)
    // console.log("---------------------")
    if (notify) {
      notify.insertAdjacentHTML('beforeend', data.html)
    }
    // let count = document.querySelector('#N-Notify')
    // if (count) {
    //   count.innerHTML = data.html2
    // }
    let count = $(`#N-Notify`);
    if (count) {
      count.css("color", "#2fff2f");
    }
  }
});

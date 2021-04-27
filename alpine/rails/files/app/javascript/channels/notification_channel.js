import consumer from "./consumer"

consumer.subscriptions.create("NotificationChannel", {
  connected() {},
  disconnected() {},
  received(data) {
    let notify = document.querySelector("#Notify")
    // console.log("---------------------")
    // console.log(data.html)
    // console.log("11111\n\n\n22222")
    // console.log(data.html2)
    // console.log(notify)
    // console.log("---------------------")
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

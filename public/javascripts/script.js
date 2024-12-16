// document.addEventListener("DOMContentLoaded", function() {
//     fetch('../html/navbar.html')
//       .then(response => response.text())
//       .then(html => {
//         const element = document.createElement("div");
//         element.innerHTML = html;
//         document.getElementById("navbar-container").appendChild(element);
//       })
//       .catch(err => console.error("Error loading the navbar:", err));
//   }); 
  $(function (){
    $.ajax({
        url: '/user/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        // getUserInfo();
        $('#rxData').html(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});

$(function(){
  $.ajax({
    url: '/user/getDevices',
    method: 'GET',
    headers: { 'x-auth' : window.localStorage.getItem("token") },
    dataType: 'json'
  })
  .done(function(data, textStatus, jqXHR){
    getUserInfo();

    localStorage.setItem("device", JSON.stringify(data.user[0].device));
    $('#rxData').html(JSON.stringify(data, null, 2));
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    window.location.replace("display.html");
});
})

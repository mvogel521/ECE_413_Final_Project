// public/javasciprts/account.js
$(function (){
    $.ajax({
        url: '/account/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        getUserInfo();
        $('#rxData').html(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});

function logout() {
    localStorage.removeItem("token");
    window.location.replace("index.html");
}

function getUserInfo(){
    const container = document.getElementById("deviceContent");
    container.innerHTML = "";

    const devices = JSON.parse(localStorage.getItem("device")) || [];

    if (devices.length > 0) {
        devices.forEach(device => {
            container.innerHTML += `<p>${device}</p>`;
        });
    } else {
        container.innerHTML = "<p>No devices found.</p>";
    }

    document.getElementById("email").placeholder = `E-mail: ${localStorage.getItem("email")}`;
}

function addDevice(){
    let device = $('#device').val();
    if (device == ""){
        window.alert("Enter the new device");
        return;
    }

    let txdata = {
        device: device
    }

    $.ajax({
        url: '/account/addDevice',
        method: 'POST',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done (function (data, textStatus, jqXHR){
        localStorage.setItem("device",  JSON.stringify(data.user.device) );
        getUserInfo();
    })
    .fail(function (jqXHR, textStatus, errorThrown){
        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        alert ('Failed to add new device, contact support.');
    })
}

$(function(){
    $('#btnLogOut').click(logout);
    $('#addDeviceBtn').click(addDevice);
})
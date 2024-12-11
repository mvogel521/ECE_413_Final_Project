// public/javasciprts/webstorage.js
function saveSessionStorage() {
    // data validation
    if ($('#email').val() === "") {
        window.alert("invalid email!");
        return;
    }
    if ($('#password').val() === "") {
        window.alert("invalid password!");
        return;
    }
    sessionStorage.setItem("email", $('#email').val());
    sessionStorage.setItem("device", $('#device').val());
    let msgStr = `Saved email (${sessionStorage.getItem("email")}) and device (${sessionStorage.getItem("device")}) in the session storage!`;
    $('#rxData').html(msgStr); 
}

function readSessionStorage() {
    if ('email' in sessionStorage) {
        $('#rxData').html(JSON.stringify(sessionStorage, null, 2)); 
    }
    else {
        $('#rxData').html("No saved name and major in the session storage!!!");     
    }
}

function saveLocalStorage() {
    // data validation
    if ($('#email').val() === "") {
        window.alert("invalid email!");
        return;
    }
    if ($('#password').val() === "") {
        window.alert("invalid password!");
        return;
    }
    let devices = [];
    devices.push($('#device').val());

    localStorage.setItem("email", $('#email').val());
    localStorage.setItem("device", JSON.stringify(devices));
    let msgStr = `Saved email (${localStorage.getItem("email")}) and device (${localStorage.getItem("device")}) in the local storage!`;
    $('#rxData').html(msgStr); 
}

function readLocalStorage() {
    if ('email' in localStorage) {
        $('#rxData').html(JSON.stringify(localStorage, null, 2)); 
    }
    else {
        $('#rxData').html("No saved name and major in the local storage!!!");     
    }
}

$(function () {
    $('#btnSaveSessionStorage').click(saveSessionStorage);
    $('#btnReadSessionStorage').click(readSessionStorage);
    $('#createUser').click(saveLocalStorage);
    $('#btnReadLocalStorage').click(readLocalStorage);
});
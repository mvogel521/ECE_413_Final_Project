function createUser(){
    //data validation
    let userEmail = $('#email').val();
    let userPassword = $('#password').val();
    let userDevice = $('#device').val();

    if(userEmail == ""){
        window.alert("Please enter your email!");
        return;
    }
    if(userPassword == ""){
        window.alert("Please enter your password!");
        return;
    }
    else if (!isStrongPassword(userPassword)){
        window.alert("Invalid Password.");
        return;
    }
    if(userDevice == ""){
        window.alert("Please enter your device!");
        return;
    }

    let txdata = {
        email: userEmail,
        password: userPassword,
        device: userDevice
    }

    $.ajax({
        url: '/user/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
        if (data.success){
            setTimeout(function (){
                window.location = "login.html";
            }, 1000);
        }
    })
    .fail(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
    }); 
}

function isStrongPassword(password){
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
    const hasNumber = /\d/.test(password);       // At least one digit
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("device");
    window.location.replace("../index.html");
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
        url: '/user/addDevice',
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
function loginUser(){
    let userEmail = $('#email').val();
    let userPassword = $('#password').val();

    if(userEmail == ""){
        window.alert("Please enter your email!");
        return;
    }
    if(userPassword == ""){
        window.alert("Please enter your password!");
        return;
    }

    let txdata = {
        email: userEmail,
        password: userPassword
    }

    $.ajax({
        url: '/user/logIn',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done (function (data, textStatus, jqXHR){
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", userEmail)
        window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {

        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        alert(`Login failed! Please check your credentials and try again. ${errorThrown}`);
    });
}


$(function(){
    $('#btnLogOut').click(logout);
    $('#addDeviceBtn').click(addDevice);
    $('#loginUser').click(loginUser);
    $('#createUser').click(createUser);
})


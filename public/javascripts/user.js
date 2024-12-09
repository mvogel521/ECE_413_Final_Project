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

$(function (){
    $('#createUser').click(createUser);
})
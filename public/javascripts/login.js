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
        window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        let errorMessage = jqXHR.responseJSON?.msg || jqXHR.responseText || "An unknown error occurred.";
        alert(`Login failed! ${errorMessage}`);

        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        alert(`Login failed! Please check your credentials and try again. ${errorThrown}`);
    });
}

$(function (){
    $('#loginUser').click(loginUser);
})

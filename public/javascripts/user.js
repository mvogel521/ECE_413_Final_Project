function createUser(){
    //data validation
    if($('#email').val() == ""){
        window.alert("Please enter your email!");
        console.log("No Email")
        return;
    }
    if($('#password').val() == ""){
        window.alert("Please enter your password!");
        console.log("No Pass");
        return;
    }
    else if (!isStrongPassword($('#password').val())){
        window.alert("Invalid Password.");
        return;
    }
    if($('#device').val() == ""){
        window.alert("Please enter your device!");
        return;
    }

    console.log("Done")
    
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
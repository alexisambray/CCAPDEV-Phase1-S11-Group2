/** FOR JQUERY UNRELATED TO NODEJS */

//variables
const urlParams = new URLSearchParams(window.location.search);

/* register + login */

//check if password and confirm password matches
$('#pwd, #pwdConfirm').keyup(function () {
    if ($('#pwd').val() == $('#pwdConfirm').val()) {
        $('#message').text('');
        $('#register-confirm').prop("disabled", false).css({'background-color': 'var(--blue)', 'color': 'white'});
    } else {
        $('#message').text('Passwords do NOT match').css('color', 'var(--orange)');
        $('#register-confirm').prop("disabled", true).css({'background-color': 'var(--lgrey)', 'color': 'var(--light)'});
    }
});

//alert if username/email already used
$('#regisAlert').hide();
const regParam = urlParams.get('error');
if(regParam == "usedcreds") {
    $('#regisAlert').show();
}

//alert if register success
$('#regpassAlert').hide();
const regpassParam = urlParams.get('reg');
if(regpassParam == "success") {
    $('#regpassAlert').show();
}

//alert if username/password incorrect
$('#loginAlert').hide();
const loginParam = urlParams.get('error');
if(loginParam == "wrongcreds") {
    $('#loginAlert').show();
}

//do not allow space in username
$('#username, #pwd, #pwdConfirm, #email').on('keypress', function(e) {
    if (e.which == 32){
        console.log('Space Detected');
        return false;
    }
});

/* view post */

//when button is clicked, change css + call js function
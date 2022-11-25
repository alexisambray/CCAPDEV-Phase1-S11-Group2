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

//do not allow whitespace
$('#username, #pwd, #pwdConfirm, #email').on('keypress', function(e) {
    if (e.which == 32){
        console.log('Space Detected');
        return false;
    }
});

/* create-post */

//do not allow whitespace only for location
$('#location').keyup(function () {
    if ($('#location').val().trim().length == 0) { //whitespace only
        $('#message').text('Location CANNOT be empty').css('color', 'var(--orange)');
        $('.save-container button').prop("disabled", true).css({'background-color': 'var(--lgrey)', 'color': 'var(--light)'});
    } else {
        $('#message').text('');
        $('.save-container button').prop("disabled", false).css({'background-color': 'var(--lime)', 'color': 'black'});
    }
});

//alert if invalid or no file
$('#invalidAlert').hide();
$('#nullAlert').hide();
const createParam = urlParams.get('error');
if(createParam == "invalid") {
    $('#invalidAlert').show();
}else if(createParam == "null") {
    $('#nullAlert').show();
}

/* search */

//do not allow whitespace only for search
$('#searchbar').keyup(function () {
    if ($('#searchbar').val().trim().length == 0) { //whitespace only
        $('#search-btn').prop("disabled", true);
    } else {
        $('#search-btn').prop("disabled", false);
    }
});
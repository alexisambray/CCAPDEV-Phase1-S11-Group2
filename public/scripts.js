/** FOR JQUERY */

/* register */

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

/* view post */

//when button is clicked, change css + call js function
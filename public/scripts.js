/** FOR JQUERY */

/* nav bar */

//change selected page
const btnIDs = ['nav-dashboard', 'nav-create', 'nav-profile', 'nav-bookmarks', 'nav-edit'];

function changePage(currPage){
    for(i = 0; i < btnIDs.length; i++){
        var pageID = "#" + btnIDs[i];

        if(currPage == btnIDs[i]){
            $(pageID).addClass("selected");
        }else{
            $(pageID).removeClass("selected");
        }
    }
}

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
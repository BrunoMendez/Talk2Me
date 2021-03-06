$('form a').click(function(event) {
    event.preventDefault();
    $(this).closest('form').attr('action', this.href).attr('method', 'post').submit();
});
let cont = 0;
var interval = setInterval(function() {
    fetch('/get-messages/' + id)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            for (let i = cont; i < responseJSON.messages.length; i++) {
                let message = responseJSON.messages[i];
                cont++;
                insertChat(message.isListener, message.message, message.name);
                setTimeout(function() { $("#message-list").scrollTop($("#message-list")[0].scrollHeight); }, 50);
            }
        })
        .catch(error => {
            insertChat(!isListener, "User left", "Admin");
            setTimeout(function() { window.location.reload(false); }, 3000);
            clearInterval(interval);
        });
}, 1000);

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//-- No use time. It is a javaScript effect.
function insertChat(isListener, text, senderName, time = 0) {
    var control = "";
    var date = formatAMPM(new Date());

    if (!isListener) {
        control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="text text-l">' +
            '<p class="name-in-msg-listener">' + senderName + '</p>' +
            '<p class="text-message">' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    } else {
        control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p class="name-in-msg-anon">' + senderName + '</p>' +
            '<p class="text-message">' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>' +
            '</li>';
    }
    setTimeout(
        function() {
            $("#message-list").append(control);

        }, time);

}

function resetChat() {
    $("#message-list").empty();
}

$(".mytext").on("keyup", function(e) {
    if (e.which == 13) {
        console.log(isListener);
        var text = $(this).val();
        if (text !== "") {

            let message = {
                name: name,
                message: text,
                isListener: isListener,
                time: new Date()
            }
            let settings = {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(message)
            }
            fetch('/add-message/' + id, settings);
            $(this).val(' ');
        }
    }
});
/*
//-- Clear Chat
resetChat();

//-- Print Messages
insertChat("me", "Hello Tom...", 0);
insertChat("you", "Hi, Pablo", 1500);
insertChat("me", "What would you like to talk about today?", 3500);
insertChat("you", "Tell me a joke",7000);
insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
insertChat("you", "LOL", 12000);
*/


//-- NOTE: No use time on insertChat.


function init() {
    let chatButton = $('#chatButton');
    let adminForm = $('#adminLogin');
    let listenerForm = $('#listenerLogin');

    chatButton.on("click", function (event) {
        event.preventDefault();
    });

    listenerForm.on("submit", function (event) {
        event.preventDefault();
    });

    adminForm.on("submit", function (event) {
        event.preventDefault();
    });
}

init();
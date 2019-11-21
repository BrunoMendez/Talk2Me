function init() {
    let listener = {
        listener: $("#name").html()
    }
    let settings = {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(listener)
    }
    $("#newChat").on("click", function(e) {
        e.preventDefault(); // cancel the link itself
        fetch(this.href, settings);
    });
}

init();
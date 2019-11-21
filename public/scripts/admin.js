function init() {
    let registerForm = $("#register-form");
    let deleteForm = $("#delete-form");

    registerForm.on("submit", event => {
        event.preventDefault();
        var userType = $('#btn-type-register label.active input').val();
        let isAdmin = userType == "1";
        //TODO: clean inputs
        let user = {
            email: $("#register_email").val(),
            password: $("#register_password").val(),
            firstName: $("#register_name").val(),
            lastName: $('#register_lastname').val()
        };
        let url = (isAdmin ? "/admin-register" : "/listener-register");
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(user)
        }
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJSON => {
                alert("Registrado!");
                $("#register_email").val('');
                $("#register_password").val('');
                $("#register_name").val('');
                $("#register_lastname").val('');
            })
            .catch(error => {
                alert("Algo salio mal!")
                $("#register_email").val('');
                $("#register_password").val('');
                $("#register_name").val('');
                $("#register_lastname").val('');
                console.log(error);
            });
    });

    deleteForm.on("submit", event => {
        console.log("@@@");
        event.preventDefault();
        var userType = $('#btn-type-delete label.active input').val();
        let isAdmin = userType == "1";
        let email = $("#delete_email").val()
        let url = (isAdmin ? "/delete-admin/" : "/delete-listener/") + email;
        console.log(url);
        fetch(url, { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJSON => {
                alert("Eliminado!");
                $("#delete_email").val('');
            })
            .catch(error => {
                alert("Algo salio mal");
                $("#delete_email").val('');
            });
    });

}

init();
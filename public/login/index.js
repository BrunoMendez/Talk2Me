let btnLogin = $("#btn-login");
let btnListener = $("#btn-listener");
let btnAdmin = $("#btn-admin");

function login(userIndex) {
  let isAdmin = userIndex == "1";
  let user = {
    email: $("#login_email").val(),
    password: $("#login_password").val(),
  }
  let url = (isAdmin ? "/admin-login" : "/listener-login");
  let settings = {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(user)
  }

  fetch(url, settings)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error (response.statusText);
    })
    .then(responseJSON => {
      let newUrl = (isAdmin ? "/admin-homepage" : "/listener-homepage");
      location.method = "get";
      location.href = newUrl;
    })
    .catch(error => {
      console.log(error);
    });
}

btnLogin.on("click", event => {
  event.preventDefault();
  var userType = $('#btn-type label.active input').val();
  login(userType);
});

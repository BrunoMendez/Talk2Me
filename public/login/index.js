let btnLogin = $("#btn-login");

function ajaxSettings(userIndex){
  let isAdmin = userIndex == "1";
  //TODO: clean inputs
  let user = {
    email: $("#login_email").val(),
    password: $("#login_password").val(),
  }
  let settings = {
    url: (isAdmin ? "/admin-login" : "/listener-login"),
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: (result) =>{
      if (isAdmin) {
        window.alert("TODO: Admin Login");
      }else{
        window.alert("TODO: Listener Login");
      }
    },
    error: (result) =>{
      window.alert("TODO: Login error")
    }
  }
  return settings;
}

btnLogin.on("click", event => {
  event.preventDefault();

  var userType = $('#btn-type label.active input').val();
  let settings = ajaxSettings(userType);
  $.ajax(settings);
});

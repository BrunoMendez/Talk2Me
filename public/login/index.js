let loginBtn = $("#btn-login");

loginBtn.on("click", event => {
  event.preventDefault();

  console.log("click");

  //TODO: validate/clean inputs
  let user = {
    username: $("#login_username").val(),
    password: $("#login_password").val(),
  }

  //POST porque es un login, GET muestra info
  $.ajax({
    url: "/login",
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: (result) =>{
      //TODO: depending in result value, goto chat or user edit page
      console.log(result);
    }
  });
});

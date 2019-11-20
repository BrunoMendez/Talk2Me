let btnRegister = $("#btn-register");
let btnDelete = $("#btn-delete");
console.log("wake up");

function ajaxSettingsRegister(userIndex){
  let isAdmin = userIndex == "1";
  //TODO: clean inputs
  let user = {
    email: $("#register_email").val(),
    password: $("#register_password").val(),
  };
  let settings = {
    url: (isAdmin ? "/admin-register" : "/listener-register"),
    method: "POST",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: (result) =>{
      if (isAdmin) {
        window.alert("TODO: Admin Register");
      }else{
        window.alert("TODO: Listener Register");
      }
    },
    error: (result) =>{
      window.alert("TODO: Register error")
    }};
  return settings;
}

function ajaxSettingsDelete(userIndex){
  let isAdmin = userIndex == "1";
  //TODO: clean inputs
  let user = {
    email: $("delete_email").val(),
  }
  let settings = {
    url: (isAdmin ? "/admin-delete" : "/listener-delete"),
    method: "DELETE",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: (result) =>{
      if (isAdmin) {
        window.alert("TODO: Admin Delete");
      }else{
        window.alert("TODO: Listener Delete");
      }
    },
    error: (result) =>{
      window.alert("TODO: Delete error")
    }};
  return settings;
}

btnRegister.on("click", event => {
  event.preventDefault();

  var userType = $('#btn-type-register label.active input').val();
  let settings = ajaxSettingsRegister(userType);
  $.ajax(settings);
});

btnDelete.on("click", event => {
  event.preventDefault();
  console.log("click");
  var userType = $('#btn-type-delete label.active input').val();
  let settings = ajaxSettingsDelete(userType);
  $.ajax(settings);
})

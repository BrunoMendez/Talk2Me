function init() {
    let username = "";
    var greeting = $('#greeting');
    let url = ('/user-name');
    fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error (response.statusText);
      })
      .then(responseJSON => {
        greeting.append(" " + responseJSON.name + "!");
      })
      .catch(error => {
        console.log(error);
        let newUrl = "/";
        location.method = "get";
        location.href = newUrl;
      });
    greeting.append( " " + username);
}

init();
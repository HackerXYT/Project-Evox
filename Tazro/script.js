document.addEventListener("DOMContentLoaded", (event) => {
  const evox_username = localStorage.getItem("t50-username");
  const evox_pswd = localStorage.getItem("t50pswd");
  const evox_email = localStorage.getItem("t50-email");

  if (true || evox_email && evox_pswd && evox_username) {
    console.log("Logged in");
  } else {
    document.getElementById("login").style.display = "flex";
    console.log("No account");

    const img = document.getElementById("showcase");
    function startLogin() {
      document.getElementById("showcase").style.opacity = "1";
      document.getElementById("showcase").style.transform = "translateY(0)";
    }

    setTimeout(function () {
      if (img.complete) {
        startLogin();
      } else {
        img.addEventListener("load", startLogin);
      }
    }, 200);
  }
});

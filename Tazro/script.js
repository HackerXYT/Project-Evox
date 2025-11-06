document.addEventListener("DOMContentLoaded", (event) => {
  const evox_data = localStorage.getItem("tazroLogin")

  if (evox_data) {
    console.log("Logged in");
  } else {
    const params = new URLSearchParams(window.location.search);
    if (params.has('loginAs') && params.get('loginAs') === "localStorage") {
      document.getElementById("loginInProgress").style.display = "flex";

      const loginData = {
        username: localStorage.getItem("t50-username"),
        password: localStorage.getItem("t50pswd"),
        email: localStorage.getItem("t50-email")
      };

      let howMuchTimeItTook = 0
      setInterval(() => {
        howMuchTimeItTook += 100
      }, 100);

      fetch("https://tazro.evoxs.xyz/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      })
        .then(response => response.json()) // assuming your server responds with JSON
        .then(data => {
          if (data.token) {
            const tazroConfig = {
              username: localStorage.getItem("t50-username"),
              token: btoa(data.token),
              email: localStorage.getItem("t50-email")
            }
            localStorage.setItem("tazroLogin", JSON.stringify(tazroConfig, null, 2))
            function loadApp() {
              document.getElementById("loginInProgress").style.opacity = "0";
              setTimeout(function () {
                document.getElementById("loginInProgress").style.display = "none";
              }, 500)
              if (!data.info) {
                setup()
              } else {
                //Skip setup
              }
            }
            if (howMuchTimeItTook >= 3000) {
              loadApp()
            } else {
              setTimeout(function () {
                loadApp()
              }, 3000 - howMuchTimeItTook)
            }

          } else {
            console.error("Login Failed", data)
            alert(data.message)
          }

        })
        .catch(error => {
          alert("Tazro Server is offline")
          console.error("Error:", error);
        });



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

  }
});

function evoxLogin() {
  window.location.href = "../evox-epsilon-beta/?redirectLogin=tazro"
}

function setup() {
  document.getElementById("setupAccount").classList.add("active")
  rollingDigits("moneyPerMonth", "start", "0");
  rollingDigits("moneyPerDay", "start", "0");
  document.getElementById("monthly-icome-setup").classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[0].classList.add("active")
}

function clearLc() {
  localStorage.clear()
  window.location.reload()
}


let monthlyIcome = "0"
function handlePadClick(event) {
  const pad = event.target.closest('.pad');
  if (pad) {
    if (pad.innerHTML.includes("svg")) {
      if (monthlyIcome === "0") return;
      if (monthlyIcome.length === 1) {
        monthlyIcome = "0"
      } else {
        monthlyIcome = monthlyIcome.slice(0, -1);
      }
      rollingDigits("moneyPerMonth", "update", monthlyIcome);
    } else {
      if (monthlyIcome === "0") {
        monthlyIcome = pad.textContent.trim()
      } else {
        monthlyIcome += pad.textContent.trim()
      }
      rollingDigits("moneyPerMonth", "update", monthlyIcome);
    }
    console.log('Clicked pad:', pad.textContent.trim());

  }
}


function handlePadClickDaily(event) {
  const pad = event.target.closest('.pad');
  if (pad) {
    console.log(pad.getAttribute("data-c"))
    const perDay = String((monthlyIcome / 30).toFixed(2))
    console.log(perDay)
    rollingDigits("moneyPerDay", "update", perDay);
    document.getElementById("padDays").style.opacity = "0"
    setTimeout(function () {
      document.getElementById("moneyEstimate").style.opacity = '1'
      setTimeout(function () {
        document.getElementById("moneyEstimate").style.display = 'flex'
      }, 50)
      document.getElementById("padDays").style.display = "none"
    }, 300)

  }
}

function when_icome() {
  if (monthlyIcome === "0") return;
  document.getElementById("monthly-icome-setup").classList.remove("active")
  document.getElementById("steps").querySelectorAll(".step")[0].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[1].classList.add("active")

  document.getElementById("when-icome-setup").classList.add("active")
}

function monthlyExpenses() {
  if (monthlyIcome === "0") return;
  document.getElementById("when-icome-setup").classList.remove("active")
  document.getElementById("steps").querySelectorAll(".step")[0].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[1].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[2].classList.add("active")

  document.getElementById("user-requirements-setup").classList.add("active")
}
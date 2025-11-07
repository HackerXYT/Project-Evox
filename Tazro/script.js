document.addEventListener("DOMContentLoaded", (event) => {
  const evox_data = localStorage.getItem("tazroLogin")

  if (evox_data) {
    console.log("Logged in");
    boot()
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
                boot()
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
  document.getElementById("stepIndicator").innerText = "1/4"
}

function clearLc() {
  localStorage.clear()
  window.location.reload()
}


let monthlyIcome = "0"
function handlePadClick(event, otherId) {
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

let availableMoney = "0"

function handlePadClick_available(event) {
  const pad = event.target.closest('.pad');
  if (pad) {
    if (pad.innerHTML.includes("svg")) {
      if (availableMoney === "0") return;
      if (availableMoney.length === 1) {
        availableMoney = "0"
      } else {
        availableMoney = availableMoney.slice(0, -1);
      }
      rollingDigits("availableMoney", "update", availableMoney);
    } else {
      if (availableMoney === "0") {
        availableMoney = pad.textContent.trim()
      } else if (availableMoney.slice(-1) === "." && pad.textContent.trim() === ".") {
        return;
      } else {
        availableMoney += pad.textContent.trim()
      }
      rollingDigits("availableMoney", "update", availableMoney);
    }
    console.log('Clicked pad:', pad.textContent.trim());

  }
}
let paymentFrequency = 0
function handlePadClickDaily(event) {
  const pad = event.target.closest('.pad');
  if (pad) {
    const perDay = String((monthlyIcome / 30).toFixed(2))
    paymentFrequency = pad.getAttribute("data-c")
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
  document.getElementById("stepIndicator").innerText = "2/4"


  document.getElementById("when-icome-setup").classList.add("active")
}

function monthlyExpenses() {
  if (paymentFrequency === 0) return;
  document.getElementById("when-icome-setup").classList.remove("active")
  document.getElementById("steps").querySelectorAll(".step")[0].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[1].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[2].classList.add("active")
  document.getElementById("stepIndicator").innerText = "3/4"


  document.getElementById("user-requirements-setup").classList.add("active")
}

function addRecommendation(name, cost, emoji) {
  addBlankRequirement(name, cost, emoji)
  document.querySelector("#container-requirements .requirement.placeholder").remove()
}
function addBlankRequirement(name, cost, emoji) {
  const container = document.getElementById("container-requirements")
  const center = container.querySelector(".center");

  const newDiv = document.createElement("div");
  newDiv.className = "requirement";

  const emojiDiv = document.createElement("div");
  emojiDiv.className = "emoji";
  if (emoji) emojiDiv.innerText = emoji
  newDiv.appendChild(emojiDiv);

  const reqNameDiv = document.createElement("div");
  reqNameDiv.className = "reqName";

  const input = document.createElement("input");
  input.className = "reqInput";
  input.value = "";
  if (name) input.value = name
  input.placeholder = "Όνομα ανάγκης";

  reqNameDiv.appendChild(input);
  newDiv.appendChild(reqNameDiv);

  const costDiv = document.createElement("div");
  costDiv.className = "cost";
  costDiv.textContent = "€";

  const costInput = document.createElement("input");
  costInput.className = "reqInput bold";
  costInput.value = "0";
  costInput.placeholder = "0";

  // Create a hidden span to measure width
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "pre";
  span.style.font = "inherit";
  document.body.appendChild(span);

  function updateInputWidth() {
    const text = costInput.value || costInput.placeholder || "";
    span.textContent = text;
    costInput.style.width = span.offsetWidth + 8 + "px";
  }

  costInput.addEventListener("input", updateInputWidth);
  if (cost) costInput.value = cost
  updateInputWidth();
  costDiv.appendChild(costInput);

  newDiv.appendChild(costDiv);

  let typingTimer;
  const doneTypingDelay = 500; // ms after user stops typing

  input.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      userFinishedTyping(input.value);
    }, doneTypingDelay);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      console.log("User pressed Enter!");
      costInput.value = ""
      costInput.focus()
    }
  });

  function userFinishedTyping(value) {
    if (value === "") return;
    console.log('User finished typing:', value);
    emojiDiv.innerHTML = `<div class="normalLoader"></div>`
    fetch(`https://tazro.evoxs.xyz/emoji?input=${value}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    })
      .then(res => res.text())
      .then(data => {
        emojiDiv.innerText = data
      })
      .catch(err => console.error("Error:", err));
  }
  container.insertBefore(newDiv, center);
  if (!emoji) input.focus()
}

function getToken() {
  const account = localStorage.getItem("tazroLogin")
  const json = JSON.parse(account)
  const token = atob(json.token)
  return token;
}

const user_requirements = []
function moneyLeft() {
  //Setup
  const container = document.getElementById("container-requirements")
  container.querySelectorAll(".requirement").forEach(element => {
    if (element.classList.contains("center") || element.classList.contains("placeholder")) return;
    const name = element.querySelector(".reqName input").value
    const cost = element.querySelector(".cost input").value
    if (name === "" || cost === "") return;
    user_requirements.push({
      name,
      cost
    })
  });
  console.log(user_requirements)

  rollingDigits("availableMoney", "start", "0");
  document.getElementById("user-requirements-setup").classList.remove("active")
  document.getElementById("steps").querySelectorAll(".step")[0].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[1].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[2].classList.add("active")
  document.getElementById("steps").querySelectorAll(".step")[3].classList.add("active")
  document.getElementById("stepIndicator").innerText = "4/4"


  document.getElementById("available-money-setup").classList.add("active")
}

function finishSetup() {
  if (availableMoney === "0") return;
  document.getElementById("available-money-setup").classList.remove("active")
  document.getElementById("steps").style.opacity = '0'
  document.getElementById("stepIndicator").style.opacity = '0'
  document.getElementById("settingUpLoader").classList.add("active")

  const setupJson = {
    paymentFrequency, //days
    availableMoney,
    monthlyIcome,
    user_requirements
  }

  const account = JSON.parse(localStorage.getItem("tazroLogin"))
  account.info = setupJson
  localStorage.setItem("tazroLogin", JSON.stringify(account, null, 2))
  console.log(setupJson)

  let howMuchTimeItTook = 0
  setInterval(() => {
    howMuchTimeItTook += 100
  }, 100);

  fetch("https://tazro.evoxs.xyz/setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(setupJson)
  })
    .then(response => response.json()) // assuming your server responds with JSON
    .then(data => {
      function loadApp() {
        if (data.message === "Success") {
          document.getElementById("setupAccount").classList.remove("active")
          boot()
        } else {
          alert(data.message)
        }
      }
      if (howMuchTimeItTook >= 3000) {
        loadApp()
      } else {
        setTimeout(function () {
          loadApp()
        }, 3000 - howMuchTimeItTook)
      }

    })
    .catch(error => {
      alert("Tazro Server is offline")
      console.error("Error:", error);
    });
}

function boot() {
  const localData = JSON.parse(localStorage.getItem("tazroLogin"))
  if (localData.info) {
    const info = localData.info
    if (info.availableMoney.split(".")[1]) {
      document.getElementById("availableBalance").innerHTML = `<span>€${info.availableMoney.split(".")[0]}</span><span class="cents">.${info.availableMoney.split(".")[1]}</span>`

    } else {
      document.getElementById("availableBalance").innerHTML = `<span>€${info.availableMoney}</span><span class="cents"></span>`
    }
    document.getElementById("profilePicture").src = `https://data.evoxs.xyz/profiles?authorize=imagePfp&name=${localStorage.getItem("t50-username")}`
    const activitiesContainer = document.getElementById("activityContainer")
    activitiesContainer.innerHTML = ""
    fetch(`https://tazro.evoxs.xyz/activity`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        //data is an array
        if (data.length === 0) {
          setup()
        } else {
          const reversed = data.reverse()
          let count = 0
          reversed.forEach(activity => {
            if(count === 3) return;
            activitiesContainer.innerHTML += `<div class="feedAction">
            <div class="feedActionIcon">
            ${activity.icon}
            </div>
            <p>${activity.title}</p>
            </div>`
            count++
          })
        }
        console.log(data)

      })
      .catch(err => console.error("Error:", err));
  } else {
    console.error("Boot Failed.")
  }
}
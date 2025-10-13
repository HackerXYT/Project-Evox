document.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("university");
  if (!localData) {
    document.getElementById("setup").style.display = "flex";
  } else {
    if (localStorage.getItem("uni_notifications") === "true") {
      document.getElementById("statusNotif").innerText = "ενεργές";
      document.getElementById("statusNotif").style.color = "rgb(92, 255, 105)";
      document.getElementById("notificationsToggle").checked = true;
    } else {
      document.getElementById("statusNotif").innerText = "ανενεργές";
      document.getElementById("statusNotif").style.color = "rgb(255, 92, 92)";
      document.getElementById("notificationsToggle").checked = false;
    }
    document.getElementById("name-username").innerText = `${
      localStorage.getItem("uni_name") || "Άγνωστο"
    } - ${getToken().slice(0, 10)}`;
    document.getElementById("main").style.display = "flex";
  }
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const setup = document.getElementById("setup");
  const loading = document.getElementById("generalLoading");
  setTimeout(function () {
    if (!username || !password) {
      //Notify
      return;
    }
    setup.classList.add("popout");
    setTimeout(function () {
      setup.style.display = "none";
      loading.style.display = "flex";
      loading.classList.add("popin");
    }, 400);
    setTimeout(function () {
      reach("/login", true, null, "POST", { username, password }).then(
        (data) => {
          console.log("Result:", data);
          if (data) {
            if (data.evoxToken) {
              //Success
              localStorage.setItem(
                "university",
                `${username}${data.evoxToken}`
              );
              loading.classList.remove("popin");
              localStorage.setItem("uni_name", data.name);
              document.getElementById("name").innerText = data.name;
              document.getElementById("welcomeMsg").style.display = "block";
              setTimeout(function () {
                loading.classList.add("popout");
                setTimeout(function () {
                  loading.style.display = "none";
                  loading.classList.remove("popout");

                  if (localStorage.getItem("uni_notifications") === "true") {
                    document.getElementById("statusNotif").innerText =
                      "ενεργές";
                    document.getElementById("statusNotif").style.color =
                      "rgb(92, 255, 105)";
                    document.getElementById(
                      "notificationsToggle"
                    ).checked = true;
                  } else {
                    document.getElementById("statusNotif").innerText =
                      "ανενεργές";
                    document.getElementById("statusNotif").style.color =
                      "rgb(255, 92, 92)";
                    document.getElementById(
                      "notificationsToggle"
                    ).checked = false;
                  }
                  document.getElementById("name-username").innerText = `${
                    localStorage.getItem("uni_name") || "Άγνωστο"
                  } - ${getToken().slice(0, 10)}`;
                  document.getElementById("main").style.display = "flex";
                }, 400);
              }, 3500);
            } else {
              //Failed
            }
          } else {
            //Cancel operation, server offline
          }
        }
      );
    }, 1000);
  }, 150);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((ch) => ch.charCodeAt(0)));
}

async function initPush() {
  const VAPID_PUBLIC_KEY =
    "BDpk06oevnOEEI2aWHDh4cTkX9V3sgz0L_cY8e_R-CYRpa7t-G45lsSnrJGApUZDLNqfn6_ngeVlmkGEH5mOB0s";
  const token = await getToken();
  if (!token) {
    console.warn("Not logged in.");
    return;
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging not supported");
    alert("Η συσκευή σας δεν υποστηρίζεται.");
    return;
  }

  const reg = await navigator.serviceWorker.register("./sw.js");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission not granted.");
    document.getElementById("notificationsToggle").checked = false;
    return;
  }

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  reach("/subscribe", true, null, "POST", subscription, {
    Authorization: `Bearer ${token}`,
  }).then((data) => {
    console.log(data);
    localStorage.setItem("uni_notifications", "true");
  });

  return subscription;
}

async function toggleNotifications(el, event) {
  event.stopPropagation();
  const box = el.checked;
  const token = await getToken();
  if (!token) {
    console.warn("Not logged in.");
    return;
  }
  if (!box) {
    //off
    console.log("to off");
    reach("/disableNotifications", true, null, "POST", null, {
      Authorization: `Bearer ${token}`,
    }).then((data) => {
      console.log(data);
      if (data.success === false) {
        document.getElementById("notificationsToggle").checked = true;
      }
      localStorage.setItem("uni_notifications", "false");
    });
  } else {
    //on
    console.log("to on");
    if (localStorage.getItem("uni_notifications")) {
      reach("/reEnableNotifications", true, null, "POST", null, {
        Authorization: `Bearer ${token}`,
      }).then((data) => {
        console.log(data);
        if (data.success === false) {
          document.getElementById("notificationsToggle").checked = false;
        }
        localStorage.setItem("uni_notifications", "false");
      });
    } else {
      initPush();
    }
  }
}

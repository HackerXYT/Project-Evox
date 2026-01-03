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
    document.getElementById("name-username").innerText = `Καλωσόρισες, ${localStorage.getItem("uni_name") || ""}`;


    getAnnouncements().then((announcements) => {
      console.log(announcements)
      getCourses()
    });
    //document.getElementById("main").style.display = "flex";
    document.getElementById("home").style.display = "flex";
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
              localStorage.setItem("uni_pfp", data.profileImage ? profileImage : "default")
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
                  document.getElementById("name-username").innerText = `Καλωσόρισες, ${localStorage.getItem("uni_name") || ""}`;

                  getAnnouncements().then((announcements) => {
                    console.log(announcements)
                    getCourses()
                  });
                  //document.getElementById("main").style.display = "flex";
                  document.getElementById("home").style.display = "flex";
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


const icons = {
  feedback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M16 1C17.6569 1 19 2.34315 19 4C19 4.55228 18.5523 5 18 5C17.4477 5 17 4.55228 17 4C17 3.44772 16.5523 3 16 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H16C16.5523 21 17 20.5523 17 20V19C17 18.4477 17.4477 18 18 18C18.5523 18 19 18.4477 19 19V20C19 21.6569 17.6569 23 16 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H16Z" fill="#fff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.7991 8.20087C20.4993 7.90104 20.0132 7.90104 19.7133 8.20087L11.9166 15.9977C11.7692 16.145 11.6715 16.3348 11.6373 16.5404L11.4728 17.5272L12.4596 17.3627C12.6652 17.3285 12.855 17.2308 13.0023 17.0835L20.7991 9.28666C21.099 8.98682 21.099 8.5007 20.7991 8.20087ZM18.2991 6.78666C19.38 5.70578 21.1325 5.70577 22.2134 6.78665C23.2942 7.86754 23.2942 9.61999 22.2134 10.7009L14.4166 18.4977C13.9744 18.9398 13.4052 19.2327 12.7884 19.3355L11.8016 19.5C10.448 19.7256 9.2744 18.5521 9.50001 17.1984L9.66448 16.2116C9.76728 15.5948 10.0602 15.0256 10.5023 14.5834L18.2991 6.78666Z" fill="#fff"/>
<path d="M5 7C5 6.44772 5.44772 6 6 6H14C14.5523 6 15 6.44772 15 7C15 7.55228 14.5523 8 14 8H6C5.44772 8 5 7.55228 5 7Z" fill="#fff"/>
<path d="M5 11C5 10.4477 5.44772 10 6 10H10C10.5523 10 11 10.4477 11 11C11 11.5523 10.5523 12 10 12H6C5.44772 12 5 11.5523 5 11Z" fill="#fff"/>
<path d="M5 15C5 14.4477 5.44772 14 6 14H7C7.55228 14 8 14.4477 8 15C8 15.5523 7.55228 16 7 16H6C5.44772 16 5 15.5523 5 15Z" fill="#fff"/>
</svg>`,
  resource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M13 3L13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2V3ZM19 9H20C20 8.73478 19.8946 8.48043 19.7071 8.29289L19 9ZM13.109 8.45399L14 8V8L13.109 8.45399ZM13.546 8.89101L14 8L13.546 8.89101ZM10 13C10 12.4477 9.55228 12 9 12C8.44772 12 8 12.4477 8 13H10ZM8 16C8 16.5523 8.44772 17 9 17C9.55228 17 10 16.5523 10 16H8ZM8.5 9C7.94772 9 7.5 9.44772 7.5 10C7.5 10.5523 7.94772 11 8.5 11V9ZM9.5 11C10.0523 11 10.5 10.5523 10.5 10C10.5 9.44772 10.0523 9 9.5 9V11ZM8.5 6C7.94772 6 7.5 6.44772 7.5 7C7.5 7.55228 7.94772 8 8.5 8V6ZM9.5 8C10.0523 8 10.5 7.55228 10.5 7C10.5 6.44772 10.0523 6 9.5 6V8ZM17.908 20.782L17.454 19.891L17.454 19.891L17.908 20.782ZM18.782 19.908L19.673 20.362L18.782 19.908ZM5.21799 19.908L4.32698 20.362H4.32698L5.21799 19.908ZM6.09202 20.782L6.54601 19.891L6.54601 19.891L6.09202 20.782ZM6.09202 3.21799L5.63803 2.32698L5.63803 2.32698L6.09202 3.21799ZM5.21799 4.09202L4.32698 3.63803L4.32698 3.63803L5.21799 4.09202ZM12 3V7.4H14V3H12ZM14.6 10H19V8H14.6V10ZM12 7.4C12 7.66353 11.9992 7.92131 12.0169 8.13823C12.0356 8.36682 12.0797 8.63656 12.218 8.90798L14 8C14.0293 8.05751 14.0189 8.08028 14.0103 7.97537C14.0008 7.85878 14 7.69653 14 7.4H12ZM14.6 8C14.3035 8 14.1412 7.99922 14.0246 7.9897C13.9197 7.98113 13.9425 7.9707 14 8L13.092 9.78201C13.3634 9.92031 13.6332 9.96438 13.8618 9.98305C14.0787 10.0008 14.3365 10 14.6 10V8ZM12.218 8.90798C12.4097 9.2843 12.7157 9.59027 13.092 9.78201L14 8V8L12.218 8.90798ZM8 13V16H10V13H8ZM8.5 11H9.5V9H8.5V11ZM8.5 8H9.5V6H8.5V8ZM13 2H8.2V4H13V2ZM4 6.2V17.8H6V6.2H4ZM8.2 22H15.8V20H8.2V22ZM20 17.8V9H18V17.8H20ZM19.7071 8.29289L13.7071 2.29289L12.2929 3.70711L18.2929 9.70711L19.7071 8.29289ZM15.8 22C16.3436 22 16.8114 22.0008 17.195 21.9694C17.5904 21.9371 17.9836 21.8658 18.362 21.673L17.454 19.891C17.4045 19.9162 17.3038 19.9539 17.0322 19.9761C16.7488 19.9992 16.3766 20 15.8 20V22ZM18 17.8C18 18.3766 17.9992 18.7488 17.9761 19.0322C17.9539 19.3038 17.9162 19.4045 17.891 19.454L19.673 20.362C19.8658 19.9836 19.9371 19.5904 19.9694 19.195C20.0008 18.8114 20 18.3436 20 17.8H18ZM18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362L17.891 19.454C17.7951 19.6422 17.6422 19.7951 17.454 19.891L18.362 21.673ZM4 17.8C4 18.3436 3.99922 18.8114 4.03057 19.195C4.06287 19.5904 4.13419 19.9836 4.32698 20.362L6.10899 19.454C6.0838 19.4045 6.04612 19.3038 6.02393 19.0322C6.00078 18.7488 6 18.3766 6 17.8H4ZM8.2 20C7.62345 20 7.25117 19.9992 6.96784 19.9761C6.69617 19.9539 6.59545 19.9162 6.54601 19.891L5.63803 21.673C6.01641 21.8658 6.40963 21.9371 6.80497 21.9694C7.18864 22.0008 7.65645 22 8.2 22V20ZM4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673L6.54601 19.891C6.35785 19.7951 6.20487 19.6422 6.10899 19.454L4.32698 20.362ZM8.2 2C7.65645 2 7.18864 1.99922 6.80497 2.03057C6.40963 2.06287 6.01641 2.13419 5.63803 2.32698L6.54601 4.10899C6.59545 4.0838 6.69617 4.04612 6.96784 4.02393C7.25117 4.00078 7.62345 4 8.2 4V2ZM6 6.2C6 5.62345 6.00078 5.25117 6.02393 4.96784C6.04612 4.69617 6.0838 4.59545 6.10899 4.54601L4.32698 3.63803C4.13419 4.01641 4.06287 4.40963 4.03057 4.80497C3.99922 5.18864 4 5.65645 4 6.2H6ZM5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803L6.10899 4.54601C6.20487 4.35785 6.35785 4.20487 6.54601 4.10899L5.63803 2.32698Z" fill="#fff"/>
<script xmlns=""/><script xmlns=""/></svg>`,
  quiz: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" version="1.1" viewBox="0 0 40.124 40.124" xml:space="preserve">
		<path d="M19.938,12.141c1.856,0,2.971,0.99,2.971,2.66c0,3.033-5.414,3.869-5.414,7.55c0,0.99,0.648,2.072,1.979,2.072    c2.042,0,1.795-1.516,2.538-2.6c0.989-1.453,5.6-3,5.6-7.023c0-4.361-3.897-6.188-7.858-6.188c-3.773,0-7.24,2.692-7.24,5.725    c0,1.237,0.929,1.887,2.012,1.887C17.525,16.225,15.979,12.141,19.938,12.141z"/>
		<path d="M22.135,28.973c0-1.393-1.145-2.537-2.537-2.537s-2.537,1.146-2.537,2.537c0,1.393,1.145,2.537,2.537,2.537    S22.135,30.366,22.135,28.973z"/>
		<path d="M40.124,20.062C40.124,9,31.124,0,20.062,0S0,9,0,20.062s9,20.062,20.062,20.062S40.124,31.125,40.124,20.062z M2,20.062    C2,10.103,10.103,2,20.062,2c9.959,0,18.062,8.103,18.062,18.062c0,9.959-8.103,18.062-18.062,18.062    C10.103,38.124,2,30.021,2,20.062z"/>
</svg>`,
  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M2 8L8 10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
<path d="M6 4L8 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
<path opacity="0.5" d="M11 6.56252L14.7001 2.93755C16.1597 1.50753 18.7629 1.73938 20.5145 3.4554C22.266 5.17142 22.5027 7.72176 21.043 9.15178L18.1358 12" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
<path opacity="0.5" d="M15 15.5866L10.9653 20.001C9.57254 21.5247 7.0887 21.2777 5.41744 19.4492C3.74618 17.6207 3.52038 14.9032 4.91309 13.3795L6.17395 12" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  forum: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M15.5 15.5L13.6213 13.6213M13.6213 13.6213C14.1642 13.0784 14.5 12.3284 14.5 11.5C14.5 9.84315 13.1569 8.5 11.5 8.5C9.84315 8.5 8.5 9.84315 8.5 11.5C8.5 13.1569 9.84315 14.5 11.5 14.5C12.3284 14.5 13.0784 14.1642 13.6213 13.6213ZM21 12C21 16.9706 16.9706 21 12 21C9.96359 21 3.00072 21 3.00072 21C3.00072 21 4.55992 17.2561 3.93591 16.0008C3.33685 14.7956 3 13.4372 3 12C3 7.02944 7.02943 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M15 16V18C15 18.9319 15 19.3978 14.8478 19.7654C14.6448 20.2554 14.2554 20.6448 13.7654 20.8478C13.3978 21 12.9319 21 12 21C11.0681 21 10.6022 21 10.2346 20.8478C9.74458 20.6448 9.35523 20.2554 9.15224 19.7654C9 19.3978 9 18.9319 9 18V16M5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10C19 12.5463 17.6404 14.7751 15.6076 16H8.39241C6.35958 14.7751 5 12.5463 5 10Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  page: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M12 10.4V20M12 10.4C12 8.15979 12 7.03969 11.564 6.18404C11.1805 5.43139 10.5686 4.81947 9.81596 4.43597C8.96031 4 7.84021 4 5.6 4H4.6C4.03995 4 3.75992 4 3.54601 4.10899C3.35785 4.20487 3.20487 4.35785 3.10899 4.54601C3 4.75992 3 5.03995 3 5.6V16.4C3 16.9601 3 17.2401 3.10899 17.454C3.20487 17.6422 3.35785 17.7951 3.54601 17.891C3.75992 18 4.03995 18 4.6 18H7.54668C8.08687 18 8.35696 18 8.61814 18.0466C8.84995 18.0879 9.0761 18.1563 9.29191 18.2506C9.53504 18.3567 9.75977 18.5065 10.2092 18.8062L12 20M12 10.4C12 8.15979 12 7.03969 12.436 6.18404C12.8195 5.43139 13.4314 4.81947 14.184 4.43597C15.0397 4 16.1598 4 18.4 4H19.4C19.9601 4 20.2401 4 20.454 4.10899C20.6422 4.20487 20.7951 4.35785 20.891 4.54601C21 4.75992 21 5.03995 21 5.6V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H16.4533C15.9131 18 15.643 18 15.3819 18.0466C15.15 18.0879 14.9239 18.1563 14.7081 18.2506C14.465 18.3567 14.2402 18.5065 13.7908 18.8062L12 20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  choicegroup: `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="-0.26 0 33.549 33.549">

<g transform="translate(-607.873 -577.167)">

<path d="M638.546,610.716a1,1,0,0,1-.942-1.334c1.785-5.044,1.745-8.637-.12-10.679-3.26-3.568-11.186-1.6-11.266-1.574l-1.247.318V586l.016-.087a3.188,3.188,0,0,0-.274-2.085.7.7,0,0,0-.609-.226.774.774,0,0,0-.657.247,3.155,3.155,0,0,0-.346,2.033l.011.144v15.115l-1.155-.18c-1.766-.279-2.336.02-2.408.158-.459.9,2.05,4.66,5.264,7.888a1,1,0,0,1-1.418,1.412c-1.681-1.689-7.053-7.412-5.627-10.208.645-1.265,2.182-1.425,3.344-1.359V586.094a4.926,4.926,0,0,1,.822-3.55,2.768,2.768,0,0,1,2.17-.939,2.678,2.678,0,0,1,2.144.944,4.94,4.94,0,0,1,.723,3.624v8.757c2.643-.466,8.781-1.085,11.987,2.42,2.406,2.629,2.585,6.9.532,12.7A1,1,0,0,1,638.546,610.716Z"/>

<path d="M612.733,586.792a2.2,2.2,0,0,1-1.562-.646l-3.005-3.005a1,1,0,0,1,1.414-1.414l3.006,3.005a.211.211,0,0,0,.3,0l6.522-6.521a1,1,0,0,1,1.414,1.414l-6.523,6.522A2.2,2.2,0,0,1,612.733,586.792Z"/>

<path d="M639.392,587.543a1,1,0,0,1-.707-.293l-8.376-8.376a1,1,0,0,1,1.414-1.414l8.376,8.376a1,1,0,0,1-.707,1.707Z"/>

<path d="M631.016,587.543a1,1,0,0,1-.707-1.707l8.376-8.376a1,1,0,0,1,1.414,1.414l-8.376,8.376A1,1,0,0,1,631.016,587.543Z"/>

</g>

</svg>`,
  scorm: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" version="1.1" id="Layer_1" viewBox="0 0 508 508" xml:space="preserve">
<g>
	<g>
		<path d="M293.7,70.302H168.1c-7.8,0-14.1,6.3-14.1,14.1c0,7.8,6.3,14.1,14.1,14.1h125.6c7.8,0,14.1-6.3,14.1-14.1    C307.8,76.602,301.5,70.302,293.7,70.302z"/>
	</g>
</g>
<g>
	<g>
		<path d="M293.7,142.402H75.5c-7.8,0-14.1,6.3-14.1,14.1c-0.1,7.8,6.3,14.1,14.1,14.1h218.2c7.8,0,14.1-6.3,14.1-14.1    S301.5,142.402,293.7,142.402z"/>
	</g>
</g>
<g>
	<g>
		<path d="M205.3,214.502H75.5c-7.8,0-14.1,6.3-14.1,14.1c0,7.8,6.3,14.1,14.1,14.1h129.9c7.7,0,14-6.3,14-14.1    S213.1,214.502,205.3,214.502z"/>
	</g>
</g>
<g>
	<g>
		<path d="M173.9,358.703H75.5c-7.8,0-14.1,6.3-14.1,14.1s6.3,14.1,14.1,14.1h98.4c7.8,0,14.1-6.3,14.1-14.1    C188,365.003,181.7,358.703,173.9,358.703z"/>
	</g>
</g>
<g>
	<g>
		<path d="M168.1,286.602H75.5c-7.8,0-14.1,6.3-14.1,14.1c-0.1,7.8,6.3,14.1,14.1,14.1h92.6c7.8,0,14.1-6.3,14.1-14.1    C182.2,292.902,175.9,286.602,168.1,286.602z"/>
	</g>
</g>
<g>
	<g>
		<path d="M442.8,466.602c39.3-26.7,65.2-71.7,65.2-122.7c0-40-16-76.3-41.8-103l6.7-6.7l3.8,3.8c5.7,5.7,14.9,5,20,0    c5.5-5.5,5.5-14.5,0-20l-27.7-27.4c-5.5-5.5-14.4-5.5-20,0c-5.5,5.5-5.5,14.5,0,20l3.8,3.8l-8.2,8.2    c-21.7-15.2-47.5-24.6-75.5-26.4v-182.1c0-7.8-6.3-14.1-14.1-14.1H108.6c-3.7,0-7.3,1.5-10,4.1l-94.5,94.5    c-2.6,2.6-4.1,6.2-4.1,10v327.6c0,7.8,6.3,14.1,14.1,14.1h242.8c6.1,5.9,12.6,11.3,19.6,16.1l-17.7,17.7c-5.5,5.5-5.5,14.4,0,20    c4.6,4.7,14.4,5.6,20,0l23.6-23.5c17.7,7.5,37.1,11.6,57.5,11.6c20.2,0,39.5-4.1,57.1-11.5l23.5,23.5c5.5,5.5,15.3,4.6,20,0    c5.5-5.5,5.5-14.5,0-20L442.8,466.602z M94.5,48.203v46.3H48.2L94.5,48.203z M28.2,422.102v-299.4h80.4c7.8,0,14.1-6.3,14.1-14.1    v-80.4h218.2v168.8c-72.8,9.4-129.2,71.6-129.2,146.9c0,28.7,8.3,55.4,22.5,78.2H28.2z M359.8,463.902    c-66.1,0-119.9-53.8-119.9-120s53.8-120,119.9-120s119.9,53.8,119.9,120C479.8,410.102,426,463.902,359.8,463.902z"/>
	</g>
</g>
<g>
	<g>
		<path d="M398.3,329.703h-24.6v-66.8c0-7.8-6.3-14.1-14.1-14.1c-7.8,0-14.1,6.3-14.1,14.1v80.9c0,7.8,6.3,14.1,14.1,14.1h38.7    c7.8,0,14.1-6.3,14.1-14.1C412.4,336.003,406.1,329.703,398.3,329.703z"/>
	</g>
</g>
</svg>`
}

async function openCourse(course) {
  const target = document.getElementById("courseShow")
  const toHide = document.getElementById("home")
  toHide.style.overflow = 'hidden'
  target.classList.add("active")
  //course.full
  //course.short
  //course.emoji

  document.getElementById("courseName").innerHTML = course.emoji + " " + course.short
  document.getElementById("search-course").placeholder = `Αναζήτησε στο μάθημα ${course.short}`
  const token = await getToken();
  if (!token) {
    console.warn("Not logged in.");
    return;
  }
  const container = document.getElementById("spawnCategoriesAndCourseInfo")
  container.innerHTML = `<div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>
            <div class="announcement skeleton"></div>`
  reach("/getCourse", true, null, "POST", { courseName: course.full }, {
    Authorization: `Bearer ${token}`,
  }).then((data) => {
    console.log(data);
    // Clear container
    container.textContent = '';

    data.forEach(courseCategory => {
      // Full row for category name
      const fullRow = document.createElement('div');
      fullRow.className = 'fullRow';

      const catName = document.createElement('p');
      catName.className = 'cat_name';
      catName.textContent = capitalizeGreek(courseCategory.sectionName.replaceAll("`", ""));

      fullRow.appendChild(catName);
      container.appendChild(fullRow);

      // Modules
      courseCategory.modules.forEach(cat => {
        const announcement = document.createElement('div');
        announcement.className = 'announcement bg2';

        // Emoji
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'emoji';
        emojiDiv.dataset.c = cat.type;
        emojiDiv.innerHTML = icons[cat.type] || icons.default;

        // Column
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        const courseNameDiv = document.createElement('div');
        courseNameDiv.className = 'courseName';
        courseNameDiv.textContent = capitalizeGreek(cat.name.replaceAll("΄", ""));
        colDiv.appendChild(courseNameDiv);

        // Resource info
        if (cat.type === 'resource') {
          const annText = document.createElement('div');
          annText.className = 'ann_text';
          const files = cat.contents.length;

          let fileInfo = `${files} ${files === 1 ? "αρχείο" : "αρχεία"}`;
          const ext = getFileExtension(cat.contents[0].filename)
          const fileType = getFileType(ext)
          if (files === 1) {
            if (ext === 'png' || ext === 'gif' || ext === 'jpg' || ext === 'jpeg') {
              emojiDiv.innerHTML = `<img src="${cat.contents[0].fileurl}" style="border-radius: 12px;" width="35px" height="35px">`
            } else {
              emojiDiv.innerHTML = `<img src="./icons/${ext}.svg" width="25px" height="25px">`
            }
            announcement.addEventListener("click", () => {
              window.open(cat.contents[0].fileurl, "_blank");

            });
            fileInfo += ` - ${fileType}`;
          }
          annText.textContent = fileInfo;
          colDiv.appendChild(annText);
        }

        announcement.appendChild(emojiDiv);
        announcement.appendChild(colDiv);
        container.appendChild(announcement);
      });

      // If no modules
      if (courseCategory.modules.length === 0) {
        const announcement = document.createElement('div');
        announcement.className = 'announcement off';
        announcement.style.minHeight = '30px';

        const courseNameDiv = document.createElement('div');
        courseNameDiv.className = 'courseName wauto';
        courseNameDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" version="1.1" width="25px" height="25px" viewBox="0 0 142.916 142.916" xml:space="preserve">
      <path d="M32.901,114.799l-12.015,16.507c-2.375,3.265-1.656,7.835,1.608,10.21c1.301,0.945,2.807,1.4,4.295,1.4    c2.261,0,4.487-1.043,5.917-3.006l12.11-16.638c7.951,4.239,17.019,6.651,26.644,6.651c31.342,0,56.84-25.499,56.84-56.842    c0-15.979-6.636-30.427-17.283-40.764l15.074-20.709c2.375-3.265,1.655-7.834-1.607-10.21c-3.273-2.377-7.84-1.651-10.209,1.608    L99.313,23.562c-8.241-4.655-17.739-7.323-27.856-7.323c-31.343,0-56.842,25.499-56.842,56.841    C14.615,89.557,21.665,104.409,32.901,114.799z M113.682,73.08c0,23.284-18.94,42.226-42.226,42.226    c-6.407,0-12.461-1.477-17.905-4.039l48.729-66.951C109.331,51.864,113.682,61.964,113.682,73.08z M71.457,30.856    c6.901,0,13.403,1.698,19.159,4.646l-49.043,67.381c-7.623-7.643-12.344-18.181-12.344-29.801    C29.232,49.798,48.173,30.856,71.457,30.856z"/>
    </svg>`;
        announcement.appendChild(courseNameDiv);
        container.appendChild(announcement);
      }
    });

    // Extra placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'announcement off';
    container.appendChild(placeholder);


  });

}

function returnFromCourse() {
  const toHide = document.getElementById("courseShow")
  const toShow = document.getElementById("home")
  toHide.classList.remove("active")
  toShow.style.overflow = 'inherit'
  const container = document.getElementById("spawnCategoriesAndCourseInfo")
  container.innerHTML = ""
}
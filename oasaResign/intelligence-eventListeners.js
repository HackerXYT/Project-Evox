document.getElementById("main-wrapper").addEventListener("scroll", () => {
  // Check if scroll position exceeds the threshold
  if (
    document.getElementById("main-wrapper").scrollTop > scrollThreshold ||
    document.documentElement.scrollTop > scrollThreshold
  ) {
    // Add class to shrink and hide icons
    document.getElementById("returnTopDefines").classList.add("scrolled");
    if (searchIntelli.style.width === "256px") {
      searchIntelli.style.width = null;
    }
    bottomSearchParent.classList.add("scrolled");
  } else {
    // Remove class to reset to original state
    document.getElementById("returnTopDefines").classList.remove("scrolled");
    bottomSearchParent.classList.remove("scrolled");
  }
});

// Listen for any uncaught errors in the application
window.addEventListener("error", (event) => {
  // Alert the user with the error message
  //alert(`[BETA] An error occurred: ${event.message}\nAt: ${event.filename}:${event.lineno}:${event.colno}`);

  // Optionally, log the error to the console for debugging
  console.error("Error details:", event);
});

window.addEventListener("unhandledrejection", (event) => {
  //alert(`[BETA] An unhandled promise rejection occurred: ${event.reason}`);
  console.error("Unhandled rejection:", event.reason);
});

let frequentBuses = ["16", "831", "828", "049"];
let favoriteBuses = [];
let famousBuses = [];

if (localStorage.getItem("oasa_favorites")) {
  console.log("Found favorites");
  console.log(localStorage.getItem("oasa_favorites"));
  favoriteBuses = JSON.parse(localStorage.getItem("oasa_favorites")); //.reverse();
  console.log(favoriteBuses);
}

let outsideOfZone = false;
let blockGoingToLogin = false;

document.addEventListener("DOMContentLoaded", () => {
  
  if (localStorage.getItem("color_theme")) {
    setTheme(localStorage.getItem("color_theme"))
  }
  enableMapSelection();
  document.fonts.ready.then(() => {
    //document.getElementById("loaderFullscreen").classList.add("appLoaded");

    setTimeout(function () {
      //document.getElementById("loaderFullscreen").style.display = "none";
    }, 300);
    console.log("All fonts are fully loaded!");
    // Do your stuff that requires fonts here

    function loop() {
      console.log("Calling handleActivity");
      handleActivity(startingJson);
      setTimeout(loop, 10000);
    }

    loop();
    function getCookie(name) {
      // Find the cookie in document.cookie string
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) {
        // Return the decoded cookie value
        return decodeURIComponent(parts.pop().split(";").shift());
      }
      return null; // If the cookie doesn't exist
    }
    const cookieValue = getCookie("userData");

    let blockMoves = false;
    if (
      cookieValue &&
      !localStorage.getItem("hasRetrievedCookie") &&
      !localStorage.getItem("t50pswd") &&
      !localStorage.getItem("hasRetrievedCookie")
    ) {
      // Parse the JSON string back into a JavaScript object
      const userData = JSON.parse(cookieValue);
      console.log(userData); // Access the JSON data
      //alert(userData)
      if (userData) {
        blockMoves = true;
        let userConfirmed = window.confirm(
          `Βρέθηκε ο χρήστης ${userData.username} στην συσκευή.\nΘέλετε να συνδεθείτε αυτόματα;`
        );
        if (userConfirmed) {
          localStorage.setItem("t50-username", userData.username);
          localStorage.setItem("t50-email", userData.email);
          localStorage.setItem("t50pswd", userData.password);
          localStorage.setItem("hasRetrievedCookie", "true");
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          // User clicked "Cancel"
          localStorage.setItem("hasBlockedCookie", "true");
          console.log("User canceled.");
        }
      }
      //console.log(`Username: ${userData.username}`);
      //console.log(`Email: ${userData.email}`);
    }

    checkForLoginCompatibility();
    const loggedInLocally =
      localStorage.getItem("isOasaLoggedIn") &&
      localStorage.getItem("isOasaLoggedIn") === "true";
    const check1 =
      localStorage.getItem("t50-username") &&
      localStorage.getItem("t50-email") &&
      localStorage.getItem("t50pswd");
    const check2 =
      localStorage.getItem("t50-username") &&
      localStorage.getItem("t50-email") &&
      localStorage.getItem("t50pswd");

    const loggedInGlobally = check1 || check2;

    const completeCheck =
      (check1 && loggedInLocally) || (check2 && loggedInLocally);
    if (completeCheck) {
      if (localStorage.getItem("acceptedTerms") === "true") {
        getReady();
        registerPWA();

        if (!localStorage.getItem("extVOASA")) {
          document.getElementById("notificationsOff").style.display = null;
          document.getElementById("noticecircle").style.display = null;
        }
        //document.getElementById("profilePic").src = "https://www.gravatar.com/avatar/" + md5(localStorage.getItem("t50-email")) + "?d=identicon";
      } else {
        document.getElementById("phone").classList.add("login");
        document.getElementById("main").classList.add("setupNeeded");
        document.getElementById("content").style.display = "none";
        document.getElementById("loginForming").style.display = "none";
        document.getElementById("loginContentFlex").style.height = "auto";
        document.getElementById("loginStepTerms").style.display = null;
        document.getElementById("bottomSearchParent").style.zIndex = "-1";
        document.getElementById("nameterms").innerText =
          localStorage.getItem("t50-username");
        document.getElementById("loginContent").style.display = "block";
        blockGoingToLogin = true;
      }
    } else {
      if (loggedInGlobally) {
        document.getElementById("evoxLogin").classList.add("blinkLogin");
      }
      document.getElementById("oasaPfp").src = "cbimage.png";
      if (localStorage.getItem("hasDismissedSetup") !== "true") {
        document.getElementById("main").classList.add("setupNeeded");
        $("#phone").fadeOut("fast", function () {
          document.getElementById("phone").classList.add("login");
          $("#content").fadeOut("fast", function () {
            $("#phone").fadeIn("fast");
            document
              .getElementById("loginForming")
              .querySelector(".infoWelcome").style.display = "none";
            $("#loginContent").fadeIn("fast");
            setTimeout(function () {
              document
                .getElementById("loginForming")
                .querySelector(".infoWelcome").style.display = null;
            }, 1000);
            document
              .getElementById("loginForming")
              .querySelectorAll("p")[0]
              .classList.add("show");
            displayHello();
            let isTouching = false;
            document.addEventListener("touchstart", (e) => {
              isTouching = true;
            });

            document.addEventListener("touchmove", (e) => {
              if (!isTouching) return;

              const touch = e.touches[0];
              createTrail(touch.clientX, touch.clientY);
            });

            document.addEventListener("touchend", () => {
              isTouching = false;
            });

            function createTrail(x, y) {
              const trail = document.createElement("div");
              trail.className = "trail";
              trail.style.left = `${x - 7.5}px`;
              trail.style.top = `${y - 7.5}px`;

              document.body.appendChild(trail);

              // Remove the trail after the animation ends
              trail.addEventListener("animationend", () => {
                trail.remove();
              });
            }

            let startY;

            document.addEventListener("touchstart", (e) => {
              // Get the starting Y position of the touch
              startY = e.touches[0].clientY;
            });

            document.addEventListener("touchend", (e) => {
              // Get the ending Y position of the touch
              const endY = e.changedTouches[0].clientY;

              // Detect swipe direction and distance
              if (startY - endY > 50 && outsideOfZone === false) {
                // 50px threshold for swipe up
                runFunction(); // Your function to run on swipe up
              }
            });

            function runFunction() {
              document
                .getElementById("loginContentFlex")
                .classList.add("noSplash");
              document.getElementById("hello-text").classList.add("noSplash");
              document
                .getElementById("loginForming")
                .querySelector(".infoWelcome").style.display = "none";
              setTimeout(function () {
                $("#loginForming").fadeOut("fast", function () {
                  $("#phone").fadeOut("fast", function () {
                    //document.getElementById("phone").classList.remove("login")
                    $("#phone").fadeIn("fast", function () {
                      $("#loginStep1").fadeIn("fast");
                      outsideOfZone = true;
                    });
                  });
                });
                //$("#runalpha1").fadeIn("fast")
                //$("#runalpha2").fadeIn("fast")
                //$("#runalpha3").fadeIn("fast")
                //$("#runalpha4").fadeIn("fast")
              }, 800);
              console.log("Swipe up detected! Running the function...");
              // Add your custom function logic here
            }
            //setTimeout(function() {
            //  //document.getElementById("loginForming").classList.add("start")
            //  setTimeout(function() {
            //    document.getElementById("loginForming").querySelectorAll("p")[0].classList.add("show")
            //    setTimeout(function() {
            //      document.getElementById("loginForming").querySelectorAll("p")[1].classList.add("show")
            //    }, 1000)
            //  }, 400)
            //}, 500)
          });
        });
      } else {
        getReady();
      }
    }

    fetch(`famousBuses.json?vevox=${randomString()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("famous");
        let uniqueBuses = data.list.filter(
          (bus) => !frequentBuses.includes(bus) && !favoriteBuses.includes(bus)
        );
        console.log("Unique famous:", uniqueBuses);
        famousBuses = uniqueBuses;
        console.log("famous buses");

        const pre = setInterval(function () {
          if (fullLine) {
            clearInterval(pre);
            famousBuses.forEach((bus) => {
              try {
                loadSection("famous", bus);
              } catch (err) {
                console.error(err);
              }
            });
          } else {
            console.warn("fullLine not found! CRITICAL");
            connectOASABridge();
          }
        }, 100);
      })
      .catch((error) => {
        $("#famousFeed").fadeOut("fast");
        console.warn("Cannot load famous", error);
      });

    fetch(`https://data.evoxs.xyz/cron`)
      .then((response) => response.text())
      .catch((er) => {
        console.warn("centralized error", er);
        serverIP = "https://evox-runtime.onrender.com/";
      });

    const allLines = encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`
    );

    function runOASABridge(data) {
      fullLine = data;
      loadOasa(); //BETA
      if (data) {
        let lc = localStorage.getItem("oasa_favorites");
        if (lc) {
          lc = JSON.parse(lc);
        }
        // Map each line to a promise for asynchronous handling
        let linesPromises = data.map((eachLine) => {
          return new Promise((resolve, reject) => {
            document
              .getElementById("spawnHere")
              .querySelectorAll("button")
              .forEach((editBus) => {
                if (lc && lc.includes(editBus.getAttribute("data-bus"))) {
                  editBus.classList.add("favoriteBus");
                }
              });
            resolve(); // Mark the promise as resolved after DOM update
          });
        });

        // Wait for all promises to resolve (i.e., all buttons are added to the DOM)
        Promise.all(linesPromises)
          .then(() => {
            console.log("All lines have been spawned!");
            const element_b = document.getElementById("indexLoading");
            if (element_b) {
              element_b.remove(); // Remove the loading element
            }

            // Add additional functionality here
          })
          .catch((err) => {
            console.error("An error occurred while spawning stops:", err);
          });
      }
    }
    fetch(`${serverIP}proxy?key=21&targetUrl=${allLines}`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("allLines", JSON.stringify(data));
        runOASABridge(data);
        document.getElementById(
          "oasaPfp"
        ).src = `${serverIP}profiles?authorize=imagePfp&name=${localStorage.getItem(
          "t50-username"
        )}&v=${randomString()}`;
      })
      .catch((error) => {
        document.getElementById("oasaPfp").src = "apple.png";
        console.log("All Lines Get Error:", error);
        if (localStorage.getItem("allLines")) {
          const tmp = localStorage.getItem("allLines");
          runOASABridge(JSON.parse(tmp));
        }
        return;
        if (isNearEvery3Hours()) {
          //alert(`Ο διακομιστής επανεκκινείται, δοκιμάστε ξανά σε 2-3 λεπτά.`)
          document.getElementById("performance").style.display = "flex";
          document.getElementById("messagePerformance").innerHTML =
            "Μερική Διακοπή";
          document.getElementById(
            "italicBuild"
          ).innerHTML = `Evox© OASAP V${currentVersion}`;

          document.getElementById("spawnHere").innerHTML =
            "Ο διακομιστής επανεκκινείται, δοκιμάστε ξανά σε 2-3 λεπτά.";
          document.getElementById(
            "logErrors"
          ).innerHTML = `Ο διακομιστής επανεκκινείται, δοκιμάστε ξανά σε 2-3 λεπτά.`;
        } else {
          //alert(`Δεν ηταν δυνατη η συνδεση στον διακομιστη.\nΑγνωστο σφαλμα`)
          document.getElementById("performance").style.display = "flex";
          document.getElementById("messagePerformance").innerHTML =
            "Σοβαρό περιστατικό";
          document.getElementById(
            "italicBuild"
          ).innerHTML = `Evox© OASAP V${currentVersion}`;

          document.getElementById("spawnHere").innerHTML =
            "Δεν ηταν δυνατη η συνδεση στον διακομιστη.<br>Αγνωστο σφαλμα";
          document.getElementById(
            "logErrors"
          ).innerHTML = `Δεν ηταν δυνατη η συνδεση στον διακομιστη.<br>Αγνωστο σφαλμα<br>${error}`;
        }
        if (error.toString().includes("Unexpected token")) {
          //alert("OASA SQL error. Δοκιμάστε ξανά.")
          document.getElementById("performance").style.display = "flex";
          document.getElementById(
            "italicBuild"
          ).innerHTML = `Evox© OASAP V${currentVersion}`;
          document.getElementById("messagePerformance").innerHTML =
            "Σφάλμα OASA";
          document.getElementById("spawnHere").innerHTML =
            "OASA SQL error. Δοκιμάστε ξανά.";
          document.getElementById(
            "logErrors"
          ).innerHTML = `Σφάλμα από την πλευρά του OASA [SQL].<br>Επανεκκινήστε την εφαρμογή.<br>${error}`;
        }
        const pers = localStorage.getItem("personalization");
        if (pers) {
          const personalize = JSON.parse(pers);
          const savedDate = new Date(personalize.date); // Convert to Date object
          const currentDate = new Date();

          // Calculate the difference in days
          const differenceInDays =
            (currentDate - savedDate) / (1000 * 60 * 60 * 24);

          if (differenceInDays <= 3 && type === "muteOfflineAlerts") {
            return;
            console.log("Date is within 2 days. Do something.");
          }
          // else {
          //    console.log("Date is older than 2 days. Do something else.");
          //}
        } else if (!hasInternetConnection()) {
          return;
        }
        //showErrors()
        //updateCountdown();
      });
  });
});

const checkboxa = document.getElementById("at-start");

checkboxa.addEventListener("change", function () {
  if (checkboxa.checked) {
    //The checkbox is now checked meaning a schedo should be created now
    if (localStorage.getItem("extVOASA")) {
      if (currentInfoForSchedo.bus && currentInfoForSchedo.time) {
        console.log("Evox json passed");

        const evoxJson = {
          username: localStorage.getItem("t50-username"),
          extv: localStorage.getItem("extVOASA"),
          type: "transition",
          bus: currentInfoForSchedo.bus,
          transition: currentInfoForSchedo.time,
        };

        console.log(evoxJson);
        fetch("https://florida.evoxs.xyz/oasaSchedo", {
          method: "POST",
          body: JSON.stringify(evoxJson),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((data) => {
            console.log("Florida Response", data);
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
        console.log("The checkbox is checked");
      } else {
        alert("Σφάλμα!");
        checkboxa.checked = false;
      }
    } else {
      alert("Florida not enabled!");
      checkboxa.checked = false;
    }
  } else {
    console.log("The checkbox is unchecked");

    //will proceed to remove the schedo

    fetch(
      `https://florida.evoxs.xyz/activeSchedo?username=${localStorage.getItem(
        "t50-username"
      )}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.schedo.length !== 0 && data.infinite.length !== 0) {
          const filteredData = data.schedo.filter(
            (item) => item.id === localStorage.getItem("extVOASA")
          );
          filteredData.forEach((schedoNotification) => {
            if (
              schedoNotification.bus === currentInfoForSchedo.bus &&
              schedoNotification.time === currentInfoForSchedo.time
            ) {
              const valueToDelete = schedoNotification;
              console.log("Will delete", valueToDelete);
              const timeNode = `${valueToDelete.date}/${valueToDelete.time}`;
              const bus = valueToDelete.bus;
              const id = valueToDelete.id;
              const evoxJson2 = {
                username: localStorage.getItem("t50-username"),
                timenode: timeNode,
                bus: bus,
                deviceId: id,
              };
              console.log("now pinging");
              fetch("https://florida.evoxs.xyz/deleteByNode", {
                method: "POST",
                body: JSON.stringify(evoxJson2),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.text();
                })
                .then((data) => {
                  console.log(data);
                })
                .catch((error) => {
                  checkboxa.checked = true;
                  console.error("Fetch error:", error);
                });
            }
          });
        }
      })
      .catch((error) => {
        checkboxa.checked = true;
        console.error("Failed to check for updates");
      });
  }
});

document.getElementById("addItem").addEventListener("click", function () {
  const newKey = document.getElementById("newKey").value.trim();
  const newValue = document.getElementById("newValue").value.trim();

  if (newKey && newValue) {
    localStorage.setItem(newKey, newValue);
    document.getElementById("newKey").value = "";
    document.getElementById("newValue").value = "";
    displayLocalStorage();
    alert("Item added successfully!");
  } else {
    alert("Please enter both key and value.");
  }
});

document
  .getElementById("searchInSearch")
  .addEventListener("focus", function () {
    $("#recommendSpawn").fadeOut("fast");
    document.getElementById("searchContainer").classList.add("active");
    searchInInput();
  });

document.getElementById("searchInSearch").addEventListener("blur", function () {
  //$("#recommendSpawn").fadeIn("fast")
  //document.getElementById("searchContainer").classList.remove("active")
  //document.getElementById('toSpawnFinds').classList.add('hidden');
});

document
  .getElementById("searchInSearch")
  .addEventListener("input", function () {
    searchInInput();
  });

document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Image = e.target.result;

      // Save to localStorage
      localStorage.setItem("userImage", base64Image);

      // Add class to trigger pseudo-element
      const phone = document.getElementById("phone");
      phone.classList.add("image");

      // Inject dynamic CSS to override background-image in ::before
      let styleTag = document.getElementById("dynamic-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-style";
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `
      #phone.image::before {
        background-image: url('${base64Image}');
      }
    `;
    };

    reader.readAsDataURL(file);
  });

const select = document.getElementById("mySelect");

select.addEventListener("change", () => {
  const value = select.value;
  localStorage.setItem("map_style", value);
});

const textarea = document.getElementById('bugTextarea');

if (!CSS.supports('field-sizing', 'content')) {
  const resizeTextarea = () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  resizeTextarea();

  textarea.addEventListener('input', resizeTextarea);

  textarea.addEventListener('paste', () => setTimeout(resizeTextarea, 0));
}

let startX = 0;
let startY = 0;

function handleStart(x, y) {
  startX = x;
  startY = y;
}

function handleEnd(x, y) {
  const deltaX = x - startX;
  const deltaY = y - startY;

  if (deltaX > 50 && Math.abs(deltaY) < 40) {
    if (!document.getElementById("settings-page-2").classList.contains("hidden")) {
      document.getElementById("settings-page-2").classList.add("hidden")
      document.getElementById("settings-page-1").classList.remove("hidden")
    }
    if (!document.getElementById("settings-page-3").classList.contains("hidden")) {
      document.getElementById("settings-page-3").classList.add("hidden")
      document.getElementById("settings-page-1").classList.remove("hidden")
    }
  }
}

// Pointer events (desktop + mobile)
document.body.addEventListener("pointerdown", (e) => handleStart(e.clientX, e.clientY));
document.body.addEventListener("pointerup", (e) => handleEnd(e.clientX, e.clientY));

// Touch events fallback (some mobile browsers)
document.body.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  handleStart(t.clientX, t.clientY);
}, { passive: true });

document.body.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  handleEnd(t.clientX, t.clientY);
}, { passive: true });

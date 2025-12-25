const scrollThreshold = 15;
const bottomSearchParent = document.getElementById("bottomSearchParent");
const iconInC = document.getElementById("iconInC");
const triggerSearch = document.getElementById("triggerSearch");
const searchIntelli = document.getElementById("searchIntelli");
const currentVersion = "2.3.0";

let serverIP = "https://data.evoxs.xyz/";
console.log(
  `%cCurrent Build: ${currentVersion}`,
  "color: #8bdd8f; font-family:sans-serif; font-size: 20px"
);
document.getElementById("showUpV").innerText = currentVersion;
localStorage.setItem("currentVersion", currentVersion);
mapboxgl.accessToken =
  "pk.eyJ1IjoicGFwb3N0b2wiLCJhIjoiY2xsZXg0c240MHphNzNrbjE3Z2hteGNwNSJ9.K1O6D38nMeeIzDKqa4Fynw";

let fullLine = null;

let mapboxSourcesArray = [];
let mapboxLayersArray = [];

function openSearch() {
  triggerNearbyStationsSpawn();
  searchIntelli.style.backgroundColor = "#141416";

  bottomSearchParent.style.width = "100vw";
  bottomSearchParent.style.height = "100vh";

  setTimeout(() => {
    bottomSearchParent.style.bottom = "0";
    searchIntelli.style.width =
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? "100%"
        : "auto";
    searchIntelli.style.height = "100%";
    searchIntelli.style.padding = "0"; // Remove padding for fullscreen
    searchIntelli.style.borderRadius = "0";
  }, 100);
  bottomSearchParent.classList.add("scrolled");

  spawnMyLocation();
  setInterval(function () {
    spawnMyLocation();
  }, 500);
  $("#searchIn").fadeOut("fast", function () {
    document.getElementById("insideSearch").style.display = "flex";
    iconInC.style.display = "none";
    triggerSearch.style.display = "none";
    zoomOnMe();
    map.resize();
  });

  spawnOnBarBuses();
}

function spawnOnBarBuses() {
  document.getElementById("recommendSpawn").innerHTML = "";

  //document.getElementById("recommendSpawn").innerHTML += `<div onclick="window.location.href = '../oasaMobile/'" class="Block"><img src="doodle.png" height="20px">
  //</div>`
  //document.getElementById("recommendSpawn").innerHTML += `<div class="Block"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //<g opacity="0.5">
  //<path d="M3 8.70938V16.8377C3 17.8813 3 18.4031 3.28314 18.7959C3.56627 19.1888 4.06129 19.3538 5.05132 19.6838L6.21609 20.072C7.58318 20.5277 8.26674 20.7556 8.95493 20.6634C8.96999 20.6614 8.98501 20.6593 9 20.6569V6.65705C8.88712 6.67391 8.77331 6.68433 8.6591 6.68823C8.11989 6.70664 7.58626 6.52877 6.51901 6.17302C5.12109 5.70705 4.42213 5.47406 3.89029 5.71066C3.70147 5.79466 3.53204 5.91678 3.39264 6.06935C3 6.49907 3 7.23584 3 8.70938Z" fill="#fff"/>
  //<path d="M21 15.2907V7.16229C21 6.11872 21 5.59692 20.7169 5.20409C20.4337 4.81126 19.9387 4.64625 18.9487 4.31624L17.7839 3.92799C16.4168 3.47229 15.7333 3.24444 15.0451 3.3366C15.03 3.33861 15.015 3.34078 15 3.34309V17.343C15.1129 17.3261 15.2267 17.3157 15.3409 17.3118C15.8801 17.2934 16.4137 17.4713 17.481 17.827C18.8789 18.293 19.5779 18.526 20.1097 18.2894C20.2985 18.2054 20.468 18.0833 20.6074 17.9307C21 17.501 21 16.7642 21 15.2907Z" fill="#fff"/>
  //</g>
  //<path d="M9.24685 6.60921C9.16522 6.6285 9.08286 6.64435 9 6.65673V20.6566C9.66964 20.5533 10.2689 20.1538 11.4416 19.3719L12.824 18.4503C13.7601 17.8263 14.2281 17.5143 14.7532 17.3902C14.8348 17.3709 14.9171 17.355 15 17.3427V3.34277C14.3304 3.44613 13.7311 3.84561 12.5583 4.62747L11.176 5.54905C10.2399 6.17308 9.77191 6.48509 9.24685 6.60921Z" fill="#fff"/>
  //<path d="M17.481 17.8267C17.5684 17.8558 17.653 17.884 17.735 17.9113Z" fill="#fff"/>
  //</svg>Σπίτι
  //                    </div>`
  favoriteBuses.forEach((bus) => {
    document.getElementById(
      "recommendSpawn"
    ).innerHTML += `<div onclick="spawnAndShowInfo('${bus}', null, null, 'go', this)" class="Block favorite barup"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#FFF"/>
                  <path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#FFF"/>
                  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"/>
                  <path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#FFF"/>
                  <path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#FFF"/>
                  <path opacity="0.5" d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#FFF"/>
                  <path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#FFF"/>
                  <path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#FFF"/>
                  </svg>${bus}
                                      </div>`;
  });
  frequentBuses.forEach((bus) => {
    document.getElementById(
      "recommendSpawn"
    ).innerHTML += `<div onclick="spawnAndShowInfo('${bus}', null, null, 'go', this)" class="Block barup">${busIcon()}${bus}
                    </div>`;
  });

  const filteredRecents = getRecentSearchs().filter(
    (item) => !frequentBuses.includes(item) && !favoriteBuses.includes(item)
  );

  filteredRecents.forEach((bus) => {
    document.getElementById("recommendSpawn").innerHTML =
      `<div onclick="spawnAndShowInfo('${bus}', null, null, 'go', this)" class="Block recent barup">${busIcon()}${bus}
                    </div>` +
      document.getElementById("recommendSpawn").innerHTML;
  });

  document.getElementById("recommendSpawn").innerHTML =
    `<div onclick="window.location.href = '../'" class="Block"><img src="../evox-epsilon-beta/epsilon-transparent.png" width="20px" height="20px">Evox
                    </div>` +
    document.getElementById("recommendSpawn").innerHTML;
}

function closeSearch() {
  haptics.trigger();
  //triggerNotificationsReload()
  if (document.getElementById("searchContainer").classList.contains("active")) {
    $("#recommendSpawn").fadeIn("fast");
    document.getElementById("searchContainer").classList.remove("active");
    document.getElementById("toSpawnFinds").classList.add("hidden");
    spawnOnBarBuses();
  } else {
    searchIntelli.style.backgroundColor = "transparent";
    bottomSearchParent.style.width = null;
    bottomSearchParent.style.height = "86px";
    bottomSearchParent.style.bottom = "30px";
    searchIntelli.style.width = "auto";
    searchIntelli.style.height = "auto";
    searchIntelli.style.padding = "18px 20px";
    searchIntelli.style.borderRadius = "50px";

    document.getElementById("insideSearch").style.display = "none";
    searchIntelli.style.backgroundColor = null;
    iconInC.style.display = null;
    triggerSearch.style.display = null;
    bottomSearchParent.classList.remove("scrolled");
    $("#searchIn").fadeIn("fast", function () { });

    document.getElementById("map-bus-info").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("map-bus-info").style.display = "none";
    }, 400);
  }
}

let myLoc;

function getReady() {
  document.getElementById("greeting").textContent = `${greeting()},`;
  document.getElementById("userUsername").textContent = getName();
  if (localStorage.getItem("userImage")) {
    const base64Image = localStorage.getItem("userImage");
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
  }

  fetch(
    `https://florida.evoxs.xyz/activeSchedo?username=${localStorage.getItem(
      "t50-username"
    )}&deviceId=${localStorage.getItem("extV")
      ? localStorage.getItem("extV")
      : localStorage.getItem("extVOASA")
    }&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      let count = 0;
      data.infinite.forEach((item) => {
        count++;
      });

      data.schedo.forEach((item) => {
        count++;
      });
      if (count === 0) {
        document.getElementById("activeNotifs").style.display = "none";
      } else {
        document.getElementById("activeNotifs").style.display = "flex";
      }
      document.getElementById("activeNotifs").innerHTML = count;
    })
    .catch((error) => {
      console.log("Load Florida List Error:", error);
    });

  function boot(lat, long) {
    const latitude = lat;
    const longitude = long;
    console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    locationReady = true;
    const loc = [longitude, latitude];
    myLoc = loc;
    spawnBlocks(myLoc);
    setTimeout(function () {
      //showdemo()
      if (isPreviousNearby(myLoc)) {
        console.log("Working On Previous");
        const previousLocation = localStorage.getItem("previousLocation");
        const data = JSON.parse(previousLocation);
        const placeFeature = data.features.find(
          (feature) =>
            feature.place_type.includes("place") ||
            feature.place_type.includes("locality")
        );
        const cityOrAreaName = placeFeature.text; // This gives the area or city name
        console.log("City/Area name:", cityOrAreaName);

        // Update the UI
        //document.getElementById("nearYouSkel").style.display = 'none';
        //document.getElementById("nearYou").style.display = null;
        document.getElementById("locationName").innerHTML =
          toAccusative(cityOrAreaName) || "Unknown location";
        updateLocation(cityOrAreaName);
      } else {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${loc[0]},${loc[1]
          }.json?access_token=${mapboxgl.accessToken
          }&language=el&vevox=${randomString()}`
        )
          .then((response) => response.json())
          .then((data) => {
            localStorage.setItem("previousLocation", JSON.stringify(data));
            console.log(data);
            // Find the feature with type 'place' or 'locality'
            const placeFeature = data.features.find(
              (feature) =>
                feature.place_type.includes("place") ||
                feature.place_type.includes("locality")
            );

            if (placeFeature) {
              const cityOrAreaName = placeFeature.text; // This gives the area or city name
              console.log("City/Area name:", cityOrAreaName);

              // Update the UI
              //document.getElementById("nearYouSkel").style.display = 'none';
              //document.getElementById("nearYou").style.display = null;
              document.getElementById("locationName").innerHTML =
                toAccusative(cityOrAreaName) || "Unknown location";
              updateLocation(cityOrAreaName);

              if (cityOrAreaName.length > 12) {
                document
                  .getElementById("locationName")
                  .classList.remove("glowUpGB");
                document
                  .getElementById("locationName")
                  .classList.add("glowUpGBSM");
              } else {
                document
                  .getElementById("locationName")
                  .classList.remove("glowUpGBSM");
                document
                  .getElementById("locationName")
                  .classList.add("glowUpGB");
                document.getElementById("locationName").style.fontSize = null;
              }
            } else {
              console.error("City or area name not found in the response.");
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    }, 400);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        boot(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        //alert(error.message)
        boot(37.9838, 23.7275); // Default to Athens if geolocation fails
        //spawnBlocks(myLoc)
        //bypassAny()

        console.log("Error code: " + error.code + " - " + error.message);
      }
    );
  } else {
    //spawnBlocks(myLoc)
    alert("Geolocation is not supported by this browser.");
  }

  if (location.protocol !== "https:") {
    navigator.geolocation.getCurrentPosition = function (
      successCallback,
      errorCallback
    ) {
      successCallback({
        coords: {
          latitude: 37.9838,
          longitude: 23.7275,
          accuracy: 100,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    };
  }
}

function bypassAny() {
  locationReady = true;
  const loc = myLoc;
  myLoc = loc;
  spawnBlocks(myLoc);
  setTimeout(function () {
    //showdemo()
    if (isPreviousNearby(myLoc)) {
      console.log("Working On Previous");
      const previousLocation = localStorage.getItem("previousLocation");
      const data = JSON.parse(previousLocation);
      const placeFeature = data.features.find(
        (feature) =>
          feature.place_type.includes("place") ||
          feature.place_type.includes("locality")
      );
      const cityOrAreaName = placeFeature.text; // This gives the area or city name
      console.log("City/Area name:", cityOrAreaName);

      // Update the UI
      //document.getElementById("nearYouSkel").style.display = 'none';
      //document.getElementById("nearYou").style.display = null;
      document.getElementById("locationName").innerHTML =
        toAccusative(cityOrAreaName) || "Unknown location";
      updateLocation(cityOrAreaName);
    } else {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${loc[0]},${loc[1]
        }.json?access_token=${mapboxgl.accessToken
        }&language=el&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("previousLocation", JSON.stringify(data));
          console.log(data);
          // Find the feature with type 'place' or 'locality'
          const placeFeature = data.features.find(
            (feature) =>
              feature.place_type.includes("place") ||
              feature.place_type.includes("locality")
          );

          if (placeFeature) {
            const cityOrAreaName = placeFeature.text; // This gives the area or city name
            console.log("City/Area name:", cityOrAreaName);

            // Update the UI
            //document.getElementById("nearYouSkel").style.display = 'none';
            //document.getElementById("nearYou").style.display = null;
            document.getElementById("locationName").innerHTML =
              toAccusative(cityOrAreaName) || "Unknown location";
            updateLocation(cityOrAreaName);

            if (cityOrAreaName.length > 12) {
              document
                .getElementById("locationName")
                .classList.remove("glowUpGB");
              document
                .getElementById("locationName")
                .classList.add("glowUpGBSM");
            } else {
              document
                .getElementById("locationName")
                .classList.remove("glowUpGBSM");
              document.getElementById("locationName").classList.add("glowUpGB");
              document.getElementById("locationName").style.fontSize = null;
            }
          } else {
            console.error("City or area name not found in the response.");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, 400);
}
let map;

function spawnBlocks(currentLocation) {
  if (
    !currentLocation ||
    currentLocation.length !== 2 ||
    isNaN(currentLocation[0]) ||
    isNaN(currentLocation[1])
  ) {
    console.warn("Invalid location data for spawning blocks:", currentLocation);
    return;
  }

  console.log("Initializing map with location:", currentLocation);

  map = new mapboxgl.Map({
    container: "map-io",
    style:
      localStorage.getItem("map_style") || "mapbox://styles/mapbox/dark-v11",
    center: currentLocation,
    zoom: 14,
    maxZoom: 20,
    minZoom: 12,
    pitch: 0,
    bearing: 0,
    antialias: false,
    fadeDuration: 0,
    prefetchZoomDelta: 0,
    renderWorldCopies: false,
    trackResize: false,
    attributionControl: false,
  });

  //markers(currentLocation, 'me');
}

let markers_global = [];
let locationMarker = [];

function spawnFallback(bus, descr, section) {
  if (localStorage.getItem(`${bus}_Timetable_go`)) {
    //alert(`Found ${bus} in local storage`)
    try {
      const data = JSON.parse(localStorage.getItem(`${bus}_Timetable_go`));
      const times = JSON.parse(localStorage.getItem(`${bus}_Times_go`));
      const nextBusTime = getNextBusTimeLIVE(times);

      if (nextBusTime) {
        spawnInFeed(
          bus,
          descr,
          nextBusTime,
          displayRemainingTimeLIVE(nextBusTime),
          section,
          "preload"
        );
      } else {
        const [hour, minutes] = times[0].split(":").map(Number);
        const workingTime = { hour, minutes };
        //alert(`Fallback: ${JSON.stringify(workingTime)}\n${bus}`)
        console.warn(
          `SPAWNFALLBACK\nFailed to find next bus time for ${bus}.\nWorking on the first value in schedule\nTimes:`,
          times
        );
        spawnInFeed(
          bus,
          descr,
          workingTime,
          displayRemainingTimeLIVE(workingTime),
          section,
          "preload"
        );
      }
    } catch (error) {
      console.log(`preOffline: ${error}`);
      alert(`preOffline: ${error}`);
    }
  }
}

let mylocationMarker = null;

function displayRemainingTimeLIVE(nextBusTime, elid) {
  //console.log("Running", JSON.stringify(nextBusTime), "for", elid);
  const currentTime = new Date();
  const nextBusDate = new Date();

  // Explicitly set the hours, minutes, and seconds for the next bus time
  nextBusDate.setHours(nextBusTime.hour, nextBusTime.minutes, 0, 0);

  // If the next bus time is earlier than the current time, assume it's the next day
  if (nextBusDate <= currentTime) {
    nextBusDate.setDate(nextBusDate.getDate() + 1);
  }

  const remainingTimeMs = nextBusDate - currentTime;
  const remainingMinutes = Math.floor(remainingTimeMs / 1000 / 60);

  //console.log("Result", JSON.stringify(nextBusTime), "for", `${remainingMinutes} minutes`);
  return remainingMinutes;
}

//fetch(`${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(`https://telematics.oasa.gr/api/?act=getRoutesForLine&p1=${lineCode}&keyOrigin=evoxEpsilon`)}`)
//  .then(response => response.json())
//  .then(data => {
//    if (data) {
//      const routeCode = data[0].route_code
//      currentRouteCode = routeCode
//      console.log(routeCode)
//      fetch(`${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(`https://telematics.oasa.gr/api/?act=webGetRoutesDetailsAndStops&p1=${routeCode}&keyOrigin=evoxEpsilon`)}`)
//        .then(response => response.json())
//        .then(bata => {
//          currentLineInfo = bata
//          let stopPromises = bata.stops.map(stop => {
//            return new Promise((resolve, reject) => {
//              console.log(stop.StopDescr);
//
//              // Resolve the promise after the stop is processed
//              resolve();
//            });
//          });
//
//          // Wait for all promises to resolve (i.e., all stops are spawned)
//          Promise.all(stopPromises)
//            .then(() => {
//              // Code to run after all elements are spawned
//              console.log('All stops have been spawned!');
//              // Add additional functionality here
//            })
//            .catch(err => {
//              console.error('An error occurred while spawning stops:', err);
//            });
//        })
//        .catch(error => {
//          console.log("FindStops [2] error:", error)
//          if (error.toString().includes('Unexpected token')) {
//            //alert("OASA SQL error. Δοκιμάστε ξανά.")
//            console.warn("Attempting to fix")
//            findStops(lineCode, sentElementByfindBus)
//          }
//        })
//    }
//
//  })
//  .catch(error => {
//    console.log("FindStops [1] error:", error)
//    if (error.toString().includes('Unexpected token')) {
//      //alert("OASA SQL error. Δοκιμάστε ξανά.")
//      console.warn("Attempting to fix")
//      findStops(lineCode, sentElementByfindBus)
//    }
//  })

function loadSection(section, bus) {
  console.warn("Loading section", section, "for bus", bus);
  let matchingLines = fullLine.filter((line) => line.LineID === bus);
  if (!matchingLines.length) {
    console.warn(`No matching lines found for bus: ${bus}`);
    return;
  }

  //alert(`loadOasa: ${bus}`)
  let { LineDescr: descr, LineCode: lineCode } = matchingLines[0];
  if (personalizedAutoBus[bus]) {
    console.warn("Attempting intelligence...");
    const searchLineCode = personalizedAutoBus[bus];
    const result = matchingLines.filter(
      (item) => item.LineCode === searchLineCode
    );
    ({ LineDescr: descr, LineCode: lineCode } = result[0]);
    if (result.length > 1) {
      alert(
        `More than one matches found. Will proceed with first. ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
  }

  try {
    function theSchedule(data) {
      if (!data || (!data.come && !data.go)) {
        console.warn(`No schedule data found for bus: ${bus}`);
        return;
      }

      //console.log(`Schedule data for ${bus}:`, data);

      // Extract times
      const times = data.go.map((item) => formatTime(item.sde_start1));
      //console.log(`Formatted times for ${bus}:`, times);

      // Determine the next bus time
      const nextBusTime = getNextBusTimeLIVE(times);

      if (nextBusTime) {
        // Store data locally
        localStorage.setItem(`${bus}_Timetable_go`, JSON.stringify(data));
        localStorage.setItem(`${bus}_Times_go`, JSON.stringify(times));

        // Display in feed
        //alert(`Default work ${JSON.stringify(nextBusTime)}`)
        spawnInFeed(
          bus,
          descr,
          nextBusTime,
          displayRemainingTimeLIVE(nextBusTime),
          section
        ); //section is 'frequent', 'favorite', or 'famous'
      } else {
        //use times[0] as a fallback
        try {
          const [hour, minutes] = times[0].split(":").map(Number);
          const workingTime = { hour, minutes };
          //alert(`Fallback: ${JSON.stringify(workingTime)}\n${bus}`)
          //alert(`loadOasa Failed\nfailed why?:\nnextBusTime returned: ${JSON.stringify(nextBusTime)}\nTimes: ${JSON.stringify(times)}\nBus on work: ${bus}`);
          console.warn(
            `Failed to find next bus time for ${bus}.\nWorking on the first value in schedule\nTimes:`,
            times
          );
          spawnInFeed(
            bus,
            descr,
            workingTime,
            displayRemainingTimeLIVE(workingTime),
            section
          ); //section is 'frequent', 'favorite', or 'famous'
        } catch (error) {
          //work on localStorage
          if (localStorage.getItem(`${bus}_Times_go`)) {
            const times = JSON.parse(localStorage.getItem(`${bus}_Times_go`));
            const nextBusTime = getNextBusTimeLIVE(times);
            if (nextBusTime) {
              spawnInFeed(
                bus,
                descr,
                nextBusTime,
                displayRemainingTimeLIVE(nextBusTime),
                section
              ); //section is 'frequent', 'favorite', or 'famous'
            } else {
              spawnFallback(bus, descr, section);
            }
          } else {
            console.log(`loadOasa fallback error: ${error}`);
            spawnInFeed(bus, descr, nextBusTime, "Άγνωστη", section); //section is 'frequent', 'favorite', or 'famous'
          }
        }
      }
    }
    fetch(
      `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
        `https://telematics.oasa.gr/api/?act=getDailySchedule&line_code=${lineCode}&keyOrigin=evoxEpsilon`
      )}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(
          `dailySchedule_${lineCode}_go`,
          JSON.stringify(data)
        );
        theSchedule(data);
      })
      .catch((error) => {
        //const lc_Temp = localStorage.getItem(`dailySchedule_${lineCode}`)
        //if (lc_Temp) {
        //  theSchedule(JSON.parse(lc_Temp))
        //} else {
        //  console.error(`Error fetching schedule for ${bus}:`, error);
        //}
        spawnFallback(bus, descr, section);
      });
  } catch {
    spawnFallback(bus, descr, section);
  }
}

let evoxIds = {};

let personalizedAutoBus = {
  831: "874",
}; // This will contain bus Ids and which lineCode they have eg. { "831": "1228" } for bus "ΠΕΙΡΑΙΑΣ-ΑΙΓΑΛΕΩ (ΕΝΑΛΛΑΚΤΙΚΗ ΛΟΓΩ ΛΑΪΚΗΣ ΚΑΘΕ ΔΕΥΤΕΡΑ)"

if (localStorage.getItem("personalizedAutoBus")) {
  const temp = JSON.parse(localStorage.getItem("personalizedAutoBus"));
  personalizedAutoBus = temp;
  console.log("set local personalization skipped.");
}
let frequentBuses_Sort = []; // Array to store bus data for sorting
let favoriteBuses_Sort = [];
let famousBuses_Sort = [];
const busesMap = {
  frequent: frequentBuses_Sort,
  favorite: favoriteBuses_Sort,
  famous: famousBuses_Sort,
};

let lastFavStationsParsed = null;

function spawnInFeed(bus, descr, nextBusTime, timeInM, type, isPreload) {
  const section = type;
  const Div = document.getElementById(section);
  if (!Div) return;

  if (Div.innerHTML.includes("skeleton")) Div.innerHTML = "";

  const selectedSection = busesMap[section];
  if (!Array.isArray(selectedSection)) return;

  const timeValue =
    timeInM === "Άγνωστη" ? Infinity : parseInt(timeInM, 10) || Infinity;

  const existingIndex = selectedSection.findIndex((item) => item.bus === bus);
  if (existingIndex !== -1) selectedSection.splice(existingIndex, 1);

  selectedSection.push({ bus, descr, nextBusTime, timeInM: timeValue });
  selectedSection.sort((a, b) => a.timeInM - b.timeInM);

  const fragment = document.createDocumentFragment();

  selectedSection.forEach((busData, index) => {
    const highlight = index === 0 && section === "frequent" ? "favorite" : "";
    const evoxId = generateRandomId(10);
    const multiple = findBusBlocksByLineId(busData.bus);
    const displayTime =
      busData.timeInM === Infinity
        ? "Άγνωστη"
        : formatTimeToMin(convertTimeApprox(busData.timeInM));
    const tmp = `parallax-${randomString()}`;

    evoxIds[evoxId] = {
      bus: busData.bus,
      descr: busData.descr,
      nextBusTime: busData.nextBusTime,
      timeInM: busData.timeInM === Infinity ? "Άγνωστη" : busData.timeInM,
      type,
      multiple,
    };

    const item = document.createElement("div");
    item.className = `item ${highlight}${isPreload ? " isPreloaded" : ""}${selectedSection.length === 1 ? " fullWidth" : ""
      }`;
    item.innerHTML = `
    <div class="busName glowUpGlobaltxt_title">${busData.bus}</div>
          <div class="info">
            <div class="text">
              <span>Επόμενη άφιξη</span>
              <span id="${tmp}">${displayTime}</span>
            </div>
          </div>
          <div class="fav-actions">
            <div onclick="processInfo('${evoxId}', 'getTimes')" class="button-action important">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM15.8321 14.5547C15.5257 15.0142 14.9048 15.1384 14.4453 14.8321L11.8451 13.0986C11.3171 12.7466 11 12.1541 11 11.5196L11 11.5L11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7L13 11.4648L15.5547 13.1679C16.0142 13.4743 16.1384 14.0952 15.8321 14.5547Z" class="${busData === selectedSection[0] && section !== "frequent"
        ? "clock-bg on"
        : "clock-bg"
      }" />
              </svg>
            </div>
            <div onclick="showOnMap('${evoxId}')" class="button-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                  <path opacity="0.5" d="M3 13.0368C3 11.9338 3 11.3823 3.39264 11.0607C3.53204 10.9465 3.70147 10.8551 3.89029 10.7922C4.42213 10.6151 5.12109 10.7895 6.51901 11.1383C7.58626 11.4046 8.11989 11.5377 8.6591 11.5239C8.85714 11.5189 9.05401 11.4991 9.24685 11.465C9.77191 11.3721 10.2399 11.1386 11.176 10.6715L12.5583 9.98161C13.7574 9.38327 14.3569 9.0841 15.0451 9.01511C15.7333 8.94613 16.4168 9.11668 17.7839 9.45779L18.9487 9.74842C19.9387 9.99544 20.4337 10.119 20.7169 10.413C21 10.707 21 11.0976 21 11.8788V17.9632C21 19.0662 21 19.6177 20.6074 19.9393C20.468 20.0535 20.2985 20.1449 20.1097 20.2078C19.5779 20.3849 18.8789 20.2105 17.481 19.8617C16.4137 19.5954 15.8801 19.4623 15.3409 19.4761C15.1429 19.4811 14.946 19.5009 14.7532 19.535C14.2281 19.6279 13.7601 19.8614 12.824 20.3285L11.4417 21.0184C10.2426 21.6167 9.64311 21.9159 8.95493 21.9849C8.26674 22.0539 7.58319 21.8833 6.21609 21.5422L5.05132 21.2516C4.06129 21.0046 3.56627 20.881 3.28314 20.587C3 20.293 3 19.9024 3 19.1212V13.0368Z" fill="#fff"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C8.68629 2 6 4.55211 6 7.70031C6 10.8238 7.91499 14.4687 10.9028 15.7721C11.5993 16.076 12.4007 16.076 13.0972 15.7721C16.085 14.4687 18 10.8238 18 7.70031C18 4.55211 15.3137 2 12 2ZM12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" fill="#fff"></path>
              </svg>
            </div>
          </div>
    `;
    fragment.appendChild(item);
    handleFavoriteOverrides(bus, selectedSection, section, isPreload, busData);
  });

  Div.innerHTML = "";
  Div.appendChild(fragment);
}

function handleFavoriteOverrides(
  bus,
  selectedSection,
  section,
  isPreload,
  busData
) {
  let favStations = localStorage.getItem("favorite_stations");
  if (!favStations) return;

  try {
    favStations = JSON.parse(favStations).reverse();
    lastFavStationsParsed = favStations;
  } catch {
    return;
  }

  const node = favStations.find((st) => st.busLink === bus);
  if (!node) return;

  const stationArrivals = encodeURIComponent(
    `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${node.stopCode}&keyOrigin=evoxEpsilon`
  );
  const evoxId = generateRandomId(10);

  fetch(
    `${serverIP}proxy?key=21&targetUrl=${stationArrivals}&vevox=${randomString()}`
  )
    .then((r) => r.json())
    .then((data) => {
      const match = data.find((b) => b.route_code === node.busRoute);
      if (!match) {
        console.warn("No bus coming to:", node.stopName);
        return;
      }

      const finalTime = formatTimeToMin(convertTimeApprox(match.btime2));
      const tmp = `parallax-${randomString()}`;
      const highlight =
        selectedSection[0].bus === bus && section !== "frequent"
          ? "favorite"
          : "";

      evoxIds[evoxId] = {
        bus,
        descr: node.stopName,
        nextBusTime: finalTime,
        timeInM: match.btime2,
        type: section,
        multiple: findBusBlocksByLineId(bus),
      };

      const Div = document.getElementById("stations");

      if (!Div) return;
      if (Div.innerHTML.includes("skeleton")) {
        Div.innerHTML = "";
        document.getElementById("stationsHidden").style.display = null;
      }

      const item = document.createElement("div");
      item.className = `item favorite justBorder${isPreload ? " isPreloaded" : ""
        }${selectedSection.length === 1 ? " fullWidth" : ""}`;
      item.innerHTML = `
      <div class="busName glowUpGlobaltxt_title">${bus}</div>
          <div class="info">
            <div class="text">
              <span>${node.stopName}</span>
              <span id="${tmp}">${finalTime}</span>
            </div>
          </div>
          <div class="fav-actions">
            <div onclick="processInfo('${evoxId}', 'getTimes')" class="button-action important">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM15.8321 14.5547C15.5257 15.0142 14.9048 15.1384 14.4453 14.8321L11.8451 13.0986C11.3171 12.7466 11 12.1541 11 11.5196L11 11.5L11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7L13 11.4648L15.5547 13.1679C16.0142 13.4743 16.1384 14.0952 15.8321 14.5547Z" 
                class="${busData === selectedSection[0] && section !== "frequent"
          ? "clock-bg on"
          : "clock-bg"
        }" />
              </svg>
            </div>
            <div onclick="showOnMap('${evoxId}')" class="button-action">
              <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                  <path opacity="0.5" d="M3 13.0368C3 11.9338 3 11.3823 3.39264 11.0607C3.53204 10.9465 3.70147 10.8551 3.89029 10.7922C4.42213 10.6151 5.12109 10.7895 6.51901 11.1383C7.58626 11.4046 8.11989 11.5377 8.6591 11.5239C8.85714 11.5189 9.05401 11.4991 9.24685 11.465C9.77191 11.3721 10.2399 11.1386 11.176 10.6715L12.5583 9.98161C13.7574 9.38327 14.3569 9.0841 15.0451 9.01511C15.7333 8.94613 16.4168 9.11668 17.7839 9.45779L18.9487 9.74842C19.9387 9.99544 20.4337 10.119 20.7169 10.413C21 10.707 21 11.0976 21 11.8788V17.9632C21 19.0662 21 19.6177 20.6074 19.9393C20.468 20.0535 20.2985 20.1449 20.1097 20.2078C19.5779 20.3849 18.8789 20.2105 17.481 19.8617C16.4137 19.5954 15.8801 19.4623 15.3409 19.4761C15.1429 19.4811 14.946 19.5009 14.7532 19.535C14.2281 19.6279 13.7601 19.8614 12.824 20.3285L11.4417 21.0184C10.2426 21.6167 9.64311 21.9159 8.95493 21.9849C8.26674 22.0539 7.58319 21.8833 6.21609 21.5422L5.05132 21.2516C4.06129 21.0046 3.56627 20.881 3.28314 20.587C3 20.293 3 19.9024 3 19.1212V13.0368Z" fill="#fff"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C8.68629 2 6 4.55211 6 7.70031C6 10.8238 7.91499 14.4687 10.9028 15.7721C11.5993 16.076 12.4007 16.076 13.0972 15.7721C16.085 14.4687 18 10.8238 18 7.70031C18 4.55211 15.3137 2 12 2ZM12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" fill="#fff"></path>
              </svg>
            </div>
          </div>
      `;
      document
        .getElementById(section)
        .querySelectorAll("div.item")
        .forEach((elem) => {
          if (elem.querySelector(".busName").innerText === bus) {
            elem.remove();
          }
        });
      Div.querySelectorAll("div.item").forEach((elem) => {
        if (elem.querySelector(".busName").innerText === bus) {
          elem.remove();
        }
      });
      Div.insertBefore(item, Div.firstChild); //Append on top
      Div.style.scrollSnapType = "none";
      Div.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        Div.style.scrollSnapType = "x mandatory"; // or whatever your original value is
      }, 100);
    })
    .catch((err) => {
      console.error("Failed to retrieve info from server.", err);
    });
}

function registerPWA() {
  //return; //Remove me after debug
  if (!hasInternetConnection()) {
    console.log("No internet connection. PWA registration skipped.");
    return;
  }

  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    console.log("Service Worker or Push Manager not supported.");
    return;
  }

  window.addEventListener("load", () => {
    function checkAndFixStorage() {
      const extVOASA = localStorage.getItem("extVOASA");
      const extV = localStorage.getItem("extV");

      if (extVOASA && !extV) {
        console.warn("Fixing extVOASA to extV");
        localStorage.setItem("extV", extVOASA);
      } else if (!extVOASA && extV) {
        console.warn("Fixing extV to extVOASA");
        localStorage.setItem("extVOASA", extV);
      }

      // Continue only if one or both keys are missing
      if (!extVOASA || !extV) {
        setTimeout(checkAndFixStorage, 500);
      } else {
        console.log("Both keys exist, stopping checks.");
      }
    }

    checkAndFixStorage();

    if (
      localStorage.getItem("fullLine") &&
      localStorage.getItem("fullLine") !== "null"
    ) {
      fullLine = JSON.parse(localStorage.getItem("fullLine"));
    }
    const allLinesUrl = encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`
    );
    fetch(
      `${serverIP}proxy?key=21&targetUrl=${allLinesUrl}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        fullLine = data;
        localStorage.setItem("fullLine", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Failed to fetch all lines:", error);
      });
    navigator.serviceWorker
      .register("./resign-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );

        // Listen for updates to the service worker
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New update available.");
                  setLoadingState(false);
                  // Notify the user about the update
                  //showUpdateNotification();
                } else {
                  console.log("Content cached for offline use.");
                  setLoadingState(false);
                }
              }
            };
          }
        };

        setupServiceWorkerMessaging();
        fetch(`z-oasa-current-version.evox`)
          .then((response) => response.json())
          .then((data) => {
            if (data.current !== currentVersion) {
              updateServiceWorkerCache();
            }
          })
          .catch((error) => {
            alert("Failed to check for updates..");
          });
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Filter function to find locations within a certain radius
function filterNearbyLocations(myloc, locations, radius) {
  if (!locations || !Array.isArray(locations) || locations.length < 2) {
    console.error("Invalid locations data:", locations);
    return false;
  }

  try {
    const distance = haversineDistance(
      myloc[1],
      myloc[0],
      locations[1],
      locations[0]
    );
    console.log("NEARBY", distance, radius);
    return distance <= radius;
  } catch (error) {
    console.warn(error);
    return true;
  }
}

let activeBusInfo = {
  go: [],
  come: [],
};

let activeEvoxId = null;
let shownTimeTable = 0;
let keepForVerticalStations;
let latestHorizontalIntelligence;
function processInfo(evoxId, type, addMore, comego) {
  haptics.trigger();
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  if (!comego) {
    comego = "go";
  }
  if (evoxId) {
    activeEvoxId = evoxId;
    console.log("gotInfo", evoxIds[evoxId]);
    document.getElementById("top-navigate").classList.add("hidden");
    //$("#userFeed").fadeOut("fast")
    document.getElementById("userFeed").classList.add("focused");
    document.getElementById("busTimetable").style.display = "block";
    setTimeout(function () {
      document.getElementById("busTimetable").classList.add("shown");
    }, 200);

    setTimeout(function () {
      document.getElementById("userFeed").style.display = "none";
    }, 400);

    document.getElementById("searchIntelli").classList.add("notLoaded");
    if (type === "getTimes") {
      document.getElementById("showMoreBusStart").style.display = "none";
      document.getElementById("busGOCOME").innerHTML = "";
      const days = document.getElementById("busInfoDaySelector");
      days.innerHTML = "";
      const busInfo = evoxIds[evoxId];
      let matchingLines = fullLine.filter(
        (line) => line.LineID === busInfo.bus
      );
      console.log("Found Matches:", matchingLines);
      if (personalizedAutoBus[busInfo.bus]) {
        matchingLines = fullLine.filter(
          (line) => line.LineCode === personalizedAutoBus[busInfo.bus]
        );
        console.log("personalizedAutoBus", matchingLines);
      }
      const working = matchingLines[0];
      //alert(JSON.stringify(personalizedAutoBus[busInfo.bus]))
      const descr = working.LineDescr;
      const lineCode = working.LineCode;

      document.getElementById("busInfoID").innerHTML = `${busInfo.bus}`; //${busInfo.multiple ? "<svg width='25px' height='25px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style='transform: rotate(-90deg)'><path d='M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z' fill='#fff'></path></svg>" : ''}`

      let formattedText = descr.replace(/\((.*)\)/, "<br>($1)");
      document.getElementById("busInfoDesc").innerHTML =
        capitalizeWords(formattedText);
      document.getElementById("multiple-routes").innerHTML = "";
      if (busInfo.multiple) {
        try {
          busInfo.multiple.forEach((aroute) => {
            const text = capitalizeWords(
              aroute.LineDescr.match(/\((.*?)\)/)?.[1]
            );
            document.getElementById(
              "multiple-routes"
            ).innerHTML += `<div onclick="switchRouteTo(this)" class="Block${descr === aroute.LineDescr ? " active" : ""
            }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
    <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C10.2843 2 8.90356 3.38071 6.14214 6.14214C3.38071 8.90356 2 10.2843 2 12C2 13.7157 3.38071 15.0964 6.14214 17.8579C8.90356 20.6193 10.2843 22 12 22C13.7157 22 15.0964 20.6193 17.8579 17.8579C20.6193 15.0964 22 13.7157 22 12C22 10.2843 20.6193 8.90356 17.8579 6.14214C15.0964 3.38071 13.7157 2 12 2Z" fill="#fff"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7862 8.48705C13.0695 8.18486 13.5441 8.16955 13.8463 8.45285L16.513 10.9528C16.6642 11.0946 16.75 11.2927 16.75 11.5C16.75 11.7073 16.6642 11.9054 16.513 12.0472L13.8463 14.5472C13.5441 14.8305 13.0695 14.8151 12.7862 14.513C12.5029 14.2108 12.5182 13.7361 12.8204 13.4528L14.1034 12.25H10.6667C10.3329 12.25 9.8225 12.3497 9.4196 12.6216C9.05681 12.8665 8.75 13.2655 8.75 14C8.75 14.4142 8.41421 14.75 8 14.75C7.58579 14.75 7.25 14.4142 7.25 14C7.25 12.7345 7.83208 11.8835 8.5804 11.3784C9.28861 10.9003 10.1116 10.75 10.6667 10.75L14.1034 10.75L12.8204 9.54716C12.5182 9.26386 12.5029 8.78923 12.7862 8.48705Z" fill="#fff"/>
    </svg>${text === "" ? capitalizeWords(aroute.LineDescr) : text}
        </div>`;
          });
        } catch (err) {
          console.error("Failed to load routes");
        }
      }

      function workOnSchedules(data) {
        days.innerHTML += `<div class="Block active">
                                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z" fill="#fff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12ZM17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14ZM17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18ZM13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17ZM7 14C7.55228 14 8 13.5523 8 13C8 12.4477 7.55228 12 7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14ZM7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="#fff"/>
</svg>Καθημερινή
                                    </div>`;
        data.forEach((day) => {
          let icon = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3V4.34708C4.35095 4.54034 3.77636 4.8406 3.30848 5.30848C2.74209 5.87488 2.42133 6.59764 2.23866 7.41959C2.05852 8.23018 2 9.19557 2 10.312V15.688C2 16.8044 2.05852 17.7698 2.23866 18.5804C2.42133 19.4024 2.74209 20.1251 3.30848 20.6915C3.87488 21.2579 4.59764 21.5787 5.41959 21.7613C6.23018 21.9415 7.19557 22 8.312 22H15.688C16.8044 22 17.7698 21.9415 18.5804 21.7613C19.4024 21.5787 20.1251 21.2579 20.6915 20.6915C21.2579 20.1251 21.5787 19.4024 21.7613 18.5804C21.9415 17.7698 22 16.8044 22 15.688V10.312C22 9.19557 21.9415 8.23018 21.7613 7.41959C21.5787 6.59764 21.2579 5.87488 20.6915 5.30848C20.2236 4.8406 19.6491 4.54034 19 4.34708V3C19 2.44772 18.5523 2 18 2C17.4477 2 17 2.44772 17 3V4.03477C16.5889 4.01008 16.1515 4 15.688 4H8.312C7.84855 4 7.41113 4.01008 7 4.03477V3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3ZM6 9C6 8.44772 6.44772 8 7 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H7C6.44772 10 6 9.55228 6 9Z" fill="#fff"/></svg>`;
          // Default icon
          console.log(day);
          if (day.sdc_descr_eng.includes("WINTER")) {
            icon = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="12" x2="21" y2="12" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="21" x2="12" y2="3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 17L7 7.00001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 6.99998L7.00001 17" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.58333 11.8999L6 9.99995" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.58333 11.9001L6 13.8001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 11.9001L17.5833 13.8001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 11.9L17.5833 10" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9001 7.58334L13.8001 6.00001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9 7.58334L10 6.00001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9001 17L13.8001 18.5834" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9 17L10 18.5834" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
          }
          console.log("Day is", day.sdc_descr);
          days.innerHTML += `<div class="Block">
                                        ${icon}${capitalizeWords(day.sdc_descr)}
                                    </div>`;
        });
      }
      fetch(
        `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=getScheduleDaysMasterline&p1=${lineCode}&keyOrigin=evoxEpsilon`
        )}&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem(
            `scheduleDays_${lineCode}_${comego}`,
            JSON.stringify(data)
          );
          workOnSchedules(data);
        })
        .catch((error) => {
          if (localStorage.getItem(`scheduleDays_${lineCode}_${comego}`)) {
            const workOn = localStorage.getItem(
              `scheduleDays_${lineCode}_${comego}`
            );
            const data = JSON.parse(workOn);
            workOnSchedules(data);
          } else {
            console.log("Load Bus Times List Error:", error);
          }
        });
      document.getElementById(
        "timetableSpawn"
      ).innerHTML = `<div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>
      <div class="timeItem skeleton-button2"></div>`; // Clear existing content
      function dailySchedule(data) {
        activeBusInfo = data;
        const splitter = splitValue(busInfo.descr);
        console.log("The data:", data);
        if (data.go) {
          console.log("result", busInfo.descr);
          const result = splitter.getSecondPart(); // Trim any leading or trailing spaces
          console.log("result", result);
          document.getElementById("busGOCOME").innerHTML += `<div class="Block${comego === "go" ? " active" : ""
            }" onclick="switchTo('go', this)">
                                        <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36 7L43 13.4615L36 21" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 14H17.0062C10.1232 14 4.27787 19.6204 4.00964 26.5C3.72612 33.7696 9.73291 40 17.0062 40H34.0016" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Προς ${capitalizeWords(result)}
                                    </div>`;
        }

        if (data.come) {
          const result = splitter.getFirstPart();
          document.getElementById("busGOCOME").innerHTML += `<div class="Block${comego === "come" ? " active" : ""
            }" onclick="switchTo('come', this)">
                                        <svg fill="#fff" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M0 21.984q0.032-0.8 0.608-1.376l4-4q0.448-0.48 1.056-0.576t1.12 0.128 0.864 0.736 0.352 1.12v1.984h18.016q0.8 0 1.408-0.576t0.576-1.408v-8q0-0.832-0.576-1.408t-1.408-0.608h-16q-0.736 0-1.248-0.416t-0.64-0.992 0-1.152 0.64-1.024 1.248-0.416h16q2.464 0 4.224 1.76t1.76 4.256v8q0 2.496-1.76 4.224t-4.224 1.76h-18.016v2.016q0 0.64-0.352 1.152t-0.896 0.704-1.12 0.096-1.024-0.544l-4-4q-0.64-0.608-0.608-1.44z"></path>
</svg>Προς ${capitalizeWords(result)}
                                    </div>`;
        }
        if (
          data.come.length === 0 &&
          data.go.length === 0 &&
          !localStorage.getItem(`${busInfo.bus}_Times_${comego}`)
        ) {
          console.log(data);
          console.log("Spawning For", lineCode, "Stopped.");
          document.getElementById(
            "timetableSpawn"
          ).innerHTML = `<div class="failed">
    <img src="snap.png" class="failed-icon">
    <vox class="failed-message">Δεν βρέθηκαν δεδομένα</vox>
    <span class="failed-subtext">Δοκιμάστε αργότερα ή επανεκκινήστε την εφαρμογή</span>
</div>
`;
          return;
        } else {
          console.log("Come and go for ", busInfo, "\n", data);
        }

        console.log(
          "Success",
          lineCode,
          fullLine.filter((line) => line.LineCode === lineCode)
        );
        console.warn("Selected:", comego, "with:", data[comego]);
        let times = data[comego].map((item) => {
          //console.warn('ITEMVOX:', item.sde_start1, item.sde_start2)
          return formatTime(
            item[`${comego === "go" ? "sde_start1" : "sde_start2"}`]
          );
        });
        console.log("Current times:", times);
        if (times.length === 0) {
          document.getElementById(
            "timetableSpawn"
          ).innerHTML = `<div class="failed">
    <img src="snap.png" class="failed-icon">
    <vox class="failed-message">Δεν βρέθηκαν δεδομένα</vox>
    <span class="failed-subtext">${capitalizeWords(formattedText).includes("κυκλικη")
              ? "Η διαδρομή του λεωφορείου είναι κυκλική.<br>Δεν υπάρχουν δρομολόγια για επιστροφή."
              : "Δεν υπάρχει διαθέσιμη διαδρομή επιστροφής για αυτό το λεωφορείο."
            }</span>
</div>
`;
        }

        // Find the next bus time
        const nextBusTime = getNextBusTimeLIVE(times);
        let isLocal = false;
        if (nextBusTime) {
          localStorage.setItem(
            `${busInfo.bus}_Timetable_${comego}`,
            JSON.stringify(data)
          );
          localStorage.setItem(
            `${busInfo.bus}_Times_${comego}`,
            JSON.stringify(times)
          );

          // Create the HTML content dynamically for each time
        } else {
          try {
            const timesNew = localStorage.getItem(
              `${busInfo.bus}_Times_${comego}`
            );
            if (timesNew) {
              times = JSON.parse(timesNew);
              isLocal = true;
            } else {
              console.warn("Cannot fallback.");
              if (!capitalizeWords(formattedText).includes("κυκλικη")) {
                document
                  .getElementById("timetableSpawn")
                  .classList.add("fade-out-slide-down");
                setTimeout(function () {
                  document.getElementById(
                    "timetableSpawn"
                  ).innerHTML = `<div class="failed">
    <img src="snap.png" class="failed-icon">
    <vox class="failed-message">Δεν βρέθηκαν δεδομένα</vox>
    <span class="failed-subtext">Δεν υπάρχει διαθέσιμη διαδρομή επιστροφής για αυτό το λεωφορείο.</span>
</div>
`;
                  document
                    .getElementById("timetableSpawn")
                    .classList.remove("fade-out-slide-down");
                  document
                    .getElementById("timetableSpawn")
                    .classList.add("fade-in-slide-up");
                }, 500);
              }

              return;
            }
          } catch {
            console.error("Failed to find times for", busInfo.bus);
          }
          //try {
          //  if(times[0]) {
          //    const [hour, minutes] = times[0].split(":").map(Number);
          //    const workingTime = { hour, minutes };
          //    //alert(`Fallback: ${JSON.stringify(workingTime)}\n${bus}`)
          //    console.warn(`processInfo\nFailed to find next bus time for ${busInfo.bus}.\nWorking on the first value in schedule\nTimes:`, times);
          //    spawnInFeed(busInfo.bus, descr, workingTime, displayRemainingTimeLIVE(workingTime), 'frequent')
          //    //alert(`failed why?:\n${JSON.stringify(nextBusTime)}\n${JSON.stringify(times)}\nBus on work: ${busInfo.bus}`);
          //    //
          //  } else {
          //    spawnInFeed(busInfo.bus, descr, nextBusTime, 'Άγνωστη', 'frequent')
          //    console.log("No times found", times[0])
          //  }
          //
          //} catch (error) {
          //  console.error('Fallback Error:', error);
          //  spawnInFeed(busInfo.bus, descr, nextBusTime, 'Άγνωστη', 'frequent')
          //}
        }

        let timetableContent = "";
        const remains = getNextBuses(times, addMore ? addMore : 21);
        shownTimeTable = shownTimeTable + addMore ? addMore : 21;
        const previous = getPreviousBuses(times);
        if (previous[0]) {
          const value = previous[0].time;
          const currentTime = new Date();
          const [hours, minutes] = value.split(":").map(Number);
          const targetTime = new Date();
          targetTime.setHours(hours, minutes, 0, 0);
          const diffInMinutes = (currentTime - targetTime) / (1000 * 60);
          const result = diffInMinutes < 90 ? "Ενεργό" : "Χαμένο";
          //var textNode = document.createTextNode(result);
          //previousTimeBox.appendChild(textNode);
          //var span = document.createElement('span');
          //span.innerHTML = ``;
          //previousTimeBox.appendChild(span);
          //document.getElementById("evoxBased").appendChild(previousTimeBox);
          currentInfoForSchedo = {
            bus: busInfo.bus,
            match: working,
            isLocal: isLocal,
          };
          timetableContent += `<div class="previous fade-in-slide-up timeItem ${isLocal ? "isLocal" : ""
            }" onclick="showDetailedTime('${previous[0].time
              .replace(/<\/?vox>/g, "")
              .replace(/ .*$/, "")}','previous' , '${result}')">
        <p>${result}</p>
        <div class="actions" style="display:flex;flex-direction: column;justify-content: center;align-items: flex-end;">
          <vox style="text-decoration: line-through;">${previous[0].time
            }</vox><span style='font-size: 0.9rem;margin-top:4px;'>${previous[0].formatted
            }</span>
        </div>
      </div>`;
        }
        remains.forEach((time, index) => {
          document.getElementById("showMoreBusStart").style.display = null;
          timetableContent += `
      <div class="timeItem fade-in-slide-up${previous[0] && index === 0 ? " isNext" : ""
            } ${isLocal ? "isLocal" : ""
            }" onclick="this.querySelector('.actions lord-icon').playerInstance.play();setTimeout(function() {showDetailedTime('${time
              .replace(/<\/?vox>/g, "")
              .replace(/<\/?vox>/g, "")
              .replace(/ .*$/, "")}','next')}, 600)">
      <p>${time}</p>
        <div class="actions">
        ${isLocal
              ? `<img style='width:20px;height:20px'
                                src="snap.png">`
              : ""
            }
          
                                  <lord-icon
                                    src="https://cdn.lordicon.com/zllgguxq.json" colors="primary:#fff,secondary:#b4b4b4"
                                    style="width:25px;height:25px;margin-left:5px;${!localStorage.getItem("extVOASA")
              ? "display: none"
              : ""
            }">
                                  </lord-icon>
        </div>
      </div>
    `;
        });

        // Insert the content into the element

        document.getElementById("timetableSpawn").innerHTML = timetableContent;
      }
      fetch(
        `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=getDailySchedule&line_code=${lineCode}&keyOrigin=evoxEpsilon`
        )}&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem(
            `dailySchedule_${lineCode}_${comego}`,
            JSON.stringify(data)
          );
          dailySchedule(data);
        })
        .catch((error) => {
          const lc_Temp = localStorage.getItem(
            `dailySchedule_${lineCode}_${comego}`
          );
          if (lc_Temp) {
            dailySchedule(JSON.parse(lc_Temp));
          } else {
            console.log("Load Favorite Times Error:", error);
          }

          //document.getElementById("netStats").innerHTML = offlineSvg
          //spawnFallback(bus)
        });

      //Start finding stations info
      if (!addMore) {
        const container = document.getElementById("stationsSpawnInner");
        container.innerHTML = `<div class="item skeleton">
                                    <div class="busName skeleton-text"></div>
                                    <div class="info">
                                        <div class="text">
                                            <span class="skeleton-text"></span>
                                            <span class="skeleton-text"></span>
                                        </div>
                                    </div>
                                    <div class="fav-actions">
                                        <div class="button-action skeleton-button important"></div>
                                        <div class="button-action skeleton-button"></div>
                                    </div>
                                </div><div class="item skeleton">
                                    <div class="busName skeleton-text"></div>
                                    <div class="info">
                                        <div class="text">
                                            <span class="skeleton-text"></span>
                                            <span class="skeleton-text"></span>
                                        </div>
                                    </div>
                                    <div class="fav-actions">
                                        <div class="button-action skeleton-button important"></div>
                                        <div class="button-action skeleton-button"></div>
                                    </div>
                                </div><div class="item skeleton">
                                    <div class="busName skeleton-text"></div>
                                    <div class="info">
                                        <div class="text">
                                            <span class="skeleton-text"></span>
                                            <span class="skeleton-text"></span>
                                        </div>
                                    </div>
                                    <div class="fav-actions">
                                        <div class="button-action skeleton-button important"></div>
                                        <div class="button-action skeleton-button"></div>
                                    </div>
                                </div>`;
        console.log("Get this:", busInfo.bus, comego, busInfo);
        findBusInfo2(busInfo.bus, comego, busInfo)
          .then((routeCode) => {
            console.log("Route code found", routeCode);
            if (
              document
                .getElementById("stationsSpawnOut")
                .classList.contains("fade-out-slide-down")
            ) {
              document
                .getElementById("stationsSpawnOut")
                .classList.remove("fade-out-slide-down");
              document
                .getElementById("stationsSpawnOut")
                .classList.add("fade-out-slide-down");
              setTimeout(function () {
                document
                  .getElementById("stationsSpawnOut")
                  .classList.remove("fade-out-slide-down");
              }, 500);
            }
            getRouteStops(routeCode)
              .then((stations) => {
                console.log("Stations found", stations);
                console.log("Found stations", stations);
                container.innerHTML = "";
                if (stations.length === 0) {
                  //Will handle this as error, localstorage returned 0 because fetch failed and localstorage doesnt exist
                  document
                    .getElementById("stationsSpawnOut")
                    .classList.add("fade-out-slide-down");
                  setTimeout(function () {
                    document.getElementById("stationsSpawnOut").style.display =
                      "none";
                    document
                      .getElementById("stationsSpawnOut")
                      .classList.remove("fade-out-slide-down");
                    document
                      .getElementById("stationsSpawnOut")
                      .classList.add("fade-in-slide-up");
                  }, 500);
                  return;
                } else {
                  document.getElementById("stationsSpawnOut").style.display =
                    null;
                }

                stations.forEach((station, index) => {
                  container.innerHTML += `<div class="item" id="global-station-${station.StopCode
                    }">
                                            <div class="stationName">${capitalizeWords(
                      station.StopDescr
                    )}</div>
                                            <div class="info">
                                                <div class="text">
                                                    <span>Επόμενη άφιξη</span>
                                                    <span id="station-${station.StopCode
                    }"><!--<div class="loaderTimes"></div>--><svg class="compassAnim" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
        <path opacity="0.5"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="#8fceff" />
        <path
            d="M13.024 14.5601C13.5166 14.363 13.763 14.2645 13.9562 14.095C14.0055 14.0518 14.0518 14.0055 14.095 13.9562C14.2645 13.763 14.363 13.5166 14.5601 13.024C15.484 10.7142 15.946 9.5593 15.4977 8.89964C15.3914 8.74324 15.2565 8.60834 15.1001 8.50206C14.4405 8.0538 13.2856 8.51575 10.9758 9.43966C10.4831 9.63673 10.2368 9.73527 10.0435 9.90474C9.99429 9.94792 9.94792 9.99429 9.90474 10.0435C9.73527 10.2368 9.63673 10.4831 9.43966 10.9758C8.51575 13.2856 8.0538 14.4405 8.50206 15.1001C8.60834 15.2565 8.74324 15.3914 8.89964 15.4977C9.5593 15.946 10.7142 15.484 13.024 14.5601Z"
            fill="#fff" />
    </svg></span>
                                                </div>
                                            </div>
                                            <div class="fav-actions"${!localStorage.getItem("extVOASA")
                      ? ' style="display: none"'
                      : ""
                    }>
                                            <div id="start-schedo-station-${station.StopCode
                    }" onclick="addInfinity('${busInfo.bus
                    }', '${station.StopCode
                    }', 'showUp', this)" style="display:none" class="button-action glowUpGBSM">
                                                    <svg class="glowUpGlobaltxt_title" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.5023 14.3674L20.5319 9.35289C21.2563 8.63072 21.6185 8.26963 21.8092 7.81046C22 7.3513 22 6.84065 22 5.81937V5.33146C22 3.76099 22 2.97576 21.5106 2.48788C21.0213 2 20.2337 2 18.6585 2H18.1691C17.1447 2 16.6325 2 16.172 2.19019C15.7114 2.38039 15.3493 2.74147 14.6249 3.46364L9.59522 8.47817C8.74882 9.32202 8.224 9.84526 8.02078 10.3506C7.95657 10.5103 7.92446 10.6682 7.92446 10.8339C7.92446 11.5238 8.48138 12.0791 9.59522 13.1896L9.74492 13.3388L11.4985 11.5591C11.7486 11.3053 12.1571 11.3022 12.4109 11.5523C12.6647 11.8024 12.6678 12.2109 12.4177 12.4647L10.6587 14.2499L10.7766 14.3674C11.8905 15.4779 12.4474 16.0331 13.1394 16.0331C13.2924 16.0331 13.4387 16.006 13.5858 15.9518C14.1048 15.7607 14.6345 15.2325 15.5023 14.3674ZM17.8652 8.47854C17.2127 9.12904 16.1548 9.12904 15.5024 8.47854C14.8499 7.82803 14.8499 6.77335 15.5024 6.12284C16.1548 5.47233 17.2127 5.47233 17.8652 6.12284C18.5177 6.77335 18.5177 7.82803 17.8652 8.47854Z" fill="#FFF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.77409 12.4814C3.07033 12.778 3.07004 13.2586 2.77343 13.5548L2.61779 13.7103C2.48483 13.8431 2.48483 14.058 2.61779 14.1908C2.75125 14.3241 2.96801 14.3241 3.10147 14.1908L4.8136 12.4807C5.1102 12.1845 5.59079 12.1848 5.88704 12.4814C6.18328 12.778 6.18298 13.2586 5.88638 13.5548L4.17426 15.2648C3.4481 15.9901 2.27116 15.9901 1.545 15.2648C0.818334 14.5391 0.818333 13.362 1.545 12.6362L1.70065 12.4807C1.99725 12.1845 2.47784 12.1848 2.77409 12.4814ZM7.29719 16.696C7.5903 16.9957 7.58495 17.4762 7.28525 17.7693L5.55508 19.4614C5.25538 19.7545 4.77481 19.7491 4.48171 19.4494C4.1886 19.1497 4.19395 18.6692 4.49365 18.3761L6.22382 16.684C6.52352 16.3909 7.00409 16.3963 7.29719 16.696ZM11.4811 18.118C11.7774 18.4146 11.7771 18.8952 11.4805 19.1915L9.76834 20.9015C9.63539 21.0343 9.63539 21.2492 9.76834 21.382C9.9018 21.5153 10.1186 21.5153 10.252 21.382L10.4077 21.2265C10.7043 20.9303 11.1849 20.9306 11.4811 21.2272C11.7774 21.5238 11.7771 22.0044 11.4805 22.3006L11.3248 22.4561C10.5987 23.1813 9.42171 23.1813 8.69556 22.4561C7.96889 21.7303 7.96889 20.5532 8.69556 19.8274L10.4077 18.1174C10.7043 17.8211 11.1849 17.8214 11.4811 18.118Z" fill="#FFF"/>
<g opacity="0.5">
<path d="M10.8461 5.40925L8.65837 7.59037C8.25624 7.99126 7.88737 8.35901 7.59606 8.69145C7.40899 8.90494 7.22204 9.13861 7.06368 9.39679L7.04237 9.37554C7.00191 9.3352 6.98165 9.31501 6.96133 9.29529C6.58108 8.92635 6.1338 8.63301 5.64342 8.43097C5.61722 8.42018 5.59062 8.40964 5.53743 8.38856L5.2117 8.25949C4.77043 8.08464 4.65283 7.51659 4.9886 7.18184C5.95224 6.22112 7.10923 5.06765 7.6676 4.83597C8.16004 4.63166 8.692 4.56368 9.20505 4.6395C9.67514 4.70897 10.1198 4.95043 10.8461 5.40925Z" fill="#FFF"/>
<path d="M14.5816 16.8934C14.7579 17.0723 14.8749 17.1987 14.9808 17.3337C15.1204 17.5119 15.2453 17.7012 15.3542 17.8996C15.4767 18.123 15.5718 18.3616 15.7621 18.8389C15.9169 19.2274 16.4315 19.3301 16.7303 19.0322L16.8026 18.9601C17.7662 17.9993 18.9232 16.8458 19.1556 16.2891C19.3605 15.7982 19.4287 15.2678 19.3526 14.7563C19.283 14.2877 19.0408 13.8444 18.5807 13.1205L16.3857 15.3089C15.9745 15.7189 15.5974 16.0949 15.2564 16.3894C15.052 16.5659 14.8284 16.7423 14.5816 16.8934Z" fill="#FFF"/>
</g>
<g opacity="0.5">
<path d="M7.68621 14.5633C7.98263 14.2669 7.98263 13.7863 7.68621 13.4899C7.38979 13.1935 6.90919 13.1935 6.61277 13.4899L4.47036 15.6323C4.17394 15.9287 4.17394 16.4093 4.47036 16.7057C4.76679 17.0021 5.24738 17.0021 5.5438 16.7057L7.68621 14.5633Z" fill="#FFF"/>
<path d="M10.4954 17.369C10.7918 17.0726 10.7918 16.592 10.4954 16.2956C10.1989 15.9992 9.71835 15.9992 9.42193 16.2956L7.29417 18.4233C6.99774 18.7198 6.99774 19.2003 7.29417 19.4968C7.59059 19.7932 8.07118 19.7932 8.36761 19.4968L10.4954 17.369Z" fill="#FFF"/>
</g>
</svg>
<svg class="loadingInfi" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                            viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                            <path opacity="0.2" fill="#fff"
                                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                     s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                     c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                            <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                     C22.32,8.481,24.301,9.057,26.013,10.047z">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                    from="0 20 20" to="360 20 20" dur="0.3s" repeatCount="indefinite" />
                            </path>
                        </svg>
                                                </div>
                                                <div id="2min-schedo-station-${station.StopCode
                    }" onclick="addInfinity('${busInfo.bus
                    }', '${station.StopCode
                    }', '2min', this)" class="button-action">
                                                    <svg class="glowUpGlobaltxt_title" xmlns="http://www.w3.org/2000/svg" fill="#fff" width="20px"
                                                        height="20px" viewBox="-1 0 19 19" class="cf-icon-svg">
                                                        <path
                                                            d="M16.417 9.6A7.917 7.917 0 1 1 8.5 1.683 7.917 7.917 0 0 1 16.417 9.6zm-5.431 2.113H8.309l1.519-1.353q.223-.203.43-.412a2.974 2.974 0 0 0 .371-.449 2.105 2.105 0 0 0 .255-.523 2.037 2.037 0 0 0 .093-.635 1.89 1.89 0 0 0-.2-.889 1.853 1.853 0 0 0-.532-.63 2.295 2.295 0 0 0-.76-.37 3.226 3.226 0 0 0-.88-.12 2.854 2.854 0 0 0-.912.144 2.373 2.373 0 0 0-.764.42 2.31 2.31 0 0 0-.55.666 2.34 2.34 0 0 0-.274.89l1.491.204a1.234 1.234 0 0 1 .292-.717.893.893 0 0 1 1.227-.056.76.76 0 0 1 .222.568 1.002 1.002 0 0 1-.148.536 2.42 2.42 0 0 1-.389.472L6.244 11.77v1.295h4.742z">
                                                        </path>
                                                    </svg>
                                                    <svg class="loadingInfi" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                            viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                            <path opacity="0.2" fill="#fff"
                                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                     s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                     c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                            <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                     C22.32,8.481,24.301,9.057,26.013,10.047z">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                    from="0 20 20" to="360 20 20" dur="0.3s" repeatCount="indefinite" />
                            </path>
                        </svg>
                                                </div>
                                                <div onclick="handleClick('${station.StopCode
                    }', '${capitalizeWords(
                      station.StopDescr
                    )}')" class="button-action">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                                        <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#fff"/>
                                                        <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#fff"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z" fill="#fff"/>
                                                        </svg>
                                                        
                                                </div>
                                            </div>
                                        </div>`;
                });

                function changeStationsSpawnStyle(property, value) {
                  // Loop through all stylesheets
                  for (let sheet of document.styleSheets) {
                    try {
                      for (let rule of sheet.cssRules) {
                        if (rule.selectorText === ".stationsSpawn") {
                          rule.style.setProperty(property, value);
                          return;
                        }
                      }
                    } catch (e) {
                      console.warn("Could not access stylesheet:", e);
                    }
                  }

                  // If rule not found insert it
                  document.styleSheets[0].insertRule(
                    `.stationsSpawn { ${property}: ${value}; }`,
                    0
                  );
                }

                if (!localStorage.getItem("extVOASA")) {
                  changeStationsSpawnStyle("height", "230px");
                }

                let controller;
                controller = new AbortController();
                const signal = controller.signal;
                console.warn("Intelligence Triggered!");
                if (routeCode) {
                  const intelligenceInfo = {
                    type: "browseStops",
                    route_code: routeCode,
                    stops: stations.map((stop) => ({
                      StopCode: stop.StopCode,
                      StopDescr: stop.StopDescr,
                      RouteStopOrder: stop.RouteStopOrder,
                    })),
                  };
                  keepForVerticalStations = intelligenceInfo;

                  fetch(
                    `${serverIP}oasa?intelligence=${JSON.stringify(
                      intelligenceInfo
                    )}&vevox=${randomString()}`,
                    { signal }
                  )
                    .then((response) => response.json())
                    .then((arrivals) => {
                      latestHorizontalIntelligence = arrivals;
                      console.log("Intelligence Results:", arrivals);

                      arrivals.sort(
                        (a, b) => a.RouteStopOrder - b.RouteStopOrder
                      );
                      const leastTime = arrivals
                        .filter(
                          (item) => item.time !== false && item.time !== null
                        )
                        .sort((a, b) => a.time - b.time);

                      if (leastTime[0]) {
                        const targets = document.querySelectorAll(
                          `[id="global-station-${leastTime[0].StopCode}"]`
                        );
                        targets.forEach((stopa) => {
                          stopa.classList.add("minimum");
                        });
                        //document.getElementById("stationsSpawnInner").innerHTML = `<div class="item minimum">
                        //                        <div class="stationName">Ζωντανή τοποθεσία</div>
                        //                        <div class="info">
                        //                            <div class="text">
                        //                                <span>${capitalizeWords(leastTime[0].StopDescr)}</span>
                        //                                <span id="station-minimum">σε ${leastTime[0].time} λεπτά</span>
                        //                            </div>
                        //                        </div>
                        //                        <div class="fav-actions">
                        //                            <div class="button-action">
                        //                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="20px"
                        //                                    height="20px" viewBox="-1 0 19 19" class="cf-icon-svg">
                        //                                    <path
                        //                                        d="M16.417 9.6A7.917 7.917 0 1 1 8.5 1.683 7.917 7.917 0 0 1 16.417 9.6zm-5.431 2.113H8.309l1.519-1.353q.223-.203.43-.412a2.974 2.974 0 0 0 .371-.449 2.105 2.105 0 0 0 .255-.523 2.037 2.037 0 0 0 .093-.635 1.89 1.89 0 0 0-.2-.889 1.853 1.853 0 0 0-.532-.63 2.295 2.295 0 0 0-.76-.37 3.226 3.226 0 0 0-.88-.12 2.854 2.854 0 0 0-.912.144 2.373 2.373 0 0 0-.764.42 2.31 2.31 0 0 0-.55.666 2.34 2.34 0 0 0-.274.89l1.491.204a1.234 1.234 0 0 1 .292-.717.893.893 0 0 1 1.227-.056.76.76 0 0 1 .222.568 1.002 1.002 0 0 1-.148.536 2.42 2.42 0 0 1-.389.472L6.244 11.77v1.295h4.742z">
                        //                                    </path>
                        //                                </svg>
                        //                            </div>
                        //                        </div>
                        //                    </div>
                        //                    ${document.getElementById("stationsSpawnInner").innerHTML}
                        //`;
                      }
                      const promise = new Promise((resolve) => {
                        arrivals.forEach((stop, index) => {
                          const targets = document.querySelectorAll(
                            `[id="station-${stop.StopCode}"]`
                          );

                          const twomins = document.querySelectorAll(
                            `[id="2min-schedo-station-${stop.StopCode}"]`
                          );
                          const starts = document.querySelectorAll(
                            `[id="start-schedo-station-${stop.StopCode}"]`
                          );

                          let toSpawn = stop.time;
                          if (toSpawn === null) {
                            toSpawn = `<img src="busNotFound.png" width="25px" height="25px">`;
                            starts.forEach((target_single) => {
                              target_single.style.display = "";
                            });
                            twomins.forEach((target_single) => {
                              target_single.style.display = "none";
                            });
                          } else if (toSpawn === false) {
                            toSpawn = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#fff"/>
<path d="M12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75Z" fill="#fff"/>
<path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#fff"/>
</svg>`;
                            starts.forEach((target_single) => {
                              target_single.style.display = "";
                            });
                            twomins.forEach((target_single) => {
                              target_single.style.display = "none";
                            });
                          } else if (toSpawn === "OASAERR") {
                            toSpawn = `Σφάλμα`;
                            twomins.forEach((target_single) => {
                              target_single.style.display = "none";
                            });
                          } else {
                            if (Number(stop.time) <= 2) {
                              twomins.forEach((target_single) => {
                                target_single.style.display = "none";
                              });
                            }

                            toSpawn += " λεπτά";
                          }

                          targets.forEach((target_single) => {
                            target_single.innerHTML = toSpawn;
                          });

                          if (index === arrivals.length - 1) {
                            resolve(); // Resolve when the last iteration is done
                          }
                        });
                      });

                      promise.then(() => {
                        console.log("All updates are complete.");
                      });
                    })
                    .catch((error) => {
                      const targets = document.querySelectorAll(
                        `[id="station-${stop.StopCode}"]`
                      );
                      targets.forEach((target_single) => {
                        target_single.innerHTML =
                          '<img src="snap.png" width="25px" height="25px">';
                      });
                      console.log("intelligence [1] error:", error);
                    });
                } else {
                  console.warn("Data not ready");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            document
              .getElementById("stationsSpawnOut")
              .classList.add("fade-out-slide-down");
            console.warn("Detected Line Error Generale");
            console.error(error);
          });
      }
    } else if (type === "showBusInfo") {
      console.log("Show Bus Info");
    }
  } else {
    console.log("No evoxId given");
  }
}

function returnFromBusTimetable() {
  haptics.trigger();
  //triggerNotificationsReload() Performance issues
  document.getElementById("bottomSearchParent").style.display = null;
  keepForVerticalStations = null;
  shownTimeTable = 0;
  currentInfoForSchedo = {};
  activeBusInfo = {};
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document.getElementById("top-navigate").classList.remove("hidden");
  document.getElementById("userFeed").classList.remove("focused");
  document.getElementById("busTimetable").style.display = "none";
  setTimeout(function () {
    document.getElementById("busTimetable").classList.remove("shown");
  }, 200);

  document.getElementById("userFeed").style.display = "block";

  document.getElementById("searchIntelli").classList.remove("notLoaded");
}
let option = "main";

async function spawnBusOnMap(lineId) {
  try {
    //map.addSource('mapbox-dem', {
    //    'type': 'raster-dem',
    //    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    //    'tileSize': 512,
    //    'maxzoom': 14
    //});
    //// add the DEM source as a terrain layer with exaggerated height
    //map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    const routeCode = await findBusInfo2(lineId);
    const busLocation = await findCurrentBusLocation(routeCode);

    return;

    new mapboxgl.Marker({
      element: createRedDot(),
    })
      .setLngLat([parseFloat(busLocation.lng), parseFloat(busLocation.lat)])
      .setPopup(
        new mapboxgl.Popup().setText(
          `${lineId} arriving at ${busLocation.stopName} in ${busLocation.time} minutes`
        )
      )
      .addTo(map);

    map.flyTo({
      center: [parseFloat(busLocation.lng), parseFloat(busLocation.lat)],
      zoom: option === "main" ? 14 : 16,
      curve: 1,
      easing(t) {
        // ease-in-out function
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
    });
    activeMarker.forEach((marker) => marker.remove());
  } catch (error) {
    console.error("Error:", error.message);
    alert("Error fetching bus location.");
  }
}
let activeRouteCode = null;
function findBusInfo2(
  id,
  comego,
  completeJson,
  getJustLineCode = false,
  getJustRouteCode = true
) {
  console.log("Complete JSON Given", completeJson);
  function routeOasa(lineCode) {
    function insider(data) {
      console.log("Route:", data, comego, data[`${comego === "go" ? 0 : 1}`]);
      try {
        if (comego === "go" || comego === undefined || comego === null) {
          activeRouteCode = data[0].route_code;
          if (data && data.length > 0) {
            return data[0].route_code;
          } else {
            throw new Error("Route Code not found. comego=go");
          }
        } else {
          const vanilaDesc = data[0].route_descr;
          console.warn("Tuning starting for:", data);
          const extraMatch = vanilaDesc.match(/^(.*?)([\(\[].*[\)\]])?$/);
          if (!extraMatch) throw new Error("Route format not recognized.");

          let coreRoute = extraMatch[1].trim();
          let extra = extraMatch[2] || "";

          // Ensure coreRoute has no trailing extra
          coreRoute = coreRoute.replace(/[\(\[].*[\)\]]\s*$/, "").trim();

          // Reverse stops
          const stops = coreRoute
            .split(" - ")
            .map((s) => s.trim())
            .reverse();

          // Append extra to the *last* stop after reversing
          if (extra) {
            stops[stops.length - 1] += extra;
          }

          const reversed = stops.join(" - ");
          console.log("Reversed:", reversed);
          let found = false;
          for (const route of data) {
            if (route.route_descr === reversed) {
              console.warn("VOXNEW FOUND:", route, route.route_descr);
              activeRouteCode = route.route_code;
              found = true;
              return route.route_code;
            }
          }
          if (!found) {
            for (const route of data) {
              if (route.route_descr.includes(reversed)) {
                console.warn("VOXNEW FOUND:", route, route.route_descr);
                activeRouteCode = route.route_code;
                found = true;
                return route.route_code;
              }
            }
            //throw new Error("Route Code not found.");
          }

          if (!found) {
            const newSearch = reversed.replace(/(\S)\[/, "$1 [");

            console.log("Re-searching for:", newSearch);
            for (const route of data) {
              if (
                route.route_descr === newSearch ||
                route.route_descr.includes(newSearch)
              ) {
                console.warn("VOXNEW FOUND:", route, route.route_descr);
                activeRouteCode = route.route_code;
                found = true;
                return route.route_code;
              }
            }
          }

          if (!found) {
            console.warn("Hard to match, inserting intelligence. 🙄");
            function levenshtein(a, b) {
              const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
              for (let j = 1; j <= b.length; j++) dp[0][j] = j;

              for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                  if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                  } else {
                    dp[i][j] = Math.min(
                      dp[i - 1][j] + 1, // deletion
                      dp[i][j - 1] + 1, // insertion
                      dp[i - 1][j - 1] + 1 // substitution
                    );
                  }
                }
              }
              return dp[a.length][b.length];
            }

            const newSearch = reversed.replace(/(\S)\[/, "$1 [");

            let bestRoute = null;
            let bestScore = Infinity;

            for (const route of data) {
              const d = levenshtein(route.route_descr, newSearch);

              if (d < bestScore) {
                bestScore = d;
                bestRoute = route;
              }
            }

            if (bestRoute) {
              console.warn(
                "VOXINTELLI FOUND:",
                bestRoute,
                bestRoute.route_descr
              );
              activeRouteCode = bestRoute.route_code;
              found = true;
              return bestRoute.route_code;
            }

            throw new Error("Route Code not found.");
          }
        }
      } catch (error) {
        if (completeJson && completeJson.descr !== data[0].LineDescr) {
          console.log("Will decide which one is needed on these:", data);
          let found = false;
          activeRouteCode = data[0].route_code;
          if (!data[1]) {
            return data[0].route_code;
          }
          for (const route of data) {
            if (
              route.route_descr === completeJson.descr ||
              route.route_descr ===
              capitalizeGreek(
                document.getElementById("busInfoDesc").innerText
              )
            ) {
              console.warn("VOXNEW FOUND:", route, route.route_descr);
              activeRouteCode = route.route_code;
              found = true;
              console.log("FOUND!", route);
              return route.route_code;
            }
          }
          if (found === false) {
            console.error(
              `Warning! Available lines don't match the requested one. ${data}\nRequested: ${completeJson}`
            );
          }
        } else {
          alert(`FATAL: ${error}`);
        }
      }
    }
    const getStops = encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=getRoutesForLine&p1=${lineCode}&keyOrigin=evoxEpsilon`
    );
    return fetch(
      `${serverIP}proxy?key=21&targetUrl=${getStops}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(
          `getRoutesForLine_${lineCode}`,
          JSON.stringify(data)
        );
        return insider(data);
      })
      .catch((error) => {
        const localSave = localStorage.getItem(`getRoutesForLine_${lineCode}`);
        if (localSave) {
          const use = JSON.parse(localSave);
          return insider(use);
        } else {
          console.error(
            "Process crashed. Cannot revive using localstorage",
            error,
            "localSave Status:",
            localSave
          );
        }
      });
  }

  function nextUp() {
    function insider(fullLine) {
      const matchingLines = fullLine.filter((line) => line.LineID === id);
      if (matchingLines.length > 0) {
        let selectedLine = matchingLines[0];
        matchingLines.forEach((line) => {
          if (
            line.LineDescr ===
            capitalizeGreek(document.getElementById("busInfoDesc").innerText)
          ) {
            selectedLine = line;
            console.warn("Method 2 Used.");
          } else {
            console.warn(
              "Check",
              line.LineDescr,
              document.getElementById("busInfoDesc").innerText
            );
          }
        });
        console.warn("Found Lines:", matchingLines, "Selected:", selectedLine);
        return routeOasa(selectedLine.LineCode).then((resu) => {
          //triggerSave(id, selectedLine.LineCode, resu)
          return resu;
        });
      } else {
        throw new Error("No matching lines found.");
      }
    }
    const allLinesUrl = encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`
    );
    return fetch(
      `${serverIP}proxy?key=21&targetUrl=${allLinesUrl}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((fullLine) => {
        return insider(fullLine);
      })
      .catch((error) => {
        console.warn("Server is not accessible. Using local storage");
        const localSave = localStorage.getItem("allLines");
        if (localSave) {
          const temp = JSON.parse(localSave);
          return insider(temp);
        } else {
          console.error(
            "Process crashed. Cannot revive using localstorage [1st]",
            error,
            "localSave Status:",
            localSave
          );
        }
      });
  }

  return nextUp();
}

async function findCurrentBusLocation(routeCode, retries = 5, delay = 10) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      fetchAndDisplayBusRoute(routeCode);
      return;
      const stops = await getRouteStops(routeCode);
      let nearestStop = null;
      let minTime = Infinity;

      for (const stop of stops) {
        const json = [stop.StopLat, stop.StopLng];
        const arrivals = await getStopArrivalTime(
          stop.StopCode,
          stop.StopDescr,
          json
        );

        arrivals.forEach((bus) => {
          if (bus.route_code === routeCode && bus.btime2 < minTime) {
            minTime = bus.btime2;
            nearestStop = stop;
          }
        });
      }

      if (nearestStop) {
        return {
          lat: nearestStop.StopLat,
          lng: nearestStop.StopLng,
          time: minTime,
          stopName: nearestStop.StopDescr,
        };
      } else {
        console.warn(
          `No bus currently found on route ${routeCode}. Showing the first stop.`
        );
        return {
          lat: stops[0].StopLat,
          lng: stops[0].StopLng,
          time: "Not started",
          stopName: stops[0].StopDescr,
        };
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
      if (attempt < retries - 1) {
        await sleep(delay);
      } else {
        console.error(`All attempts failed. Returning fallback location.`);
        return {
          lat: null,
          lng: null,
          time: "Failed to fetch bus location",
          stopName: "Unknown",
        };
      }
    }
  }
}

async function fetchAndDisplayBusRoute(routeCode) {
  try {
    const stops = await getRouteStops(routeCode); // Fetch stops for the given route code
    console.log(stops);
    if (stops.length > 0) {
      showBusRouteWithStops(stops, map); // Display the route on the map
    } else {
      console.error("No stops found for this route");
    }
  } catch (error) {
    console.error("Error fetching stops for route:", error);
  }
}

// Function to display bus route on the map
async function showBusRouteWithStops(stops, map) {
  const orderedStops = stops.sort(
    (a, b) => a.RouteStopOrder - b.RouteStopOrder
  );
  const coordinates = orderedStops.map((stop) => [
    parseFloat(stop.StopLng),
    parseFloat(stop.StopLat),
  ]);

  // Add the stops to the map as markers
  orderedStops.forEach((stop) => {
    new mapboxgl.Marker({
      element: createBlueDot(),
    })
      .setLngLat([parseFloat(stop.StopLng), parseFloat(stop.StopLat)])
      .setPopup(new mapboxgl.Popup().setText(stop.StopDescr)) // Popup with stop name
      .addTo(map);
  });

  // Create a line connecting the bus stops
  //map.addSource('busRoute', {
  //    type: 'geojson',
  //    data: {
  //        type: 'Feature',
  //        geometry: {
  //            type: 'LineString',
  //            coordinates: coordinates
  //        }
  //    }
  //});

  map.addLayer({
    id: "busRouteLayer",
    type: "line",
    //source: 'busRoute',
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#fff",
      "line-width": 2,
    },
  });

  console.log("Bus route displayed on the map");
}

async function getRouteStops(routeCode) {
  const url = `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
    `https://telematics.oasa.gr/api/?act=webGetRoutesDetailsAndStops&p1=${routeCode}&keyOrigin=evoxEpsilon`
  )}&vevox=${randomString()}`;

  if (!routeCode) {
    console.warn("Route code error. Will proceed either way.");
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const stops = data.stops || [];
    //alert(`Got data from server: \n${JSON.stringify(data)}`)
    if (stops.length !== 0) {
      localStorage.setItem(`stations_${routeCode}`, JSON.stringify(stops));
    }

    return stops;
  } catch (error) {
    console.warn("Fetch failed, falling back to localStorage:", error);
    const cachedStops = localStorage.getItem(`stations_${routeCode}`);
    //alert(`Fetch failed. Falling back to lc\n${cachedStops}`)
    return cachedStops ? JSON.parse(cachedStops) : [];
  }
}

let activeMarker = [];

async function getStopArrivalTime(stopCode, stopName, cords, maxRetries = 5) {
  const url = `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
    `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${stopCode}&keyOrigin=evoxEpsilon`
  )}&vevox=${randomString()}`;

  const main = new mapboxgl.Marker({
    element: createBlinkingDot(),
  })
    .setLngLat([parseFloat(cords[1]), parseFloat(cords[0])])
    .setPopup(new mapboxgl.Popup().setText(`Working..`))
    .addTo(map);
  activeMarker.push(main);
  map.flyTo({
    center: [parseFloat(cords[1]), parseFloat(cords[0])],
    zoom: option === "main" ? 14 : 16,
    pitch: 45,
    curve: 1,
    easing(t) {
      // ease-in-out function
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
  });
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      //verifying.play()
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        //verifying.stop()
        //foundActiveStation.play()
        return data; // Return arrivals if found
      } else {
        //verifying.stop()
        //inactiveStation.play()
        activeMarker.forEach((marker) => marker.remove());
        console.warn(`No arrivals found for stopCode: ${stopName}/${stopCode}`);

        return []; // Return empty if no arrivals
      }
    } catch (error) {
      // Retry only if the error message contains 'SQL'
      if (error.message.includes("SQL")) {
        console.warn(
          `SQL-related error fetching stop arrivals for ${stopName}/${stopCode}. Retrying... (${attempt}/${maxRetries})`
        );
      } else {
        console.error(
          `Error fetching stop arrivals for ${stopName}/${stopCode}:`,
          error
        );
        break; // Do not retry for non-SQL errors
      }

      if (attempt === maxRetries) {
        console.error(
          `Failed to fetch arrivals for stop ${stopName}/${stopCode} after ${maxRetries} retries.`
        );
      }
    }
  }
  return []; // Return empty array if all retries fail
}

let previouslines;
let markers_intel = [];

function spawnNearby() {
  //get the bus stops
  if (previouslines) {
    // Remove markers
    markers_intel.forEach((marker) => marker.remove());
    markers_intel = []; // Clear marker references

    // Remove layer and source
    if (map.getLayer(`route-${previouslines}`)) {
      map.removeLayer(`route-${previouslines}`);
    }
    if (map.getSource(`route-${previouslines}`)) {
      map.removeSource(`route-${previouslines}`);
    }
  }
  const temp = {
    ev1: myLoc[1],
    ev2: myLoc[0],
  };
  fetch(
    `${serverIP}proxy?key=21&vevox=${randomString()}&targetUrl=${JSON.stringify(
      temp
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Nearby!:", data);
      data.forEach((cord) => {
        //eg
        //{
        //  "StopCode": "400254",
        //  "StopID": "400254",
        //  "StopDescr": "ΠΑΝΑΓΙΤΣΑ",
        //  "StopDescrEng": "PANAGITSA",
        //  "StopStreet": "ΑΓ.ΕΛΕΥΘΕΡΙΟΥ",
        //  "StopStreetEng": null,
        //  "StopHeading": "216",
        //  "StopLat": "37.9560577",
        //  "StopLng": "23.6615127",
        //  "distance": "0.00191520367585055"
        //},
        const toWorkOn = [
          {
            lng: cord.StopLng,
            lat: cord.StopLat,
            StopDescr: cord.StopDescr,
            StopCode: cord.StopCode,
            StopID: cord.StopID,
          },
        ];
        addIt(toWorkOn, "asNearStops");
      });
    })
    .catch((error) => console.error("Error:", error));

  const colors = [
    "#007f00",
    "#ff66b3",
    "#007cbf",
    "#ff3300",
    "#ffff33",
    "#fff",
    "#ffffff",
    "#808080",
    "#ff9900",
    "#660066",
  ];

  function addIt(coordinates, asNearStops) {
    console.log(coordinates);
    markers_global.forEach((marker) => marker.remove());
    markers_intel.forEach((marker) => marker.remove());

    markers_intel = []; // Clear marker references

    // Remove layer and source
    if (map.getLayer(`route-${previouslines}`)) {
      map.removeLayer(`route-${previouslines}`);
    }
    if (map.getSource(`route-${previouslines}`)) {
      map.removeSource(`route-${previouslines}`);
    }
    // Fly to the first coordinate
    map.flyTo({
      center: [parseFloat(coordinates[0].lng), parseFloat(coordinates[0].lat)],
      zoom: 16,
      curve: 1,
      easing(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
    });

    const id = randomString();
    previouslines = id; // Track current line ID

    // Add markers
    coordinates.forEach((coord, index) => {
      const dot = document.createElement("div");
      let offset = [0, 0];

      dot.className = index !== 0 ? "station" : "transition";
      dot.onclick = function () {
        if (dot.getAttribute("data-status") === "hidden") {
          this.innerHTML = `<p>${capitalizeWords(
            coord.StopDescr
          )}</p><svg onclick="openStation('${coord.StopCode
            }', '${capitalizeWords(
              coord.StopDescr
            )}');" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M7 17L17 7M17 7H8M17 7V16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
          dot.setAttribute("data-status", "visible");
        } else {
          this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg>`;
          dot.setAttribute("data-status", "hidden");
        }
      };
      dot.setAttribute("data-status", "hidden");
      dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg>`;

      const marker = new mapboxgl.Marker({ element: dot, offset: offset })
        .setLngLat([coord.lng, coord.lat])
        .addTo(map);
      markers_intel.push(marker);
    });

    // Add a line connecting the points
    map.addSource(`route-${id}`, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
        },
      },
    });
    mapboxSourcesArray.push(id);

    map.addLayer({
      id: `route-${id}`,
      type: "line",
      source: `route-${id}`,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": colors[Math.floor(Math.random() * colors.length)],
        "line-width": 4,
      },
    });

    mapboxLayersArray.push(id);
  }
}

let liveBuses = [];
function spawnAndShowInfo(bus, remain, verification, comego, el, saveSearch) {
  haptics.trigger();
  if (el) {
    const elements = document.querySelectorAll(".Block.barup");
    elements.forEach((els, i) => {
      els.classList.remove("focused");
    });
    console.log("Element attached", el);
    el.classList.add("focused");
    console.log("newel", el);
    if (!el.innerHTML.includes("<vox>")) {
      el.innerHTML += `<vox><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg></vox>`;
    }
  }

  if (saveSearch) {
    saveRecentSearch(bus);
  }
  // helper to remove a route layer/source by ID
  function removeRoute(routeId) {
    if (!routeId) return;
    const layerId = `route-${routeId}`;
    const sourceId = `route-${routeId}`;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  }
  function clearMarkers() {
    markers_intel.forEach((marker) => marker.remove());
    markers_intel = [];
  }
  clearMarkers();
  removeRoute(previouslines);

  if (remain === "deleteAfter" && previouslines) {
    clearMarkers();
    removeRoute(previouslines);
  }

  removeGraphics();

  const linesSearch = fullLine.filter((item) => item.LineID === bus);
  let go_or_back = comego ? comego : "go";
  console.warn("MAP:", go_or_back);
  let isFirst = false;
  linesSearch.forEach((line) => {
    if (isFirst) {
      return;
    }
    if (!verification) {
      isFirst = true;
    }
    if (verification && verification !== line.LineDescr) {
      console.warn(
        "Verification mismatch, skipping:",
        verification,
        line.LineDescr
      );
      return;
    }
    console.log("Line found:", line);
    const lineCode = line.LineCode;
    const desc = line.LineDescr;

    const splitter = splitValue(desc);
    liveBuses.forEach((timeout) => {
      console.log("Clearing clearInterval for bus:", timeout);
      clearInterval(timeout);
    });
    if (document.getElementById("map-bus-info").style.display === "none") {
      document.getElementById("map-bus-info").style.display = "flex";
      setTimeout(() => {
        document.getElementById("map-bus-info").style.opacity = "1";
      }, 100);
    } else {
      document.getElementById("map-bus-info").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("map-bus-info").style.opacity = "1";
      }, 400);
    }
    let timeout =
      document.getElementById("map-bus-info").style.display === "none"
        ? 100
        : 300;

    setTimeout(() => {
      document.getElementById("busDirections").innerHTML = "";
      document.getElementById("openFromMap").setAttribute("data-name", desc);
      document.getElementById("openFromMap").setAttribute("data-bus", bus);
      document.getElementById("favoriteMap").setAttribute("data-bus", bus);
      if (favoriteBuses.includes(bus)) {
        document.getElementById(
          "favoriteMap"
        ).innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path style="transform-origin:center;animation: pulse 5s infinite alternate;transition:transform 5s ease-in-out;"
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill="#fff"></path>
                            </svg>
                            Αφαίρεση`;
      } else {
        document.getElementById(
          "favoriteMap"
        ).innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill="#fff"></path>
                            </svg>
                            Προσθήκη`;
      }

      document.getElementById("map-busName").innerText = line.LineID;
      document.getElementById("map-busName-2").innerText = capitalizeWords(
        desc
      ).replace("(κυκλικη)", "");
      document.getElementById("map-busName-2").innerHTML += capitalizeWords(
        desc
      ).includes("(κυκλικη)")
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 48 48">
<path d="M0 0h48v48H0z" fill="none"/>
<path fill="#fff" d="M10,22v2c0,7.72,6.28,14,14,14s14-6.28,14-14s-6.28-14-14-14h-6.662l3.474-4.298l-3.11-2.515L10.577,12l7.125,8.813   l3.11-2.515L17.338,14H24c5.514,0,10,4.486,10,10s-4.486,10-10,10s-10-4.486-10-10v-2H10z"/>
</svg>`
        : "";
      if (desc.includes("ΚΥΚΛΙΚΗ")) {
        const result1 = splitter.getSecondPart(); // Trim any leading or trailing spa
        document.getElementById(
          "busDirections"
        ).innerHTML += `<div class="Block active">
                                              <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 7L43 13.4615L36 21" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40 14H17.0062C10.1232 14 4.27787 19.6204 4.00964 26.5C3.72612 33.7696 9.73291 40 17.0062 40H34.0016" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>Προς ${capitalizeWords(result1)}
                                          </div>`;
      } else {
        const result1 = splitter.getSecondPart(); // Trim any leading or trailing spa
        document.getElementById(
          "busDirections"
        ).innerHTML += `<div class="Block ${go_or_back === "go" ? " active" : ""
        }" onclick="changeToOpposite('go', '${bus}', '${verification}', this)">
                                              <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 7L43 13.4615L36 21" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40 14H17.0062C10.1232 14 4.27787 19.6204 4.00964 26.5C3.72612 33.7696 9.73291 40 17.0062 40H34.0016" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>Προς ${capitalizeWords(result1)}
                                          </div>`;
        const result2 = splitter.getFirstPart(); // Trim any leading or trailing spa
        document.getElementById(
          "busDirections"
        ).innerHTML += `<div class="Block${go_or_back === "come" ? " active" : ""
        }" onclick="changeToOpposite('come', '${bus}', '${verification}', this)">
                                              <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 7L43 13.4615L36 21" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40 14H17.0062C10.1232 14 4.27787 19.6204 4.00964 26.5C3.72612 33.7696 9.73291 40 17.0062 40H34.0016" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>Προς ${capitalizeWords(result2)}
                                          </div>`;
      }
      fetch(
        `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=getDailySchedule&line_code=${lineCode}&keyOrigin=evoxEpsilon`
        )}&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Daily Schedule Data new:", data);
        })
        .catch((error) => {
          console.log("Error fetching daily schedule data:", error);
        });
    }, timeout);
  });

  findBusInfo2(bus, comego).then((returned) => {
    if (!returned) {
      el.querySelector("vox").remove();
      if (!el.innerHTML.includes("<img")) {
        el.innerHTML += `<img style='width:15px;height:15px' src="snap.png">`;
      }
      return;
    }

    console.log("MAPFOUND:", returned);

    const colors = [
      "#3c5cff",
      "#5c71ff",
      "#3557fd",
      "#0e36ff",
      "#2c4ef5",
      "#1f42f4",
    ];

    const existingStopCodes = new Set();

    function addIt(coordinates, near, coordsForMap) {
      console.log("addIt", coordinates);

      // Fly to the first coordinate
      map.flyTo({
        center: [parseFloat(near.lng), parseFloat(near.lat)],
        zoom: 16,
        curve: 1,
        easing(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
      });
      try {
        el.querySelector("vox").remove();
      } catch (err) {
        console.warn("Ignoring vox non-existant error.");
      }

      const id = randomString();
      previouslines = id; // Track current line ID

      // Add markers
      console.log("%a", coordinates);
      coordinates.forEach((coord, index) => {
        if (existingStopCodes.has(coord.StopCode)) {
          // This station already has a marker — skip adding
          return;
        }

        existingStopCodes.add(coord.StopCode);
        const dot = document.createElement("div");
        let offset = [0, 0];

        dot.className = index !== 0 ? "station" : "transition";
        dot.onclick = function () {
          if (dot.getAttribute("data-status") === "hidden") {
            this.innerHTML = `<div class="dotBusInfoShow">
                    <p>${capitalizeWords(
              coord.StopDescr
            )}<!--${comego}EVXDEBUG--></p>
                    <div class="dotrow">
                    <div onclick="openStation('${coord.StopCode
              }', '${capitalizeWords(
                coord.StopDescr
              )}', '${bus}', '${verification}');" class="actiondot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                                        <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#fff"></path>
                                                        <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#fff"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z" fill="#fff"></path>
                                                        </svg></div>

                    <div onclick='walkMeTo("${coord.lng}", "${coord.lat
              }", event, "${capitalizeWords(
                coord.StopDescr
              )}")' class="actiondot"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-768.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(768.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M11.9999,2 C13.6567,2 14.9999,3.34315 14.9999,5 C14.9999,6.35582174 14.1004285,7.50158382 12.8656975,7.8731619 L12.6953,7.91898 L15.123,10.6935 L16.9471,11.6055 C17.4411,11.8525 17.6413,12.4532 17.3943,12.9472 C17.1649429,13.4058214 16.6306959,13.6112878 16.1600211,13.4405382 L16.0527,13.3944 L14.2286,12.4823 C14.054375,12.395225 13.8941563,12.2832875 13.7527531,12.1503266 L13.6178,12.0105 L12.5997,10.8469 L11.9402,13.485 C11.87836,13.73236 11.772936,13.95732 11.634168,14.153736 L11.524,14.2956 L13.4524,16.0587 C13.7008857,16.2859286 13.8873633,16.5716388 13.9955854,16.8886889 L14.0431,17.0497 L14.7807,20 L14.9999,20 C15.5522,20 15.9999,20.4477 15.9999,21 C15.9999,21.5127571 15.613873,21.9354959 15.1165239,21.9932711 L14.9999,22 L14.078,22 C13.6152667,22 13.2069833,21.7112806 13.0478704,21.285967 L13.0108,21.1667 L12.1028,17.5347 L9.0933,14.7832 C8.32760588,14.3947765 7.88328478,13.5453758 8.02593056,12.6776961 L8.05962,12.5149 L8.5727,10.4626 L8.25039,10.6928 L6.8574,13.0145 C6.57325,13.488 5.95899,13.6416 5.48541,13.3574 C5.04565714,13.0935929 4.8818399,12.5450724 5.08817946,12.0889477 L5.14241,11.9855 L6.53541,9.66381 C6.648338,9.475586 6.7912884,9.3075604 6.95826568,9.16622536 L7.08791,9.06533 L9.85002,7.0924 C9.32392,6.55194 8.99988,5.81381 8.99988,5 C8.99988,3.34315 10.343,2 11.9999,2 Z M9.31613,15.5513 C9.84008,15.7259 10.1232,16.2922 9.94859,16.8162 L9.52324,18.0922 C9.42506,18.3868 9.25964,18.6544 9.04009,18.874 L7.38331,20.5308 C7.58424,20.9088 7.52548,21.3886 7.20701,21.7071 C6.81649,22.0976 6.18332,22.0976 5.7928,21.7071 L5.29987,21.2141 C4.90544,20.8197 4.90544,20.1802 5.29987,19.7858 L7.62587,17.4598 L8.05122,16.1837 C8.22587,15.6598 8.79219,15.3766 9.31613,15.5513 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg></div>
                    </div>
                    </div>`;
            dot.setAttribute("data-status", "visible");
            return;
            this.innerHTML = `<p>${capitalizeWords(
              coord.StopDescr
            )}{EVX-DEBUG-3}</p><svg onclick="openStation('${coord.StopCode
              }', '${capitalizeWords(
                coord.StopDescr
              )}', '${bus}', '${verification}');" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M7 17L17 7M17 7H8M17 7V16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
          } else {
            this.innerHTML = `<!--${comego}EVXDEBUG--><svg class="defaultTransitionIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path><path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff"></path></g></g></g></svg>`;
            dot.setAttribute("data-status", "hidden");
          }
        };

        dot.setAttribute("data-status", "hidden");
        dot.innerHTML = `<!--${comego}EVXDEBUG--><svg class="defaultTransitionIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path><path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff"></path></g></g></g></svg>`;
        if (coord === near) {
          dot.click();
          console.log("Clicking dot");
        }

        const marker = new mapboxgl.Marker({ element: dot, offset: offset })
          .setLngLat([coord.lng, coord.lat])
          .addTo(map);
        markers_intel.push(marker);
      });
      // Smooth your coordinates first
      const smoothed = smoothLine(coordsForMap);

      // Pick a random color for this route
      const lineColor = colors[Math.floor(Math.random() * colors.length)];

      // Add the route source as a proper FeatureCollection
      map.addSource(`route-${id}`, {
        type: "geojson",
        data: {
          type: "FeatureCollection", // ✅ must be FeatureCollection
          features: [
            {
              type: "Feature",
              properties: {}, // ✅ must have properties
              geometry: {
                type: "LineString",
                coordinates: smoothed.map((coord) => [coord.lng, coord.lat]),
              },
            },
          ],
        },
      });

      mapboxSourcesArray.push(id); // keep track if you need it

      // 1️⃣ Add the line layer
      map.addLayer({
        id: `route-${id}`,
        type: "line",
        source: `route-${id}`,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": lineColor, // random color
          "line-width": 4,
          "line-opacity": 1, // ensure visible
        },
      });

      // 2️⃣ Load arrow image and add arrows as a symbol layer
      map.loadImage(
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Arrow_right.svg",
        (error, image) => {
          if (error) throw error;

          // Add the image if it doesn't already exist
          if (!map.hasImage("arrow-icon")) {
            map.addImage("arrow-icon", image);
          }

          // Add the arrows layer
          map.addLayer({
            id: `route-arrows-${id}`,
            type: "symbol",
            source: `route-${id}`,
            layout: {
              "symbol-placement": "line", // place along line
              "symbol-spacing": 50, // distance between arrows
              "icon-image": "arrow-icon",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
            paint: {
              "icon-color": lineColor, // match arrows to line
            },
          });
        }
      );

      mapboxLayersArray.push(id);
    }
    let liveBusDivs = {};
    function redoLive() {
      //Redoing live fetch
      fetch(
        `${serverIP}proxy?key=21&targetUrl=${returned}&type=currentLocation&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("LIVE OK");

          // Keep track of buses from this update
          const currentVehNos = new Set();

          try {
            data.forEach((location) => {
              const vehNo = location.VEH_NO;
              currentVehNos.add(vehNo);

              const newLngLat = [location.CS_LNG, location.CS_LAT];

              // Update existing marker if present
              if (liveBusDivs[vehNo]) {
                const marker = liveBusDivs[vehNo].marker;
                const oldLngLat = marker.getLngLat();

                // Animate to new position
                let start = null;
                function animateMarker(timestamp) {
                  if (!start) start = timestamp;
                  const progress = Math.min((timestamp - start) / 300, 1); // 300ms

                  const lng =
                    oldLngLat.lng + (newLngLat[0] - oldLngLat.lng) * progress;
                  const lat =
                    oldLngLat.lat + (newLngLat[1] - oldLngLat.lat) * progress;

                  marker.setLngLat([lng, lat]);

                  if (progress < 1) {
                    requestAnimationFrame(animateMarker);
                  }
                }
                requestAnimationFrame(animateMarker);
              } else {
                // Create new marker
                const dot = document.createElement("div");
                dot.className = "busLocation";
                dot.setAttribute("data-status", "hidden");

                dot.onclick = function () {
                  if (dot.getAttribute("data-status") === "hidden") {
                    dot.setAttribute("data-status", "visible");
                    this.innerHTML = `<p>${bus}</p><svg onclick="alert('δεν είναι ακόμα έτοιμο αυτό...');" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
                  } else {
                    this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
    <path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#000"></path>
    <path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#000"></path>
    <path opacity="1" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"></path>
    <path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#000"></path>
    <path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#000"></path>
    <path d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#000"></path>
    <path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#000"></path>
    <path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#000"></path>
    </svg>`;
                    dot.setAttribute("data-status", "hidden");
                  }
                };

                dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
    <path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#000"></path>
    <path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#000"></path>
    <path opacity="1" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"></path>
    <path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#000"></path>
    <path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#000"></path>
    <path d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#000"></path>
    <path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#000"></path>
    <path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#000"></path>
    </svg>`;

                const marker = new mapboxgl.Marker({
                  element: dot,
                  offset: [0, 0],
                })
                  .setLngLat(newLngLat)
                  .addTo(map);

                liveBusDivs[vehNo] = { marker, element: dot };
                markers_intel.push(marker);
              }
            });

            // Remove any buses not in the new data
            for (const vehNo in liveBusDivs) {
              if (!currentVehNos.has(vehNo)) {
                liveBusDivs[vehNo].marker.remove();
                delete liveBusDivs[vehNo];
              }
            }
          } catch (error) {
            return;
          }
        })
        .catch((error) => console.error("Error:", error));
    }

    redoLive();
    let into = setInterval(function () {
      redoLive();
    }, 5000);
    liveBuses.push(into);

    // Fetch new bus data
    fetch(
      `${serverIP}proxy?key=21&targetUrl=https%3A%2F%2Ftelematics.oasa.gr%2Fapi%2F%3Fact%3DwebGetRoutesDetailsAndStops%26p1%3D${returned}%26keyOrigin%3DevoxEpsilon&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.warn("webgetroutesandstops:", data);
        const coordinates_for_map = data.details
          .map((stop) => ({
            lat: parseFloat(stop.routed_y),
            lng: parseFloat(stop.routed_x),
          }))
          .sort((a, b) => a.routed_order - b.routed_order);
        console.log("%ss", coordinates_for_map);
        const coordinates = data.stops
          .map((stop) => ({
            lat: parseFloat(stop.StopLat),
            lng: parseFloat(stop.StopLng),
            StopDescr: stop.StopDescr,
            StopCode: stop.StopCode,
          }))
          .sort((a, b) => a.RouteStopOrder - b.RouteStopOrder);
        console.log("inth stops", coordinates);

        if (localStorage.getItem("oasa-intelligence")) {
          const current = JSON.parse(localStorage.getItem("oasa-intelligence"));
          current[bus] = coordinates;
          localStorage.setItem("oasa-intelligence", JSON.stringify(current));
        } else {
          const json = { [bus]: coordinates };
          localStorage.setItem("oasa-intelligence", JSON.stringify(json));
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const nearestStop = findNearestStop(coordinates, userLat, userLng);
            //addIt(workOn[bus]);
            addIt(coordinates, nearestStop, coordinates_for_map);
            console.log("Nearest Stop:", nearestStop);
          },
          (error) => console.error("Error getting location:", error),
          { enableHighAccuracy: true }
        );

        //addIt(coordinates);
      })
      .catch((error) => console.error("Error:", error));

    const learning = localStorage.getItem("oasa-intelligence");
    if (learning) {
      const workOn = JSON.parse(learning);
      if (workOn[bus]) {
        if (workOn[bus][0].StopCode) {
          console.log("inth stops local", workOn[bus]);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              const nearestStop = findNearestStop(
                workOn[bus],
                userLat,
                userLng
              );
              //addIt(workOn[bus]);
              addIt(workOn[bus], nearestStop);
              console.log("Nearest Stop:", nearestStop);
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
          );

          return;
        } else {
          localStorage.removeItem("oasa-intelligence");
        }
      }
    }
  });
}

let currentInfoForSchedo = {};

function showDetailedTime(time, type, text) {
  if (!type) return;

  const extVOASA = localStorage.getItem("extVOASA");
  if (extVOASA === null) {
    //alert("Florida not enabled!");
    return;
  }

  currentInfoForSchedo.time = time;

  const atStartGen = document.getElementById("at-start-gen");
  const befoGen = document.getElementById("befo-gen");
  const checkbox_atStart = document.getElementById("at-start");

  atStartGen.classList.add("disabled");
  befoGen.classList.add("disabled");

  checkbox_atStart.checked = false;

  fetch(
    `https://florida.evoxs.xyz/activeSchedo?username=${localStorage.getItem(
      "t50-username"
    )}&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let foundMatch = false;

      data.schedo.forEach((schedo) => {
        if (
          schedo.bus === document.getElementById("busInfoID").innerText &&
          schedo.time === time &&
          schedo.id === extVOASA
        ) {
          checkbox_atStart.checked = true;
          foundMatch = true;
        } else {
          console.log(
            `None: ${schedo.bus} ${schedo.time} ${schedo.id},\nLocal: ${document.getElementById("busInfoID").innerText
            } ${time} ${extVOASA}`
          );
        }
      });

      // Enable buttons after processing
      atStartGen.classList.remove("disabled");
      befoGen.classList.remove("disabled");

      if (!foundMatch) {
        checkbox_atStart.checked = false;
      }
    })
    .catch((error) => {
      console.error("Failed to check for updates", error);
      atStartGen.classList.remove("disabled");
      befoGen.classList.remove("disabled");
    });

  document.getElementById("timeInfo").innerHTML = time;
  document.getElementById("busLineInfoForDetails").innerText =
    document.getElementById("busInfoDesc").innerText;
  document.getElementById("timeInfoInText").innerText = "σε " + timeUntil(time);

  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    document.getElementById("main-wrapper").scrollTop = 0;
  }

  const busTimetable = document.getElementById("busTimetable");
  busTimetable.classList.add("fade-out-slide-down");

  setTimeout(() => {
    busTimetable.style.display = "none";
    busTimetable.classList.remove("fade-out-slide-down", "shown");
  }, 200);

  const timetableItemView = document.getElementById("timetableItemView");
  timetableItemView.style.display = "block";
  setTimeout(() => {
    timetableItemView.classList.add("shown");
  }, 200);

  if (type === "previous") {
  } else if (type === "next") {
  }
}

function returnFromDetailedItemView() {
  haptics.trigger();
  currentInfoForSchedo.time = null;
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document
    .getElementById("timetableItemView")
    .classList.add("fade-out-slide-down");
  setTimeout(function () {
    document.getElementById("timetableItemView").style.display = "none";
  }, 200);
  setTimeout(function () {
    document
      .getElementById("timetableItemView")
      .classList.remove("fade-out-slide-down");
    document.getElementById("timetableItemView").classList.remove("shown");
  }, 500);

  setTimeout(function () {
    document.getElementById("busTimetable").style.display = "block";
    document.getElementById("busTimetable").classList.add("shown");
    document.getElementById("busTimetable").classList.add("fade-in-slide-up");
  }, 200);
  setTimeout(function () {
    document
      .getElementById("busTimetable")
      .classList.remove("fade-in-slide-up");
  }, 500);
}

function showVerticalStations() {
  haptics.trigger();
  document.getElementById("stationsBusName").innerHTML =
    document.getElementById("busInfoID").innerText;
  document.getElementById("busGOCOMEForStations").innerHTML =
    document.getElementById("busGOCOME").innerHTML;
  document.getElementById("busLineInfoForStations").innerText =
    document.getElementById("busInfoDesc").innerText;
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document.getElementById("busTimetable").classList.add("fade-out-slide-down");

  setTimeout(function () {
    document.getElementById("busTimetable").style.display = "none";
    document
      .getElementById("busTimetable")
      .classList.remove("fade-out-slide-down");
    document.getElementById("busTimetable").classList.remove("shown");
  }, 200);
  document.getElementById("stationsVertical").style.display = "block";
  setTimeout(function () {
    document.getElementById("stationsVertical").classList.add("shown");
  }, 200);

  document.getElementById(
    "stationsSpawnVertical"
  ).innerHTML = `<div class="failed">
                        <svg class="failed-icon" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>
                        <vox class="failed-message nonImportant">Συλλογή δεδομένων..</vox>
                    </div>`;
  if (keepForVerticalStations) {
    document.getElementById("stationsSpawnVertical").innerHTML = "";
    keepForVerticalStations.stops.forEach((station) => {
      document.getElementById(
        "stationsSpawnVertical"
      ).innerHTML += `<div id="global-vertical-station-${station.StopCode
      }" class="timeItem fade-in-slide-up">
                                        <div onclick="showStopDetails('${station.StopCode
        }', '${capitalizeWords(
          station.StopDescr
        )}')" class="rowDefault"><p>${capitalizeWords(station.StopDescr)}</p>
                                        <div class="actions">
                                            <span id="timeFor-${station.StopCode
        }"><svg class="compassAnim" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
        <path opacity="0.5"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="#8fceff" />
        <path
            d="M13.024 14.5601C13.5166 14.363 13.763 14.2645 13.9562 14.095C14.0055 14.0518 14.0518 14.0055 14.095 13.9562C14.2645 13.763 14.363 13.5166 14.5601 13.024C15.484 10.7142 15.946 9.5593 15.4977 8.89964C15.3914 8.74324 15.2565 8.60834 15.1001 8.50206C14.4405 8.0538 13.2856 8.51575 10.9758 9.43966C10.4831 9.63673 10.2368 9.73527 10.0435 9.90474C9.99429 9.94792 9.94792 9.99429 9.90474 10.0435C9.73527 10.2368 9.63673 10.4831 9.43966 10.9758C8.51575 13.2856 8.0538 14.4405 8.50206 15.1001C8.60834 15.2565 8.74324 15.3914 8.89964 15.4977C9.5593 15.946 10.7142 15.484 13.024 14.5601Z"
            fill="#fff" />
    </svg></span><svg style="transform: rotate(180deg);margin-left:5px;" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#fff"></path>
</svg>
                                        </div></div>
                                        <div style="display: none" class='moreActions'>
                                        <div onclick="addActivity('${capitalizeWords(
          station.StopDescr
        )}', '${station.StopCode
        }', this)" style="display: none" class="themeButton">
                                            Παρακολούθηση
                                        </div>
                                        <div style="display: none" class="themeButton">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 1C10.9477 1 10.5 1.44772 10.5 2V3H9.99998C7.23864 3 4.99999 5.23825 4.99999 7.99975V11C4.99999 11.7377 4.76718 12.5722 4.39739 13.4148C4.03165 14.2482 3.55876 15.0294 3.14142 15.6439C2.38188 16.7624 2.85216 18.5301 4.40564 18.8103C5.42144 18.9935 6.85701 19.2115 8.54656 19.3527C8.54454 19.4015 8.54352 19.4506 8.54352 19.5C8.54352 21.433 10.1105 23 12.0435 23C13.9765 23 15.5435 21.433 15.5435 19.5C15.5435 19.4482 15.5424 19.3966 15.5402 19.3453C17.1921 19.204 18.596 18.9903 19.5943 18.8103C21.1478 18.5301 21.6181 16.7624 20.8586 15.6439C20.4412 15.0294 19.9683 14.2482 19.6026 13.4148C19.2328 12.5722 19 11.7377 19 11V7.99975C19 5.23825 16.7613 3 14 3H13.5V2C13.5 1.44772 13.0523 1 12.5 1H11.5ZM12 19.5C12.5113 19.5 13.0122 19.4898 13.4997 19.4715C13.5076 20.2758 12.8541 20.9565 12.0435 20.9565C11.2347 20.9565 10.5803 20.2778 10.5872 19.4747C11.0473 19.491 11.5191 19.5 12 19.5ZM9.99998 5C8.34305 5 6.99999 6.34298 6.99999 7.99975V11C6.99999 12.1234 6.65547 13.2463 6.22878 14.2186C5.79804 15.2 5.25528 16.0911 4.79599 16.7675C4.78578 16.7825 4.78102 16.7969 4.77941 16.8113C4.77797 16.8242 4.77919 16.8362 4.78167 16.8458C6.3644 17.1303 9.00044 17.5 12 17.5C14.9995 17.5 17.6356 17.1303 19.2183 16.8458C19.2208 16.8362 19.222 16.8242 19.2206 16.8113C19.2189 16.7969 19.2142 16.7825 19.204 16.7675C18.7447 16.0911 18.2019 15.2 17.7712 14.2186C17.3445 13.2463 17 12.1234 17 11V7.99975C17 6.34298 15.6569 5 14 5H9.99998Z" fill="#d5d5d5"></path>
                            </svg> <vox>../</vox>
                            <svg class="loadingInfi" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                            viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                            <path opacity="0.2" fill="#fff"
                                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                     s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                     c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                            <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                     C22.32,8.481,24.301,9.057,26.013,10.047z">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                    from="0 20 20" to="360 20 20" dur="0.3s" repeatCount="indefinite" />
                            </path>
                        </svg>
                                        </div>
                                        </div>
                                    </div>`;
    });

    function spawnIntelli(arrivals, isOld) {
      arrivals.sort((a, b) => a.RouteStopOrder - b.RouteStopOrder);
      const leastTime = arrivals
        .filter((item) => item.time !== false && item.time !== null)
        .sort((a, b) => a.time - b.time);

      if (leastTime[0]) {
        document
          .getElementById(`global-vertical-station-${leastTime[0].StopCode}`)
          .classList.add("currentLocation");
      }

      const promise = new Promise((resolve) => {
        arrivals.forEach((stop, index) => {
          if (isOld) {
            document
              .getElementById(`global-vertical-station-${stop.StopCode}`)
              .classList.add("previous");
          } else {
            try {
              document
                .getElementById(`global-vertical-station-${stop.StopCode}`)
                .classList.remove("previous");
            } catch (err) {
              console.warn("Failed to remove classes for prev");
            }
          }
          const targets = document.querySelectorAll(
            `[id="timeFor-${stop.StopCode}"]`
          );
          const actions = document
            .getElementById(`global-vertical-station-${stop.StopCode}`)
            .querySelector(".moreActions");
          const activity = document
            .getElementById(`global-vertical-station-${stop.StopCode}`)
            .querySelectorAll(".moreActions .themeButton");
          let toSpawn = stop.time;
          activity[0].setAttribute("data-time", toSpawn);
          if (toSpawn === null) {
            toSpawn = `<img src="busNotFound.png" width="25px" height="25px">`;
            //show up at start
            if (localStorage.getItem("extVOASA")) {
              actions.style.display = "flex";
            }

            activity[1].style.display = "flex";
            activity[1].setAttribute(
              "onclick",
              `addInfinity('${document.getElementById("busInfoID").innerText
              }', '${stop.StopCode}', 'showUp', this)`
            );
            activity[1].querySelector("vox").innerText = "Όταν εμφανιστεί";
          } else if (toSpawn === false) {
            toSpawn = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#fff"/>
<path d="M12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75Z" fill="#fff"/>
<path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#fff"/>
</svg>`;
            //show up at count start
            if (localStorage.getItem("extVOASA")) {
              actions.style.display = "flex";
            }
            activity[1].style.display = "flex";
            activity[1].setAttribute(
              "onclick",
              `addInfinity('${document.getElementById("busInfoID").innerText
              }', '${stop.StopCode}', 'showUp', this)`
            );
            activity[1].querySelector("vox").innerText = "Όταν εμφανιστεί";
          } else if (toSpawn === "OASAERR") {
            toSpawn = `Σφάλμα`;
            //show up at count start
            if (localStorage.getItem("extVOASA")) {
              actions.style.display = "flex";
            }
            activity[1].style.display = "flex";
            activity[1].setAttribute(
              "onclick",
              `addInfinity('${document.getElementById("busInfoID").innerText
              }', '${stop.StopCode}', 'showUp', this)`
            );
            activity[1].querySelector("vox").innerText = "Όταν εμφανιστεί";
          } else {
            toSpawn += "'";
            if (Number(stop.time) > 2) {
              //show up 2 mins
              //console.log(activity[1])
              if (localStorage.getItem("extVOASA")) {
                actions.style.display = "flex";
              }
              activity[1].style.display = "flex";
              activity[1].querySelector("vox").innerText = "2' μακριά";
              activity[1].setAttribute(
                "onclick",
                `addInfinity('${document.getElementById("busInfoID").innerText
                }', '${stop.StopCode}', '2min', this)`
              );
              activity[0].style.display = "flex";
            } else {
              if (Number(stop.time) === 1 || Number(stop.time) === 0) {
                document
                  .getElementById(`global-vertical-station-${stop.StopCode}`)
                  .classList.add("currentLocation");
              }

              console.log("Not accepted!", stop.time);
            }
          }

          targets.forEach((target_single) => {
            target_single.innerHTML = toSpawn;
          });

          if (index === arrivals.length - 1) {
            resolve(); // Resolve when the last iteration is done
          }
        });
      });

      promise.then(() => {
        console.log("All updates are complete.");
      });
    }

    if (latestHorizontalIntelligence) {
      spawnIntelli(latestHorizontalIntelligence, "old");
    }
    let afasterfix = setInterval(function () {
      if (isFetching === true && latestHorizontalIntelligence) {
        spawnIntelli(latestHorizontalIntelligence, "old");
        clearInterval(afasterfix);
      }
    }, 200);

    let isFetching = true;
    fetch(
      `${serverIP}oasa?intelligence=${JSON.stringify(
        keepForVerticalStations
      )}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((arrivals) => {
        isFetching = false;
        console.log("Intelligence Results:", arrivals);

        spawnIntelli(arrivals);
      })
      .catch((error) => {
        console.log("intelligence [1] error:", error);
      });
  } else {
    //Don't break the app
    let restartit = setInterval(function () {
      if (keepForVerticalStations) {
        clearInterval(restartit);
        showVerticalStations();
        console.log("Found");
      }
    }, 200);
    //
  }
}

function returnFromStationsVertical() {
  haptics.trigger();
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document
    .getElementById("stationsVertical")
    .classList.add("fade-out-slide-down");
  setTimeout(function () {
    document.getElementById("stationsVertical").style.display = "none";
  }, 200);
  setTimeout(function () {
    document
      .getElementById("stationsVertical")
      .classList.remove("fade-out-slide-down");
    document.getElementById("stationsVertical").classList.remove("shown");
  }, 500);

  setTimeout(function () {
    document.getElementById("busTimetable").style.display = "block";
    document.getElementById("busTimetable").classList.add("shown");
    document.getElementById("busTimetable").classList.add("fade-in-slide-up");
  }, 200);
  setTimeout(function () {
    document
      .getElementById("busTimetable")
      .classList.remove("fade-in-slide-up");
  }, 500);
}

let favorite_stations = [];

let active_station = null;

function showStopDetails(stopCode, stopName) {
  haptics.trigger();
  try {
    if (!evoxIds[activeEvoxId]) {

    }
    triggerSave(
      evoxIds[activeEvoxId].bus,
      null,
      activeRouteCode,
      "station",
      stopCode
    );
    active_station = {
      bus: evoxIds[activeEvoxId].bus,
      evoxid: activeEvoxId,
      route: activeRouteCode,
      code: stopCode,
      name: stopName,
    };
    const favStationsJSON = localStorage.getItem("favorite_stations");

    if (favStationsJSON) {
      try {
        const favStations = JSON.parse(favStationsJSON);
        const e = document.getElementById("favStation");
        const path = e?.querySelector("svg path");

        let isFavorite = false;

        if (Array.isArray(favStations) && path) {
          isFavorite = favStations.some((stationNode) => {
            const match =
              stationNode.busLink === active_station.bus &&
              stationNode.stopCode === active_station.code;
            if (match) {
              console.log("Node found", stationNode);
              path.style.fill = "rgba(248, 54, 54, 0.643)";
              path.style.transform = "scale(1.10)";
              setTimeout(() => {
                path.style.transform = "scale(1)";
              }, 500);
            }
            return match;
          });

          if (!isFavorite) {
            path.style.fill = "#fff";
            path.style.transform = "scale(1)";
          }
        }
      } catch (err) {
        console.error("Failed to process favorite stations:", err);
      }
    }
    document.getElementById("stationInfoName").innerText = stopName;

    if (
      document.getElementById("returnTopDefines").classList.contains("scrolled")
    ) {
      const element = document.getElementById("main-wrapper");
      element.scrollTop = 0;
    }
    document
      .getElementById("stationsVertical")
      .classList.add("fade-out-slide-down");

    setTimeout(function () {
      document.getElementById("stationsVertical").style.display = "none";
      document
        .getElementById("stationsVertical")
        .classList.remove("fade-out-slide-down");
      document.getElementById("stationsVertical").classList.remove("shown");
    }, 200);
    document.getElementById("stationInfo").style.display = "block";
    setTimeout(function () {
      document.getElementById("stationInfo").classList.add("shown");
    }, 200);

    fetch(
      `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
        `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${stopCode}&keyOrigin=evoxEpsilon`
      )}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((buses) => {
        if (buses === null) {
          console.log("None coming to station");
        }
      })
      .catch((error) => {
        console.log("intelligence [1] error:", error);
      });

    document.getElementById(
      "busesComingtoStation"
    ).innerHTML = `<div class="timeItem skeleton-button2"></div><div class="timeItem skeleton-button2"></div><div class="timeItem skeleton-button2"></div><div class="timeItem skeleton-button2"></div>`;
    const stop_url_1 = encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webRoutesForStop&p1=${stopCode}&keyOrigin=evoxEpsilon`
    );
    fetch(
      `${serverIP}proxy?key=21&targetUrl=${stop_url_1}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((stop) => {
        let start = {};
        let isReady = false;
        let count = 0;
        let finale = "";
        const stop_url = encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${stopCode}&keyOrigin=evoxEpsilon`
        );
        fetch(
          `${serverIP}proxy?key=21&targetUrl=${stop_url}&vevox=${randomString()}`
        )
          .then((response) => response.json())
          .then((arrivals) => {
            document.getElementById("busesComingtoStation").innerHTML = "";
            let matchFound = false;
            let busesArrivals = {}; // Object to keep track of buses and their arrival times

            stop.forEach((data) => {
              count++;
              start[data.LineID] = {
                desc: data.LineDescr,
                lineCode: data.LineCode,
                routeCode: data.RouteCode,
                id: data.LineID,
              };
              if (count === stop.length) {
                isReady = true;
              }

              arrivals.forEach((arrive) => {
                if (arrive.route_code === data.RouteCode) {
                  if (!busesArrivals[data.LineID]) {
                    busesArrivals[data.LineID] = new Set(); // Initialize a Set for this bus to store unique times
                  }

                  busesArrivals[data.LineID].add(arrive.btime2); // Add the new arrival time to the Set (automatically handles duplicates)

                  matchFound = true; // Set flag to true if a match is found
                }
              });
            });

            //Get all the buses that are able to come to that station
            fetch(
              `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(`https://telematics.oasa.gr/api/?act=webRoutesForStop&p1=${stopCode}&keyOrigin=evoxEpsilon`)}&vevox=${randomString()}`
            )
              .then((response) => response.json())
              .then((busesToStation) => {

                Object.keys(busesArrivals).forEach((lineID) => {
                  const arrivalTimes = Array.from(busesArrivals[lineID]).join(
                    "', "
                  ); // Convert Set to array and join times with a comma
                  const busDesc = start[lineID].desc;
                  document.getElementById("busesComingtoStation").innerHTML += `
                          <div onclick="openExtLineId('${lineID}', '${busDesc}', this)" class="timeItem">
                              <p>${lineID}</p>
                              <div class="actions">
                                  <span>${arrivalTimes}'</span>
                                  <vox>
                                  <svg style="transform: rotate(180deg);margin-left:5px;" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                      <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#fff"></path>
                                  </svg>
                                  </vox>
                              </div>
                          </div>
                      `;
                });
                let spawnedToStation = {}
                busesToStation.forEach((bus) => {
                  if (!busesArrivals[bus.LineID]) {
                    if (spawnedToStation[bus.LineID]) {
                      spawnedToStation[bus.LineID]++
                      sessionStorage.setItem(`${bus.LineID}-${spawnedToStation[bus.LineID]}`, bus.RouteDescr)
                      if (document.getElementById(`stationGeneraleNotComing-${bus.LineID}`).querySelector("p span")) {
                        document.getElementById(`stationGeneraleNotComing-${bus.LineID}`).querySelector("p span").innerHTML = spawnedToStation[bus.LineID]
                      } else {
                        document.getElementById(`stationGeneraleNotComing-${bus.LineID}`).querySelector("p").innerHTML += `<span onclick="showOtherLines(this, '${bus.LineID}', event)" class="circle_howManyBusLinesFound">${spawnedToStation[bus.LineID]}</span>`
                      }
                      return;
                    }
                    spawnedToStation[bus.LineID] = 1
                    sessionStorage.setItem(`${bus.LineID}-${spawnedToStation[bus.LineID]}`, bus.RouteDescr)
                    document.getElementById("busesComingtoStation").innerHTML += `
                          <div id="stationGeneraleNotComing-${bus.LineID}" onclick="openExtLineId('${bus.LineID}', '${bus.RouteDescr}', this)" class="timeItem">
                              <p class="readyToShowMore">${bus.LineID}</p>
                              <div class="actions">
                                  <span><img src="busNotFound.png" width="25px" height="25px"></span>
                                  <vox>
                                  <svg style="transform: rotate(180deg);margin-left:5px;" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                      <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#fff"></path>
                                  </svg>
                                  </vox>
                              </div>
                          </div>
                      `;
                  }
                })
              })
              .catch((error) => {
                console.log("getStopGeneralBuses [1] error:", error);
              });



          })
          .catch((error) => {
            document.getElementById("busesComingtoStation").innerHTML = `
                      <div class="failed">
                          <img src="snap.png" class="failed-icon">
                          <vox class="failed-message">Δεν βρέθηκαν λεωφορεία</vox>
                          <span class="failed-subtext">Κανένα λεωφορείο δεν κατευθύνεται προς την στάση ${stopName}</span>
                      </div>
                  `;
            console.log("getStop [65] error:", error);
          });
      })
      .catch((error) => {
        document.getElementById(
          "busesComingtoStation"
        ).innerHTML = `<div class="failed">
      <img src="snap.png" class="failed-icon">
      <vox class="failed-message">Δεν βρέθηκαν λεωφορεία</vox>
      <span class="failed-subtext">Κανένα λεωφορείο δεν κατευθύνεται προς την στάση ${stopName}</span>
  </div>`;
        //alert("Δεν βρέθηκαν αντιστοιχίες για την καθορισμένη διαδρομή. [E]");
        console.log("getStop [63] error:", error);
      });
  } catch (error) {
    console.error("new funcs failed", error);
    document.getElementById("top-navigate").classList.remove("hidden");
    // $("#userFeed").fadeIn("fast")
    document.getElementById("userFeed").classList.remove("focused");
    document.getElementById("userFeed").style.display = "block";

    document.getElementById("busTimetable").classList.remove("shown");
    document.getElementById("busTimetable").style.display = "none";

    setTimeout(function () {
      document.getElementById("busTimetable").style.display = "block";
      document
        .getElementById("busTimetable")
        .classList.remove("fade-out-slide-down");
    }, 200);

    setTimeout(function () {
      document.getElementById("userFeed").classList.add("focused");

      if (
        document
          .getElementById("returnTopDefines")
          .classList.contains("scrolled")
      ) {
        const element = document.getElementById("main-wrapper");
        element.scrollTop = 0;
      }

      document
        .getElementById("stationsVertical")
        .classList.remove("fade-out-slide-down");
      document.getElementById("stationsVertical").classList.remove("shown");
      document.getElementById("stationsVertical").style.display = "block";

      setTimeout(function () {
        document.getElementById("stationsVertical").classList.add("shown");
      }, 200);

      setTimeout(function () {
        document.getElementById("busTimetable").style.display = "none";
        document.getElementById("busTimetable").classList.remove("shown");
      }, 200);

      closeSearch();
      document.getElementById("searchIntelli").classList.remove("notLoaded");
    }, 400);

    directBack = false;
  }
}

directBack = false;

function returnFromStationInfo() {
  haptics.trigger();
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }

  if (document.getElementById("bottomSearchParent").style.display === "none") {
    document.getElementById("bottomSearchParent").style.display = null;
  }

  document.getElementById("stationInfo").classList.add("fade-out-slide-down");
  setTimeout(function () {
    document.getElementById("stationInfo").style.display = "none";
  }, 200);
  setTimeout(function () {
    document
      .getElementById("stationInfo")
      .classList.remove("fade-out-slide-down");
    document.getElementById("stationInfo").classList.remove("shown");
  }, 500);

  if (directBack === true) {
    directBack = false;
    keepForVerticalStations = null;
    shownTimeTable = 0;
    currentInfoForSchedo = {};
    activeBusInfo = {};
    if (
      document.getElementById("returnTopDefines").classList.contains("scrolled")
    ) {
      const element = document.getElementById("main-wrapper");
      element.scrollTop = 0;
    }
    document.getElementById("top-navigate").classList.remove("hidden");
    document.getElementById("userFeed").classList.remove("focused");
    document.getElementById("busTimetable").style.display = "none";
    setTimeout(function () {
      document.getElementById("busTimetable").classList.remove("shown");
    }, 200);

    document.getElementById("userFeed").style.display = "block";

    document.getElementById("searchIntelli").classList.remove("notLoaded");
    return;
  } else {
    setTimeout(function () {
      document.getElementById("stationsVertical").style.display = "block";
      document.getElementById("stationsVertical").classList.add("shown");
      document
        .getElementById("stationsVertical")
        .classList.add("fade-in-slide-up");
    }, 200);
    setTimeout(function () {
      document
        .getElementById("stationsVertical")
        .classList.remove("fade-in-slide-up");
    }, 500);
  }
}

function searchInInput() {
  const lineIdToFind = document.getElementById("searchInSearch").value;
  if (lineIdToFind === "") {
    console.log("Clearing");
    $("#recommendSpawn").fadeIn("fast");
    document.getElementById("searchContainer").classList.remove("active");
    document.getElementById("toSpawnFinds").classList.add("hidden");
    spawnOnBarBuses();
  } else {
    $("#recommendSpawn").fadeOut("fast");
    document.getElementById("searchContainer").classList.add("active");
  }
  if (lineIdToFind.length < 2) {
    if (previouslines) {
      // Remove markers
      markers_intel.forEach((marker) => marker.remove());
      markers_intel = []; // Clear marker references

      // Remove layer and source
      if (map.getLayer(`route-${previouslines}`)) {
        map.removeLayer(`route-${previouslines}`);
      }
      if (map.getSource(`route-${previouslines}`)) {
        map.removeSource(`route-${previouslines}`);
      }
      map.flyTo({
        center: [parseFloat(myLoc[0]), parseFloat(myLoc[1])],
        zoom: 16,
        curve: 1,
        easing(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
      });
    }

    document
      .getElementById("toSpawnFinds")
      .querySelectorAll("*")
      .forEach((elem) => {
        elem.classList.add("simple-fadeOut");
      });
    return;
  }
  let matchingLines = fullLine.filter((line) =>
    line.LineID.includes(lineIdToFind)
  ); // Check for partial matches
  let shortMatches = fullLine.filter((line) => line.LineID === lineIdToFind);
  $("#linesContainer").fadeIn("fast");
  if (matchingLines.length === 0) {
    searchAndMarkPlaces(lineIdToFind);
  }
  //console.log(matchingLines)
  document.getElementById("toSpawnFinds").innerHTML = "";
  matchingLines.forEach((bus, index) => {
    const delay = index * 0.1;
    if (shortMatches[0] === bus) {
      spawnAndShowInfo(
        shortMatches[0].LineID,
        "deleteAfter",
        null,
        null,
        null,
        "saveSearch"
      );
      document.getElementById(
        "toSpawnFinds"
      ).innerHTML = `<div onclick="spawnAndShowInfo('${bus.LineID
      }', 'remain', '${bus.LineDescr
        }',null,null, 'saveSearch')" class="Block simple-fadeIn match" style="opacity:0;">
      <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#FFF"></path>
<path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#FFF"></path>
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"></path>
<path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#FFF"></path>
<path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#FFF"></path>
<path opacity="0.5" d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#FFF"></path>
<path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#FFF"></path>
<path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#FFF"></path>
</svg>${bus.LineID
        }<svg style="transform: rotate(-35deg)" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
  </div>${document.getElementById("toSpawnFinds").innerHTML}`;
    } else {
      document.getElementById(
        "toSpawnFinds"
      ).innerHTML += `<div onclick="spawnAndShowInfo('${bus.LineID}', 'remain', '${bus.LineDescr}',null,null, 'saveSearch')" class="Block simple-fadeIn" style="animation-delay: ${delay}s;opacity:0;">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#FFF"></path>
                  <path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#FFF"></path>
                  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"></path>
                  <path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#FFF"></path>
                  <path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#FFF"></path>
                  <path opacity="0.5" d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#FFF"></path>
                  <path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#FFF"></path>
                  <path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#FFF"></path>
                  </svg>${bus.LineID}<svg style="transform: rotate(-35deg)" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
                        </div>`;
    }
  });
  document.getElementById("toSpawnFinds").classList.remove("hidden");
}

function addInfinity(busLineId, stationCode, type, el) { //Change: use route code instead of LineId to avoid bus routes conflicts
  el.classList.add("loading");
  const toFindRouteCode = evoxIds[activeEvoxId];


  let foundLineCode = null
  let busHasNoMultipleRoutes = false;
  if (toFindRouteCode.multiple) {
    toFindRouteCode.multiple.forEach((route, i) => {
      if (route.LineDescr === toFindRouteCode.descr) {
        foundLineCode = route.LineCode
      }
    })
  } else {
    busHasNoMultipleRoutes = true
  }

  console.log(foundLineCode)

  //Do normal;
  if (busHasNoMultipleRoutes === false) {
    if (foundLineCode) {
      const linesSearch = fullLine.filter((item) => item.LineID === busLineId && item.LineCode === foundLineCode);
      mainProcess(linesSearch)
      console.log("[EVX] Using Primary Method. Bus has multiple routes. Will use the active one.")
    } else {
      console.error("[EVX] Primary failed. No routes?")
    }
  } else {
    const linesSearch = fullLine.filter((item) => item.LineID === busLineId);
    mainProcess(linesSearch)
    console.log("[EVX] Using Secondary Method. Bus has only one route.")
  }
  function mainProcess(linesSearch) {

    let routeCode = null;
    if (linesSearch.length === 0) {
      alert("Δεν βρέθηκε η γραμμή.");
    }

    linesSearch.forEach((line) => {
      console.warn("Line found:", line);
      const lineCode = line.LineCode;
      fetch(
        `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=webGetRoutes&p1=${lineCode}&keyOrigin=evoxEpsilon`
        )}&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((routes) => {
          console.log(routes);
          if (routes) {
            let matched = false;
            const toFindRouteDescr = toFindRouteCode.descr;
            const routeDescrs = routes.map((route) => route.RouteDescr);

            routes.forEach((route) => {
              const nearestMatchDescr = getNearestMatch(
                toFindRouteDescr,
                routeDescrs
              );
              if (route.RouteDescr === nearestMatchDescr) {
                console.log(route.RouteCode, route.RouteDescr);
                routeCode = route.RouteCode;
                matched = true;
                // You can uncomment this if you want to stop after finding the match
                // return;
              }
            });

            if (!matched) {
              alert("Σφάλμα εύρεσης της γραμμής.");
              //console.log("No matching route found.");
              el.classList.remove("loading");
              return;
            } else {
              console.log("OKAY", routeCode);
              if (type === "showUp" || type === "2min") {
                if (localStorage.getItem("extVOASA")) {
                  //el.classList.remove("loading");
                  //console.warn("Notification Set Halted! DEBUG")
                  //return;
                  fetch(
                    `https://florida.evoxs.xyz/liveNotif?username=${localStorage.getItem(
                      "t50-username"
                    )}&deviceId=${localStorage.getItem(
                      "extVOASA"
                    )}&busId=${busLineId}&stationCode=${stationCode}&routeCode=${routeCode}&origin=resign${type === "2min" ? "&method=2minutes" : ""
                    }&vevox=${randomString()}`
                  ) //&method=2minutes
                    .then((response) => response.text())
                    .then((data) => {
                      console.log("SchedoInfi:", data);
                      el.classList.remove("loading");
                      //set
                    })
                    .catch((error) => {
                      console.error("Failed to check for updates");
                    });
                } else {
                  alert(
                    "Δεν έχετε συνδεθεί με το Florida. Παρακαλώ συνδεθείτε για να ενεργοποιήσετε τις ειδοποιήσεις."
                  );
                }
              } else {
                alert(`Αγνωστος τύπος ειδοποίησης. ${type}`);
              }
            }
          } else {
            alert("Σφάλμα εύρεσης της γραμμής. [Routes]");
          }
        })
        .catch((error) => {
          el.classList.remove("loading");
          console.error("Failed to check for updates");
        });
    });
  }
  //if not ask.

}

function switchRouteTo(el) {
  const text = el?.textContent.trim();
  const workOn = evoxIds[activeEvoxId];
  const multiple = workOn.multiple;
  multiple.forEach((aroute) => {
    if (capitalizeWords(aroute.LineDescr) === text) {
      //redirect the page to the default route
      personalizedAutoBus[workOn.bus] = aroute.LineCode;
      workOn.descr = aroute.LineDescr;
      processInfo(activeEvoxId, "getTimes", null);
      console.log("Redirecting to default route", aroute.LineCode);
    } else if (
      capitalizeWords(aroute.LineDescr.match(/\((.*?)\)/)?.[1]) === text
    ) {
      //redirect the page to some other route
      personalizedAutoBus[workOn.bus] = aroute.LineCode;
      workOn.descr = aroute.LineDescr;
      processInfo(activeEvoxId, "getTimes", null);
      console.log("Redirecting to some other route", aroute.LineCode);
    } else {
      return;
    }

    localStorage.setItem(
      "personalizedAutoBus",
      JSON.stringify(personalizedAutoBus)
    );
  });
}

function openStation(code, descr, busId, busDescr) {
  haptics.trigger();
  console.log("Opening station:", code, descr);
  if (!busId || !busDescr) {
    fetch(
      `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(`https://telematics.oasa.gr/api/?act=webRoutesForStop&p1=${code}&keyOrigin=evoxEpsilon`)}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((busesToStation) => {
        console.log("busesToStation", busesToStation)
        openStation(code, descr, busesToStation[0].LineID, busesToStation[0].LineDescr)

      }).catch((error) => {
        console.log("Fallback [1] error:", error);
      });
    return;
  }
  console.warn(busId, busDescr);
  const linesSearch = fullLine.filter((item) => item.LineID === busId);
  let stopNow = false;
  linesSearch.forEach((line) => {
    console.warn("Line found:", line);
    //if (typeof busDescr === 'string' && busDescr.trim().length > 0) {
    //
    //  console.warn("busdesc is here")
    //  if(line.LineDescr !== busDescr) {
    //        console.warn("Line description mismatch:", line.LineDescr, "vs", busDescr);
    //        return;
    //  }
    //}
    if (stopNow === true) {
      return;
    }

    if (!busDescr) {
      stopNow = true;
    }
    const evoxId = generateRandomId(10);
    const busDataComplete = {
      bus: busId, // Use the correct bus data from the sorted array
      descr: busDescr,
      nextBusTime: null,
      timeInM: null, // Show 'Άγνωστη' if time is Infinity
      type: null,
      multiple: findBusBlocksByLineId(busId),
    };

    // Store the bus data with the generated ID
    evoxIds[evoxId] = busDataComplete;
    activeEvoxId = evoxId; // Set the active ID to the newly created one
  });
  document.getElementById("top-navigate").classList.add("hidden");
  //$("#userFeed").fadeOut("fast")
  document.getElementById("userFeed").classList.add("focused");
  document.getElementById("busTimetable").style.display = "block";
  setTimeout(function () {
    document.getElementById("busTimetable").classList.add("shown");
  }, 200);

  setTimeout(function () {
    document.getElementById("userFeed").style.display = "none";

    if (
      document.getElementById("returnTopDefines").classList.contains("scrolled")
    ) {
      const element = document.getElementById("main-wrapper");
      element.scrollTop = 0;
    }
    document
      .getElementById("busTimetable")
      .classList.add("fade-out-slide-down");

    setTimeout(function () {
      document.getElementById("busTimetable").style.display = "none";
      document
        .getElementById("busTimetable")
        .classList.remove("fade-out-slide-down");
      document.getElementById("busTimetable").classList.remove("shown");
    }, 200);
    document.getElementById("stationsVertical").style.display = "block";
    setTimeout(function () {
      document.getElementById("stationsVertical").classList.add("shown");
    }, 200);
    document
      .getElementById("stationsVertical")
      .classList.add("fade-out-slide-down");
    setTimeout(function () {
      document.getElementById("stationsVertical").style.display = "none";
    }, 200);
    setTimeout(function () {
      document
        .getElementById("stationsVertical")
        .classList.remove("fade-out-slide-down");
      document.getElementById("stationsVertical").classList.remove("shown");
    }, 500);

    closeSearch();
    document.getElementById("searchIntelli").classList.add("notLoaded");
    showStopDetails(code, descr);

    document.getElementById("bottomSearchParent").style.display = "none";
  }, 400);
  directBack = true;
}

function showMenu() {
  $("#account-home").fadeOut("fast");
  $("#notifications-home").fadeOut("fast", function () {
    const navigate = document.getElementById("top-navigate");
    navigate.classList.add("expand"); // Add the class to expand the element
    setTimeout(function () {
      // Add options dynamically or make them visible
      const options = document.createElement("div");
      options.classList.add("menu-options");
      options.innerHTML = `
        <button onclick="optionAction('Option 1')">Option 1</button>
        <button onclick="optionAction('Option 2')">Option 2</button>
        <button onclick="optionAction('Option 3')">Option 3</button>
      `;
      navigate.appendChild(options);
    }, 300); // Wait for the animation to complete
  });
}

function optionAction(option) {
  alert(`You selected: ${option}`);
}

function resetMenu() {
  const navigate = document.getElementById("top-navigate");

  // Reset styles applied in showMenu
  navigate.style.justifyContent = "center"; // Assuming "center" is the default
  navigate.style.transition = ""; // Clear any transition styles

  // Remove the shrink class
  navigate.classList.remove("shrink");

  // Reset visibility for icons
  const accountHome = document.getElementById("account-home");
  const notificationsHome = document.getElementById("notifications-home");

  accountHome.style.display = "block"; // Show the element
  notificationsHome.style.display = "block";

  // Optional: Reset anything else you modified in showMenu
}

function showLocalPanel() {
  if (
    document.getElementById("storage-editor").getAttribute("data-e") ===
    "hidden"
  ) {
    $("#storage-editor").fadeIn("fast");
    document.getElementById("storage-editor").setAttribute("data-e", "");
  } else {
    $("#storage-editor").fadeOut("fast");
    document.getElementById("storage-editor").setAttribute("data-e", "hidden");
  }
}

let startingJson = {};

let prevX = null;
let visualX = null;
function handleActivity(startingJson, first) {
  if (startingJson.start_min) {
    console.warn(startingJson);

    // Convert startTime to minutes
    const startTimeInMinutes =
      (new Date() - new Date(startingJson.startTime)) / (1000 * 60); // Difference in minutes

    // Compare startTimeInMinutes with start_min
    if (startTimeInMinutes > Number(startingJson.start_min)) {
      console.log("startTimeInMinutes > Number(startingJson.start_min)");
      return; // If true, stop the function early
    } else {
      console.log("Running normally");
      document.getElementById("activity").style.display = "flex";
    }

    function setBusIconLocation() {
      const indicator = document.getElementById("progress-indicator");
      const bus = document.getElementById("bus3D");

      const rect = indicator.getBoundingClientRect();
      const busParentRect = bus.offsetParent.getBoundingClientRect();

      // Align horizontally (if not already)
      bus.style.left = `${rect.left - busParentRect.left}px`;

      // Align vertically
      bus.style.top = `${rect.top - busParentRect.top - 35}px`;
      bus.style.opacity = "1";
    }
    if (first) {
      prevX = null;
      visualX = null;
      document.getElementById("progress-fill").style.width = `0%`;
      document.getElementById("progress-indicator").style.left = `0%`;
      setBusIconLocation();
    }

    fetch(
      `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
        `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${startingJson.station_id}&keyOrigin=evoxEpsilon`
      )}&vevox=${randomString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        const targetRouteCode = startingJson.route_code; // Replace this with your desired route_code
        const filteredData = data.filter(
          (item) => item.route_code === targetRouteCode
        );
        //console.log(filteredData[0])
        if (filteredData[0]) {
          const min = filteredData[0].btime2;
          if (min > startingJson.start_min) {
            document.getElementById("activity").style.display = "none";
          }
          //const min = te
          //const x = (startingJson.start_min - min / startingJson.start_min) * 100
          let x = 98 - (Number(min) * 100) / Number(startingJson.start_min);
          //console.log("starting x", x);
          x = x < 2 ? x + 4 : x;

          console.log("Activity:", min, "x:", x);
          if (prevX && x === prevX) {
            console.log("prev");
            if (!visualX) {
              visualX = x + 0.1;
            } else {
              visualX = visualX + 0.1;
            }

            document.getElementById(
              "progress-fill"
            ).style.width = `${visualX}%`;
            document.getElementById(
              "progress-indicator"
            ).style.left = `${visualX}%`;
          } else {
            document.getElementById("progress-fill").style.width = `${x}%`;
            document.getElementById("progress-indicator").style.left = `${x}%`;
          }
          prevX = x;

          document.getElementById("to-?").innerText = startingJson.stationName;
          document.getElementById("busidNoReq").innerText =
            startingJson.busName;
          document.getElementById("howMuchActivity").innerText = `${min} ${min >= 2 || min === 0 ? "λεπτά" : "λεπτό"
            }`;

          setBusIconLocation();
        }
      })
      .catch((error) => {
        console.log("Activity [1] error:", error);
      });
  } else {
    document.getElementById("activity").style.display = "none";
  }
}

function changeActivity() {
  const current = document
    .getElementById("progress-fill")
    .style.width.replace("%", "");
  document.getElementById("progress-fill").style.width = `${Number(current) + 10
    }%`;
  document.getElementById("progress-indicator").style.left = `${Number(current) + 10
    }%`;
}

function addActivity(stationName, stationId, currentMinEl) {
  haptics.trigger();
  const current = currentMinEl.getAttribute("data-time");
  startingJson = {
    busName: evoxIds[activeEvoxId].bus,
    stationName: stationName,
    station_id: stationId,
    route_code: activeRouteCode,
    start_min: current,
    startTime: new Date(),
  };
  localStorage.setItem("currentActivity", JSON.stringify(startingJson));
  console.log("Set!", startingJson);
  document.getElementById("notice-card").style.display = "block";
  setTimeout(function () {
    document.getElementById("notice-card").style.opacity = "1";
    setTimeout(function () {
      document.getElementById("notice-card").style.opacity = "0";
      setTimeout(function () {
        document.getElementById("notice-card").style.display = "none";
      }, 300);
    }, 5000);
  }, 200);

  handleActivity(startingJson, "first");
}

function removeAct() {
  localStorage.removeItem("currentActivity");
  document.getElementById("activity").style.display = "none";
  startingJson = {};
}

if (localStorage.getItem("currentActivity")) {
  startingJson = JSON.parse(localStorage.getItem("currentActivity"));
  handleActivity(startingJson, "first");
  function loop() {
    console.log("Calling handleActivity saved");
    handleActivity(startingJson);
    setTimeout(loop, 5000);
  }
  loop();
}
function triggerSave(busId, busLineCode, RouteCode, type, stopCode) {
  if (!type) {
    console.log("EPSILON:", busId, busLineCode, RouteCode);
    const json = JSON.stringify({
      id: busId,
      line_code: busLineCode,
      route_code: RouteCode,
    });
    fetch(
      `${serverIP}oasa?epsilon=edit&email=${localStorage.getItem(
        "t50-email"
      )}&password=${atob(
        localStorage.getItem("t50pswd")
      )}&pushingjson=${json}&type=line&vevox=${randomString()}`
    )
      .then((response) => response.text())
      .then((data) => {
        console.log("EPSILON:", data);
      })
      .catch((error) => {
        console.log("SAVE [1] error:", error);
      });
  } else {
    console.log("EPSILON:", busId, busLineCode, RouteCode, type);
    const busInfo = evoxIds[activeEvoxId];
    let matchingLines = fullLine.filter((line) => line.LineID === busInfo.bus);
    console.log("EPSILON: Found Matches:", matchingLines);
    const working = matchingLines[0];
    //alert(JSON.stringify(personalizedAutoBus[busInfo.bus]))
    const lineCode = working.LineCode;
    const json = JSON.stringify({
      id: stopCode, //station id
      line_match: busId, //matching active line id
      line_route_code: RouteCode, //matching active route code
    });
    fetch(
      `${serverIP}oasa?epsilon=edit&email=${localStorage.getItem(
        "t50-email"
      )}&password=${atob(
        localStorage.getItem("t50pswd")
      )}&pushingjson=${json}&type=station&vevox=${randomString()}`
    )
      .then((response) => response.text())
      .then((data) => {
        console.log("EPSILON:", data);
      })
      .catch((error) => {
        console.log("SAVE [2] error:", error);
      });
  }
}

function openFromMap(el, elem, old, fromNotifications, event) {
  const busId = el.getAttribute("data-bus");
  let busDescr = el.getAttribute("data-name");
  const linesSearch = fullLine.filter((item) => item.LineID === busId);
  if (fromNotifications) {
    event.stopPropagation()
    returnFromNotifications()
  }
  linesSearch.forEach((line) => {
    if (line.LineDescr !== busDescr) {
      console.warn(
        "Line description mismatch:",
        line.LineDescr,
        "vs",
        busDescr, "Fixing."
      );
      busDescr = line.LineDescr
      el.setAttribute("data-name", line.LineDescr)
    }
    const evoxId = generateRandomId(10);
    const busDataComplete = {
      bus: busId, // Use the correct bus data from the sorted array
      descr: busDescr,
      nextBusTime: null,
      timeInM: null, // Show 'Άγνωστη' if time is Infinity
      type: null,
      multiple: findBusBlocksByLineId(busId),
    };

    // Store the bus data with the generated ID
    evoxIds[evoxId] = busDataComplete;
    closeSearch();
    document.getElementById("bottomSearchParent").style.display = "none";
    setTimeout(function () {
      processInfo(evoxId, "getTimes");
      elem.innerHTML = old;
    }, 200);
  });
}

function favFromMap(el) {
  const busId = el.getAttribute("data-bus");
  if (localStorage.getItem("oasa_favorites")) {
    console.log("Found favorites");
    let favoriteBusesTemp = JSON.parse(localStorage.getItem("oasa_favorites")); //.reverse();
    if (favoriteBusesTemp.includes(busId)) {
      favoriteBusesTemp = favoriteBusesTemp.filter((item) => item !== busId);
      document.getElementById(
        "favoriteMap"
      ).innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill="#fff"></path>
                            </svg>
                            Προσθήκη`;
    } else {
      document.getElementById(
        "favoriteMap"
      ).innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path style="transform-origin:center;animation: pulse 5s infinite alternate;transition:transform 5s ease-in-out;"
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill="#fff"></path>
                            </svg>
                            Αφαίρεση`;
      favoriteBusesTemp.push(busId);
    }
    localStorage.setItem("oasa_favorites", JSON.stringify(favoriteBusesTemp));
    favoriteBuses = favoriteBusesTemp;
  } else {
    localStorage.setItem("oasa_favorites", JSON.stringify([busId]));
    document.getElementById(
      "favoriteMap"
    ).innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path style="transform-origin:center;animation: pulse 5s infinite alternate;transition:transform 5s ease-in-out;"
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill="#fff"></path>
                            </svg>
                            Αφαίρεση`;
  }
}

function showOnMap(evoxId) {
  haptics.trigger();

  const working = evoxIds[evoxId];
  openSearch();
  document.getElementById("searchInSearch").value = working.bus;
  searchInInput();
}

function changeToOpposite(whereto, bus, verify, element) {
  console.warn("Changing to opposite direction:", whereto, bus, verify);
  spawnAndShowInfo(bus, null, verify, whereto);
  document
    .getElementById("busDirections")
    .querySelector("div.active")
    .classList.remove("active");
  element.classList.add("active");
}

function openNotificationsView() {
  haptics.trigger();
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document.getElementById("top-navigate").classList.add("hidden");
  document.getElementById("userFeed").classList.add("focused");
  document.getElementById("notificationsView").style.display = "block";
  setTimeout(function () {
    document.getElementById("notificationsView").classList.add("shown");
  }, 200);
  setTimeout(function () {
    document.getElementById("userFeed").style.display = "none";
  }, 400);
  document.getElementById("searchIntelli").classList.add("notLoaded");
  document.getElementById("busInfo-onerror-show").style.display = "none";
  document.getElementById("busInfodefault").style.display = null;

  fetch(
    `https://florida.evoxs.xyz/devices?username=${localStorage.getItem(
      "t50-username"
    )}&password=${atob(
      localStorage.getItem("t50pswd")
    )}&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      const parseTime = (str) => {
        const [num, unit] = str.split(" ");
        const now = new Date();

        if (unit.startsWith("day")) return now - num * 24 * 60 * 60 * 1000;
        if (unit.startsWith("month"))
          return now - num * 30 * 24 * 60 * 60 * 1000;
        if (unit.startsWith("year"))
          return now - num * 365 * 24 * 60 * 60 * 1000;

        return Infinity;
      };

      let withLastUsed = [];
      const withoutLastUsed = [];

      for (const item of data) {
        if ("last_used" in item) {
          withLastUsed.push(item);
        } else {
          withoutLastUsed.push(item);
        }
      }

      withLastUsed.sort(
        (a, b) => parseTime(a.last_used) - parseTime(b.last_used)
      );
      withLastUsed = withLastUsed.reverse();
      console.log("Sorted with last_used:", withLastUsed);
      console.log("No last_used:", withoutLastUsed);
      const devices = document.getElementById("devices");
      devices.innerHTML = "";
      const apple = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="-1.5 0 20 20" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-102.000000, -7439.000000)" fill="#fff">
            <g transform="translate(56.000000, 160.000000)">
                <path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485"></path>
            </g>
        </g>
    </g>
    </svg>`;
      const linux = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 20 20" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-300.000000, -7519.000000)" fill="#fff">
            <g transform="translate(56.000000, 160.000000)">
                <path d="M259.612287,7362.44764 C260.52968,7362.95764 261.702366,7362.65564 262.231631,7361.77164 C262.760897,7360.88764 262.447489,7359.75763 261.530095,7359.24763 C260.612702,7358.73763 259.440017,7359.04063 258.909714,7359.92463 C258.381486,7360.80764 258.695932,7361.93764 259.612287,7362.44764 M255.687422,7374.39866 C254.843711,7374.39866 254.043587,7374.21766 253.327522,7373.89666 L251.993981,7376.19766 C253.107513,7376.72867 254.361146,7377.02867 255.687422,7377.02867 C256.458489,7377.02867 257.204649,7376.92567 257.91345,7376.73667 C258.037983,7375.99366 258.495641,7375.31066 259.224159,7374.90466 C259.953715,7374.49866 260.795351,7374.45966 261.524907,7374.72466 C262.942507,7373.38066 263.865089,7371.55266 264,7369.51765 L261.266501,7369.47865 C261.015359,7372.23666 258.613948,7374.39866 255.687422,7374.39866 M255.687422,7363.60164 C258.613948,7363.60164 261.015359,7365.76364 261.266501,7368.52165 L264,7368.48265 C263.865089,7366.44665 262.942507,7364.61864 261.523869,7363.27464 C260.795351,7363.54064 259.952677,7363.49964 259.224159,7363.09564 C258.495641,7362.68964 258.037983,7362.00564 257.912412,7361.26264 C257.203611,7361.07464 256.458489,7360.97164 255.686384,7360.97164 C254.361146,7360.97164 253.107513,7361.27164 251.993981,7361.80264 L253.327522,7364.10364 C254.043587,7363.78164 254.843711,7363.60164 255.687422,7363.60164 M250.084475,7368.99965 C250.084475,7367.17365 251.026775,7365.55964 252.467206,7364.58264 L251.064134,7362.31964 C249.386052,7363.40064 248.137609,7365.05264 247.618721,7366.98665 C248.224782,7367.46265 248.611872,7368.18765 248.611872,7368.99965 C248.611872,7369.81165 248.224782,7370.53665 247.618721,7371.01265 C248.137609,7372.94766 249.386052,7374.59966 251.064134,7375.68066 L252.467206,7373.41666 C251.026775,7372.43966 250.084475,7370.82665 250.084475,7368.99965 M259.613325,7375.55166 C258.695932,7376.06166 258.381486,7377.19167 258.910751,7378.07567 C259.440017,7378.95967 260.612702,7379.26267 261.530095,7378.75167 C262.447489,7378.24167 262.761934,7377.11167 262.231631,7376.22766 C261.702366,7375.34466 260.52968,7375.04166 259.613325,7375.55166 M245.918846,7367.15165 C244.859278,7367.15165 244,7367.97865 244,7368.99965 C244,7370.02065 244.859278,7370.84765 245.918846,7370.84765 C246.978414,7370.84765 247.836654,7370.02065 247.836654,7368.99965 C247.836654,7367.97865 246.978414,7367.15165 245.918846,7367.15165">
</path>
            </g>
        </g>
    </g>
</svg>`;
      withLastUsed.forEach((device) => {
        devices.innerHTML += `<div class="timeItem">
                                        <p>${device.os === "macOS" ? apple : linux
          }</p>
                                        <span>${device.extV}</span>
                                        <div class="actions">
                                            ${device.last_used}
                                        </div>
                                    </div>`;
      });

      let f = false;
      data.forEach((item) => {
        if (f === true) {
          return;
        }
        if (
          item.extV === localStorage.getItem("extV") ||
          item.extV === localStorage.getItem("extVOASA")
        ) {
          f = true;
          document.getElementById(
            "current-device"
          ).innerHTML = `<div class="timeItem">
                                        <p>${item.os === "macOS" ? apple : linux
            }</p>
                                        <span>${item.extV}</span>
                                    </div>`;
        }
      });

      if (f === false) {
        document.getElementById(
          "current-device"
        ).innerHTML = `<div class="timeItem">
                                        <span style="display:flex;flex-direction:row;align-items:center;gap:5px;">Florida OFF<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 24 24" version="1.1" xml:space="preserve">

<style type="text/css">
	.st0{opacity:0.2;fill:none;stroke:#fff;stroke-width:5.000000e-02;stroke-miterlimit:10;}
</style>


<path d="M20.7,19.3l-1-1c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1,1c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   C21.1,20.3,21.1,19.7,20.7,19.3z"/>

<path d="M14,22c0,0.6,0.4,1,1,1s1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1V22z"/>

<path d="M22,14h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h2c0.6,0,1-0.4,1-1S22.6,14,22,14z"/>

<path d="M20.7,8.4c0-1.4-0.5-2.6-1.5-3.6c-1-1-2.2-1.5-3.6-1.5S13,3.8,12,4.8L9.8,7c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l2.2-2.2   c1.2-1.2,3.2-1.2,4.4,0c0.6,0.6,0.9,1.4,0.9,2.2c0,0.8-0.3,1.6-0.9,2.2l-2.2,2.2c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3   s0.5-0.1,0.7-0.3l2.2-2.2C20.2,11,20.7,9.8,20.7,8.4z"/>

<path d="M3.3,15.6c0,1.4,0.5,2.6,1.5,3.6c1,1,2.2,1.5,3.6,1.5s2.6-0.5,3.6-1.5l2.2-2.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-2.2,2.2   c-1.2,1.2-3.2,1.2-4.4,0c-0.6-0.6-0.9-1.4-0.9-2.2c0-0.8,0.3-1.6,0.9-2.2l2.2-2.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L4.8,12   C3.8,13,3.3,14.2,3.3,15.6z"/>

<path d="M5.7,4.3l-1-1c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1,1C4.5,5.9,4.7,6,5,6s0.5-0.1,0.7-0.3C6.1,5.3,6.1,4.7,5.7,4.3z"/>

<path d="M10,4V2c0-0.6-0.4-1-1-1S8,1.4,8,2v2c0,0.6,0.4,1,1,1S10,4.6,10,4z"/>

<path d="M4,10c0.6,0,1-0.4,1-1S4.6,8,4,8H2C1.4,8,1,8.4,1,9s0.4,1,1,1H4z"/>


</svg></span>
                                    </div>`;
      } else {
        //document.getElementById("current-device").innerHTML += `<div class="timeItem">
        //                              <span>Device</span>
        //                          </div>`
      }
    })
    .catch((error) => {
      document.getElementById("busInfo-onerror-show").style.display = null;
      document.getElementById("busInfodefault").style.display = "none";
      document.getElementById(
        "current-device"
      ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M18.364 5.63604C19.9926 7.26472 21 9.51472 21 12C21 16.9706 16.9706 21 12 21C9.51472 21 7.26472 19.9926 5.63604 18.364M18.364 5.63604C16.7353 4.00736 14.4853 3 12 3C7.02944 3 3 7.02944 3 12C3 14.4853 4.00736 16.7353 5.63604 18.364M18.364 5.63604L5.63604 18.364" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
      document.getElementById(
        "devices"
      ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M18.364 5.63604C19.9926 7.26472 21 9.51472 21 12C21 16.9706 16.9706 21 12 21C9.51472 21 7.26472 19.9926 5.63604 18.364M18.364 5.63604C16.7353 4.00736 14.4853 3 12 3C7.02944 3 3 7.02944 3 12C3 14.4853 4.00736 16.7353 5.63604 18.364M18.364 5.63604L5.63604 18.364" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
      console.log("Load Florida List Error:", error);
      if (error.message.includes("Account Not Found")) {
        document.getElementById("noAccountNotice").style.display = null;
        document.getElementById("defaultNotice").style.display = "none";
      } else {
        document.getElementById("noAccountNotice").style.display = "none";
        document.getElementById("defaultNotice").style.display = null;
      }
    });
  const notifications = document.getElementById("active-notifications");

  const loading = `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>`
  notifications.innerHTML = loading;
  fetch(
    `https://florida.evoxs.xyz/activeSchedo?username=${localStorage.getItem(
      "t50-username"
    )}&deviceId=${localStorage.getItem("extV")
      ? localStorage.getItem("extV")
      : localStorage.getItem("extVOASA")
    }&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {



      let totalNotifis = 0
      const countdown = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8V13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 2H15" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
      const twomin = `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="25px" height="25px" viewBox="-1 0 19 19" class="cf-icon-svg"><path d="M16.417 9.6A7.917 7.917 0 1 1 8.5 1.683 7.917 7.917 0 0 1 16.417 9.6zm-5.431 2.113H8.309l1.519-1.353q.223-.203.43-.412a2.974 2.974 0 0 0 .371-.449 2.105 2.105 0 0 0 .255-.523 2.037 2.037 0 0 0 .093-.635 1.89 1.89 0 0 0-.2-.889 1.853 1.853 0 0 0-.532-.63 2.295 2.295 0 0 0-.76-.37 3.226 3.226 0 0 0-.88-.12 2.854 2.854 0 0 0-.912.144 2.373 2.373 0 0 0-.764.42 2.31 2.31 0 0 0-.55.666 2.34 2.34 0 0 0-.274.89l1.491.204a1.234 1.234 0 0 1 .292-.717.893.893 0 0 1 1.227-.056.76.76 0 0 1 .222.568 1.002 1.002 0 0 1-.148.536 2.42 2.42 0 0 1-.389.472L6.244 11.77v1.295h4.742z"/></svg>`;
      let isLastFetchDone = false;
      data.infinite.forEach((item, i) => {
        totalNotifis++
        fetch(
          `${serverIP}proxy?key=21&targetUrl=${encodeURIComponent(
            `https://telematics.oasa.gr/api/?act=getRouteName&p1=${item.known.route_code}&keyOrigin=evoxEpsilon`
          )}&vevox=${randomString()}`
        )
          .then((response) => response.json())
          .then((route_name) => {
            console.log(route_name, "EVX")
            const isLoading = !!notifications.querySelector("#loader-1");
            if (i === 0 && isLoading) {
              notifications.innerHTML = ""
            }
            if (i === data.infinite.length - 1) isLastFetchDone = true
            notifications.innerHTML += `<div class="timeItem fade-in-slide-up infinity" style="display:none;">
        <div class="timeItemContent">
                                        <p>${item.bus}</p>
                                        <span>${item.station}</span>
                                        <div class="actions">
                                            ${item.notificationType ===
                "countDownBegin"
                ? countdown
                : twomin
              }
                                        </div>
                                        </div>
                                         <div class="slidingOptionsFlorida">
                                            <div class="button-action-global">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M2.75 6.16667C2.75 5.70644 3.09538 5.33335 3.52143 5.33335L6.18567 5.3329C6.71502 5.31841 7.18202 4.95482 7.36214 4.41691C7.36688 4.40277 7.37232 4.38532 7.39185 4.32203L7.50665 3.94993C7.5769 3.72179 7.6381 3.52303 7.72375 3.34536C8.06209 2.64349 8.68808 2.1561 9.41147 2.03132C9.59457 1.99973 9.78848 1.99987 10.0111 2.00002H13.4891C13.7117 1.99987 13.9056 1.99973 14.0887 2.03132C14.8121 2.1561 15.4381 2.64349 15.7764 3.34536C15.8621 3.52303 15.9233 3.72179 15.9935 3.94993L16.1083 4.32203C16.1279 4.38532 16.1333 4.40277 16.138 4.41691C16.3182 4.95482 16.8778 5.31886 17.4071 5.33335H19.9786C20.4046 5.33335 20.75 5.70644 20.75 6.16667C20.75 6.62691 20.4046 7 19.9786 7H3.52143C3.09538 7 2.75 6.62691 2.75 6.16667Z" fill="#FFF"/>
<path d="M11.6068 21.9998H12.3937C15.1012 21.9998 16.4549 21.9998 17.3351 21.1366C18.2153 20.2734 18.3054 18.8575 18.4855 16.0256L18.745 11.945C18.8427 10.4085 18.8916 9.6402 18.45 9.15335C18.0084 8.6665 17.2628 8.6665 15.7714 8.6665H8.22905C6.73771 8.6665 5.99204 8.6665 5.55047 9.15335C5.10891 9.6402 5.15777 10.4085 5.25549 11.945L5.515 16.0256C5.6951 18.8575 5.78515 20.2734 6.66534 21.1366C7.54553 21.9998 8.89927 21.9998 11.6068 21.9998Z" fill="#FFF"/>
</svg>
                                                   
                                                </div>
                                                <div data-bus="${item.bus}" data-name="${route_name[0].route_descr || 'Unknown'}" class="button-action-global openFromNotifications">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-480.000000, -240.000000)">
            <g transform="translate(480.000000, 240.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">
                </path>
                <path d="M21,4 C21,3.44772 20.5523,3 20,3 L15,3 C14.4477,3 14,3.44772 14,4 C14,4.55229 14.4477,5 15,5 L17.5858,5 L15.4766,7.10925 C16.0231,7.49844 16.5016,7.97695 16.8908,8.52347 L19,6.41424 L19,9 C19,9.55228 19.4477,10 20,10 C20.5523,10 21,9.55228 21,9 L21,4 Z M15.4765,7.10925 C14.4957,6.41079 13.2958,6 12,6 L5,6 C3.89543,6 3,6.89543 3,8 L3,19 C3,20.1046 3.89543,21 5,21 L16,21 C17.1046,21 18,20.1046 18,19 L18,12 C18,10.7042 17.5892,9.50428 16.8907,8.52347 L10.7071,14.7071 C10.3166,15.0976 9.68342,15.0976 9.29289,14.7071 C8.90237,14.3166 8.90237,13.6834 9.29289,13.2929 L15.4765,7.10925 Z" fill="#FFF">
                </path>
            </g>
        </g>
    </g>
</svg>
                                                   
                                                </div>
                                            
                                        </div>
                                    </div>`;
          })
          .catch((error) => {
            console.error("EVX", error)
          });



      });
      const firstFetch = setInterval(function () {
        if (isLastFetchDone === true) {
          isLastFetchDone = false
          clearInterval(firstFetch)
          notifications.querySelectorAll(".timeItem.infinity").forEach(item => {
            item.style.display = null
            let startX = 0;
            let currentX = 0;
            let dragging = false;

            const content = item.querySelector('.timeItemContent');
            const sliding = item.querySelector('.slidingOptionsFlorida');
            const slidingWidth = sliding.offsetWidth;

            // Initialize sliding position
            sliding.style.position = 'absolute';
            sliding.style.top = '0';
            sliding.style.bottom = '0';
            sliding.style.right = `-${slidingWidth}px`;

            item.addEventListener('touchstart', e => {
              document.getElementById("busInfodefault").style.overflow = "hidden"
              document.getElementById("notificationsView").style.overflow = "hidden"
              startX = e.touches[0].clientX;
              dragging = true;
              content.style.transition = 'none';
              sliding.style.transition = 'none';
            });

            item.addEventListener('touchmove', e => {
              if (!dragging) return;
              currentX = e.touches[0].clientX - startX;
              if (currentX < 0) { // swipe left only
                const moveX = Math.max(currentX, -slidingWidth); // limit to slidingWidth
                content.style.transform = `translateX(${moveX}px)`;
                sliding.style.right = `${-slidingWidth - moveX}px`; // move sliding in
              }
            });

            item.addEventListener('touchend', e => {
              document.getElementById("notificationsView").style.overflow = "auto"
              document.getElementById("busInfodefault").style.overflow = "auto"
              dragging = false;
              content.style.transition = 'transform 0.2s';
              sliding.style.transition = 'right 0.2s';

              if (currentX < -slidingWidth / 2) {
                item.classList.add('swiped');
                content.style.transform = `translateX(-${slidingWidth}px)`;
                sliding.style.right = `0px`;
              } else {
                item.classList.remove('swiped');
                content.style.transform = `translateX(0)`;
                sliding.style.right = `-${slidingWidth}px`;
              }

              currentX = 0;
            });

            item.querySelectorAll('.slidingOptionsFlorida .button-action-global.openFromNotifications').forEach(btn => {
              console.log(btn, "EVXVX")
              btn.addEventListener('click', event => {
                event.stopPropagation()
                openFromMap(btn, null, null, true, event);
              });
            });
          });
        }
      }, 100)

      const clock = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#fff"/>
<path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#fff"/>
</svg>`;
      data.schedo.forEach((item, i) => {
        const isLoading = !!notifications.querySelector("#loader-1");
        if (i === 0 && isLoading) notifications.innerHTML = ""
        totalNotifis++
        notifications.innerHTML += `<div class="timeItem fade-in-slide-up clockNotifs" style="display:none;">
        <div class="timeItemContent">
                                        <p>${item.bus}</p>
                                        <span>${item.time}</span>
                                        <div class="actions">
                                            ${clock}
                                        </div>
                                        </div>
                                         <div class="slidingOptionsFlorida">
                                            <div class="button-action-global">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M2.75 6.16667C2.75 5.70644 3.09538 5.33335 3.52143 5.33335L6.18567 5.3329C6.71502 5.31841 7.18202 4.95482 7.36214 4.41691C7.36688 4.40277 7.37232 4.38532 7.39185 4.32203L7.50665 3.94993C7.5769 3.72179 7.6381 3.52303 7.72375 3.34536C8.06209 2.64349 8.68808 2.1561 9.41147 2.03132C9.59457 1.99973 9.78848 1.99987 10.0111 2.00002H13.4891C13.7117 1.99987 13.9056 1.99973 14.0887 2.03132C14.8121 2.1561 15.4381 2.64349 15.7764 3.34536C15.8621 3.52303 15.9233 3.72179 15.9935 3.94993L16.1083 4.32203C16.1279 4.38532 16.1333 4.40277 16.138 4.41691C16.3182 4.95482 16.8778 5.31886 17.4071 5.33335H19.9786C20.4046 5.33335 20.75 5.70644 20.75 6.16667C20.75 6.62691 20.4046 7 19.9786 7H3.52143C3.09538 7 2.75 6.62691 2.75 6.16667Z" fill="#FFF"/>
<path d="M11.6068 21.9998H12.3937C15.1012 21.9998 16.4549 21.9998 17.3351 21.1366C18.2153 20.2734 18.3054 18.8575 18.4855 16.0256L18.745 11.945C18.8427 10.4085 18.8916 9.6402 18.45 9.15335C18.0084 8.6665 17.2628 8.6665 15.7714 8.6665H8.22905C6.73771 8.6665 5.99204 8.6665 5.55047 9.15335C5.10891 9.6402 5.15777 10.4085 5.25549 11.945L5.515 16.0256C5.6951 18.8575 5.78515 20.2734 6.66534 21.1366C7.54553 21.9998 8.89927 21.9998 11.6068 21.9998Z" fill="#FFF"/>
</svg>
                                                   
                                                </div>
                                                <div data-bus="${item.bus}" data-name="Unknown" class="button-action-global openFromNotifications">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-480.000000, -240.000000)">
            <g transform="translate(480.000000, 240.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">
                </path>
                <path d="M21,4 C21,3.44772 20.5523,3 20,3 L15,3 C14.4477,3 14,3.44772 14,4 C14,4.55229 14.4477,5 15,5 L17.5858,5 L15.4766,7.10925 C16.0231,7.49844 16.5016,7.97695 16.8908,8.52347 L19,6.41424 L19,9 C19,9.55228 19.4477,10 20,10 C20.5523,10 21,9.55228 21,9 L21,4 Z M15.4765,7.10925 C14.4957,6.41079 13.2958,6 12,6 L5,6 C3.89543,6 3,6.89543 3,8 L3,19 C3,20.1046 3.89543,21 5,21 L16,21 C17.1046,21 18,20.1046 18,19 L18,12 C18,10.7042 17.5892,9.50428 16.8907,8.52347 L10.7071,14.7071 C10.3166,15.0976 9.68342,15.0976 9.29289,14.7071 C8.90237,14.3166 8.90237,13.6834 9.29289,13.2929 L15.4765,7.10925 Z" fill="#FFF">
                </path>
            </g>
        </g>
    </g>
</svg>
                                                   
                                                </div>
                                            
                                        </div>
                                    </div>`;
      });

      setTimeout(function () {
        notifications.querySelectorAll(".timeItem.clockNotifs").forEach(item => {
          item.style.display = null
          let startX = 0;
          let currentX = 0;
          let dragging = false;

          const content = item.querySelector('.timeItemContent');
          const sliding = item.querySelector('.slidingOptionsFlorida');
          const slidingWidth = sliding.offsetWidth;

          // Initialize sliding position
          sliding.style.position = 'absolute';
          sliding.style.top = '0';
          sliding.style.bottom = '0';
          sliding.style.right = `-${slidingWidth}px`;

          item.addEventListener('touchstart', e => {
            document.getElementById("busInfodefault").style.overflow = "hidden"
            document.getElementById("notificationsView").style.overflow = "hidden"
            startX = e.touches[0].clientX;
            dragging = true;
            content.style.transition = 'none';
            sliding.style.transition = 'none';
          });

          item.addEventListener('touchmove', e => {
            if (!dragging) return;
            currentX = e.touches[0].clientX - startX;
            if (currentX < 0) { // swipe left only
              const moveX = Math.max(currentX, -slidingWidth); // limit to slidingWidth
              content.style.transform = `translateX(${moveX}px)`;
              sliding.style.right = `${-slidingWidth - moveX}px`; // move sliding in
            }
          });

          item.addEventListener('touchend', e => {
            document.getElementById("notificationsView").style.overflow = "auto"
            document.getElementById("busInfodefault").style.overflow = "auto"
            dragging = false;
            content.style.transition = 'transform 0.2s';
            sliding.style.transition = 'right 0.2s';

            if (currentX < -slidingWidth / 2) {
              item.classList.add('swiped');
              content.style.transform = `translateX(-${slidingWidth}px)`;
              sliding.style.right = `0px`;
            } else {
              item.classList.remove('swiped');
              content.style.transform = `translateX(0)`;
              sliding.style.right = `-${slidingWidth}px`;
            }

            currentX = 0;
          });

          item.querySelectorAll('.slidingOptionsFlorida .button-action-global.openFromNotifications').forEach(btn => {
            console.log(btn, "EVXVX")
            btn.addEventListener('click', event => {
              event.stopPropagation()
              openFromMap(btn, null, null, true, event);
            });
          });
        });
      }, 300)


      if (totalNotifis === 0) {
        notifications.innerHTML += `
        <div style="display:flex;flex-direction:column;width:100%;justify-content:center;align-items:center;text-align:center">
        <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z" fill="#fff"/>
</svg>
        <span>Καμία προσεχής ειδοποίηση.</span>
        </div>`;
      }
    })
    .catch((error) => {
      console.log("Load Florida List Error:", error);
      document.getElementById(
        "active-notifications"
      ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M18.364 5.63604C19.9926 7.26472 21 9.51472 21 12C21 16.9706 16.9706 21 12 21C9.51472 21 7.26472 19.9926 5.63604 18.364M18.364 5.63604C16.7353 4.00736 14.4853 3 12 3C7.02944 3 3 7.02944 3 12C3 14.4853 4.00736 16.7353 5.63604 18.364M18.364 5.63604L5.63604 18.364" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    });
}

function returnFromNotifications() {
  haptics.trigger();
  document.getElementById("bottomSearchParent").style.display = null;
  if (
    document.getElementById("returnTopDefines").classList.contains("scrolled")
  ) {
    const element = document.getElementById("main-wrapper");
    element.scrollTop = 0;
  }
  document.getElementById("top-navigate").classList.remove("hidden");
  document.getElementById("userFeed").classList.remove("focused");
  document.getElementById("notificationsView").style.display = "none";
  setTimeout(function () {
    document.getElementById("notificationsView").classList.remove("shown");
  }, 200);

  document.getElementById("userFeed").style.display = "block";

  document.getElementById("searchIntelli").classList.remove("notLoaded");
}

function loginFlorida(el) {
  if (el) {
    el.innerHTML += `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>`;
  }
  const username = document.getElementById("username0").value;
  const password = document.getElementById("password0").value;
  const evoxJson = {
    username: username,
    password: password,
  };
  if (evoxJson.username === "" || evoxJson.password === "") {
    el ? el.querySelector("svg").remove() : null;
    return;
  }
  fetch("https://florida.evoxs.xyz/oasaReg", {
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
      if (!data.includes("Exists")) {
        localStorage.setItem("t50-username", username);
        localStorage.setItem("t50-pswd", btoa(password));
        localStorage.setItem("t50pswd", btoa(password));
        localStorage.setItem("t50-email", `${username}@evoxs.xyz`);
        document.getElementById("nameterms").innerText = username;
        $("#loginStep2").fadeOut("fast", function () {
          $("#loginStep3").fadeIn("fast", function () {
            el ? el.querySelector("svg").remove() : null;
            localStorage.setItem("isOasaLoggedIn", "true");
            localStorage.setItem("loginType", "floridaDirect");
            document.getElementById("bottomSearchParent").style.zIndex = "-1";
          });
        });
      } else {
        alert(`Λάθος κωδικός πρόσβασης.\nΔοκιμάστε άλλο όνομα χρήστη.`);
      }
    })
    .catch((error) => {
      alert(`Failed: ${error.message}`);
      el ? el.querySelector("svg").remove() : null;
      console.error("Fetch error:", error);
    });
}

function loginAsGuestFinal() {
  $("#loginStepGuest").fadeOut("fast", function () {
    $("#loginStepLast").fadeIn("fast", function () {
      //localStorage.setItem("isOasaLoggedIn", "false")

      const bottomText = document.getElementById("bottomText");
      bottomText.innerHTML = `1/2 Προετοιμασία`;
      bottomText.style.display = "flex";

      setTimeout(function () {
        bottomText.classList.add("fade-out-slide-down");
        setTimeout(() => {
          bottomText.innerHTML = `2/2 Ολοκλήρωση`;
          bottomText.classList.remove("fade-out-slide-down");
          localStorage.setItem("hasDismissedSetup", "true");
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        }, 200);
      }, 1500);
    });
  });
}

function enableNotifications(noui) {
  console.log("Enabling notifications for OS:", os, "Version:", osVersion);

  if (!("serviceWorker" in navigator && "PushManager" in window)) {
    alert(
      "Το πρόγραμμα περιήγησής σας δεν υποστηρίζει ειδοποιήσεις.\nΑλλάξτε σε https:// και δοκιμάστε ξανά."
    );
    return;
  }

  if (!noui) $("#loginStep3").fadeOut(() => $("#loginStepLast").fadeIn());
  const bottomText = document.getElementById("bottomText");
  bottomText.innerHTML = `1/4 Προετοιμασία`;
  bottomText.style.display = "flex";

  navigator.serviceWorker
    .register("./resign-sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then((swReady) => {
      console.log("Service Worker is active:", swReady);
      if (!noui) bottomText.classList.add("fade-out-slide-down");
      setTimeout(() => {
        if (!noui) bottomText.innerHTML = `2/4 Τοπική Προετοιμασία`;
        if (!noui) bottomText.classList.remove("fade-out-slide-down");
      }, 500);

      return Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
        if (permission !== "granted") {
          throw new Error("Ο χρήστης δεν επέτρεψε τις ειδοποιήσεις.");
        }

        return swReady.pushManager.getSubscription().then((existingSub) => {
          if (existingSub) {
            console.log("Using existing subscription:", existingSub);
            return existingSub;
          }
          console.log("Subscribing...");
          return swReady.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              "BA15u7YIY1VPm9ulrTmaG_dTL1tJj59pso6K46lc2i45u-r1bmdl1t6KOrHxMmzyn8ZDQelik0mGn_blW9gAhg4"
            ),
          });
        });
      });
    })
    .then((subscription) => {
      if (!subscription) throw new Error("Η εγγραφή είναι κενή.");
      console.log("User is subscribed:", subscription);

      if (!noui) bottomText.classList.add("fade-out-slide-down");
      setTimeout(() => {
        if (!noui) bottomText.innerHTML = `3/4 Τοπική Εγγραφή`;
        if (!noui) bottomText.classList.remove("fade-out-slide-down");
      }, 500);

      const evoxJson = {
        username: localStorage.getItem("t50-username"),
        os1: os,
        osVersion: osVersion,
        method: "attachOASA",
        subscription,
      };

      return fetch("https://florida.evoxs.xyz/oasaAttach", {
        method: "POST",
        body: JSON.stringify(evoxJson),
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(`HTTP ${response.status}: ${err}`);
        }
        return response.json();
      });
    })
    .then((data) => {
      console.log("Florida Response:", data);
      if (data.message === "Complete") {
        if (!noui) {
          bottomText.classList.add("fade-out-slide-down");
          setTimeout(() => {
            bottomText.innerHTML = `4/4 Επικοινωνία με Evox`;
            bottomText.classList.remove("fade-out-slide-down");
            localStorage.setItem("extVOASA", data.id);
            localStorage.setItem("extV", data.id);
            sessionStorage.setItem("privileges", "florida");
            setTimeout(() => skipFlorida(), 2000);
          }, 500);
        } else {
          document.getElementById("notifications-toggle").checked = true;
        }
      }
    })
    .catch((err) => {
      console.error("Error during notification setup:", err);

      if (err.message === "Ο χρήστης δεν επέτρεψε τις ειδοποιήσεις.") {
        setTimeout(() => {
          bottomText.innerHTML = `4/4 Λειτουργία χωρίς ειδοποιήσεις`;
          bottomText.classList.remove("fade-out-slide-down");
          setTimeout(() => skipFlorida(), 3500);
        }, 500);
      } else {
        bottomText.innerHTML = `❌ Αποτυχία<br>${err.message}`;
        bottomText.style.display = "flex";
      }
    });
}

let isScreenBusy = false;
function spawnOnTop(el) {
  if (isScreenBusy === true) {
    return;
  }

  haptics.trigger();

  const rect = el.getBoundingClientRect();
  const computedStyle = getComputedStyle(el);
  const X_OFFSET = -7.5; // left
  const Y_OFFSET = -8; // up

  isScreenBusy = true;

  document.getElementById("menuContainer").style.left = `${X_OFFSET}px`;
  document.getElementById("menuContainer").style.top = `${Y_OFFSET}px`;
  document.getElementById("menuItems").style.left = `${rect.left + X_OFFSET}px`;
  document.getElementById("menuItems").style.top = `${rect.top + Y_OFFSET}px`;
  document.getElementById(
    "menuItems"
  ).style.padding = `${computedStyle.padding}`;

  document.getElementById("menuContainer").style.display = "block";
  setTimeout(function () {
    const container = document.getElementById("menuContainer");
    container.style.opacity = "1";

    menu_open.play();
    container
      .querySelectorAll(".menuItem, .alertInMenu")
      .forEach((div, index) => {
        if (index === 0) return;
        console.log(div);
        setTimeout(function () {
          div.style.opacity = "1";
          div.style.transform = "translateY(0px)";
          //div.classList.add('show');
        }, (index - 1) * 100);
      });
    setTimeout(() => {
      isScreenBusy = false;
    }, (container.querySelectorAll(".menuItem, .alertInMenu").length - 2) * 100 + 50); // +50ms buffer
  }, 100);
}

function closeMenu() {
  if (isScreenBusy === true) {
    return;
  }
  const container = document.getElementById("menuContainer");
  //container.style.opacity = '1';
  isScreenBusy = true;
  container.querySelectorAll(".menuItem").forEach((div, index) => {
    if (index === 0) return;
    setTimeout(function () {
      container.querySelectorAll(".menuItem, .alertInMenu")[
        container.querySelectorAll(".menuItem, .alertInMenu").length - index
      ].style.transform = "translateY(50px)";
      container.querySelectorAll(".menuItem, .alertInMenu")[
        container.querySelectorAll(".menuItem, .alertInMenu").length - index
      ].style.opacity = "0";
    }, (index - 1) * 100);
  });
  setTimeout(function () {
    container.style.opacity = "0";
    setTimeout(function () {
      container.style.display = "none";
    }, 500);
  }, 400);
  setTimeout(() => {
    isScreenBusy = false;
  }, (container.querySelectorAll(".menuItem, .alertInMenu").length - 2) * 100 + 50); // +50ms buffer
}

let activePage = 1;

function changeScreen(el) {
  const menuItems = document.querySelectorAll("#menuItems .menuItem");
  const arrow = document.querySelector(".arrowMenu");

  haptics.trigger();
  menuItems.forEach((item, index) => {
    if (item === el) {
      const newPage = index;
      const yOffset = (newPage - 1) * 80;
      const isMovingDown = newPage > activePage;

      const rotateAngle = isMovingDown ? -45 : 45;
      arrow.style.transform = `translateY(${(activePage - 1) * 80
        }px) rotate(${rotateAngle}deg)`;

      setTimeout(() => {
        arrow.style.transform = `translateY(${yOffset}px) rotate(${rotateAngle}deg)`;
      }, 50);

      setTimeout(() => {
        arrow.style.transform = `translateY(${yOffset}px) rotate(0deg)`;
        nowCheckForFunctions();
      }, 350);

      activePage = newPage;
    }
  });

  function nowCheckForFunctions() {
    setTimeout(function () {
      //For complete arrow stop [90%]

      document.getElementById("content").style.display = "none";
      document.getElementById("settingsContainer").style.display = "none";
      document.getElementById("reportBug").style.display = "none";
      document.getElementById("evoxAccount").style.display = "none";

      document.getElementById("bottomSearchParent").style.opacity = "0";
      setTimeout(function () {
        document.getElementById("bottomSearchParent").style.display = "none";
      }, 300);
      if (activePage === 1) {
        //Home
        document.getElementById("content").style.display = null;
        document.getElementById("bottomSearchParent").style.display = null;
        setTimeout(function () {
          document.getElementById("bottomSearchParent").style.display = null;
          document.getElementById("bottomSearchParent").style.opacity = "1";
        }, 400);
      }

      if (activePage === 2) {
        //Evox Account
        document
          .getElementById("evoxAccount")
          .classList.add("fade-in-slide-up");
        document.getElementById("content").style.display = "none";
        document.getElementById("evoxAccount").style.display = null;
        setTimeout(function () {
          document
            .getElementById("evoxAccount")
            .classList.remove("fade-in-slide-up");
        }, 500);
        setupEvoxAccount();
      }

      if (activePage === 4) {
        //Report Bug
        document.getElementById("reportBug").classList.add("fade-in-slide-up");
        document.getElementById("content").style.display = "none";
        document.getElementById("reportBug").style.display = null;
        setTimeout(function () {
          document
            .getElementById("reportBug")
            .classList.remove("fade-in-slide-up");
        }, 500);
      }

      if (activePage === 3) {
        //Settings
        document
          .getElementById("settingsContainer")
          .classList.add("fade-in-slide-up");
        document.getElementById("content").style.display = "none";
        document.getElementById("settingsContainer").style.display = null;
        setTimeout(function () {
          document
            .getElementById("settingsContainer")
            .classList.remove("fade-in-slide-up");
        }, 500);
        setupSettings();
      }

      if (activePage === 5) {
        window.location.reload();
      } else {
        closeMenu();
      }
    }, 200);
    //Immediate action
  }
}

function setupEvoxAccount() {
  const fav_buses = localStorage.getItem("oasa_favorites");
  const fav_stations = localStorage.getItem("favorite_stations");
  let favoritesTotal = 0;
  if (fav_buses) {
    favoritesTotal = favoritesTotal + JSON.parse(fav_buses).length;
  }
  if (fav_stations) {
    favoritesTotal = favoritesTotal + JSON.parse(fav_stations).length;
  }
  document.getElementById("evxAccountUsername").innerText = localStorage.getItem("t50-username")
  document.getElementById("evxAccountPFP").src = document.getElementById("oasaPfp").src
  document.getElementById("favoritesTotal").innerText = favoritesTotal;
  document.getElementById("activeNotifications").innerText =
    document.getElementById("activeNotifs").innerText;

  const evxEmail = localStorage.getItem("t50-email");
  const evxPswd = localStorage.getItem("t50pswd");
  if (evxEmail && evxPswd) {
    fetch(
      `${serverIP}accounts?email=${evxEmail}&password=${atob(evxPswd)}&autologin=true&ip=null`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        if (
          data.includes("Credentials Correct") ||
          data.includes("IP Not Verified")
        ) {
          document.getElementById("evxConnection").innerText = "Ενεργή"
        } else {
          document.getElementById("evxConnection").innerText = "Ανενεργή"
        }
      })
      .catch((error) => {
        console.error("Server Connection Failed!", error);
      });
  }
}

let hasSettingsEventListenersSet = false;
function setupSettings() {
  const extVOASA = localStorage.getItem("extVOASA");
  if (extVOASA) {
    document.getElementById("notifications-toggle").checked = true;
  }

  if (isLightMode()) {
    document.getElementById("theme-light").checked = true;
  }

  const notificationsBox = document.getElementById("notifications-toggle");
  if (hasSettingsEventListenersSet === true) return;
  hasSettingsEventListenersSet = true;
  notificationsBox.addEventListener("change", function () {
    if (notificationsBox.checked) {
      if (localStorage.getItem("extVOASA_TEMP")) {
        localStorage.setItem("extVOASA", localStorage.getItem("extVOASA_TEMP"));
        localStorage.removeItem("extVOASA_TEMP");
      } else {
        enableNotifications(true);
      }
    } else {
      localStorage.setItem("extVOASA_TEMP", localStorage.getItem("extVOASA"));
      localStorage.removeItem("extVOASA");
    }
    //This checks the new value not the old one
  });

  const lightMode = document.getElementById("theme-light");
  lightMode.addEventListener("change", function () {
    if (lightMode.checked) {
    } else {
    }
    toggleLightModeStyles();
  });
}

function toggleLightModeStyles() {
  //helper
  const phone = document.getElementById("phone");
  const loaders = document.querySelectorAll(".fullScreenLoader");

  // Toggle #phone --fade-color
  if (phone) {
    const currentFade = phone.style.getPropertyValue("--fade-color");
    if (currentFade === "rgb(124, 124, 124)" || currentFade === "#919191") {
      phone.style.setProperty("--fade-color", "inherit");
    } else {
      phone.style.setProperty("--fade-color", "#919191");
    }
  }

  // Toggle .fullScreenLoader background-color
  loaders.forEach((loader) => {
    const currentBg = loader.style.backgroundColor;
    if (currentBg === "rgb(124, 124, 124)" || currentBg === "#919191") {
      loader.style.backgroundColor = "inherit";
    } else {
      loader.style.backgroundColor = "#919191";
    }
  });
}

function triggerNotificationsReload() {
  fetch(
    `https://florida.evoxs.xyz/activeSchedo?username=${localStorage.getItem(
      "t50-username"
    )}&deviceId=${localStorage.getItem("extV")
      ? localStorage.getItem("extV")
      : localStorage.getItem("extVOASA")
    }&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      let count = 0;
      data.infinite.forEach((item) => {
        count++;
      });
      data.schedo.forEach((item) => {
        count++;
      });
      if (count === 0) {
        document.getElementById("activeNotifs").style.display = "none";
      } else {
        document.getElementById("activeNotifs").style.display = "flex";
      }
      document.getElementById("activeNotifs").innerHTML = count;
    })
    .catch((error) => {
      console.log("Load Florida List Error:", error);
    });
}

const themes = [
  {
    "--search-bg": "#1f42f4",
    "--box-bg": "#1f42f425",
    "--box-border": "#293fac",
    "--clock-bg": "#3557fd",
  },
  {
    "--search-bg": "#00960c",
    "--box-bg": "#51f41f25",
    "--box-border": "#4eac29",
    "--clock-bg": "#5dfd35",
  },
  {
    "--search-bg": "#004080",
    "--box-bg": "#6090c825",
    "--box-border": "#003366",
    "--clock-bg": "#3366cc",
  },
  {
    "--search-bg": "#800000",
    "--box-bg": "#cc666625",
    "--box-border": "#990000",
    "--clock-bg": "#cc3333",
  },
  {
    "--search-bg": "#ff8c00",
    "--box-bg": "#ffd48025",
    "--box-border": "#cc7000",
    "--clock-bg": "#ffa500",
  },
  {
    "--search-bg": "#2e8b57",
    "--box-bg": "#66cc9955",
    "--box-border": "#1a5d3b",
    "--clock-bg": "#33cc99",
  },
  {
    "--search-bg": "#4682b4",
    "--box-bg": "#99ccee25",
    "--box-border": "#2a4d66",
    "--clock-bg": "#3399ff",
  },
  {
    "--search-bg": "#ff1493",
    "--box-bg": "#ff99cc25",
    "--box-border": "#cc0066",
    "--clock-bg": "#ff3399",
  },
  {
    "--search-bg": "#556b2f",
    "--box-bg": "#99bb6625",
    "--box-border": "#334d1a",
    "--clock-bg": "#66aa33",
  },
  {
    "--search-bg": "#9932cc",
    "--box-bg": "#cc99ff25",
    "--box-border": "#660099",
    "--clock-bg": "#b266ff",
  },
  {
    "--search-bg": "#00ced1",
    "--box-bg": "#66ffff25",
    "--box-border": "#008b8b",
    "--clock-bg": "#33ffff",
  },
  {
    "--search-bg": "#ff6347",
    "--box-bg": "#ffb39925",
    "--box-border": "#cc3300",
    "--clock-bg": "#ff5500",
  },
  {
    "--search-bg": "#daa520",
    "--box-bg": "#ffe06625",
    "--box-border": "#aa7f00",
    "--clock-bg": "#ffcc33",
  },
  {
    "--search-bg": "#4b0082",
    "--box-bg": "#9966cc25",
    "--box-border": "#330066",
    "--clock-bg": "#8000ff",
  },
  {
    "--search-bg": "#20b2aa",
    "--box-bg": "#66e0d125",
    "--box-border": "#008b80",
    "--clock-bg": "#33cfcf",
  },
  {
    "--search-bg": "#ff7f50",
    "--box-bg": "#ffb38025",
    "--box-border": "#cc5533",
    "--clock-bg": "#ff9966",
  },
  {
    "--search-bg": "#6a5acd",
    "--box-bg": "#9999ff25",
    "--box-border": "#4d33cc",
    "--clock-bg": "#7f66ff",
  },
  {
    "--search-bg": "#3cb371",
    "--box-bg": "#66d19925",
    "--box-border": "#2a804d",
    "--clock-bg": "#33cc88",
  },
  {
    "--search-bg": "#ff4500",
    "--box-bg": "#ff996625",
    "--box-border": "#cc3300",
    "--clock-bg": "#ff6600",
  },
  {
    "--search-bg": "#8a2be2",
    "--box-bg": "#b266ff25",
    "--box-border": "#5d0099",
    "--clock-bg": "#9f66ff",
  }
];

const container = document.getElementById('color-picker');
themes.forEach((theme, index) => {
  const circle = document.createElement('div');
  circle.className = 'color-circle';
  circle.style.background = theme["--search-bg"];
  circle.title = `Theme ${index + 1}`;
  circle.onclick = () => setTheme(index);
  container.appendChild(circle);
});

function setTheme(index) {
  const root = document.documentElement.style;
  const theme = themes[index];
  for (const varName in theme) {
    root.setProperty(varName, theme[varName]);
  }
  localStorage.setItem("color_theme", index)
}

function favoriteStation(e) {
  const dowhat =
    e.querySelector("svg path").style.fill === "rgba(248, 54, 54, 0.643)"
      ? 1
      : 2; //1-->set to off / 2--> set to on
  e.querySelector("svg path").style.fill =
    dowhat === 1 ? "#fff" : "rgba(248, 54, 54, 0.643)";
  e.querySelector("svg path").style.transform = "scale(1.10)";
  setTimeout(function () {
    //e.querySelector("svg path").style.fill = "#fff"
    e.querySelector("svg path").style.transform = "scale(1)";
  }, 500);

  if (dowhat === 1) {
    let local = localStorage.getItem("favorite_stations");
    let old = local;
    if (local) {
      local = JSON.parse(local);
      old = JSON.parse(old);
      local = local.filter((stationNode) => {
        return !(
          stationNode.busLink === active_station.bus &&
          stationNode.stopCode === active_station.code
        );
      });
      if (local === old) {
        alert("No updates!");
      }
      localStorage.setItem("favorite_stations", JSON.stringify(local));
      console.log("Fav is now off");
    }
  } else {
    //Read
    const local = localStorage.getItem("favorite_stations");
    console.log("Fav is now on");
    const workOn = {
      link: evoxIds[active_station.evoxid],
      busLink: active_station.bus,
      busRoute: active_station.route,
      stopCode: active_station.code,
      stopName: active_station.name,
    };

    let stop = false;
    //Verification
    if (local) {
      const par = JSON.parse(local);
      par.forEach((stationNode) => {
        if (
          stationNode.busLink === active_station.bus &&
          stationNode.stopCode === active_station.code
        ) {
          console.log("Stopping. Reason: node found", stationNode);
          stop = true;
          return;
        }
      });
    }
    //Write
    if (stop === false) {
      if (local) {
        const par = JSON.parse(local);
        par.push(workOn);
        localStorage.setItem("favorite_stations", JSON.stringify(par));
      } else {
        localStorage.setItem("favorite_stations", JSON.stringify([workOn]));
      }
    } else {
      console.warn("Successfully stopped action.");
    }
  }
}

async function searchAndMarkPlaces(query) {
  const accessToken = mapboxgl.accessToken;
  if (!query) return;

  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userLng = position.coords.longitude;
      const userLat = position.coords.latitude;

      const greeceBBox = [19.3, 34.7, 29.6, 41.8]; // [west, south, east, north] for Greece

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?` +
        `access_token=${accessToken}` +
        `&limit=10` +
        `&proximity=${userLng},${userLat}` +
        `&types=place,address,poi` +
        `&bbox=${greeceBBox.join(",")}`
      );
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        console.warn("No nearby matches found.");
        return;
      }

      // Find the closest feature by calculating distance from user location
      let closestFeature = data.features[0];
      let minDistance = getDistance(
        userLat,
        userLng,
        closestFeature.center[1],
        closestFeature.center[0]
      );

      for (const feature of data.features) {
        const [lng, lat] = feature.center;
        const distance = getDistance(userLat, userLng, lat, lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestFeature = feature;
        }
      }

      const [lng, lat] = closestFeature.center;

      map.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
      });

      const places = data.features.map((feature) => ({
        coords: feature.center,
        name: feature.text,
        address: feature.place_name,
      }));

      addGeneraleMarkers(places);
    },
    (error) => {
      alert("Unable to get your location: " + error.message);
    }
  );
}

let generaleMarkers = [];
function addGeneraleMarkers(places) {
  generaleMarkers.forEach((marker) => marker.remove());
  removeGraphics();

  places.forEach((place) => {
    const dot = document.createElement("div");
    let offset = [0, 0];

    dot.className = "station";
    dot.onclick = function () {
      if (dot.getAttribute("data-status") === "hidden") {
        this.innerHTML = `<p>${place.name}</p>`;
        dot.setAttribute("data-status", "visible");
      } else {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg>`;
        dot.setAttribute("data-status", "hidden");
      }
    };
    dot.setAttribute("data-status", "hidden");
    dot.innerHTML = `<vox class="markerInside">
    <p>${place.name}</p>
    <span>${place.address}</span>
    </vox>`;
    spawnClosestStops(place.coords);

    const marker = new mapboxgl.Marker({ element: dot, offset: offset })
      .setLngLat(place.coords)
      .addTo(map);
    markers_intel.push(marker);
    generaleMarkers.push(marker);
  });
}

function spawnClosestStops(focusedSpot) {
  return; //cors error or server proxy err
  //focusedSpot = {lng: 1, lat: 1}
  console.log(focusedSpot);
  //http://telematics.oasa.gr/api/?act=getClosestStops&p1=x&p2=y
  fetch(
    `http://telematics.oasa.gr/api/?act=getClosestStops&p1=${focusedSpot[0]}&p2=${focusedSpot[1]}&keyOrigin=evoxEpsilon`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("CLOSE:", data);

      return;

      const dot = document.createElement("div");
      let offset = [0, 0];

      if (index === coordinates.length - 1 && !asNearStops) {
        dot.className = "custom-marker";
      } else if (index === 0 && !asNearStops) {
        dot.className = "transition";
        dot.onclick = function () {
          this.innerHTML = `<p>${capitalizeWords(coord.StopDescr)}</p>`;
        };
        dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#000"/>
<path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#000"/>
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#000"/>
<path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#000"/>
<path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#000"/>
<path d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#000"/>
<path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#000"/>
<path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#000"/>
</svg>`; //
      } else {
        dot.className = "station";
        dot.onclick = function () {
          if (dot.getAttribute("data-status") === "hidden") {
            this.innerHTML = `<p>${capitalizeWords(
              coord.StopDescr
            )}</p><svg onclick="openStation('${coord.StopCode
              }', '${capitalizeWords(
                coord.StopDescr
              )}');" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M7 17L17 7M17 7H8M17 7V16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
            dot.setAttribute("data-status", "visible");
          } else {
            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg>`;
            dot.setAttribute("data-status", "hidden");
          }
        };
        dot.setAttribute("data-status", "hidden");
        dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero">

</path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff">

</path>
            </g>
        </g>
    </g>
</svg>`;
      }

      const marker = new mapboxgl.Marker({ element: dot, offset: offset })
        .setLngLat([coord.lng, coord.lat])
        .addTo(map);
      markers_intel.push(marker);
    })
    .catch((error) => { });
}

function openExtLineId(lineId, desc, elem) {
  const old = elem.querySelector(".actions vox").innerHTML;
  elem.querySelector(
    ".actions vox"
  ).innerHTML = ` <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>`;
  returnFromStationInfo();
  returnFromStationsVertical();
  //returnFromBusTimetable()
  document.getElementById("openFromMap").setAttribute("data-name", desc);
  document.getElementById("openFromMap").setAttribute("data-bus", lineId);
  openFromMap(
    document.getElementById("openFromMap"),
    elem.querySelector(".actions vox"),
    old
  );
}

function patchSafeAreaInsetTop() {
  const probe = document.getElementById("safe-area-probe");
  requestAnimationFrame(() => {
    const insetTop = probe.offsetHeight;

    console.log("safe-area-inset-top is:", insetTop + "px");
    if (insetTop !== 0) return;

    const styleSheets = Array.from(document.styleSheets);
    styleSheets.forEach((sheet) => {
      try {
        if (sheet.href && new URL(sheet.href).origin !== location.origin)
          return; // Skip cross-origin

        // Function to process the fetched or inline CSS
        function processCSS(cssText) {
          if (cssText.includes("env(safe-area-inset-top)")) {
            const model = getDeviceInfo().model;
            const newEnv =
              model === "iPhone" || model === "iPad" || model === "Mac"
                ? "47px"
                : "20px";
            const patched = cssText.replace(
              /env\(safe-area-inset-top\)/g,
              newEnv
            );
            const newStyle = document.createElement("style");
            newStyle.textContent = patched;
            document.head.appendChild(newStyle);
          }
        }

        // Handle external CSS
        if (sheet.href) {
          fetch(sheet.href)
            .then((res) => res.text())
            .then(processCSS)
            .catch((err) => console.warn("Failed to fetch", sheet.href, err));
        } else if (sheet.ownerNode && sheet.ownerNode.textContent) {
          processCSS(sheet.ownerNode.textContent);
        }
      } catch (err) {
        console.warn(
          "Could not access stylesheet:",
          sheet.href || "[inline]",
          err
        );
      }
    });
  });
}
patchSafeAreaInsetTop();

function redirectToEvoxAndLogin() {
  window.location.href = "../evox-epsilon-beta/?redirectLogin=oasa";
}

function checkForLoginCompatibility() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("loginAs")) {
    const value = params.get("loginAs");
    if (value === "localStorage") {
      if (sessionStorage.getItem("ignoreparam") === "true") {
        sessionStorage.removeItem("ignoreparam");
        const url = new URL(window.location.href);
        url.searchParams.delete("loginAs");
        window.location.href = url.toString();
      }

      document.getElementById("loginContentFlex").classList.add("noSplash");
      document.getElementById("hello-text").classList.add("noSplash");
      document
        .getElementById("loginForming")
        .querySelector(".infoWelcome").style.display = "none";
      setTimeout(function () {
        document.getElementById("hideifloggedviaevox").style.display = "none";
        $("#loginForming").fadeOut("fast", function () {
          $("#phone").fadeOut("fast", function () {
            //document.getElementById("phone").classList.remove("login")
            $("#phone").fadeIn("fast", function () {
              //$("#loginStepLast").fadeIn("fast")

              $("#loginStep2").fadeOut("fast", function () {
                $("#loginStep3").fadeIn("fast", function () {
                  sessionStorage.setItem("ignoreparam", "true");
                  localStorage.setItem("isOasaLoggedIn", "true");
                  localStorage.setItem("loginType", "evoxBridge");
                  document.getElementById("bottomSearchParent").style.zIndex =
                    "-1";
                });
              });
              outsideOfZone = true;
            });
          });
        });
      }, 800);
    }
  }
}

let hasBridgeStarted = false;
function connectOASABridge() {
  if (hasBridgeStarted === true) {
    return;
  }
  hasBridgeStarted = true;
  const allLines = encodeURIComponent(
    `https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`
  );
  fetch(`${serverIP}proxy?key=21&targetUrl=${allLines}`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("allLines", JSON.stringify(data));
      fullLine = data;
      setTimeout(function () {
        hasBridgeStarted = false;
      }, 3000);
    })
    .catch((error) => {
      const localSave = localStorage.getItem("allLines");
      if (localSave) {
        fullLine = JSON.parse(localSave);
        hasBridgeStarted = false;
      }
      console.warn(
        "It looks like oasa proxies are offline. using fallback. [storage]"
      );
    });
}

function getWalkingRoute(start, end, firstRequest) {
  if (firstRequest) {
    document.getElementById("timeNeeded").innerText = "Εκτίμηση διαδρομής..";
  }
  fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
  )
    .then((res) => res.json())
    .then((data) => {
      const route = data.routes[0].geometry.coordinates;

      const durationSeconds = data.routes[0].duration; // duration in seconds
      const durationMinutes = Math.round(durationSeconds / 60);
      document.getElementById("timeNeeded").innerText =
        convertTimeDays(durationMinutes);
      // Remove existing route if present
      if (map.getSource("route")) {
        map.getSource("route").setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: route },
        });
      } else {
        // Add route layer
        // First add the source with an ID
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: route },
          },
        });

        // Then add the layer using that source
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#00ccff", "line-width": 5 },
        });
      }

      // Fit map to route
      const bounds = route.reduce(
        (b, coord) => b.extend(coord),
        new mapboxgl.LngLatBounds(route[0], route[0])
      );
      map.fitBounds(bounds, { padding: 50 });
    });
}

let watchId;
let currentRouteEnd;
let isDirectionsNew = false;
let currentDirectionsInfo = {
  dest_lng: null,
  dest_lat: null,
  dest_name: null,
};
function walkMeTo(lng, lat, event, destinationName) {
  isDirectionsNew = true;
  document.getElementById("destinationName").innerText = destinationName;
  document.getElementById("directionsContainer").style.display = null;
  currentDirectionsInfo = {
    dest_lng: lng,
    dest_lat: lat,
    dest_name: destinationName,
  };
  //event.stopPropagation();

  const end = [lng, lat]; // destination
  currentRouteEnd = end;

  // Start tracking user location
  if (navigator.geolocation) {
    // Stop previous watch if any
    if (watchId) navigator.geolocation.clearWatch(watchId);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLoc = [position.coords.longitude, position.coords.latitude];

        // Zoom to user location
        getWalkingRoute(
          userLoc,
          currentRouteEnd,
          isDirectionsNew === true ? true : null
        );

        if (isDirectionsNew === true) {
          map.flyTo({
            center: userLoc,
            zoom: 16,
            speed: 1.2,
            curve: 1,
          });
          isDirectionsNew = false;
        }
      },
      (err) => {
        console.error("geofatal", err);
        document.getElementById("timeNeeded").innerText =
          "Αποτυχία. Τοποθεσία άγνωστη.";
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
  } else {
    document.getElementById("timeNeeded").innerText =
      "Αποτυχία. Τοποθεσία άγνωστη.";
  }
}

function stopDirections() {
  map.flyTo({
    center: [
      parseFloat(currentDirectionsInfo.dest_lng),
      parseFloat(currentDirectionsInfo.dest_lat),
    ],
    zoom: 16,
    curve: 1,
    easing(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
  });
  document
    .getElementById("directionsContainer")
    .classList.add("fade-out-slide-down");
  setTimeout(function () {
    document.getElementById("directionsContainer").style.display = "none";
    document
      .getElementById("directionsContainer")
      .classList.remove("fade-out-slide-down");
  }, 500);
  if (watchId) navigator.geolocation.clearWatch(watchId);
  if (map.getLayer("route")) {
    map.removeLayer("route"); // remove the layer first
  }

  if (map.getSource("route")) {
    map.removeSource("route"); // then remove its source
  }
}

function saveRecentSearch(busid) {
  const recentSearchs = localStorage.getItem("recentSearchs");

  if (recentSearchs) {
    let parsed = JSON.parse(recentSearchs);

    // Remove duplicates and keep only last 5
    parsed = parsed.filter((v, i, a) => a.indexOf(v) === i);

    if (!parsed.includes(busid)) {
      parsed.push(busid);
    }

    // Keep only the last 5 items
    if (parsed.length > 5) {
      parsed = parsed.slice(-5);
    }

    localStorage.setItem("recentSearchs", JSON.stringify(parsed));
  } else {
    localStorage.setItem("recentSearchs", JSON.stringify([busid]));
  }
}

function getRecentSearchs() {
  const recentSearchs = localStorage.getItem("recentSearchs");
  if (recentSearchs) {
    return JSON.parse(recentSearchs);
  } else {
    return [];
  }
}

document
  .getElementById("password0")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      loginFlorida();
    }
  });

function acceptTerms(el) {
  console.log("accepted terms");
  el.innerHTML += `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>`;
  localStorage.setItem("acceptedTerms", "true");
  $("#loginStepTerms").fadeOut("fast", function () {
    window.location.reload();
  });
}

function clearFavorites(el) {
  if (el) {
    const icon = el.querySelector(".loaderIn");
    const old = icon.innerHTML;
    icon.innerHTML = `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg>`;
    localStorage.removeItem("oasa_favorites");
    setTimeout(function () {
      icon.innerHTML = old;
    }, 350);
  }
}

function updateFavoriteBusFocus() {
  function heartIcon(active) {
    if (!active) {
      return `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#fff"></path>
                            </svg>`;
    } else {
      return `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path style="transform-origin:center;animation: pulse 5s infinite alternate;transition:transform 5s ease-in-out;" d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#fff"></path>
                            </svg>`;
    }
  }
  const favorites = localStorage.getItem("oasa_favorites")
    ? JSON.parse(localStorage.getItem("oasa_favorites"))
    : null;
  if (
    favorites &&
    favorites.includes(document.getElementById("busInfoID").innerText)
  ) {
    document.getElementById("favs_action_bus").innerHTML = `${heartIcon(
      true
    )}<p>Αφαίρεση από τα αγαπημένα</p>`;
  } else {
    document.getElementById(
      "favs_action_bus"
    ).innerHTML = `${heartIcon()}<p>Προσθήκη στα αγαπημένα</p>`;
  }
}

function moreBusOptions() {
  if (document.getElementById("moreBusOptions").classList.contains("active")) {
    document.getElementById("slidingPopup").classList.remove("active");
    document.getElementById("moreBusOptions").classList.remove("active");
  } else {
    document.getElementById("slidingPopup").classList.add("active");
    document.getElementById("moreBusOptions").classList.add("active");
    updateFavoriteBusFocus();
  }
}

function toggleFavorite() {
  const busId = document.getElementById("busInfoID").innerText;
  if (busId === null) {
    return;
  }
  let favorites = localStorage.getItem("oasa_favorites")
    ? JSON.parse(localStorage.getItem("oasa_favorites"))
    : null;
  if (favorites && favorites.includes(busId)) {
    favorites = favorites.filter((item) => item !== busId);
    localStorage.setItem("oasa_favorites", JSON.stringify(favorites));
  } else if (!favorites) {
    localStorage.setItem("oasa_favorites", JSON.stringify([busId]));
  } else {
    favorites.push(busId);
    localStorage.setItem("oasa_favorites", JSON.stringify([busId]));
  }
  updateFavoriteBusFocus();
}

function toggleNearbyInfo() {
  const elem = document.getElementById("nearbyInfo");
  if (elem.classList.contains("active")) {
    //toggle off
    elem.classList.remove("active");
    markers_intel.forEach((marker) => marker.remove());
    markers_intel = [];
    for (const key in liveSpawned) {
      for (const marker in liveSpawned[key].vehicles) {
        liveSpawned[key].vehicles[marker].remove();
      }
    }
    liveSpawned = {};
    if (liveBusesNearInterval) {
      clearInterval(liveBusesNearInterval);
      liveBusesNearInterval = null;
    }
  } else {
    triggerNearbyStationsSpawn();
    elem.classList.add("active");
    //toggle on
  }
}

function openSettingsPage(page) {
  const page1 = document.getElementById("settings-page-1")
  const page_map_appearance = document.getElementById("settings-page-2")
  const page_app_appearance = document.getElementById("settings-page-3")
  if (page === "2") {
    page1.classList.add("hidden")
    page_map_appearance.classList.remove("hidden")
    loadSetMap()
  } else if (page === "3") {
    page1.classList.add("hidden")
    page_app_appearance.classList.remove("hidden")

  }
}

function loadSetMap() {
  const container = document.getElementById("settings-page-2");
  let item = localStorage.getItem("map_style");

  if (!item) {
    item = "mapbox://styles/mapbox/dark-v11"
  };

  const dictionary = {
    "mapbox://styles/mapbox/satellite-streets-v12": 1,
    "mapbox://styles/mapbox/dark-v11": 2,
    "mapbox://styles/mapbox/standard": 3,
    "mapbox://styles/mapbox/outdoors-v12": 4,
    "mapbox://styles/mapbox/light-v11": 5,
    "mapbox://styles/mapbox/navigation-day-v1": 6,
    "mapbox://styles/mapbox/navigation-night-v1": 7
  };

  const mapIndex = dictionary[item];
  if (!mapIndex) return;

  // Reset all indicators
  container.querySelectorAll(".checkedIndicatorMap").forEach(el => {
    el.style.opacity = "0";
  });

  // Find matching image
  const images = container.querySelectorAll(".mapStyle img");

  let found = false;

  images.forEach(img => {
    if (img.src.includes(`map${mapIndex}.png`)) {
      const indicator = img
        .closest(".mapStyle")
        .querySelector(".checkedIndicatorMap");

      if (indicator) {
        indicator.style.opacity = "1";
        found = true;
      }
    }
  });

  if (!found) {
    alert("Map not found");
  }
}

function enableMapSelection() {
  const container = document.getElementById("settings-page-2");

  const dictionary = {
    1: "mapbox://styles/mapbox/satellite-streets-v12",
    2: "mapbox://styles/mapbox/dark-v11",
    3: "mapbox://styles/mapbox/standard",
    4: "mapbox://styles/mapbox/outdoors-v12",
    5: "mapbox://styles/mapbox/light-v11",
    6: "mapbox://styles/mapbox/navigation-day-v1",
    7: "mapbox://styles/mapbox/navigation-night-v1"
  };

  container.querySelectorAll(".mapStyle").forEach(mapStyle => {
    mapStyle.addEventListener("click", () => {
      const img = mapStyle.querySelector("img");
      if (!img) return;

      const match = img.src.match(/map(\d+)\.png/);
      if (!match) return;

      const index = match[1];
      const mapStyleValue = dictionary[index];
      if (!mapStyleValue) return;

      // Save to localStorage
      localStorage.setItem("map_style", mapStyleValue);

      // Clear previous selection
      container.querySelectorAll(".checkedIndicatorMap").forEach(el => {
        el.classList.remove("active");
      });

      // Activate current
      const indicator = mapStyle.querySelector(".checkedIndicatorMap");
      if (indicator) indicator.classList.add("active");

      console.log("Saved map style:", mapStyleValue);
      loadSetMap()
      map.setStyle(mapStyleValue);

    });
  });
}


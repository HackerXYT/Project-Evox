function grabberEvents(id) {
  const notice = document.getElementById(id);
  let startY,
    currentY,
    isDragging = false;

  // Initialize event listeners for touch/mouse events
  notice.addEventListener("mousedown", startDrag);
  notice.addEventListener("touchstart", startDrag);
  notice.addEventListener("mousemove", drag);
  notice.addEventListener("touchmove", drag);
  notice.addEventListener("mouseup", endDrag);
  notice.addEventListener("touchend", endDrag);

  function startDrag(e) {
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    isDragging = true;
    notice.style.transition = "none";
  }

  function drag(e) {
    if (!isDragging) return;

    currentY = e.touches ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;

    if (deltaY > 0) {
      // Only allow downward dragging
      notice.style.transform = notice.style.transform.replace(
        /translateY\([^)]*\)/,
        `translateY(${deltaY}px)`
      );
    }
  }

  function endDrag() {
    isDragging = false;
    notice.style.transition = "transform 0.4s ease"; // Add smooth return or dismiss transition
    const TRIGGER_DISTANCE = notice.offsetHeight / 2; //150

    if (currentY - startY > TRIGGER_DISTANCE) {
      notice.style.transform = notice.style.transform.replace(
        /translateY\([^)]*\)/,
        "translateY(100vh)"
      );

      if (id === "slidingPopup") {
        if (
          document.getElementById("moreBusOptions").classList.contains("active")
        ) {
          document.getElementById("slidingPopup").classList.remove("active");
          document.getElementById("moreBusOptions").classList.remove("active");
        }
      }
      notice.addEventListener(
        "transitionend",
        () => {
          notice.classList.remove("active");
          notice.style.transform = ``;
        },
        { once: true }
      );
    } else {
      notice.style.transform = ``;
    }
  }
}
grabberEvents("slidingPopup");

function removeGraphics() {
  mapboxLayersArray.forEach((sourceid) => {
    console.log(sourceid);
    if (map.getLayer(`route-${sourceid}`)) {
      map.removeLayer(`route-${sourceid}`);
    } else {
      console.warn("Saved layer doesnt exist", sourceid);
    }
  });

  mapboxSourcesArray.forEach((sourceid) => {
    console.log(sourceid);
    if (map.getSource(`route-${sourceid}`)) {
      map.removeSource(`route-${sourceid}`);
    } else {
      console.warn("Saved source doesnt exist", sourceid);
    }
  });
}

var menu_open = new Howl({
  src: ["./OASAFX/menuSuccess.mp3"],
  volume: 1,
});
const randomString = () => Math.random().toString(36).substring(2, 10);

function capitalizeGreek(text) {
  return text
    .normalize("NFD") // Normalize diacritics (accents)
    .toUpperCase() // Convert to uppercase
    .normalize("NFC") // Recompose characters
    .replace(/Σ(?=\s|$)/g, "Σ"); // Optional: Ensure final sigma becomes standard sigma
}

function countUpWithParallax(element) {
  const text = element.innerText;
  const chars = text.split(""); // Split the text into individual characters
  const container = document.createElement("vox");
  container.style.display = "flex";
  container.style.position = "relative";

  chars.forEach((char, index) => {
    const charSpan = document.createElement("vo");
    charSpan.innerText = char;
    charSpan.style.position = "relative";
    charSpan.style.transform = "translateY(0)";
    charSpan.style.transition = "transform 0.1s ease-in-out";
    container.appendChild(charSpan);
  });

  element.innerText = "";
  element.appendChild(container);

  let startTime;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const scrollY = window.scrollY || window.pageYOffset; // Current scroll position

    chars.forEach((char, index) => {
      const speed = (index + 1) * 0.5; // Modify speed based on index
      const position = Math.sin(elapsed * 0.002 + index) * 5; // Simple oscillation effect
      container.children[index].style.transform = `translateY(${
        scrollY * 0.05 + position
      }px)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function busIcon() {
  return `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 19.9815C16.0728 19.9415 17.1771 19.815 18 19.4151V20.9999C18 21.5522 17.5523 21.9999 17 21.9999H15.5C14.9477 21.9999 14.5 21.5522 14.5 20.9999V19.9815Z" fill="#FFF"/>
<path d="M6 19.415C6.82289 19.815 7.9272 19.9415 9.5 19.9815V20.9999C9.5 21.5522 9.05228 21.9999 8.5 21.9999H7C6.44772 21.9999 6 21.5522 6 20.9999V19.415Z" fill="#FFF"/>
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C19.8915 4.23467 19.99 5.8857 19.9991 9L20 13C19.9909 16.1143 19.8915 17.7653 18.8284 18.8284C18.5862 19.0706 18.3136 19.2627 18 19.4151C17.1771 19.8151 16.0728 19.9415 14.5 19.9815C13.7729 19.9999 12.9458 20 12 20C11.0542 20 10.2271 20 9.5 19.9815C7.9272 19.9415 6.82289 19.815 6 19.415C5.68645 19.2626 5.41375 19.0706 5.17157 18.8284C4.10848 17.7653 4.00911 16.1143 4 13L4.00093 9C4.01004 5.8857 4.10848 4.23467 5.17157 3.17157Z" fill="#FFF"/>
<path d="M17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#FFF"/>
<path d="M6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="#FFF"/>
<path opacity="0.5" d="M5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V6.99998C18.5 5.58578 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5Z" fill="#FFF"/>
<path d="M2.4 11.8L4 13L4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8Z" fill="#FFF"/>
<path d="M21 9H19.999L20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5522 9 21 9Z" fill="#FFF"/>
</svg>`;
}

function markers(b, what) {
  const markerElement = document.createElement("div");
  markerElement.style.width = "10px"; // smaller size
  markerElement.style.height = "10px";

  if (what === "me") {
    markerElement.style.backgroundColor = "#2e77ff";
    markerElement.style.borderRadius = "50%"; // circle shape
    markerElement.style.border = "1px solid #fff"; // minimal border for better contrast

    // Add the custom marker to the map
    const marker = new mapboxgl.Marker({ element: markerElement })
      .setLngLat(b) // coordinates for the marker
      .addTo(map);
    markers_global.push(marker);
    locationMarker.push(marker);
    return;
  } else if (what.includes("#")) {
    markerElement.style.backgroundColor = what;
  } else if (what === "red") {
    markerElement.style.backgroundColor = "#ff4a4a";
  } else if (what === "green") {
    markerElement.style.backgroundColor = "#5ac876";
  } else if (what === "yellow") {
    markerElement.style.backgroundColor = "#965d00";
  } else {
    markerElement.style.backgroundColor = "#333"; // dark color
  }

  markerElement.style.borderRadius = "50%"; // circle shape
  markerElement.style.border = "1px solid #fff"; // minimal border for better contrast

  // Add the custom marker to the map
  const marker = new mapboxgl.Marker({ element: markerElement })
    .setLngLat(b) // coordinates for the marker
    .addTo(map);
  markers_global.push(marker);
}

function oldgetPrefix(locationName) {
  // Normalize the name (lowercase and remove accents)
  const accentsMap = {
    Ά: "Α",
    Έ: "Ε",
    Ή: "Η",
    Ί: "Ι",
    Ό: "Ο",
    Ύ: "Υ",
    Ώ: "Ω",
    ά: "α",
    έ: "ε",
    ή: "η",
    ί: "ι",
    ό: "ο",
    ύ: "υ",
    ώ: "ω",
  };

  const normalize = (str) =>
    str
      .replace(/[ΆΈΉΊΌΎΏάέήίόύώ]/g, (match) => accentsMap[match] || match)
      .toLowerCase();

  const name = normalize(locationName);

  // Define rules for feminine and masculine
  const feminineEndings = ["α", "η", "ια"];
  const masculineEndings = ["ος", "ας", "ης"];

  // Check for specific endings (e.g., -ος, -α, etc.)
  if (feminineEndings.some((ending) => name.endsWith(ending))) {
    return "στην";
  } else if (masculineEndings.some((ending) => name.endsWith(ending))) {
    return "στον";
  } else {
    // Default fallback (neutral)
    return "στη";
  }
}

const removeAccents = (value) => {
  if (typeof value !== "string") return value;

  const accentsMap = {
    ά: "α",
    έ: "ε",
    ή: "η",
    ί: "ι",
    ό: "ο",
    ύ: "υ",
    ώ: "ω",
    Ά: "Α",
    Έ: "Ε",
    Ή: "Η",
    Ί: "Ι",
    Ό: "Ο",
    Ύ: "Υ",
    Ώ: "Ω",
    ΐ: "ϊ",
    ΰ: "ϋ",
    ϊ: "ι",
    ϋ: "υ",
  };

  return value.replace(/[άέήίόύώΆΈΉΊΌΎΏΐΰϊϋ]/g, (match) => accentsMap[match]);
};

function getPrefix(preloc) {
  const location = removeAccents(preloc);
  console.log("Getting prefix for location:", preloc, location);
  // Analyze the ending of the location to decide the preposition
  const endings = [
    { regex: /ος$/, result: "στον" }, // Masculine singular (e.g., Πειραιάς)
    { regex: /ας$/, result: "στον" }, // Masculine singular (e.g., Νίκος)
    { regex: /ης$/, result: "στον" }, // Masculine singular (e.g., Σωκράτης)
    { regex: /ατα$/, result: "στα" }, // Neuter plural (e.g., Χωριάτικα)
    { regex: /η$/, result: "στην" }, // Feminine singular (e.g., Κρήτη)
    { regex: /οι$/, result: "στους" }, // Masculine plural (e.g., Άγιοι Ανάργυροι)
    { regex: /α$/, result: "στην" }, // Feminine singular (e.g., Γλυφάδα)
    { regex: /ο$/, result: "στο" }, // Neuter singular (e.g., Μοσχάτο)
    { regex: /ι$/, result: "στο" }, // Neuter singular (e.g., Χαϊδάρι)
    { regex: /υ$/, result: "στο" }, // Neuter singular (e.g., Ζεφύρι)
    { regex: /ω$/, result: "στο" }, // Neuter singular (rare case, e.g., Μητροπολιτικό)
    { regex: /α$/, result: "στα" }, // Neuter plural (e.g., Σπάτα)
    { regex: /ες$/, result: "στις" }, // Feminine plural (e.g., Θήβες)
  ];

  // Loop through the rules to find a match
  for (const rule of endings) {
    if (rule.regex.test(location)) {
      return rule.result;
    }
  }

  // Default fallback if no rule matches
  return "στο";
}

function toAccusative_noWork(locationName) {
  // Normalize text (lowercase only for easier matching, keep accents intact)
  const normalize = (str) => str.toLowerCase();

  const name = normalize(locationName);

  // Handle masculine place names ending in -ς
  if (name.endsWith("ας") || name.endsWith("άς")) {
    return locationName.slice(0, -2) + "α";
  }
  if (name.endsWith("ης") || name.endsWith("ής")) {
    return locationName.slice(0, -2) + "η";
  }
  if (name.endsWith("ος") || name.endsWith("ός")) {
    return locationName.slice(0, -1);
  }

  // Handle feminine place names (no changes typically needed)
  if (
    name.endsWith("α") ||
    name.endsWith("η") ||
    name.endsWith("ά") ||
    name.endsWith("ή")
  ) {
    return locationName;
  }

  // Handle neutral place names
  if (
    name.endsWith("ο") ||
    name.endsWith("ό") ||
    name.endsWith("ι") ||
    name.endsWith("ί") ||
    name.endsWith("μα") ||
    name.endsWith("μά")
  ) {
    return locationName;
  }

  // Default fallback: return unchanged
  return locationName;
}

function toAccusative(locationNameVanilla) {
  const accentsMap = {
    Ά: "Α",
    Έ: "Ε",
    Ή: "Η",
    Ί: "Ι",
    Ό: "Ο",
    Ύ: "Υ",
    Ώ: "Ω",
    ά: "α",
    έ: "ε",
    ή: "η",
    ί: "ι",
    ό: "ο",
    ύ: "υ",
    ώ: "ω",
  };

  const normalize = (str) =>
    str
      .replace(/[ΆΈΉΊΌΎΏάέήίόύώ]/g, (match) => accentsMap[match] || match)
      .toLowerCase();

  const words = locationNameVanilla.trim().split(/\s+/).slice(0, 2);

  const transformed = words.map((word) => {
    const name = normalize(word);

    if (name.endsWith("ας")) return word.slice(0, -2) + "α";
    if (name.endsWith("ης")) return word.slice(0, -2) + "η";
    if (name.endsWith("ος")) return word.slice(0, -1);
    return word;
  });

  return transformed.join(" ");
}

// Function to update the UI with the correct location
function updateLocation(locationName) {
  const prefix = getPrefix(locationName);
  document.getElementById("vocals").textContent = prefix;
  if (
    !document.getElementById("busTimetable").classList.contains("shown") &&
    !document.getElementById("stationsVertical").classList.contains("shown") &&
    !document.getElementById("stationInfo").classList.contains("shown")
  ) {
    document.getElementById("searchIntelli").classList.remove("notLoaded");
  }
  document.getElementById(
    "searchInSearch"
  ).placeholder = `Αναζητήστε ${prefix} ${toAccusative(locationName)}`;
}

function spawnMyLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const newLoc = [longitude, latitude];

    if (mylocationMarker) {
      // Smooth transition from old to new location
      const duration = 500; // animation duration in ms
      const start = performance.now();

      const startLoc = mylocationMarker.getLngLat();
      const lngDiff = newLoc[0] - startLoc.lng;
      const latDiff = newLoc[1] - startLoc.lat;

      function animateMarker(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const currentLng = startLoc.lng + lngDiff * progress;
        const currentLat = startLoc.lat + latDiff * progress;
        mylocationMarker.setLngLat([currentLng, currentLat]);

        if (progress < 1) {
          requestAnimationFrame(animateMarker);
        }
      }

      requestAnimationFrame(animateMarker);
    } else {
      // First-time marker creation

      const markerElement = document.createElement("div");
      markerElement.style.width = "10px";
      markerElement.style.height = "10px";
      markerElement.style.backgroundColor = "#2e77ff";
      markerElement.style.borderRadius = "50%";
      markerElement.style.border = "1px solid #fff";
      markerElement.style.zIndex = '100000'

      mylocationMarker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat(newLoc)
        .addTo(map);

      markers_global.push(mylocationMarker);
    }

    // Always update the current location variable
    myLoc = newLoc;
    locationReady = true;
  });
}

function zoomOnMe() {
  map.resize();
  map.flyTo({
    center: [parseFloat(myLoc[0]), parseFloat(myLoc[1])],
    zoom: 16,
    curve: 1,
    easing(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
  });
}

function greeting() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 4 && hours < 12) {
    return "Καλημέρα";
  } else {
    return "Καλησπέρα";
  }
}

function getName() {
  if (
    localStorage.getItem("t50-username") &&
    !localStorage.getItem("hasDismissedSetup")
  ) {
    return localStorage.getItem("t50-username");
  } else {
    return "Επισκέπτη";
  }

  //check for first and second name
}

function convertTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hoursText = hours === 1 ? "1 ώρα" : `${hours} ώρες`;
  const minutesText =
    remainingMinutes === 1 ? "1 λεπτό" : `${remainingMinutes} λεπτά`;

  if (hours === 0) {
    return minutesText;
  } else if (remainingMinutes === 0) {
    return hoursText;
  } else {
    return `${hoursText} και ${minutesText}`;
  }
}

function convertTimeDays(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const remainingMinutes = minutes % 60;

  const daysText = days === 1 ? "1 μέρα" : `${days} μέρες`;
  const hoursText = hours === 1 ? "1 ώρα" : `${hours} ώρες`;
  const minutesText =
    remainingMinutes === 1 ? "1 λεπτό" : `${remainingMinutes} λεπτά`;

  let parts = [];
  if (days > 0) parts.push(daysText);
  if (hours > 0) parts.push(hoursText);
  if (remainingMinutes > 0) parts.push(minutesText);

  if (parts.length === 0) {
    return "0 λεπτά";
  } else if (parts.length === 1) {
    return parts[0];
  } else {
    return parts.slice(0, -1).join(", ") + " και " + parts.slice(-1);
  }
}

function convertTimeApprox(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hoursText = hours === 1 ? "1 ώρα" : `${Math.floor(hours + 0.5)} ώρες`;
  const minutesText =
    remainingMinutes === 1 ? "1 λεπτό" : `${remainingMinutes} λεπτά`;

  if (hours === 0) {
    return minutesText;
  } else if (remainingMinutes === 0) {
    return hoursText;
  } else {
    return `${hoursText}`;
  }
}
function getNextBusTimeLIVE(times) {
  ////console.log("getting times", times);
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  for (let time of times) {
    const [hour, minutes] = time.split(":").map(Number);
    if (
      hour > currentHour ||
      (hour === currentHour && minutes > currentMinutes)
    ) {
      return { hour, minutes };
    }
  }
  return null;
}
function formatTime(dateTimeString) {
  if (!dateTimeString) {
    console.error("Invalid dateTimeString:", dateTimeString);
    return "Invalid";
  }

  const parts = dateTimeString.split(" ");
  if (parts.length !== 2) {
    console.error("Invalid dateTimeString format:", dateTimeString);
    return "Invalid";
  }

  const timePart = parts[1]; // "HH:MM:SS"
  const timeParts = timePart.split(":");
  if (timeParts.length !== 3) {
    console.error("Invalid time format:", timePart);
    return "Invalid";
  }

  const hours = timeParts[0];
  const minutes = timeParts[1];

  if (hours.length !== 2 || minutes.length !== 2) {
    console.error("Invalid time components:", hours, minutes);
    return "Invalid";
  }

  return `${hours}:${minutes}`;
}

function loadOasa() {
  //let spawnInFreq = {}; // This is unused but retained for future reference

  frequentBuses.forEach((bus) => {
    loadSection("frequent", bus);
  });
  console.log(favoriteBuses);
  favoriteBuses.forEach((bus) => {
    loadSection("favorite", bus);
  });

  if (favoriteBuses.length === 0) {
    document.getElementById("favoritesFeedItem").style.display = "none";
    document.getElementById("favorite").innerHTML = `<div class="failed">
                                    <img style="width: 40px;" src="discover.svg" class="failed-icon">
                                    <vox class="failed-message nonImportant">Κανένα αγαπημένο λεωφορείο.</vox>
                                    <span class="failed-subtext">Προσθέστε τα αγαπημένα σας λεωφορεία από την Εξερεύνηση.</span>
                                </div>`;
  }
}

function hasInternetConnection() {
  return navigator.onLine; // Returns true if online, false if offline
}

function formatTimeToMin(input) {
  if (input === "Άγνωστη") {
    return "Άγνωστη";
  }

  if (typeof input === "number") {
    if (input === 0) {
      return "τώρα";
    } else if (input === 1) {
      return "1 λεπτό";
    } else {
      return `${input} λεπτά`;
    }
  }

  return input; // Fallback for unexpected input
}

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function findBusBlocksByLineId(lineId) {
  // Filter the data to include only blocks with the specified LineID
  const filteredBlocks = fullLine.filter((block) => block.LineID === lineId);

  // If multiple blocks are found, return them as an array
  if (filteredBlocks.length > 1) {
    return filteredBlocks;
  }

  // Return null if no duplicates are found
  return null;
}

const helloText = "oasa";
const helloElement = document.getElementById("hello-text");

// Function to display each character of "Hello" with a drawing effect
function displayHello() {
  //helloText.split('').forEach((char, index) => {
  //  helloElement.append(char)
  //const span = document.createElement('span');
  //span.textContent = char;
  //span.style.animationDelay = `${index * 0.4}s`;  // Add delay based on index
  //helloElement.appendChild(span);
  //});
}

function hasInternetConnection() {
  return navigator.onLine; // Returns true if online, false if offline
}

function goBackToSplash() {
  outsideOfZone = false;
  $("#runalpha1").fadeOut("fast");
  $("#runalpha2").fadeOut("fast");
  $("#runalpha3").fadeOut("fast");
  $("#runalpha4").fadeOut("fast");
  setTimeout(function () {
    document
      .getElementById("loginForming")
      .querySelector(".infoWelcome").style.display = null;
  }, 1000);

  document.getElementById("loginContentFlex").classList.remove("noSplash");
  document.getElementById("hello-text").classList.remove("noSplash");

  $("#phone").fadeOut("fast", function () {
    $("#loginStep1").fadeOut("fast");
    document.getElementById("phone").classList.add("login");
    $("#phone").fadeIn("fast", function () {
      $("#loginForming").fadeIn("fast", function () {});
    });
  });
  $("#hello-text").fadeIn("slow", function () {
    //displayHello()
  });
}

function isNearEvery3Hours(proximityInMinutes = 5) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Find the closest multiple of 3 to the current hour
  const closest3HourMark = Math.round(currentHour / 3) * 3;

  // Create a Date object for that time (using today's date)
  const closest3HourTime = new Date(now);
  closest3HourTime.setHours(closest3HourMark, 0, 0, 0); // Set to nearest 3-hour mark, with minutes and seconds as 0

  // Calculate the difference in minutes
  const diffInMilliseconds = Math.abs(now - closest3HourTime);
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // 60000 ms = 1 minute

  // Return true if the time is within the proximity
  return diffInMinutes <= proximityInMinutes;
}

function runTest() {
  document.getElementById("searchIntelli").classList.add("notLoaded");
  document.getElementById("update-center").classList.add("active");
}
// Utility functions for UI updates
const setLoadingState = (isLoading) => {
  const searchIntelli = document.getElementById("searchIntelli");
  const updateCenter = document.getElementById("update-center");
  if (isLoading) {
    searchIntelli?.classList.add("notLoaded");
    updateCenter?.classList.add("active");
  } else {
    searchIntelli?.classList.remove("notLoaded");
    updateCenter?.classList.remove("active");
  }
};

function clearAllCaches() {
  if ("caches" in self) {
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
      })
      .then(() => {
        alert("All caches cleared successfully!");
      })
      .catch((error) => {
        console.error("Failed to clear caches:", error);
        alert("Failed to clear caches. Check the console for details.");
      });
  } else {
    alert("Caching is not supported in this browser.");
  }
}

// Show update notification to the user
function showUpdateNotification() {
  // Customize this to fit your app's UI
  alert("A new update is available! Refresh the page to apply the update.");
}

function updateServiceWorkerCache() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: "UPDATE_CACHE",
    });
  } else {
    console.log("No active service worker found.");
  }
}

// Set up messaging between the page and the service worker
function setupServiceWorkerMessaging() {
  navigator.serviceWorker.ready
    .then((registration) => {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data) {
          switch (event.data.action) {
            case "CACHE_UPDATE_STARTED":
              console.log("Cache update started.");
              setLoadingState(true);
              break;
            case "CACHE_UPDATE_COMPLETED":
              console.log("Cache update completed.");
              setLoadingState(false);
              break;
          }
        }
      });
    })
    .catch((error) => {
      console.error("Failed to set up service worker messaging:", error);
    });
}

function isLightMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

function isPreviousNearby(currentLocation) {
  const previousLocation = localStorage.getItem("previousLocation");
  if (previousLocation) {
    const handle = JSON.parse(previousLocation); // Assuming handle is an array of locations

    const isNear = filterNearbyLocations(currentLocation, handle.query, 0.5);
    console.log("IsNear", isNear); // This will print an array of locations that are nearby
    if (isNear === true) {
      return true;
    }
  } else {
    return false; // No previous location stored
  }
}

function capitalizeWords(str) {
  if (typeof str !== "string") {
    return ""; // Return an empty string if the input is not a valid string
  }

  return str
    .toLowerCase() // Ensure the rest of the letters are lowercase
    .replace(/h/g, "η") // Replace all lowercase "h" with "η"
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}

function splitValue(value) {
  return {
    // Method to get the first part (before the first '-')
    getFirstPart: function () {
      const match = value.match(/^([^\-]*)/);
      return match ? match[1].trim() : "";
    },

    // Method to get the second part (after the last '-')
    getSecondPart: function () {
      const match = value.match(/[^-]+$/); // Match after the last '-'
      return match
        ? match[0]
            .trim()
            .replace(/\(.*\)$/, "")
            .trim()
        : "";
    },
  };
}

function handleClick(stopCode, name) {
  showVerticalStations();
  setTimeout(function () {
    showStopDetails(stopCode, name);
  }, 200);
}

function getPreviousBuses(times, more) {
  const countToLoad = more || 7; // Default to 7 if `more` is not provided

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

  const busTimes = times.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const busTime = hours * 60 + minutes; // Bus time in minutes since midnight
    const diff = currentTime - busTime; // Difference in minutes (negative for future buses, positive for past buses)

    return {
      time,
      isPast: busTime < currentTime, // Mark as past if bus time is earlier than current time
      remainingTime: diff, // Positive for past buses
    };
  });

  // Filter only past buses
  const pastBuses = busTimes.filter((bus) => bus.isPast);

  // Sort past buses in descending order (most recent past buses first)
  pastBuses.sort((a, b) => a.remainingTime - b.remainingTime);

  // Take the last `countToLoad` past buses
  const previousBuses = pastBuses.slice(0, countToLoad).map((bus) => {
    const diff = bus.remainingTime; // Use positive remaining time for formatting
    let formattedRemainingTime;

    if (diff >= 60) {
      let hours = Math.floor(diff / 60);
      let remainingMinutes = diff % 60;

      if (remainingMinutes === 0) {
        formattedRemainingTime =
          hours === 1 ? `πριν ${hours} ώρα` : `πριν ${hours} ώρες`;
      } else {
        formattedRemainingTime =
          hours === 1
            ? `πριν ${hours} ώρα ${remainingMinutes} λεπτά`
            : `πριν ${hours} ώρες ${remainingMinutes} λεπτά`;
      }
    } else {
      formattedRemainingTime = `πριν ${diff} λεπτά`;
    }

    return { time: bus.time, formatted: formattedRemainingTime };
    //`${bus.time}`;// - ${formattedRemainingTime}
  });

  return previousBuses;
}

function getNextBuses(times, more) {
  let countToLoad = null;
  if (more) {
    countToLoad = more;
  } else {
    countToLoad = 21;
  }
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

  if (!times) {
    console.warn("Prevented Crash");
    return null;
  }
  const busTimes = times.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const busTime = hours * 60 + minutes; // Bus time in minutes since midnight
    const diff = busTime - currentTime;
    return {
      time,
      remainingTime: diff >= 0 ? diff : diff + 24 * 60,
    };
  });

  // Separate future and past bus times
  const futureBuses = busTimes.filter((bus) => bus.remainingTime >= 0);
  const pastBuses = busTimes.filter((bus) => bus.remainingTime < 0);

  // Sort future buses by remaining time
  futureBuses.sort((a, b) => a.remainingTime - b.remainingTime);

  // Find the nearest previous bus time
  let nearestPreviousBus = null;
  if (pastBuses.length > 0) {
    pastBuses.sort((a, b) => b.remainingTime - a.remainingTime); // Sort past buses in descending order
    nearestPreviousBus = pastBuses[0]; // Nearest previous bus (largest negative remaining time)
  }

  // Convert remaining times to the desired format for future buses

  const nextBuses = futureBuses.slice(0, countToLoad).map((bus) => {
    const diff = bus.remainingTime;
    let formattedRemainingTime;

    if (diff > 60) {
      let hours = Math.floor(diff / 60);
      let remainingMinutes = diff % 60;
      if (hours >= 1) {
        formattedRemainingTime = hours === 1 ? `${hours} ώρα` : `${hours} ώρες`;
        return `<vox>${bus.time}</vox> <span style="font-size: 15px;margin-left: 2px;">${formattedRemainingTime}</span>`;
      } else {
        formattedRemainingTime =
          hours === 1
            ? `${hours} ώρα, ${remainingMinutes} λεπτά`
            : `${hours} ώρες, ${remainingMinutes} λεπτά`;
        return `<vox>${bus.time}</vox> <span style="font-size: 15px;margin-left: 2px;">${formattedRemainingTime}</span>`;
      }
    } else {
      formattedRemainingTime = `${diff} λεπτά`;
      return `<vox>${bus.time}</vox> <span style="font-size: 15px;margin-left: 2px;">${formattedRemainingTime}</span>`;
    }
  });

  // If there's a nearest previous bus, format it and prepend to nextBuses
  if (nearestPreviousBus) {
    const previousDiff = Math.abs(nearestPreviousBus.remainingTime); // Use absolute value for formatting
    const previousFormattedTime = `${nearestPreviousBus.time} - πρίν ${previousDiff} λεπτά`;
    nextBuses.unshift(previousFormattedTime);
  }

  // Log the original bus times
  busTimes.slice(0, 5).forEach((bus) => {
    console.log(`Scheduled time: ${bus.time}`);
  });

  return nextBuses; // Return the next buses including the previous one
}

function manualLogout() {
  if (localStorage.getItem("t50-username")) {
    let userConfirmed = window.confirm(
      `Θέλετε να αποσυνδεθείτε από τον λογαριασμό σας [${localStorage.getItem(
        "t50-username"
      )}];`
    );
    if (userConfirmed) {
      localStorage.clear();
      sessionStorage.clear();
      setInterval(() => {
        window.location.reload();
      }, 500);
    }
  } else {
    let userConfirmed = window.confirm(
      `Δεν είστε συνδεδεμένοι. Θέλετε ακόμα να διαγράψετε τα δεδομένα σας;`
    );
    if (userConfirmed) {
      localStorage.clear();
      sessionStorage.clear();
      setInterval(() => {
        window.location.reload();
      }, 500);
    }
  }
}

function createBlueDot() {
  const dot = document.createElement("div");
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.backgroundColor = "#fff";
  dot.style.borderRadius = "50%";
  dot.style.transform = "translate(-50%, -50%)"; // Center the dot on the marker position
  return dot;
}

function createBlinkingDot() {
  const dot = document.createElement("div");
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.backgroundColor = "#fff"; // Set the color to white
  dot.style.borderRadius = "50%";
  dot.style.transform = "translate(-50%, -50%)"; // Center the dot on the marker position
  dot.style.animation = "blink 1s infinite"; // Add blinking animation

  // Define the keyframes for the blinking animation
  const style = document.createElement("style");
  style.innerHTML = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
`;
  document.head.appendChild(style);

  return dot;
}

function createRedDot() {
  const dot = document.createElement("div");
  dot.style.width = "15px";
  dot.style.height = "15px";
  dot.style.backgroundColor = "#ff0000";
  dot.style.borderRadius = "50%";
  dot.style.transform = "translate(-50%, -50%)"; // Center the dot on the marker position
  return dot;
}

function timeUntil(targetTime) {
  // Split the target time into hours and minutes
  const [targetHours, targetMinutes] = targetTime.split(":").map(Number);

  // Get the current date and time
  const now = new Date();

  // Create a new Date object for the target time on the current day
  const target = new Date(now);
  target.setHours(targetHours, targetMinutes, 0, 0);

  // If the target time has already passed today, set it to the next day
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }

  // Calculate the difference in minutes
  const remainingMinutes = Math.round((target - now) / 60000);

  // Convert and return the remaining minutes
  return convertTime(remainingMinutes);
}

function switchTo(what, el) {
  if (!el.classList.contains("active")) {
    processInfo(activeEvoxId, "getTimes", null, what);
  }
}

function showMoreBusStart() {
  processInfo(activeEvoxId, "getTimes", shownTimeTable + 5);
}

function displayLocalStorage() {
  const itemsContainer = document.getElementById("localStorageItems");
  itemsContainer.innerHTML = ""; // Clear existing items

  const keys = Object.keys(localStorage);
  if (keys.length === 0) {
    itemsContainer.textContent = "No items in localStorage.";
    return;
  }

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    // Create item div
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    // Key display
    const keyDisplay = document.createElement("span");
    keyDisplay.textContent = `${key}: `;
    itemDiv.appendChild(keyDisplay);

    // Editable value input
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = value;
    itemDiv.appendChild(valueInput);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      localStorage.setItem(key, valueInput.value);
      displayLocalStorage(); // Refresh display
      alert("Item edited successfully!");
    });
    itemDiv.appendChild(editBtn);

    // Append item to container
    itemsContainer.appendChild(itemDiv);
  });
}
displayLocalStorage();

function convert2Txt() {
  const value = document.getElementById("gotobaseNone").value;

  try {
    if (!value) {
      throw new Error("Input is empty. Please enter a Base64 encoded string.");
    }

    const new1 = atob(value);
    alert(`Decoded: ${new1}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function convert2Base() {
  const value = document.getElementById("gotobase64").value;
  try {
    const new1 = btoa(value);
    alert(`Encoded: ${new1}`);
  } catch (error) {
    alert(error);
  }
}

function getNearestMatch(descr, routeDescrs) {
  let closestMatch = null;
  let closestDistance = Infinity;

  routeDescrs.forEach((description) => {
    const distance = levenshteinDistance(descr, description);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestMatch = description;
    }
  });

  return closestMatch;
}

// Simple Levenshtein Distance function
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

function findNearestStop(stops, userLat, userLng) {
  function haversine(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return stops.reduce(
    (nearest, stop) => {
      const distance = haversine(userLat, userLng, stop.lat, stop.lng);
      return distance < nearest.distance ? { stop, distance } : nearest;
    },
    { stop: null, distance: Infinity }
  ).stop;
}

function clearUserImage() {
  localStorage.removeItem("userImage");
  const phone = document.getElementById("phone");
  phone.classList.remove("image");

  // Remove dynamic CSS
  const styleTag = document.getElementById("dynamic-style");
  if (styleTag) {
    styleTag.remove();
  }
}

function loginNew() {
  $("#loginStep1").fadeOut("fast", function () {
    document.querySelector(".loginContentFlex.noSplash").style.height = "auto";
    $("#loginStep2").fadeIn("fast", function () {});
  });
}

function loginAsGuest() {
  document.getElementById("bottomSearchParent").style.zIndex = "-1";
  $("#loginStep1").fadeOut("fast", function () {
    document.querySelector(".loginContentFlex.noSplash").style.height = "auto";
    $("#loginStepGuest").fadeIn("fast", function () {});
  });
}

function getOS() {
  const userAgent = navigator.userAgent;
  let operatingSystem = "Unknown";

  if (userAgent.includes("Windows NT")) {
    operatingSystem = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    operatingSystem = "macOS";
  } else if (userAgent.includes("Linux")) {
    operatingSystem = "Linux";
  } else if (userAgent.includes("Android")) {
    operatingSystem = "Android";
  } else if (userAgent.includes("iOS")) {
    operatingSystem = "iOS";
  }

  return operatingSystem;
}

function getOSVersion() {
  const userAgent = navigator.userAgent;
  let osVersion = "Unknown";

  if (userAgent.includes("Windows NT")) {
    osVersion = userAgent.split("Windows NT ")[1].split(";")[0];
  } else if (userAgent.includes("Mac OS")) {
    osVersion = userAgent.split("Mac OS ")[1].split(")")[0];
  } else if (userAgent.includes("Linux")) {
    osVersion = "Linux"; // Linux doesn't typically have a version string in userAgent
  } else if (userAgent.includes("Android")) {
    osVersion = userAgent.split("Android ")[1].split(";")[0];
  } else if (userAgent.includes("iPhone OS")) {
    osVersion = userAgent
      .split("iPhone OS ")[1]
      .split(" ")[0]
      .replace(/_/g, ".");
  } else if (userAgent.includes("iPad OS")) {
    osVersion = userAgent.split("iPad OS ")[1].split(" ")[0].replace(/_/g, ".");
  }

  return osVersion;
}

const os = getOS();
const osVersion = getOSVersion();

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function goBackToLogin() {
  $("#loginStep2").fadeOut("fast", function () {
    $("#loginStep1").fadeIn("fast");
  });
}

function goBackToLoginGuest() {
  $("#loginStepGuest").fadeOut("fast", function () {
    $("#loginStep1").fadeIn("fast");
  });
}

function goBackToLoginNew() {
  $("#loginStep3").fadeOut("fast", function () {
    $("#loginStep2").fadeIn("fast");
  });
}
function skipFlorida() {
  $("#loginStep3").fadeOut("fast", function () {
    $("#loginStepLast").fadeOut("fast", function () {
      //document.getElementById("main").classList.remove("setupNeeded")
      document.getElementById("nameterms").innerText =
        localStorage.getItem("t50-username");
      $("#loginStepTerms").fadeIn("fast");
    });
  });
  //window.location.reload();
}

function disagreeTerms() {
  if (blockGoingToLogin === true) {
    localStorage.removeItem("isOasaLoggedIn");
    window.location.reload();
    return;
  }
  $("#loginStepTerms").fadeOut("fast", function () {
    $("#loginStep3").fadeIn("fast");
  });
}

async function clearStorageAndReload() {
  // Clear localStorage
  localStorage.clear();

  // Unregister all service workers
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));
  }

  // Reload the page
  location.reload();
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (angle) => (angle * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function getDeviceInfo() {
  const userAgent = navigator.userAgent;

  let deviceType = "Unknown";
  let model = "Unknown";
  let osVersion = "Unknown";

  // Detect device type
  if (/Mobile|iPhone|Android/.test(userAgent)) {
    deviceType = "Κινητή";
  } else if (/Tablet|iPad/.test(userAgent)) {
    deviceType = "Τάμπλετ";
  } else if (/Mac|Windows|Linux|X11/.test(userAgent)) {
    deviceType = "Υπολογιστής";
  }

  // Detect model (basic parsing)
  if (/iPhone/.test(userAgent)) {
    model = "iPhone";
  } else if (/iPad/.test(userAgent)) {
    model = "iPad";
  } else if (/Android/.test(userAgent)) {
    const androidMatch = userAgent.match(/Android\s([\d.]+)/);
    model = "Android Device";
    osVersion = androidMatch ? androidMatch[1] : osVersion;
  } else if (/Mac/.test(userAgent)) {
    model = "Mac";
  } else if (/Windows/.test(userAgent)) {
    model = "Windows PC";
  }

  // Detect OS version (basic parsing)
  if (/iPhone|iPad/.test(userAgent)) {
    const iosMatch = userAgent.match(/OS (\d+_\d+)/);
    osVersion = iosMatch ? iosMatch[1].replace("_", ".") : osVersion;
  } else if (/Windows/.test(userAgent)) {
    const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    osVersion = windowsMatch ? windowsMatch[1] : osVersion;
  } else if (/Mac/.test(userAgent)) {
    const macMatch = userAgent.match(/Mac OS X (\d+_\d+)/);
    osVersion = macMatch ? macMatch[1].replace("_", ".") : osVersion;
  }

  // Return as JSON object
  return {
    deviceType,
    model,
    osVersion,
  };
}

function smoothLine(coords, smoothing = 0.2, steps = 20) {
  if (coords.length < 3) return coords;

  const smoothCoords = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] || coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] || p2;

    for (let t = 0; t <= 1; t += 1 / steps) {
      const t2 = t * t;
      const t3 = t2 * t;

      // smaller 'smoothing' = tighter curve (less bending)
      const s = smoothing;

      const x =
        0.5 *
        (2 * p1.lng +
          (-p0.lng + p2.lng) * t * s +
          (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 * s +
          (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3 * s);
      const y =
        0.5 *
        (2 * p1.lat +
          (-p0.lat + p2.lat) * t * s +
          (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 * s +
          (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3 * s);

      smoothCoords.push({ lng: x, lat: y });
    }
  }

  return smoothCoords;
}

let liveBusesNearInterval = null;
let nearbyStopsData = [];
let nearbyStopMarkers = [];

const _nearbyStationIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-720.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(720.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path>
                <path d="M13,3 C13,2.44772 12.5523,2 12,2 C11.4477,2 11,2.44772 11,3 L11,4 L10,4 C8.89543,4 8,4.89543 8,6 L8,8 C8,9.10457 8.89543,10 10,10 L11,10 L11,11 L7.41421,11 C6.88378,11 6.37507,11.2107 6,11.5858 L4.29289,13.2929 C4.10536,13.4804 4,13.7348 4,14 C4,14.2652 4.10536,14.5196 4.29289,14.7071 L6,16.4142 C6.37507,16.7893 6.88378,17 7.41421,17 L11,17 L11,20 L9,20 C8.44772,20 8,20.4477 8,21 C8,21.5523 8.44772,22 9,22 L15,22 C15.5523,22 16,21.5523 16,21 C16,20.4477 15.5523,20 15,20 L13,20 L13,17 L14,17 C15.1046,17 16,16.1046 16,15 L16,13 C16,11.8954 15.1046,11 14,11 L13,11 L13,10 L16.5858,10 C17.1162,10 17.6249,9.78929 18,9.41421 L19.7071,7.70711 C19.8946,7.51957 20,7.26522 20,7 C20,6.73478 19.8946,6.48043 19.7071,6.29289 L18,4.58579 C17.6249,4.21071 17.1162,4 16.5858,4 L13,4 L13,3 Z" fill="#fff"></path>
            </g>
        </g>
    </g>
</svg>`;

function _createNearbyStationDot(stop) {
  const dot = document.createElement("div");
  dot.className = "station";
  dot.setAttribute("data-status", "hidden");
  dot.innerHTML = _nearbyStationIconSVG;
  const name = capitalizeWords(stop.StopDescr);
  dot.onclick = function (e) {
    if (dot.getAttribute("data-status") === "hidden") {
      e.stopPropagation();
      this.style.zIndex = "9999";
      this.innerHTML = `<div class="dotBusInfoShow">
        <p>${name}</p>
        <div class="dotrow">
          <div onclick="event.stopPropagation();openStation('${stop.StopCode}', '${name}', null, null);" class="actiondot">
            <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
              <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#fff"></path>
              <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#fff"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.75 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z" fill="#fff"></path>
            </svg>
          </div>
          <div onclick="event.stopPropagation();walkMeTo('${stop.StopLng}', '${stop.StopLat}', event, '${name}');" class="actiondot">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-768.000000, -48.000000)" fill-rule="nonzero">
            <g transform="translate(768.000000, 48.000000)">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path>
                <path d="M11.9999,2 C13.6567,2 14.9999,3.34315 14.9999,5 C14.9999,6.35582174 14.1004285,7.50158382 12.8656975,7.8731619 L12.6953,7.91898 L15.123,10.6935 L16.9471,11.6055 C17.4411,11.8525 17.6413,12.4532 17.3943,12.9472 C17.1649429,13.4058214 16.6306959,13.6112878 16.1600211,13.4405382 L16.0527,13.3944 L14.2286,12.4823 C14.054375,12.395225 13.8941563,12.2832875 13.7527531,12.1503266 L13.6178,12.0105 L12.5997,10.8469 L11.9402,13.485 C11.87836,13.73236 11.772936,13.95732 11.634168,14.153736 L11.524,14.2956 L13.4524,16.0587 C13.7008857,16.2859286 13.8873633,16.5716388 13.9955854,16.8886889 L14.0431,17.0497 L14.7807,20 L14.9999,20 C15.5522,20 15.9999,20.4477 15.9999,21 C15.9999,21.5127571 15.613873,21.9354959 15.1165239,21.9932711 L14.9999,22 L14.078,22 C13.6152667,22 13.2069833,21.7112806 13.0478704,21.285967 L13.0108,21.1667 L12.1028,17.5347 L9.0933,14.7832 C8.32760588,14.3947765 7.88328478,13.5453758 8.02593056,12.6776961 L8.05962,12.5149 L8.5727,10.4626 L8.25039,10.6928 L6.8574,13.0145 C6.57325,13.488 5.95899,13.6416 5.48541,13.3574 C5.04565714,13.0935929 4.8818399,12.5450724 5.08817946,12.0889477 L5.14241,11.9855 L6.53541,9.66381 C6.648338,9.475586 6.7912884,9.3075604 6.95826568,9.16622536 L7.08791,9.06533 L9.85002,7.0924 C9.32392,6.55194 8.99988,5.81381 8.99988,5 C8.99988,3.34315 10.343,2 11.9999,2 Z M9.31613,15.5513 C9.84008,15.7259 10.1232,16.2922 9.94859,16.8162 L9.52324,18.0922 C9.42506,18.3868 9.25964,18.6544 9.04009,18.874 L7.38331,20.5308 C7.58424,20.9088 7.52548,21.3886 7.20701,21.7071 C6.81649,22.0976 6.18332,22.0976 5.7928,21.7071 L5.29987,21.2141 C4.90544,20.8197 4.90544,20.1802 5.29987,19.7858 L7.62587,17.4598 L8.05122,16.1837 C8.22587,15.6598 8.79219,15.3766 9.31613,15.5513 Z" fill="#fff"></path>
            </g>
        </g>
    </g>
</svg>
          </div>
        </div>
      </div>`;
      dot.setAttribute("data-status", "visible");
    } else {
      this.style.zIndex = null;
      this.innerHTML = _nearbyStationIconSVG;
      dot.setAttribute("data-status", "hidden");
    }
  };
  return dot;
}

function _renderNearbyStopsClustered() {
  nearbyStopMarkers.forEach(m => m.remove());
  nearbyStopMarkers = [];
  if (!nearbyStopsData.length) return;

  const CLUSTER_RADIUS_PX = 45;
  const points = nearbyStopsData.map(stop => {
    const px = map.project([parseFloat(stop.StopLng), parseFloat(stop.StopLat)]);
    return { stop, px, assigned: false };
  });

  const clusters = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].assigned) continue;
    const cluster = [points[i]];
    points[i].assigned = true;
    for (let j = i + 1; j < points.length; j++) {
      if (points[j].assigned) continue;
      const dx = points[i].px.x - points[j].px.x;
      const dy = points[i].px.y - points[j].px.y;
      if (Math.sqrt(dx * dx + dy * dy) < CLUSTER_RADIUS_PX) {
        cluster.push(points[j]);
        points[j].assigned = true;
      }
    }
    clusters.push(cluster);
  }

  clusters.forEach(cluster => {
    let el, lngLat;
    if (cluster.length === 1) {
      const stop = cluster[0].stop;
      el = _createNearbyStationDot(stop);
      lngLat = [parseFloat(stop.StopLng), parseFloat(stop.StopLat)];
    } else {
      const totalLng = cluster.reduce((s, p) => s + parseFloat(p.stop.StopLng), 0);
      const totalLat = cluster.reduce((s, p) => s + parseFloat(p.stop.StopLat), 0);
      lngLat = [totalLng / cluster.length, totalLat / cluster.length];
      el = document.createElement("div");
      el.className = "station-cluster";
      el.textContent = cluster.length;
      el.onclick = () => map.easeTo({ center: lngLat, zoom: map.getZoom() + 2 });
    }
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
    nearbyStopMarkers.push(marker);
    markers_intel.push(marker);
  });
}

function triggerNearbyStationsSpawn() {
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    spawnNearby(latitude, longitude);
  });
  function spawnNearby(lat, lng) {
    fetch(
      `https://data.evoxs.xyz/oasa?epsilon=stopsNearby&lat=${lat}&lng=${lng}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("nearbyInfo").classList.add("active");
        nearbyStopsData = data;
        _renderNearbyStopsClustered();
        map.off("zoomend", _renderNearbyStopsClustered);
        map.on("zoomend", _renderNearbyStopsClustered);

        data.forEach((stop) => spawnLiveBusesOfStop(stop.StopCode));

        liveBusesNearInterval = setInterval(() => {
          // CHANGED: Iterate over liveSpawned by routecode
          Object.entries(liveSpawned).forEach(([routecode, routeData]) => {
            const { details, vehicles } = routeData;
            const activeVehicles = Object.keys(vehicles);
            
            fetch(
              `https://data.evoxs.xyz/proxy?key=21&targetUrl=${encodeURIComponent(
                `https://telematics.oasa.gr/api/?act=getBusLocation&p1=${routecode}&keyOrigin=evoxEpsilon`
              )}&vevox=${randomString()}`
            )
              .then((res) => res.json())
              .then((busLocations) => {
                if (!Array.isArray(busLocations)) return;

                busLocations.forEach((location) => {
                  // CHANGED: Use routeData.vehicles for existence check
                  const vehNo = location.VEH_NO;
                  const existingMarker = routeData.vehicles[vehNo];
                  const newLngLat = [
                    parseFloat(location.CS_LNG),
                    parseFloat(location.CS_LAT),
                  ];

                  if (existingMarker) {
                    const currentLngLat = existingMarker.getLngLat();
                    smoothMove(existingMarker, currentLngLat, newLngLat, 1200); // 1.2s smooth move
                  } else {
                    // CHANGED: Create and assign directly (no busData arg)
                    const marker = SpawnNewBusMarker(details.busId, location);
                    routeData.vehicles[vehNo] = marker;
                  }
                });
              })
              .catch((err) => console.error("Bus update failed", err));
          });
        }, 5000);

        // Smooth movement helper
        function smoothMove(marker, from, to, duration) {
          const start = performance.now();
          function animate(time) {
            const t = Math.min((time - start) / duration, 1); // progress [0..1]
            const lng = from.lng + (to[0] - from.lng) * t;
            const lat = from.lat + (to[1] - from.lat) * t;
            marker.setLngLat([lng, lat]);
            if (t < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}
let liveSpawned = {};
function spawnLiveBusesOfStop(stopcode) {
  //this function will find all the buses of a stop and spawn the available live locations of each bus.
  fetch(
    `https://data.evoxs.xyz/proxy?key=21&targetUrl=${encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webRoutesForStop&p1=${stopcode}&keyOrigin=evoxEpsilon`
    )}&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((stopBuses) => {
      if (!stopBuses) return;
      stopBuses.forEach((bus) => {
        const busId = bus.LineID;
        const routecode = bus.RouteCode;

        // NEW: Skip if already tracking this routecode (prevents duplicate spawns from shared routes)
        if (liveSpawned[routecode]) return;

        // CHANGED: Key by routecode, add vehicles sub-object
        liveSpawned[routecode] = {
          details: { busId, routecode },
          vehicles: {},
        };

        function spawnTheBus() {
          fetch(
            `https://data.evoxs.xyz/proxy?key=21&targetUrl=${encodeURIComponent(
              `https://telematics.oasa.gr/api/?act=getBusLocation&p1=${routecode}&keyOrigin=evoxEpsilon`
            )}&vevox=${randomString()}`
          )
            .then((response) => response.json())
            .then((busLocations) => {
              if (busLocations === "") {
                return;
              }
              busLocations.forEach((location) => {
                // CHANGED: Use vehicles sub-object for existence check
                const vehNo = location.VEH_NO;
                const existingMarker = liveSpawned[routecode].vehicles[vehNo];

                if (existingMarker) {
                  console.log("Found a bus that is already spawned.");
                  existingMarker.setLngLat([location.CS_LNG, location.CS_LAT]);
                  return;
                }
                // CHANGED: Create and assign directly (no busData arg)
                const marker = SpawnNewBusMarker(busId, location);
                liveSpawned[routecode].vehicles[vehNo] = marker;
              });
            })
            .catch((error) => {
              console.error("Stop load failed", stopcode, error);
            });
        }
        spawnTheBus();
      });
    })
    .catch((error) => {
      console.error("Stop load failed", stopcode, error);
    });
}
let busMarkersLive = [];
function SpawnNewBusMarker(busId, location) {
  // REMOVED: veh_codes_spawned check (unnecessary)
  const dot = document.createElement("div");
  dot.className = "busLocation";
  dot.style.opacity = "0";
  dot.style.fontWeight = "bold"
  dot.style.fontSize = "16px"
  dot.setAttribute("data-status", "hidden");

  dot.onclick = function () {
    if (dot.getAttribute("data-status") !== "hidden") {
      dot.setAttribute("data-status", "visible");
      this.innerHTML = `<p>${busId}</p><svg onclick="alert('δεν είναι ακόμα έτοιμο αυτό...');" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
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

  dot.innerHTML = busId;

  const newLngLat = [parseFloat(location.CS_LNG), parseFloat(location.CS_LAT)];
  const marker = new mapboxgl.Marker({
    element: dot,
    offset: [0, 0],
  })
    .setLngLat(newLngLat)
    .addTo(map);

  setTimeout(function () {
    dot.style.opacity = "1";
  }, 1500);
  busMarkersLive.push(marker);
  // REMOVED: busData assignment (handled by caller)
  // REMOVED: veh_codes_spawned.push (unnecessary)

  // NEW: Return the marker for assignment
  return marker;
}
async function checkPWACache() {
  if (!('serviceWorker' in navigator)) {
    alert("Service Workers are not supported in this browser.");
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (!registrations || registrations.length === 0) {
      alert("No Service Worker is registered.");
      return;
    }

    const cache = await caches.open('static-cache-v119');
    const keys = await cache.keys();

    alert("Service Worker is registered.\nCached requests: " + keys.length);
    console.log("Cached requests:", keys.length);

  } catch (err) {
    console.error("Error checking cache:", err);
    alert("Failed to read cache.");
  }
}


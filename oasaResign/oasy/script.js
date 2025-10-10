mapboxgl.accessToken =
  "pk.eyJ1IjoicGFwb3N0b2wiLCJhIjoiY2xsZXg0c240MHphNzNrbjE3Z2hteGNwNSJ9.K1O6D38nMeeIzDKqa4Fynw";

let map = null;
function reFocus() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        focusOn(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        //alert(error.message)
        focusOn(37.9838, 23.7275); // Default to Athens if geolocation fails
        //spawnBlocks(myLoc)
        //bypassAny()

        console.log("Error code: " + error.code + " - " + error.message);
      }
    );
  } else {
    //spawnBlocks(myLoc)
    alert("Geolocation is not supported by this browser.");
  }
}

reFocus();
function focusOn(lat, lng) {
  const currentLocation = [lng, lat];
  if (!map) {
    map = new mapboxgl.Map({
      container: "map-io",
      style: "mapbox://styles/papostol/cmgkx6muz00e901qy4vl31i3c",
      center: currentLocation,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      antialias: true,
      offset: [0, -200],
    });

    map.on("load", () => {
      map.easeTo({
        center: currentLocation,
        offset: [0, -200],
        zoom: 15,
      });
    });
  } else {
    map.easeTo({
      zoom: 10,
      center: currentLocation,
      offset: [0, -200],
    });
  }
}

let locationMarker = null;

function spawnLocation(lat, lng) {
  // If marker already exists, just move it
  if (locationMarker) {
    locationMarker.setLngLat([lng, lat]);
    return;
  }

  // First-time creation
  const el = document.createElement("div");
  el.style.width = "15px";
  el.style.height = "15px";
  el.style.backgroundColor = "#0885ff";
  el.style.borderRadius = "50%";
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";

  locationMarker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
}

let stopMarkers = [];
let busMarkersLive = [];
let allLinesDictionary = null;
function setup() {
  grabberEvents("main-screen");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        spawnNearby(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        spawnNearby(37.9838, 23.7275);
      }
    );
  }
  function spawnNearby(lat, lng) {
    fetch(
      `https://data.evoxs.xyz/oasa?epsilon=stopsNearby&lat=${lat}&lng=${lng}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // parse JSON from the response
      })
      .then((data) => {
        data.forEach((stop) => {
          const el = document.createElement("div");
          el.style.width = "auto";
          el.style.height = "auto";
          el.style.padding = "5px 10px";
          el.style.backgroundColor = "#0885ff";
          el.style.borderRadius = "10px";
          el.style.boxSizing = "border-box";
          el.style.border = "1px solid white";
          el.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
          el.innerHTML = capitalizeWords(stop.StopDescr);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([stop.StopLng, stop.StopLat])
            .addTo(map);
          stopMarkers.push(marker);
          spawnLiveBusesOfStop(stop.StopCode);
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  //Initialize dictionary
  const allLinesUrl = encodeURIComponent(
    `https://telematics.oasa.gr/api/?act=webGetLines&keyOrigin=evoxEpsilon`
  );
  fetch(
    `https://data.evoxs.xyz/proxy?key=21&targetUrl=${allLinesUrl}&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      allLinesDictionary = data;
    })
    .catch((error) => {
      console.error("Failed to fetch all lines:", error);
    });
}
setup();

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
      stopBuses.forEach((bus) => {
        const busId = bus.LineID;
        const routecode = bus.RouteCode;
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
              liveSpawned[busId] = {};
              busLocations.forEach((location) => {
                if (liveSpawned[busId][location.VEH_NO]) {
                  liveSpawned[busId][location.VEH_NO].setLngLat([location.CS_LNG, location.CS_LAT]);
                  return;
                }
                const el = document.createElement("div");
                el.style.width = "40px";
                el.style.height = "40px";
                el.style.padding = "10px 10px";
                el.style.display = "flex";
                el.style.justifyContent = "center";
                el.style.alignItems = "center";
                el.style.backgroundColor = "#674ef4";
                el.style.color = "#fff";
                el.style.borderRadius = "50%";
                el.style.boxSizing = "border-box";
                el.style.border = "1px solid white";
                el.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
                el.innerHTML = busId;

                const marker = new mapboxgl.Marker(el)
                  .setLngLat([location.CS_LNG, location.CS_LAT])
                  .addTo(map);
                liveSpawned[busId][location.VEH_NO] = marker;
                busMarkersLive.push(marker);
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

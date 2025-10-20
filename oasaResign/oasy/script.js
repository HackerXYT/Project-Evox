let map = null;
function reFocus(userTrigger) {
  if (userTrigger) {
    haptics.trigger();
  }
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
document.getElementById(
  "pfp"
).src = `https://data.evoxs.xyz/profiles?authorize=imagePfp&name=${
  localStorage.getItem("t50-username")
    ? localStorage.getItem("t50-username")
    : "EVOXGUESTUSER001"
}&v=${randomString()}`;
function focusOn(lat, lng) {
  const currentLocation = [lng, lat];
  if (!map) {
    map = new mapboxgl.Map({
      container: "map-io",
      style: "mapbox://styles/mapbox/light-v10",
      center: currentLocation,
      zoom: 15,
      pitch: 0,
      bearing: 0,
      antialias: true,
      maxZoom: 18, // Prevent excessive detail
      minZoom: 8, // Avoid rendering too much at low zooms
      interactive: true, // Ensure map is interactive
      glyphs: "./glyphs/{range}.pbf",
      dragPan: {
        linearity: 0.3, // Controls momentum curve (0 to 1, lower feels snappier)
        easing: (t) => t, // Linear easing for consistent momentum
        maxSpeed: 1400, // Max speed of panning
        deceleration: 2500, // How quickly momentum slows down
      },
    });

    map.on("load", () => {
      map.dragPan.enable();
      map.touchZoomRotate.enable();
      map.touchPitch.enable();
      map.touchZoomRotate.enableRotation();
      map.easeTo({
        center: currentLocation,
        offset: [0, -150],
        zoom: 15,
        duration: 10,
      });
      map.getStyle().layers.forEach((l) => console.log(l.id, l.type));

      document.getElementById("options").style.opacity = "1";
      document.getElementById("map-io").style.opacity = "1";
      document.getElementById("main-screen").classList.remove("hidden");

      map.setPaintProperty("water", "fill-color", "#0d2355"); // Darker blue for water
      map.setPaintProperty("landuse", "fill-color", "#214d27"); // darker green for parks
      map.setPaintProperty("landcover", "fill-color", "#00ff22");
      map.setPaintProperty("land", "background-color", "#404A67");
      map.setPaintProperty("building", "fill-color", "#606680");
      map.setPaintProperty("building-outline", "line-color", "#21222a");

      map.setPaintProperty("road-street", "line-color", "#2f343f");
      map.setPaintProperty("road-path", "line-color", "#2f343f");
      map.setPaintProperty("road-street-low", "line-color", "#2f343f");
      map.setPaintProperty("road-street-case", "line-color", "#2f343f");

      map.setPaintProperty("road-pedestrian-case", "line-color", "#757983");

      map.setPaintProperty("road-minor-case", "line-color", "#2f343f");
      map.setPaintProperty("road-primary-case", "line-color", "#2f343f");
      map.setPaintProperty("road-motorway-trunk-case", "line-color", "#2f343f");
      map.setPaintProperty("road-construction", "line-color", "#ff0000");

      map.setPaintProperty("road-pedestrian", "line-color", "#363e56");
      map.setPaintProperty("road-minor", "line-color", "#2f343f");
      map.setPaintProperty("road-secondary-tertiary", "line-color", "#2f343f");
      map.setPaintProperty("road-primary", "line-color", "#2f343f");
      map.setPaintProperty("road-motorway-trunk", "line-color", "#2f343f");
      map.setPaintProperty("road-trunk", "line-color", "#ff0000");
      map.setPaintProperty("road-label", "text-color", "#000"); // Set text color to red
      map.setPaintProperty("road-label", "outline-color", "#000"); // Set text color to red
      map.setPaintProperty("road-label", "text-size", 12); // Set text size

      return;
      map.setPaintProperty("background", "background-color", "#404A67"); // dark city base

      map.setPaintProperty("road-primary", "line-color", "#8a2be2"); // Vibrant purple for primary roads
      map.setPaintProperty("building", "fill-color", "#d3d3d3"); // Soft gray for buildings
      map.setPaintProperty("land", "fill-color", "#f5f5f5"); // Light gray for land
      map.setPaintProperty("place-label", "text-color", "#333333"); // Dark charcoal for place labels
      map.setPaintProperty("road-label", "text-color", "#444444"); // Slightly lighter charcoal for road labels
    });

    map.on("error", (e) => {
      console.error("Map error:", e.error);
      // This will log style load failures
    });

    function updateMarkerVisibility() {
      const zoom = map.getZoom();
      const toHide = zoom < 13;
      const allMarkers = [...stopMarkers, ...busMarkersLive];

      stopMarkers.forEach((marker) => {
        const el = marker.getElement();
        if (!el) return;
        if (toHide) {
          el.classList.add("opacity0");
        } else {
          el.classList.remove("opacity0");
        }
      });
    }

    map.on("zoom", updateMarkerVisibility);
  } else {
    map.easeTo({
      zoom: 15,
      center: currentLocation,
      offset: [0, -150],
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
  el.style.zIndex = "999";

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
          el.style.transition = "opacity 0.3s ease";
          el.setAttribute("StopCode", stop.StopCode);
          el.setAttribute("StopDescr", stop.StopDescr);
          el.setAttribute("StopID", stop.StopID);
          el.addEventListener("click", function (event) {
            haptics.trigger();
            openStationFromMap(this);
          });
          el.innerHTML = capitalizeWords(stop.StopDescr);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([stop.StopLng, stop.StopLat])
            .addTo(map);
          stopMarkers.push(marker);
          spawnLiveBusesOfStop(stop.StopCode);
        });

        setInterval(() => {
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
// REMOVED: veh_codes_spawned (unnecessary with fixed checks)
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

function openStationFromMap(el) {
  const StopCode = el.getAttribute("StopCode");
  const StopDescr = el.getAttribute("StopDescr");
  const StopID = el.getAttribute("StopID");
  console.log(StopCode, StopDescr, StopID);
  changeToSection(capitalizeWords(StopDescr));
  const container = document.getElementById("section-station");
  container.classList.add("shown");
  container.innerHTML = ""; //loader
  fetch(
    `https://data.evoxs.xyz/proxy?key=21&targetUrl=${encodeURIComponent(
      `https://telematics.oasa.gr/api/?act=webRoutesForStop&p1=${StopCode}&keyOrigin=evoxEpsilon`
    )}&vevox=${randomString()}`
  )
    .then((response) => response.json())
    .then((stopBuses) => {
      if (!stopBuses) return;
      console.log(stopBuses);
      let routes = stopBuses;
      stopBuses.forEach((bus, i) => {
        const busId = bus.LineID;
        const routecode = bus.RouteCode;
        const id = randomString();
        routes[i].evxid = id;
        container.innerHTML += `<div class="busNode">
                    <div class="column aligncenter justifycenter">
                        <p id="finishtime-${id}">-</p>
                        <span id="finishtimetype-${id}">ΛΕΠΤΑ</span>
                    </div>
                    <div class="column width100">
                        <div class="row spacebetween width100">
                            <span id="finishtimefull-${id}">- ΜΜ</span>
                            <span id="iscoming-${id}" class="globalred">Άγνωστο</span>
                        </div>
                        <div class="column width100 inner">
                            <div class="row gap5">
                                <p class="larger">${capitalizeWords(
                                  bus.LineDescr.split("-")[0]
                                )}</p><span> - </span><p
                                    class="larger">${capitalizeWords(
                                      bus.LineDescr.split("-")[1].split("(")[0]
                                    )}</p>
                            </div>
                            ${
                              bus.LineDescr.split("-")[1].split("(")[1]
                                ? `<div class="row gap5">
                                <span>(${capitalizeWords(
                                  bus.LineDescr.split("-")[1].split("(")[1]
                                )}</span>
                            </div>`
                                : ""
                            }
                        </div>
                        
                        <div class="row spacebetween">
                            <span class="row aligncenter globalgrey">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="#0fb867" width="25px" height="25px"
                                    viewBox="0 0 256 256" id="Flat">
                                    <path
                                        d="M201.541,54.458a104,104,0,1,0,0,147.07813A104.10845,104.10845,0,0,0,201.541,54.458ZM163.99414,147.9971a8,8,0,0,1-16,0V119.3096l-42.34375,42.34375a7.99915,7.99915,0,0,1-11.3125-11.3125l42.34375-42.34375h-28.6875a8,8,0,0,1,0-16h48a8.02753,8.02753,0,0,1,8,8Z" />
                                </svg>
                                ${bus.LineID}
                                <p id="startTime-${id}" class="globalgreen">- MM</p>
                            </span>
                        </div>
                    </div>
                </div>`;
      });
      fetch(
        `https://data.evoxs.xyz/proxy?key=21&targetUrl=${encodeURIComponent(
          `https://telematics.oasa.gr/api/?act=getStopArrivals&p1=${StopCode}&keyOrigin=evoxEpsilon`
        )}&vevox=${randomString()}`
      )
        .then((response) => response.json())
        .then((busesComing) => {
          if (!busesComing) return;
          console.log(busesComing);
          busesComing.forEach((bus) => {});
          const routeMap = routes.reduce((map, route) => {
            const code = route.RouteCode;
            if (!map.has(code)) {
              map.set(code, []);
            }
            map.get(code).push(route);
            return map;
          }, new Map());

          // Now match for each vehicle
          const matchedResults = busesComing.map((vehicle) => {
            const matchingRoutes = routeMap.get(vehicle.route_code) || []; // Array of matches (could be empty)
            return {
              vehicle: vehicle,
              matchingRoutes: matchingRoutes, // Attach all matches
            };
          });
          console.log(matchedResults);
          matchedResults.forEach((m) => {
            m.matchingRoutes.forEach((busesMatch) => {
              document.getElementById(
                `finishtime-${busesMatch.evxid}`
              ).innerHTML = m.vehicle.btime2;
              document.getElementById(
                `finishtimefull-${busesMatch.evxid}`
              ).innerHTML = addMinutesToCurrentTime(
                Number(m.vehicle.btime2)
              ).result;
              document.getElementById(
                `iscoming-${busesMatch.evxid}`
              ).innerHTML = "Καθοδόν";
              document
                .getElementById(`iscoming-${busesMatch.evxid}`)
                .classList.remove("globalred");
              document
                .getElementById(`iscoming-${busesMatch.evxid}`)
                .classList.add("globalgreen");
            });
          });
        })
        .catch((error) => {
          console.error("Stop coming bus load failed", StopCode, error);
        });
    })
    .catch((error) => {
      console.error("Stop load failed", stopcode, error);
    });
}

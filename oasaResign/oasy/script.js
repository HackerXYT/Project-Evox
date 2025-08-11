mapboxgl.accessToken = 'pk.eyJ1IjoicGFwb3N0b2wiLCJhIjoiY2xsZXg0c240MHphNzNrbjE3Z2hteGNwNSJ9.K1O6D38nMeeIzDKqa4Fynw';

let map = null
function reFocus() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            focusOn(position.coords.latitude, position.coords.longitude)
        }, function (error) {
            //alert(error.message)
            focusOn(37.9838, 23.7275) // Default to Athens if geolocation fails
            //spawnBlocks(myLoc)
            //bypassAny()

            console.log("Error code: " + error.code + " - " + error.message);
        });
    } else {
        //spawnBlocks(myLoc)
        alert("Geolocation is not supported by this browser.");
    }
}

reFocus()
function focusOn(lat, lng) {
    const currentLocation = [lng, lat];
    if (!map) {
        map = new mapboxgl.Map({
            container: 'map-io',
            style: 'mapbox://styles/mapbox/streets-v8',
            center: currentLocation,
            zoom: 10,
            pitch: 0,
            bearing: 0,
            antialias: true
        });
        map.on('load', () => {
            map.easeTo({
                center: currentLocation,
                offset: [0, -200]
            });
        });
    } else {
        map.easeTo({
            zoom: 10,
            center: currentLocation,
            offset: [0, -200]
        });
    }



}


function grabberEvents(id) {
    const notice = document.getElementById(id);
    let startY, currentY, isDragging = false, moved = false;

    // Initialize event listeners for touch/mouse events
    notice.addEventListener("mousedown", startDrag);
    notice.addEventListener("touchstart", startDrag, { passive: true });
    notice.addEventListener("mousemove", drag);
    notice.addEventListener("touchmove", drag, { passive: true });
    notice.addEventListener("mouseup", endDrag);
    notice.addEventListener("touchend", endDrag);

    function startDrag(e) {
        if (notice.scrollTop > 0) {
            // Prevent drag if the user has scrolled down
            return;
        }

        startY = e.touches ? e.touches[0].clientY : e.clientY;
        isDragging = true;
        moved = false; // Reset movement flag
        notice.style.transition = "none"; // Disable transitions for smooth dragging
    }

    function drag(e) {
        if (!isDragging) return;

        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        let deltaY = currentY - startY;

        if (Math.abs(deltaY) > 30) {
            moved = true; // Only consider as dragging if movement exceeds 10px
        }

        if (deltaY > 0 && notice.scrollTop === 0) {
            notice.style.transform = `translateY(${deltaY}px)`;
        }
        //else if (deltaY < 0) {
        //    const baseHeight = notice.parentElement.offsetHeight * 0.5; // assuming 50% is the CSS base
        //    const newHeight = baseHeight + Math.abs(deltaY);
        //    notice.style.height = `${newHeight}px`;
        //    notice.style.transition = "none"; // ensure smooth resizing
        //}
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        notice.style.transition = "transform 0.3s ease";

        if (!moved) {
            // If the user tapped but didn't drag, don't close
            notice.style.transform = ``;
            return;
        }

        console.log(Math.round(currentY - startY))

        if (currentY - startY > 999 && notice.scrollTop === 0) {
            currentY = e.touches ? e.touches[0].clientY : e.clientY;
            let deltaY = currentY - startY;
            const baseHeight = notice.parentElement.offsetHeight * 0.5; // assuming 50% is the CSS base
            const newHeight = baseHeight + Math.abs(deltaY);
            notice.style.height = `${newHeight}px`;
            notice.style.transition = "none"; // ensure smooth resizing

            console.log(id)

            notice.addEventListener("transitionend", () => {
                notice.classList.remove("active");
                notice.style.transform = ``;
            }, { once: true });
        } else {
            notice.style.transform = ``; // Reset if not dismissed
        }
    }
}

grabberEvents("main-screen")
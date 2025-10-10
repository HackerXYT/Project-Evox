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

const randomString = () => Math.random().toString(36).substring(2, 10);

function grabberEvents(id) {
  const notice = document.getElementById(id);
  let startY,
    currentY,
    isDragging = false,
    moved = false;

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

    console.log(Math.round(currentY - startY));

    if (currentY - startY > 999 && notice.scrollTop === 0) {
      currentY = e.touches ? e.touches[0].clientY : e.clientY;
      let deltaY = currentY - startY;
      const baseHeight = notice.parentElement.offsetHeight * 0.5; // assuming 50% is the CSS base
      const newHeight = baseHeight + Math.abs(deltaY);
      notice.style.height = `${newHeight}px`;
      notice.style.transition = "none"; // ensure smooth resizing

      console.log(id);

      notice.addEventListener(
        "transitionend",
        () => {
          notice.classList.remove("active");
          notice.style.transform = ``;
        },
        { once: true }
      );
    } else {
      notice.style.transform = ``; // Reset if not dismissed
    }
  }
}

setInterval(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        spawnLocation(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        spawnLocation(37.9838, 23.7275);

        console.log("Error code: " + error.code + " - " + error.message);
      }
    );
  }
}, 1000);
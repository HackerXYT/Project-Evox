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
    notice.style.transition = "none"; // Disable transitions for smoother dragging
  }

  function drag(e) {
    if (!isDragging) return;

    currentY = e.touches ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;

    if (deltaY > 0) {
      // Only allow downward dragging
      notice.style.transform = `translateY(${deltaY}px)`;
    }
  }

  function endDrag() {
    isDragging = false;
    notice.style.transition = "transform 0.4s ease"; // Add smooth return or dismiss transition

    if (currentY - startY > 150) {
      notice.style.transform = `translateY(100vh)`;

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
      notice.style.transform = ``; // Reset if not dismissed
    }
  }
}
grabberEvents("slidingPopup")

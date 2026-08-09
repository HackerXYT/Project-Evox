let heavyLoad = false;
let frameDrops = 0;

// Check frame rate drops
if (window.PerformanceObserver) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name === "frame") {
                if (entry.duration > 16.7) {
                    // A frame took longer than 16.7ms, indicating a drop below 60 FPS
                    frameDrops++;
                }
            }
        });

        // If there are significant frame drops, consider the page too heavy
        if (frameDrops > 10) {
            heavyLoad = true;
            console.warn("The page is performing poorly on this device.");
            performanceMode()

            // You can show a notification or take other actions here
        }
    });

    observer.observe({ type: "frame", buffered: true });
} else {
    console.warn("PerformanceObserver is not supported in this browser.");
}

// Optionally, monitor memory usage (not fully reliable on all browsers)
setInterval(() => {
    if (performance.memory) {
        const usedJSHeap = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
        const totalJSHeap = performance.memory.totalJSHeapSize / 1048576; // Convert to MB

        if (usedJSHeap > totalJSHeap * 0.9) {
            heavyLoad = true;
            console.warn("High memory usage detected.");


        }
    }
}, 5000); // Check every 5 seconds


let performance_status = false

function performanceMode(nosound) {
    if (performance_status === false) {
        if (!nosound) { aitPlay('performance') }
        setTimeout(function () {
            try {
                $("#background").fadeOut("500")
                document.getElementById("background").remove()

            } catch (error) {
                document.getElementById("background").style.display = 'none'
                document.getElementById("background").remove()
                
            }
            $("#performance-mode").fadeIn('fast')



        }, 3000)
        setTimeout(function () {
            //document.getElementById("self-video-forDisplay").style.visibility = 'hidden'
            //document.getElementById("user-video-forDisplay").style.visibility = 'hidden'
            //$("#more_options_edit").fadeOut("fast")
            //document.getElementById("background").innerHTML = ''
            document.getElementById("opa").style.transform = 'scale(0)'
            setTimeout(function () {
                const bg = 'rgba(106, 121, 255, 0.1)'
                attachAIT(bg)
                document.getElementById("opa").style.transform = 'scale(1)'
            }, 400)



        }, 100)
        performance_status = true
        localStorage.setItem("performance_status", "active")
    }
}

if (localStorage.getItem("performance_status") === "active") {
    performanceMode('nosound')
}

function disablePerformance() {
    if (performance_status === true) {
        aitPlay('performance_off')
        performance_status = false
        localStorage.removeItem("performance_status")
        setTimeout(function () {
            window.location.reload()
        }, 1500)
        
    }
}
document.addEventListener("DOMContentLoaded", () => {
  const gatewayExploreScroll = document.getElementById("container");
  const gatewayActions = document.getElementById("gatewayActions");

  if (!gatewayExploreScroll || !gatewayActions) return;

  let past50 = false;

  function checkScroll() {
    const isPast50 = gatewayExploreScroll.scrollTop >= 10;

    if (isPast50 && !past50) {
      past50 = true;
      gatewayActions.classList.add("back");
    } else if (!isPast50 && past50) {
      past50 = false;
      gatewayActions.classList.remove("back");
    }
  }

  gatewayExploreScroll.addEventListener("scroll", checkScroll, { passive: true });

  // Run once on load in case content is already scrolled (e.g. restored position)
  checkScroll();
});
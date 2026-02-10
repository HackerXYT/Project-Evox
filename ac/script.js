// Temperature Logic
let currentTemp = 24;
const tempDisplay = document.querySelector('.temp-display');

function adjustTemp(amount) {
    currentTemp += amount;
    // Limit temp range for realism
    if (currentTemp > 30) currentTemp = 30;
    if (currentTemp < 16) currentTemp = 16;
    tempDisplay.innerText = currentTemp + "°C";
}

// Power Toggle Logic
let isPowerOn = false;
const toggleKnob = document.getElementById('toggleKnob');
const powerIcon = document.getElementById('powerIcon');

function togglePower(status) {
    isPowerOn = status === 'on';
    if (isPowerOn) {
        toggleKnob.style.left = '25px';
        toggleKnob.style.right = 'unset';
        powerIcon.classList.add('active'); // Turn orange
        powerIcon.style.background = '#f27b40'; // Fallback manual color
    } else {
        toggleKnob.style.left = '2px';
        toggleKnob.style.right = 'unset';
        powerIcon.classList.remove('active');
        powerIcon.style.background = '#666';
    }
}

// Mode Selection Logic
function selectMode(element) {
    // Remove active class from all items
    document.querySelectorAll('.mode-item').forEach(item => {
        item.classList.remove('active');
    });
    // Add active class to clicked item
    element.classList.add('active');
}

// Time Selection Logic
function selectTime(element) {
    document.querySelectorAll('.time-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    element.classList.add('active');
}

// Simple Slider Logic (Click to jump)
const sliderTrack = document.getElementById('sliderTrack');
const sliderFill = document.getElementById('sliderFill');
const sliderThumb = document.getElementById('sliderThumb');

let isDragging = false;

// Function to calculate percentage and update CSS
const updateSlider = (clientX) => {
    const rect = sliderTrack.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    // Constrain between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));

    sliderFill.style.width = `${percentage}%`;
    sliderThumb.style.left = `${percentage}%`;
};

// Start dragging (Mouse & Touch)
const startDragging = (e) => {
    isDragging = true;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    updateSlider(clientX);
};

// Moving (Mouse & Touch)
const moveDragging = (e) => {
    if (!isDragging) return;

    // Prevent scrolling the page while sliding on mobile
    if (e.type.includes('touch')) e.preventDefault();

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    updateSlider(clientX);
};

// Stop dragging
const stopDragging = () => {
    isDragging = false;
};

// Desktop Events
sliderTrack.addEventListener('mousedown', startDragging);
window.addEventListener('mousemove', moveDragging);
window.addEventListener('mouseup', stopDragging);

// Mobile/Touch Events
sliderTrack.addEventListener('touchstart', startDragging, { passive: false });
window.addEventListener('touchmove', moveDragging, { passive: false });
window.addEventListener('touchend', stopDragging);

let storage = {}
document.addEventListener('DOMContentLoaded', () => {
    const lc = {
        username: localStorage.getItem("t50-username"),
        email: localStorage.getItem("t50-email"),
        pswd: localStorage.getItem("t50pswd")
    }
    storage = lc
    console.log("Storage Ready")
    if (lc.username && lc.email && lc.pswd) {
        fetch(`https://data.evoxs.xyz/house?email=${lc.email}&password=${atob(lc.pswd)}&username=${lc.username}&method=ac-login-check`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parses JSON response into native JavaScript objects
            })
            .then(data => {
                if (data.status === 'ok') {
                    console.log('User is logged in');
                    document.getElementById("loadIt").style.opacity = "0"
                    setTimeout(() => {
                        document.getElementById("loadIt").style.display = "none"
                    }, 550);

                    status()
                    setInterval(status, 15000)
                } else {
                    console.log("Access Denied");
                    document.getElementById("loaderAnim").style.display = "none"
                    document.getElementById("goEpsilon").style.display = "flex"
                    document.getElementById("reloadApp").style.display = "flex"
                    document.getElementById("connectText").innerHTML = `Access Denied<br>Credentials are wrong, or you don't own this Evox application.`;
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        console.log("No credentials found in localStorage");
        document.getElementById("loaderAnim").style.display = "none"
        document.getElementById("reloadApp").style.display = "flex"
        document.getElementById("goEpsilon").style.display = "flex"
        document.getElementById("connectText").innerHTML = `You are not logged in.<br>Please login to Evox Epsilon to access this application.`;
    }
});

function status() {
    fetch(`https://data.evoxs.xyz/house?email=${storage.email}&password=${atob(storage.pswd)}&username=${storage.username}&method=ac-login-status`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parses JSON response into native JavaScript objects
        })
        .then(data => {
            console.log(data)
            if (isPowerOn === false && data.message === "ON") {
                togglePower("on")
                isPowerOn = true
            } else {
                isPowerOn = false
                togglePower("off")
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function goEpsilon() {
    window.open("../evox-epsilon-beta", "_blank");
}

function switchPower() {

    fetch(`https://data.evoxs.xyz/house?email=${storage.email}&password=${atob(storage.pswd)}&username=${storage.username}&method=ac-login-toggle`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parses JSON response into native JavaScript objects
        })
        .then(data => {
            console.log(data)
            if (isPowerOn === true) {
                togglePower("off")
            } else {
                togglePower("on")
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
let skipScreen;
function disableRightClick(imageSrc) {
    skipScreen = 0;
    document.addEventListener("contextmenu", function (event) {
        if (skipScreen == 21) return;
        event.preventDefault();
        if (skipScreen > 1) {
            skipScreen = 21;
            EvalertNext({
                "title": "Καλωσόρισες ξανά 👋",
                "description": "Η λειτουργία προγραμματιστή είναι πλέον ενεργή.",
                "buttons": ["Συνέχεια"],
                "buttonAction": [],
                "addons": []
            })
            //document.getElementById("loginContainer").style.display = null
            //document.getElementById("loadText").innerHTML = `Dev Mode Enabled`
            //document.getElementById("loadText").style.opacity = '1'
            //
            //
            //localStorage.setItem("devBypass", "temp")
            //
            //$("#device-warning").fadeOut("fast")
            //$("#hexa").fadeOut('fast')
            //$("#tasks").fadeIn("fast")
            //setTimeout(function () {
            //    document.dispatchEvent(new Event("DOMContentLoaded"));
            //    setTimeout(function () {
            //        localStorage.removeItem("devBypass")
            //    }, 800)
            //}, 700)



        } else {
            skipScreen = 21;
            const img = document.createElement("img");
            img.src = imageSrc;
            img.style.position = "absolute";
            img.style.left = `${event.pageX}px`;
            img.style.top = `${event.pageY}px`;
            img.style.zIndex = "1000";
            img.style.pointerEvents = "none";
            img.style.width = "50px";
            img.style.height = "auto";

            document.body.appendChild(img);
            skipScreen++
            setTimeout(() => img.remove(), 300);
        }

    });
}

//disableRightClick("../evox-epsilon-beta/epsilon-transparent.png");
disableRightClick("assetView-2.png");

function continueSetupAccount(insta_username) {
    //after entering instagram
    $("#setupInstagram").fadeOut(function () {
        const boxUp = document.getElementById("boxUp");
        const currentHeight = boxUp.offsetHeight + 'px';
        boxUpDefaultHeight = currentHeight
        boxUp.style.transition = 'height 1s'; // Adjust the duration as needed
        boxUp.style.height = currentHeight;
        setTimeout(() => {
            boxUp.style.height = '260px';
        }, 10);
        $("#addEmail").fadeIn("fast")

    })
}

function verifyEmail() {
    const input = document.getElementById("voxEmail-input")
    if (input.value === '') {
        return;
    }
    $("#addEmail").fadeOut(function () {
        const boxUp = document.getElementById("boxUp");
        const currentHeight = boxUp.offsetHeight + 'px';
        boxUpDefaultHeight = currentHeight
        boxUp.style.transition = 'height 1s'; // Adjust the duration as needed
        boxUp.style.height = currentHeight;
        setTimeout(() => {
            boxUp.style.height = '260px';
        }, 10);
        $("#verifyEmail").fadeIn("fast")

    })

}

const inputs = document.querySelectorAll('.digitInputs input');

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
        }
    });
});
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

function continueSetupAccount(doServer) {
    //after entering instagram
    const instagramInput = document.getElementById("voxInstagramUsername-input")
    let fetchQuery = ''
    if(doServer === 'save') {
        if(instagramInput.value === '') {
            return;
        }
        fetchQuery = `&instagram=${instagramInput.value}`
    } else {
        //empty
        fetchQuery = `&instagram=rejected-evx`
    }
    fetch(`https://arc.evoxs.xyz/?pin=${pin}&emri=${foundName}&metode=addInstagram${fetchQuery}`)
        .then(response => response.json())
        .then(status => {
            if(status.message === 'Complete') {
                if(loginHasEmail === false) {
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
                } else {
                    autoLogin()
                }
            } else {
                alert("Το PIN άλλαξε κατά την πορεία σύνδεσης, δοκιμάστε να συνδεθείτε ξανά.")
            }
        }).catch(error => {
            console.error("Jeanne D'arc Database is offline.")
           
        });

    
}

let animateTransformSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" width="25px"
                height="25px" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <path fill="#dedede"
                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                        to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                </path>
            </svg>`
function verifyEmail() {
    const input = document.getElementById("voxEmail-input")
    if (input.value === '') {
        return;
    }
    let btnInnerStart = document.getElementById("startBtnEmail").innerHTML
    document.getElementById("startBtnEmail").style.pointerEvents = 'none'
    document.getElementById("startBtnEmail").innerHTML += animateTransformSVG
    fetch(`https://arc.evoxs.xyz/?pin=${pin}&emri=${foundName}&metode=startEmail&email=${input.value}`)
        .then(response => response.json())
        .then(status => {
            document.getElementById("startBtnEmail").innerHTML = btnInnerStart
            document.getElementById("startBtnEmail").style.pointerEvents = ''
            if(status.message === 'Verification Started') {
                
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
            } else if(status.message === 'Email failed.') {
                EvalertNext({
                    "title": "Αποτυχία αποστολής Email",
                    "description": "Ο διακομιστής έχει υπερφορτωθεί και το Email δε μπόρεσε να σταλθεί.<br>Θα χρειαστεί να επιβεβαιώσετε το email σας αργότερα.",
                    "buttons": ["Συνέχεια"],
                    "buttonAction": ["autoLogin()"],
                    "addons": []
                })
            }
        }).catch(error => {
            console.error("Jeanne D'arc Database is offline.")
            EvalertNext({
                    "title": "Αποτυχία αποστολής Email",
                    "description": "Ο διακομιστής έχει υπερφορτωθεί και το Email δε μπόρεσε να σταλθεί.<br>Θα χρειαστεί να επιβεβαιώσετε το email σας αργότερα.",
                    "buttons": ["Συνέχεια"],
                    "buttonAction": ["autoLogin()"],
                    "addons": []
                })
        });
    
}

const inputs = document.querySelectorAll('.digitInputs input');

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        // Check if all inputs are filled
        const allFilled = Array.from(inputs).every(i => i.value.length === 1);
        if (allFilled) {
            completeVerification();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

function completeVerification() {
    const code = Array.from(inputs).map(i => i.value).join('')
    console.log("Code:", code)
    if(code.length !== 6) {
        return;
    }
    let btnInnerStart = document.getElementById("verifyBtnEmail").innerHTML
    document.getElementById("verifyBtnEmail").style.pointerEvents = 'none'
    document.getElementById("verifyBtnEmail").innerHTML += animateTransformSVG
    fetch(`https://arc.evoxs.xyz/?pin=${pin}&emri=${foundName}&metode=verifyEmail&email=${code}`)
        .then(response => response.json())
        .then(status => {
            document.getElementById("verifyBtnEmail").innerHTML = btnInnerStart
            document.getElementById("verifyBtnEmail").style.pointerEvents = ''
            if(status.message === 'Complete') {
                $("#boxUp").fadeOut(function () {
                    $("#welcome").fadeOut("fast")
                    $("#loginContainer").fadeOut("fast")
                    document.getElementById("tasks").classList.remove("fade-out-slide-down")
                    document.getElementById("tasks").style.display = ''
                    autoLogin()
                })
            } else if(status.message === 'Wrong Code') {
                //Notify and retry
                EvalertNext({
                    "title": "Λάθος κωδικός",
                    "description": "Ο κωδικός που πληκτρολογήσατε δεν είναι σωστός.<br>Έλεγξτε ξανά τον κωδικό που στάλθηκε στο email σας και πληκτρολογήστε τον παρακάτω.",
                    "buttons": ["Συνέχεια"],
                    "buttonAction": [],
                    "addons": []
                })
            }
        }).catch(error => {
            console.error("Jeanne D'arc Database is offline.")
        });
}

function showInfoYearbook() {
    EvalertNext({
        title: "Πώς λειτουργεί η επετηρίδα;",
        description: `<spanNormal>
            Η επετηρίδα ξεκινά και περιμένει καταχωρήσεις από τους μαθητές.
            <br><br>
            Όταν <spanBold>οι περισσότεροι έχουν γράψει</spanBold>, θα μπορείτε να δείτε 
            <spanBold>τι έχουν γράψει οι συμμαθητές σας</spanBold>, για <spanBold>εσάς</spanBold> ή για <spanBold>άλλους</spanBold>.
            <br><br>
            Για να δείτε <spanBold>τι έγραψαν οι φίλοι σας</spanBold>, πρέπει να 
            <spanBold>τους ακολουθήσετε</spanBold> και να <spanBold>αποδεχτούν το αίτημά σας</spanBold>.
            <br><br>
            Για να δείτε <spanBold>τι έγραψαν άλλοι για ένα άτομο</spanBold>, χρειάζεται να 
            <spanBold>ακολουθήσετε ξεχωριστά</spanBold> όσους το έχουν <spanBold>αναφέρει</spanBold>.
        </spanNormal>

        `,
        buttons: ["Εντάξει"],
        buttonAction: [],
        addons: [],
        "clouds": true,
        "clouds_data": ["JEANNE-POS_MAIN"]
    });
}

const getRandomNumber = (max = 2100000, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
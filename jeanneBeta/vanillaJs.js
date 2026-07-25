
function returnFromMultimatch() {
    const multimatchElement = document.getElementById("multimatch");
    const topImgElement = document.getElementById("topImg");
    const loginSectionElement = document.getElementById("loginSection");
    const loginButtonElement = document.getElementById("loginButton");

    // Step 1: Remove the active class from multimatch
    multimatchElement.classList.remove("active");

    // Step 2: Start fading out the top image and login section
    topImgElement.style.opacity = '0';
    loginSectionElement.style.opacity = '0';

    // Step 3: Wait for the fade out to finish before changing display properties
    setTimeout(function () {
        topImgElement.style.display = null; // Hide after fade out
        loginSectionElement.style.display = 'block'; // Show the login section
        loginSectionElement.classList.add('active'); // Add active class to login section
        
        // Step 4: Fade in the login section and button
        loginSectionElement.style.opacity = '1'; // Fade in login section

        // Handle login button
        topImgElement.style.opacity = '1'
        loginButtonElement.style.opacity = '0';
        loginButtonElement.style.display = 'block'; // Ensure it's displayed
        setTimeout(() => {
            loginButtonElement.style.opacity = '1'; // Fade in login button
        }, 50); // Short delay to ensure the element is visible before fading in
    }, 500); // Match this duration with your CSS transition duration
}

    function find() {

        document.getElementById("loginSection").classList.remove('active')
        document.getElementById("loginButton").style.opacity = '0'
        setTimeout(function () {
            document.getElementById("topImg").style.opacity = '1'
            setTimeout(function () {

                document.getElementById("loadText").innerText = 'Αναζήτηση..'
                document.getElementById("tasks").style.opacity = '1'
                video.play()
                const searchInput = document.getElementById('nameInput').value; // Replace with any input you want to test
                const matchedNames = findFullNames(searchInput);
                console.log(matchedNames);
                setTimeout(() => {
                    if (matchedNames.length === 0) {
                        document.getElementById("loadText").style.opacity = '0'
                        setTimeout(function () {
                            document.getElementById("loadText").innerText = 'Δεν βρέθηκαν αντιστοιχίες'
                            document.getElementById("loadText").style.opacity = '1'
                        }, 340)

                        document.getElementById("tasks").style.opacity = '1'
                        setTimeout(function () {
                            document.getElementById("tasks").style.opacity = '0'
                            document.getElementById("loginSection").classList.add('active')
                            document.getElementById("loginButton").style.opacity = '1'
                        }, 1000)
                    } else {
                        if (matchedNames.length > 1) {
                            document.getElementById("loadText").style.opacity = '0'
                            setTimeout(function () {
                                document.getElementById("loadText").innerHTML = `Πολλαπλές αντιστοιχίες`
                                document.getElementById("loadText").style.opacity = '1'
                                document.getElementById("loginButton").style.display = 'none'
                                setTimeout(function () {
                                    //document.getElementById("loadText").style.opacity = '0'
                                    document.getElementById("tasks").style.opacity = '0'
                                    setTimeout(function () {
                                        document.getElementById("topImg").style.opacity = '0'
                                        document.getElementById("multimatch").innerHTML = `<p>Επιλέξτε από τα παρακάτω ονόματα</p>`
                                        let count = 0
                                        matchedNames.forEach(name => {
                                            count++
                                            const firstChar = (str) => str.split(' ')[1]?.charAt(0) || null;
                                            document.getElementById("multimatch").innerHTML = `${document.getElementById("multimatch").innerHTML}
                                            <div class="socialUser"><img class="slUserPFP social"
                    src="https://data.evoxs.xyz/profiles?authorize=imagePfp&name=${firstChar(name)}">
                <p>${name}</p><span>Επιλογή</span>
            </div>`
                                            if (count === matchedNames.length) {
                                                document.getElementById("multimatch").innerHTML = `${document.getElementById("multimatch").innerHTML}
                                                <div class="centerLogin">
            <div onclick="returnFromMultimatch()" class="loginButton">Ακύρωση</div>
        </div>`
                                            }

                                        });
                                        setTimeout(function () {
                                            document.getElementById("topImg").style.display = 'none'
                                            document.getElementById("loginSection").style.display = 'none'
                                            document.getElementById("multimatch").classList.add("active")
                                        }, 500)

                                        //document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${matchedNames[0].split(' ')[0].replace(/[σς]+$/, '')}`
                                        //document.getElementById("loadText").style.opacity = '1'
                                        //setTimeout(function () {
                                        //    
                                        //}, 1200)
                                    }, 340)
                                }, 900)
                            }, 340)
                        } else {
                            document.getElementById("loadText").style.opacity = '0'
                            setTimeout(function () {
                                document.getElementById("loadText").innerHTML = `Επιτυχία`
                                document.getElementById("loadText").style.opacity = '1'
                                setTimeout(function () {
                                    document.getElementById("loadText").style.opacity = '0'
                                    setTimeout(function () {
                                        document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${matchedNames[0].split(' ')[0].replace(/[σς]+$/, '')}`
                                        document.getElementById("loadText").style.opacity = '1'
                                        setTimeout(function () {
                                            document.getElementById("topImg").style.opacity = '0'
                                        }, 1200)
                                    }, 340)
                                }, 900)
                            }, 340)
                        }


                    }
                }, 500);

            }, 100)

        }, 500)

    }
    const namesData = {
        "names": {
            "Γρηγόρης Παπαποστόλου": ["Γρηγόρης", "Γρηγορης", "Grigoris", "Παπαποστόλου", "Παπαποστολου", "παπαποστόλου", "Papapostolou"],
            "Ειρήνη Σαλίχου": ["Ειρήνη", "Ειρηνη", "Irini", "Σαλίχου", "σαλίχου", "Salichou"],
            "Φωτεινή Κώστα": ["Φωτεινή", "Φωτεινη", "Fotini", "Κώστα", "Κωστα", "Kosta"],
            "Αριάδνη Γρίβα": ["Αριάδνη", "Αριαδνη", "Ariadni", "Γρίβα", "Γριβα", "Griva"],
            "Ελένη Θεοχαρίδη": ["Ελένη", "Ελενη", "Eleni", "Θεοχαρίδη", "Θεοχαριδη", "Theocharidi"],
            "Μαρίτα Μιλάτου": ["Μαρίτα", "Μαριτα", "Marita", "Μιλάτου", "Μιλατου", "Milatou"],
            "Νικόλας Μαραγκός": ["Νικόλας", "Νικολας", "Nikolas", "Μαραγκός", "Μαραγκος", "Maragkos"],
            "Πέτρος Κωστάλας": ["Πέτρος", "Πετρος", "Petros", "Κωστάλας", "Κωσταλας", "Kostalas"],
            "Τάσος Διμελάς": ["Τάσος", "Τασος", "Tasos", "Διμελάς", "Διμελας", "Dimelas"],
            "Δημοσθένης Μαυρογεώργης": ["Δημοσθένης", "Δημοσθενης", "Dimosthenis", "Μαυρογεώργης", "Μαυρογεωργης", "Mavrogeorgis"],
            "Μαρίνος Πλύττας": ["Μαρίνος", "Μαρινος", "Marinos", "Πλύττας", "Πλυττας", "Plyttas"],
            "Νάσος Τουλούμπας": ["Νάσος", "Νασος", "Nasos", "Τουλούμπας", "Τουλουμπας", "Touloupas"],
            "Ηλίας Παπα": ["Ηλίας", "Ηλιας", "Ilias", "Παπα", "Papa"],
            "Κίμωνας Τσιριγωτάκης": ["Κίμωνας", "Κιμωνας", "Kimonas", "Τσιριγωτάκης", "Τσιριγωτακης", "Tsirigotakis"],
            "Κωσταντίνος Μυλωνάκης": ["Κωσταντίνος", "Κωνσταντίνος", "Kostas", "Μυλωνάκης", "Μυλωνακης", "Mylonakis"],
            "Γιάννης Κολοκυθάς": ["Γιάννης", "Γιαννης", "Giannis", "Κολοκυθάς", "Κολοκυθας", "Kolokythas"],
            "Δημήτρης Τσίρος": ["Δημήτρης", "Δημητρης", "Dimitris", "Τσίρος", "Τσιρος", "Tsiros"],
            "Νικόλας Σωτηρίου": ["Νικόλας", "Νικολας", "Nikolas", "Σωτηρίου", "Σωτηριου", "Sotiriou"],
            "Ηλίας Ράλλης": ["Ηλίας", "Ηλιας", "Ilias", "Ράλλης", "Ραλλης", "Rallis"],
            "Κυριάκος Ουανής": ["Κυριάκος", "Κυριακος", "Kyriakos", "Ουανής", "Ουανης", "Ouanis"],
            "Ταξιάρχης Μιλαπίδης": ["Ταξιάρχης", "Ταξιαρχης", "Taxiarchis", "Μιλαπίδης", "Μιλαπιδης", "Milapidis"],
            "Αίαντας Δενξερω": ["Αίαντας", "Αιαντας", "Aiantas", "Δενξερω", "Denxero"],
            "Γιάννης Καπράλος": ["Γιάννης", "Γιαννης", "Giannis", "Καπράλος", "Καπραλος", "Kapralos"]
        }
    };

    function findFullNames(input) {
        const results = [];
        const variations = Object.values(namesData.names).flat();

        for (const [fullName, nameVariations] of Object.entries(namesData.names)) {
            // Check if the input matches any of the name variations (case insensitive)
            if (nameVariations.some(variation => variation.toLowerCase() === input.toLowerCase())) {
                results.push(fullName);
            }
        }

        return results;
    }

    // Example usage:


    document.addEventListener("DOMContentLoaded", function () {
        if (!localStorage.getItem("jeanDarc_data")) {

        }

        const video = document.getElementById("video");
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(geo => {
                console.log("IP:", geo.ip)
                document.getElementById("loadText").innerText = 'Αναγνωριστικό Έτοιμο'
                document.getElementById("loginContainer").style.opacity = '1'
                setTimeout(function () {
                    document.getElementById("topImg").style.opacity = '1'
                    setTimeout(function () {
                        document.getElementById("loginSection").classList.add('active')
                        document.getElementById("tasks").style.opacity = '0'
                        video.play()
                        setTimeout(function () {
                            let playbackRate = 1.0;

                            const slowDown = setInterval(() => {
                                playbackRate -= 0.1; // Gradually decrease the speed
                                if (playbackRate <= 0.1) {
                                    clearInterval(slowDown);
                                    video.pause(); // Pause when playbackRate is near zero
                                    video.playbackRate = 1.0; // Reset speed for next play
                                } else {
                                    video.playbackRate = playbackRate;
                                }
                            }, 50);
                        }, 2650)
                    }, 100)

                }, 500)



            })
            .catch(error => {
                console.error("IP Api is offline, ignoring")
                console.log('Error:', error);
            });
    });

    document.getElementById('nameInput').addEventListener('focus', function () {
        video.playbackRate = 1.0; // Ensure normal speed on play
        video.play();


    });

    document.getElementById('nameInput').addEventListener('blur', function () {
        let playbackRate = 1.0;

        const slowDown = setInterval(() => {
            playbackRate -= 0.1; // Gradually decrease the speed
            if (playbackRate <= 0.1) {
                clearInterval(slowDown);
                video.pause(); // Pause when playbackRate is near zero
                video.playbackRate = 1.0; // Reset speed for next play
            } else {
                video.playbackRate = playbackRate;
            }
        }, 50);


    });

    document.getElementById('nameInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            find()
        }
    })



    ////
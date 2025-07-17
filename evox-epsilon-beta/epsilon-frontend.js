if (localStorage.getItem("currentSrv")) {
    srv = localStorage.getItem("currentSrv")
    //alert(`Switch server to ${srv}`)
} else {
    localStorage.setItem("currentSrv", "https://data.evoxs.xyz")
    srv = "https://data.evoxs.xyz"
}

//alert(srv)

function setNetworkStatus(what) {
    return;
    if (what === "on") {
        $("#offlineStatus").fadeOut("fast")
        $("#onlineStatus").fadeIn("fast")
    } else if (what === "off") {
        $("#onlineStatus").fadeOut("fast")
        $("#offlineStatus").fadeIn("fast")
    }
}

setInterval(function () {
    if (navigator.onLine) {
        $("#offlineStatus").fadeOut("fast", function () {
            //$("#onlineStatus").fadeIn("fast")
        })

    } else {
        $("#onlineStatus").fadeOut("fast", function () {
            $("#offlineStatus").fadeIn("fast")
        })

    }
}, 1000)

function shake_me(what) {
    document.getElementById(`${what}`).classList.add('shake');
    setTimeout(function () {
        document.getElementById(`${what}`).classList.remove('shake');
    }, 500);
}

let showTime = 0; //miliseconds
function warn(message) {
    const oldhtml = document.getElementById("notification-span").innerHTML
    var notification = document.getElementById('notification');
    if (notification.className.includes("show")) {
        console.log("Notification Is Shown")
        if (showTime !== 0) {
            const waitTime = 2500 - showTime
            setTimeout(function () {
                notification.classList.remove('show');
                setTimeout(function () {
                    document.getElementById("notification-span").innerHTML = message
                    notification.classList.add('show');
                    setTimeout(function () {
                        notification.classList.remove('show');
                    }, 2500);
                }, 500)

            }, waitTime)
        }
    } else {
        document.getElementById("notification-span").innerHTML = message
        notification.classList.add('show');
        const saveShowTime = setInterval(function () {
            showTime = showTime + 1
        }, 1)
        setTimeout(function () {
            notification.classList.remove('show');
            clearInterval(saveShowTime)
            showTime = 0
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[EE] Event Listener Registered");

    // Event listener for scroll events on the window
    window.addEventListener("scroll", () => {
        // Get the scroll position of the document
        const scrollPosition = window.scrollY || window.pageYOffset;

        //console.log('Scroll position:', scrollPosition);

        // Check if the scroll position is at the top
        if (isProfileTabActive === true) {
            return;
        }
        if (scrollPosition === 0) {
            //console.log('User has scrolled back to the top.');
            document.getElementById("gatewayActions").classList.remove('back')
        } else {
            //console.log('User is scrolling down.');
            if (scrollPosition >= 22) {
                document.getElementById("gatewayActions").classList.add('back')
            } else {
                document.getElementById("gatewayActions").classList.remove('back')
            }
        }
    });
    //document.getElementById("downloading-icon").classList.add("active")
    //$("#downloading-icon").fadeIn("fast");

    const soundsStatus = localStorage.getItem("epsilonSounds")
    if (soundsStatus === 'false') {
        document.getElementById("sounds-status").innerText = 'Off'
    } else if (!soundsStatus || soundsStatus === 'true') {
        document.getElementById("sounds-status").innerText = 'On'
    }
});

//if (!window.location.href.includes("https")) {
//    if (window.location.href.includes("192")) {
//        if (!srv.includes("40:")) {
//            alert("Welcome to Dev Mode, Switching to local bridge")
//            localStorage.setItem("currentSrv", "http://192.168.1.40:4000")
//            srv = "http://192.168.1.40:4000"
//        }
//    }
//}
//Removing to make debug better


function restart() {
    window.location.reload()
}
function clientVerified() {
    if (ip !== 'error' || blockMoves === true) {
        const username = localStorage.getItem("t50-username")
        const email = localStorage.getItem("t50-email")
        const password = atob(localStorage.getItem("t50pswd"))
        if (new URLSearchParams(new URL(window.location.href).search).has('showProfile')) {
            const username = new URLSearchParams(new URL(window.location.href).search).get('showProfile')
            console.log("The parameter exists");



            fetch(`${srv}/accounts?method=getemailbyusername&username=${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    if (data === 'none') {
                        console.log("Requested account doesnt exist")
                        document.getElementById("user-profile").classList.remove('active')
                        document.getElementById("accountUserProfileUsername").innerText = username
                        document.getElementById("showProfileError").style.display = 'block'
                        document.getElementById("acceptRequest").style.opacity = '0'
                    } else {
                        showFriend(null, username, true)
                        document.getElementById("user-profile").classList.add('active')
                        document.getElementById("userProfile-back").style.display = 'none'
                        document.getElementById("addFriend").style.display = 'none'
                        document.getElementById("acceptRequest").style.opacity = '0'

                    }
                }).catch(error => {
                    console.error('Server Connection Failed!', error)
                })

            loadBackground()
            $("#loading-text").fadeOut("fast")
            return;
        }
        if (username && email && password) {
            console.log("Returning User.")
            //Check for jeanDarc Parameters
            const params = new URLSearchParams(window.location.search);
            if (params.has('jeanDarc')) {
                const value = params.get('jeanDarc');
                if (value === 'redaktoni') {
                    window.location.href = `https://arc.evoxs.xyz?metode=redaktoni&password=${btoa(password)}`
                    return;
                }
            }
            //$("#bggradient").fadeIn("slow")
            loadBackground()
            fetch(`${srv}/accounts?email=${email}&password=${password}&autologin=true&ip=${ip}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    ////setNetworkStatus('on')
                    if (data.includes("Credentials Correct")) {
                        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
                        const serverEmail = data.match(emailRegex);

                        if (serverEmail) {
                            console.log('Server Email:', serverEmail[0]);
                            if (serverEmail !== serverEmail[0]) {
                                console.log("Local Email Doesn't Match Server. Changing..")
                                localStorage.setItem("t50-email", serverEmail[0])
                            }
                        }
                        verificationComplete()
                    } else if (data.includes("IP Not Verified")) {
                        console.log("Account Verified But IP is Unknown")
                        fetch(`${srv}/authip?method=Eforceadd&email=${email}&username=${username}&password=${password}&ip=${ip}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then(data => {
                                ////setNetworkStatus('on')
                                if (data === "Complete") {
                                    verificationComplete()
                                } else if (data === "Exists") {
                                    verificationComplete()
                                } else {
                                    notice(`Authorization IP Ops Failed`)
                                }
                            }).catch(error => {
                                //setNetworkStatus('off')
                                console.error('Fetch error:', error);
                            });
                    } else {
                        console.log("Credentials Incorrect. Resetting")
                        localStorage.removeItem("t50-email")
                        localStorage.removeItem("t50pswd")
                        localStorage.removeItem("t50-username")
                        clientVerified()
                    }
                }).catch(error => {
                    //setNetworkStatus('off')
                    //pickRandFromDict('offline')
                    warn("Server Connection Failed. Running Offline")
                    verificationComplete()


                    console.error('Server Connection Failed!', error)
                })
            //Check for any newSentRequests Updates
            fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&todo=sentRequests`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(sent_req => {
                    if (sent_req !== "None") {
                        localStorage.setItem(`${localStorage.getItem("t50-username")}-sentRequests`, sent_req)
                    }
                }).catch(error => {
                    console.error(error);
                });
        } else {
            console.log("New User.")
            let isIpLoginVerified = false;
            let ipMatches = null;
            fetch(`${srv}/authip?method=matchAcc&ip=${ip}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.matches !== "") {
                        isIpLoginVerified = true
                        ipMatches = data
                    }
                    console.log("IP Login Ready")
                }).catch(error => {
                    //setNetworkStatus('off')
                    console.error('Fetch error:', error);
                });
            fetch(`${srv}/accounts`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    ////setNetworkStatus('on')
                    //data is not used, a simple response is fine
                    console.log('%c' + "Server Online!", `color: green; font-size: 16px; font-weight: normal;`)
                    //$("#bggradient").fadeIn("slow")
                    loadBackground()
                    $("#loading-text").fadeOut("fast")

                    $("#connectionContainer").fadeIn("slow", function () {
                        document.getElementById("epsilonLogoLogin").style.top = "18%"
                        document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"
                        document.getElementById("headerVox").classList.add('active')
                        if (isIpLoginVerified) {
                            document.getElementById("loginVox").onclick = function () {
                                beginLogin('ipLogin', ipMatches)
                            }
                        }

                        setTimeout(function () {
                            document.getElementById("optionsVox").classList.add('active')
                        }, 100)
                    })
                })
                .catch(error => {
                    //setNetworkStatus('off')
                    notice("Oh Snap! Evox Is Offline.<br>Please Retry Later.")

                    console.error('Fetch error:', error);
                });

        }

    } else {
        if (ip !== 'error') {
            notice("IP Verification Failed!")
        }

    }
}


var welcomeToEvox = new Howl({
    src: ['./welcomeToEvox.mp3'],
    volume: 1
});

var successLogin = new Howl({
    src: ['./success.mp3'],
    volume: 1
});

var startup = new Howl({
    src: ['./startup.mp3'],
    volume: 1
})

function attachMatchingUser(matches) {
    if (matches) {
        beginLogin('ipLogin', null, matches.specific)
    } else {
        warn("An error occured! attachMatchingUser Function is not updated.")
    }

}

function beginLogin(ipLogin, matches, username) {
    if (ipLogin && matches) {
        startup.play()
        document.getElementById("beginLoginBtnIP").innerHTML = `Login as ${matches.specific}`
        document.getElementById("beginLoginBtnIP").onclick = function () {
            attachMatchingUser(matches)
        }
        document.getElementById("matchUser").innerHTML = matches.specific
        loadPFPget(matches.specific)
            .then(profileImage => {
                document.getElementById("matchPfp").src = profileImage;
            }).catch(error => {
                //setNetworkStatus('off')
                console.error(error);
            });
        fetch(`${srv}/accounts?method=getemailbyusername&username=${matches.specific}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(user_email => {
                fetch(`${srv}/accounts?email=${user_email}&username=${matches.specific}&method=last_login`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(last_login => {
                        sessionStorage.setItem("matchingUser", JSON.stringify({ 'username': matches.specific, 'email': user_email, 'last_login': last_login }))
                        if (last_login !== 'Unknown') {
                            document.getElementById("self-ip-lastlogin").innerText = formatTimeDifference(last_login) + " ago"
                        } else {
                            document.getElementById("self-ip-lastlogin").style.display = 'none'
                        }

                    }).catch(error => {
                        console.log("User Load Last Login Failed [3]:", error)
                    })
            }).catch(error => {
                console.log("User Load Last Login Failed [3]:", error)
            })
        document.getElementById("epsilonLogoLogin").style.top = "200px"
        document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"

        document.getElementById("headerVox").classList.remove('active')
        document.getElementById("optionsVox").classList.remove('active')
        setTimeout(function () {
            document.getElementById("formLoginByIP").style.display = 'flex'
            setTimeout(function () {

                document.getElementById("formLoginByIP").classList.add('active')
                setTimeout(function () {
                    aitPlay('welcome_back_loginByIp')
                }, 500)
                //document.getElementById("formLogin").style.paddingBottom = "100px"
            }, 50)
        }, 920)

    } else {
        if (ipLogin) {
            document.getElementById("formLoginByIP").classList.remove('active')
            if (sessionStorage.getItem("matchingUser")) {
                const valJ = JSON.parse(sessionStorage.getItem("matchingUser"))
                document.getElementById("voxEmail").value = valJ.email
                document.getElementById("credEmail").style.display = 'none'
            } else {
                warn("Sorry, IP Login failed.")
            }

        } else {
            startup.play()
        }

        document.getElementById("epsilonLogoLogin").style.top = "200px"
        document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"

        document.getElementById("headerVox").classList.remove('active')
        document.getElementById("optionsVox").classList.remove('active')
        setTimeout(function () {
            document.getElementById("formLogin").style.display = 'flex'
            document.getElementById("formLoginByIP").style.display = 'none'
            setTimeout(function () {

                document.getElementById("formLogin").classList.add('active')
                //document.getElementById("formLogin").style.paddingBottom = "100px"
            }, 50)
        }, 920)
    }



    //setTimeout(function() {
    //  $("#createVox").fadeOut("fast")
    //  $("#loginVox").fadeOut("fast")
    //  $("#trademarkVox").fadeOut("fast")
    //}, 1000)

    //setTimeout(function () {
    //  document.getElementById("optionsVox").classList.add('active')
    //}, 100)


}

function returnToLoginMenu(nosound) {
    if (!nosound) {
        aitPlay('mind_changed')
    }

    document.getElementById("formLogin").classList.remove('active')
    setTimeout(function () {
        document.getElementById("formLogin").style.display = 'none'
        setTimeout(function () {
            document.getElementById("epsilonLogoLogin").style.top = "18%"
            document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"
            document.getElementById("headerVox").classList.add('active')
            setTimeout(function () {
                document.getElementById("optionsVox").classList.add('active')
            }, 100)

        }, 50)
    }, 920)
}

function normalLogin() {
    aitPlay("unexpected")
    document.getElementById("voxEmail").value = ''
    document.getElementById("formLoginByIP").classList.remove('active')
    document.getElementById("epsilonLogoLogin").style.top = "200px"
    document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"

    document.getElementById("headerVox").classList.remove('active')
    document.getElementById("optionsVox").classList.remove('active')
    setTimeout(function () {
        document.getElementById("formLogin").style.display = 'flex'
        document.getElementById("formLoginByIP").style.display = 'none'
        setTimeout(function () {

            document.getElementById("formLogin").classList.add('active')
            //document.getElementById("formLogin").style.paddingBottom = "100px"
        }, 50)
    }, 920)
}

async function deleteAllCookiesAsync() {
    return new Promise((resolve, reject) => {
        try {
            // Get all cookies for the current document
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
                // Get the cookie name
                const cookieName = cookie.split("=")[0];
                // Set the cookie's expiration date to the past
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
            resolve('All cookies deleted successfully!');
        } catch (error) {
            reject('Error deleting cookies: ' + error);
        }
    });
}

function logOut() {
    let userResponse = confirm("Are you sure you want to logout?");

    // Check the user's response
    if (userResponse) {
        aitPlay('signing_out')
        // OK was clicked
        console.log("User clicked OK");
        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Hide settings or perform any UI changes
        document.getElementById("gateway").style.opacity = '0'
        setTimeout(function () {
            document.getElementById("gateway").style.display = 'none'
        }, 200)
        document.getElementById("settings").classList.remove("active")
        document.getElementById("gatewayExploreScroll").style.transform = ''
        document.getElementById("gatewayExploreScroll").style.filter = ''
        $("#clearContainer").fadeIn("fast")


        setTimeout(function () {
            new Promise((resolve, reject) => {
                if ('serviceWorker' in navigator) {
                    // Unregister service workers
                    navigator.serviceWorker.getRegistrations().then(function (registrations) {
                        console.log('Fetched service worker registrations:', registrations);
                        if (registrations.length === 0) {
                            console.log('No service workers to unregister.');
                            resolve(); // Resolve immediately if no registrations
                            return;
                        }
                        let unregisterPromises = registrations.map(registration => registration.unregister());
                        return Promise.all(unregisterPromises);
                    }).then(function (results) {
                        console.log('Service worker unregistration results:', results);
                        results.forEach((success, index) => {
                            if (success) {
                                console.log(`Service Worker ${index} unregistered successfully.`);
                            } else {
                                console.log(`Service Worker ${index} unregistration failed.`);
                            }
                        });
                        // Proceed to unsubscribe from push notifications
                        return navigator.serviceWorker.ready;
                    }).then(function (registration) {
                        console.log('Service worker is ready:', registration);
                        return registration.pushManager.getSubscription();
                    }).then(function (subscription) {
                        if (subscription) {
                            console.log('Push subscription found:', subscription);
                            return subscription.unsubscribe().then(function (successful) {
                                if (successful) {
                                    console.log('Push notifications unsubscribed successfully.');
                                } else {
                                    console.log('Push notifications unsubscription failed.');
                                }
                                resolve();  // Resolve after successful unsubscribe
                            }).catch(function (error) {
                                console.error('Error unsubscribing from push notifications:', error);
                                resolve();  // Resolve even if there was an error
                            });
                        } else {
                            console.log('No push notifications subscription found.');
                            resolve();  // Resolve if no subscription exists
                        }
                    }).catch(function (error) {
                        console.error('Error during service worker operations:', error);
                        resolve();  // Resolve even if there was an error
                    });
                } else {
                    console.log('Service workers are not supported in this browser.');
                    resolve(); // Resolve immediately if service workers are not supported
                }
            }).then(() => {
                // Reload the window after all operations are done
                console.log('All operations completed, clearing cookies cache.');
                deleteAllCookiesAsync()
                    .then(message => window.location.reload())
                    .catch(error => console.error(error));

            }).catch(function (error) {
                console.error('An error occurred during the cleanup process:', error);
                window.location.reload();  // Ensure the window reloads even if there's an error
            });
        }, 3500)


    } else {
        // Cancel was clicked
        console.log("User clicked Cancel");
    }
}

const voxPasswordInput = document.getElementById('voxPassword');
const voxEmailInput = document.getElementById('voxEmail');
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
  <path d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                              viewBox="0 0 24 24" fill="none">
                              <path
                                  d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                                  stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>`
const eyeShown = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
  <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
let iconState = 'default'
// Add an event listener for the 'input' event
voxPasswordInput.addEventListener('input', function (event) {
    //console.log('Typed value:', event.target.value);
    if (event.target.value !== "") {
        if (iconState === 'eye') {
            return;
        }
        if (isPswdShown === true) {
            iconState = 'eye'
            document.getElementById("eyeIcon").style.opacity = "0"
            setTimeout(function () {
                document.getElementById("eyeIcon").innerHTML = eyeShown
                document.getElementById("eyeIcon").style.opacity = "1"
            }, 400)
        } else {
            iconState = 'eye'
            document.getElementById("eyeIcon").style.opacity = "0"
            setTimeout(function () {
                document.getElementById("eyeIcon").innerHTML = eyeIcon
                document.getElementById("eyeIcon").style.opacity = "1"
            }, 400)
        }

    } else {
        iconState = 'default'
        document.getElementById("eyeIcon").style.opacity = "0"
        setTimeout(function () {
            document.getElementById("eyeIcon").innerHTML = lockIcon
            document.getElementById("eyeIcon").style.opacity = "1"
        }, 400)
    }
});

voxEmailInput.addEventListener('input', function (event) {
    //console.log('Typed value:', event.target.value);
    if (event.target.value === "") {
        document.getElementById("welcomeText").style.opacity = "0"
        setTimeout(function () {
            document.getElementById("welcomeText").innerHTML = `Login`
            document.getElementById("welcomeText").style.opacity = "1"
        }, 400)
    }
});

let isPswdShown = false

function showPasswd() {
    if (iconState === 'eye' && !isPswdShown) {
        document.getElementById("eyeIcon").style.opacity = "0"
        setTimeout(function () {
            document.getElementById("eyeIcon").innerHTML = eyeShown
            document.getElementById("eyeIcon").style.opacity = "1"
        }, 400)
        voxPasswordInput.type = 'text'
        isPswdShown = true
    } else if (isPswdShown) {
        document.getElementById("eyeIcon").style.opacity = "0"
        setTimeout(function () {
            document.getElementById("eyeIcon").innerHTML = eyeIcon
            document.getElementById("eyeIcon").style.opacity = "1"
        }, 400)
        voxPasswordInput.type = 'password'
        isPswdShown = false
    }
}

voxEmailInput.addEventListener('blur', function () {
    console.log('Input has lost focus.');
    document.getElementById("emailIcon").style.opacity = "0"
    setTimeout(function () {
        document.getElementById("emailIcon").innerHTML = `
          <svg version="1.1" width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
              y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <path fill="#fff"
                  d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                  <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                      to="360 25 25" dur="0.6s" repeatCount="indefinite" />
              </path>
          </svg>
      `
        document.getElementById("emailIcon").style.opacity = "1"
        fetch(`${srv}/accounts?method=getUserbyEmail&email=${document.getElementById('voxEmail').value}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(matchedUser => {
                ////setNetworkStatus('on')
                if (matchedUser !== "Account Not Found" && !matchedUser.includes("Something Went Wrong")) {
                    document.getElementById("emailIcon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                              viewBox="0 0 24 24" fill="none">
                              <g id="style=stroke">
                                  <g>
                                      <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd"
                                          d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                                          fill="#fff" />
                                      <path id="vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd"
                                          d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                                          fill="#fff" />
                                  </g>
                              </g>
                          </svg>`
                    document.getElementById("welcomeText").style.opacity = "0"
                    setTimeout(function () {
                        document.getElementById("welcomeText").innerHTML = `Hello, ${matchedUser}`
                        document.getElementById("welcomeText").style.opacity = "1"
                    }, 400)
                } else {
                    if (document.getElementById("welcomeText").innerHTML.includes('Hello')) {
                        document.getElementById("welcomeText").style.opacity = "0"
                        setTimeout(function () {
                            document.getElementById("welcomeText").innerHTML = `Login`
                            document.getElementById("welcomeText").style.opacity = "1"
                        }, 400)
                    }
                    document.getElementById("emailIcon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                              viewBox="0 0 24 24" fill="none">
                              <g id="style=stroke">
                                  <g>
                                      <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd"
                                          d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                                          fill="#fff" />
                                      <path id="vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd"
                                          d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                                          fill="#fff" />
                                  </g>
                              </g>
                          </svg>`
                }

            }).catch(error => {
                //setNetworkStatus('off')
                console.error(error);
            });
    }, 400)

});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function startLogin() {
    document.getElementById("beginLoginBtn").innerHTML = `<svg version="1.1" width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
              y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <path fill="#fff"
                  d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                  <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                      to="360 25 25" dur="0.6s" repeatCount="indefinite" />
              </path>
          </svg>`
    const email = document.getElementById('voxEmail').value
    const password = document.getElementById('voxPassword').value
    if (email !== '' && password !== '') {
        console.log("Front Accepted")

        const url = `${srv}/accounts?email=${email}&password=${password}&ip=${localStorage.getItem("IPV4")}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                ////setNetworkStatus('on')
                document.getElementById("beginLoginBtn").innerHTML = `Login`

                var wind = new URL(window.location.href);
                var ext = wind.searchParams.get("id");
                console.log(data);
                if (data.includes("Do 2FA")) {
                    if (data.includes("Email")) {
                        var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

                        // Extract email using match() method
                        email = data.match(emailRegex);
                        console.log("Ext Email:", email)
                    }
                    localStorage.getItem("2FA_READY", "false")

                    const credentialsString = data;
                    const match = credentialsString.match(/Username:(\w+)/);

                    const username = match && match[1];
                    const jsondata = {
                        "username": username,
                        "email": email,
                        "password": password
                    }
                    sessionStorage.setItem("ACCOUNT_DATA", JSON.stringify(jsondata))
                    welcomeToEvox.play()

                    document.getElementById("formLogin").classList.remove('active')
                    setTimeout(function () {
                        document.getElementById("formLogin").style.display = 'none'
                        document.getElementById("form2FA").style.display = 'flex'
                        setTimeout(function () {
                            document.getElementById("epsilonLogoLogin").style.top = "50%"
                            document.getElementById("epsilonLogoLogin").style.transform = "translate(-50%, -50%)"
                            document.getElementById("form2FA").classList.add('active')

                        }, 50)
                    }, 920)
                    //$("#EvoxMerge").fadeOut("fast")
                    //$("#container").fadeOut("slow")
                    //$("#2fa").fadeIn("slow")
                    return;
                }
                if (data.includes("Credentials Correct")) {
                    successLogin.play()
                    if (data.includes("Email")) {
                        var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

                        // Extract email using match() method
                        email = data.match(emailRegex);
                        console.log("Ext Email:", email)
                    }
                    if (sessionStorage.getItem("clearafter")) {
                        localStorage.clear()
                    }

                    if (ext) {
                        fetch(`${srv}/evoxApp?method=assignAccount&id=${ext}&email=${email}&password=${password}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then(data => {
                                ////setNetworkStatus('on')
                                if (data === "Complete") {
                                    //window.close()
                                    window.location.href = "ext-ready.html"
                                }
                                return;

                            }).catch(error => {
                                //setNetworkStatus('off')
                                console.error('Fetch error:', error);
                            });
                        //send to dc that id matches to acc email
                    }
                    console.log("Welcome Abroad")

                    localStorage.setItem("2fa_status", "On")
                    localStorage.setItem("t50pswd", `${btoa(password)}`)
                    const credentialsString = data;
                    const match = credentialsString.match(/Username:(\w+)/);
                    const username = match && match[1];
                    localStorage.setItem("t50-email", email)
                    if (!sessionStorage.getItem("autolg_off")) {
                        localStorage.setItem("t50-autologin", true)
                    } else {
                        localStorage.setItem("t50-autologin", false)
                    }
                    localStorage.setItem("t50-username", username)
                    sessionStorage.setItem("loaded", true)
                    sessionStorage.setItem("loggedin", email)
                    sessionStorage.setItem("loggedinpswd", btoa(password))
                    if (localStorage.getItem("restart-for-florida")) {
                        console.log("Florida Override!")
                        localStorage.removeItem("restart-for-florida")
                        localStorage.setItem("t50-autologin", true)
                        localStorage.setItem("remove-autolg", true)
                        restart()
                        return;
                    }
                    returnToLoginMenu('nosound')
                    localStorage.removeItem("aitAnalytics")
                    loadAit()
                    getOasaInfo()
                    setTimeout(function () {
                        $("#connectionContainer").fadeOut("fast")
                        verificationComplete()
                        aitPlay('beta_intro')
                    }, 1000)
                    loadProfile()
                    PWACheck()

                    //FloridaRun()
                    console.log("Registering Service Worker..")
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.register('./epsilon-serviceWorker.js')
                            .then(registration => {
                                console.log('Service Worker registered with scope:', registration.scope);
                            })
                            .catch(error => {
                                console.error('Service Worker registration failed:', error);
                            });
                    }

                    const params = new URLSearchParams(window.location.search);
                    if (params.has('jeanDarc')) {
                        const value = params.get('jeanDarc');
                        if (value === 'redaktoni') {
                            window.location.href = `https://arc.evoxs.xyz?metode=redaktoni&password=${btoa(password)}`
                            return;
                        }
                    }
                } else if (data === "Credentials Incorrect") {
                    shake_me("voxPassword")
                    //fadeError("2")
                    console.log("Wrong Email/Password")
                    email = ""
                    password = ""
                } else if (data === "Account Doesn't Exist") {
                    if (email === "" || password === "") {

                    } else {
                        shake_me("voxEmail")
                    }

                    console.log("Doesn't Exist")
                    email = ""
                } else if (data === "Disabled") {

                    alert("Your account has been disabled by Evox. Please contact admins.")
                    shake_me("voxEmail")
                    //fadeError("1")
                    //document.getElementById("email").value = ""
                    //document.getElementById("password").value = ""
                }
            })
            .catch(error => {
                //setNetworkStatus('off')
                document.getElementById("beginLoginBtn").innerHTML = `Login Failed`
                console.error('Fetch error:', error);
            });
    } else {
        document.getElementById("beginLoginBtn").innerHTML = `Login`
    }
}

const emailElemInput = document.getElementById('voxEmail');

// Add an event listener for the 'keydown' event
emailElemInput.addEventListener('keydown', function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        // Your code to execute when Enter is pressed
        console.log('Enter key was pressed!');
        document.getElementById('voxPassword').focus();
    }
});
document.getElementById('voxPassword').addEventListener('keydown', function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        // Your code to execute when Enter is pressed
        console.log('Enter key was pressed! [PASS]');
        startLogin()
    }
});

function on2FAComplete() {
    const num1 = document.getElementById("2faIn1").value
    const num2 = document.getElementById("2faIn2").value
    const num3 = document.getElementById("2faIn3").value
    const num4 = document.getElementById("2faIn4").value
    const num5 = document.getElementById("2faIn5").value
    const num6 = document.getElementById("2faIn6").value
    const otp_2fa = num1 + num2 + num3 + num4 + num5 + num6


    let info = sessionStorage.getItem("ACCOUNT_DATA")
    const account = JSON.parse(info)
    let email = account.email
    let username = account.username
    let password = account.password
    let code = otp_2fa
    //let dig1 = document.getElementById("dig1").value
    //let dig2 = document.getElementById("dig2").value
    //let dig3 = document.getElementById("dig3").value
    //let dig4 = document.getElementById("dig4").value
    //let dig5 = document.getElementById("dig5").value
    //let dig6 = document.getElementById("dig6").value
    //let code = `${dig1}${dig2}${dig3}${dig4}${dig5}${dig6}`
    //console.log("Just to verify:\n", email, username, password, code)
    document.getElementById("form2FA").style.paddingBottom = '0'
    fetch(`${srv}/authip?method=Eadd&email=${email}&username=${username}&password=${password}&code=${code}&ip=${localStorage.getItem("IPV4")}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            ////setNetworkStatus('on')
            if (data === "Complete") {
                successLogin.play()
                var wind = new URL(window.location.href);
                var ext = wind.searchParams.get("id");
                if (ext) {
                    fetch(`${srv}/evoxApp?method=assignAccount&id=${ext}&email=${email}&password=${password}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(data => {
                            ////setNetworkStatus('on')
                            if (data === "Complete") {
                                //window.close()
                                window.location.href = "ext-ready.html"
                            }
                            return;

                        }).catch(error => {
                            //setNetworkStatus('off')
                            console.error('Fetch error:', error);
                        });
                    //send to dc that id matches to acc email
                }
                //$("#2fa").fadeOut("slow")

                document.getElementById("form2FA").classList.remove('active')
                setTimeout(function () {
                    document.getElementById("form2FA").style.display = 'none'
                    setTimeout(function () {
                        document.getElementById("epsilonLogoLogin").style.top = "18%"
                        document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"
                    }, 50)
                }, 920)

                console.log("All Done")
                if (sessionStorage.getItem("clearafter")) {
                    localStorage.clear()
                }

                localStorage.setItem("t50pswd", `${btoa(password)}`)
                sessionStorage.removeItem("ACCOUNT_DATA")
                sessionStorage.setItem("2FA_READY", "true")
                localStorage.setItem("t50-email", email)
                if (!sessionStorage.getItem("autolg_off")) {
                    localStorage.setItem("t50-autologin", true)
                } else {
                    localStorage.setItem("t50-autologin", false)
                }
                localStorage.setItem("t50-username", username)
                sessionStorage.setItem("loaded", true)
                sessionStorage.setItem("loggedin", email)
                sessionStorage.setItem("loggedinpswd", btoa(password))
                localStorage.setItem("2fa_status", "On")
                $("#connectionContainer").fadeOut("fast")
                loadProfile()
                verificationComplete()
                localStorage.removeItem("aitAnalytics")

                loadAit()
                setTimeout(function () {
                    aitPlay('beta_intro')
                }, 1000)
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('./epsilon-serviceWorker.js')
                        .then(registration => {
                            console.log('Service Worker registered with scope:', registration.scope);
                        })
                        .catch(error => {
                            console.error('Service Worker registration failed:', error);
                        });
                }
                PWACheck()
                getOasaInfo()
                const params = new URLSearchParams(window.location.search);
                if (params.has('jeanDarc')) {
                    const value = params.get('jeanDarc');
                    if (value === 'redaktoni') {
                        window.location.href = `https://arc.evoxs.xyz?metode=redaktoni&password=${btoa(password)}`
                        return;
                    }
                }
            } else if (data === "Exists") {
                successLogin.play()
                document.getElementById("form2FA").classList.remove('active')
                setTimeout(function () {
                    document.getElementById("form2FA").style.display = 'none'
                    setTimeout(function () {
                        document.getElementById("epsilonLogoLogin").style.top = "18%"
                        document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"
                    }, 50)
                }, 920)
                console.log("IP Ready")
                localStorage.setItem("t50pswd", `${btoa(password)}`)
                sessionStorage.removeItem("ACCOUNT_DATA")
                sessionStorage.setItem("2FA_READY", "true")
                localStorage.setItem("t50-email", email)
                if (!sessionStorage.getItem("autolg_off")) {
                    localStorage.setItem("t50-autologin", true)
                } else {
                    localStorage.setItem("t50-autologin", false)
                }
                localStorage.setItem("t50-username", username)
                sessionStorage.setItem("loaded", true)
                sessionStorage.setItem("loggedin", email)
                sessionStorage.setItem("loggedinpswd", btoa(password))
                localStorage.setItem("2fa_status", "On")
                $("#connectionContainer").fadeOut("fast")
                verificationComplete()
                loadAit()
                setTimeout(function () {
                    aitPlay('beta_intro')
                }, 1000)
                PWACheck()
                getOasaInfo()
                const params = new URLSearchParams(window.location.search);
                if (params.has('jeanDarc')) {
                    const value = params.get('jeanDarc');
                    if (value === 'redaktoni') {
                        window.location.href = `https://arc.evoxs.xyz?metode=redaktoni&password=${btoa(password)}`
                        return;
                    }
                }
            } else if (data === "Wrong Code") {
                //shake_me("ver_code")
                document.getElementById("form2FA").style.paddingBottom = '50px'
                document.getElementById("2faIn1").value = ""
                document.getElementById("2faIn2").value = ""
                document.getElementById("2faIn3").value = ""
                document.getElementById("2faIn4").value = ""
                document.getElementById("2faIn5").value = ""
                document.getElementById("2faIn6").value = ""
                document.getElementById("2faIn1").focus()
            } else {
                console.error("Client ip is strange")
            }
            //IF IP EXISTS THEN DONT REQUIRE 2FA, ELSE REQUIRE 2FA
        }).catch(error => {
            //setNetworkStatus('off')
            console.error('Fetch error:', error);
        });
}

document.querySelectorAll('.boxPut input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1) {
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else {
                // Check if all inputs are filled
                if ([...inputs].every(input => input.value.length === 1)) {
                    on2FAComplete();
                }
            }
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
            inputs[index - 1].focus();
        }
    });
});

function returnToLoginMenuBy2fa() {
    document.getElementById("form2FA").classList.remove('active')
    setTimeout(function () {
        document.getElementById("form2FA").style.display = 'none'
        setTimeout(function () {
            document.getElementById("epsilonLogoLogin").style.top = "18%"
            document.getElementById("epsilonLogoLogin").style.transform = "translateX(-50%)"
            returnToLoginMenu('nosound')
            loadAit()
        }, 50)
    }, 920)
}

// Function to convert localStorage to a JSON string
function saveLocalStorageToCookie() {
    // Get all localStorage keys and values
    const localStorageData = JSON.stringify(localStorage);

    // Set a cookie with the localStorage data
    document.cookie = `localStorageData=${encodeURIComponent(localStorageData)}; path=/; domain=.evoxs.xyz; SameSite=Lax; Secure;`;
}


let stockApps = null;
let acd = null
function verificationComplete() {

    // Save localStorage to cookie when needed
    try {
        saveLocalStorageToCookie();
    } catch (error) {
        console.error("Cookies Failed!")
    }

    console.log("Verification Complete.")
    console.log("Scanning For Query Notifications")
    let hasPendingNotification = false;
    function getQueryParams() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const showNotification = params.get('showNotification');
        const metode = params.get('metode');
        const title = params.get('title');
        const content = params.get('content');

        if (showNotification) {
            hasPendingNotification = true
            console.log('showNotification:', showNotification);
            console.log('title:', title);
            console.log('content:', content);
            alert(`Pending notification attached: ${title},${content}`)
            document.getElementById("currentNotif").innerText = `${title}`
            document.getElementById("currentNotif-desc").innerText = content
            const logoUrl = `https://evoxs.xyz/notifications_assets/${title}.png`
            checkUrlAccessibility(logoUrl)
                .then(not404 => {
                    const el = document.getElementById("iconRow")
                    console.log(not404, "not404 res")
                    if (not404 === true) {
                        document.getElementById("iconRow").innerHTML = `<img src="${logoUrl}">`
                    }
                }).catch(error => {
                    //setNetworkStatus('off')
                    console.error(error);
                });
        }

        if (metode === 'jeandarc') {
            const myData = localStorage.getItem("t50-email")
            const pswd = localStorage.getItem("t50pswd")
            fetch(`${srv}/accounts?method=jeandarc&email=${myData}&password=${atob(pswd)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(jd => {
                    if (jd) {
                        localStorage.setItem("jeanDarc_accountData", JSON.stringify(jd))
                        console.log("JEANDARC IS READY")
                        window.location.href = '../jean/'
                    }

                })
                .catch(error => {


                });
        }

    }
    getQueryParams();

    $("#connectionContainer").fadeOut("fast")


    //document.getElementById('apps').innerHTML = ''

    function appsLoad() {
        const appsElement = document.getElementById('apps');
        $("#apps").fadeOut("fast", function () {
            appsElement.innerHTML = ''
            let countApps = 0
            console.log("Spawning Apps")
            stockApps.forEach((app) => {
                const evoxAppDiv = document.createElement('div');
                evoxAppDiv.className = 'evoxApp';
                const newC = countApps + 1
                countApps = newC

                //evoxAppDiv.onclick = function () {
                //    showApp(app)
                //}
                //const imgElement = document.createElement('img');
                //imgElement.src = `./posters/${app}.png`;
                //evoxAppDiv.appendChild(imgElement);
                const appDiv = document.createElement('div');
                appDiv.id = `app${newC}`;
                appDiv.className = 'evoxApp';

                // Create the inner div with id 'Zapp1', class 'zoomable', and an onclick event
                const zoomableDiv = document.createElement('div');
                zoomableDiv.id = `Zapp${newC}`;
                zoomableDiv.className = 'zoomable';
                zoomableDiv.onclick = function () {
                    animateM(this, app)
                }

                // Create the image element
                const img = document.createElement('img');
                if (appsDictionary) {//[app].custom === 'true'
                    if (appsDictionary[app].custom === 'true') {
                        img.src = appsDictionary[app].appPoster;
                    } else {
                        img.src = `./posters/${app}.png`;
                    }

                } else {
                    img.src = `./posters/${app}.png`;
                }

                img.alt = `${app.toUpperCase()} Image`;

                // Append the image to the zoomable div
                zoomableDiv.appendChild(img);

                // Create the paragraph element with text content


                // Append the zoomable div and paragraph to the outer div
                appDiv.appendChild(zoomableDiv);

                // Append the entire structure to the container
                appsElement.appendChild(appDiv);
            })
            $("#apps").fadeIn("fast")
        })

    }
    acd = appsLoad
    fetch(`${srv}/applications?method=get&email=${localStorage.getItem("t50-email")}&password=${atob(localStorage.getItem("t50pswd"))}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(apps => {
            localStorage.setItem("apps_epsilon", JSON.stringify(apps))
            stockApps = apps
            createDictionary()
                .then(dict => {
                    console.log("Dictionary ready:", dict);
                    appsLoad()
                })
                .catch(error => {
                    console.error("Failed to create dictionary:", error);
                });

        })
        .catch(error => {
            //setNetworkStatus('off')
            const data = localStorage.getItem("apps_epsilon")
            if (data) {
                console.warn("Server connection failed. Trying local")
                pickRandFromDict('offline')
                stockApps = JSON.parse(localStorage.getItem("apps_epsilon"))

                appsLoad()
            } else {
                console.error('Appload Failed!', error);
            }

        });



    fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&todo=friends`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            ////setNetworkStatus('on')
            localStorage.setItem("friends", JSON.stringify(data))
            attachUi(data)
            const isAccepted = aitPlay('good_day_AIT_intro')
            if (isAccepted === false) {
                console.log("Welcome Back Audio")
                if (!sessionStorage.getItem("saidWelcomeBack?")) {
                    pickRandFromDict('welcomeBack')
                    sessionStorage.setItem("saidWelcomeBack?", "true")
                }

            } else {
                console.log("Welcome Audio", isAccepted)
            }

        })
        .catch(error => {
            //setNetworkStatus('off')
            const data = localStorage.getItem("friends")
            if (data) {
                pickRandFromDict('offline')
                console.warn("Server connection failed. Trying local")
                attachUi(JSON.parse(data))
            } else {
                console.error('Carousel Failed!', error);
            }

        });
    $("#loading-text").fadeOut("fast")
    if (!hasPendingNotification) {
        document.getElementById("gateway").style.display = 'flex'
        setTimeout(function () {
            document.getElementById("gateway").style.opacity = '1'
            $("#gatewayActions").fadeIn("fast")
        }, 50)
    } else {
        console.log("pending notification found")
        document.getElementById("container").style.display = 'none'
        document.getElementById("notification-center").classList.add("active")
    }



}
let previousHeight = null
function showHideGalaxy(e) {
    if (e.getAttribute('data-c') === 'false') {
        //hidden
        previousHeight = document.getElementById("secureline").style.height
        document.getElementById("secureline").style.height = '50px'
        e.setAttribute('data-c', 'true')
    } else {
        document.getElementById("secureline").style.height = previousHeight
        e.setAttribute('data-c', 'false')
        isGalaxied = false
    }
}

function hideChats() {
    chatsVisible = false
    $("#bggradient").fadeIn("fast")
    $("#galaxy").fadeOut("fast")
    $("#galaxyBackTo").fadeOut("fast")
    play('rocket_push')

    const securelinePopup = document.querySelector('#secureline');
    //removeScrollListener(securelinePopup)
    securelinePopup.classList.remove("active")

    document.getElementById("secureline-back").style.opacity = '0'
    setTimeout(function () {
        document.getElementById("secureline-back").style.display = 'none'
    }, 200)
    $("#container").fadeIn("fast")

    setTimeout(function () {
        securelinePopup.scrollTop = 0;
        securelinePopup.style.height = "60%"
    }, 500)
    setTimeout(function () {
        document.getElementById("secureline-input").value = ''
        const animate = document.getElementById("rocketIcon")
        animate.style.transform = ''
    }, 500)

    //refresh carousel etc
    fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&todo=friends`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            ////setNetworkStatus('on')
            localStorage.setItem("friends", JSON.stringify(data))
            attachUi(data, null, 'onlyCarousel')

        })
        .catch(error => {
            //setNetworkStatus('off')
            const data = localStorage.getItem("friends")
            if (data) {
                console.warn("Server connection failed. Trying local")
                attachUi(JSON.parse(data, null, 'onlyCarousel'))
            } else {
                console.error('Carousel Failed!', error);
            }

        });
}
let chatsVisible = false
function showChats() {
    chatsVisible = true
    aitPlay('secureline_desc')
    loadSecurelineHome()
    const animate = document.getElementById("rocketIcon")
    animate.style.transform = 'rotate(45deg)'
    setTimeout(function () {
        play('rocket')
        const oldHtml = animate.innerHTML
        animate.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M15.5023 14.3674L20.5319 9.35289C21.2563 8.63072 21.6185 8.26963 21.8092 7.81046C22 7.3513 22 6.84065 22 5.81937V5.33146C22 3.76099 22 2.97576 21.5106 2.48788C21.0213 2 20.2337 2 18.6585 2H18.1691C17.1447 2 16.6325 2 16.172 2.19019C15.7114 2.38039 15.3493 2.74147 14.6249 3.46364L9.59522 8.47817C8.74882 9.32202 8.224 9.84526 8.02078 10.3506C7.95657 10.5103 7.92446 10.6682 7.92446 10.8339C7.92446 11.5238 8.48138 12.0791 9.59522 13.1896L9.74492 13.3388L11.4985 11.5591C11.7486 11.3053 12.1571 11.3022 12.4109 11.5523C12.6647 11.8024 12.6678 12.2109 12.4177 12.4647L10.6587 14.2499L10.7766 14.3674C11.8905 15.4779 12.4474 16.0331 13.1394 16.0331C13.2924 16.0331 13.4387 16.006 13.5858 15.9518C14.1048 15.7607 14.6345 15.2325 15.5023 14.3674ZM17.8652 8.47854C17.2127 9.12904 16.1548 9.12904 15.5024 8.47854C14.8499 7.82803 14.8499 6.77335 15.5024 6.12284C16.1548 5.47233 17.2127 5.47233 17.8652 6.12284C18.5177 6.77335 18.5177 7.82803 17.8652 8.47854Z" fill="#dbdde3"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.77409 12.4814C3.07033 12.778 3.07004 13.2586 2.77343 13.5548L2.61779 13.7103C2.48483 13.8431 2.48483 14.058 2.61779 14.1908C2.75125 14.3241 2.96801 14.3241 3.10147 14.1908L4.8136 12.4807C5.1102 12.1845 5.59079 12.1848 5.88704 12.4814C6.18328 12.778 6.18298 13.2586 5.88638 13.5548L4.17426 15.2648C3.4481 15.9901 2.27116 15.9901 1.545 15.2648C0.818334 14.5391 0.818333 13.362 1.545 12.6362L1.70065 12.4807C1.99725 12.1845 2.47784 12.1848 2.77409 12.4814ZM7.29719 16.696C7.5903 16.9957 7.58495 17.4762 7.28525 17.7693L5.55508 19.4614C5.25538 19.7545 4.77481 19.7491 4.48171 19.4494C4.1886 19.1497 4.19395 18.6692 4.49365 18.3761L6.22382 16.684C6.52352 16.3909 7.00409 16.3963 7.29719 16.696ZM11.4811 18.118C11.7774 18.4146 11.7771 18.8952 11.4805 19.1915L9.76834 20.9015C9.63539 21.0343 9.63539 21.2492 9.76834 21.382C9.9018 21.5153 10.1186 21.5153 10.252 21.382L10.4077 21.2265C10.7043 20.9303 11.1849 20.9306 11.4811 21.2272C11.7774 21.5238 11.7771 22.0044 11.4805 22.3006L11.3248 22.4561C10.5987 23.1813 9.42171 23.1813 8.69556 22.4561C7.96889 21.7303 7.96889 20.5532 8.69556 19.8274L10.4077 18.1174C10.7043 17.8211 11.1849 17.8214 11.4811 18.118Z" fill="#dbdde3"/>
<g opacity="0.5">
<path d="M10.8461 5.40925L8.65837 7.59037C8.25624 7.99126 7.88737 8.35901 7.59606 8.69145C7.40899 8.90494 7.22204 9.13861 7.06368 9.39679L7.04237 9.37554C7.00191 9.3352 6.98165 9.31501 6.96133 9.29529C6.58108 8.92635 6.1338 8.63301 5.64342 8.43097C5.61722 8.42018 5.59062 8.40964 5.53743 8.38856L5.2117 8.25949C4.77043 8.08464 4.65283 7.51659 4.9886 7.18184C5.95224 6.22112 7.10923 5.06765 7.6676 4.83597C8.16004 4.63166 8.692 4.56368 9.20505 4.6395C9.67514 4.70897 10.1198 4.95043 10.8461 5.40925Z" fill="#dbdde3"/>
<path d="M14.5816 16.8934C14.7579 17.0723 14.8749 17.1987 14.9808 17.3337C15.1204 17.5119 15.2453 17.7012 15.3542 17.8996C15.4767 18.123 15.5718 18.3616 15.7621 18.8389C15.9169 19.2274 16.4315 19.3301 16.7303 19.0322L16.8026 18.9601C17.7662 17.9993 18.9232 16.8458 19.1556 16.2891C19.3605 15.7982 19.4287 15.2678 19.3526 14.7563C19.283 14.2877 19.0408 13.8444 18.5807 13.1205L16.3857 15.3089C15.9745 15.7189 15.5974 16.0949 15.2564 16.3894C15.052 16.5659 14.8284 16.7423 14.5816 16.8934Z" fill="#dbdde3"/>
</g>
<g opacity="0.5">
<path d="M7.68621 14.5633C7.98263 14.2669 7.98263 13.7863 7.68621 13.4899C7.38979 13.1935 6.90919 13.1935 6.61277 13.4899L4.47036 15.6323C4.17394 15.9287 4.17394 16.4093 4.47036 16.7057C4.76679 17.0021 5.24738 17.0021 5.5438 16.7057L7.68621 14.5633Z" fill="#dbdde3"/>
<path d="M10.4954 17.369C10.7918 17.0726 10.7918 16.592 10.4954 16.2956C10.1989 15.9992 9.71835 15.9992 9.42193 16.2956L7.29417 18.4233C6.99774 18.7198 6.99774 19.2003 7.29417 19.4968C7.59059 19.7932 8.07118 19.7932 8.36761 19.4968L10.4954 17.369Z" fill="#dbdde3"/>
</g>`
        animate.style.marginLeft = "250px"
        setTimeout(function () {

            const securelinePopup = document.querySelector('#secureline');
            //addScrollListener(securelinePopup)
            const popup = document.getElementById("secureline")
            popup.classList.add("active")
            document.getElementById("secureline-back").style.display = 'flex'

            setTimeout(function () {
                document.getElementById("secureline-back").style.opacity = '1'
                animate.innerHTML = oldHtml
                animate.style.marginLeft = "0"
            }, 200)
            $("#container").fadeOut("fast")
        }, 200)
        //$("#bggradient").fadeOut("fast")
        sessionStorage.setItem("attachGalaxy", true)
        $("#galaxy").fadeIn("fast")

        //attachGalaxy()
    }, 200)

    setTimeout(function () {
        return;

    }, 200)

}

function add_favorite(event, element, customColor, customDimen) {
    event.stopPropagation();
    const color = customColor ? customColor : '#7d7e87';
    const height_width = customDimen ? customDimen : '30px';
    const status = element.getAttribute("data-status")
    if (status === "default") {
        if (localStorage.getItem("favorites")) {
            const previous = JSON.parse(localStorage.getItem("favorites"))
            console.log(previous)
            previous.push(element.getAttribute("data-name"))
            localStorage.setItem('favorites', JSON.stringify(previous))
            syncOptions("favorites", JSON.stringify(previous))
        } else {
            const json = [element.getAttribute("data-name")]
            localStorage.setItem('favorites', JSON.stringify(json))
            syncOptions("favorites", JSON.stringify(json))
        }
        element.setAttribute("data-status", 'fav')
        element.style.transform = 'scale(1.2)'
        setTimeout(function () {
            element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${height_width}" height="${height_width}" viewBox="0 0 24 24" fill="none">
                            <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="${color}"/>
                            </svg>`
            element.style.transform = 'scale(1)'
        }, 200)
        document.getElementById(`user-${element.getAttribute("data-name")}`).remove()

    } else {
        if (localStorage.getItem("favorites")) {
            const previous = JSON.parse(localStorage.getItem("favorites"))
            console.log("Previous:", previous)
            var index = previous.indexOf(element.getAttribute("data-name"));
            // If the value exists in the array, remove it
            if (index > -1) {
                previous.splice(index, 1);
            }
            console.log("Updated:", previous)
            localStorage.setItem('favorites', JSON.stringify(previous))
            syncOptions("favorites", JSON.stringify(previous))
        }
        element.setAttribute("data-status", 'default')
        element.style.transform = 'scale(1.2)'
        setTimeout(function () {
            element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${height_width}" height="${height_width}" viewBox="0 0 24 24" fill="none">
                        <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="${color}" stroke-width="1.5"/>
                        </svg>`
            element.style.transform = 'scale(1)'
        }, 200)
        loadSecurelineHome()

    }
    reloadFavs()

    //$("#secureline-users").fadeOut("fast")
    //$("#favorites-recommended").fadeOut("fast")

}

function openChat(data, location) {
    chatsVisible = false
    $("#galaxy").fadeOut("fast")
    $("#galaxyBackTo").fadeOut("fast")
    $("#bggradient").fadeIn("fast")
    sessionStorage.removeItem("current_sline")
    play('rocket')
    document.getElementById("bottomActionsSecureline").classList.add("hidden")
    console.log('Chat opened for user', data);

    const username = data.username
    const isFavorite = data.favorite//true-false
    document.getElementById("favStatInChat").setAttribute("data-name", username)
    if (isFavorite === true) {
        document.getElementById("favStatInChat").setAttribute("data-status", 'fav')
        document.getElementById("favStatInChat").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                            <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="#fff"/>
                            </svg>`
    } else {
        document.getElementById("favStatInChat").setAttribute("data-status", 'default')
        document.getElementById("favStatInChat").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="#fff" stroke-width="1.5"/>
                                </svg>`
    }
    if (location === 'home') {
        console.log("Location: home")

        $("#container").fadeOut("fast")
        $("#messenger").fadeIn("fast")
    } else {
        console.log("Location: friends")
        const securelinePopup = document.querySelector('#secureline');
        //removeScrollListener(securelinePopup)
        securelinePopup.classList.remove("active")

        setTimeout(function () {
            securelinePopup.scrollTop = 0;
            securelinePopup.style.height = "60%"
        }, 500)
        document.getElementById("secureline-back").style.opacity = '0'
        setTimeout(function () {
            document.getElementById("secureline-back").style.display = 'none'
        }, 200)

        $("#messenger").fadeIn("fast")

    }
    document.getElementById("secureline-username").innerText = username
    document.getElementById("goBackMessenger").style.display = 'flex'
    setTimeout(function () {
        document.getElementById("goBackMessenger").style.opacity = '1'
    }, 200)

    loadPFPget(username)
        .then(profileImage => {
            document.getElementById("secureline-pfp").src = profileImage;
        }).catch(error => {
            //setNetworkStatus('off')
            console.error(error);
        });
    actionReload(username, null, null, 'firstLoad').then((res) => {
        //alert(`First action done! ${res}`)
        activeChatInterval = setInterval(function () {
            actionReload(username, 'reloadPage')
        }, 1700)
    }).catch(error => {
        console.error(error);
        actionReload(username, null, null, 'firstLoad').then(() => {
            activeChatInterval = setInterval(function () {
                actionReload(username, 'reloadPage')
            }, 1700)
        }).catch(error => {
            console.error(error);
        });
    });

    console.warn("Running Secureline For", username)
    setTimeout(function () {
        document.getElementById("secureline-input").value = ''
    }, 500)


}

function showSocial(el) {
    play('openPanel')
    el.style.transform = 'scale(0.96)'
    const socialPopup = document.getElementById("social")


    if (el.innerText.toString().includes("Manage")) {
        socialPopup.classList.add("active")
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            $("#container").fadeOut("fast")
            document.getElementById("social-back").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("social-back").style.opacity = '1'
            }, 200)
            document.getElementById("social-discover").style.display = 'none'
            document.getElementById("social-users").style.display = null
            document.getElementById("menu-discover").classList.remove("active")
            loadFriendsSocial()
            setTimeout(function () {
                document.getElementById("bottomActionsSocial").classList.add("visible")
            }, 150)
        }, 200)
    } else if (el.innerText.toString().includes("Discover")) {
        epsilonDiscover()
        document.getElementById("social-users").style.display = 'none'
        document.getElementById("social-discover").style.display = null
        document.getElementById("menu-manage").classList.remove("active")
        document.getElementById("menu-discover").classList.add("active")
        const workingElem = document.getElementById("discover-home-svg")
        workingElem.style.transform = 'rotate(180deg) scale(1.1)'
        setTimeout(function () {
            workingElem.style.transform = 'rotate(0deg) scale(1)'
        }, 550)
        setTimeout(function () {
            socialPopup.classList.add("active")

            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            $("#container").fadeOut("fast")
            document.getElementById("social-back").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("social-back").style.opacity = '1'
            }, 200)



            setTimeout(function () {
                document.getElementById("bottomActionsSocial").classList.add("visible")
            }, 150)
        }, 200)
    }
}

function hideNotifs() {
    play('closePanel')
    const notifsPopup = document.getElementById("notifications-popup")
    notifsPopup.classList.remove("active")
    document.getElementById("notifs-back").style.opacity = '0'
    setTimeout(function () {
        document.getElementById("notifs-back").style.display = 'none'
    }, 200)
    $("#container").fadeIn("fast")
    document.getElementById("bottomActionsNotifs").classList.remove("visible")
    setTimeout(function () {
        notifsPopup.scrollTop = 0;
        notifsPopup.style.height = "60%"
    }, 500)
}
function showNotifs(el) {
    play('openPanel')
    el.style.transform = 'scale(0.96)'
    const notifsPopup = document.getElementById("notifications-popup")


    if (el.innerText.toString().includes("View all")) {
        notifsPopup.classList.add("active")
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            $("#container").fadeOut("fast")
            document.getElementById("notifs-back").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("notifs-back").style.opacity = '1'
            }, 200)
            document.getElementById("notifConf").style.display = 'none'
            document.getElementById("notificationsAll").style.display = null
            document.getElementById("menu-conf-notif").classList.remove("active")
            //loadFriendsSocial()
            loadNotificationsAll()
            setTimeout(function () {
                document.getElementById("bottomActionsNotifs").classList.add("visible")
            }, 150)
        }, 200)
    } else if (el.innerText.toString().includes("Configure")) {
        epsilonDiscover()
        document.getElementById("social-users").style.display = 'none'
        document.getElementById("social-discover").style.display = null
        document.getElementById("menu-manage").classList.remove("active")
        document.getElementById("menu-discover").classList.add("active")
        const workingElem = document.getElementById("discover-home-svg")
        workingElem.style.transform = 'rotate(180deg) scale(1.1)'
        setTimeout(function () {
            workingElem.style.transform = 'rotate(0deg) scale(1)'
        }, 550)
        setTimeout(function () {
            notifsPopup.classList.add("active")

            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            $("#container").fadeOut("fast")
            document.getElementById("social-back").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("social-back").style.opacity = '1'
            }, 200)



            setTimeout(function () {
                document.getElementById("bottomActionsNotifs").classList.add("visible")
            }, 150)
        }, 200)
    }
}

let currentShowingNotifications = 6

function loadNotificationsAll(targetNotifications) {
    document.getElementById("notifConf").style.display = 'flex'
    const load = document.getElementById("notificationsAll-load")

    $(container).fadeOut("fast", function () {
        $(load).fadeIn("fast")
    })
    const nc = document.getElementById("notificationsAll")
    let targetSpawn = targetNotifications ? targetNotifications : 6
    let spawned = 0
    fetch(`${srv}/notifications?process=getAll&email=${localStorage.getItem("t50-email")}&password=${atob(localStorage.getItem("t50pswd"))}&username=${localStorage.getItem("t50-username")}&rand=${Math.floor(Math.random() * 100000)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Fetching Notifications")
            if (data === `{"notifications":[]}` || data === "No notifications!") {
                console.log("No Notifications")
                container.innerHTML = `<h3>You have no notifications</h3>`
                //Do nothing
            } else {
                const container = nc
                container.innerHTML = ''
                let notifications = JSON.parse(data)
                const numNotifications = notifications.notifications.length;
                console.log("Notifications:", numNotifications)
                notifications.notifications = notifications.notifications.slice().reverse();
                notifications = notifications.notifications

                console.log(notifications);
                function addNotif(n) {
                    console.log("Working on notification:", n)
                    const knownWebFiles = ['Cryptox.png', 'Error.png', 'Evox LTS 2.0 Beacon.png', 'Gateway.png', 'Gateway-2.png', 'Images.png', 'Notice.png', 'Secureline.png', 'Tasco.png']
                    finalImage = n.image
                    if (n.image.includes("Gateway.png")) {
                        finalImage = "evox-logo-apple.png"
                        nowComplete()
                    } else {
                        if (finalImage.includes("http")) {
                            //finalImage.replace("%20", " ")
                            const filename = new URL(finalImage).pathname.split('/').pop();
                            console.log(n.app, filename)
                            if (!knownWebFiles.includes(filename)) {
                                let isOk = true
                                fetch(finalImage)
                                    .then(response => {
                                        if (!response.ok) {
                                            isOk = false; // Mark as false if response is not OK (e.g., 404)
                                            finalImage = 'evox-logo-apple.png'
                                            nowComplete()
                                            return;
                                            //throw new Error(`HTTP error! Status: ${response.status}`); // Stop further execution
                                        }
                                        return response.text();
                                    })
                                    .then(data => {
                                        nowComplete()
                                    })
                                    .catch(error => {
                                        isOk = false; // Also set false in case of network errors
                                        finalImage = 'evox-logo-apple.png'
                                        nowComplete()
                                        console.error('Fetch error:', error);
                                    });
                            } else {
                                nowComplete()
                            }
                        } else {
                            const username = finalImage
                            loadPFPget(finalImage)
                                .then(profileImage => {

                                    finalImage = profileImage

                                    fetch(`${srv}/canvas/${username}.evox/has?v=${Math.floor(Math.random() * 100000)}`)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error(`HTTP error! Status: ${response.status}`);
                                            }
                                            return response.text();
                                        })
                                        .then(canvasStatus => {
                                            if (canvasStatus === 'true') {
                                                finalImage = profileImage
                                                nowComplete(`${srv}/canvas/${username}.evox`)


                                            } else {
                                                nowComplete(null)
                                            }

                                        }).catch(error => {
                                            console.error(error);
                                            finalImage = 'evox-logo-apple.png'
                                            nowComplete()
                                        })


                                }).catch(error => {
                                    //setNetworkStatus('off')
                                    console.error(error);
                                    finalImage = 'evox-logo-apple.png'
                                    nowComplete()
                                });
                        }


                    }

                    function nowComplete(canvas) {

                        $(load).fadeOut("fast")
                        $(container).fadeIn("fast")
                        container.innerHTML += `<div class="user fade-in-slide-up ${canvas ? "bgvid" : ""}">
                        ${canvas ? `<video autoplay muted loop class="bg-video">
        <source src="${canvas}" type="video/mp4">
    </video>` : ""}
        <div class="icon">
                <img class="slUserPFP social" src="${finalImage}">
        </div>
        <div class="column" style="font-size: 15px;margin-right: 5px;">
                <p>${truncateText(n.content, n.content.includes("IP") ? 25 : 32)}</p>
        </div>
        <div class="show-user-info" style="transform: rotate(0deg);text-align:right;">
                ${formatTimeDifference(n.timestamp) + " ago"}
        </div>
</div>`
                        spawned++
                    }
                }
                Promise.all(
                    notifications.slice(0, targetSpawn).map(notif => addNotif(notif))
                ).then(() => {
                    console.log("All notifications added");
                    let tempInt = setInterval(function () {
                        if (spawned === targetSpawn) {
                            clearInterval(tempInt)
                            container.innerHTML += `<div onclick="currentShowingNotifications = currentShowingNotifications + 6;loadNotificationsAll(currentShowingNotifications);" class="user">

                            <div class="column" style="width: 100%;justify-content:center;align-items:center;display: flex;flex-direction:row;">
                                    <svg style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8L11 13.5858L9.70711 12.2929C9.31658 11.9024 8.68342 11.9024 8.29289 12.2929C7.90237 12.6834 7.90237 13.3166 8.29289 13.7071L11.2059 16.6201C11.2209 16.6351 11.2363 16.6497 11.252 16.6637C11.4352 16.87 11.7024 17 12 17C12.2976 17 12.5648 16.87 12.748 16.6637C12.7637 16.6497 12.7791 16.6351 12.7941 16.6201L15.7071 13.7071C16.0976 13.3166 16.0976 12.6834 15.7071 12.2929C15.3166 11.9024 14.6834 11.9024 14.2929 12.2929L13 13.5858L13 8Z" fill="#dbdde3"/>
</svg><p>Load more</p>
                            </div>
                            
                            </div>`
                        }
                    }, 200)

                });

            }

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


function hideSocial() {
    play('closePanel')
    const socialPopup = document.getElementById("social")
    socialPopup.classList.remove("active")
    document.getElementById("social-back").style.opacity = '0'
    setTimeout(function () {
        document.getElementById("social-back").style.display = 'none'
    }, 200)
    $("#container").fadeIn("fast")
    document.getElementById("bottomActionsSocial").classList.remove("visible")
    setTimeout(function () {
        socialPopup.scrollTop = 0;
        socialPopup.style.height = "60%"
    }, 500)
}

function setFullHeight() {
    const securelineMessages = document.querySelector('.secureline-messages');
    securelineMessages.style.height = `${window.innerHeight}px`;
}

window.addEventListener('load', setFullHeight);
window.addEventListener('resize', setFullHeight);

function goBackMessenger() {
    $("#galaxy").fadeIn("fast")
    //$("#bggradient").fadeOut("fast")
    play("closePanel")
    clearInterval(activeChatInterval)
    activeChatInterval = null;
    sessionStorage.removeItem("current_sline")
    sessionStorage.removeItem("lastChatMessages")
    const popup = document.getElementById("secureline")
    popup.classList.add("active")
    document.getElementById("goBackMessenger").classList.remove("visible")

    document.getElementById("goBackMessenger").style.opacity = '0'
    setTimeout(function () {
        document.getElementById("goBackMessenger").style.display = 'none'
    }, 200)
    $("#messenger").fadeOut('fast')

    const securelinePopup = document.querySelector('#secureline');
    //addScrollListener(securelinePopup)

    loadSecurelineHome()

    document.getElementById("secureline-back").style.display = 'flex'
    setTimeout(function () {
        document.getElementById("secureline-back").style.opacity = '1'
    }, 200)
    aitNoMsgPlayed = false
}

function showRemoteFriend(id, notFriend) {
    const friend = id.replace('_socialHome', '');
    $("#container").fadeOut("fast", function () {

        if (notFriend) {
            showFriend(null, friend, true)
        } else {
            showFriend(null, friend)
        }

    })
    loadFriendsSocial()



}

function showFriend(element, remote, notFriends) {
    document.getElementById("userProfile-back").style.display = 'flex'
    setTimeout(function () {
        document.getElementById("userProfile-back").style.opacity = '1'
    }, 200)
    let friend;
    if (!remote) {
        const pElement = element.querySelector('.column p');
        friend = pElement.textContent;
    } else {
        friend = remote
    }

    let defaultArrow;
    if (!remote) {
        defaultArrow = document.getElementById(`showUserInfoDiv-${friend}`).innerHTML
        document.getElementById(`showUserInfoDiv-${friend}`).innerHTML = `<svg version="1.1" width="25px" height="25px" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50"
            style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <path fill="#fff"
                d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                    to="360 25 25" dur="0.6s" repeatCount="indefinite" />
            </path>
        </svg>`
    }

    try {
        console.log("Default arrow", defaultArrow)
        console.log('Launching:', friend);//
        document.getElementById("user-profile-picture").src = 'searching_users.gif'
        loadPFPget(friend)
            .then(profileImage => {
                document.getElementById("user-profile-picture").src = profileImage
            }).catch(error => {
                //setNetworkStatus('off')
                console.error(error);
            });
        document.getElementById("user-profile-username").innerText = friend
        fetch(`${srv}/cryptox?method=isCryptoxed&username=${friend}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(isCryptoxed => {
                if (isCryptoxed === 'Enabled') {
                    document.getElementById("user-cryptox").innerText = 'Enabled'
                } else if (isCryptoxed === 'Disabled') {
                    document.getElementById("user-cryptox").innerText = 'Unset'
                } else {
                    document.getElementById("user-cryptox").innerText = '🤯'
                }
            }).catch(error => {
                document.getElementById("user-cryptox").innerText = 'You are offline'
                console.log('userFriends failed to load:', error)
            })
        fetch(`${srv}/social?username=${friend}&todo=friends`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(userFriends => {
                document.getElementById("friendsCount").style.display = null
                if (userFriends !== '') {
                    const userJsonFriends = JSON.parse(userFriends)
                    localStorage.setItem(`${friend}_friendCount`, userJsonFriends.length)
                    console.log(`${friend} friends length: ${userJsonFriends.length}`)
                    if (userJsonFriends.length === 1) {
                        document.getElementById("friendsCount").innerHTML = `${userJsonFriends.length} <span>Friend</span>`
                    } else {
                        document.getElementById("friendsCount").innerHTML = `${userJsonFriends.length} <span>Friends</span>`
                    }

                } else {
                    localStorage.setItem(`${friend}_friendCount`, '0')
                    document.getElementById("friendsCount").innerHTML = `0 <span>Friends</span>`
                }

            }).catch(error => {
                document.getElementById("friendsCount").style.display = null
                const friendCount = localStorage.getItem(`${friend}_friendCount`)
                console.log(`${friend} friends length: ${friendCount} [OFFLINE]`)
                if (friendCount) {
                    if (friendCount === 1) {
                        document.getElementById("friendsCount").innerHTML = `${friendCount} <span>Friend</span>`
                    } else {
                        document.getElementById("friendsCount").innerHTML = `${friendCount} <span>Friends</span>`
                    }
                } else {
                    document.getElementById("friendsCount").style.display = 'none'
                }

                console.log('userFriends failed to load:', error)
            })
        fetch(`${srv}/accounts?method=getemailbyusername&username=${friend}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(friend_email => {
                fetch(`${srv}/accounts?email=${friend_email}&username=${friend}&method=last_login`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(last_login => {
                        if (last_login !== 'Unknown') {
                            document.getElementById("user-lastSeen").innerText = formatTimeDifference(last_login) + " ago"
                        } else {
                            document.getElementById("user-lastSeen").innerText = 'Unknown'
                        }

                    }).catch(error => {
                        console.log("User Load Last Login Failed [3]:", error)
                    })
                fetch(`${srv}/accounts?email=${friend_email}&username=${friend}&birth=get`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(birthdateString => {
                        localStorage.setItem(`user-${friend}-birthdate`, birthdateString)
                        if (birthdateString) {
                            document.getElementById("user-age-block").style.display = ''
                            document.getElementById("user-birth-block").style.display = ''
                            let parts = birthdateString.split('/');
                            let day = parseInt(parts[0]);
                            let month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
                            let year = parseInt(parts[2]);
                            let birthdate = new Date(year, month, day);
                            let today = new Date();
                            let age = today.getFullYear() - birthdate.getFullYear();
                            let monthDiff = today.getMonth() - birthdate.getMonth();
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                                age--;
                            }

                            console.log("Age: " + age);
                            document.getElementById("user-age").innerText = age
                            document.getElementById("user-birthdate").innerText = birthdateString
                        } else {
                            console.log("No age registered")
                            document.getElementById("user-age-block").style.display = 'none'
                            document.getElementById("user-birth-block").style.display = 'none'
                        }

                        document.getElementById("user-profile").classList.add('active')
                        play('openPanel')
                        const socialPopup = document.getElementById("social")
                        socialPopup.classList.remove("active")
                        document.getElementById("social-back").style.opacity = '0'
                        setTimeout(function () {
                            document.getElementById("social-back").style.display = 'none'
                        }, 200)
                        document.getElementById("bottomActionsSocial").classList.remove("visible")

                        if (!remote) {
                            setTimeout(() => {
                                document.getElementById(`showUserInfoDiv-${friend}`).innerHTML = defaultArrow
                            }, 250);
                        }

                    }).catch(error => {
                        console.log("User Load Failed [2]:", error)
                    })
            }).catch(error => {
                const data = localStorage.getItem(`user-${friend}-lastLogin`)
                if (data) {
                    console.warn("Server connection failed. Trying local")
                    const lastLogin = data
                    if (lastLogin !== 'Unknown') {
                        document.getElementById("user-lastSeen").innerText = formatTimeDifference(lastLogin);
                    } else {
                        document.getElementById("user-lastSeen").innerText = 'none'
                    }
                } else {
                    console.log("User load failed [1]:", error)
                }

                //Birth

                const birthdateString = localStorage.getItem(`user-${friend}-birthdate`)
                if (birthdateString) {
                    document.getElementById("user-age-block").style.display = ''
                    document.getElementById("user-birth-block").style.display = ''
                    let parts = birthdateString.split('/');
                    let day = parseInt(parts[0]);
                    let month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
                    let year = parseInt(parts[2]);
                    let birthdate = new Date(year, month, day);
                    let today = new Date();
                    let age = today.getFullYear() - birthdate.getFullYear();
                    let monthDiff = today.getMonth() - birthdate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                        age--;
                    }

                    console.log("Age: " + age);
                    document.getElementById("user-age").innerText = age
                    document.getElementById("user-birthdate").innerText = birthdateString
                } else {
                    console.log("No age registered")
                    document.getElementById("user-age-block").style.display = 'none'
                    document.getElementById("user-birth-block").style.display = 'none'
                }

                document.getElementById("user-profile").classList.add('active')

                const socialPopup = document.getElementById("social")
                socialPopup.classList.remove("active")
                document.getElementById("social-back").style.opacity = '0'
                setTimeout(function () {
                    document.getElementById("social-back").style.display = 'none'
                }, 200)
                document.getElementById("bottomActionsSocial").classList.remove("visible")

                if (!remote) {
                    setTimeout(() => {
                        document.getElementById(`showUserInfoDiv-${friend}`).innerHTML = defaultArrow
                    }, 250);
                }

            })
        const container = document.getElementById("friendTags")
        container.innerHTML = ''
        document.getElementById("loadingIndicatorProfile").style.display = ''
        document.getElementById("user-video-forDisplay").src = ''
        document.getElementById("user-video-forDisplay").style.display = 'none'
        //Old db < NEW🥲
        document.getElementById("showErrorCanvas").style.display = 'none'
        fetch(`${srv}/social?username=${friend}&todo=tags&v=${Math.floor(Math.random() * 100000)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem(`user-${friend}-tags`, JSON.stringify(data))

                //will return current tags
                if (data.includes('No tags')) {
                    return;
                }
                data.forEach((tag) => {
                    var div = document.createElement("div");
                    div.className = "user-tag";

                    // Create the SVG element
                    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.setAttribute("width", "20px");
                    svg.setAttribute("height", "20px");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("fill", "none");

                    // Create the path element
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M10 4L7 20M17 4L14 20M5 8H20M4 16H19");
                    path.setAttribute("stroke", "#fff");
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("stroke-linecap", "round");

                    // Append the path to the svg
                    svg.appendChild(path);

                    // Append the svg to the div
                    div.appendChild(svg);

                    // Add the text node "Add Tag"
                    div.appendChild(document.createTextNode(tag));

                    // Append the div to the element with ID "userTags"
                    container.appendChild(div);
                })
            })
            .catch(error => {
                const data_string = localStorage.getItem(`user-${friend}-tags`)
                if (data_string) {
                    const data = JSON.parse(data_string)
                    if (data.includes('No tags')) {
                        return;
                    }
                    data.forEach((tag) => {
                        var div = document.createElement("div");
                        div.className = "user-tag";

                        // Create the SVG element
                        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                        svg.setAttribute("width", "20px");
                        svg.setAttribute("height", "20px");
                        svg.setAttribute("viewBox", "0 0 24 24");
                        svg.setAttribute("fill", "none");

                        // Create the path element
                        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        path.setAttribute("d", "M10 4L7 20M17 4L14 20M5 8H20M4 16H19");
                        path.setAttribute("stroke", "#fff");
                        path.setAttribute("stroke-width", "2");
                        path.setAttribute("stroke-linecap", "round");

                        // Append the path to the svg
                        svg.appendChild(path);

                        // Append the svg to the div
                        div.appendChild(svg);

                        // Add the text node "Add Tag"
                        div.appendChild(document.createTextNode(tag));

                        // Append the div to the element with ID "userTags"
                        container.appendChild(div);
                    })
                } else {
                    console.error(`Failed to get tags for user ${friend}`, error)
                }


            });
        if (notFriends) {
            try {
                if (localStorage.getItem(`${localStorage.getItem("t50-username")}-sentRequests`).includes(friend)) {
                    $("#requestSent").fadeIn("fast")
                } else {
                    $("#addFriend").fadeIn("fast")
                    sessionStorage.setItem("addFriendItem", friend)
                }
            } catch (error) {
                $("#addFriend").fadeIn("fast")
                sessionStorage.setItem("addFriendItem", friend)
            }
            fetch(`${srv}/social?username=${friend}&todo=sentRequests&v=${Math.floor(Math.random() * 100000)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(sent_req => {
                    //alert(sent_req)
                    if (sent_req !== "None") {
                        if (sent_req.includes(localStorage.getItem('t50-username'))) {
                            console.log("Request is sent by this user. 200")
                            document.getElementById("addFriend").style.display = 'none'
                            document.getElementById("requestSent").style.display = 'none'
                            $("#acceptRequest").fadeIn("fast")
                        }
                    }
                }).catch(error => {
                    console.error(error);
                });

        } else {
            $("#openMessages").fadeIn("fast")
            document.getElementById("openMessages").setAttribute("data-c", friend)
        }
        //fetch(`${srv}/profiles?name=${friend}&authorize=cover`)
        //    .then(response => {
        //        if (!response.ok) {
        //            throw new Error(`HTTP error! Status: ${response.status}`);
        //        }
        //        return response.text();
        //    })
        //    .then(coverIMG => {
        //        return;
        //        if (coverIMG !== "None") {
        //
        //            document.getElementById("user-video-forDisplay").style.display = ''
        //            document.getElementById("user-video-forDisplay").src = coverIMG
        //            document.getElementById("loadingIndicatorProfile").style.display = 'none'
        //        } else {
        //            document.getElementById("user-video-forDisplay").src = ''
        //            document.getElementById("user-video-forDisplay").style.display = 'none'
        //            document.getElementById("loadingIndicatorProfile").style.display = 'none'
        //
        //        }
        //
        //    }).catch(error => {
        //        console.error(error);
        //        document.getElementById("showErrorCanvas").style.display = ''
        //    })

        fetch(`${srv}/canvas/${friend}.evox/has?v=${Math.floor(Math.random() * 100000)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(canvasStatus => {
                if (canvasStatus === 'true') {

                    document.getElementById("user-video-forDisplay").style.display = ''
                    document.getElementById("user-video-forDisplay").src = `${srv}/canvas/${friend}.evox`
                    document.getElementById("user-video-forDisplay").onloadeddata = function () {
                        console.log("Canvas Loaded!");
                        $("#bggradient").fadeOut("fast")
                        document.getElementById("loadingIndicatorProfile").style.display = 'none'
                    };
                    saveVideoAsBlob(friend, `${srv}/canvas/${friend}.evox`)


                } else {
                    document.getElementById("user-video-forDisplay").src = ''
                    document.getElementById("user-video-forDisplay").style.display = 'none'
                    document.getElementById("loadingIndicatorProfile").style.display = 'none'
                }

            }).catch(error => {
                loadPFPget(`${friend}_canvas`)
                    .then(result => {
                        if (result !== 'Canvas Not Found') {
                            const blob = new Blob([videoData], { type: 'video/mp4' });
                            const videoURL = URL.createObjectURL(blob);
                            document.getElementById("user-video-forDisplay").style.display = ''
                            document.getElementById("user-video-forDisplay").src = videoURL
                            document.getElementById("user-video-forDisplay").onloadeddata = function () {
                                console.log("Canvas Loaded!");
                                $("#bggradient").fadeOut("fast")
                                document.getElementById("loadingIndicatorProfile").style.display = 'none'
                            };
                        } else {
                            document.getElementById("loadingIndicatorProfile").style.display = 'none'
                            document.getElementById("showErrorCanvas").style.display = ''
                        }
                    }).catch(error => {
                        //setNetworkStatus('off')
                        console.error(error);
                    });

                console.error(error);
            })
    } catch (error) {
        document.getElementById(`showUserInfoDiv-${friend}`).innerHTML = defaultArrow
        console.error("EVX Error:", error)
    }




}

function addFriend(el) {
    el.innerHTML = `<svg version="1.1" width="25px" height="25px"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <path fill="#fff"
                            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                            <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                                to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                        </path>
                    </svg>`
    const toAdd = sessionStorage.getItem("addFriendItem")
    fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&email=${localStorage.getItem("t50-email")}&password=${atob(localStorage.getItem("t50pswd"))}&todo=friendRequest&who=${toAdd}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (data === "Success") {
                el.innerHTML = `Request Sent.`
                aitPlay("request_sent")
                fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&todo=sentRequests`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(sent_req => {
                        if (sent_req !== "None") {
                            localStorage.setItem(`${localStorage.getItem("t50-username")}-sentRequests`, sent_req)
                            if (sent_req.includes(toAdd)) {
                                console.log("Change confirmed. 200")
                                play("completeProfile")
                            }
                        }
                    }).catch(error => {
                        console.error(error);
                    });
            } else {
                el.innerHTML = `An error occured`
            }
        }).catch(error => {
            el.innerHTML = `Request failed.`
            console.error(error);
        });
}

function acceptFriend(el) {
    el.innerHTML = `<svg version="1.1" width="25px" height="25px"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <path fill="#fff"
                            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                            <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                                to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                        </path>
                    </svg>`
    const toAdd = sessionStorage.getItem("addFriendItem")
    console.log("Accepting Request From", toAdd)
    fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&email=${localStorage.getItem("t50-email")}&password=${atob(localStorage.getItem("t50pswd"))}&todo=acceptRequest&who=${toAdd}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data)
            $("#acceptRequest").fadeOut("fast", function () {
                el.innerHTML = 'Accept Request'
            })


        }).catch(error => {
            console.error(error)
        })

}

function openMessages(e) {
    if (e && e.getAttribute("data-c") !== 'none') {
        console.log('Got attribute:', e.getAttribute("data-c"))
        const attr = e.getAttribute("data-c")
        hideUserProfile('nosound')
        //setTimeout(function() {
        //    hideSocial()
        //}, 300)
        hideSocial()
        const json = { username: attr, favorite: JSON.parse(localStorage.getItem("favorites") || "[]").includes(attr) };
        openChat(json, 'home')
    }
}

function hideUserProfile(nos) {
    if (!nos) {
        play("closePanel")
    }
    $("#openMessages").fadeOut("fast")
    document.getElementById("openMessages").setAttribute("data-c", 'none')
    $("#addFriend").fadeOut("fast")
    $("#requestSent").fadeOut("fast")
    $("#acceptRequest").fadeOut("fast")
    sessionStorage.removeItem("addFriendItem")
    //$("#bggradient").fadeIn("slow")
    loadBackground()
    document.getElementById("userProfile-back").style.opacity = '0'
    setTimeout(function () {
        document.getElementById("userProfile-back").style.display = 'none'
    }, 200)
    document.getElementById("user-profile").classList.remove('active')
    const socialPopup = document.getElementById("social")
    socialPopup.classList.add("active")
    document.getElementById("social-back").style.display = 'flex'
    setTimeout(function () {
        document.getElementById("social-back").style.opacity = '1'
    }, 200)
    document.getElementById("bottomActionsSocial").classList.add("visible")
}

function clickNanimate(part) {
    const menu_manage = document.getElementById("menu-manage")
    const menu_discover = document.getElementById("menu-discover")
    if (part === 'manage') {
        play("pickCatA")
        const workingElem = document.getElementById("manage-svg")
        workingElem.style.transform = 'scale(1.2)'
        setTimeout(function () {
            workingElem.style.transform = 'scale(1)'
        }, 150)
        menu_discover.classList.remove("active")
        menu_manage.classList.add("active")
        $("#social-discover").fadeOut("fast", function () {
            $("#social-users").fadeIn("fast")
        })
        loadFriendsSocial()
    } else if (part === 'discover') {
        play("pickCatB")
        const workingElem = document.getElementById("discover-svg")
        workingElem.style.transform = 'rotate(180deg) scale(1.2)'
        setTimeout(function () {
            workingElem.style.transform = 'rotate(0deg) scale(1)'
        }, 250)
        menu_discover.classList.add("active")
        menu_manage.classList.remove("active")
        $("#social-users").fadeOut("fast", function () {
            $("#social-discover").fadeIn("fast")
        })
        epsilonDiscover()
    } else if (part === 'notifAll') {
        play("pickCatB")
        const workingElem = document.getElementById("allnotifsvg")
        workingElem.style.transform = 'rotate(180deg) scale(1.2)'
        setTimeout(function () {
            workingElem.style.transform = 'rotate(0deg) scale(1)'
        }, 250)
        loadNotificationsAll(currentShowingNotifications)

        //menu_discover.classList.add("active")
        //menu_manage.classList.remove("active")
        //$("#social-users").fadeOut("fast", function () {
        //    $("#social-discover").fadeIn("fast")
        //})
        //epsilonDiscover()
    }
}

function bottomButtonPress(which, el) {
    //'library', 'addapp'
    if (which === 'library') {
        //const workingElem = document.getElementById("pressAnimationLibrary")
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            el.style.transform = 'scale(1)'
            setTimeout(function () {
                openPanel(which)
            }, 150)
        }, 200)
        //
    } else if (which === 'addapp') {
        //const workingElem = document.getElementById("pressAnimationAddapp")
        //workingElem.style.transform = 'rotate(180deg)'
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            setTimeout(function () {
                openPanel(which)
            }, 150)
        }, 200)
    } else if (which === 'launch') {
        //const workingElem = document.getElementById("pressAnimationAddapp")
        //workingElem.style.transform = 'rotate(180deg)'
        el.style.transform = 'scale(0.96)'
        document.getElementById("launchDisk").style.transform = 'rotate(1360deg)'
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = null;
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            if (activeAPP) {
                console.log("active app found, launching", activeAPP)
                if (stockApps.includes(activeAPP)) {
                    aitPlay(`launching_${activeAPP}`)
                }
                launchAppN(activeAPP)
            }
            setTimeout(function () {
                document.getElementById("launchDisk").style.transform = 'rotate(0deg)'
                const dotElement = document.querySelector('.dot');
                dotElement.style.animation = 'dotAnimation 1s infinite';
            }, 1150)
        }, 200)
    } else if (which === 'dismissNotification') {
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
        }, 200)
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = null;
        const url = new URL(window.location.href);

        // Create a new URL with only the desired path
        const newUrl = url.origin + url.pathname.split('?')[0];

        // Update the URL without reloading
        window.history.replaceState({}, document.title, newUrl);
        document.getElementById("container").style.display = null
        document.getElementById("notification-center").classList.remove("active")
        document.getElementById("gateway").style.display = 'flex'
        setTimeout(function () {
            document.getElementById("gateway").style.opacity = '1'
            $("#gatewayActions").fadeIn("fast")
        }, 50)
    } else if (which === 'deleteSlineMessage') {
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
        }, 200)

        deleteMessage()

    } else if (which === 'dismissSlineMessage') {

        sessionStorage.removeItem("pendingDeletion_message")
        sessionStorage.removeItem("pendingDeletion_username")
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            document.getElementById("message-edit-center").classList.remove("active")
        }, 200)


    } else if (which === 'downloadIOS') {
        el.style.transform = 'scale(0.96)'

        //backend testing
        const os_b = getOS();
        const osVersion_b = getOSVersion();

        if (os_b === 'IOS' || os_b === 'macOS') {
            setTimeout(function () {
                //workingElem.style.transform = 'rotate(0deg)'
                //el.style.transform = 'scale(1)'
                //document.getElementById("install-app").classList.remove("active")
                //setTimeout(function () {
                //    window.location.href = './internal/ios.mobileconfig'
                //}, 200)
                el.style.transform = 'scale(1)'
                document.getElementById("install-app").classList.remove("active")
                setTimeout(function () {
                    document.getElementById("gateway").style.filter = 'blur(7px)'
                    document.getElementById("gatewayActions").classList.add('top')
                    document.getElementById("cmn").style.display = 'none'
                    document.getElementById("cmn_1").innerHTML = `Install On IOS`
                    document.getElementById("cmn_dl").style.display = 'none'
                    document.getElementById("cmn_dis").innerHTML = 'Done'
                    document.getElementById("cmn_2").innerHTML = `1. Tap the Share button at the bottom of the screen.<br><br>2. In the share menu, scroll down and look for the "Add to Home Screen" option. Tap it.<br><br>3. Tap "Add"<br><br>4. The Evox App will appear on your home screen.`
                    document.getElementById("install-app").classList.add("active")
                }, 400)
            }, 200)
        } else if (os_b === 'Android' || os_b === 'Linux') {
            el.style.transform = 'scale(1)'
            document.getElementById("install-app").classList.remove("active")
            setTimeout(function () {
                document.getElementById("gateway").style.filter = 'blur(7px)'
                document.getElementById("gatewayActions").classList.add('top')
                document.getElementById("cmn").style.display = 'none'
                document.getElementById("cmn_1").innerHTML = `${os_b} requires some steps`
                document.getElementById("cmn_dl").style.display = 'none'
                document.getElementById("cmn_dis").innerHTML = 'Done'
                document.getElementById("cmn_2").innerHTML = `1. Tap the three vertical dots in the upper-right corner of your screen.<br><br>2. Select "Add to Home Screen."<br><br> 3. Tap "Add," and the Evox icon will appear on your home screen.`
                document.getElementById("install-app").classList.add("active")
            }, 400)
            //press the three dots on the top right of the screen
            //select Add to home screen
        } else {
            //hm. it looks like %os_b% isnt supported..
            el.style.transform = 'scale(1)'
            document.getElementById("install-app").classList.remove("active")
            setTimeout(function () {
                document.getElementById("gateway").style.filter = 'blur(7px)'
                document.getElementById("gatewayActions").classList.add('top')
                document.getElementById("cmn").style.display = 'none'
                document.getElementById("cmn_1").innerHTML = `Hmm, it looks like ${os_b} isn't supported`
                document.getElementById("cmn_dl").style.display = 'none'
                document.getElementById("cmn_dis").innerHTML = 'Dismiss'
                document.getElementById("cmn_2").innerHTML = `To install the Evox Nexus app you need a mobile device.<br><br>The Evox App cannot be installed on desktops or non-mobile devices.<br><br>If the issue persists contact support.`
                document.getElementById("install-app").classList.add("active")
            }, 400)
        }




    } else if (which === 'dismissDownload') {
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            document.getElementById("install-app").classList.remove("active")
            document.getElementById("gateway").style.filter = ''
            document.getElementById("gatewayActions").classList.remove('top')
        }, 200)


    } else if (which === 'dismissDownloadDontAsk') {
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
            localStorage.setItem("trusted_web", 'true')
            document.getElementById("install-app").classList.remove("active")
            document.getElementById("gateway").style.filter = ''
            document.getElementById("gatewayActions").classList.remove('top')
        }, 200)


    } else {
        el.style.transform = 'scale(0.96)'
        setTimeout(function () {
            //workingElem.style.transform = 'rotate(0deg)'
            el.style.transform = 'scale(1)'
        }, 200)
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = null;
    }
}


let appsDictionary = null
let dictionary_ready = false
function createDictionary() {
    console.log(appsDictionary);

    const email = localStorage.getItem("t50-email");
    const url = `${srv}/applications?method=dictionary&apps=${encodeURIComponent(JSON.stringify(stockApps))}&email=${encodeURIComponent(email)}`;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(dict => {
                localStorage.setItem("last_dictionary", JSON.stringify(dict));
                appsDictionary = dict;
                dictionary_ready = true;
                resolve(dict);  // Resolve the promise with the dictionary
            })
            .catch(error => {
                console.log('Dictionary Error:', error);
                const cachedDictionary = localStorage.getItem("last_dictionary");

                if (cachedDictionary) {
                    appsDictionary = JSON.parse(cachedDictionary);
                    dictionary_ready = true;
                    resolve(appsDictionary);  // Resolve with cached dictionary
                } else {
                    console.error("Cannot reach the server to get app dictionary");
                    reject("Cannot reach the server and no cached dictionary found");  // Reject the promise on failure
                }
            });
    });
}

function processAppUrl(appName) {
    return new Promise((resolve, reject) => {
        if (dictionary_ready) {
            if (appName) {
                const match = appsDictionary[appName];
                if (match) {
                    return resolve(match.src);  // Resolve the promise immediately if dictionary is ready
                } else {
                    return reject(new Error("App not found in dictionary"));
                }
            }
        } else {
            // Create the dictionary and check for readiness
            createDictionary();

            const bIn = setInterval(function () {
                if (dictionary_ready === true) {
                    if (appName) {
                        const match = appsDictionary[appName];
                        if (match) {
                            clearInterval(bIn); // Clear the interval once the dictionary is ready
                            return resolve(match.src); // Resolve the promise with the match src
                        } else {
                            clearInterval(bIn);
                            return reject(new Error("App not found in dictionary"));
                        }
                    }
                }
            }, 50); // Check every 50ms
        }
    });
}


function launchAppN(app) {
    if (aitAttached === false) {
        play('launch')
    }

    sessionStorage.setItem("EmitApp", app);
    sessionStorage.removeItem("extRun");
    setTimeout(function () {
        processAppUrl(app)
            .then((url) => {
                document.getElementById("launchApp").src = url;
            })
            .catch((error) => {
                console.error("Error:", error.message);
            });
    }, 1100)
    $("#iframeContainer").fadeIn("slow")
    $("#launchApp").fadeIn("slow")
    setTimeout(function () {
        const appFrame = setInterval(() => {
            if (sessionStorage.getItem("extRun") === "back" ||
                (document.getElementById("launchApp").contentWindow.location.href.includes("PreloadApp.html"))) {

                console.log("Hiding App Frame User Returned To Gateway");

                activeInterval = null;
                play("quit")

                document.getElementById("launchApp").src = "PreloadApp.html";
                $("#launchApp").fadeOut("slow");

                $("#iframeContainer").fadeOut("slow");

                sessionStorage.removeItem("extRun");
                clearInterval(appFrame);
                acd()
                $("#apps").fadeIn("fast")
            } else {
                console.log(`Current: ${document.getElementById("launchApp").contentWindow.location.href}`);
            }
        }, 100);
    }, 2000)

    setTimeout(function () {
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = null;
        var imgElement = activeAppThis.querySelector('img');
        imgElement.style.borderRadius = null
        imgElement.overflow = null
        document.getElementById("gatewayExploreScroll").style.marginTop = '70px'
        $("#bottomButtonsFocus").fadeOut("fast", function () {
            $("#bottomButtonsDefault").fadeIn("fast")

        })
        activeAppThis.classList.remove('fullscreen');
        document.body.classList.remove('no-scroll');
        document.getElementById("gatewayActions").classList.remove("top")
        document.getElementById("card-oasa").style.transform = null
        document.getElementById("card-secureline").style.transform = null
        document.getElementById("card-social").style.transform = null
        document.getElementById("card-settings").style.transform = null
        const attr = activeAppThis.id
        setTimeout(function () {
            // Assuming attr is a string that includes a number (e.g., "1", "2", etc.)
            let totalApps = stockApps.length;  // You can change this number depending on how many apps you have

            // Get the number from the attr variable
            let selectedApp = attr.match(/\d+/)[0];

            // Hide all apps initially
            $("[id^='app']").hide();

            // Fade in all apps except the selected one
            for (let i = 1; i <= totalApps; i++) {
                if (i != selectedApp) {
                    $(`#app${i}`).fadeIn("fast");
                }
            }

            // Set the `add` variable to the selected app ID
            add = `app${selectedApp}`;

        }, 500)
        activeAPP = null
        activeAppThis = null
    }, 1200)

}

function openPanel(which) {
    //accept library and addapp as values
}

function backgroundSwitch(colorScheme) { //purple, blue, default
    const root = document.documentElement;
    $("#background").fadeOut("fast", function () {
        switch (colorScheme) {
            case "purple":

                root.style.setProperty('--color-bg1', 'rgba(108, 0, 162, 1)');
                root.style.setProperty('--color-bg2', 'rgba(0, 17, 82, 1)');
                root.style.setProperty('--color1', '76, 0, 162');
                root.style.setProperty('--color2', '0, 82, 139');
                root.style.setProperty('--color3', '0, 160, 176');
                root.style.setProperty('--color4', '103, 93, 98');
                root.style.setProperty('--color5', '17, 19, 26');
                root.style.setProperty('--color-interactive', '140, 100, 255');
                $("#background").fadeIn("fast")
                break;
            case "blue":
                root.style.setProperty('--color-bg1', 'rgba(0, 17, 82, 1)');
                root.style.setProperty('--color-bg2', 'rgba(0, 105, 224, 1)');
                root.style.setProperty('--color1', '0, 43, 109');
                root.style.setProperty('--color2', '0, 82, 139');
                root.style.setProperty('--color3', '0, 160, 224');
                root.style.setProperty('--color4', '68, 85, 104');
                root.style.setProperty('--color5', '15, 18, 35');
                root.style.setProperty('--color-interactive', '60, 160, 255');
                $("#background").fadeIn("fast")
                break;
            case "default":
                root.style.setProperty('--color-bg1', 'rgba(76, 0, 162, 0)');
                root.style.setProperty('--color-bg2', 'rgba(0, 82, 59, 0)');
                root.style.setProperty('--color1', '9, 43, 109');
                root.style.setProperty('--color2', '0, 105, 224');
                root.style.setProperty('--color3', '76, 223, 229');
                root.style.setProperty('--color4', '103, 93, 98');
                root.style.setProperty('--color5', '17, 19, 26');
                root.style.setProperty('--color-interactive', '140, 100, 255');
                $("#background").fadeIn("fast")
                break;
            default:
                console.error("Unknown color scheme: " + colorScheme);
                break;

        }
    })

}

function settingsOpen(panel) {
    play('openSettings')
    //panel -> security or epsilon

    //hiding previous may shown divs
    document.getElementById("settings-personal").style.display = 'none'
    document.getElementById("settings-customize").style.display = 'none'
    document.getElementById("settings-about").style.display = 'none'
    document.getElementById("settings-notifications").style.display = 'none'
    document.getElementById("settings-name").style.display = 'none'
    if (document.getElementById("changeBackgroundSlider").classList.contains("expanded")) {
        changeBackgroundSlider(document.getElementById("changeBackgroundSlider"))
    }

    //reset heights
    document.getElementById("settings").style.height = '235px'
    settingsGrabCloseTrigger = 694
    hideThreshold = 100
    if (panel === 'security') {
        document.getElementById("settings").style.height = '285px'
        settingsGrabCloseTrigger = 662
        document.getElementById("accountSettingsIcon").style.transform = 'rotate(40deg)'
        setTimeout(function () {
            document.getElementById("accountSettingsIcon").style.transform = 'rotate(0deg)'
        }, 200)
        setTimeout(function () {
            document.getElementById("settings-security").style.display = ''
            document.getElementById("settings-epsilon").style.display = 'none'
            document.getElementById("gatewayExploreScroll").style.transform = 'scale(0.97)'
            document.getElementById("gatewayExploreScroll").style.filter = 'blur(5px)'
            document.body.style.overflow = 'hidden'
            if (scrolling === true) {
                console.log("Disabling Scrolling")
                disableScroll()
            }

            document.getElementById("gatewayActions").classList.add("top")
            const popup = document.getElementById("settings")
            popup.classList.add("active")
        }, 400)
    } else if (panel === 'epsilon') {
        document.getElementById("epsilonSettingsIcon").style.transform = 'scale(0.8)'
        setTimeout(function () {
            document.getElementById("epsilonSettingsIcon").style.transform = 'scale(1.2)'
        }, 200)
        setTimeout(function () {

            document.getElementById("settings-security").style.display = 'none'
            document.getElementById("settings-epsilon").style.display = ''
            document.getElementById("gatewayExploreScroll").style.transform = 'scale(0.97)'
            document.getElementById("gatewayExploreScroll").style.filter = 'blur(5px)'
            document.body.style.overflow = 'hidden'
            if (scrolling === true) {
                console.log("Disabling Scrolling")
                disableScroll()
            }
            document.getElementById("gatewayActions").classList.add("top")
            const popup = document.getElementById("settings")
            popup.classList.add("active")
        }, 400)

    }
}

let hasSoundPlayed = false
function hideSettings() {
    countBtnClick = 0
    if (!hasSoundPlayed) {
        play('closeSettings')
        hasSoundPlayed = true
        setTimeout(function () {
            hasSoundPlayed = false
        }, 1000)
    }

    document.getElementById("gatewayExploreScroll").style.transform = ''
    document.getElementById("gatewayExploreScroll").style.filter = ''
    const popup = document.getElementById("settings")
    document.getElementById("gatewayActions").classList.remove("top")
    popup.classList.remove("active")

    if (scrolling === false) {
        console.log("Enabling Scrolling")
        enableScroll()
    }
    setTimeout(function () {
        document.body.style.overflow = ''
    }, 500)
}

function attachSettingsData(data, container) {// data -> personal, security, cypher
    setTimeout(function () {//set to allow the user to view the onhover effect
        if (data) {
            if (document.getElementById(`settings-${data}`)) {
                let hiding = null
                if (container === 1) {
                    hiding = "#settings-security"
                } else if (container === 3) {
                    hiding = "#settings-personal"
                } else if (container === 2) {
                    hiding = "#settings-epsilon"
                } else {
                    warn(`Cannot attach ${data} on settings.<br>Error Code: EBETAMISS_CONT`)
                    return;
                }
                $(hiding).fadeOut("fast", function () {
                    $(`#settings-${data}`).fadeIn("fast")
                })
                if (data === 'customize') {
                    settingsGrabCloseTrigger = 726
                    document.getElementById("settings").style.height = '200px'
                }
                if (data === 'personal') {
                    pickRandFromDict('personal_info')
                    settingsGrabCloseTrigger = 527
                    loadPersonal()
                    document.getElementById("settings").style.height = '400px'
                }
                if (data === 'name') {
                    settingsGrabCloseTrigger = 726
                    document.getElementById("settings").style.height = '250px'
                }
                if (data === 'about') {
                    loadAppAbout()
                    settingsGrabCloseTrigger = 520
                    hideThreshold = 618
                    document.getElementById("settings").style.height = '435px'
                }
                if (data === 'notifications') {
                    loadFlorida()
                }
            } else {
                console.log("EBETA404")
                warn(`Cannot attach ${data} on settings.<br>Error Code: EBETA404`)
            }
        }
    }, 100)
}

function loadPersonal() {
    const myUser = localStorage.getItem("t50-username")
    fetch(`${srv}/accounts?method=getName&username=${myUser}`)
        .then(response => response.text())
        .then(name => {
            document.getElementById("name-preview").innerHTML = document.getElementById("name-preview").innerHTML.replace("null", name)
            if (name !== 'Unknown') {
                const parts = name.split(' ');
                const result = [`${parts[0]} `, parts[1]];
                document.getElementById("nameInput").value = result[0]
                document.getElementById("lastInput").value = result[1]
            }
        })
        .catch(error => {
            console.log('Name Error:', error);
        });
    document.getElementById("email-preview").innerHTML = document.getElementById("email-preview").innerHTML.replace("null", localStorage.getItem("t50-email"))
    document.getElementById("username-preview").innerHTML = document.getElementById("username-preview").innerHTML.replace("null", localStorage.getItem("t50-username"))
    fetch(`${srv}/accounts?what=getPhone&username=${myUser}&password=${atob(localStorage.getItem("t50pswd"))}`)
        .then(response => response.text())
        .then(phone => {
            const number = phone.replace("+30-", '')
            document.getElementById("phone-preview").innerHTML = document.getElementById("phone-preview").innerHTML.replace("null", number)
        })
        .catch(error => {
            console.log('phone Error:', error);
        });
    fetch(`${srv}/authip?method=Eget&email=${localStorage.getItem("t50-email")}&ip=null&username=${myUser}&password=${atob(localStorage.getItem("t50pswd"))}`)
        .then(response => response.text())
        .then(status => {
            if (status === 'IP is Mapped') {
                document.getElementById("2fa-preview").innerHTML = document.getElementById("2fa-preview").innerHTML.replace("Unknown", 'Disabled')
            } else {
                console.log("Status 2fa:", status)
                document.getElementById("2fa-preview").innerHTML = document.getElementById("2fa-preview").innerHTML.replace("Unknown", 'Enabled')
            }

        })
        .catch(error => {
            console.log('phone Error:', error);
        });
}

function getOS() {
    const userAgent = navigator.userAgent;
    let operatingSystem = 'Unknown';

    if (userAgent.includes('Windows NT')) {
        operatingSystem = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
        operatingSystem = 'macOS';
    } else if (userAgent.includes('Linux')) {
        operatingSystem = 'Linux';
    } else if (userAgent.includes('Android')) {
        operatingSystem = 'Android';
    } else if (userAgent.includes('iOS')) {
        operatingSystem = 'iOS';
    }

    return operatingSystem;
}

function getOSVersion() {
    const userAgent = navigator.userAgent;
    let osVersion = 'Unknown';

    if (userAgent.includes('Windows NT')) {
        osVersion = userAgent.split('Windows NT ')[1].split(';')[0];
    } else if (userAgent.includes('Mac OS')) {
        osVersion = userAgent.split('Mac OS ')[1].split(')')[0];
    } else if (userAgent.includes('Linux')) {
        osVersion = 'Linux'; // Linux doesn't typically have a version string in userAgent
    } else if (userAgent.includes('Android')) {
        osVersion = userAgent.split('Android ')[1].split(';')[0];
    } else if (userAgent.includes('iPhone OS')) {
        osVersion = userAgent.split('iPhone OS ')[1].split(' ')[0].replace(/_/g, '.');
    } else if (userAgent.includes('iPad OS')) {
        osVersion = userAgent.split('iPad OS ')[1].split(' ')[0].replace(/_/g, '.');
    }

    return osVersion;
}
const os = getOS();
const osVersion = getOSVersion();

console.log('Operating System:', os);
console.log('Operating System Version:', osVersion);

function loadFlorida() {
    if (localStorage.getItem("extV")) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('./epsilon-serviceWorker.js')
                .then(function (swReg) {
                    console.log('Service Worker is registered', swReg);

                    // Request permission for notifications
                    return swReg.pushManager.getSubscription()
                        .then(function (subscription) {
                            if (!subscription) {
                                return swReg.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array('BA15u7YIY1VPm9ulrTmaG_dTL1tJj59pso6K46lc2i45u-r1bmdl1t6KOrHxMmzyn8ZDQelik0mGn_blW9gAhg4')
                                });
                            }
                            return subscription;
                        });
                })
                .then(function (subscription) {
                    console.log('User is subscribed:', subscription);
                    document.getElementById('florida_status').innerHTML = 'Active'
                    document.getElementById("deviceId").innerHTML = localStorage.getItem("extV")
                })
                .catch(function (error) {
                    console.error('Service Worker Error', error);
                });
        }
    }
}

function enableFlorida() {
    console.log("Working")
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('./epsilon-serviceWorker.js')
            .then(function (swReg) {
                console.log('Service Worker is registered', swReg);

                // Request permission for notifications
                return swReg.pushManager.getSubscription()
                    .then(function (subscription) {
                        if (!subscription) {
                            return swReg.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array('BA15u7YIY1VPm9ulrTmaG_dTL1tJj59pso6K46lc2i45u-r1bmdl1t6KOrHxMmzyn8ZDQelik0mGn_blW9gAhg4')
                            });
                        }
                        return subscription;
                    });
            })
            .then(function (subscription) {
                console.log('User is subscribed:', subscription);

                if (!localStorage.getItem("extV")) {
                    const url = `${srv}/floridaV?getWhat=anId&forUser=${localStorage.getItem("t50-username")}&os1=${os}&osVersion=${osVersion}`;
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(data => {
                            localStorage.setItem("extV", data)
                            console.log('Fetched data:', data);
                            const evoxJson = {
                                'subscription': subscription,
                                'username': localStorage.getItem("t50-username"),
                                'email': localStorage.getItem("t50-email"),
                                'id': data
                            }
                            document.getElementById("deviceId").innerHTML = data
                            // Send subscription to server
                            fetch('https://florida.evoxs.xyz/subscribe', {
                                method: 'POST',
                                body: JSON.stringify(evoxJson),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(() => {
                                    loadFlorida()
                                    console.log('Request completed');
                                    warn("Welcome To Florida")
                                    aitPlay('push_notifications_enabled')
                                })
                                .catch(error => {
                                    warn('There was a problem with the fetch operation:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                } else {
                    console.log("Id exists", localStorage.getItem("extV"));
                }

            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    }
}

let openSlider = false
function changeBackgroundSlider(elem) {
    const gradient = localStorage.getItem("customEpsilonGradient")
    if (gradient) {
        try {
            document.getElementById(`grad-${gradient}`).classList.add('current')
        } catch (error) {
            console.warn(`Local: ${gradient}\nError: ${error}`)
            document.getElementById(`grad-default`).classList.add('current')
        }

    } else {
        document.getElementById(`grad-default`).classList.add('current')
    }


    elem.classList.toggle('expanded');

    if (openSlider) {
        openSlider = false
        document.getElementById("backgroundOpenSlider").style.transform = 'rotate(90deg)';
        document.getElementById("settings").style.height = '200px';
    } else {
        openSlider = true
        document.getElementById("backgroundOpenSlider").style.transform = 'rotate(270deg)';
        document.getElementById("settings").style.height = '280px';
    }
    //$("#bgBox").fadeIn("fast");  // Show the bgBox with fade-in effect
}

function changeBackground(event, background) {
    event.stopPropagation();
    document.getElementById(`grad-default`).classList.remove('current')
    document.getElementById(`grad-blue`).classList.remove('current')
    document.getElementById(`grad-purple`).classList.remove('current')

    console.log("Stopped Slider Toggle", background)
    document.getElementById(`grad-${background}`).classList.add('current')
    backgroundSwitch(background) //purple, blue, default
    localStorage.setItem('customEpsilonGradient', background)
    syncOptions("background", background)
}

function editMessage(event, elem, id, sender) {
    //message-${type}${countMessages}-${message.sender}
    event.stopPropagation();
    const innerHtml = document.getElementById(id).innerHTML
    document.getElementById("message-edit-center").classList.add("active")
    sessionStorage.setItem("pendingDeletion_message", innerHtml)
    sessionStorage.setItem("pendingDeletion_username", sender)
    document.getElementById("message-edit-inner").innerHTML = innerHtml
    document.getElementById("msgBy").innerText = `Message By ${sender}`
    console.log("Success", innerHtml)
}

function updateServiceWorkerCache() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: 'UPDATE_CACHE'
        });
    } else {
        console.log('No active service worker found.');
    }
}

let manualUpdate = false;

function updateServiceWorkerCacheAndReload() {
    return new Promise((resolve, reject) => {
        if (!navigator.serviceWorker.controller) {
            console.log('No active service worker found.');
            return reject(new Error('No active service worker found.'));
        }

        function onMessage(event) {
            if (event.data && event.data.action === 'CACHE_UPDATED') {
                navigator.serviceWorker.removeEventListener('message', onMessage);
                resolve();
            }
        }

        navigator.serviceWorker.addEventListener('message', onMessage);

        // Initiate cache update
        updateServiceWorkerCache();
        manualUpdate = true;

        // Handle potential issues
        setTimeout(() => {
            navigator.serviceWorker.removeEventListener('message', onMessage);
            reject(new Error('Cache update timed out.'));
        }, 10000); // 10 seconds timeout
    }).then(() => {
        // Reload the page after cache update is confirmed
        function verifyRel() {
            if (document.getElementById("update-center").classList.includes("active")) {
                verifyRel()
            } else {
                setTimeout(function () {
                    window.location.reload();
                }, 1500)

            }
        }
        verifyRel()


    }).catch(error => {
        console.warn('Service Worker Update Failed.<br>Evox Is Reloading..');
        console.error(error);
        window.location.reload(); // Fallback to reload even on error
    });
}


let activeTab = 'Explore';
let wasGatewayActionsActive = false;
let isProfileTabActive = false;
function enableTab(element) {
    const old = activeTab
    if (element.innerHTML !== 'svg') {
        document.getElementById(`tab-${activeTab.toLowerCase()}`).classList.remove("active")
    }

    if (element.innerHTML.includes("svg")) {// && !element.classList.contains("active")
        activeTab = 'svg'
        element.mirror.innerHTML = `Settings <svg id='awn' style="margin-left: 3px;
                        display: none;
                        align-items: center;
                        vertical-align: middle;" version="1.1" width="20px" height="20px"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                            <path fill="#fff"
                                d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                                <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                                    to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                            </path>
                        </svg>`
        $("#awn").fadeIn("fast")
        //element.style.transform = 'rotate(490deg)'
        //element.classList.add("color")
        //element.classList.add("active")
        aitPlay("reloading")
        setTimeout(function () {
            updateServiceWorkerCacheAndReload()
        }, 1400)
    } else if (element.innerHTML.includes("Explore") && !element.classList.contains("active")) {

        isProfileTabActive = false
        play('closeProfile')
        if (wasGatewayActionsActive === true) {
            document.getElementById("gatewayActions").classList.remove("back") //gia tora axristo
            wasGatewayActionsActive = false
        } else {
            document.getElementById("gatewayActions").classList.remove("back")
        }
        activeTab = 'Explore'
        element.classList.add("active")
        document.getElementById("profileContainer").classList.remove('active')
        setTimeout(function () {
            document.getElementById("profileContainer").style.display = 'none'
            document.getElementById("gateway").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("gateway").style.opacity = '1'
            }, 50)
        }, 200)
        $("#bggradient").fadeIn("slow")
    } else if (element.innerHTML.includes("Profile") && !element.classList.contains("active") || element.innerHTML.includes("Profile") && element.classList.contains("animate")) {
        pickRandFromDict('profile')
        console.log("Attaching Profile")
        if (isProfileTabActive) {
            element.classList.add("active")
            console.log("Reloading Total")
            loadProfile('reload')
            return;
        }
        isProfileTabActive = true
        if (document.getElementById("gatewayActions").classList.contains("back")) {
            wasGatewayActionsActive = true
        }
        loadProfile(null, 'withoutCanvas')
        document.getElementById("gatewayActions").classList.add("back")
        activeTab = 'Profile'
        element.classList.add("active")
        play("openProfile")
        document.getElementById("gateway").style.opacity = '0'
        setTimeout(function () {
            document.getElementById("gateway").style.display = 'none'
            document.getElementById("profileContainer").style.display = 'flex'
            setTimeout(function () {
                document.getElementById("profileContainer").classList.add('active')
            }, 50)
        }, 200)
    } else if (element.innerHTML.includes("News") && !element.classList.contains("active") || element.innerHTML.includes("News") && element.classList.contains("animate")) {
        isProfileTabActive = false
        play('closeProfile')
        if (wasGatewayActionsActive === true) {
            document.getElementById("gatewayActions").classList.remove("back") //gia tora axristo
            wasGatewayActionsActive = false
        } else {
            document.getElementById("gatewayActions").classList.remove("back")
        }
        activeTab = 'News'
        element.classList.add("active")
        document.getElementById("profileContainer").classList.remove('active')
        setTimeout(function () {
            document.getElementById("profileContainer").classList.remove('active')
            //document.getElementById("profileContainer").style.display = 'none'
            //document.getElementById("gateway").style.display = 'flex'
            //setTimeout(function () {
            //    document.getElementById("gateway").style.opacity = '1'
            //}, 50)
        }, 200)
        $("#bggradient").fadeIn("slow")
    } else {
        console.log("Nothing found")
        return;
    }
    console.log(`Hit. Changed From ${old} to ${activeTab}`)

}

function showFriendsFromProfile() {

    showSocial(document.getElementById("social-manage"))
    setTimeout(function () {
        enableTab(document.getElementById("tab-explore"))
    }, 350)
}

function editBirthdate() { //from profile
    play('clickProfile')

    if (!document.getElementById("birthdatePopup").classList.contains("active")) {
        const fullDate = document.getElementById("self-birthdate").innerText
        const years = document.getElementById("self-age").innerText
        document.getElementById("showBirthText").innerText = getRandomSentence(years)
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][parseInt(fullDate.split('/')[1], 10) - 1];
        const day = fullDate.split('/')[0];
        const year = fullDate.split('/').pop();
        const fullDateText = `It all began on the ${getOrdinal(day)} of ${monthName} ${year}, when you were born.`
        document.getElementById("moreBirthInfo").innerText = fullDateText
        document.getElementById("nextBirthday").innerHTML = `You will be ${Number(years) + 1} years old in ${getDaysUntilNextBirthday(fullDate)} days! 🎂`
        document.getElementById("birthdatePopup").classList.add("active")

    } else {
        document.getElementById("birthdatePopup").classList.remove("active")
    }



}

let activeAPP = null
let activeAppThis = null
function animateM(e, app) {
    document.getElementById("gatewayExploreScroll").style.overflow = 'hidden'
    const item = e
    const isZoomed = item.classList.contains('fullscreen');
    const attr = item.id
    console.log('attr:', attr)


    // Reset all other images to their original state
    //document.querySelectorAll('.zoomable').forEach(el => {
    //    el.classList.remove('fullscreen');
    //});

    // Toggle the fullscreen state
    if (!isZoomed) {
        activeAPP = app
        activeAppThis = e
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = 'dotAnimation 1s infinite';
        item.classList.add('fullscreen');
        var imgElement = item.querySelector('img');
        document.body.classList.add('no-scroll');
        document.getElementById("gatewayExploreScroll").style.marginTop = '10px'
        $("#bottomButtonsDefault").fadeOut("fast", function () {
            $("#bottomButtonsFocus").fadeIn("fast")
        })
        document.getElementById("gatewayActions").classList.add("top")
        document.getElementById("card-oasa").style.transform = 'translateY(150%)'
        document.getElementById("card-secureline").style.transform = 'translateY(250%)'
        document.getElementById("card-social").style.transform = 'translateY(150%)'
        document.getElementById("card-settings").style.transform = 'translateY(150%)'
        let add = null
        let totalApps = stockApps.length;  // Set the number of apps you have

        // Get the number from the attr variable
        let selectedApp = attr.match(/\d+/)[0];

        // Fade out all apps except the selected one
        for (let i = 1; i <= totalApps; i++) {
            if (i != selectedApp) {
                $(`#app${i}`).fadeOut("fast");
            }
        }

        // Set the `add` variable to the selected app ID
        add = `app${selectedApp}`;

        setTimeout(function () {

            document.getElementById("apps").insertBefore(document.getElementById(add), document.getElementById("apps").firstChild);
        }, 500)

    } else {
        document.getElementById("gatewayExploreScroll").style.overflow = null
        activeAPP = null
        activeAppThis = null
        const dotElement = document.querySelector('.dot');
        dotElement.style.animation = null;
        var imgElement = item.querySelector('img');
        imgElement.style.borderRadius = null
        imgElement.overflow = null
        document.getElementById("gatewayExploreScroll").style.marginTop = '70px'
        $("#bottomButtonsFocus").fadeOut("fast", function () {
            $("#bottomButtonsDefault").fadeIn("fast")

        })
        item.classList.remove('fullscreen');
        document.body.classList.remove('no-scroll');
        document.getElementById("gatewayActions").classList.remove("top")
        document.getElementById("card-oasa").style.transform = null
        document.getElementById("card-secureline").style.transform = null
        document.getElementById("card-social").style.transform = null
        document.getElementById("card-settings").style.transform = null
        setTimeout(function () {
            let totalApps = stockApps.length;  // Set the number of apps you have

            // Get the number from the attr variable
            let selectedApp = attr.match(/\d+/)[0];

            // Fade in all apps except the selected one
            for (let i = 1; i <= totalApps; i++) {
                if (i != selectedApp) {
                    $(`#app${i}`).fadeIn("fast");
                }
            }

            // Set the `add` variable to the selected app ID
            add = `app${selectedApp}`;

        }, 500)


    }
}

// Optional: Close zoom when clicking outside the image
//document.addEventListener('click', function (event) {
//    if (!event.target.closest('.zoomable img')) {
//        document.querySelectorAll('.zoomable.fullscreen').forEach(el => {
//            el.classList.remove('fullscreen');
//        });
//        document.body.classList.remove('no-scroll');
//    }
//});

function toogleSounds() {

    const soundsStatus = localStorage.getItem("epsilonSounds")
    if (soundsStatus === 'false') {
        localStorage.setItem("epsilonSounds", 'true')
        document.getElementById("sounds-status").innerText = 'On'
        play('confirm')
    } else if (!soundsStatus || soundsStatus === 'true') {
        play('confirm')
        localStorage.setItem("epsilonSounds", 'false')
        document.getElementById("sounds-status").innerText = 'Off'

    }
}

function syncOptions(container, stringified) {
    if (container === 'favorites') {
        fetch(`${srv}/options?username=${localStorage.getItem("t50-username")}&password=${atob(localStorage.getItem("t50pswd"))}&email=${localStorage.getItem("t50-email")}&optionType=favorites&optionValue=${stringified}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(optionsRes => {
                if (optionsRes) {
                    console.log("Sync With Server Complete [Favs]")
                }
            }).catch(error => {
                console.error(error);
            });
    } else if (container === 'background') {
        fetch(`${srv}/options?username=${localStorage.getItem("t50-username")}&password=${atob(localStorage.getItem("t50pswd"))}&email=${localStorage.getItem("t50-email")}&optionType=background&optionValue=${stringified}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(optionsRes => {
                if (optionsRes) {
                    console.log("Sync With Server Complete [Bg]")
                }
            }).catch(error => {
                console.error(error);
            });
    }
}

function deleteMessage() {
    const baseSVG = `<svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px"
                    viewBox="0 0 24 24" fill="none">
                    <path d="M4 7H20" stroke="#dbdde3" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#dbdde3"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#dbdde3"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>`
    //document.getElementById("animate1").style.transform = 'rotate(20deg)'
    document.getElementById("animateAMessDel").classList.add("shakeEasy")
    function runFinal() {
        fetch(`https://data.evoxs.xyz/secureline?method=DeleteMessage&username=${localStorage.getItem("t50-username")}&recipient_username=${sessionStorage.getItem("current_sline")}&whosentit=${sentItBy}&message=${message}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {

                if (data === "Deleted Message") {

                } else if (data === "Complete") {

                    //deleted all messages
                } else if (data === "Cannot delete sender's message") {

                    setTimeout(function () {
                        document.getElementById("animateAMessDel").classList.remove("shakeEasy")
                    }, 750)
                    document.getElementById("deletingMessage").innerHTML = 'Failed!'
                    setTimeout(function () {
                        document.getElementById("deletingMessage").innerHTML = 'Delete'
                    }, 5000)
                    return;

                } else {

                }

                setTimeout(function () {
                    document.getElementById("animateAMessDel").classList.remove("shakeEasy")
                    document.getElementById("message-edit-center").classList.remove("active")
                }, 750)


                sessionStorage.removeItem("pendingDeletion_message")
                sessionStorage.removeItem("pendingDeletion_username")


            }).catch(error => {
                setTimeout(function () {
                    document.getElementById("animateAMessDel").classList.remove("shakeEasy")
                }, 750)
                console.error(error)
            })

    }
    const message = sessionStorage.getItem("pendingDeletion_message")
    let sentItBy = sessionStorage.getItem("pendingDeletion_username")
    if (sentItBy === localStorage.getItem("t50-username")) {
        sentItBy = 'me'
        runFinal()
    } else {
        runFinal()
    }
}

//window.addEventListener('scroll', function () {
//    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//    let documentHeight = document.documentElement.scrollHeight;
//    let windowHeight = window.innerHeight;
//
//    if (scrollTop > 0) {
//        console.log('Scrolling...');
//        if(chatsVisible === true) {
//            showHideGalaxy(document.getElementById("showHideClick"))
//        }
//
//    }
//
//    if (scrollTop + windowHeight >= documentHeight) {
//        console.log('Reached the bottom!');
//    }
//});

function beginRegistration(el) {
    if (el.classList.contains("shake")) { return; }
    el.classList.add("shake")
    setTimeout(function () {
        el.classList.remove("shake")
    }, 2000)
    play('error')
    setTimeout(function () {
        aitPlay("register_off")

    }, 100)
}
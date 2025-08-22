const owner = "HackerXYT";
const repo = "Project-Evox";
let srv = "https://data.evoxs.xyz"
let ip = "error";

const updates = []

function accessUpdates() {
    const container = document.getElementById("updates")
    container.innerHTML = ""
    updates.forEach((update, index) => {
        setTimeout(() => {
            if (update.appname === "Unknown") return;

            // Check if element already exists
            let existing = document.getElementById(update.id);
            if (existing) {
                if (update.appname !== existing.querySelector("p").innerText) {
                    existing.querySelector("p").innerHTML += ` & ${update.appname}`;
                    existing.querySelector(".bottomRow vox").innerHTML += `<br>Version: ${update.version}`;
                }
                return;
            }

            // Create element properly
            const div = document.createElement("div");
            div.id = update.id;
            div.className = "updateBox fade-in-slide-up"; // Add the animation class directly
            div.style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
            url("${findBanner(update.appname)}") center/cover no-repeat`;

            div.innerHTML = `
            <p>${update.appname}</p>
            <span>${update.title}</span>
            <div class="bottomRow">
                <vox>Version ${update.version}</vox>
                <vo>${formatDate(update.date)}</vo>
            </div>
        `;

            container.appendChild(div); // Append without touching other elements
        }, 100 * index);
    });

}

function formatDate(isoString) {
    const date = new Date(isoString);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // function to get ordinal suffix
    function ordinalSuffix(n) {
        if (n >= 11 && n <= 13) return n + "th"; // special case for 11-13
        switch (n % 10) {
            case 1: return n + "st";
            case 2: return n + "nd";
            case 3: return n + "rd";
            default: return n + "th";
        }
    }

    return `${month} ${ordinalSuffix(day)} ${year}`;
}

function findApp(str) {
    const dictionary = {
        "OASA BETA": ["OASAR", "OASA-Resign", "OASA Resign", "OASA", "Resign"],
        "Epsilon Nexus": ["Epsilon", "Nexus", "Epsilon Beta"],
        "Index": ["Evox Index", "Evox-I", "Index", "EVOXI"]
    };

    const normalize = s => s.toLowerCase(); // simple lowercase normalization

    const normalizedStr = normalize(str);

    for (const [appName, names] of Object.entries(dictionary)) {
        for (const name of names) {
            if (normalize(name) === normalizedStr) {
                return appName;
            }
        }
    }


    return null;
}

function findBanner(appname) {
    const dictionary = {
        "OASA BETA": "/oasaResign/splashScreens/apple-splash-2208-1242.png",
        "Epsilon Nexus": "/evox-epsilon-beta/epsilon-assets/apple-splash-dark-2360-1640.png",
        "Index": "/evox-epsilon/epsilon-assets/apple-splash-2732-2048.jpg"
    }

    return dictionary[appname]
}

function showlogin() {
    const login = document.getElementById("login");
    const boxes = login.querySelectorAll(".box"); // get all .box elements

    login.classList.add("active");

    login.addEventListener("click", function handleClick(e) {
        // check if click happened inside ANY .box
        const clickedInsideBox = Array.from(boxes).some(box => box.contains(e.target));

        if (!clickedInsideBox) {
            login.classList.add("fade-out-slide-down");

            setTimeout(function () {
                login.classList.remove("fade-out-slide-down");
                login.classList.remove("active");
                login.removeEventListener("click", handleClick);
            }, 450);
        }
    });


    if (sessionStorage.getItem("ACCOUNT_DATA")) {
        //left before 2fa
        const session = sessionStorage.getItem("ACCOUNT_DATA")
        const parsed = JSON.parse(session)
        document.getElementById("password_field").value = parsed.password
        document.getElementById("email_field").value = parsed.email
        setTimeout(function () {

            document.getElementById("messageLogin").innerText = 'Your credentials have been restored.'
            document.getElementById("messageLogin").style.display = null
        }, 500)

    }
}




const input = document.getElementById("password_field");

// Add a keydown event listener
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkCredentials()
    }
});

function checkCredentials() {
    document.getElementById("loginButton").innerHTML += `<vox><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                             s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                             c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                             C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                </path>
                            </svg></vox>`
    const email = document.getElementById("email_field").value
    const password = document.getElementById("password_field").value
    fetch(`${srv}/accounts?email=${email}&password=${password}&ip=${ip}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("loginButton").querySelector("vox").remove()
            ////setNetworkStatus('on')
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
                //alert("2FA NEEDED")

                document.getElementById("mainlogin").classList.add("fade-out-slide-down")
                setTimeout(function () {
                    document.getElementById("mainlogin").style.display = 'none'
                    document.getElementById("2fa").style.display = "flex"

                }, 450)
            } else if (data.includes("Credentials Correct")) {
                if (data.includes("Email")) {
                    var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

                    // Extract email using match() method
                    email = data.match(emailRegex);
                    console.log("Ext Email:", email)
                }
                if (sessionStorage.getItem("clearafter")) {
                    localStorage.clear()
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
                const login = document.getElementById("login");

                login.classList.remove("fade-out-slide-down");
                login.classList.remove("active");
                window.location.reload()

            } else if (data.includes("IP Not Verified")) {
                console.log("Account Verified But IP is Unknown")

            } else {
                console.log("Credentials Incorrect. Resetting")
                localStorage.removeItem("t50-email")
                localStorage.removeItem("t50pswd")
                localStorage.removeItem("t50-username")
                document.getElementById("messageLogin").innerText = 'Your credentials are incorrect.'
                document.getElementById("messageLogin").style.display = null
            }
        }).catch(error => {
            //setNetworkStatus('off')
            //pickRandFromDict('offline')


            document.getElementById("messageLogin").innerText = 'Server Connection Failed'
            document.getElementById("messageLogin").style.display = null

            console.error('Server Connection Failed!', error)
        })
}

async function checkImageStatus(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log('Status code:', response.status);
        const res = response.status === 200 ? true : false
        console.log(res)
        return res;
    } catch (err) {
        console.error('Fetch error:', err);
        return false;
    }
}

function check2FA() {
    const email = document.getElementById("email_field").value
    const password = document.getElementById("password_field").value
    const login = document.getElementById("login");
    const username = JSON.parse(sessionStorage.getItem("ACCOUNT_DATA")).username
    fetch(`${srv}/authip?method=Eadd&email=${email}&username=${username}&password=${password}&code=${document.getElementById("twofa_field").value}&ip=${ip}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            ////setNetworkStatus('on')
            if (data === "Complete" || data === "Exists") {
                login.classList.remove("fade-out-slide-down");
                login.classList.remove("active");


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

                localStorage.removeItem("aitAnalytics")
                window.location.reload()
            } else if (data === "Wrong Code") {
                document.getElementById("twofa_field").value = ""
                document.getElementById("2famsg").innerText = "Wrong OTP"
                document.getElementById("2famsg").style.display = 'flex'

            } else {
                console.error("Client ip is strange")
            }
            //IF IP EXISTS THEN DONT REQUIRE 2FA, ELSE REQUIRE 2FA
        }).catch(error => {
            //setNetworkStatus('off')
            console.error('Fetch error:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const check1 = localStorage.getItem("t50-username") && localStorage.getItem("t50-email") && localStorage.getItem("t50pswd")
    if (check1) {
        const image = srv + `/profiles?authorize=imagePfp&name=${localStorage.getItem("t50-username")}`
        const src = checkImageStatus(image) ? image : "/evox-epsilon-beta/incorrectacc.png"
        document.getElementById("accountPreview").innerHTML = `<div class="accountInfo">
        <p>${localStorage.getItem("t50-username")}</p>
        <img src="${src}">
                </div>`
        document.getElementById("imageProfile").src = src

        document.getElementById("profileLink").innerHTML = `https://evoxs.xyz/@${localStorage.getItem("t50-username")}` + `<svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 64 64" stroke-width="3" stroke="#5aa9fd" fill="none"><path d="M55.4,32V53.58a1.81,1.81,0,0,1-1.82,1.82H10.42A1.81,1.81,0,0,1,8.6,53.58V10.42A1.81,1.81,0,0,1,10.42,8.6H32"/><polyline points="40.32 8.6 55.4 8.6 55.4 24.18"/><line x1="19.32" y1="45.72" x2="54.61" y2="8.91"/></svg>`
        document.getElementById("profileLink").onclick = function () {
            window.open(`https://evoxs.xyz/@${localStorage.getItem("t50-username")}`, "_blank");
        }
        document.getElementById("fullname").innerHTML = localStorage.getItem("t50-username")
        fetch(`${srv}/accounts?method=getName&username=${localStorage.getItem("t50-username")}`)
            .then(response => response.text())
            .then(name => {
                if (name !== 'Unknown') {
                    const parts = name.split(' ');
                    const result = [`${parts[0]} `, parts[1]];
                    document.getElementById("fullname").innerText = `${name} (${localStorage.getItem("t50-username")})`
                    document.getElementById("name_field").value = name
                }
            })
            .catch(error => {
                console.log('Name Error:', error);
            });
        fetch(`${srv}/accounts?email=${localStorage.getItem("t50-email")}&username=${localStorage.getItem("t50-username")}&birth=get`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(birthdateString => {
                document.getElementById("birthdate").value = birthdateString
            }).catch(error => {

            })

        document.getElementById("main_email").value = localStorage.getItem("t50-email")
        document.getElementById("main_username").value = localStorage.getItem("t50-username")

        fetch(`${srv}/social?username=${localStorage.getItem("t50-username")}&todo=tags`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(tags => {
                document.getElementById("usertags").innerHTML = ""
                tags.forEach(tag => {
                    document.getElementById("usertags").innerHTML += `<div class="tag">
                                    #${tag}
                                </div>`
                })
            }).catch(error => {
                console.warn("TAGS:", error)
            })


    }

    fetch('https://api.ipify.org?format=json') //https://jsonip.com/
        .then(response => response.json())
        .then(geo => {
            console.log("IP Modifications:", localStorage.getItem("IPV4") !== geo.ip)
            if (localStorage.getItem("IPV4") && localStorage.getItem("IPV4") !== geo.ip) {
                localStorage.setItem("IPV4", geo.ip);
                console.log("New IP")
            }

            ip = geo.ip;
        })
        .catch(error => {

            ip = localStorage.getItem("IPV4") || "offline"

            console.error("IP Api is offline, ignoring")
            console.log('Error:', error);
        });
    document.getElementById("year").innerHTML = new Date().getFullYear()
    // GitHub API endpoint for commits
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("GitHub API request failed");
            return response.json();
        })
        .then(data => {
            const list = document.getElementById("commits");
            data.slice(0, 15).forEach(commit => { // show last 5 commits
                //console.log(commit)
                //console.log(`${commit.commit.author.name}: ${commit.commit.message}`)
                const message = commit.commit.message;

                // Split into lines
                const lines = message.split("\n");
                const title = lines[0];
                const description = lines.slice(1).join("\n").trim();

                // Combine title + description
                const combined = [title, description].join("\n");

                // Regex explanation:
                // 1. ([\w-]+)         -> app name (letters, numbers, dash, underscore)
                // 2. \s*[:\-]?\s*     -> optional space, then optional colon or dash, then optional space
                // 3. (v\d+(\.\d+)+)   -> version (vX.Y.Z or vX.Y.Z.1 etc.)
                // 4. \w*               -> optional trailing letters (like sw101)
                const versionRegex = /([\w-]+)\s*[:\-]?\s*(v\d+(\.\d+)+)\w*/g;

                let matchesMap = new Map();
                let match;

                // Find all matches
                while ((match = versionRegex.exec(combined)) !== null) {
                    let app = match[1] || "Unknown";
                    let versionOnly = match[2]; // actual version
                    if (!matchesMap.has(versionOnly)) {
                        matchesMap.set(versionOnly, app);
                    }
                }

                // Convert map to array
                let matches = Array.from(matchesMap, ([version, app]) => ({ version, app }));

                // Log results
                if (matches.length === 0) {
                    //console.log("Update Version: Unknown");
                } else {
                    matches.forEach((m, i) => {
                        //console.warn(`Version ${i + 1}:`, m.version, `(App: )`);
                        updates.push({
                            appname: m.app !== "Uknown" ? findApp(m.app, title) ? findApp(m.app, title) : "Unknown" : "Unknown",
                            version: m.version,
                            date: commit.commit.committer.date,
                            id: commit.sha,
                            title,
                            description
                        })
                    });
                    //console.log("Primary Update Version:", matches[0].version);
                }




            });
            accessUpdates()
        })
        .catch(err => console.error(err));
})

function switchFeed(el) {
    function removeAllActive() {
        for (let i = 0; i < 4; i++) {
            if (document.getElementById(`feed-${i + 1}`).classList.contains("active")) {
                document.getElementById(`feed-${i + 1}`).classList.remove("active")
                return (i + 1).toString() //this is the active page
            }
        }
    }

    function getPageIdByNum(num) {
        const activePageId = num === "1" ? "home" : num === "2" ? "myaccount" : num === "3" ? "myapps" : num === "4" ? "aboutevox" : null
        return activePageId
    }

    function showNoFeed(active, toActivate) {
        const activePageId = getPageIdByNum(active)
        document.getElementById(activePageId).classList.add("fade-out-slide-down")
        setTimeout(function () {
            document.getElementById(activePageId).style.display = "none"
            document.getElementById(activePageId).classList.remove("fade-out-slide-down")
            document.getElementById(getPageIdByNum(toActivate)).style.display = null
        }, 450)
    }


    const page = el.id.replace('feed-', "")
    showNoFeed(removeAllActive(), page)
    el.classList.add("active")


    if (page === "1") {
        //Explore

    }
}

async function getApplePwaIcon(url) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        console.log(html)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Find <link rel="apple-touch-icon"> or variations
        const iconLink = doc.querySelector('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');

        if (iconLink) {
            let href = iconLink.getAttribute("href");
            // Handle relative paths
            const base = new URL(url);
            return new URL(href, base).href;
        } else {
            return null; // No Apple icon found
        }
    } catch (e) {
        console.error("Error fetching icon:", e);
        return null;
    }
}


function openApp(el) {
    const url = el.getAttribute("data-link");
    let appname = el.querySelector(".ontop")
    if(appname) {
        appname = el.querySelector(".ontop p").innerText
    } else {
        appname = el.querySelector("span").innerText
    }
    if (url) {
        getApplePwaIcon(`https://evoxs.xyz${url}`).then(iconUrl => {
            document.getElementById("launchAppSrc").src = iconUrl ? iconUrl : "/evox-epsilon-beta/srv-offline.gif"
            document.getElementById("launchAppname").innerText = appname
            document.getElementById("launchApp").style.display = "flex"
            console.log("Apple PWA icon:", iconUrl);
            setTimeout(function() {
                window.location.href = url
            }, 2000)
        });
        
    }
}
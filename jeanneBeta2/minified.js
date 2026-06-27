function cardProgress() {
    fetch("https://arc.evoxs.xyz/?metode=progresin").then((e => e.json())).then((e => {
        const t = e.global,
            n = Number.parseInt(100 * t.have_participated / t.total_users);
        document.getElementById("yb-prog").style.width = n + "%"
    })).catch((e => {}))
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function getRandomColor() {
    return `rgb(${Math.floor(256*Math.random())}, ${Math.floor(256*Math.random())}, ${Math.floor(256*Math.random())})`
}
isIOS() && (document.getElementById("gradColored").style.opacity = "1");
let checkChange, foundName = null;

function returnFromMultimatch() {
    const e = document.getElementById("multimatch"),
        t = document.getElementById("topImg"),
        n = document.getElementById("loginSection"),
        o = document.getElementById("loginButton");
    e.classList.remove("active"), n.style.opacity = "0", document.getElementById("evoxContainer").classList.add("active"), setTimeout((function() {
        t.style.display = null, n.style.display = "block", n.classList.add("active"), n.style.opacity = "1", t.style.opacity = "1", o.style.opacity = "0", o.style.display = "block", setTimeout((() => {
            o.style.opacity = "1"
        }), 50)
    }), 500)
}

function selectCustom(e) {
    foundName = e, document.getElementById("loadText").innerHTML = "", $("#tasks").fadeIn("fast"), document.getElementById("multimatch").classList.remove("active"), document.getElementById("loginButton").style.opacity = "0", setTimeout((function() {
        document.getElementById("topImg").style.display = null, document.getElementById("topImg").style.opacity = "1", setTimeout((function() {
            document.getElementById("loadText").style.display = null, document.getElementById("loadText").style.opacity = "0", setTimeout((function() {
                document.getElementById("loadText").innerHTML = "Επιτυχία", document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                    document.getElementById("loadText").style.opacity = "0", setTimeout((function() {
                        foundName.split(" ")[0].replace(/[σς]+$/, ""), foundName.split(" ")[1].replace(/[σς]+$/, "");
                        document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${transformGreekName(matchedNames[0],0)} ${transformGreekName(matchedNames[0],1)}`, document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                            document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                                $("#loginContainer").fadeOut("fast", (function() {
                                    document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                                        $("#lock").fadeIn("fast")
                                    }))
                                }))
                            }))
                        }), 2500)
                    }), 340)
                }), 900)
            }), 340)
        }), 500)
    }), 100)
}

function find() {
    if ("" === document.getElementById("nameInput").value) return;
    document.getElementById("accessButton").innerHTML = loadingHTML;
    const e = findFullNames(document.getElementById("nameInput").value.replace(/\s+/g, ""));
    setTimeout((() => {
        if (0 === e.length) setTimeout((function() {
            $("#matchNotFound").fadeIn("fast", (function() {
                setTimeout((function() {
                    $("#matchNotFound").fadeOut("fast")
                }), 2e3)
            })), document.getElementById("accessButton").innerHTML = "Σύνδεση"
        }), 340);
        else if (e.length > 1) document.getElementById("pinText").style.marginBottom = null, document.getElementById("accessButton").innerHTML = "Επιτυχία", setTimeout((function() {
            let t = 0;
            const n = document.getElementById("karuseli");
            return n.style.display = null, document.getElementById("userPinPfp").style.display = "none", n.innerHTML = "", e.forEach((o => {
                t++;
                const s = Math.floor(909999 * Math.random()) + 1;
                if (n.innerHTML = 1 === t ? `${n.innerHTML}<img onclick="pickasCurrent('${o}')" class="fytyre zgjedhur" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">` : `${n.innerHTML}<img onclick="pickasCurrent('${o}')" class="fytyre" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">`, getEvoxProfile(o).then((e => {
                        document.getElementById(s).src = e
                    })), t === e.length) {
                    const e = document.querySelectorAll(".fytyre");

                    function a() {
                        const t = Array.from(e).findIndex((e => e.classList.contains("zgjedhur")));
                        e.forEach(((e, n) => {
                            const o = n - t;
                            e.style.transform = `translateX(${70*o}px)`
                        }))
                    }
                    a(), e.forEach(((e, t) => {
                        e.addEventListener("click", (() => {
                            document.querySelector(".zgjedhur").classList.remove("zgjedhur"), e.classList.add("zgjedhur"), a()
                        }))
                    }))
                }
            })), document.getElementById("loadText").innerHTML = "Η αυτόματη σύνδεση απέτυχε", void setTimeout((function() {
                $("#hexa").fadeOut("fast"), document.getElementById("evoxContainer").classList.remove("active"), $("#tasks").fadeIn("fast", (function() {
                    document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                        setTimeout((function() {
                            e[0].split(" ")[0].replace(/[σς]+$/, ""), e[0].split(" ")[1].replace(/[σς]+$/, "");
                            $("#tasks").fadeOut("fast", (function() {
                                document.getElementById("loadText").style.opacity = "0", document.getElementById("taskLoading").style.display = "none", document.getElementById("tempLoader").style.display = "flex", document.getElementById("loadText").innerHTML = "Επιλέξτε τον λογαριασμό σας", $("#tasks").fadeIn("fast", (function() {
                                    document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                                        document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                                            document.getElementById("tempLoader").style.display = "none", document.getElementById("taskLoading").style.display = null, $("#loginContainer").fadeOut("fast", (function() {
                                                document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                                                    document.getElementById("nameForMultiple").innerText = e[0], document.getElementById("nameForMultiple").style.display = "flex", $("#lock").fadeIn("fast"), $("#hexa").fadeOut("fast")
                                                }))
                                            }))
                                        }))
                                    }), 1500)
                                }))
                            }))
                        }), 340)
                    }), 900)
                }))
            }), 340);
            setTimeout((function() {
                document.getElementById("accessButton").innerHTML = "Επιτυχία", document.getElementById("loadText").style.opacity = "1", document.getElementById("evoxContainer").classList.remove("active"), $("#hexa").fadeOut("fast"), $("#tasks").fadeIn("fast", (function() {
                    setTimeout((function() {
                        setTimeout((function() {
                            e[0].split(" ")[0].replace(/[σς]+$/, ""), e[0].split(" ")[1].replace(/[σς]+$/, "");
                            document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${transformGreekName(e[0],0)} ${transformGreekName(e[0],1)}`, document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                                document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                                    $("#loginContainer").fadeOut("fast", (function() {
                                        document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                                            document.getElementById("nameForMultiple").style.display = "none", $("#lock").fadeIn("fast"), $("#hexa").fadeOut("fast")
                                        }))
                                    }))
                                }))
                            }), 2500)
                        }), 340)
                    }), 900)
                }))
            }), 340), document.getElementById("evoxContainer").classList.remove("active"), $("#hexa").fadeOut("fast"), $("#tasks").fadeIn("fast"), document.getElementById("loadText").innerHTML = "", setTimeout((function() {
                document.getElementById("multimatch").innerHTML = "<h1>Βρέθηκαν πολλαπλές αντιστοιχίες με το ίδιο όνομα</h1><br><p>Επίλεξε ένα από τα παρακάτω ονόματα:</p>";
                let t = 0;
                e.forEach((n => {
                    t++;
                    const o = Math.floor(909999 * Math.random()) + 1;
                    document.getElementById("multimatch").innerHTML = `${document.getElementById("multimatch").innerHTML}\n                                        <div onclick="selectCustom('${n}')" class="socialUser"><img id="${o}" class="slUserPFP social"\n                src="reloading-pfp.gif">\n            <p>${n}</p><span>></span>\n        </div>`, getEvoxProfile(n).then((e => {
                        document.getElementById(o).src = e
                    })), t === e.length && (document.getElementById("multimatch").innerHTML = `${document.getElementById("multimatch").innerHTML}\n                                            <div class="centerLogin">\n        <button onclick="returnFromMultimatch()" class="welcomeButton">Πίσω</button>\n    </div>`)
                })), setTimeout((function() {
                    $("#loginContainer").fadeOut("fast", (function() {
                        $("#multimatch").fadeIn("fast"), $("#tasks").fadeOut("fast"), $("#hexa").fadeOut("fast"), document.getElementById("multimatch").classList.add("active")
                    }))
                }), 500)
            }), 340)
        }), 340);
        else {
            document.getElementById("loadText").innerHTML = "", foundName = e[0];
            document.getElementById("karuseli").style.display = "none", document.getElementById("userPinPfp").style.display = null, document.getElementById("nameForMultiple").style.display = "none", foundName && getEvoxProfile(foundName).then((e => {
                document.getElementById("userPinPfp").src = e
            })), document.getElementById("pinText").style.marginBottom = "25px", setTimeout((function() {
                document.getElementById("accessButton").innerHTML = "Επιτυχία", document.getElementById("loadText").style.opacity = "1", document.getElementById("evoxContainer").classList.remove("active"), $("#hexa").fadeOut("fast"), $("#tasks").fadeIn("fast", (function() {
                    setTimeout((function() {
                        setTimeout((function() {
                            e[0].split(" ")[0].replace(/[σς]+$/, ""), e[0].split(" ")[1].replace(/[σς]+$/, "");
                            document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${transformGreekName(e[0],0)} ${transformGreekName(e[0],1)}`, document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                                document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                                    $("#loginContainer").fadeOut("fast", (function() {
                                        document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                                            $("#lock").fadeIn("fast"), $("#hexa").fadeOut("fast")
                                        }))
                                    }))
                                }))
                            }), 2500)
                        }), 340)
                    }), 900)
                }))
            }), 340)
        }
    }), 100)
}

function findFirstMatch(e) {
    const t = findFullNames(e.replace(/\s+/g, ""));
    return t.length > 0 ? t[0] : null
}

function pickasCurrent(e) {
    foundName = e, document.getElementById("nameForMultiple").innerText = foundName
}

function capitalizeFirstLetter(e) {
    return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
}

function findFullNames(e, t) {
    if (!namesData) return void fetch("https://arc.evoxs.xyz/?metode=merrniEmrat").then((e => e.json())).then((t => {
        namesData = t, findFullNames(e)
    })).catch((e => {}));
    let n = [];
    for (const [t, o] of Object.entries(namesData.names)) {
        const s = e.toLowerCase().replace(/\s+/g, "");
        t.toLowerCase().replace(/\s+/g, "") !== s ? o.some((e => e.toLowerCase() === s)) ? n.push(t) : (o.some((e => e.toLowerCase().includes(s))) && e.length > 2 && n.push(t), t.toLowerCase().includes(e.toLowerCase()) && e.length > 2 && n.push(t)) : n.push(t)
    }
    return t && (n = n.filter((e => e !== foundName))), n
}

function focusOnIcon(e) {
    e.querySelectorAll("svg path").forEach((e => {
        e.style.fill = "#dedede", setTimeout((function() {
            e.style.fill = "#808080"
        }), 900)
    }))
}

function storiesSpawned() {
    document.querySelectorAll(".app .stories .story").forEach((e => {
        const t = getRandomColor(),
            n = getRandomColor();
        e.style.background = `linear-gradient(to right top, ${t}, ${n})`
    }))
}
setInterval((function() {
    foundName && foundName !== checkChange && localStorage.getItem("jeanDarc_accountData") && !hasLoginFailed && (checkChange = foundName, getEvoxProfile(foundName).then((e => {
        document.getElementById("userPinPfp").src = e
    })))
}), 6e3);
const reloadThreshold = 2,
    timeWindow = 5e3;
let ipLog, reloadCount = sessionStorage.getItem("reloadCount") ? parseInt(sessionStorage.getItem("reloadCount")) : 0,
    lastReloadTime = sessionStorage.getItem("lastReloadTime") ? parseInt(sessionStorage.getItem("lastReloadTime")) : Date.now(),
    spammingDetected = "true" === sessionStorage.getItem("spammingDetected");

function continueToLogin(e) {
    e.preventDefault(), e.stopPropagation(), $("#case1").fadeOut("fast", (function() {
        document.getElementById("evoxContainer").style.height = "55%", $("#loginForm").fadeIn("fast")
    }))
}

function hideElementOnAndroid(e) {
    if (navigator.userAgent.toLowerCase().includes("android")) {
        const t = document.getElementById(e);
        t && (t.style.display = "none")
    }
}

function connectWithIp() {
    ipLog && (document.getElementById("loadText").innerText = "Επεξεργασία..", $("#tasks").fadeIn("fast"), goBackToMain(), setTimeout((function() {
        nameLogin(), document.getElementById("voxName").value = ipLog, setTimeout((function() {
            searchByNameComplete()
        }), 600)
    }), 600))
}
spammingDetected || (window.onbeforeunload = function() {
    const e = Date.now();
    e - lastReloadTime < 5e3 ? reloadCount++ : reloadCount = 1, sessionStorage.setItem("reloadCount", reloadCount), sessionStorage.setItem("lastReloadTime", e), reloadCount > 2 && sessionStorage.setItem("spammingDetected", "true")
});
let namesData = null,
    ip = null;
document.addEventListener("DOMContentLoaded", (function() {
    let e = 0;
    document.querySelectorAll(".moving-elements div").forEach((t => {
        setTimeout((function() {
            t.style.opacity = "1"
        }), 200 * e), e++
    })), document.querySelectorAll(".pin-pad button").forEach((e => {
        e.addEventListener("touchstart", (() => {
            e.classList.add("active")
        })), e.addEventListener("touchend", (() => {
            setTimeout((function() {
                e.classList.remove("active")
            }), 100)
        }))
    })), hideElementOnAndroid("gradColored"), hideElementOnAndroid("bgGrd"), window.innerWidth > 768 && !localStorage.getItem("devBypass") ? $("#loginContainer").fadeOut("fast", (function() {
        $("#device-warning").fadeIn("fast"), $("#hexa").fadeOut("fast")
    })) : spammingDetected ? $("#loginContainer").fadeOut("fast", (function() {
        $("#hexa").fadeOut("fast"), $("#spamStop").fadeIn("fast");
        let e = 10;
        if (sessionStorage.getItem("countdown")) {
            const t = Number(sessionStorage.getItem("countdown"));
            sessionStorage.setItem("countdown", Math.floor(t + .5 * t)), e = Math.floor(t + .5 * t)
        }
        sessionStorage.setItem("countdown", e), document.getElementById("countdown").innerText = e, setInterval((function() {
            const e = Number(document.getElementById("countdown").innerText) - 1;
            document.getElementById("countdown").innerText = e, sessionStorage.setItem("countdown", e), e < 1 && (sessionStorage.removeItem("spammingDetected"), sessionStorage.removeItem("countdown"), window.location.reload())
        }), 1e3)
    })) : localStorage.getItem("jeanDarc_accountData") ? autoLogin() : (stopPull = !0, fetch("https://api.ipify.org?format=json").then((e => e.json())).then((e => {
        ip = e.ip, document.getElementById("loadText").innerText = "Αναγνωριστικό έτοιμο", fetch("https://arc.evoxs.xyz/?metode=merrniEmrat").then((e => e.json())).then((e => {
            namesData = e, setTimeout((function() {
                document.getElementById("loadText").innerText = "Έγινε σύνδεση", setTimeout((function() {
                    document.getElementById("setupPage").style.display = "", setTimeout((function() {
                        document.getElementById("loginContainer").style.opacity = "1", document.getElementById("loginSection").classList.add("active"), document.getElementById("bgGrd").style.transform = "scale(0.97)", setTimeout((function() {}), 550), setTimeout((function() {
                            $("#hexa").fadeOut("fast")
                        }), 350)
                    }), 100)
                }), 500)
            }), 500);
            try {
                e.matchedAccounts && e.matchedAccounts.length > 0 && (ipLog = e.matchedAccounts[0], getEvoxProfile(e.matchedAccounts[0]).then((e => {
                    document.getElementById("matchedPfp").src = e
                })), document.getElementById("longAgo").innerText = timeAgo(e.ZeroLastLogin), document.getElementById("nameIp").innerText = e.matchedAccounts[0], $("#appInfo").fadeOut("fast"), $("#textDialog").fadeOut("fast", (function() {
                    const e = document.getElementById("boxUp"),
                        t = e.offsetHeight + "px";
                    boxUpDefaultHeight = t, e.style.transition = "height 1s", e.style.height = t, setTimeout((() => {
                        e.style.height = "300px"
                    }), 10), $("#boxUp").children().not("#helpMe, .loginByName").fadeOut((function() {
                        $("#loginByIp").fadeIn("fast")
                    }))
                })))
            } catch (e) {}
        })).catch((e => {
            document.getElementById("loadText").innerHTML = "Η σύνδεση απέτυχε.<br>Γίνεται επανασύνδεση..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), document.getElementById("typewriter").style.display = "none", document.getElementById("spinnerApple").style.display = null
        }))
    })).catch((e => {})))
}));
const loadingHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"\n                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" width="25px"\n                height="25px" style="enable-background:new 0 0 50 50;" xml:space="preserve">\n                <path fill="#dedede"\n                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">\n                    <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"\n                        to="360 25 25" dur="0.6s" repeatCount="indefinite" />\n                </path>\n            </svg>';

function startSetup(e) {
    e.innerHTML = loadingHTML, document.getElementById("evoxContainer").classList.remove("active"), document.getElementById("loadText").innerText = "Περιμένετε..", setTimeout((function() {
        document.getElementById("setupPage").style.display = "", document.getElementById("newUser").style.display = "none", document.getElementById("case1").style.display = "", setTimeout((function() {
            document.getElementById("evoxContainer").classList.add("active")
        }), 1e3)
    }), 550)
}
document.getElementById("nameInput").addEventListener("focus", (function() {
    video.playbackRate = 1.5, video.play()
})), document.getElementById("nameInput").addEventListener("blur", (function() {
    video.playbackRate = 1
})), document.getElementById("nameInput").addEventListener("keydown", (function(e) {
    "Enter" === e.key && find()
}));
let toVerify, retryInt, pin = "",
    proccessingPIN = !1;

function clickPIN(e) {
    let t = e.innerHTML;
    pin.length <= 3 && (0 == pin.length ? (document.getElementById("ps1").style.width = "10px", document.getElementById("ps1").style.height = "10px") : 1 == pin.length ? (document.getElementById("ps2").style.width = "10px", document.getElementById("ps2").style.height = "10px") : 2 == pin.length ? (document.getElementById("ps3").style.width = "10px", document.getElementById("ps3").style.height = "10px") : 3 == pin.length && (document.getElementById("ps4").style.width = "10px", document.getElementById("ps4").style.height = "10px"), pin = `${pin}${t}`, 4 == pin.length && (proccessingPIN = !0, $("#PINdots").fadeOut("fast", (function() {
        $("#PINload").fadeIn("fast")
    })), null === pinAction ? setTimeout((function() {
        fetch(`https://arc.evoxs.xyz/?metode=pin&pin=${pin}&emri=${foundName}`).then((e => e.text())).then((e => {
            "Granted" === e ? (proccessingPIN = !1, $("#PINload").fadeOut("fast", (function() {
                document.body.style.touchAction = "", $("#lock").fadeOut("fast", (function() {
                    document.getElementById("loadText").innerHTML = "Περιμένετε..";
                    const e = {
                        name: foundName,
                        pin: btoa(pin),
                        latestIp: ip
                    };
                    localStorage.setItem("jeanDarc_accountData", JSON.stringify(e)), sessionStorage.setItem("isNewUser", "true"), stopPull = null, $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), autoLogin()
                })), sessionStorage.setItem("remUnlocked", "true")
            }))) : "Denied" === e ? (proccessingPIN = !1, deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#PINload").fadeOut("fast", (function() {
                $("#PINdots").fadeIn("fast", (function() {
                    shake_me("pin-input")
                }))
            }))) : (proccessingPIN = !1, $("#PINload").fadeOut("fast", (function() {
                document.body.style.touchAction = "", $("#lock").fadeOut("fast", (function() {
                    document.getElementById("loadText").innerHTML = "Διόρθωση σφαλμάτων..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), setTimeout((function() {
                        localStorage.clear(), sessionStorage.clear(), setTimeout((function() {
                            window.location.reload()
                        }), 500)
                    }), 2e3)
                }))
            })))
        })).catch((e => {
            document.getElementById("loadText").innerHTML = "Η σύνδεση απέτυχε.<br>Γίνεται επανασύνδεση..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), document.getElementById("typewriter").style.display = "none", document.getElementById("spinnerApple").style.display = null
        }))
    }), 900) : "old" === pinAction ? setTimeout((function() {
        fetch(`https://arc.evoxs.xyz/?metode=pin&pin=${pin}&emri=${foundName}`).then((e => e.text())).then((e => {
            "Granted" === e ? (proccessingPIN = !1, $("#PINload").fadeOut("fast", (function() {
                document.getElementById("pinText").innerHTML = "Επιτυχία", pinAction = "new", $("#PINdots").fadeIn("fast"), $("#lock").fadeIn("fast"), setTimeout((function() {
                    deletePIN(), deletePIN(), deletePIN(), deletePIN(), document.getElementById("pinText").innerHTML = "Εισάγετε το νέο σας PIN"
                }), 500)
            }))) : (proccessingPIN = !1, deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#PINload").fadeOut("fast", (function() {
                $("#PINdots").fadeIn("fast", (function() {
                    shake_me("pin-input")
                }))
            })))
        })).catch((e => {
            document.getElementById("loadText").innerHTML = "Η σύνδεση απέτυχε.<br>Γίνεται επανασύνδεση..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), document.getElementById("typewriter").style.display = "none", document.getElementById("spinnerApple").style.display = null
        }))
    }), 500) : "verify" === pinAction ? setTimeout((function() {
        toVerify === pin ? fetch(`https://arc.evoxs.xyz/?metode=pinChange&pin=${atob(JSON.parse(localStorage.getItem("jeanDarc_accountData")).pin)}&emri=${foundName}&pinNew=${pin}`).then((e => e.text())).then((e => {
            "Complete" === e ? (proccessingPIN = !1, $("#PINload").fadeOut("fast", (function() {
                document.body.style.touchAction = "", $("#lock").fadeOut("fast", (function() {
                    document.getElementById("loadText").innerHTML = "Περιμένετε..";
                    const e = {
                        name: foundName,
                        pin: btoa(pin),
                        latestIp: ip
                    };
                    localStorage.setItem("jeanDarc_accountData", JSON.stringify(e)), $("#tasks").fadeOut("fast"), pinAction = null, setTimeout((function() {
                        document.getElementById("loadText").style.opacity = "0", setTimeout((function() {
                            document.getElementById("loadText").innerText = "Το PIN ανανεώθηκε με επιτυχία", $("#hexa").fadeOut("fast"), $("#tasks").fadeIn("fast", (function() {
                                setTimeout((function() {
                                    $("#tasks").fadeOut("fast"), $("#app").fadeIn("fast"), document.body.style.overflow = null, document.getElementById("app").style.transform = "", document.getElementById("app").style.opacity = "1", setTimeout((function() {
                                        document.getElementById("app").style.opacity = "1"
                                    }), 500)
                                }), 1200)
                            })), document.getElementById("loadText").style.opacity = "1"
                        }), 300)
                    }), 500)
                })), sessionStorage.setItem("remUnlocked", "true")
            }))) : (proccessingPIN = !1, deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#PINload").fadeOut("fast", (function() {
                $("#PINdots").fadeIn("fast", (function() {
                    shake_me("pin-input")
                }))
            })))
        })).catch((e => {
            document.getElementById("loadText").innerHTML = "Η σύνδεση απέτυχε.<br>Γίνεται επανασύνδεση..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), document.getElementById("typewriter").style.display = "none", document.getElementById("spinnerApple").style.display = null
        })) : (proccessingPIN = !1, deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#PINload").fadeOut("fast", (function() {
            $("#PINdots").fadeIn("fast", (function() {
                shake_me("pin-input")
            }))
        })), pinAction = "new", toVerify = null, document.getElementById("pinText").innerHTML = "Εισάγετε το νέο σας PIN")
    }), 500) : "new" === pinAction && (toVerify = pin, setTimeout((function() {
        proccessingPIN = !1, $("#PINload").fadeOut("fast", (function() {
            document.getElementById("pinText").innerHTML = "Επιβεβαιώστε το νέο σας PIN", pinAction = "verify", $("#PINdots").fadeIn("fast"), $("#lock").fadeIn("fast"), setTimeout((function() {
                deletePIN(), deletePIN(), deletePIN(), deletePIN()
            }), 500)
        }))
    }), 500))))
}

function reloadProgress() {
    const e = localStorage.getItem("jeanDarc_accountData");
    if (e) {
        const t = JSON.parse(e),
            n = atob(t.pin);
        fetch(`https://arc.evoxs.xyz/?metode=getProgress&emri=${foundName}&pin=${n}`).then((e => e.json())).then((e => {
            const t = e.progress;
            document.getElementById("title-progress").innerHTML = e.title, document.getElementById("desc-progress").innerHTML = e.desc, document.getElementById("percentage").innerText = t, document.getElementById("progress-ring").style = `--progress: ${t.replace("%","")};`
        })).catch((e => {}))
    }
}
let hasLoginFailed = !1;

function autoLogin() {
    const e = localStorage.getItem("jeanDarc_accountData");
    e && (document.getElementById("topImg").style.opacity = "0", $("#loginContainer").fadeOut("fast", (function() {
        document.getElementById("loginContainer").style.display = "none";
        const t = JSON.parse(e);
        foundName = t.name, (foundName.includes("παποστόλ") || foundName.includes("Λιλάντα") || foundName.includes("Γερακιανάκη")) && (document.getElementById("admin-preview").style.display = null), "Female" === getGender(removeTonos(foundName.split(" ")[0])) && (document.documentElement.style.setProperty("--color-theme", "#ae6cff"), document.documentElement.style.setProperty("--color-theme-light", "#bf8bff"), document.documentElement.style.setProperty("--color-theme-select", "#ae6cff55"));
        const n = atob(t.pin);
        fetch(`https://arc.evoxs.xyz/?metode=getProgress&emri=${foundName}&pin=${n}`).then((e => e.json())).then((e => {
            const t = e.progress;
            document.getElementById("title-progress").innerHTML = e.title, document.getElementById("desc-progress").innerHTML = e.desc, document.getElementById("percentage").innerText = t, document.getElementById("progress-ring").style = `--progress: ${t.replace("%","")};`
        })).catch((e => {})), fetch(`https://arc.evoxs.xyz/?metode=pin&pin=${n}&emri=${foundName}`).then((e => e.text())).then((e => {
            try {
                clearInterval(retryInt)
            } catch (e) {}
            if ("Granted" === e) {
                document.getElementById("selfPfp").src = "reloading-pfp.gif", getEvoxProfile(foundName).then((e => {
                    document.getElementById("selfPfp").src = e, document.getElementById("navbarpfp").src = e
                }));
                const e = {
                    name: foundName,
                    pin: btoa(n),
                    latestIp: ip
                };
                localStorage.setItem("jeanDarc_accountData", JSON.stringify(e)), document.getElementById("loadText").style.opacity = "0", setTimeout((function() {
                    document.getElementById("loadText").innerText = "Επιτυχία", setTimeout((function() {
                        attach()
                    }), 1200), document.getElementById("loadText").style.opacity = "1"
                }), 300), sessionStorage.setItem("remUnlocked", "true")
            } else hasLoginFailed = !0, document.getElementById("topImg").style.opacity = "0", $("#loginContainer").fadeOut("fast", (function() {
                document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                    $("#lock").fadeIn("fast")
                }))
            })), document.getElementById("nameForMultiple").innerText = foundName, document.getElementById("nameForMultiple").style.display = "flex", getEvoxProfile(foundName).then((e => {
                document.getElementById("userPinPfp").style.display = "", e.includes("Kodi i gabimit:") ? (document.getElementById("userPinPfp").src = "snap.png", document.getElementById("nameForMultiple").innerText += "?") : document.getElementById("userPinPfp").src = e
            }))
        })).catch((e => {
            document.getElementById("loadText").innerHTML = "Η σύνδεση απέτυχε.<br>Γίνεται επανασύνδεση..", $("#tasks").fadeIn("fast"), $("#hexa").fadeOut("fast"), document.getElementById("typewriter").style.display = "none", document.getElementById("spinnerApple").style.display = null, retryInt = setInterval((function() {
                fetch(`https://arc.evoxs.xyz/?metode=pin&pin=${n}&emri=${foundName}`).then((e => e.text())).then((e => {
                    clearInterval(retryInt), autoLogin(), document.getElementById("typewriter").style.display = null, document.getElementById("spinnerApple").style.display = "none"
                })).catch((e => {}))
            }), 1e3)
        })), fetch(`https://arc.evoxs.xyz/?metode=warns&pin=${btoa(n)}&emri=${foundName}`).then((e => e.json())).then((e => {
            "-1" !== e.id && noticeFront(e)
        })).catch((e => {})), cardProgress()
    })), foundName && getEvoxProfile(foundName).then((e => {
        document.getElementById("userPinPfp").src = e
    })))
}

function transformGreekName(e, t) {
    const n = e.split(" ")[t].replace(/[σς]+$/, "");
    let o = n;
    return n.endsWith("ος") ? o = n.slice(0, -2) + "ε" : n.endsWith("ης") ? o = n.slice(0, -2) + "η" : n.endsWith("ας") ? o = n.slice(0, -2) + "α" : n.endsWith("ες") && (o = n.slice(0, -2) + "ε"), o
}

function attach() {
    document.getElementById("gradColored").style.opacity = "1", "0000" === atob(JSON.parse(localStorage.getItem("jeanDarc_accountData")).pin) && (document.getElementById("notice").classList.add("active"), document.body.style.overflow = "hidden", document.getElementById("app").style.opacity = "0.7", document.getElementById("app").style.transform = "scale(0.97)"), document.body.style.backgroundColor = "#101010", $("#hexa").fadeOut("fast", (function() {
        $("#tasks").fadeOut("fast"), document.getElementById("name-sur-view").innerText = foundName;
        const e = foundName.split(" ")[0].replace(/[σς]+$/, ""),
            t = foundName.split(" ")[1].replace(/[σς]+$/, "");
        `${e.endsWith("ο")?e.slice(0,-1)+"ε":e} ${t.endsWith("ο")?t.slice(0,-1)+"ε":t}`.length > 1 ? document.getElementById("emri").innerText = `${transformGreekName(foundName,0)}` : document.getElementById("emri").innerText = `${transformGreekName(foundName,0)} ${transformGreekName(foundName,1)}`, sessionStorage.getItem("isNewUser") || (document.getElementById("welcmtxt").innerHTML = "Καλώς ήρθες ξανά 👋"), $("#app").fadeIn("fast")
    })), spawnRandom()
}
async function spawnRandom(e) {
    const t = localStorage.getItem("jeanDarc_accountData");
    if (!t) return;
    const n = JSON.parse(t),
        o = atob(n.pin);
    e || (document.getElementById("foryou").innerHTML = "");
    try {
        const t = await fetch(`https://arc.evoxs.xyz/?metode=randomPost&emri=${foundName}&pin=${o}&id=6`),
            n = await t.text();
        if ("Denied" !== n) {
            const t = JSON.parse(n);
            for (const n of t) {
                if (e) {
                    document.getElementById("foryou").querySelectorAll("div.postContainer").forEach(((e, t) => {
                        const o = e.querySelector(".post .postInfo .userInfo p"),
                            s = e.querySelector(".post .postInfo .postContent p span");
                        !o || !s || o.innerText !== n.emri || (s.innerText, n.marresi)
                    }))
                }
                const t = await getImage(n.emri),
                    o = await getEvoxProfile(n.emri);
                let s = o;
                t && (s = t.imageData), await fetchAndSaveImage(n.emri, o), document.getElementById("foryou").innerHTML += `\n                    <div class="postContainer" style="padding-bottom: 10px;padding-top: 10px;">\n                        <div class="post">\n                            <div class="profilePicture">\n                                <img src="${s}">\n                            </div>\n                            <div class="postInfo">\n                                <div class="userInfo">\n                                    <p>${n.emri}</p>\n                                    <span>${timeAgoInGreek(n.date)}</span>\n                                </div>\n                                <div class="postContent">\n                                    <p>\n                                    <span class="mention ${"Female"===getGender(removeTonos(n.marresi.split(" ")[0]))?"female":"male"}">@${n.marresi}</span>\n                                    ${n.vleresim}\n                                    </p>\n                                </div>\n                            </div>\n                        </div>\n                    </div>`
            }
        } else document.getElementById("foryou").innerHTML = `\n                    <div class="postContainer" style="padding-bottom: 10px;padding-top: 10px;">\n                        <div class="post">\n                            <div class="profilePicture">\n                                <img src="../evox-epsilon-beta/epsilon-assets/android-chrome-512x512.png">\n                            </div>\n                            <div class="postInfo">\n                                <div class="userInfo">\n                                    <p>Evox</p>\n                                    <span>μόλις τώρα</span>\n                                </div>\n                                <div class="postContent">\n                                    <p>\n                                    <span class="mention ${"Female"===getGender(removeTonos(foundName.split(" ")[0]))?"female":"male"}">@${foundName}</span><br>\n                                    Δεν μπορείς να δεις τις δημόσιες αναρτήσεις ακόμα, δοκίμασε ξανά σε λίγες μέρες ή ζήτα πρόσβαση από τους διαχειριστές.\n                                    </p>\n                                </div>\n                            </div>\n                        </div>\n                    </div>`
    } catch (e) {}
}
let foryoudiv = document.getElementById("home"),
    loadingIndicatorFy = document.getElementById("loadingIndicator-fy"),
    isLoading2 = !1;

function shake_me(e) {
    document.getElementById(`${e}`).classList.add("shake"), setTimeout((function() {
        document.getElementById(`${e}`).classList.remove("shake")
    }), 500)
}

function deletePIN() {
    !0 !== proccessingPIN ? (0 == pin.length || 1 == pin.length ? (document.getElementById("ps1").style.width = "5px", document.getElementById("ps1").style.height = "5px") : 2 == pin.length ? (document.getElementById("ps2").style.width = "5px", document.getElementById("ps2").style.height = "5px") : 3 == pin.length ? (document.getElementById("ps3").style.width = "5px", document.getElementById("ps3").style.height = "5px") : 4 == pin.length && (document.getElementById("ps4").style.width = "5px", document.getElementById("ps4").style.height = "5px"), pin = pin.slice(0, -1)) : shake_me("pin-input")
}

function reset(e) {
    setTimeout((function() {
        localStorage.removeItem("jeanDarc_accountData"), window.location.reload()
    }), 600)
}

function dismissPINChange() {
    document.getElementById("notice").classList.remove("active")
}

function changePinRedo() {
    document.getElementById("profilePage").classList.remove("active"), changePin()
}
foryoudiv.addEventListener("scroll", (function() {
    isLoading2 || foryoudiv.scrollTop + foryoudiv.clientHeight >= foryoudiv.scrollHeight - 10 && (isLoading2 = !0, loadingIndicatorFy.classList.add("scaleUp"), loadingIndicatorFy.style.opacity = "1", setTimeout((() => {
        spawnRandom(!0), isLoading2 = !1, loadingIndicatorFy.style.opacity = "0", loadingIndicatorFy.classList.remove("scaleUp")
    }), 1500))
}));
let pinAction = null;

function changePin(e, t) {
    t && (t.preventDefault(), t.stopPropagation()), getEvoxProfile(foundName).then((e => {
        document.getElementById("userPinPfp").src = e
    })), e && (e.innerHTML = loadingHTML), $("#PINdots").fadeIn("fast"), deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#app").fadeOut("fast", (function() {
        setTimeout((function() {
            document.getElementById("notice").style.transform = "translateY(100vh)", document.getElementById("pinText").innerHTML = "Εισάγετε το παλιό σας PIN", pinAction = "old", $("#lock").fadeIn("fast")
        }), 500)
    }))
}

function showProfile(e) {
    document.body.style.overflow = "hidden", stopPull = !0;
    let t = "no";
    e && (t = e.querySelector("img"), t.style.transform = "scale(0.9)", openProfile(document.getElementById("profile-switch"))), setTimeout((function() {
        "no" !== t && (t.style.transform = ""), document.getElementById("darc-user-self-profile").src = "reloading-pfp.gif", getEvoxProfile(foundName).then((e => {
            e.includes("data.evoxs.xyz") ? document.getElementById("instagramedProfile").style.display = "none" : document.getElementById("instagramedProfile").style.display = null, document.getElementById("darc-user-self-profile").src = e
        })), document.getElementById("userName").innerText = foundName, fetch(`https://arc.evoxs.xyz/?metode=klasaMerr&emri=${foundName}`).then((e => e.text())).then((e => {
            "Nuk u gjet" !== e && (e = JSON.parse(e)), fetch(`https://arc.evoxs.xyz/?metode=tags&emri=${foundName}`).then((e => e.json())).then((t => {
                document.getElementById("tags").innerHTML = "", document.getElementById("mySeksioni").innerText = `${classmatesCount} συμμαθητές`, document.getElementById("tags").innerHTML = `<div class="anInfo">\n                    🏫\n                    <span id="seksioni">${e.seksioni}${"none"!==e.klasa?e.klasa:""}</span>\n                </div>`, t.forEach((e => {
                    document.getElementById("tags").innerHTML = `${document.getElementById("tags").innerHTML}<div class="anInfo">\n                    ${"Evox"===e?'<img src="../oasaResign/evox-logo-dark.png" width="17.5px" height="17.5px">':"🏛️"}\n                    <span>${e}</span>\n                </div>`
                }))
            })).catch((e => {}))
        })).catch((e => {}))
    }), 100)
}

function goBackFromProfile(e) {
    document.body.style.overflow = null, stopPull = null, e.style.transform = "scale(0.9)", setTimeout((function() {
        e.style.transform = "scale(1)", document.getElementById("profilePage").classList.remove("active")
    }), 100)
}

function clickCard(e) {
    e.style.transform = "scale(0.99)", setTimeout((function() {
        e.style.transform = "scale(1)", "yearbook" === e.getAttribute("data-evox") && activateYearbook()
    }), 200)
}
let marresit_more, allUsers = {},
    classes = {},
    usersElems = {},
    marresit = [],
    marresi_fix = {};

function activateYearbook() {
    allUsers = {}, classes = {}, usersElems = {}, marresit_more = [], marresi_fix = {}, $("#app").fadeOut("fast", (function() {
        document.getElementById("loadText").innerHTML = "Φόρτωση..", $("#tasks").fadeIn("fast", (function() {
            fetch("https://arc.evoxs.xyz/?metode=merrniEmrat").then((e => e.json())).then((e => {
                namesData = e;
                const t = Object.keys(e.names);
                document.getElementById("spawnPeople").innerHTML = '<div id="temp-name-loader" class="loading-spinner fade-in-slide-up"></div>';
                let n = null,
                    o = !1;
                const s = t.map((e => fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${e}`).then((e => e.json())).then((e => {
                    e.emri !== foundName ? allUsers[e.emri] = e : n = `${e.seksioni}${e.klasa}`, e.has_participated && "true" === e.has_participated && (o = !0)
                })).catch((e => {}))));
                Promise.all(s).then((() => {
                    document.getElementById("temp-name-loader").style.display = "none", Object.entries(allUsers).forEach((([e, t]) => {
                        classes[`${t.seksioni}${t.klasa}`] ? classes[`${t.seksioni}${t.klasa}`].push(t) : classes[`${t.seksioni}${t.klasa}`] = [t]
                    })), Object.entries(classes).forEach((([e, t]) => {
                        if (!document.getElementById("spawnPeople").innerText.includes(e) && "ΚΑΘnone" !== e) {
                            const t = e.match(/[Α-Ω]+|\d+/g);
                            document.getElementById("spawnPeople").innerHTML += `<div class="spawnPeople" id="${e}-cont">\n                                    <p style="text-align: left">${t[0]}${t[1]?"'"+t[1]:""}</p></div>`
                        }

                        function s() {
                            $("#tasks").fadeOut("fast", (function() {
                                document.getElementById("yearbook-container").style.display = "block", document.getElementById("yearbook-container").style.opacity = "1"
                            }))
                        }
                        if (e === n && "ΚΑΘnone" !== e ? (document.getElementById(`${e}-cont`).classList.add("upup"), document.getElementById(`${e}-cont`).innerText = "Στην τάξη σου") : "ΚΑΘnone" !== n || document.getElementById("spawnPeople").innerHTML.includes("<p>⚠️ Προσοχή!") || (document.getElementById("spawnPeople").innerHTML = `<p>⚠️ Προσοχή!<br>Οι χρήστες της τάξης σας είναι κρυμμένοι.</p>${document.getElementById("spawnPeople").innerHTML}`), Object.entries(t).forEach((([t, n]) => {
                                if (n.emri === foundName || "ΚΑΘnone" === e) return;
                                const o = Math.floor(909999 * Math.random()) + 1;
                                usersElems[n.emri] = {
                                    ranId: o,
                                    info: n
                                }, document.getElementById(`${e}-cont`).innerHTML += `\n    <div id="user-${o}" class="aStudent fade-in-slide-up" onclick="pickStudent('${n.emri}', this)">\n        <div class="studentImage">\n            <img alt="Αποτυχία" src="user.gif">\n        </div>\n        <div class="studentInfo">\n            <p>${n.emri}</p>\n        </div>\n    </div>`;
                                const s = new Image;
                                s.src = n.foto + "?size=minimum", fetchAndSaveImage(n.emri, n.foto), s.onload = () => {
                                    const e = document.getElementById(`user-${o}`).querySelector(".studentImage img");
                                    e.src = s.src, e.style.visibility = "visible"
                                }, s.onerror = () => {
                                    const e = document.getElementById(`user-${o}`).querySelector(".studentImage img");
                                    e.src = "snap.png", e.style.visibility = "visible"
                                }
                            })), !1 === o) s();
                        else {
                            const e = localStorage.getItem("jeanDarc_accountData");
                            if (!e) return void s();
                            const t = JSON.parse(e);
                            fetch(`https://arc.evoxs.xyz/?metode=userSent&pin=${t.pin}&emri=${t.name}`).then((e => e.json())).then((e => {
                                marresit_more = e;
                                (e => new Promise((t => {
                                    marresit = [], e.forEach((e => {
                                        marresit.push(e.marresi)
                                    })), t(marresit)
                                })))(e).then((e => {
                                    e.forEach((e => {
                                        try {
                                            const t = usersElems[e].ranId;
                                            document.getElementById(`user-${t}`).classList.add("seen"), document.getElementById(`user-${t}`).setAttribute("evox-c", "require-resee")
                                        } catch (t) {
                                            document.getElementById("error-cont") || (document.getElementById("spawnPeople").innerHTML += '<div class="spawnPeople upup2" id="error-cont">Σφάλματα που βρέθηκαν</div>'), Object.entries(marresit_more).forEach((([t, n]) => {
                                                n.marresi !== e || document.getElementById("error-cont").innerHTML.includes(`user-${e.replace(" ","_")}`) || (marresi_fix[e] = n, document.getElementById("error-cont").innerHTML += `<div id="user-${e.replace(" ","_")}" class="aStudent fade-in-slide-up seen" onclick="pickStudent('${e}', this, 'maressi')" evox-c="require-resee">\n                                                                <div class="studentImage">\n                                                                    <img alt="Αποτυχία" src="snap.png" style="visibility: visible;">\n                                                                </div>\n                                                                <div class="studentInfo">\n                                                                    <p>${e}</p>\n                                                                </div>\n                                                            </div>`)
                                            }))
                                        }
                                    }))
                                })), s()
                            })).catch((e => {}))
                        }
                    }))
                }))
            })).catch((e => {
                document.getElementById("loadText").innerHTML = "Αποτυχία.", document.getElementById("yearbook-container").style.display = "block", document.getElementById("yearbook-container").style.opacity = "1", goBackFromBook(), setTimeout((function() {
                    $("#tasks").fadeOut("fast")
                }), 1e3)
            }));
            foundName.split(" ")[0].replace(/[σς]+$/, ""), foundName.split(" ")[1].replace(/[σς]+$/, "");
            document.getElementById("loadText").innerHTML = "Περιμένετε..", document.getElementById("loadText").style.opacity = "1";
            document.querySelector(".emoji-cont").classList.add("active")
        }))
    }))
}

function goBackFromBook() {
    pickedStudents = [], document.getElementById("static").style.opacity = "0", setTimeout((function() {
        $("#gradColored").fadeIn("fast")
    }), 500), document.getElementById("yearbook-container").style.opacity = "0", setTimeout((function() {
        document.getElementById("yearbook-container").style.display = "none"
    }), 500), $("#app").fadeIn("fast", (function() {})), document.getElementById("count-picked").style.opacity = "0", $("#buttonStartCont").fadeOut("fast")
}

function goBackFromRate() {
    document.getElementById("yearbook-screen-2").style.opacity = "0", setTimeout((function() {
        document.getElementById("yearbook-container").style.display = "block", document.getElementById("yearbook-container").style.opacity = "1", document.getElementById("yearbook-screen-2").style.display = "none", document.getElementById("count-picked").style.opacity = "1", $("#buttonStartCont").fadeIn("fast")
    }), 500)
}
let pickedStudents = [];

function addFromSearch(e, t) {
    if (pickedStudents.includes(e)) t.classList.remove("picked"), pickedStudents = pickedStudents.filter((t => t !== e)), document.getElementById("count-picked").innerHTML = pickedStudents.length, pickedStudents.length > 0 ? (document.getElementById("count-picked").style.opacity = "1", $("#buttonStartCont").fadeIn("fast")) : (document.getElementById("count-picked").style.opacity = "0", $("#buttonStartCont").fadeOut("fast"));
    else {
        const n = usersElems[e].ranId;
        t.classList.add("picked"), pickStudent(e, document.getElementById(`user-${n}`))
    }
}

function pickStudent(e, t) {
    t.classList.contains("picked") ? (t.classList.remove("picked"), pickedStudents = pickedStudents.filter((t => t !== e)), document.getElementById("count-picked").innerHTML = pickedStudents.length) : (t.classList.add("picked"), pickedStudents.push(e), document.getElementById("count-picked").innerHTML = pickedStudents.length), pickedStudents.length > 0 ? (document.getElementById("count-picked").style.opacity = "1", $("#buttonStartCont").fadeIn("fast")) : (document.getElementById("count-picked").style.opacity = "0", $("#buttonStartCont").fadeOut("fast"))
}

function fixNameCase(e) {
    const t = {
        "ης": "η",
        "ος": "ο",
        "ά": "ά",
        "ι": "ι",
        "ς": "η",
        "ας": "α"
    };
    if ("Αίαντας" === e) return "Αίαντα";
    if ("Ηλίας" === e) return "Ηλία";
    e = e.toLowerCase();
    for (let n in t)
        if (e.endsWith(n)) {
            e = e.slice(0, -n.length) + t[n];
            break
        } return e.charAt(0).toUpperCase() + e.slice(1)
}

function getGender(e) {
    const t = ["α", "η", "ώ", "ί", "ύ"],
        n = ["ς", "ος", "ης", "ους"];
    e = e.toLowerCase();
    for (let n of t)
        if (e.endsWith(n)) return "Female";
    for (let t of n)
        if (e.endsWith(t)) return "Male";
    return "Unknown"
}
const phrases = ["Πώς σου φάνηκε ο τελευταίος χρόνος με {callout} {name}?", "Ποιες στιγμές από την τάξη σου θα θυμάσαι πάντα με {callout} {name}?", "Ποιες είναι οι πιο αστείες αναμνήσεις σου με {callout} {name}?", "Πώς σε έχει βοηθήσει {callout-οη} {name} στην τάξη ή έξω από αυτήν?", "Ποιες αξέχαστες στιγμές πέρασες με {callout} {name} στο σχολείο?", "Ποιο είναι το αγαπημένο σου χαρακτηριστικό {callout-τουτης} {name}?", "Ποιες δραστηριότητες κάνατε μαζί με {callout} {name} που σου έμειναν αξέχαστες?", "Πες μας κάτι που δεν ξέρουμε για {callout} {name}!", "Ποιες είναι οι πιο εμπνευσμένες ιδέες που μοιράστηκε μαζί σου {callout-οη} {name}?", "Πώς βοηθάει {callout-οη} {name} τους άλλους μαθητές στην τάξη?", "Ποιες ήταν οι πιο ενδιαφέρουσες συζητήσεις που είχες με {callout} {name}?", "Αν έπρεπε να χαρακτηρίσεις {callout} {name} με 5 λέξεις, ποιες θα ήταν αυτές?", "Ποιες στιγμές του σχολείου με {callout} {name} θεωρείς τις πιο σημαντικές για σένα?", "Τι σου αρέσει πιο πολύ στην προσωπικότητα {callout-τουτης} {name}?", "Πώς έχεις βοηθήσει εσύ {callout} {name} να εξελιχθεί ή να μάθει κάτι νέο?", "Ποιες προσωπικές αξίες πιστεύεις ότι έχει {callout-οη} {name}?", "Πώς σου φαίνεται ο τρόπος που επικοινωνεί {callout-οη} {name} με τους άλλους στην τάξη?"];

function reloadGenerate() {
    const e = pickedStudents[activeStudent].split(" ")[0];
    let t = phrases[Math.floor(Math.random() * phrases.length)].replace("{name}", e).replace("{callout}", "Male" === getGender(e) ? "τον" : "την").replace("{callout-τουτης}", "Male" === getGender(e) ? "του" : "της").replace("{callout-οη}", "Male" === getGender(e) ? "ο" : "η");
    (t.includes(`τον ${e}`) || t.includes(`την ${e}`)) && (t = t.replace(e, fixNameCase(e))), dataIn[`${pickedStudents[activeStudent]}-question`] = t, document.getElementById("message").placeholder = t
}
let activeStudent = 0;

function startYbRate(e, t) {
    if (activeStudent = 0, 0 !== pickedStudents.length) {
        t.preventDefault(), t.stopPropagation(), e.innerHTML = loadingHTML, document.getElementById("yearbook-container").style.opacity = "0", setTimeout((function() {
            document.getElementById("yearbook-container").style.display = "none", document.getElementById("yearbook-screen-2").style.display = "block", document.getElementById("yearbook-screen-2").style.opacity = "1", document.getElementById("count-picked").style.opacity = "0", $("#buttonStartCont").fadeOut("fast"), setTimeout((function() {
                e.innerHTML = "Συνέχεια"
            }), 800)
        }), 500);
        try {
            if (document.getElementById("currentName").innerText = pickedStudents[activeStudent], document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`, document.getElementById("currentPic").src = usersElems[pickedStudents[activeStudent]].info.foto, fetchAndSaveImage(inform.emri, usersElems[pickedStudents[activeStudent]].info.foto), document.getElementById("message").value = "", reloadGenerate(), marresit && marresit.includes(pickedStudents[activeStudent]) && marresit_more) {
                const e = pickedStudents[activeStudent],
                    t = marresit_more.find((t => t.marresi === e));
                t && (document.getElementById("message").value = t.contents.vleresim)
            }
            document.getElementById("contCurre").style.display = null, document.getElementById("noError").style.display = null, document.getElementById("unicode_error").style.display = "none"
        } catch (e) {
            document.getElementById("contCurre").style.display = "none", document.getElementById("currentName").innerText = marresi_fix[pickedStudents[activeStudent]].marresi, document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`, document.getElementById("currentPic").src = "snap.png", document.getElementById("message").value = marresi_fix[pickedStudents[activeStudent]].contents.vleresim, reloadGenerate(), document.getElementById("noError").style.display = "none", document.getElementById("unicode_error").style.display = null
        }
    }
}

function saveRatings() {
    $("#yearbook-screen-2").fadeOut("fast", (function() {
        document.getElementById("loadText").innerText = "Αποθήκευση αλλαγών..", $("#tasks").fadeIn("fast");
        const e = JSON.parse(localStorage.getItem("jeanDarc_accountData")),
            t = {
                metode: "vleresimet",
                emri: foundName || e.name,
                pin: e.pin,
                parashtresat: JSON.stringify(dataIn)
            };
        fetch("https://arc.evoxs.xyz/saveRatings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(t)
        }).then((e => e.text())).then((e => {
            if ("Kontrolloni json!" === e);
            else {
                JSON.parse(e);
                $("#tasks").fadeOut("fast", (function() {
                    document.getElementById("loadText").innerText = "Οι αλλαγές σας αποθηκεύτηκαν!", $("#tasks").fadeIn("fast"), setTimeout((() => {
                        setTimeout((() => {
                            goBackFromBook(), document.getElementById("yearbook-container").style.display = "none", document.getElementById("yearbook-screen-2").style.display = "none", document.getElementById("yearbook-screen-2").style.opacity = "0", setTimeout((() => {
                                reloadProgress(), $("#tasks").fadeOut("fast")
                            }), 200)
                        }), 200)
                    }), 2e3)
                }))
            }
        })).catch((e => {
            localStorage.setItem("jeanneBackup", JSON.stringify(dataIn)), hasLoginFailed || alert("Αποτυχία Σύνδεσης Με Τον Διακομιστή. Οι καταχωρήσεις σας αποθηκεύτηκαν στην συσκευή σας. Δοκιμάστε αργότερα"), $("#tasks").fadeOut("fast", (function() {
                document.getElementById("loadText").innerHTML = "Τα τοπικά δεδομένα είναι έτοιμα.<br>Ξανασυνδεθείτε αργότερα.", $("#tasks").fadeIn("fast"), setTimeout((() => {
                    setTimeout((() => {
                        goBackFromBook(), document.getElementById("yearbook-container").style.display = "none", document.getElementById("yearbook-screen-2").style.display = "none", document.getElementById("yearbook-screen-2").style.opacity = "0", setTimeout((() => {
                            reloadProgress(), $("#tasks").fadeOut("fast")
                        }), 200)
                    }), 200)
                }), 5e3)
            }))
        }))
    }))
}

function saveRatingsOld() {
    $("#yearbook-screen-2").fadeOut("fast", (function() {
        document.getElementById("loadText").innerText = "Αποθήκευση αλλαγών..", $("#tasks").fadeIn("fast");
        const e = JSON.parse(localStorage.getItem("jeanDarc_accountData"));
        fetch(`https://arc.evoxs.xyz/?metode=vleresimet&emri=${foundName||e.name}&pin=${e.pin}&parashtresat=${JSON.stringify(dataIn)}`).then((e => e.text())).then((e => {
            if ("Kontrolloni json!" === e);
            else {
                JSON.parse(e);
                $("#tasks").fadeOut("fast", (function() {
                    document.getElementById("loadText").innerText = "Οι αλλαγές σας αποθηκεύτηκαν!", $("#tasks").fadeIn("fast"), setTimeout((function() {
                        setTimeout((function() {
                            goBackFromBook(), document.getElementById("yearbook-container").style.display = "none", document.getElementById("yearbook-screen-2").style.display = "none", document.getElementById("yearbook-screen-2").style.opacity = "0", setTimeout((function() {
                                reloadProgress(), $("#tasks").fadeOut("fast")
                            }), 200)
                        }), 200)
                    }), 2e3)
                }))
            }
        })).catch((e => {
            localStorage.setItem("jeanneBackup", JSON.stringify(dataIn)), alert("Αποτυχία Σύνδεσης Με Τον Διακομιστή. Οι καταχωρήσεις σας αποθηκεύτηκαν στην συσκευή σας. Δοκιμάστε αργότερα")
        }))
    }))
}
document.getElementById("message").addEventListener("input", (function(e) {
    let t = e.target,
        n = t.value.replace(/["\\]/g, "");
    t.value = n
}));
let dataIn = {};

function continueCurrent() {
    if ("" !== document.getElementById("message").value) try {
        if (pickedStudents.length === activeStudent + 1) return dataIn[document.getElementById("currentName").innerText] = document.getElementById("message").value, void saveRatings();
        activeStudent++, dataIn[document.getElementById("currentName").innerText] = document.getElementById("message").value, $("#centerContent-rate").fadeOut("fast", (function() {
            try {
                document.getElementById("currentPic").src = "reloading-pfp.gif", document.getElementById("message").value = "", document.getElementById("currentName").innerText = pickedStudents[activeStudent], document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`;
                const e = pickedStudents[activeStudent];
                if (!usersElems[e]) return document.getElementById("currentPic").src = "snap.png", document.getElementById("contCurre").style.display = "none", document.getElementById("currentName").innerText = marresi_fix[pickedStudents[activeStudent]].marresi, document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`, document.getElementById("currentPic").src = "snap.png", document.getElementById("message").value = marresi_fix[pickedStudents[activeStudent]].contents.vleresim, reloadGenerate(), setTimeout((function() {
                    $("#centerContent-rate").fadeIn("fast")
                }), 300), document.getElementById("noError").style.display = "none", void(document.getElementById("unicode_error").style.display = null);
                if (document.getElementById("noError").style.display = null, document.getElementById("unicode_error").style.display = "none", document.getElementById("currentPic").src = usersElems[e].info.foto, reloadGenerate(), setTimeout((function() {
                        $("#centerContent-rate").fadeIn("fast")
                    }), 300), marresit && marresit.includes(e) && marresit_more) {
                    const t = marresit_more.find((t => t.marresi === e));
                    t && (document.getElementById("message").value = t.contents.vleresim)
                }
                document.getElementById("contCurre").style.display = null
            } catch (e) {}
        }))
    } catch (e) {
        $("#centerContent-rate").fadeOut("fast", (function() {
            document.getElementById("contCurre").style.display = "none", document.getElementById("currentName").innerText = marresi_fix[pickedStudents[activeStudent]].marresi, document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`, document.getElementById("currentPic").src = "snap.png", document.getElementById("message").value = marresi_fix[pickedStudents[activeStudent]].contents.vleresim, reloadGenerate(), setTimeout((function() {
                $("#centerContent-rate").fadeIn("fast")
            }), 300)
        })), document.getElementById("noError").style.display = "none", document.getElementById("unicode_error").style.display = null
    }
}

function skipCurrentRate() {
    pickedStudents.length !== activeStudent + 1 ? (activeStudent++, $("#centerContent-rate").fadeOut("fast", (function() {
        try {
            document.getElementById("currentPic").src = "reloading-pfp.gif", document.getElementById("message").value = "", document.getElementById("currentName").innerText = pickedStudents[activeStudent], document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`;
            const e = pickedStudents[activeStudent];
            if (!usersElems[e]) return document.getElementById("currentPic").src = "snap.png", document.getElementById("contCurre").style.display = "none", document.getElementById("currentName").innerText = marresi_fix[pickedStudents[activeStudent]].marresi, document.getElementById("currentCount").innerText = `${activeStudent+1}/${pickedStudents.length}`, document.getElementById("currentPic").src = "snap.png", document.getElementById("message").value = marresi_fix[pickedStudents[activeStudent]].contents.vleresim, reloadGenerate(), setTimeout((function() {
                $("#centerContent-rate").fadeIn("fast")
            }), 300), document.getElementById("noError").style.display = "none", void(document.getElementById("unicode_error").style.display = null);
            if (document.getElementById("noError").style.display = null, document.getElementById("unicode_error").style.display = "none", document.getElementById("currentPic").src = usersElems[e].info.foto, reloadGenerate(), setTimeout((function() {
                    $("#centerContent-rate").fadeIn("fast")
                }), 300), marresit && marresit.includes(e) && marresit_more) {
                const t = marresit_more.find((t => t.marresi === e));
                t && (document.getElementById("message").value = t.contents.vleresim)
            }
            document.getElementById("contCurre").style.display = null
        } catch (e) {}
    }))) : saveRatings()
}

function actionClick(e, t) {
    e.preventDefault(), e.stopPropagation();
    const n = t.querySelector("svg");
    n && (n.style.transform = "rotate(360deg)", setTimeout((function() {
        n.style.transform = "rotate(0deg)", t.classList.toggle("active")
    }), 500))
}
let startProg = 10;

function testCard(e) {
    e.style.transform = "scale(0.99)", setTimeout((function() {
        let t = startProg + 10;
        t >= 100 && (t = 0), animateNumberChange(e, t);
        e.querySelector("div.progress-ring").style = `--progress: ${t};`, e.style.transform = "scale(1)", startProg = t
    }), 200)
}

function animateNumberChange(e, t) {
    const n = e.querySelector("div.progress-ring div.percentage"),
        o = parseInt(n.innerText) || 0,
        s = (t - o) / 40;
    let a = 0;
    ! function e() {
        a++;
        const l = o + s * a;
        n.innerText = Math.round(l) + "%", a < 40 ? requestAnimationFrame(e) : n.innerText = t + "%"
    }()
}
let isSocialed = !1,
    socialSection = "none",
    socialUsername = "none";
async function getEvoxProfile(e) {
    if (null !== e) try {
        const t = await fetch(`https://arc.evoxs.xyz/?metode=fotoMerrni&emri=${e}`),
            n = await t.text();
        if ("null" !== n) {
            e === foundName && (isSocialed = !0, n.includes("instagram") ? (socialSection = "instagram", $("#instagramedProfile").fadeIn("fast")) : socialSection = "facebook");
            const t = /\/([^\/]+)\.evox$/,
                o = n.match(t);
            if (o) {
                const e = o[1];
                socialUsername = e, document.getElementById("instausername-SELF").innerText = socialUsername, document.getElementById("isInstagramed").style.display = null
            } else document.getElementById("isInstagramed").style.display = "none";
            return fetchAndSaveImage(e, n), n
        } {
            const t = `https://data.evoxs.xyz/profiles?authorize=imagePfp&name=${e}_jeanDarc`;
            return fetchAndSaveImage(e, t), t
        }
    } catch (e) {
        return null
    }
}

function openInstagram() {
    isSocialed && "instagram" === socialSection && socialUsername && window.open(`https://instagram.com/${socialUsername}`, "_blank")
}

function merrniEmrat() {
    fetch("https://arc.evoxs.xyz/?metode=merrniEmrat").then((e => e.json())).then((e => {
        namesData = e;
        const t = Object.keys(e.names);
        document.getElementById("socialSpawn").innerHTML = "", t.forEach((e => {
            fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${e}`).then((e => e.json())).then((e => {
                document.getElementById("socialSpawn").innerHTML += `<div class="socialUser">\n                <img class="slUserPFP social"\n                    src="${e.foto}">\n                <p>${e.emri}</p><span>${e.seksioni}${"none"!==e.klasa?"'"+e.klasa:""}</span> \x3c!---\x3e\n            </div>`
            })).catch((e => {}))
        }))
    })).catch((e => {}))
}

function showSocial() {
    merrniEmrat(), document.getElementById("social").classList.add("active")
}

function closePostCreate(e) {
    function t(e) {
        e ? (document.getElementById("createPost").style.transform = "translateY(100vh)", setTimeout((function() {
            document.getElementById("createPost").classList.remove("active"), setTimeout((function() {
                document.getElementById("createPost").style.transform = null
            }), 200)
        }), 450)) : (document.getElementById("createPost").style.transform = "", document.getElementById("createPost").classList.remove("active"))
    }
    document.body.style.overflow = null, document.getElementById("app").style.transform = null, document.getElementById("gradColored").style.opacity = null, document.getElementById("gradColored").style.borderRadius = null, document.getElementById("gradColored").style.transform = null, document.getElementById("app").style.opacity = null, document.body.style.backgroundColor = null, footer.style.display = "none", e ? t(!0) : setTimeout((function() {
        t()
    }), 500)
}

function hideSocial() {
    document.getElementById("social").classList.remove("active")
}

function grabberEvents(e) {
    const t = document.getElementById(e);
    let n, o, s = !1,
        a = !1;

    function l(e) {
        t.scrollTop > 0 || (n = e.touches ? e.touches[0].clientY : e.clientY, s = !0, a = !1, t.style.transition = "none")
    }

    function i(e) {
        if (!s) return;
        o = e.touches ? e.touches[0].clientY : e.clientY;
        let l = o - n;
        Math.abs(l) > 10 && (a = !0), l > 0 && 0 === t.scrollTop && (t.style.transform = `translateY(${l}px)`)
    }

    function c() {
        s && (s = !1, t.style.transition = "transform 0.3s ease", a && o - n > 150 && 0 === t.scrollTop ? (t.style.transform = "translateY(100vh)", "notice" === e && (document.body.style.overflow = null, document.getElementById("app").style.transform = "", document.getElementById("app").style.opacity = "1"), "classChange" === e && (document.body.style.overflow = null, document.getElementById("app").style.transform = "", document.getElementById("app").style.opacity = "1", document.getElementById("profilePage").style.transform = "", document.getElementById("profilePage").style.opacity = "1"), "createPost" === e && closePostCreate(), t.addEventListener("transitionend", (() => {
            t.classList.remove("active"), t.style.transform = ""
        }), {
            once: !0
        })) : t.style.transform = "")
    }
    t.addEventListener("mousedown", l), t.addEventListener("touchstart", l, {
        passive: !0
    }), t.addEventListener("mousemove", i), t.addEventListener("touchmove", i, {
        passive: !0
    }), t.addEventListener("mouseup", c), t.addEventListener("touchend", c)
}

function grabberEventsNoDismiss(e) {
    const t = document.getElementById(e);
    let n, o, s = !1;

    function a(e) {
        n = e.touches ? e.touches[0].clientY : e.clientY, s = !0, t.style.transition = "height 1s ease-in-out"
    }

    function l(e) {
        if (!s) return;
        o = e.touches ? e.touches[0].clientY : e.clientY;
        let a = o - n;
        a > 0 && (t.style.transform = `translateY(${a}px)`)
    }

    function i() {
        s = !1, t.style.transition = "transform 0.4s ease-in-out, height 1s ease-in-out", t.style.transform = ""
    }
    t.addEventListener("mousedown", a), t.addEventListener("touchstart", a), t.addEventListener("mousemove", l), t.addEventListener("touchmove", l), t.addEventListener("mouseup", i), t.addEventListener("touchend", i)
}

function reDoPinChange() {
    document.getElementById("app").style.transform = "scale(0.97)", document.getElementById("app").style.opacity = "0.7", document.body.style.overflow = "hidden", document.getElementById("notice").classList.toggle("active"), document.getElementById("profilePage").classList.remove("active")
}
grabberEvents("notice"), grabberEventsNoDismiss("evoxContainer");
let stopPull = null,
    lastScrollY = window.scrollY;
const pullThreshold = -120,
    debugReload = document.getElementById("debugReload");

function toggleDev() {
    const e = document.getElementById("devActions").style.display;
    document.getElementById("devActions").style.display = "none" === e ? "flex" : "none"
}

function goBackToLogin() {
    localStorage.getItem("jeanDarc_accountData") ? (deletePIN(), deletePIN(), deletePIN(), deletePIN(), $("#lock").fadeOut("fast", (function() {
        $("#app").fadeIn("fast"), document.body.style.overflow = null, document.getElementById("app").style.transform = "", document.getElementById("app").style.opacity = "1", setTimeout((function() {
            document.getElementById("app").style.opacity = "1"
        }), 500)
    }))) : ($("#lock").fadeOut("fast", (function() {
        input.value = "", mirrorText.textContent = "", input.style.width = null, $("#loginContainer").fadeIn("fast", (function() {})), document.getElementById("welcome").classList.remove("fade-out-slide-down")
    })), deletePIN(), deletePIN(), deletePIN(), deletePIN())
}

function getDeviceInfo() {
    const e = navigator.userAgent;
    let t = "Unknown",
        n = "Unknown",
        o = "Unknown";
    if (/Mobile|iPhone|Android/.test(e) ? t = "Κινητή" : /Tablet|iPad/.test(e) ? t = "Τάμπλετ" : /Mac|Windows|Linux|X11/.test(e) && (t = "Υπολογιστής"), /iPhone/.test(e)) n = "iPhone";
    else if (/iPad/.test(e)) n = "iPad";
    else if (/Android/.test(e)) {
        const t = e.match(/Android\s([\d.]+)/);
        n = "Android Device", o = t ? t[1] : o
    } else /Mac/.test(e) ? n = "Mac" : /Windows/.test(e) && (n = "Windows PC");
    if (/iPhone|iPad/.test(e)) {
        const t = e.match(/OS (\d+_\d+)/);
        o = t ? t[1].replace("_", ".") : o
    } else if (/Windows/.test(e)) {
        const t = e.match(/Windows NT (\d+\.\d+)/);
        o = t ? t[1] : o
    } else if (/Mac/.test(e)) {
        const t = e.match(/Mac OS X (\d+_\d+)/);
        o = t ? t[1].replace("_", ".") : o
    }
    return {
        deviceType: t,
        model: n,
        osVersion: o
    }
}

function showAppInfo() {
    const e = getDeviceInfo();
    document.getElementById("deviceInfo").innerHTML = `${e.deviceType} - ${e.model} - ${e.osVersion}`, document.getElementById("ipIdent").innerText = ip, $("#welcome").fadeOut("fast", (function() {
        document.getElementById("infoContainer").classList.add("active")
    }))
}

function hideAppInfo() {
    document.getElementById("infoContainer").classList.remove("active"), $("#welcome").fadeIn("fast")
}
let boxUpDefaultHeight;

function nameLogin() {
    document.getElementById("topLeftBack").classList.add("active"), $("#appInfo").fadeOut("fast"), $("#textDialog").fadeOut("fast", (function() {
        const e = document.getElementById("boxUp"),
            t = e.offsetHeight + "px";
        boxUpDefaultHeight = t, e.style.transition = "height 1s", e.style.height = t, setTimeout((() => {
            e.style.height = "250px"
        }), 10), $("#boxUp").children().not(".loginByName, #helpMe, #loginByIp").fadeOut((function() {
            $("#loginByName").fadeIn("fast")
        }))
    }))
}

function help() {
    document.getElementById("topLeftBack").classList.add("active"), $("#appInfo").fadeOut("fast"), $("#textDialog").fadeOut("fast", (function() {
        const e = document.getElementById("boxUp"),
            t = e.offsetHeight + "px";
        boxUpDefaultHeight = t, e.style.transition = "height 1s", e.style.height = t, setTimeout((() => {
            e.style.height = "260px"
        }), 10), $("#boxUp").children().not("#helpMe, .loginByName, #loginByIp").fadeOut((function() {
            $("#helpMe").fadeIn("fast")
        }))
    }))
}

function goBackToMain() {
    if (document.getElementById("topLeftBack").classList.remove("active"), boxUpDefaultHeight) {
        const e = document.getElementById("boxUp");
        e.style.transition = "height 1s", setTimeout((() => {
            e.style.height = boxUpDefaultHeight
        }), 10), $("#helpMe").fadeOut("fast"), $("#loginByIp").fadeOut("fast", (function() {
            $("#loginByName").fadeOut("fast", (function() {
                $("#boxUp").children().not(".loginByName, #helpMe, #loginByIp").fadeIn((function() {
                    $("#textDialog").fadeIn("fast", (function() {
                        $("#appInfo").fadeIn("fast")
                    }))
                }))
            }))
        }))
    }
}

function getHelpSend() {
    fetch(`https://arc.evoxs.xyz/?metode=needHelp&emri=${document.getElementById("getHelpInput").value}`).then((e => e.text())).then((e => {
        document.getElementById("getHelpInput").value = "", goBackToMain()
    })).catch((e => {}))
}

function goBackFromHelp() {
    if (document.getElementById("topLeftBackHelp").classList.remove("active"), boxUpDefaultHeight) {
        const e = document.getElementById("boxUp");
        e.style.transition = "height 1s", setTimeout((() => {
            e.style.height = boxUpDefaultHeight
        }), 10), $("#topLeftBack").fadeOut("fast"), $("#helpMe").fadeOut("fast", (function() {
            $("#boxUp").children().not(".loginByName").fadeIn((function() {
                $("#textDialog").fadeIn("fast", (function() {
                    $("#appInfo").fadeIn("fast")
                }))
            }))
        }))
    }
}
window.addEventListener("scroll", (e => {
    window.scrollY
}));
const input = document.getElementById("voxName"),
    mirrorText = document.querySelector(".mirror-text");

function calculateTextWidth(e) {
    const t = document.createElement("span");
    t.style.fontSize = "16px", t.style.visibility = "hidden", t.style.position = "absolute", t.textContent = e, document.body.appendChild(t);
    const n = t.offsetWidth;
    return document.body.removeChild(t), n
}

function removeTonos(e) {
    return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
let previousWidth = null;

function searchByName() {
    const e = document.getElementById("voxName"),
        t = e.value,
        n = findFirstMatch(t),
        o = document.querySelector(".mirror-text"),
        s = t.split(" "),
        a = s[0],
        l = s[1] || "";
    if (n) {
        const s = n.split(" "),
            i = s[0],
            c = s[1] || "";
        let d = n;
        if (i.toLowerCase().includes(a.toLowerCase()) && a.toLowerCase() !== i.toLowerCase() ? d = i.includes(t) ? `${i.replace(t,"")}?` : ` ${i.replace(t,"")}?` : c.toLowerCase().includes(l.toLowerCase()) && l.toLowerCase() !== c.toLowerCase() ? d = c.includes(t) ? `${c.replace(t,"")}?` : ` ${c.replace(t,"")}?` : n.toLowerCase().startsWith(a.toLowerCase()) ? d = n.replace(a, "").trim() : n.toLowerCase().endsWith(l.toLowerCase()) && (d = n.replace(l, "").trim()), o.textContent = d, t.length <= 2) return void(e.style.width = previousWidth);
        previousWidth = e.style.width, e.style.width = `${calculateTextWidth(t)+10}px`;
        const r = 400;
        e.offsetWidth > r && (e.style.width = `${r}px`)
    }
    e.value.length < 1 && (o.textContent = "", e.style.width = null)
}

function searchByNameComplete() {
    const e = findFullNames(document.getElementById("voxName").value.replace(/\s+/g, ""));
    if (1 === e.length) {
        document.getElementById("welcome").classList.add("fade-out-slide-down"), foundName = e[0];
        document.getElementById("karuseli").style.display = "none", document.getElementById("userPinPfp").style.display = null, document.getElementById("nameForMultiple").style.display = "none", getEvoxProfile(foundName).then((e => {
            document.getElementById("userPinPfp").src = e
        })), document.getElementById("pinText").style.marginBottom = "25px", document.getElementById("loadText").innerHTML = "Επιτυχία", document.getElementById("accessButton").innerHTML = "Επιτυχία", document.getElementById("loadText").style.opacity = "1", document.getElementById("evoxContainer").classList.remove("active"), $("#hexa").fadeOut("fast"), $("#tasks").fadeIn("fast", (function() {
            e[0].split(" ")[0].replace(/[σς]+$/, ""), e[0].split(" ")[1].replace(/[σς]+$/, "");
            document.getElementById("loadText").innerHTML = `Καλωσόρισες,<br>${transformGreekName(e[0],0)} ${transformGreekName(e[0],1)}`, document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                    $("#loginContainer").fadeOut("fast", (function() {
                        document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                            $("#lock").fadeIn("fast"), $("#hexa").fadeOut("fast")
                        }))
                    }))
                }))
            }), 1e3)
        }))
    } else if (e.length > 1) {
        document.getElementById("pinText").style.marginBottom = null, document.getElementById("welcome").classList.add("fade-out-slide-down");
        let t = 0;
        const n = document.getElementById("karuseli");
        n.style.display = null, document.getElementById("userPinPfp").style.display = "none", n.innerHTML = "", pickasCurrent(e[0]), e.forEach((o => {
            t++;
            const s = Math.floor(909999 * Math.random()) + 1;
            if (n.innerHTML = 1 === t ? `${n.innerHTML}<img onclick="pickasCurrent('${o}')" class="fytyre zgjedhur" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">` : `${n.innerHTML}<img onclick="pickasCurrent('${o}')" class="fytyre" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">`, getEvoxProfile(o).then((e => {
                    document.getElementById(s).src = e
                })), t === e.length) {
                const e = document.querySelectorAll(".fytyre");

                function a() {
                    const t = Array.from(e).findIndex((e => e.classList.contains("zgjedhur")));
                    e.forEach(((e, n) => {
                        const o = n - t;
                        e.style.transform = `translateX(${70*o}px)`
                    }))
                }
                a(), e.forEach(((e, t) => {
                    e.addEventListener("click", (() => {
                        document.querySelector(".zgjedhur").classList.remove("zgjedhur"), e.classList.add("zgjedhur"), a()
                    }))
                }))
            }
        })), document.getElementById("loadText").innerHTML = "Η αυτόματη σύνδεση απέτυχε", setTimeout((function() {
            $("#hexa").fadeOut("fast"), document.getElementById("evoxContainer").classList.remove("active");
            e[0].split(" ")[0].replace(/[σς]+$/, ""), e[0].split(" ")[1].replace(/[σς]+$/, "");
            $("#tasks").fadeOut("fast", (function() {
                document.getElementById("loadText").style.opacity = "0", document.getElementById("taskLoading").style.display = "none", document.getElementById("tempLoader").style.display = "flex", document.getElementById("loadText").innerHTML = "Επιλέξτε τον λογαριασμό σας", $("#tasks").fadeIn("fast", (function() {
                    document.getElementById("loadText").style.opacity = "1", setTimeout((function() {
                        document.getElementById("topImg").style.opacity = "0", $("#tasks").fadeOut("fast", (function() {
                            document.getElementById("tempLoader").style.display = "none", document.getElementById("taskLoading").style.display = null, $("#loginContainer").fadeOut("fast", (function() {
                                document.getElementById("loginContainer").style.display = "none", $("#multimatch").fadeOut("fast", (function() {
                                    document.getElementById("nameForMultiple").innerText = e[0], document.getElementById("nameForMultiple").style.display = "flex", $("#lock").fadeIn("fast"), $("#hexa").fadeOut("fast")
                                }))
                            }))
                        }))
                    }), 1500)
                }))
            }))
        }), 340)
    } else alert("Δεν βρέθηκαν αντιστοιχίες")
}
document.getElementById("voxName").addEventListener("keydown", (function(e) {
    "Enter" === e.key && searchByNameComplete()
}));
const doubleInput = document.getElementById("yb-input"),
    mirrorTextYb = document.querySelector(".mirror-text.xy");
let previousWidthYb = null,
    spawnedSearches = [];

function YbsearchByName() {
    const e = document.getElementById("yb-input"),
        t = e.value,
        n = findFirstMatch(t),
        o = document.querySelector(".mirror-text.xy"),
        s = t.split(" "),
        a = document.getElementById("searchPeople"),
        l = findFullNames(t);
    a.innerHTML = "", l.forEach(((e, t) => {
        e !== foundName || 1 !== l.length ? (spawnedSearches.includes(e) || fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${e}`).then((e => e.json())).then((e => {
            a.innerHTML += `<div onclick="addFromSearch('${e.emri}', this)" class="aStudent fade-in-slide-up ${pickedStudents.includes(e.emri)?"picked":""}">\n                    <div class="studentImage">\n                        <img src="${e.foto}">\n                    </div>\n                    <div class="studentInfo">\n                        <p>${e.emri}</p>\n                    </div>\n                  </div>`
        })).catch((t => {
            a.innerHTML += `<div class="aStudent fade-in-slide-up">\n                            <div class="studentImage">\n                                <img src="snap.png">\n                            </div>\n                            <div class="studentInfo">\n                                <p>${e}</p>\n                            </div>\n                          </div>`
        })), setTimeout((function() {
            const e = document.getElementById("searchPeople"),
                t = new Set;
            Array.from(e.children).forEach((e => {
                t.has(e.textContent) ? e.remove() : t.add(e.textContent)
            }))
        }), 200)) : a.innerHTML += "Δεν μπορείτε να γράψετε για τον εαυτό σας"
    })), 0 === l.length && (a.innerHTML += "Δεν βρέθηκαν αντιστοιχίες");
    const i = s[0],
        c = s[1] || "";
    if (n) {
        const s = n.split(" "),
            a = s[0],
            l = s[1] || "";
        let d = n;
        if (a.toLowerCase().includes(i.toLowerCase()) && i.toLowerCase() !== a.toLowerCase() ? d = a.includes(t) ? `${a.replace(t,"")}?` : ` ${a.replace(t,"")}?` : l.toLowerCase().includes(c.toLowerCase()) && c.toLowerCase() !== l.toLowerCase() ? d = l.includes(t) ? `${l.replace(t,"")}?` : ` ${l.replace(t,"")}?` : n.toLowerCase().startsWith(i.toLowerCase()) ? d = n.replace(i, "").trim() : n.toLowerCase().endsWith(c.toLowerCase()) && (d = n.replace(c, "").trim()), o.textContent = d, t.length <= 2) return void(e.style.width = previousWidthYb);
        previousWidthYb = e.style.width, e.style.width = `${calculateTextWidth(t)+10}px`;
        const r = 400;
        e.offsetWidth > r && (e.style.width = `${r}px`)
    }
    e.value.length < 1 ? (o.textContent = "", e.style.width = null, $("#searchPeople").fadeOut("fast", (function() {
        $("#spawnPeople").fadeIn("fast")
    }))) : $("#spawnPeople").fadeOut("fast", (function() {
        $("#searchPeople").fadeIn("fast")
    }))
}

function testPick() {
    let e = ["Λιλάντα Αδαμίδη", "Γιάννης Καπράλος"],
        t = 0;
    const n = document.getElementById("karuseli-2");
    n.style.display = null, document.getElementById("userPinPfp").style.display = "none", n.innerHTML = "", e.forEach((o => {
        t++;
        const s = Math.floor(909999 * Math.random()) + 1;
        if (n.innerHTML = 1 === t ? `${n.innerHTML}<img onclick="pickName('${o}', '${s}')" class="fytyre zgjedhur" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">` : `${n.innerHTML}<img onclick="pickName('${o}', '${s}')" class="fytyre" src="reloading-pfp.gif" alt="Fytyrë ${t}" id="${s}">`, getEvoxProfile(o).then((e => {
                document.getElementById(s).src = e
            })), t === e.length) {
            const e = document.querySelectorAll(".fytyre");

            function a() {
                const t = Array.from(e).findIndex((e => e.classList.contains("zgjedhur")));
                e.forEach(((e, n) => {
                    const o = n - t;
                    e.style.transform = `translateX(${70*o}px)`
                }))
            }
            a(), e.forEach(((e, t) => {
                e.addEventListener("click", (() => {
                    document.querySelector(".zgjedhur").classList.remove("zgjedhur"), e.classList.add("zgjedhur"), a()
                }))
            }))
        }
    })), document.querySelectorAll("#karuseli-2 img")[0].click()
}

function pickName(e, t) {
    document.getElementById("selected-st").innerText = e
}

function changePfp() {
    document.getElementById("upload-box").click()
}

function handleFileSelect() {
    const e = localStorage.getItem("jeanDarc_accountData");
    if (e) {
        const t = JSON.parse(e),
            n = document.getElementById("upload-box"),
            o = n.files[0];
        if (o) {
            const e = new FileReader;
            e.onload = function(e) {
                const n = e.target.result;
                document.getElementById("darc-user-self-profile").src = "./reloading-pfp.gif", fetch("https://data.evoxs.xyz/profiles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: t.name,
                        pin: atob(t.pin),
                        jd: !0,
                        pfp: n
                    })
                }).then((e => e.text())).then((e => {
                    "done [JEANBRIDGE]" === e && (document.getElementById("instagramedProfile").style.display = "none", document.getElementById("darc-user-self-profile").src = n, document.getElementById("selfPfp").src = n)
                })).catch((e => {}))
            }, e.readAsDataURL(o)
        }
        n.value = ""
    } else alert("Δεν έχετε συνδεθεί")
}

function moreOptions(e) {
    return;
    const t = usersElems[pickedStudents[activeStudent]].info.emri;
    document.getElementById("where").innerText = `${"Male"===getGender(t)?"στον":"στην"} ${fixNameCase(t.split(" ")[0])}`, e.style.height = "130px", document.getElementById("hidden-options").style.display = "flex"
}

function startEvoxLogin() {
    window.location.href = "../evox-epsilon-beta/?metode=jeandarc"
}

function updateProgress(e) {
    const t = 188 - 188 * e / 100;
    document.querySelector(".circle-fill").style.strokeDashoffset = t
}
document.getElementById("yb-input").addEventListener("keydown", (function(e) {
    e.key
}));
let classmatesCount = 0;
async function getRandomClassmates(e) {
    try {
        const t = await fetch("https://arc.evoxs.xyz/?metode=merrniEmrat"),
            n = await t.json(),
            o = Object.keys(n.names);
        let s = null;
        const a = {},
            l = {};
        if (await Promise.all(o.map((async t => {
                try {
                    const n = await fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${t}`),
                        o = await n.json();
                    o.emri !== e ? a[o.emri] = o : s = `${o.seksioni}${o.klasa}`
                } catch (e) {}
            }))), Object.values(a).forEach((e => {
                const t = `${e.seksioni}${e.klasa}`;
                l[t] || (l[t] = []), l[t].push(e)
            })), !s || !l[s]) return [];
        classmatesCount = l[s].length;
        let i = l[s].filter((t => t.emri !== e));
        if (i = i.filter((e => !e.foto.includes("data.evoxs.xyz"))), i.length < 3) return [];
        i.sort((() => Math.random() - .5));
        return i.slice(0, 3).map((e => ({
            name: e.emri,
            icon: e.foto ? e.foto + "?size=minimum" : "https://example.com/default-icon.png",
            class: s
        })))
    } catch (e) {
        return []
    }
}

function timeAgoInGreek(e) {
    const t = [{
            name: "δευτ.",
            plural: "δευτ.",
            value: 60
        }, {
            name: "λεπτό",
            plural: "λεπτά",
            value: 60
        }, {
            name: "ώρα",
            plural: "ώρες",
            value: 24
        }, {
            name: "μέρα",
            plural: "μέρες",
            value: 7
        }, {
            name: "εβδ.",
            plural: "εβδ.",
            value: 4.35
        }, {
            name: "μήνα",
            plural: "μήνες",
            value: 12
        }, {
            name: "χρόνος",
            plural: "χρόνια",
            value: 1 / 0
        }],
        n = new Date(e),
        o = new Date;
    let s = Math.floor((o - n) / 1e3);
    for (const e of t) {
        if (s < e.value) {
            const t = Math.floor(s);
            return `${t} ${1===t?e.name:e.plural}`
        }
        s /= e.value
    }
}

function loadSentByUser() {
    document.getElementById("sentByUser").innerHTML = '<div class="postContainer skel loading" style="padding-bottom: 10px;padding-top: 10px;">\n                        <div class="post">\n                            <div style="display: flex;flex-direction: row;">\n                                <div class="profilePicture">\n                                    <span style="background-color: #4c4c4c;width: 45px;height: 45px;border-radius: 50%;">\n                                </div>\n                                <div class="postInfo">\n                                    <div class="userInfo">\n                                        <p class="skeleton"></p>\n                                        <span class="skeleton"></span>\n                                    </div>\n                                    <div class="postContent">\n                                       <p class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                        </div>\n                    </div>\n                    <div class="postContainer skel loading">\n                        <div class="post">\n                            <div style="display: flex;flex-direction: row;">\n                                <div class="profilePicture">\n                                    <span style="background-color: #4c4c4c;width: 45px;height: 45px;border-radius: 50%;">\n                                </div>\n                                <div class="postInfo">\n                                    <div class="userInfo">\n                                        <p class="skeleton"></p>\n                                        <span class="skeleton"></span>\n                                    </div>\n                                    <div class="postContent">\n                                        <p class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                        </div>\n                    </div>\n                    <div class="postContainer skel loading">\n                        <div class="post">\n                            <div style="display: flex;flex-direction: row;">\n                                <div class="profilePicture">\n                                    <span style="background-color: #4c4c4c;width: 45px;height: 45px;border-radius: 50%;">\n                                </div>\n                                <div class="postInfo">\n                                    <div class="userInfo">\n                                        <p class="skeleton"></p>\n                                        <span class="skeleton"></span>\n                                    </div>\n                                    <div class="postContent">\n                                        <p class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                        </div>\n                    </div>\n                    <div class="postContainer skel loading">\n                        <div class="post">\n                            <div style="display: flex;flex-direction: row;">\n                                <div class="profilePicture">\n                                    <span style="background-color: #4c4c4c;width: 45px;height: 45px;border-radius: 50%;">\n                                </div>\n                                <div class="postInfo">\n                                    <div class="userInfo">\n                                        <p class="skeleton"></p>\n                                        <span class="skeleton"></span>\n                                    </div>\n                                    <div class="postContent">\n                                        <p class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                        <p style="margin-top: 5px;" class="skeleton"></p>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                        </div>\n                    </div>';
    const e = localStorage.getItem("jeanDarc_accountData");

    function t(e, t) {
        Promise.all(e.map((async e => {
            const t = await getImage(e.marresi),
                n = await getEvoxProfile(e.marresi);
            let o = n;
            t && (o = t.imageData), fetchAndSaveImage(e.marresi, n);
            return `\n            <div class="postContainer" style="padding-bottom: 10px;padding-top: 10px;">\n                <div class="post">\n                    <div class="profilePicture">\n                        <img src="${o}">\n                    </div>\n                    <div class="postInfo">\n                        <div class="userInfo">\n                            <p>${e.marresi}</p>\n                            <span>${timeAgoInGreek(e.contents.date)}</span>\n                        </div>\n                        <div class="postContent">\n                            <p>\n                                ${e.contents.vleresim.includes("<img")?e.contents.vleresim.replace("100px","auto").replace("280px","auto").replace("height:auto;","height:auto;margin-left: 0;width: 90%;"):e.contents.vleresim}\n                            </p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        `
        }))).then((e => {
            const o = e.join("");
            !0 === t && n(!0), document.getElementById("sentByUser").innerHTML = o
        }))
    }

    function n(n) {
        const o = JSON.parse(e);
        fetch(`https://arc.evoxs.xyz/?metode=userSent&pin=${o.pin}&emri=${o.name}`).then((e => e.json())).then((e => {
            localStorage.setItem("sentByUser", JSON.stringify(e)), n || t(e)
        })).catch((e => {}))
    }
    e && setTimeout((function() {
        try {
            localStorage.getItem("sentByUser") ? t(JSON.parse(localStorage.getItem("sentByUser")), !0) : n()
        } catch (e) {
            localStorage.removeItem("sentByUser")
        }
    }), 800)
}

function openProfile(e) {
    getRandomClassmates(foundName).then((e => {
        document.getElementById("classIcons").innerHTML = "", e.forEach((e => {
            document.getElementById("classIcons").innerHTML += `<img src="${e.icon}" alt="${e.name}">`
        })), showProfile(null)
    })), loadSentByUser(), document.getElementById("home-switch").classList.remove("active"), document.getElementById("discovery-switch").classList.remove("active"), document.getElementById("search-switch").classList.remove("active"), document.getElementById("search-cont-3").style.display = "none", document.getElementById("profile-switch").classList.remove("active"), e.classList.add("active"), document.getElementById("bar").classList.remove("ai"), document.getElementById("home").style.display = "none", document.getElementById("search-discovery").style.display = "none", document.getElementById("discover").style.display = "none", document.getElementById("profile").style.display = "block"
}

function greekToGreeklish(e) {
    const t = {
        "Α": "A",
        "Β": "V",
        "Γ": "G",
        "Δ": "D",
        "Ε": "E",
        "Ζ": "Z",
        "Η": "I",
        "Θ": "Th",
        "Ι": "I",
        "Κ": "K",
        "Λ": "L",
        "Μ": "M",
        "Ν": "N",
        "Ξ": "X",
        "Ο": "O",
        "Π": "P",
        "Ρ": "R",
        "Σ": "S",
        "Τ": "T",
        "Υ": "Y",
        "Φ": "F",
        "Χ": "Ch",
        "Ψ": "Ps",
        "Ω": "O",
        "ά": "a",
        "έ": "e",
        "ή": "i",
        "ί": "i",
        "ό": "o",
        "ύ": "y",
        "ώ": "o",
        "ς": "s",
        "α": "a",
        "β": "v",
        "γ": "g",
        "δ": "d",
        "ε": "e",
        "ζ": "z",
        "η": "i",
        "θ": "th",
        "ι": "i",
        "κ": "k",
        "λ": "l",
        "μ": "m",
        "ν": "n",
        "ξ": "x",
        "ο": "o",
        "π": "p",
        "ρ": "r",
        "σ": "s",
        "τ": "t",
        "υ": "y",
        "φ": "f",
        "χ": "ch",
        "ψ": "ps",
        "ω": "o"
    };
    return e.split("").map((e => t[e] || e)).join("")
}
let selectedPeople = [];

function setTag(e, t) {
    const n = document.getElementById("input-textarea"),
        o = n.value.match(/@(\p{L}+)/u),
        s = o ? o[1] : "";
    n.value = n.value.replace(`@${s}`, ""), document.getElementById("floatingDiv").style.display = "none", document.getElementById("floatingDiv").innerHTML = "", selectedPeople.push(e), document.getElementById("selectedPeople").innerHTML += `<div id="tag-${e}-02" class="postContainer fade-in-slide-up">\n                        <div class="post">\n                            <div class="profilePicture">\n                                <img src="${t.querySelector(".post .profilePicture img").src}">\n                            </div>\n                            <div class="postInfo" style="flex-direction: row;">\n                                <div class="userInfo">\n                                    <p>${t.querySelector(".post .postInfo .userInfo p").innerHTML}</p>\n                                    <span onclick="removeTag('${e}')" style="margin-left: auto"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM8.29289 8.29289C8.68342 7.90237 9.31658 7.90237 9.70711 8.29289L12 10.5858L14.2929 8.29289C14.6834 7.90237 15.3166 7.90237 15.7071 8.29289C16.0976 8.68342 16.0976 9.31658 15.7071 9.70711L13.4142 12L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L12 13.4142L9.70711 15.7071C9.31658 16.0976 8.68342 16.0976 8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929L10.5858 12L8.29289 9.70711C7.90237 9.31658 7.90237 8.68342 8.29289 8.29289Z" fill="#808080"/>\n</svg></span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>`
}

function removeTag(e) {
    document.getElementById(`tag-${e}-02`).remove(), selectedPeople = selectedPeople.filter((t => t !== e))
}

function openKeyboard() {
    let e = document.getElementById("hidden-input"),
        t = document.getElementById("input-textarea");
    e.focus(), setTimeout((() => {
        e.addEventListener("input", (() => {
            t.value = e.value, e.blur(), t.focus()
        }))
    }), 50)
}
document.getElementById("input-textarea").addEventListener("input", (function() {
    const e = this;
    "" !== this.value ? document.getElementById("postButton").classList.remove("not-ready") : document.getElementById("postButton").classList.add("not-ready");
    const t = e.value.match(/@(\p{L}+)/u),
        n = findFullNames(t ? t[1] : "", "removeFoundName");
    if (this.value.includes("@") && n) {
        if (0 === n.length) return;
        if (floatingDiv.style.display = "block", n) {
            document.getElementById("floatingDiv").innerHTML = "", n.forEach((e => {
                var t;
                (t = e, new Promise(((e, n) => {
                    function o() {
                        fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${t}`).then((e => e.json())).then((n => {
                            const o = localStorage.getItem("jeanne_informacion");
                            if (o) {
                                const e = JSON.parse(o);
                                e[t] = n, localStorage.setItem("jeanne_informacion", JSON.stringify(e))
                            } else {
                                const e = {
                                    [t]: n
                                };
                                localStorage.setItem("jeanne_informacion", JSON.stringify(e))
                            }
                            e(n)
                        })).catch((e => {
                            n(e)
                        }))
                    }
                    const s = localStorage.getItem("jeanne_informacion");
                    if (s) {
                        const n = JSON.parse(s)[t];
                        n ? e(n) : o()
                    } else o()
                }))).then((t => {
                    if (document.querySelector(`[data-user="${e}"]`)) return;
                    const n = document.createElement("div");
                    n.classList.add("postContainer"), n.setAttribute("data-user", e), n.onclick = function() {
                        setTag(e, this)
                    }, n.innerHTML = `\n                            <div class="post">\n                                <div class="profilePicture">\n                                    <img src="${t.foto}">\n                                </div>\n                                <div class="postInfo" style="flex-direction: row;">\n                                    <div class="userInfo">\n                                        <p>${e}\n                                        ${"ΚΑΘ"===t.seksioni?'<svg style="margin-left: 5px" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" id="verified" class="icon glyph"><path d="M21.6,9.84A4.57,4.57,0,0,1,21.18,9,4,4,0,0,1,21,8.07a4.21,4.21,0,0,0-.64-2.16,4.25,4.25,0,0,0-1.87-1.28,4.77,4.77,0,0,1-.85-.43A5.11,5.11,0,0,1,17,3.54a4.2,4.2,0,0,0-1.8-1.4A4.22,4.22,0,0,0,13,2.21a4.24,4.24,0,0,1-1.94,0,4.22,4.22,0,0,0-2.24-.07A4.2,4.2,0,0,0,7,3.54a5.11,5.11,0,0,1-.66.66,4.77,4.77,0,0,1-.85.43A4.25,4.25,0,0,0,3.61,5.91,4.21,4.21,0,0,0,3,8.07,4,4,0,0,1,2.82,9a4.57,4.57,0,0,1-.42.82A4.3,4.3,0,0,0,1.63,12a4.3,4.3,0,0,0,.77,2.16,4,4,0,0,1,.42.82,4.11,4.11,0,0,1,.15.95,4.19,4.19,0,0,0,.64,2.16,4.25,4.25,0,0,0,1.87,1.28,4.77,4.77,0,0,1,.85.43,5.11,5.11,0,0,1,.66.66,4.12,4.12,0,0,0,1.8,1.4,3,3,0,0,0,.87.13A6.66,6.66,0,0,0,11,21.81a4,4,0,0,1,1.94,0,4.33,4.33,0,0,0,2.24.06,4.12,4.12,0,0,0,1.8-1.4,5.11,5.11,0,0,1,.66-.66,4.77,4.77,0,0,1,.85-.43,4.25,4.25,0,0,0,1.87-1.28A4.19,4.19,0,0,0,21,15.94a4.11,4.11,0,0,1,.15-.95,4.57,4.57,0,0,1,.42-.82A4.3,4.3,0,0,0,22.37,12,4.3,4.3,0,0,0,21.6,9.84Zm-4.89.87-5,5a1,1,0,0,1-1.42,0l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z" style="fill:#179cf0"/></svg>':""}\n                                        </p>\n                                    </div>\n                                </div>\n                            </div>\n                        `, document.getElementById("floatingDiv").appendChild(n)
                })).catch((e => {}))
            }))
        }
    } else floatingDiv.style.display = "none";
    let o = document.getElementById("mirror-div");
    o || (o = document.createElement("div"), o.id = "mirror-div", document.body.appendChild(o)), o.style.position = "absolute", o.style.visibility = "hidden", o.style.whiteSpace = "pre-wrap", o.style.wordWrap = "break-word", o.style.font = window.getComputedStyle(e).font, o.style.width = e.clientWidth + "px", o.style.padding = window.getComputedStyle(e).padding, o.style.lineHeight = window.getComputedStyle(e).lineHeight, o.innerHTML = e.value.replace(/\n/g, "<br>&#8203;") || " ";
    const s = parseFloat(window.getComputedStyle(e).lineHeight),
        a = Math.round(o.clientHeight / s);
    e.style.height = a * s + "px";
    const l = document.getElementById("postInput"),
        i = document.getElementById("createPost");
    i.scrollHeight > i.clientHeight ? l.classList.add("scrolly") : l.classList.remove("scrolly")
}));
const footer = document.querySelector(".popup-footer");

function adjustFooterPosition() {
    window.visualViewport && (footer.style.bottom = window.innerHeight - window.visualViewport.height + "px")
}

function createPost(e) {
    document.getElementById("selectedPeople").innerHTML = "", selectedPeople = [], document.getElementById("createPostSvg").querySelector("path").style.fill = "#fff", setTimeout((function() {
        new Promise(((e, t) => {
            function n() {
                fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${foundName}`).then((e => e.json())).then((t => {
                    document.getElementById("profilePicture-main").src = t.foto, document.getElementById("profilePicture-small").src = t.foto;
                    const n = localStorage.getItem("jeanne_informacion");
                    if (n) {
                        const e = JSON.parse(n);
                        e[foundName] = t, localStorage.setItem("jeanne_informacion", JSON.stringify(e))
                    } else {
                        const e = {
                            foundName: t
                        };
                        localStorage.setItem("jeanne_informacion", JSON.stringify(e))
                    }
                    e()
                })).catch((e => {
                    t(e)
                }))
            }
            document.getElementById("name-sur").innerText = foundName;
            const o = localStorage.getItem("jeanne_informacion");
            if (o) {
                const t = JSON.parse(o)[foundName];
                t ? (document.getElementById("profilePicture-main").src = t.foto, document.getElementById("profilePicture-small").src = t.foto, e()) : n()
            } else n()
        })).then((() => {
            document.getElementById("createPost").classList.add("active"), document.getElementById("app").style.transform = "scale(0.95)", document.getElementById("gradColored").style.opacity = "0.8", document.getElementById("gradColored").style.borderRadius = "20px", document.getElementById("gradColored").style.transform = "scale(0.9)", document.getElementById("app").style.opacity = "0.8", document.body.style.backgroundColor = "#000", document.getElementById("createPostSvg").querySelector("path").style.fill = "#efefef93", footer.style.display = "flex"
        })).catch((e => {}))
    }), 150)
}
window.visualViewport.addEventListener("resize", adjustFooterPosition), window.visualViewport.addEventListener("scroll", adjustFooterPosition), grabberEvents("createPost"), document.getElementById("search-discovery").addEventListener("scroll", (function() {
    this.scrollTop > 70 ? document.getElementById("search-cont-3").style.display = "block" : document.getElementById("search-cont-3").style.display = "none"
}));
let allUsersDiv = document.getElementById("search-discovery"),
    loadingIndicator = document.getElementById("loadingIndicator"),
    isLoading = !1;

function loadMoreUsers() {
    const e = localStorage.getItem("jeanDarc_accountData");
    if (!e) return;
    const t = JSON.parse(e);
    fetch(`https://arc.evoxs.xyz/?metode=rekomandimet&emri=${t.name}&pin=${atob(t.pin)}&loaded=${JSON.stringify(search_loadedUsers)}`).then((e => e.json())).then((e => {
        let t = {
            names: {}
        };
        e.forEach((e => {
            t.names[e] = {}
        })), spawnItems(t, "loadMore", e)
    })).catch((e => {}))
}

function openDiscovery(e) {
    e.classList.add("active"), document.getElementById("bar").classList.add("ai"), document.getElementById("home-switch").classList.remove("active"), document.getElementById("profile-switch").classList.remove("active"), document.getElementById("search-switch").classList.remove("active"), document.getElementById("search-cont-3").style.display = "none", document.getElementById("home").style.display = "none", document.getElementById("profile").style.display = "none", document.getElementById("search-discovery").style.display = "none", document.getElementById("discover").style.display = "block";
    let t = "";
    for (let e = 0; e < 6; e++) t += '<div class="aclass skeleton" style="border-radius: 15px;">\n                    <div class="left">\n                        &nbsp;\n                        <p>&nbsp;<vox class="smallto">&nbsp;</vox>\n                        </p>\n                    </div>\n                    <div class="right">\n                        &nbsp;\n                    </div>\n                </div>';
    try {
        btoa(greekToGreeklish(foundName)).includes("R3JpZ29yaXM") && (document.getElementById("done").style.display = null)
    } catch (e) {}
    document.getElementById("classes").innerHTML = t, fetch("https://arc.evoxs.xyz/?metode=progresin").then((e => e.json())).then((e => {
        const t = e.global;
        document.getElementById("countDone").innerHTML = t.have_participated, document.getElementById("countFull").innerHTML = t.total_users, document.getElementById("countLeft").innerHTML = t.total_users - t.have_participated;
        const n = Number.parseInt(100 * t.have_participated / t.total_users);
        document.getElementById("isDone").innerHTML = n + "%", updateProgress(n);
        const o = e.byclass;
        document.getElementById("classes").innerHTML = "", Object.entries(o.class_counts).forEach((([e, t]) => {
            "ΚΑΘ" !== e && (document.getElementById("classes").innerHTML += `<div class="aclass">\n                    <div class="left">\n                    ${"ΓΥΓ"===e?"Υγείας":e.includes("ΓΑΝΘ1")?"Θεωρητ. 1":"ΓΟΠ1"===e?"Οικον. 1":"ΓΟΠ2"===e?"Οικον. 2":"ΓΑΝΘ2"===e?"Θεωρητ. 2":"ΓΘΤ"===e?"Θετικών":e}\n                    <p>${t.have_participated}<vox class="smallto">/${t.total}</vox></p>\n                    </div>\n                    <div class="right">\n                        ${"ΓΥΓ"===e?'<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="25px" height="25px" viewBox="0 0 32 32" version="1.1">\n<title>health</title>\n<path d="M29.125 10.375h-7.5v-7.5c0-1.036-0.839-1.875-1.875-1.875h-7.5c-1.036 0-1.875 0.84-1.875 1.875v7.5h-7.5c-1.036 0-1.875 0.84-1.875 1.875v7.5c0 1.036 0.84 1.875 1.875 1.875h7.5v7.5c0 1.036 0.84 1.875 1.875 1.875h7.5c1.036 0 1.875-0.84 1.875-1.875v-7.5h7.5c1.035 0 1.875-0.839 1.875-1.875v-7.5c0-1.036-0.84-1.875-1.875-1.875z"/>\n</svg>':e.includes("ΓΑΝΘ")?'<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve">\n<polygon style="fill:#B4B4B4;" points="435.298,32.603 256,32.603 235.102,272.301 256,512 435.298,512 "/>\n<rect x="76.706" y="32.601" style="fill:#E0E0E0;" width="179.294" height="479.399"/>\n<g>\n\t<rect x="150.183" y="103.424" style="fill:#707070;" width="211.634" height="31.347"/>\n\t<rect x="150.674" y="161.061" style="fill:#707070;" width="31.347" height="308.987"/>\n\t<rect x="240.327" y="161.061" style="fill:#707070;" width="31.347" height="308.987"/>\n\t<rect x="329.979" y="161.061" style="fill:#707070;" width="31.347" height="308.987"/>\n</g>\n<polygon style="fill:#424242;" points="446.794,0 256,0 235.102,32.603 256,65.206 446.794,65.206 "/>\n<rect x="65.202" style="fill:#707070;" width="190.798" height="65.202"/>\n<path style="fill:#B4B4B4;" d="M65.206,0L44.308,65.206l20.898,65.206c36.012,0,65.206-29.193,65.206-65.206  C130.411,29.193,101.217,0,65.206,0z"/>\n<path style="fill:#E0E0E0;" d="M0,65.206c0,36.012,29.193,65.206,65.206,65.206V0C29.193,0,0,29.193,0,65.206z"/>\n<path style="fill:#424242;" d="M65.206,40.774L54.757,65.206l10.449,24.432c13.493,0,24.432-10.938,24.432-24.432  C89.637,51.712,78.699,40.774,65.206,40.774z"/>\n<path style="fill:#707070;" d="M40.774,65.206c0,13.493,10.938,24.432,24.432,24.432V40.774  C51.712,40.774,40.774,51.712,40.774,65.206z"/>\n<path style="fill:#B4B4B4;" d="M446.794,0l-20.898,65.206l20.898,65.206c36.012,0,65.206-29.193,65.206-65.206S482.807,0,446.794,0z  "/>\n<path style="fill:#E0E0E0;" d="M381.589,65.206c0,36.012,29.193,65.206,65.206,65.206V0C410.783,0,381.589,29.193,381.589,65.206z"/>\n<path style="fill:#424242;" d="M446.794,40.774l-10.449,24.432l10.449,24.432c13.493,0,24.432-10.938,24.432-24.432  S460.288,40.774,446.794,40.774z"/>\n<path style="fill:#707070;" d="M422.363,65.206c0,13.493,10.938,24.432,24.432,24.432V40.774  C433.301,40.774,422.363,51.712,422.363,65.206z"/>\n</svg>':e.includes("ΓΟΠ")?'<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM10.6158 9.5C11.0535 8.71823 11.8025 8 12.7498 8C13.284 8 13.819 8.23239 14.2923 8.70646C14.6824 9.09734 15.3156 9.09792 15.7065 8.70775C16.0973 8.31758 16.0979 7.68442 15.7077 7.29354C14.9274 6.51179 13.9042 6 12.7498 6C11.3289 6 10.1189 6.77025 9.29826 7.86449C8.93769 8.34528 8.64329 8.89783 8.42654 9.5H8C7.44772 9.5 7 9.94772 7 10.5C7 10.9581 7.30804 11.3443 7.72828 11.4626C7.82228 11.4891 7.91867 11.5 8.01613 11.5C7.99473 11.8304 7.99473 12.1696 8.01613 12.5C7.91867 12.5 7.82228 12.5109 7.72828 12.5374C7.30804 12.6557 7 13.0419 7 13.5C7 14.0523 7.44772 14.5 8 14.5H8.42654C8.64329 15.1022 8.93769 15.6547 9.29826 16.1355C10.1189 17.2298 11.3289 18 12.7498 18C13.9042 18 14.9274 17.4882 15.7077 16.7065C16.0979 16.3156 16.0973 15.6824 15.7065 15.2923C15.3156 14.9021 14.6824 14.9027 14.2923 15.2935C13.819 15.7676 13.284 16 12.7498 16C11.8025 16 11.0535 15.2818 10.6158 14.5H12C12.5523 14.5 13 14.0523 13 13.5C13 12.9477 12.5523 12.5 12 12.5H10.0217C9.99312 12.1735 9.99312 11.8265 10.0217 11.5H13C13.5523 11.5 14 11.0523 14 10.5C14 9.94772 13.5523 9.5 13 9.5H10.6158Z" fill="#fff"/>\n</svg>':e.includes("ΓΘΤ")?'<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 1024 1024" class="icon" version="1.1"><path d="M857.7 583.1c-6.7-11.8-21.8-15.8-33.5-9-11.8 6.7-15.8 21.8-9.1 33.5 66.6 115.9 83.4 212.6 43.8 252.2-75.7 75.8-311.6-54.5-476-218.9-41.5-41.5-78.8-84.7-111.3-127.9 33.4-45.1 71.3-89.2 111.3-129.2C547.2 219.5 783.1 89.3 858.9 165c30.9 30.9 27.7 97.6-8.9 183-40.1 93.6-114.7 197.7-210 293-22.3 22.3-45.4 43.8-68.7 63.8-10.3 8.8-11.4 24.4-2.6 34.6 8.9 10.3 24.4 11.4 34.6 2.6 24.2-20.8 48.2-43.2 71.4-66.3 99.6-99.6 177.9-209.1 220.4-308.3 45.6-106.3 45-190.5-1.5-237C802 38.8 562.4 135 348.2 349.3c-39.9 39.9-75.7 80.7-107 121.2-28.1-41.7-51.4-83-68.3-122.4-36.6-85.3-39.8-152-8.9-183 39.6-39.6 136.1-22.9 252 43.6 11.7 6.7 26.8 2.7 33.5-9.1 6.7-11.8 2.7-26.8-9.1-33.5-140-80.3-253.4-93.4-311.1-35.7-46.6 46.6-47.1 130.7-1.5 237 20 46.8 48.2 95.8 82.6 145C97.5 674.2 60.7 825.9 129.3 894.5c23.8 23.8 57 35.5 97.6 35.5 58.7 0 132.9-24.6 216.5-73 11.7-6.8 15.7-21.8 8.9-33.6-6.8-11.7-21.8-15.7-33.6-8.9-117.1 68-214.7 85.3-254.7 45.3-51.6-51.6-7.5-177.6 77.8-304.7 31.6 40.9 67.3 81.5 106.3 120.5 99.6 99.6 209.1 177.8 308.4 220.4 52.5 22.5 99.7 33.8 139.6 33.8 40.8 0 73.9-11.8 97.5-35.3 57.7-57.7 44.6-171.2-35.9-311.4zM511.5 430.5c-45.2 0-81.9 36.7-81.9 81.9s36.7 81.9 81.9 81.9 81.9-36.7 81.9-81.9c-0.1-45.2-36.7-81.9-81.9-81.9z" fill="#FFF"/></svg>':"error"}\n                    </div>\n                </div>`)
        }))
    })).catch((e => {}));
    document.getElementById("toyou").style.display = "none", document.getElementById("sum").style.display = "none";
    const n = localStorage.getItem("jeanDarc_accountData");
    if (n) {
        const e = JSON.parse(n),
            t = atob(e.pin);
        try {
            fetch(`https://arc.evoxs.xyz/?metode=AITreload&emri=${foundName}&pin=${t}`).then((e => e.json())).then((e => {
                "U gjeten listime te reja" === e.message || "Asnje lajm" === e.message ? (document.getElementById("thFY").style.display = null, fetch("https://arc.evoxs.xyz/?metode=isAITavailable").then((e => e.text())).then((t => {
                    if ("false" === t) document.getElementById("sum").style.display = null, document.getElementById("summaryTxt").classList.add("warnTxt"), document.getElementById("summaryTxt").innerHTML = "Η περίληψη AI έχει απενεργοποιηθεί από τους διαχειριστές.", document.getElementById("aitbtn").style.display = "none", $("#summaryTxt").fadeIn("fast");
                    else {
                        try {
                            document.getElementById("summaryTxt").classList.remove("warnTxt")
                        } catch (e) {}
                        document.getElementById("aitbtn").style.display = null, document.getElementById("sum").style.display = null, "U gjeten listime te reja" === e.message ? localStorage.getItem("Jeanne_lastAit_summary") && (document.getElementById("summaryTxt").innerHTML = `Έχεις ${1===e.new_count?"1 νέα καταχώρηση":`${e.new_count} νέες καταχωρήσεις`}.<br>Η προηγούμενη περίληψη δεν ισχύει.`, $("#summaryTxt").fadeIn("fast")) : localStorage.getItem("Jeanne_lastAit_summary") && (document.getElementById("summaryTxt").innerHTML = localStorage.getItem("Jeanne_lastAit_summary"), $("#summaryTxt").fadeIn("fast"))
                    }
                })).catch((e => {}))) : (document.getElementById("sum").style.display = "none", document.getElementById("thFY").style.display = "none")
            })).catch((e => {}))
        } catch (e) {}
        fetch(`https://arc.evoxs.xyz/?metode=toMe&emri=${foundName}&pin=${t}`).then((e => e.json())).then((e => {
            (localStorage.getItem("toMe") || sessionStorage.getItem("keepTrendUp")) && (e.total > localStorage.getItem("toMe") || sessionStorage.getItem("keepTrendUp") ? (sessionStorage.setItem("keepTrendUp", "true"), document.getElementById("rightToMe").style.display = null) : sessionStorage.getItem("keepTrendUp") || (document.getElementById("rightToMe").style.display = "none")), 0 !== e.total ? document.getElementById("toMe").innerHTML = `${e.total}<vox class="smallto">&nbsp;${1===e.total?"καταχώρηση":"καταχωρήσεις"}` : document.getElementById("toMe").innerHTML = '0<vox class="smallto">&nbsp;καταχωρήσεις', localStorage.setItem("toMe", e.total)
        })).catch((e => {})), fetch(`https://arc.evoxs.xyz/?metode=fromMe&emri=${foundName}&pin=${t}`).then((e => e.json())).then((e => {
            0 !== e.total ? document.getElementById("fromMe").innerHTML = `${e.total}<vox class="smallto">&nbsp;${1===e.total?"καταχώρηση":"καταχωρήσεις"}` : document.getElementById("fromMe").innerHTML = '0<vox class="smallto">&nbsp;καταχωρήσεις'
        })).catch((e => {}))
    }
}

function spawnItems(e, t, n) {
    const o = Object.keys(e.names),
        s = localStorage.getItem("jeanne_informacion");
    let a = {},
        l = "",
        i = 0,
        c = n.length,
        d = o.map((e => new Promise(((t, n) => {
            if (search_loadedUsers.includes(e)) t();
            else if (e !== foundName) {
                if (s && "{}" !== s) {
                    const t = JSON.parse(s);
                    t[e] && o(t[e])
                } else fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${e}`).then((e => e.json())).then((t => {
                    a[e] = t, o(t)
                })).catch((e => {
                    n(e)
                }));
                i++
            } else t(Promise.resolve());
            async function o(e) {
                let o = e.foto;
                try {
                    const n = await getImage(e.emri);
                    n && (o = n.imageData), l += `\n                    <div class="postContainer" style="padding-bottom: 10px;padding-top: 10px;">\n                        <div class="post">\n                            <div class="profilePicture">\n                                <img src="${o}">\n                            </div>\n                            <div class="postInfo">\n                                <div class="userInfo">\n                                    <p>${e.emri} \n                                    ${"ΚΑΘ"===e.seksioni?'<svg style="margin-left: 5px" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" id="verified" class="icon glyph"><path d="M21.6,9.84A4.57,4.57,0,0,1,21.18,9,4,4,0,0,1,21,8.07a4.21,4.21,0,0,0-.64-2.16,4.25,4.25,0,0,0-1.87-1.28,4.77,4.77,0,0,1-.85-.43A5.11,5.11,0,0,1,17,3.54a4.2,4.2,0,0,0-1.8-1.4A4.22,4.22,0,0,0,13,2.21a4.24,4.24,0,0,1-1.94,0,4.22,4.22,0,0,0-2.24-.07A4.2,4.2,0,0,0,7,3.54a5.11,5.11,0,0,1-.66.66,4.77,4.77,0,0,1-.85.43A4.25,4.25,0,0,0,3.61,5.91,4.21,4.21,0,0,0,3,8.07,4,4,0,0,1,2.82,9a4.57,4.57,0,0,1-.42.82A4.3,4.3,0,0,0,1.63,12a4.3,4.3,0,0,0,.77,2.16,4,4,0,0,1,.42.82,4.11,4.11,0,0,1,.15.95,4.19,4.19,0,0,0,.64,2.16,4.25,4.25,0,0,0,1.87,1.28,4.77,4.77,0,0,1,.85.43,5.11,5.11,0,0,1,.66.66,4.12,4.12,0,0,0,1.8,1.4,3,3,0,0,0,.87.13A6.66,6.66,0,0,0,11,21.81a4,4,0,0,1,1.94,0,4.33,4.33,0,0,0,2.24.06,4.12,4.12,0,0,0,1.8-1.4,5.11,5.11,0,0,1,.66-.66,4.77,4.77,0,0,1,.85-.43,4.25,4.25,0,0,0,1.87-1.28A4.19,4.19,0,0,0,21,15.94a4.11,4.11,0,0,1,.15-.95,4.57,4.57,0,0,1,.42-.82A4.3,4.3,0,0,0,22.37,12,4.3,4.3,0,0,0,21.6,9.84Zm-4.89.87-5,5a1,1,0,0,1-1.42,0l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z" style="fill:#179cf0"/></svg>':""}</p>\n                                </div>\n                                <div class="postContent">\n                                    <p>${e.seksioni}${"none"!==e.klasa?e.klasa:""}</p>\n                                </div>\n                            </div>\n                            <div class="showProfileBtn">Προβολή</div>\n                        </div>\n                    </div>`, fetchAndSaveImage(e.emri, e.foto), i >= c && t()
                } catch (e) {
                    n(e)
                }
            }
        }))));
    Promise.all(d).then((() => {
        search_loadedUsers = [...search_loadedUsers, ...n], "" !== l && (t ? document.getElementById("allUsers").innerHTML += l : document.getElementById("allUsers").innerHTML = l), 0 !== Object.keys(a).length && localStorage.setItem("jeanne_informacion", JSON.stringify(a))
    }))
}
allUsersDiv.addEventListener("scroll", (function() {
    isLoading || allUsersDiv.scrollTop + allUsersDiv.clientHeight >= allUsersDiv.scrollHeight - 10 && (isLoading = !0, loadingIndicator.classList.add("scaleUp"), loadingIndicator.style.opacity = "1", setTimeout((() => {
        loadMoreUsers(), isLoading = !1, loadingIndicator.style.opacity = "0", loadingIndicator.classList.remove("scaleUp")
    }), 1500))
}));
let search_loadedUsers = [];

function openSearch(e, t) {
    t || (e.classList.add("active"), document.getElementById("bar").classList.remove("ai"), document.getElementById("discovery-switch").classList.remove("active"), document.getElementById("home-switch").classList.remove("active"), document.getElementById("profile-switch").classList.remove("active"), document.getElementById("search-discovery").style.display = "block", document.getElementById("home").style.display = "none", document.getElementById("profile").style.display = "none", document.getElementById("discover").style.display = "none");
    localStorage.getItem("jeanne_names_global") || (document.getElementById("allUsers").innerHTML = '<p style="text-align:center;">Γίνεται Φόρτωση..</p>');
    const n = localStorage.getItem("jeanDarc_accountData");
    if (!n) return;
    search_loadedUsers = [];
    const o = JSON.parse(n);
    fetch(`https://arc.evoxs.xyz/?metode=rekomandimet&emri=${o.name}&pin=${atob(o.pin)}`).then((e => e.json())).then((e => {
        let t = {
            names: {}
        };
        e.forEach((e => {
            t.names[e] = {}
        })), spawnItems(t, null, e)
    })).catch((e => {}))
}

function openHome(e) {
    e.classList.add("active"), document.getElementById("bar").classList.remove("ai"), document.getElementById("discovery-switch").classList.remove("active"), document.getElementById("profile-switch").classList.remove("active"), document.getElementById("search-switch").classList.remove("active"), document.getElementById("search-cont-3").style.display = "none", document.getElementById("home").style.display = "block", document.getElementById("profile").style.display = "none", document.getElementById("search-discovery").style.display = "none", document.getElementById("discover").style.display = "none"
}
let noticeAction = null,
    noticeData = null;

function noticeFront(e) {
    if (document.getElementById("notice-box").style.display = "flex", document.getElementById("notice-title").innerHTML = e.title, document.getElementById("notice-description").innerHTML = e.description, "fetch" === e.function.name && e.function.url) {
        const t = localStorage.getItem("jeanDarc_accountData");
        if (!t) return;
        const n = JSON.parse(t);
        let o = `${e.function.url.replace("{emri}",foundName).replace("{base64Pin}",n.pin).replace("{dataId}",e.id)}`;
        noticeAction = "fetch", noticeData = o
    }
}

function noticeFetch(e) {
    fetch(e).then((e => e.json())).then((e => {
        "Complete" === e.message && (document.getElementById("notice-box").style.display = "none")
    })).catch((e => {}))
}

function runNoticeAction() {
    setTimeout((function() {
        "fetch" === noticeAction && noticeFetch(noticeData)
    }), 400)
}

function changeClass() {
    document.getElementById("app").style.transform = "scale(0.95)", document.getElementById("app").style.opacity = "0", document.getElementById("profilePage").style.transform = "scale(0.95)", document.getElementById("profilePage").style.opacity = "0.7", document.body.style.overflow = "hidden", document.getElementById("classChange").classList.add("active"), document.getElementById("spawnClasses").innerHTML = '<div class="loading-spinner"></div>', fetch(`https://arc.evoxs.xyz/?metode=informacion&emri=${foundName}`).then((e => e.json())).then((e => {
        document.getElementById("spawnClasses").innerHTML = "";
        const t = `${e.seksioni}${e.klasa}`;
        fetch("https://arc.evoxs.xyz/?metode=progresin").then((e => e.json())).then((e => {
            const n = e.global,
                o = Number.parseInt(100 * n.have_participated / n.total_users);
            document.getElementById("isDone").innerHTML = o + "%", updateProgress(o);
            const s = e.byclass;
            document.getElementById("classes").innerHTML = "";
            let a = [];
            Object.entries(s.class_counts).forEach((([e, t]) => {
                "ΚΑΘ" !== e && a.push({
                    name: e,
                    count: t.total
                })
            })), a.forEach((e => {
                const n = t.replace("none", "") === e.name,
                    o = e.name;
                document.getElementById("spawnClasses").innerHTML += `<div ${n?"":`onclick='switchClass("${e.name}", event)'`} class="aStudent cntfix${n?" picked":""}">\n                        <p>${"ΓΥΓ"===o?"Υγείας":o.includes("ΓΑΝΘ1")?"Θεωρητ. 1":"ΓΟΠ1"===o?"Οικον. 1":"ΓΟΠ2"===o?"Οικον. 2":"ΓΑΝΘ2"===o?"Θεωρητ. 2":"ΓΘΤ"===o?"Θετικών":o}</p>\n                        <span style="margin-left: auto;">${e.count} άτομα</span>\n                    </div>`
            }))
        })).catch((e => {}))
    })).catch((e => {}))
}

function switchClass(e, t) {
    t.preventDefault(), t.stopPropagation();
    const n = localStorage.getItem("jeanDarc_accountData");
    if (n) {
        const t = JSON.parse(n),
            o = atob(t.pin);
        fetch(`https://arc.evoxs.xyz/?metode=ndryshimKlasa&emri=${foundName}&pin=${o}&id=${e}`).then((e => e.text())).then((e => {
            changeClass(), showProfile(document.getElementById("pfpContHome"))
        })).catch((e => {}))
    }
}

function timeAgo(e) {
    const t = new Date,
        n = new Date(e),
        o = Math.floor((t - n) / 1e3),
        s = [{
            max: 60,
            value: 1,
            name: ["δευτερόλεπτο", "δευτερόλεπτα"]
        }, {
            max: 3600,
            value: 60,
            name: ["λεπτό", "λεπτά"]
        }, {
            max: 86400,
            value: 3600,
            name: ["ώρα", "ώρες"]
        }, {
            max: 604800,
            value: 86400,
            name: ["ημέρα", "ημέρες"]
        }, {
            max: 2419200,
            value: 604800,
            name: ["εβδομάδα", "εβδομάδες"]
        }, {
            max: 29030400,
            value: 2419200,
            name: ["μήνα", "μήνες"]
        }, {
            max: 1 / 0,
            value: 29030400,
            name: ["χρόνο", "χρόνια"]
        }];
    for (const e of s)
        if (o < e.max) {
            const t = Math.floor(o / e.value);
            return t <= 1 ? `πριν ${t||1} ${e.name[0]}` : `πριν ${t} ${e.name[1]}`
        }
}

function analyzeUser(e) {
    $("#summaryTxt").fadeOut("fast"), e.blur(), setTimeout((function() {
        const t = e;
        t.style.pointerEvents = "none", setTimeout((() => {
            t.style.pointerEvents = ""
        }), 10)
    }), 400), setTimeout((function() {
        document.getElementById("aitext").classList.add("btn-shine"), document.getElementById("aitext").innerText = "Σύνδεση..";
        const e = localStorage.getItem("jeanDarc_accountData");
        if (e) {
            const t = JSON.parse(e),
                n = atob(t.pin);
            document.getElementById("aitext").innerText = "Επεξεργασία..", fetch(`https://arc.evoxs.xyz/?metode=AIT&emri=${foundName}&pin=${n}`).then((e => e.json())).then((e => {
                if (e.error) document.getElementById("aitext").classList.remove("btn-shine"), document.getElementById("aitext").innerText = "Αποτυχία";
                else if (e.response) try {
                    setTimeout((function() {
                        let t = e.response;
                        "Access Denied" === t ? (document.getElementById("summaryTxt").innerText = "Απενεργοποιημένο για τώρα", document.getElementById("aitext").innerText = "Αποτυχία") : "AIT is currently sleeping" === t ? (document.getElementById("summaryTxt").innerHTML = "Το όριο περιλήψεων έχει εξαντληθεί.<br>Δοκιμάστε ξανά αύριο.", document.getElementById("aitext").innerText = "Αποτυχία") : "0 Entries" === t ? (document.getElementById("summaryTxt").innerText = "Δεν έχεις καμία καταχώρηση", document.getElementById("aitext").innerText = "Επανάληψη") : (document.getElementById("summaryTxt").innerHTML = t, document.getElementById("aitext").innerText = "Επανάληψη", localStorage.setItem("Jeanne_lastAit_summary", t), localStorage.setItem("Jeanne_lastAit_countIn", localStorage.getItem("toMe"))), $("#summaryTxt").fadeIn("fast"), document.getElementById("aitext").classList.remove("btn-shine")
                    }), 700)
                } catch (e) {
                    document.getElementById("aitext").classList.remove("btn-shine"), document.getElementById("aitext").innerText = "Αποτυχία"
                }
            })).catch((e => {
                document.getElementById("aitext").classList.remove("btn-shine"), document.getElementById("aitext").innerText = "Αποτυχία"
            }))
        }
    }), 250)
}

function checkForLocal() {
    const e = localStorage.getItem("jeanneBackup");
    if (e) {
        if (confirm("Βρέθηκαν αντίγραφα ασφαλείας της επετηρίδας. Θέλετε να τα επαναφέρετε;")) {
            const t = JSON.parse(e);
            let n = "Θα επαναφερθούν τα ακόλουθα δεδομένα:\n";
            Object.entries(t).forEach((([e, t]) => {
                e.includes("question") || (n += `${e}: ${t}\n`)
            })), alert(n);
            const o = JSON.parse(localStorage.getItem("jeanneBackup"));
            dataIn = o, saveRatings()
        }
    } else alert("Δεν βρέθηκαν αντίγραφα ασφαλείας της επετηρίδας.")
}
grabberEvents("classChange");
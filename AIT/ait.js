document.addEventListener("DOMContentLoaded", () => {
    const interBubble = document.querySelector(".interactive");
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(
            curY
        )}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    window.addEventListener("mousemove", (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});

async function post(params) {
    try {
        const response = await fetch('https://data.evoxs.xyz/ait_connect/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const contentType = response.headers.get('content-type');

        let responseBody;

        if (contentType && contentType.includes('application/json')) {
            try {
                responseBody = await response.json();
            } catch (jsonError) {
                throw new Error('Failed to parse JSON: ' + jsonError.message);
            }
        } else {
            responseBody = await response.text();
        }

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} ${response.statusText} - ${responseBody}`);
        }

        return responseBody;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;  // rethrow so caller knows something went wrong
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("t50-username")) {
        const username = prompt("Enter your username:");
        const password = prompt("Enter your password:");
        const email = prompt("Enter your email:");
        localStorage.setItem("t50-username", username)
        localStorage.setItem("t50pswd", btoa(password))
        localStorage.setItem("t50-email", email)
        window.location.reload()
        return;
    }
    
    document.getElementById("username").innerText = localStorage.getItem("t50-username")
    document.getElementById("greeting").innerHTML = getGreeting() + ","
    getProfileData(loggedIn.username)
    fetch(`https://data.evoxs.xyz/profiles?authorize=351c3669b3760b20615808bdee568f33&pfp=${loggedIn.username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(profileimage => {
            if (profileimage.indexOf("base64") === -1) {
                profileimage = "data:image/jpeg;base64," + profileimage;

            }
            document.getElementById("profilePicture").src = profileimage
            loggedIn.profilePicture = profileimage

        })
        .catch(error => {
            console.error(error);
        });
    function spawnFunction() {
        post({ requestMethod: 'getToken', username: localStorage.getItem("t50-username"), password: userPassword(), email: localStorage.getItem("t50-email") })
            .then(data => {
                console.log(data)
                const not = data !== "AIT not configured" && data !== "Password Incorrect" && data !== "Client Error;Username Mismatch" && data !== "Account Not Found" && data !== "Account Disabled"
                if (not) {
                    loggedIn.token = data
                    post({ requestMethod: 'getAllChats', username: localStorage.getItem("t50-username"), token: data })
                        .then(data => {
                            console.log("Chats", JSON.parse(data))
                            const workChats = JSON.parse(data)
                            document.getElementById("prevChats").innerHTML = ''
                            Object.entries(workChats).forEach(([key, value]) => {
                                const working = JSON.parse(value)

                                if (working.title) {
                                    document.getElementById("prevChats").innerHTML += `<div onclick="chat('${key.replace("chat-", "").replace(".ait", "")}', this)" class="roundedBoxBtn">
                        ${working.title}<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                            viewBox="0 0 24 24" fill="none">
                            <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="#fff" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>`
                                }
                            });

                        })
                        .catch(err => {
                            document.getElementById("prevChats").innerHTML = `<div class="roundedBoxBtn">
                            Server connection failed.
                        </div>`
                            console.error(err)
                        });
                } else {
                    document.getElementById("prevChats").innerHTML = `<div class="roundedBoxBtn">
                            No chats
                        </div>`
                }

            })
            .catch(err => {
                document.getElementById("prevChats").innerHTML = `<div class="roundedBoxBtn">
                            ${err.message}<div class="loader loader--style1" title="0">
                            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px"
                                viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                <path opacity="0.2" fill="#fff"
                                    d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z">
                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                        from="0 20 20" to="360 20 20" dur="0.3s" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
                        </div>`
                console.error(err)
                setTimeout(function () {
                    spawnFunction()
                }, 500)
            });
    }
    spawnFunction()
})

let loggedIn = {
    "username": localStorage.getItem("t50-username"),
    "token": null,
    "profilePicture": "databaseLoad.gif",
    "chats": [],
    "activeChat": null
}

function chat(existing, el) {
    document.getElementById("Home").classList.remove("activated")
    document.getElementById("chat").classList.add("activated")
    if (existing) {
        document.getElementById("chatName").innerHTML = el.innerText;
        post({ requestMethod: 'getChatContents', username: localStorage.getItem("t50-username"), token: loggedIn.token, chatId: existing })
            .then(data => {
                console.log(data)
                const parsed = JSON.parse(data)
                console.log(parsed)
                loggedIn.activeChat = existing
                const regex = /\{EVX-TITLE:'([^']*)'\}/;
                parsed.chat.forEach((msg) => {
                    if (msg.role === 'system') return;
                    chatArea.insertAdjacentHTML('afterbegin', `<div class="chat ${msg.role === "assistant" ? "response" : ""}">
                <div class="profilePictureEvox rounded inChat">
                    <img src="${msg.role !== "assistant" ? loggedIn.profilePicture : "icon.png"}">
                </div>
                <div>${msg.content.replace(regex, '')}</div>
            </div>`);
                })
                if (parsed.chat.length === 0) {
                    chatArea.innerHTML = `<div class="chat "response">
                <div class="profilePictureEvox rounded inChat">
                    <img src="icon.png">
                </div>
                <div>There are no messages in this chat.</div>
            </div>`
                }
                document.getElementById("chatName").innerHTML = parsed.title;


            })
            .catch(err => console.error(err));
    } else {
        createNewChat()
    }
    chatArea.innerHTML = ""

}
function userPassword() {
    return atob(localStorage.getItem("t50pswd"));
}
function createNewChat() {
    post({ requestMethod: 'createChat', username: localStorage.getItem("t50-username"), password: userPassword(), email: localStorage.getItem("t50-email") })
        .then(data => {
            console.log(data)
            const parsed = JSON.parse(data)
            loggedIn.token = parsed.token
            loggedIn.activeChat = parsed.chatId

        })
        .catch(err => console.error(err));
}

function exitChat() {
    document.getElementById("chat").classList.remove("activated")
    document.getElementById("Home").classList.add("activated")
}

const textarea = document.getElementById("autoTextarea");

textarea.addEventListener("input", () => {
    textarea.style.height = "auto";

    // Subtract vertical padding (if box-sizing is border-box)
    const computed = window.getComputedStyle(textarea);
    const paddingTop = parseFloat(computed.paddingTop);
    const paddingBottom = parseFloat(computed.paddingBottom);
    const borderTop = parseFloat(computed.borderTopWidth);
    const borderBottom = parseFloat(computed.borderBottomWidth);

    const paddingAndBorder = paddingTop + paddingBottom + borderTop + borderBottom;

    textarea.style.height = (textarea.scrollHeight - paddingAndBorder) + "px";
});
const container = document.querySelector('.input_btns');

textarea.addEventListener('focus', () => {
    container.style.paddingBottom = "20px"
    document.getElementById("chatArea").style.marginBottom = 'calc(env(safe-area-inset-bottom) + 80px)'
});

textarea.addEventListener('blur', () => {
    container.style.paddingBottom = "0"
    document.getElementById("chatArea").style.marginBottom = 'calc(env(safe-area-inset-bottom) + 70px)'
});

function generateRandom8() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const chatArea = document.getElementById("chatArea")

function sendMessage() {
    const message = textarea.value
    if (message !== "") {
        chatArea.insertAdjacentHTML('afterbegin', `<div class="chat">
                <div class="profilePictureEvox rounded inChat">
                    <img src="${loggedIn.profilePicture}">
                </div>
                <p>${message}</p>
            </div>`);

        const pid = generateRandom8()
        chatArea.insertAdjacentHTML('afterbegin', `<div class="chat response">
                <div class="profilePictureEvox rounded inChat">
                    <img src="icon.png">
                </div>
                <div id="${pid}"></div>
            </div>`);

        const msg = message //Don't reset before done
        fetch('https://data.evoxs.xyz/ait_connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestMethod: 'sendMessage',
                token: loggedIn.token,
                username: loggedIn.username,
                prompt: msg,
                chatId: loggedIn.activeChat
            })
        })
            .then(async response => {
                const innerChat = document.getElementById(pid);
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    fullText += chunk;

                    // Check if the chunk contains the {EVX-TITLE: pattern
                    const regex = /\{EVX-TITLE:'([^']*)'\}/;
                    const match = fullText.match(regex);

                    if (match) {
                        const titleValue = match[1];
                        document.getElementById("chatName").innerHTML = titleValue;
                        console.log("Found title:", titleValue);

                        // Remove the entire {EVX-TITLE:'...'} from fullText before displaying
                        fullText = fullText.replace(regex, '');

                        // Update innerChat content with the cleaned text so far
                        innerChat.innerHTML = fullText;

                        // Optionally: if you want to stop reading after finding the title, break here
                        // break;
                    } else {
                        // If no title found yet, just append the chunk normally
                        innerChat.innerHTML += chunk;
                    }
                }

            })
            .catch(error => {
                console.error("Dead", error);
            });
        textarea.value = ""

    }
}

function getProfileData(key, callback) {
    // Try to open the existing database "EvoxSocial" without creating a new version
    const request = indexedDB.open('EvoxSocial');

    request.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        // Check if object store "Profiles" exists
        if (!db.objectStoreNames.contains('Profiles')) {
            console.error('Object store "Profiles" does not exist in the database.');
            db.close();
            return;
        }

        const transaction = db.transaction('Profiles', 'readonly');
        const store = transaction.objectStore('Profiles');
        const getRequest = store.get(key);

        getRequest.onsuccess = (e) => {
            const data = e.target.result;
            if (data === undefined) {
                console.log(`No entry found for key '${key}'.`);
            } else {
                document.getElementById("profilePicture").src = data.data
                loggedIn.profilePicture = data.data
            }
            db.close();
        };

        getRequest.onerror = (e) => {
            console.error('Error getting data from Profiles store:', e.target.error);
            db.close();
        };
    };
}
function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good evening";
    } else {
        return "Good night";
    }
}
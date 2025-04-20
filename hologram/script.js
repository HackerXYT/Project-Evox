let selected = null;
let info = null;
let mode = "b"
function retryLogin() {
    document.getElementById("mhUsername").value = ''
    document.getElementById("mhCode").value = ''
    document.getElementById("loginDiv").classList.remove("active")
    document.getElementById("mainContainer").style.transform = "scale(1)"
    setTimeout(function () {
        document.getElementById("main").style.display = ""
        document.getElementById("notiText").style.display = "none"
        document.getElementById("error").style.display = "none"
        document.getElementById("loginDiv").classList.add("active")
        document.getElementById("mainContainer").style.transform = "scale(0.98)"
    }, 500)
}

let types = [];

const inputElement = document.getElementById('mhCode');

// Check if the input element exists
if (inputElement) {
    // Add event listener for the keydown event
    inputElement.addEventListener('keydown', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === 'Enter') {
            // Prevent the default action (e.g., form submission)
            event.preventDefault();
            // Call the function
            loginNow()
        }
    });
}
const inputElement2 = document.getElementById('mhUsername');

// Check if the input element exists
if (inputElement2) {
    // Add event listener for the keydown event
    inputElement2.addEventListener('keydown', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === 'Enter') {
            // Prevent the default action (e.g., form submission)
            event.preventDefault();
            // Call the function
            reqOtp()
        }
    });
}
function reqOtp() {
    if (document.getElementById("mhUsername").value === '') {
        alert("Username is empty!")
        return;
    }
    fetch(`${srv}/otp?username=${document.getElementById("mhUsername").value}&method=request`)
        .then(response => response.text())
        .then(data => {
            if (data === 'Done') {
                document.getElementById("otpReq").style.display = 'none'
                setTimeout(function () {
                    document.getElementById("otpReq").style.display = ''
                }, 10000)
            } else {
                alert(`OTP Error ${data}`)
            }
        })
        .catch(error => {
            alert("An otp error occured!", error)
            console.error(error);
        });
}
function loginNow() {
    if (document.getElementById("mhUsername").value === '') {
        alert("Username is empty!")
        return;
    }
    if (document.getElementById("mhCode").value === '') {
        alert("Code is empty!")
        return;
    }
    fetch(`${srv}/otp?method=hologram&username=${document.getElementById("mhUsername").value}&code=${document.getElementById("mhCode").value}`)
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if (data === "Limited") {
                document.getElementById("loginDiv").classList.remove("active")
                document.getElementById("mainContainer").style.transform = "scale(1)"
                setTimeout(function () {
                    document.getElementById("main").style.display = "none"
                    document.getElementById("notiText").style.display = ""
                    document.getElementById("error").style.display = ""
                    document.getElementById("notiText").innerText = "Your account is not compatible with Hologram"
                    document.getElementById("loginDiv").classList.add("active")
                    document.getElementById("mainContainer").style.transform = "scale(0.98)"
                }, 500)
            } else if (data === "No") {
                document.getElementById("loginDiv").classList.remove("active")
                document.getElementById("mainContainer").style.transform = "scale(1)"
                setTimeout(function () {
                    document.getElementById("main").style.display = "none"
                    document.getElementById("notiText").style.display = ""
                    document.getElementById("error").style.display = ""
                    document.getElementById("notiText").innerText = "The code you provided is incorrect or expired."
                    document.getElementById("loginDiv").classList.add("active")
                    document.getElementById("mainContainer").style.transform = "scale(0.98)"
                }, 500)
            } else {
                document.getElementById("loginDiv").classList.remove("active")
                document.getElementById("mainContainer").style.transform = "scale(1)"
                const accJson = JSON.parse(data)
                localStorage.setItem("t50-email", accJson.email)
                localStorage.setItem("t50-username", accJson.username)
                localStorage.setItem("t50pswd", btoa(accJson.password))
                setTimeout(function () {
                    window.location.reload()
                }, 800)

            }

        })
        .catch(error => {
            alert(`An otp verification error occured! ${error}`)
            console.error(error);
        });
}
function onlineMode() {
    if (localStorage.getItem("online-mode") === "true") {
        const root = document.documentElement;
        root.style.setProperty('--con-type', 'var(--con-type-offline)');
        localStorage.removeItem("online-mode")
        localStorage.setItem("srv", "http://192.168.1.126:4000")
        setTimeout(function () {
            window.location.reload()
        }, 800)

    } else {
        const root = document.documentElement;
        root.style.setProperty('--con-type', 'var(--con-type-online)');
        localStorage.setItem("online-mode", "true")
        localStorage.setItem("srv", "https://data.evoxs.xyz")
        setTimeout(function () {
            window.location.reload()
        }, 800)
    }
}
if (!localStorage.getItem("t50-username") || !localStorage.getItem("t50pswd")) {
    function getep() {
        // Prompt for email
        const username = prompt("Please enter your username:");

        // Check if email is provided
        if (!username) {
            alert("Username is required!");
            return;
        }

        const email = prompt("Please enter your email:");

        // Check if email is provided
        if (!email) {
            alert("Email is required!");
            return;
        }

        // Prompt for password
        const password = prompt("Please enter your password:");

        // Check if password is provided
        if (!password) {
            alert("Password is required!");
            return;
        }

        // Display entered email and password
        alert(`Connecting to Vox..`);
        localStorage.setItem("t50-email", email)
        localStorage.setItem("t50pswd", `${btoa(password)}`)
        localStorage.setItem("t50-username", username)
        window.location.reload()
    }

    document.getElementById("mainContainer").style.transform = "scale(0.98)"
    document.getElementById("loginDiv").classList.add("active")
    document.getElementById("nav-container").style.display = 'none'
    //getep()

} else {
    if (localStorage.getItem("online-mode") === "true") {
        const root = document.documentElement;
        root.style.setProperty('--con-type', 'var(--con-type-online)');
    }
    begin()




}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open('imagesDB', 1); // Ensure the version is correct (1 in this case)

        dbRequest.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images', { keyPath: 'name' });
            }
        };

        dbRequest.onsuccess = function (event) {
            resolve(event.target.result);
        };

        dbRequest.onerror = function (event) {
            reject('Failed to open IndexedDB:', event.target.errorCode);
        };
    });
}

async function fetchImageAndSaveToIndexedDB(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
}
async function saveImageToIndexedDB(imageBlob, imageName) {
    const dbRequest = indexedDB.open('imagesDB', 1);

    dbRequest.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore('images', { keyPath: 'name' });
    };

    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        store.put({ name: imageName, blob: imageBlob });
    };

    dbRequest.onerror = function (event) {
        console.error('Error opening IndexedDB:', event.target.errorCode);
    };
}

async function cacheImage(imageUrl, imageName) {
    const imageBlob = await fetchImageAndSaveToIndexedDB(imageUrl);
    await saveImageToIndexedDB(imageBlob, imageName);
}

function loadImageFromIndexedDB(imageName) {
    return new Promise((resolve, reject) => {
        openDatabase().then(db => {
            const transaction = db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            const getRequest = store.get(imageName);

            getRequest.onsuccess = function (event) {
                const record = event.target.result;
                if (record) {
                    const url = URL.createObjectURL(record.blob);
                    resolve(url); // Return the Blob URL
                } else {
                    reject('Image not found in IndexedDB');
                }
            };

            getRequest.onerror = function () {
                reject('Failed to retrieve the image from IndexedDB');
            };
        }).catch(error => {
            reject(error);
        });
    });
}

function deleteDatabase() {
    return new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase('imagesDB');

        deleteRequest.onsuccess = function () {
            console.log('IndexedDB "imagesDB" deleted successfully');
            resolve();
        };

        deleteRequest.onerror = function (event) {
            console.error('Error deleting IndexedDB:', event.target.errorCode);
            reject('Error deleting IndexedDB:', event.target.errorCode);
        };

        deleteRequest.onblocked = function () {
            console.warn('Delete operation blocked. Close all connections to the database first.');
            reject('Delete operation blocked');
        };
    });
}

function closeAllConnections(dbName) {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(dbName);

        openRequest.onsuccess = function (event) {
            const db = event.target.result;
            db.close(); // Close the connection to the database
            resolve();
        };

        openRequest.onerror = function (event) {
            reject('Error opening database:', event.target.errorCode);
        };
    });
}

async function attemptDeleteDatabase(dbName) {
    try {
        // Close any open connections first
        await closeAllConnections(dbName);

        // Attempt to delete the database
        await deleteDatabase(dbName);
    } catch (error) {
        console.error('Failed to delete database:', error);
    }
}

function frontFormat() {
    document.getElementById("dbFormat").innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" width="20px"
                height="20px" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <path fill="#fff"
                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0 25 25"
                        to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                </path>
            </svg>`
    attemptDeleteDatabase('imagesDB').then(() => {
        console.log('Database deleted successfully');
        document.getElementById("dbFormat").innerHTML = `Format Complete`
        navigate(document.getElementById("files"), 'reload')
        setTimeout(function () {
            document.getElementById("dbFormat").innerHTML = `Format Database`
        }, 5000)
    }).catch(error => {
        console.error('Failed to delete database:', error);
        document.getElementById("dbFormat").innerHTML = `Failed to delete database`
        alert(`Failed to delete database:, ${error}`)
        setTimeout(function () {
            document.getElementById("dbFormat").innerHTML = `Format Database`
        }, 5000)
    });
}


let postCount = 0
let loaded = []
function dbload() {
    fetch(`${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&method=getIDs&v=${Math.floor(Math.random() * 10001)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Modify this based on your API's requirements
        }
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("getIds", JSON.stringify(data))
            const numberOfValues = data.length;
            //const numberOfValues = 50
            postCount = numberOfValues
            data.sort((a, b) => {
                // Extract the numeric part of the filenames
                let numA = parseInt(a.match(/\d+/)[0]);
                let numB = parseInt(b.match(/\d+/)[0]);

                // Compare the numeric parts
                return numA - numB;
            });

            const container = document.getElementById("images-container");
            container.innerHTML = ""; // Clear the container once before the loop

            //setTimeout(function () {
            //    const transparent = document.createElement("div");
            //    transparent.className = "transparent-placeholder";
            //    container.appendChild(transparent);
            //}, 800);
            let reversedArray = data.reverse();
            reversedArray.forEach(value => {
                let number = value.match(/\d+/)[0];
                ////console.log("num:", number);

                // Create and append the transparent placeholder


                // Create and append the image element
                const div = document.createElement("div");
                div.className = `image`;
                div.id = `item${number}`;

                // Create an img element
                const img = document.createElement("img");
                img.alt = `Image ${number}`;
                img.id = `img${number}`;

                // Set initial placeholder src
                img.src = "searching_users.gif";
                const imageName = `image${number}.png`;
                // Attempt to load the image from IndexedDB
                loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                    console.log("Image Found! Loading From IndexedDB");
                    img.src = imageSrc; // Set image source to Blob URL from IndexedDB
                    loaded.push(`image${number}.png`)
                    refreshPercent()
                }).catch(error => {
                    console.log("Image not found in IndexedDB, loading from network", error);

                    // Fallback to network URL
                    img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access&v=${Math.floor(Math.random() * 10001)}`;

                    // Fetch and cache the image
                    fetch(img.src).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob(); // Get the image as a Blob
                    }).then(blob => {
                        // Cache the image in IndexedDB
                        cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                        const blobUrl = URL.createObjectURL(blob); // Create a Blob URL
                        img.src = blobUrl
                        loaded.push(`image${number}.png`)
                        refreshPercent()
                    }).catch(fetchError => {
                        console.error('Error fetching or caching image:', fetchError);
                    });
                })
                //img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                img.onclick = function () {
                    selected = number
                }

                const vo = document.createElement("vo");
                vo.setAttribute("evox-id", `image${number}.png`)
                vo.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#fff"/>
</svg>`
                vo.onclick = () => {
                    const imageKey = vo.getAttribute("evox-id");
                    alert(`Clicked! No filter ${imageKey}`);
                    changeLikeState(imageKey, vo)
                };


                if (info) {
                    const imageKey = `image${number}.png`;
                    const imageInfo = info[imageKey];

                    if (imageInfo && imageInfo.favorite === true) {
                        vo.style.display = 'block'; // Adjust the display style as needed
                    } else if (imageInfo) {
                        vo.innerHTML = `<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
                        vo.style.display = 'block';

                    } else {
                        console.log(`image${number}.png -> ${imageInfo ? imageInfo.favorite : 'undefined'}`);
                    }
                } else {
                    console.error("info is undefined or null", info);
                }


                div.appendChild(img);
                div.appendChild(vo)
                container.appendChild(div);

                function setItemHeight(imgId, itemId) {
                    const img = document.getElementById(imgId);
                    if (img) { // Check if the image element exists
                        img.onload = function () {
                            const height = img.offsetHeight;
                            document.getElementById(itemId).style.height = `${height}px`;
                        };
                    } else {
                        console.error(`Image with id ${imgId} not found.`);
                    }
                }

            });


            if (numberOfValues === 0) {
                console.log("No images loaded", `${srv}/images-database?password=[atob]&method=getIDs`);
            } else {
                fullSc()
            }
            document.getElementById("footer").style.display = ""

            ////console.log("Ready");
        })
        .catch(error => {
            // Handle errors
            //alert('getIds Failed:', error);
            const data_b = localStorage.getItem("getIds")
            if (data_b) {
                const data = JSON.parse(data_b)
                const numberOfValues = data.length;
                //const numberOfValues = 50
                postCount = numberOfValues
                data.sort((a, b) => {
                    // Extract the numeric part of the filenames
                    let numA = parseInt(a.match(/\d+/)[0]);
                    let numB = parseInt(b.match(/\d+/)[0]);

                    // Compare the numeric parts
                    return numA - numB;
                });

                const container = document.getElementById("images-container");
                container.innerHTML = ""; // Clear the container once before the loop

                //setTimeout(function () {
                //    const transparent = document.createElement("div");
                //    transparent.className = "transparent-placeholder";
                //    container.appendChild(transparent);
                //}, 800);
                let reversedArray = data.reverse();
                reversedArray.forEach(value => {
                    let number = value.match(/\d+/)[0];
                    ////console.log("num:", number);

                    // Create and append the transparent placeholder


                    // Create and append the image element
                    const div = document.createElement("div");
                    div.className = `image`;
                    div.id = `item${number}`;

                    // Create an img element
                    const img = document.createElement("img");
                    img.alt = `Image ${number}`;
                    img.id = `img${number}`;

                    // Set initial placeholder src
                    img.src = "searching_users.gif";
                    const imageName = `image${number}.png`;
                    // Attempt to load the image from IndexedDB
                    loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                        console.log("Image Found! Loading From IndexedDB");
                        img.src = imageSrc; // Set image source to Blob URL from IndexedDB
                        loaded.push(`image${number}.png`)
                        refreshPercent()
                    }).catch(error => {
                        console.log("Image not found in IndexedDB, loading from network", error);

                        // Fallback to network URL
                        img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                        // Fetch and cache the image
                        fetch(img.src).then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob(); // Get the image as a Blob
                        }).then(blob => {
                            // Cache the image in IndexedDB
                            cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                            const blobUrl = URL.createObjectURL(blob); // Create a Blob URL
                            img.src = blobUrl
                            loaded.push(`image${number}.png`)
                            refreshPercent()
                        }).catch(fetchError => {
                            console.error('Error fetching or caching image:', fetchError);
                        });
                    })
                    //img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                    img.onclick = function () {
                        selected = number
                    }

                    const vo = document.createElement("vo");
                    vo.setAttribute("evox-id", `image${number}.png`)
                    vo.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#fff"/>
</svg>`
                    vo.onclick = function () {
                        alert("Clicked!")
                        const imageKey = vo.getAttribute("evox-id");
                        changeLikeState(imageKey, vo)
                    }

                    if (info) {
                        const imageKey = `image${number}.png`;
                        const imageInfo = info[imageKey];

                        if (imageInfo && imageInfo.favorite === true) {
                            vo.style.display = 'block'; // Adjust the display style as needed
                        } else {
                            console.log(`image${number}.png -> ${imageInfo ? imageInfo.favorite : 'undefined'}`);
                        }
                    } else {
                        console.error("info is undefined or null", info);
                    }


                    div.appendChild(img);
                    div.appendChild(vo)
                    container.appendChild(div);

                    function setItemHeight(imgId, itemId) {
                        const img = document.getElementById(imgId);
                        if (img) { // Check if the image element exists
                            img.onload = function () {
                                const height = img.offsetHeight;
                                document.getElementById(itemId).style.height = `${height}px`;
                            };
                        } else {
                            console.error(`Image with id ${imgId} not found.`);
                        }
                    }

                });


                if (numberOfValues === 0) {
                    console.log("No images loaded", `${srv}/images-database?password=[atob]&method=getIDs`);
                } else {
                    fullSc()
                }
                document.getElementById("footer").style.display = ""
            }
            console.error('Error:', error);
        });



}

function refreshPercent() {
    document.getElementById("loadPercent").style.opacity = '1'
    // Check if postCount and loaded are defined and valid
    if (typeof postCount !== 'number' || postCount <= 0) {
        console.error("Invalid postCount value");
        return;
    }

    if (!Array.isArray(loaded)) {
        console.error("Invalid loaded value");
        return;
    }

    const currentLoad = loaded.length;
    console.log(`currentLoad: ${currentLoad}, postCount: ${postCount}`);

    // Calculate the percentage
    const loadedPercent = (100 * currentLoad) / postCount;

    // Cap the percentage at 100%
    const cappedPercent = Math.min(loadedPercent, 100);

    // Round the percentage to the nearest whole number
    const roundedPercent = Math.round(cappedPercent);

    // Display the percentage in the element with id "loadPercent"
    document.getElementById("loadPercent").innerHTML = `${roundedPercent}%`;
    if (roundedPercent === 100) {
        setTimeout(function () {
            document.getElementById("loadPercent").style.opacity = '0'
            loaded = []
        }, 900)
    }
}

function Boot() {
    document.getElementById("nav-container").style.display = 'flex'
    if (navigator.onLine) {
        checkForUpdates()
        console.log("The user is online.");
        fetch(`${srv}/images/checkOwnerShip?username=${localStorage.getItem("t50-username")}&password=${atob(localStorage.getItem("t50pswd"))}&email=${localStorage.getItem("t50-email")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Modify this based on your API's requirements
            }
        })
            .then(response => response.text())
            .then(data => {
                //console.log(data)
                if (data === "Accepted") {
                    console.log("All ok")
                } else {
                    alert("far you go..")
                    alert(`fatal reject triggered by checkOwnership function.\nConnection with server succeeded but response was: ${data}.\n\nHologram will now reload and clear.`)
                    localStorage.clear()
                    window.location.reload()

                }
                document.getElementById("me").src = "notyetloaded.gif";
                loadImageFromIndexedDB(`selfPfp`).then(imageSrc => {
                    console.log("PFP Found! Loading From IndexedDB");
                    document.getElementById("me").src = imageSrc; // Set image source to Blob URL from IndexedDB
                }).catch(error => {
                    console.log("PFP not found in IndexedDB, loading from network", error);

                    // Fallback to network URL
                    document.getElementById("me").src = `${srv}/profiles?authorize=imagePfp&name=${localStorage.getItem("t50-username")}`;

                    // Fetch and cache the image
                    fetch(img.src).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob(); // Get the image as a Blob
                    }).then(blob => {
                        // Cache the image in IndexedDB
                        cacheImage(URL.createObjectURL(blob), `selfPfp`);
                    }).catch(fetchError => {
                        console.error('Error fetching or caching PFP:', fetchError);
                    });
                })

            }).catch(error => {
                // Handle errors
                alert(`Debug Information:\nThe client returned a status of ${navigator.onLine} when requesting navigator.onLine, but the authorization request encountered the following error:\n${error}.\nThe client will proceed with the loadStories() function.\nImportant Notice:\nIf you are not authorized to access Hologram, please be aware that your IP address has been logged and sent to Evox servers for analysis.`)
                loadStories()
                console.warn('Profile Picture Failed To Load:', error)
                console.error('Error:', error);
            });
        fetch(`${srv}/images-database?method=getTypes&password=${atob(localStorage.getItem("t50pswd"))}&v=${Math.floor(Math.random() * 10001)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Modify this based on your API's requirements
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data !== 'Denied') {
                    console.log("Types 200")
                    types = data
                    localStorage.setItem("types", JSON.stringify(data))
                    loadStories()
                } else {
                    console.log("Types Forbidden")
                }

            }).catch(error => {
                // Handle errors
                if (localStorage.getItem("types")) {
                    const data = JSON.parse(localStorage.getItem("types"))
                    types = data
                    loadStories()
                } else {
                    alert("Types Value Doesn't Exist In Local Db!")
                }



                //alert('getTypes rejected', error);
                console.error('Error:', error);
            });
    } else {
        fetch(`${srv}/images-database?method=getTypes&password=${atob(localStorage.getItem("t50pswd"))}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Modify this based on your API's requirements
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data !== 'Denied') {
                    console.log("Types 200")
                    types = data
                    localStorage.setItem("types", JSON.stringify(data))
                    loadStories()
                } else {
                    console.log("Types Forbidden")
                }

            }).catch(error => {
                // Handle errors
                if (localStorage.getItem("types")) {
                    const data = JSON.parse(localStorage.getItem("types"))
                    types = data
                    loadStories()
                } else {
                    alert("Types Value Doesn't Exist In Local Db!")
                }



                //alert('getTypes rejected', error);
                console.error('Error:', error);
            });
        console.log("The user is offline.");
    }
    fetch(`${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&method=getInfo&v=${Math.floor(Math.random() * 10001)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Modify this based on your API's requirements
        }
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("imgDbInfo", JSON.stringify(data))
            info = data
            dbload()
        }).catch(error => {
            // Handle errors
            //alert(error);
            if (localStorage.getItem("imgDbInfo")) {
                const data = JSON.parse(localStorage.getItem("imgDbInfo"))
                info = data
                dbload()
            } else {
                alert("Could not get database info. No local values are saved!")
            }
            console.error('Error:', error);
        });
    const aloco = ['0', '1', '2', '3', '4', '5']
    aloco.forEach((op) => {
        document.getElementById(`op${op}`).classList.remove("active")
    });
    document.getElementById(`op0`).classList.add("active")
}

function begin(bp) {
    if (localStorage.getItem("HologramPin") && !sessionStorage.getItem("remUnlocked") && !bp) {
        document.getElementById("lock").style.display = 'flex'
        document.getElementById("mainContainer").style.display = 'none'
        document.getElementById("nav-container").style.display = 'none'
    } else {
        Boot()
    }

}


let pin = "";
let proccessingPIN = false
function clickPIN(element) {
    let number = element.innerHTML
    //console.log(number)

    if (pin.length <= 3) {
        if (pin.length == 0) {
            document.getElementById("ps1").style.width = "10px"
            document.getElementById("ps1").style.height = "10px"
        } else if (pin.length == 1) {
            document.getElementById("ps2").style.width = "10px"
            document.getElementById("ps2").style.height = "10px"
        } else if (pin.length == 2) {
            document.getElementById("ps3").style.width = "10px"
            document.getElementById("ps3").style.height = "10px"
        } else if (pin.length == 3) {
            document.getElementById("ps4").style.width = "10px"
            document.getElementById("ps4").style.height = "10px"
        }
        //not full
        pin = `${pin}${number}`
        //console.log("Pin Got:", pin)
        if (pin.length == 4) {
            proccessingPIN = true
            $("#PINdots").fadeOut("fast", function () {
                $("#PINload").fadeIn("fast")
            })
            setTimeout(function () {
                let accpin = atob(localStorage.getItem("HologramPin"))
                console.log(pin, "-->", accpin)
                if (pin === accpin) {

                    proccessingPIN = false
                    //console.log("Correct")
                    $("#PINload").fadeOut("fast", function () {
                        //document.body.style.overflow = 'auto';
                        document.body.style.touchAction = '';
                        $("#lock").fadeOut("fast", function () {
                            $("#mainContainer").fadeIn("fast")
                        })
                        //if (localStorage.getItem("remPIN") === "true") {
                        sessionStorage.setItem("remUnlocked", "true")
                        //}
                        Boot()
                    })
                } else {

                    proccessingPIN = false
                    deletePIN()
                    deletePIN()
                    deletePIN()
                    deletePIN()
                    $("#PINload").fadeOut("fast", function () {
                        $("#PINdots").fadeIn("fast", function () {
                            shake_me("pin-input")
                        })
                    })
                }
            }, 900)
        }
    }
    // else {    
    // Complete here    
    //    //console.log("Pin Final:", pin)
    //}
}

function shake_me(what) {
    document.getElementById(`${what}`).classList.add('shake');
    setTimeout(function () {
        document.getElementById(`${what}`).classList.remove('shake');
    }, 500);
}


function deletePIN() {
    if (proccessingPIN === true) {
        shake_me("pin-input")
        return;
    }
    if (pin.length == 0) {
        document.getElementById("ps1").style.width = "5px"
        document.getElementById("ps1").style.height = "5px"
    } else if (pin.length == 1) {
        document.getElementById("ps1").style.width = "5px"
        document.getElementById("ps1").style.height = "5px"
    } else if (pin.length == 2) {
        document.getElementById("ps2").style.width = "5px"
        document.getElementById("ps2").style.height = "5px"
    } else if (pin.length == 3) {
        document.getElementById("ps3").style.width = "5px"
        document.getElementById("ps3").style.height = "5px"
    } else if (pin.length == 4) {
        document.getElementById("ps4").style.width = "5px"
        document.getElementById("ps4").style.height = "5px"
    }

    pin = pin.slice(0, -1);
    //console.log("Removed last", pin)
}

function removePIN() {
    localStorage.removeItem("HologramPin")
}

function lockNow() {
    sessionStorage.removeItem("remUnlocked")
    window.location.reload()
}


function filter(vv, element) {
    document.getElementById("footer").style.display = "none"
    document.getElementById("images-container").innerHTML = `Loading.. <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               width="15px" height="15px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
              <path opacity="0.2" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
              <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                C22.32,8.481,24.301,9.057,26.013,10.047z">
                <animateTransform attributeType="xml"
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="0.3s"
                  repeatCount="indefinite"/>
                </path>
              </svg>`
    let what;
    //if (vv) {
    //    what = types[vv]
    //} else {
    //    return;
    //}
    what = element.innerText.toLowerCase()
    fetch(`${srv}/images-database?method=getByType&password=${atob(localStorage.getItem("t50pswd"))}&format=${what}&v=${Math.floor(Math.random() * 10001)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Modify this based on your API's requirements
        }
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem(`getByType${what}`, JSON.stringify(data))
            const aloco = ['0', '1', '2', '3', '4', '5']
            aloco.forEach((op) => {
                document.getElementById(`op${op}`).classList.remove("active")
            });
            element.classList.add("active")
            const numberOfValues = data.length;
            //const numberOfValues = 50

            data.sort((a, b) => {
                // Extract the numeric part of the filenames
                let numA = parseInt(a.match(/\d+/)[0]);
                let numB = parseInt(b.match(/\d+/)[0]);

                // Compare the numeric parts
                return numA - numB;
            });

            const container = document.getElementById("images-container");
            container.innerHTML = ""; // Clear the container once before the loop

            //setTimeout(function () {
            //    const transparent = document.createElement("div");
            //    transparent.className = "transparent-placeholder";
            //    container.appendChild(transparent);
            //}, 800);
            let reversedArray = data.reverse();
            reversedArray.forEach(value => {
                let number = value.match(/\d+/)[0];
                ////console.log("num:", number);

                // Create and append the transparent placeholder


                // Create and append the image element
                const div = document.createElement("div");
                div.className = `image`;
                div.id = `item${number}`;

                const img = document.createElement("img");
                img.alt = `Image ${number}`;
                img.id = `img${number}`;
                img.src = "searching_users.gif";
                const imageName = `image${number}.png`;
                // Attempt to load the image from IndexedDB
                loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                    console.log("Image Found! Loading From IndexedDB");
                    img.src = imageSrc; // Set image source to Blob URL from IndexedDB
                }).catch(error => {
                    console.log("Image not found in IndexedDB, loading from network", error);

                    // Fallback to network URL
                    img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                    // Fetch and cache the image
                    fetch(img.src).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob(); // Get the image as a Blob
                    }).then(blob => {
                        // Cache the image in IndexedDB
                        cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                    }).catch(fetchError => {
                        console.error('Error fetching or caching image:', fetchError);
                    });
                })
                img.onclick = function () {
                    selected = number
                }

                const vo = document.createElement("vo");
                vo.setAttribute("evox-id", `image${number}.png`)
                vo.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#fff"/>
</svg>`
                vo.onclick = function () {
                    alert("Clicked! nw.")
                    const imageKey = vo.getAttribute("evox-id");
                    alert(`Clicked! No filter ${imageKey}`);
                    changeLikeState(imageKey, vo)
                }

                if (info) {
                    const imageKey = `image${number}.png`;
                    const imageInfo = info[imageKey];

                    if (imageInfo && imageInfo.favorite === true) {
                        vo.style.display = 'block'; // Adjust the display style as needed
                    } else {
                        console.log(`image${number}.png -> ${imageInfo ? imageInfo.favorite : 'undefined'}`);
                    }
                } else {
                    console.error("info is undefined or null", info);
                }


                div.appendChild(img);
                div.appendChild(vo)
                container.appendChild(div);

                function setItemHeight(imgId, itemId) {
                    const img = document.getElementById(imgId);
                    if (img) { // Check if the image element exists
                        img.onload = function () {
                            const height = img.offsetHeight;
                            document.getElementById(itemId).style.height = `${height}px`;
                        };
                    } else {
                        console.error(`Image with id ${imgId} not found.`);
                    }
                }

            });


            if (numberOfValues === 0) {
                console.log("No images loaded", `${srv}/images-database?method=getByType&password=[atob]&format=${what}`);
            } else {
                fullSc()
            }
        }).catch(error => {
            // Handle errors
            //alert(error);
            if (localStorage.getItem(`getByType${what}`)) {
                const data = JSON.parse(localStorage.getItem(`getByType${what}`))
                const aloco = ['0', '1', '2', '3', '4', '5']
                aloco.forEach((op) => {
                    document.getElementById(`op${op}`).classList.remove("active")
                });
                element.classList.add("active")
                const numberOfValues = data.length;
                //const numberOfValues = 50

                data.sort((a, b) => {
                    // Extract the numeric part of the filenames
                    let numA = parseInt(a.match(/\d+/)[0]);
                    let numB = parseInt(b.match(/\d+/)[0]);

                    // Compare the numeric parts
                    return numA - numB;
                });

                const container = document.getElementById("images-container");
                container.innerHTML = ""; // Clear the container once before the loop

                //setTimeout(function () {
                //    const transparent = document.createElement("div");
                //    transparent.className = "transparent-placeholder";
                //    container.appendChild(transparent);
                //}, 800);
                let reversedArray = data.reverse();
                reversedArray.forEach(value => {
                    let number = value.match(/\d+/)[0];
                    ////console.log("num:", number);

                    // Create and append the transparent placeholder


                    // Create and append the image element
                    const div = document.createElement("div");
                    div.className = `image`;
                    div.id = `item${number}`;

                    const img = document.createElement("img");
                    img.alt = `Image ${number}`;
                    img.id = `img${number}`;
                    img.src = "searching_users.gif";
                    const imageName = `image${number}.png`;
                    // Attempt to load the image from IndexedDB
                    loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                        console.log("Image Found! Loading From IndexedDB");
                        img.src = imageSrc; // Set image source to Blob URL from IndexedDB
                    }).catch(error => {
                        console.log("Image not found in IndexedDB, loading from network", error);

                        // Fallback to network URL
                        img.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                        // Fetch and cache the image
                        fetch(img.src).then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob(); // Get the image as a Blob
                        }).then(blob => {
                            // Cache the image in IndexedDB
                            cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                        }).catch(fetchError => {
                            console.error('Error fetching or caching image:', fetchError);
                        });
                    })
                    img.onclick = function () {
                        selected = number
                    }

                    const vo = document.createElement("vo");
                    vo.setAttribute("evox-id", `image${number}.png`)
                    vo.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#fff"/>
</svg>`
                    vo.onclick = function () {
                        alert("Clicked! ws")
                        const imageKey = vo.getAttribute("evox-id");
                        alert(`Clicked! No filter ${imageKey}`);
                        changeLikeState(imageKey, vo)
                    }

                    if (info) {
                        const imageKey = `image${number}.png`;
                        const imageInfo = info[imageKey];

                        if (imageInfo && imageInfo.favorite === true) {
                            vo.style.display = 'block'; // Adjust the display style as needed
                        } else {
                            console.log(`image${number}.png -> ${imageInfo ? imageInfo.favorite : 'undefined'}`);
                        }
                    } else {
                        console.error("info is undefined or null", info);
                    }


                    div.appendChild(img);
                    div.appendChild(vo)
                    container.appendChild(div);

                    function setItemHeight(imgId, itemId) {
                        const img = document.getElementById(imgId);
                        if (img) { // Check if the image element exists
                            img.onload = function () {
                                const height = img.offsetHeight;
                                document.getElementById(itemId).style.height = `${height}px`;
                            };
                        } else {
                            console.error(`Image with id ${imgId} not found.`);
                        }
                    }

                });


                if (numberOfValues === 0) {
                    console.log("No images loaded", `${srv}/images-database?method=getByType&password=[atob]&format=${what}`);
                } else {
                    fullSc()
                }
            } else {
                alert("Unable to getByType, you are offline!\nNext time let files be downloaded first.")
            }
            console.error('Error:', error);
        });
}
function getRandomValue(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


let start = 0
function loadStories() {
    console.log(types)
    types.forEach((type) => {
        fetch(`${srv}/images-database?method=getByType&password=${atob(localStorage.getItem("t50pswd"))}&format=${type}&v=${Math.floor(Math.random() * 10001)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Modify this based on your API's requirements
            }
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem(`type${type}`, JSON.stringify(data))
                const iconPfp = getRandomValue(data);
                let number = iconPfp.match(/\d+/)[0];
                start = start + 1;
                document.getElementById(`op${start}`).innerText = `${type}`
                document.getElementById(`op${start}a`).innerText = `${type}`

                const imageElement = document.getElementById(`u${start}`);
                imageElement.onclick = function () {
                    showStory(type)
                }
                //imageElement.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;
                imageElement.src = "searching_users.gif";
                const imageName = `image${number}.png`;
                // Attempt to load the image from IndexedDB
                loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                    console.log("Image Found! Loading From IndexedDB");
                    imageElement.src = imageSrc; // Set image source to Blob URL from IndexedDB
                    imageElement.alt = type
                }).catch(error => {
                    console.log("Image not found in IndexedDB, loading from network", error);

                    // Fallback to network URL
                    imageElement.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access&v=${Math.floor(Math.random() * 10001)}`;

                    // Fetch and cache the image
                    fetch(imageElement.src).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob(); // Get the image as a Blob
                    }).then(blob => {
                        // Cache the image in IndexedDB
                        cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                    }).catch(fetchError => {
                        console.error('Error fetching or caching image:', fetchError);
                    });
                })
                imageElement.style.display = 'flex'
                imageElement.style.opacity = '1'

                imageElement.onload = function () {
                    console.log('Image has fully loaded');
                    // Set the styles to display and make the image fully opaque
                    imageElement.style.display = 'flex';
                    imageElement.style.opacity = '1';
                };

                // In case the image is already cached and `onload` doesn’t fire,
                // you might want to trigger it manually
                if (imageElement.complete) {
                    imageElement.onload();
                }
            }).catch(error => {
                // Handle errors
                //alert(error);
                if (localStorage.getItem(`type${type}`)) {
                    const data = JSON.parse(localStorage.getItem(`type${type}`))
                    const iconPfp = getRandomValue(data);
                    let number = iconPfp.match(/\d+/)[0];
                    start = start + 1;
                    document.getElementById(`op${start}`).innerText = `${type}`
                    document.getElementById(`op${start}a`).innerText = `${type}`

                    const imageElement = document.getElementById(`u${start}`);
                    imageElement.onclick = function () {
                        showStory(type)
                    }
                    //imageElement.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;
                    imageElement.src = "searching_users.gif";
                    const imageName = `image${number}.png`;
                    // Attempt to load the image from IndexedDB
                    loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
                        console.log("Image Found! Loading From IndexedDB");
                        imageElement.src = imageSrc; // Set image source to Blob URL from IndexedDB
                        imageElement.alt = type
                    }).catch(error => {
                        console.log("Image not found in IndexedDB, loading from network", error);

                        // Fallback to network URL
                        imageElement.src = `${srv}/images-database?password=${atob(localStorage.getItem("t50pswd"))}&image=${number}&method=access`;

                        // Fetch and cache the image
                        fetch(imageElement.src).then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob(); // Get the image as a Blob
                        }).then(blob => {
                            // Cache the image in IndexedDB
                            cacheImage(URL.createObjectURL(blob), `image${number}.png`);
                        }).catch(fetchError => {
                            console.error('Error fetching or caching image:', fetchError);
                        });
                    })
                    imageElement.style.display = 'flex'
                    imageElement.style.opacity = '1'

                    imageElement.onload = function () {
                        console.log('Image has fully loaded');
                        // Set the styles to display and make the image fully opaque
                        imageElement.style.display = 'flex';
                        imageElement.style.opacity = '1';
                    };

                    // In case the image is already cached and `onload` doesn’t fire,
                    // you might want to trigger it manually
                    if (imageElement.complete) {
                        imageElement.onload();
                    }
                } else {
                    alert("Tried to handle error but localStorage didn't cooperate.\nTry connecting to the internet first.\n", error)
                }
                console.error('Handling Error:', error);
            });
    });

}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('hologram.js').then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function (error) {
        console.log('Service Worker registration failed:', error);
    });
}

//if ('serviceWorker' in navigator) {
//    // First, get all service worker registrations
//    navigator.serviceWorker.getRegistrations().then(function (registrations) {
//        // Loop through each registration and unregister it
//        registrations.forEach(function (registration) {
//            registration.unregister().then(function (success) {
//                if (success) {
//                    console.log('Service Worker unregistered successfully.');
//                } else {
//                    console.log('Service Worker failed to unregister.');
//                }
//            }).catch(function (error) {
//                console.log('Service Worker unregistration failed:', error);
//            });
//        });
//    }).catch(function (error) {
//        console.log('Error getting service worker registrations:', error);
//    });
//}

function fullSc() {
    const galleryImages = document.querySelectorAll('.image img');
    const fullscreenZoom = document.getElementById('fullscreen-zoom');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const zoomedImage = document.getElementById('zoomed-image');

    function openFullscreenZoom(img, clickX, clickY) {
        // Create a clone of the clicked image
        const clonedImage = img.cloneNode();
        clonedImage.classList.add('zooming');
        document.body.appendChild(clonedImage);

        // Get bounding rectangle of the image
        const rect = img.getBoundingClientRect();
        const imgX = rect.left;
        const imgY = rect.top;
        const imgWidth = rect.width;
        const imgHeight = rect.height;

        // Calculate click position relative to the image
        const clickXRelative = clickX - imgX;
        const clickYRelative = clickY - imgY;

        // Set the initial position and size of the cloned image
        clonedImage.style.top = `${imgY}px`;
        clonedImage.style.left = `${imgX}px`;
        clonedImage.style.width = `${imgWidth}px`;
        clonedImage.style.height = `${imgHeight}px`;

        // Trigger reflow to apply the initial styles
        requestAnimationFrame(() => {
            clonedImage.style.transform = `translate(${clickXRelative}px, ${clickYRelative}px) scale(2)`;
            clonedImage.style.top = '50%'; // Move to center
            clonedImage.style.left = '50%'; // Move to center
            clonedImage.style.transform = `translate(-50%, -50%) scale(2)`; // Center and scale
        });

        // Show fullscreen container after animation
        setTimeout(() => {
            fullscreenZoom.classList.add('active');
            zoomedImage.src = img.src;
            document.body.removeChild(clonedImage); // Remove cloned image
        }, 400); // Match with animation duration
    }

    function closeFullscreenZoom() {
        fullscreenZoom.classList.add('fade-out');
        setTimeout(() => {
            fullscreenZoom.classList.remove('active', 'fade-out');
            zoomedImage.src = ''; // Clear the image source
        }, 300); // Match with transition duration
    }

    galleryImages.forEach(img => {
        img.addEventListener('click', (event) => {
            const clickX = event.clientX;
            const clickY = event.clientY;
            openFullscreenZoom(img, clickX, clickY);
        });
    });

    zoomedImage.addEventListener('click', closeFullscreenZoom);

    // Optional: Close fullscreen zoom when pressing 'Escape' key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFullscreenZoom();
        }
    });
}

function fullScs() {
    const galleryImages = document.querySelectorAll('.image img');
    const fullscreenZoom = document.getElementById('fullscreen-zoom');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const zoomedImage = document.getElementById('zoomed-image');


    galleryImages.forEach(img => {
        img.addEventListener('click', (event) => {
            // Get the image element that was clicked
            const clickedImg = event.target;

            // Obtain the source of the image
            const imgSrc = clickedImg.src;

            // Log the image source to the console
            console.log('Image source:', imgSrc);

            // Update the src of the imgFS element with the clicked image's src
            document.getElementById("imgFS").src = imgSrc;

            // Add the 'active' class to the imgF element
            document.getElementById("imgf").classList.add("active");

            // Optionally open a fullscreen zoom (assuming openFullscreenZoom function exists)
            // openFullscreenZoom(clickedImg);
        });
    });

}

let stInt;
function init(data) {
    document.getElementById("imgf").classList.add('active');

    const numberOfValues = data.length;
    data.sort((a, b) => {
        let numA = parseInt(a.match(/\d+/)[0]);
        let numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    const storyJson = {
        "image": {}
    };

    let count = 0;
    let promises = data.map(value => {
        console.log(`Working on ${value}`);
        let number = value.match(/\d+/)[0];

        return loadImageFromIndexedDB(`image${number}.png`).then(imageSrc => {
            console.log("Image Found! Loading From IndexedDB");
            count++;
            const nameJ = `img${count}`;
            storyJson.image[nameJ] = imageSrc; // Add property to 'image' object

        }).catch(error => {
            console.log("Image not found in IndexedDB, will not load from network", error);
        });
    });

    // Wait for all images to be processed
    return Promise.all(promises).then(() => {
        console.log(storyJson);
        console.log(`Vox has: ${numberOfValues} images to show\nVox has worked on ${count} images and placed them in a json format.\nNow vox will create the elements needed.`)
        const container = document.getElementById('topIndicators');
        container.innerHTML = ''
        // Loop to create and append elements
        let externalCount = 0
        for (let i = 0; i < numberOfValues; i++) {
            externalCount = externalCount + 1
            // Create a new progress container
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.setAttribute("data-c", externalCount)
            progressContainer.id = `cont${externalCount}`
            // Create a new progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar'; // or remove 'active' class as needed
            if (externalCount === 1) {
                console.log(`${externalCount} is 1`)
                progressBar.classList.add("active")
            }
            progressBar.id = `bar${externalCount}`

            // Append progress bar to progress container
            progressContainer.appendChild(progressBar);

            // Append progress container to wrapper
            container.appendChild(progressContainer);
        }
        let currentStory = 1
        let stopNow = false
        document.getElementById("imgFS").src = storyJson.image[`img${currentStory}`]
        if (numberOfValues === 1) {
            stopNow = true
        }

        stInt = setInterval(function () {

            if (stopNow === true) {
                document.getElementById("imgf").classList.remove('active');
                currentStory = 0
                clearInterval(stInt)
                stopNow = false
                return;
            }
            currentStory++
            if (currentStory !== 1) {
                document.getElementById(`cont${currentStory - 1}`).style.backgroundColor = '#ffffff'
            }
            document.getElementById("imgFS").src = storyJson.image[`img${currentStory}`]
            document.getElementById(`bar${currentStory}`).classList.add("active")
            if (currentStory + 1 > numberOfValues) {
                console.log("Next story will be empty, preparing cancel")
                stopNow = true
            }
            if (numberOfValues === 1) {
                stopNow = true
            }
        }, 5000)
        document.getElementById("favorite").addEventListener('click', (event) => {
            document.getElementById("imgf").classList.remove('active');
            currentStory = 0
            clearInterval(stInt)
            stopNow = false
            return;
        })
        document.getElementById("imgf").addEventListener('click', (event) => {
            clearInterval(stInt)
            document.getElementById(`cont${currentStory}`).style.backgroundColor = '#ffffff'
            if (stopNow === true) {
                document.getElementById("imgf").classList.remove('active');
                currentStory = 0
                clearInterval(stInt)
                stopNow = false
                return;
            }
            currentStory++
            if (currentStory !== 1) {
                document.getElementById(`cont${currentStory - 1}`).style.backgroundColor = '#ffffff'
            }
            document.getElementById("imgFS").src = storyJson.image[`img${currentStory}`]
            document.getElementById(`bar${currentStory}`).classList.add("active")
            if (currentStory + 1 > numberOfValues) {
                console.log("Next story will be empty, preparing cancel")
                stopNow = true
            }
            if (numberOfValues === 1) {
                stopNow = true
            }

            stInt = setInterval(function () {
                if (stopNow === true) {
                    document.getElementById("imgf").classList.remove('active');
                    currentStory = 0
                    clearInterval(stInt)
                    stopNow = false
                    return;
                }
                currentStory++
                if (currentStory !== 1) {
                    document.getElementById(`cont${currentStory - 1}`).style.backgroundColor = '#ffffff'
                }
                document.getElementById("imgFS").src = storyJson.image[`img${currentStory}`]
                document.getElementById(`bar${currentStory}`).classList.add("active")
                if (currentStory + 1 > numberOfValues) {
                    console.log("Next story will be empty, preparing cancel")
                    stopNow = true
                }
                if (numberOfValues === 1) {
                    stopNow = true
                }
            }, 5000)
        });
        // Perform additional actions here
        console.log("All images have been processed");
        // Example: Call another function or perform another action
        performAdditionalActions(storyJson);
    });
}
function showStory(what) {

    fetch(`${srv}/images-database?method=getByType&password=${atob(localStorage.getItem("t50pswd"))}&format=${what}&v=${Math.floor(Math.random() * 10001)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Received data");
            localStorage.setItem(`getByType${what}`, JSON.stringify(data));
            init(data)

        }).catch(error => {
            alert("Debug showStory failed. Loading from storage")
            init(JSON.parse(localStorage.getItem(`getByType${what}`)))
            console.error("Error fetching data for showStory:", error);
        });
}

function performAdditionalActions(storyJson) {
    console.log("Additional actions with storyJson:", storyJson);
    //external actions
}

async function getEverythingFromIndexedDB() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['images'], 'readonly');
        const store = transaction.objectStore('images');
        const request = store.getAll();

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject('Failed to read from IndexedDB:', event.target.errorCode);
        };
    });
}

// Example of using the function
function checkIndexedDBExists(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = () => {
            // Database exists
            resolve(true);
            // Optionally, you can close the connection here
            request.result.close();
        };

        request.onerror = () => {
            // Database does not exist or some error occurred
            if (request.error.name === 'NotFoundError') {
                resolve(false);
            } else {
                reject(request.error);
            }
        };

        request.onblocked = () => {
            // Handle the case where the request is blocked (e.g., due to an open connection)
            reject(new Error('Database request was blocked.'));
        };
    });
}

let activeId = 'discover'
function navigate(e, reload) {
    if (e.classList.contains("active") && !reload) {
        $("#setupPin").fadeOut("fast", function () {
            $("#main_settings").fadeIn("fast")
        })
        return;
    } else {
        e.classList.add("active");
        const id = e.id;

        const ids = ['discover', 'files', 'account'].filter(item => item !== id);
        ids.forEach((id) => {
            document.getElementById(id).classList.remove("active");
        });
        if (id === 'files') {//go to files
            document.getElementById("files-container").classList.add("active")
            console.log(activeId)
            if (activeId === 'discover') {
                console.log("Hiding discover")
                document.getElementById("mainContainer").style.transform = 'translateX(-120%)'
                setTimeout(function () {
                    document.getElementById("mainContainer").style.display = 'none'
                }, 700)
            }
            if (activeId === 'account') {
                document.getElementById("account-container").classList.remove("active")
            }

            document.getElementById("files-list").innerHTML = ''
            getEverythingFromIndexedDB()
                .then(data => {
                    document.getElementById("files-count").innerText = data.length
                    console.log('All images:', data);
                    data.forEach((file) => {
                        document.getElementById("files-list").innerHTML = document.getElementById("files-list").innerHTML + `<div class="fileitem">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M22 13.6477V8.976C22 7.72287 21.9342 6.64762 21.7345 5.74915C21.5323 4.83933 21.1798 4.05065 20.5646 3.43543C19.9494 2.82021 19.1607 2.46772 18.2508 2.26552C17.3524 2.06584 16.2771 2 15.024 2H8.976C7.72287 2 6.64762 2.06584 5.74915 2.26552C4.83933 2.46772 4.05065 2.82021 3.43543 3.43543C2.82021 4.05065 2.46772 4.83933 2.26552 5.74915C2.06584 6.64762 2 7.72287 2 8.976V15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C6.64762 21.9342 7.72287 22 8.976 22H15.024C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V13.6942C22.0004 13.6787 22.0004 13.6632 22 13.6477ZM4.21788 6.18305C4.066 6.86645 4 7.76851 4 8.976V11.096C4.71987 10.4038 5.39001 9.83748 6.03895 9.42453C6.82527 8.92417 7.6322 8.61574 8.50225 8.61574C9.3723 8.61574 10.1792 8.92417 10.9656 9.42453C11.7421 9.91865 12.5489 10.6324 13.435 11.5185L15.0603 13.1438C16.0436 12.3332 17.0078 11.7735 18.0456 11.6442C18.7292 11.559 19.3739 11.6673 20 11.9198V8.976C20 7.76851 19.934 6.86645 19.7821 6.18305C19.6328 5.51101 19.414 5.11327 19.1504 4.84964C18.8867 4.58602 18.489 4.36724 17.8169 4.21788C17.1336 4.066 16.2315 4 15.024 4H8.976C7.76851 4 6.86645 4.066 6.18305 4.21788C5.51101 4.36724 5.11327 4.58602 4.84964 4.84964C4.58602 5.11327 4.36724 5.51101 4.21788 6.18305Z" fill="#dcdcdc"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8Z" fill="#dcdcdc"/>
                        </svg>
                </div>
                <div class="infoCont">
                    <p>${file.name}</p>
                    <span>Type: blob</span>
                </div>
                
            </div>
                        `
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            activeId = id
        }

        if (id === 'discover') {

            document.getElementById("mainContainer").style.display = null
            setTimeout(function () {
                document.getElementById("mainContainer").style.transform = 'translateX(0)'
                if (activeId === 'files') {
                    document.getElementById("files-container").classList.remove("active")
                }
                if (activeId === 'account') {
                    document.getElementById("account-container").classList.remove("active")
                }
                activeId = id
            }, 50)

        }

        if (id === 'account') {
            document.getElementById("account-container").classList.add("active")
            console.log(activeId)
            if (activeId === 'discover') {
                console.log("Hiding discover")
                document.getElementById("mainContainer").style.transform = 'translateX(-120%)'
                setTimeout(function () {
                    document.getElementById("mainContainer").style.display = 'none'
                }, 700)
            }
            if (activeId === 'files') {
                document.getElementById("files-container").classList.remove("active")
            }

            document.getElementById("accname").innerText = localStorage.getItem("t50-username")
            document.getElementById("accemail").innerText = localStorage.getItem("t50-email")
            console.log(localStorage.getItem("HologramPin"))
            if (localStorage.getItem("HologramPin")) {
                document.getElementById("pin-status").innerText = 'Enabled'

                document.getElementById("pin-status-set").innerText = 'Enabled'
                document.getElementById("info-div").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.00001 5V8.00415C7.50208 8.01124 7.05704 8.03041 6.67222 8.08214C6.0167 8.17028 5.38835 8.36902 4.87869 8.87868C4.36902 9.38835 4.17028 10.0167 4.08215 10.6722C3.99991 11.2839 3.99995 12.0477 4 12.9342V17.0658C3.99995 17.9523 3.99991 18.7161 4.08215 19.3278C4.17028 19.9833 4.36902 20.6117 4.87869 21.1213C5.38835 21.631 6.0167 21.8297 6.67222 21.9179C7.28387 22.0001 8.0477 22.0001 8.93417 22H15.0659C15.9523 22.0001 16.7161 22.0001 17.3278 21.9179C17.9833 21.8297 18.6117 21.631 19.1213 21.1213C19.631 20.6117 19.8297 19.9833 19.9179 19.3278C20.0001 18.7161 20.0001 17.9523 20 17.0658V12.9342C20.0001 12.0477 20.0001 11.2839 19.9179 10.6722C19.8297 10.0167 19.631 9.38835 19.1213 8.87868C18.6117 8.36902 17.9833 8.17028 17.3278 8.08215C16.943 8.03041 16.4979 8.01124 16 8.00415V5C16 3.34315 14.6569 2 13 2H11C9.34316 2 8.00001 3.34315 8.00001 5ZM11 4C10.4477 4 10 4.44772 10 5V8L14 8V5C14 4.44772 13.5523 4 13 4H11ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="#dcdcdc"/>
</svg>`

            } else {
                document.getElementById("pin-status").innerText = 'Unset'
                document.getElementById("pin-status-set").innerText = 'Unset'

            }
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    if (registration) {
                        document.getElementById("sw-status").innerText = 'Registered'
                    } else {
                        document.getElementById("sw-status").innerText = 'Ready'
                    }
                }).catch(function (error) {
                    document.getElementById("sw-status").innerText = 'Unsupported'
                    console.error('Error checking Service Worker registration:', error);
                });
            } else {
                document.getElementById("sw-status").innerText = 'Unsupported'
                console.log('Service Worker is not supported in this browser.');
            }

            checkIndexedDBExists('imagesDB').then(exists => {
                if (exists) {
                    console.log('Database exists');
                    document.getElementById("indexdb-status").innerText = 'Active'
                } else {
                    document.getElementById("indexdb-status").innerText = 'Inactive'
                    console.log('Database does not exist');
                }
            }).catch(error => {
                document.getElementById("indexdb-status").innerText = '🤯'
                console.error('Error checking database existence:', error);
            });

            activeId = id


        }


    }
}

function validatePIN(input) {
    // Remove non-digit characters
    input.value = input.value.replace(/\D/g, '');

    // Ensure the value is no longer than 4 digits
    if (input.value.length > 4) {
        input.value = input.value.slice(0, 4);
    } else {
        if (input.value.length === 4) {
            document.getElementById("info-div").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.00001 5V8.00415C7.50208 8.01124 7.05704 8.03041 6.67222 8.08214C6.0167 8.17028 5.38835 8.36902 4.87869 8.87868C4.36902 9.38835 4.17028 10.0167 4.08215 10.6722C3.99991 11.2839 3.99995 12.0477 4 12.9342V17.0658C3.99995 17.9523 3.99991 18.7161 4.08215 19.3278C4.17028 19.9833 4.36902 20.6117 4.87869 21.1213C5.38835 21.631 6.0167 21.8297 6.67222 21.9179C7.28387 22.0001 8.0477 22.0001 8.93417 22H15.0659C15.9523 22.0001 16.7161 22.0001 17.3278 21.9179C17.9833 21.8297 18.6117 21.631 19.1213 21.1213C19.631 20.6117 19.8297 19.9833 19.9179 19.3278C20.0001 18.7161 20.0001 17.9523 20 17.0658V12.9342C20.0001 12.0477 20.0001 11.2839 19.9179 10.6722C19.8297 10.0167 19.631 9.38835 19.1213 8.87868C18.6117 8.36902 17.9833 8.17028 17.3278 8.08215C16.943 8.03041 16.4979 8.01124 16 8.00415V5C16 3.34315 14.6569 2 13 2H11C9.34316 2 8.00001 3.34315 8.00001 5ZM11 4C10.4477 4 10 4.44772 10 5V8L14 8V5C14 4.44772 13.5523 4 13 4H11ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="#dcdcdc"/>
</svg>`
            localStorage.setItem("HologramPin", btoa(input.value))
        } else if (input.value.length < 4) {
            document.getElementById("info-div").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 4C10.4477 4 10 4.44772 10 5V8H15.0658C15.9523 7.99995 16.7161 7.99991 17.3278 8.08215C17.9833 8.17028 18.6117 8.36902 19.1213 8.87868C19.631 9.38835 19.8297 10.0167 19.9179 10.6722C20.0001 11.2839 20.0001 12.0477 20 12.9342V17.0658C20.0001 17.9523 20.0001 18.7161 19.9179 19.3278C19.8297 19.9833 19.631 20.6117 19.1213 21.1213C18.6117 21.631 17.9833 21.8297 17.3278 21.9179C16.7161 22.0001 15.9523 22.0001 15.0658 22H8.93414C8.04767 22.0001 7.28387 22.0001 6.67222 21.9179C6.0167 21.8297 5.38835 21.631 4.87869 21.1213C4.36902 20.6117 4.17028 19.9833 4.08215 19.3278C3.99991 18.7161 3.99995 17.9523 4 17.0658V12.9342C3.99995 12.0477 3.99991 11.2839 4.08215 10.6722C4.17028 10.0167 4.36902 9.38835 4.87869 8.87868C5.38835 8.36902 6.0167 8.17028 6.67222 8.08214C7.05704 8.03041 7.50208 8.01124 8.00001 8.00415V5C8.00001 3.34315 9.34316 2 11 2H13.0625C14.6848 2 16 3.31516 16 4.9375V5C16 5.55228 15.5523 6 15 6C14.4477 6 14 5.55228 14 5V4.9375C14 4.41973 13.5803 4 13.0625 4H11ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="#dcdcdc"/>
                            </svg>`
            localStorage.removeItem("HologramPin")
        }
    }
}

function setupPin() {
    $("#main_settings").fadeOut("fast", function () {
        $("#setupPin").fadeIn("fast")
    })
}

function uploadFile() {
    document.getElementById("uploadContainer").classList.add("active")
    document.getElementById("nav-container").style.display = 'none'
}

function hideUploadFile() {
    document.getElementById("uploadContainer").classList.remove("active")
    document.getElementById("nav-container").style.display = null
}


function calculateImageSize(base64String) {
    const base64WithoutPrefix = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    const binaryData = atob(base64WithoutPrefix);
    const fileSizeInMB = binaryData.length / (1024 * 1024);
    return fileSizeInMB;
}
function pickInput() {
    document.getElementById("fileInput").click()
}
let selectedTag = null
function pickTag(el) {
    let x = 6;

    for (let i = 0; i < x; i++) {
        console.log("This is loop iteration number " + (i + 1));
        document.getElementById(`op${i}a`).classList.remove("active")
    }
    if (el.innerText === 'None') {
        selectedTag = null
    } else {
        selectedTag = el.innerText
    }
    el.classList.add('active')
    console.log("Selected:", selectedTag)
}

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagePreview = document.getElementById('imgPreview');
            imagePreview.src = e.target.result;
            document.getElementById("removeButton").style.display = 'block'
            document.getElementById("mainUp").style.display = 'none'
            imagePreview.style.display = 'block';  // Show the image
            const base64Text = reader.result.split(',')[1];
            const final = `data:image/png;base64,${base64Text}`;
            const totalSizeInMB = calculateImageSize(final);
            document.getElementById('mbdata').innerText = totalSizeInMB.toFixed(2) + 'MB'
        };

        reader.readAsDataURL(file);
    }
});

function removeFile() {
    const imagePreview = document.getElementById('imgPreview');
    document.getElementById("removeButton").style.display = 'none'
    document.getElementById("mainUp").style.display = null
    imagePreview.style.display = 'none';
    imagePreview.src = ''
    document.getElementById('fileInput').value = '';
    document.getElementById('mbdata').innerText = '0.00MB'

}

function upload() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (!file) {
        alert("Please select a file!");
        return;
    }
    document.getElementById("uploadFileButton").innerText = 'Uploading..'
    document.getElementById("preProgress").style.display = null
    document.getElementById("progress-text").style.display = null


    const reader = new FileReader();
    reader.onload = () => {
        const base64Text = reader.result.split(',')[1];
        const final = `data:image/png;base64,${base64Text}`;
        const password = atob(localStorage.getItem('t50pswd'));
        const totalSizeInMB = calculateImageSize(final);

        const postData = {
            image: final,
            password: password,
            method: "upload"
        };

        // Initialize the progress bar
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        // Create a new XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // Track the upload progress
        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                const uploadedMB = (event.loaded / (1024 * 1024)).toFixed(2); // Convert bytes to MB
                const progressPercent = (event.loaded / event.total) * 100;
                progressBar.style.width = progressPercent + '%';
                progressText.textContent = `${uploadedMB} MB of ${totalSizeInMB.toFixed(2)} MB uploaded`;
            }
        });

        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // Request is complete
                if (xhr.status === 200) { // Success
                    if (xhr.responseText.includes('Complete')) {

                        if (selectedTag) {
                            document.getElementById("uploadFileButton").innerText = 'Tagging..'
                            console.log()
                            const fileName = xhr.responseText.split(", ")[1];
                            console.log('fileName:', fileName)
                            fetch(`${srv}/images-database?method=setType&image=${fileName.toLowerCase()}&format=${selectedTag.toLowerCase()}&password=${password}`)
                                .then(response => response.text())
                                .then(data => {
                                    if (data === 'work') {
                                        pickTag(document.getElementById("op0a"))
                                        progressBar.style.width = 0 + '%';
                                        removeFile()
                                        progressText.textContent = `0 MB of 0 MB uploaded`;
                                        document.getElementById("preProgress").style.display = 'none'
                                        document.getElementById("progress-text").style.display = 'none'
                                        document.getElementById("uploadFileButton").innerText = 'Upload'
                                    } else {
                                        alert(`DB Error ${data}`)
                                    }
                                })
                                .catch(error => {
                                    alert("An otp error occured!", error)
                                    console.error(error);
                                });

                        } else {
                            progressBar.style.width = 0 + '%';
                            removeFile()
                            progressText.textContent = `0 MB of 0 MB uploaded`;
                            document.getElementById("preProgress").style.display = 'none'
                            document.getElementById("progress-text").style.display = 'none'
                            document.getElementById("uploadFileButton").innerText = 'Upload'
                        }
                    } else {
                        alert(`Upload complete with unknown response. Server responded with: ${xhr.responseText}`);
                    }
                } else {
                    alert(`Upload failed. Server responded with status: ${xhr.status}`);
                }
            }
        };

        // Open the connection
        xhr.open('POST', 'https://data.evoxs.xyz/images-database', true);

        // Set the request header to accept JSON
        xhr.setRequestHeader('Content-Type', 'application/json');

        // Send the request with the JSON payload
        xhr.send(JSON.stringify(postData));
    };

    reader.readAsDataURL(file);
}
function manualUpdate() {
    // Check if the service worker is registered
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (registration.active) {
                // Send a message to the active service worker
                registration.active.postMessage({ action: 'UPDATE_CACHE' });

                // Listen for messages from the service worker
                navigator.serviceWorker.addEventListener('message', event => {
                    if (event.data && event.data.status === 'CACHE_UPDATED') {
                        alert('Cache update was successful!');
                    } else {
                        alert(`App data update failed. ${event.data.status}\n${event.data}`)
                    }
                });
            } else {
                console.error('No active service worker found.');
                alert('No active service worker found.');
            }
        }).catch(error => {
            console.error('Error accessing service worker:', error);
            alert(`Error accessing service worker: ${error}`);
        });
    } else {
        console.error('Service workers are not supported in this browser.');
        alert('Service workers are not supported in this browser.');
    }
}

function checkForUpdates() {
    fetch('hologram.version')
        .then(response => response.json())
        .then(data => {
            if (data && data.current) {
                if (Number(data.current) > version) {
                    //alert("An update is available")
                    manualUpdate()
                }
            }
        })
        .catch(error => {
            alert(`Update check failed:\n${error}`)
            console.error(error);
        });
}

document.getElementById("versionCur").innerText = version

function changeLikeState(imageKey, vo) {
    fetch(`${srv}/images-database?method=like-unlike&image=${imageKey}&password=${atob(localStorage.getItem("t50pswd"))}&v=${Math.floor(Math.random() * 10001)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'plain/text',
        }
    })
        .then(response => response.text())
        .then(data => {
            if (data === "Liked") {
                vo.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#fff"/>
</svg>`
            } else if (data === "Unliked") {
                vo.innerHTML = `<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
            } else {
                alert(`Error liking. Server Response: ${data}`)
            }
        }).catch(error => {
            console.error("Error fetching data for showStory:", error);
        });
}
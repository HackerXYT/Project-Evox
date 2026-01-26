const DB_NAME = 'JeanneDarc';
const STORE_NAME = 'EvoxImages';
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveImage(id, imageData) {
    const existing = await getImage(id, true); // Separate transaction for reading, with DONTMAKENEWAJAX=true to prevent update loop

    if (existing && existing.imageData === imageData) {
        //console.log('Image already exists and is the same, skipping update.');
        return;
    }

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite'); // New transaction
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.put({ id, imageData });

        request.onsuccess = () => {
            //console.log('Image saved/updated successfully.');
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}


async function getImage(id, DONTMAKENEWAJAX) {
    if (id === undefined || id === null) {
        console.warn('No ID specified, fetching new image data directly.');
        if (!DONTMAKENEWAJAX) {
            try {
                const profileSrc = await getEvoxProfile(id);
                fetchAndSaveImage(id, profileSrc);
                return { imageData: profileSrc };
            } catch (err) {
                console.error('Error fetching profile for undefined ID:', err);
                return null;
            }
        }
        return null;
    }

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => {
            const result = request.result;
            resolve(result);

            if (!DONTMAKENEWAJAX) {
                fetch(`https://arc.evoxs.xyz/?metode=hasChanged&emri=${encodeURIComponent(id)}`)
                    .then(response => response.json())
                    .then(part => {
                        if (result && part.part && result.imageData.includes(part.part)) {
                            // image is current
                        } else {
                            console.warn('Updating image for ID:', id);
                            getEvoxProfile(id).then(profileSrc => {
                                fetchAndSaveImage(id, profileSrc);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Could not check for image update:', error);
                    });
            }
        };

        request.onerror = () => {
            console.error('Error fetching image for ID:', id, request.error);
            if (!DONTMAKENEWAJAX) {
                getEvoxProfile(id)
                    .then(profileSrc => {
                        resolve({ imageData: profileSrc });
                        fetchAndSaveImage(id, profileSrc);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                resolve(null);
            }
        };
    });
}



async function clearDatabase() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    await tx.complete;
    console.log('Database cleared successfully.');
}

async function fetchAndSaveImage(id, imageUrl) {
    try {
        const response = await fetch(imageUrl);
        //console.log("Fetch Image",response)
        if (!response.ok) {
            return;
        }
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            saveImage(id, reader.result); // Store as base64
        };
    } catch (error) {
        console.error('Error saving image:', error);
    }
}

function saveCookie(name, value) {
    const expires = new Date(Date.now() + 21 * 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    setTimeout(function () {
        document.getElementById("icon-checkmark").style.display = null
        document.getElementById("icon-error").style.display = "none"
        document.getElementById("icon-spinner").style.display = "none";
        document.getElementById("notice-text").innerText = `Τα cookies ενημερώθηκαν`
        document.getElementById("notice-main").classList.add("active")
        setTimeout(function () {

            document.getElementById("notice-main").classList.remove("active")
        }, 2500)
    }, 200)
    document.getElementById("notice-main").classList.remove("active")
}

function removeCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function clearAllCookies() {
    document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        removeCookie(name);
    });

    setTimeout(function () {
        document.getElementById("icon-checkmark").style.display = null
        document.getElementById("icon-error").style.display = "none"
        document.getElementById("icon-spinner").style.display = "none";
        document.getElementById("notice-text").innerText = `Τα Cookies διαγράφηκαν`
        document.getElementById("notice-main").classList.add("active")
        setTimeout(function () {

            document.getElementById("notice-main").classList.remove("active")
        }, 2500)
    }, 200)
    document.getElementById("notice-main").classList.remove("active")

}

function getCookie(name) {
    const decoded = decodeURIComponent(document.cookie);
    const cookies = decoded.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}
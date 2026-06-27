let isDoorOpen = null;
let storage = {};

function updateDoorUI(isOpen) {
    isDoorOpen = isOpen;
    const panelLeft = document.getElementById('gatePanelLeft');
    const panelRight = document.getElementById('gatePanelRight');
    const arm = document.getElementById('actuatorArm');
    const label = document.getElementById('doorStatusLabel');
    const sub = document.getElementById('doorStatusSub');
    const icon = document.getElementById('doorIcon');
    const btnText = document.getElementById('triggerBtnText');
    const btnSub = document.getElementById('triggerBtnSub');

    sub.classList.remove('error');
    sub.style.visibility = 'hidden';

    if (isOpen) {
        panelLeft.classList.add('open');
        panelRight.classList.add('open');
        arm.classList.add('open');
        label.textContent = 'ΑΝΟΙΧΤΗ';
        label.classList.add('open');
        icon.style.background = 'var(--primary-orange)';
        btnText.textContent = 'Κλείσιμο Πόρτας';
        btnSub.textContent = 'Η πόρτα είναι ανοιχτή';
    } else {
        panelLeft.classList.remove('open');
        panelRight.classList.remove('open');
        arm.classList.remove('open');
        label.textContent = 'ΚΛΕΙΣΤΗ';
        label.classList.remove('open');
        icon.style.background = '#666';
        btnText.textContent = 'Άνοιγμα Πόρτας';
        btnSub.textContent = 'Η πόρτα είναι κλειστή';
    }
}

function getStatus() {
    fetch(`https://data.evoxs.xyz/house?email=${storage.email}&password=${atob(storage.pswd)}&username=${storage.username}&method=door-login-status`)
        .then(r => {
            if (!r.ok) throw new Error('Network error');
            return r.json();
        })
        .then(data => {
            updateDoorUI(data.isOpen);
        })
        .catch(err => {
            console.error('Status fetch error:', err);
            const sub = document.getElementById('doorStatusSub');
            sub.textContent = 'Αδυναμία σύνδεσης';
            sub.classList.add('error');
            sub.style.visibility = 'visible';
        });
}

function triggerDoor() {
    const card = document.getElementById('triggerCard');
    const spinner = document.getElementById('spinner');
    spinner.style.opacity = '1';
    card.style.pointerEvents = 'none';

    fetch(`https://data.evoxs.xyz/house?email=${storage.email}&password=${atob(storage.pswd)}&username=${storage.username}&method=door-login-trigger`)
        .then(r => {
            if (!r.ok) throw new Error('Network error');
            return r.json();
        })
        .then(() => {
            spinner.style.opacity = '0';
            card.style.pointerEvents = 'auto';
            if (isDoorOpen !== null) {
                updateDoorUI(!isDoorOpen);
            }
        })
        .catch(err => {
            console.error('Trigger error:', err);
            spinner.style.opacity = '0';
            card.style.pointerEvents = 'auto';
        });
}

function goEpsilon() {
    window.open("../evox-epsilon-beta", "_blank");
}

document.addEventListener('DOMContentLoaded', () => {
    const lc = {
        username: localStorage.getItem("t50-username"),
        email: localStorage.getItem("t50-email"),
        pswd: localStorage.getItem("t50pswd")
    };
    storage = lc;

    if (lc.username && lc.email && lc.pswd) {
        fetch(`https://data.evoxs.xyz/house?email=${lc.email}&password=${atob(lc.pswd)}&username=${lc.username}&method=door-login-check`)
            .then(r => {
                if (!r.ok) throw new Error('Network error');
                return r.json();
            })
            .then(data => {
                if (data.status === 'ok') {
                    document.getElementById('loadIt').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('loadIt').style.display = 'none';
                    }, 550);
                    getStatus();
                    setInterval(getStatus, 3000);
                } else {
                    document.getElementById('loaderAnim').style.display = 'none';
                    document.getElementById('goEpsilon').style.display = 'flex';
                    document.getElementById('reloadApp').style.display = 'flex';
                    document.getElementById('connectText').innerHTML = `Πρόσβαση Απορρίφθηκε<br>Λανθασμένα στοιχεία ή δεν έχετε πρόσβαση σε αυτή την εφαρμογή.`;
                }
            })
            .catch(err => {
                console.error(err);
                document.getElementById('loaderAnim').style.display = 'none';
                document.getElementById('reloadApp').style.display = 'flex';
                document.getElementById('connectText').innerHTML = 'Αποτυχία σύνδεσης. Παρακαλώ δοκιμάστε ξανά.';
            });
    } else {
        document.getElementById('loaderAnim').style.display = 'none';
        document.getElementById('reloadApp').style.display = 'flex';
        document.getElementById('goEpsilon').style.display = 'flex';
        document.getElementById('connectText').innerHTML = `Δεν είστε συνδεδεμένοι.<br>Παρακαλώ συνδεθείτε μέσω Evox Epsilon για να αποκτήσετε πρόσβαση.`;
    }
});

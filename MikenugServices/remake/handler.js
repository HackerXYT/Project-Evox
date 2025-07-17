
let selectedLeague = "Athens Cup Youth A' 2025"
let persistance = null
function boot() {
    fetch('https://mikenug-server-new.onrender.com/getLeague')
        .then(response => response.json())
        .then(data => {
            persistance = data
            const workingLeague = data[selectedLeague]
            document.getElementById("teamsContainer").innerHTML = ''
            const progressBar = document.querySelector('.circular-progress');
            const total = Object.keys(workingLeague).length;
            let current = 0;
            Object.entries(workingLeague).forEach(([key, teamInf]) => {
                console.log("Team:", key)
                if (key === 'winner') return;
                const name = teamInf.name
                const cleanImage = teamInf.image.replace(/^"(.*)"$/, '$1');
                document.getElementById("teamsContainer").innerHTML += `
                <div onclick="openTeam(this, '${key}')" class="item">
                        <div class="teamIcon">
                            <img src="${cleanImage}">
                        </div>
                        <div class="collTeamInf">
                            <p>${name}</p>
                            <span>${teamInf.wins} ${teamInf.wins === "1" ? "Win" : "Wins"}</span>
                        </div>
                    </div>`
                current++;
                const percent = Math.round(((current + 1) / total) * 100);
                setCircularProgress(progressBar, percent);
            })
            document.getElementById("status").innerHTML = 'Connected'
        }).catch(error => {
            console.error("Database is offline.", error)
            document.getElementById("status").innerHTML = 'Failed'
            startInterval()
        });
}
document.addEventListener("DOMContentLoaded", boot)

function openTeam(el, jsonId) {
    const teamName = el.querySelector(".collTeamInf").querySelector("p").innerText
    const teamImage = el.querySelector(".teamIcon").querySelector("img").src
    const workingLeague = persistance[selectedLeague][jsonId]
    document.getElementById("rank").innerHTML = workingLeague.rank
    document.getElementById("wins").innerHTML = workingLeague.wins
    document.getElementById("draws").innerHTML = workingLeague.draws
    document.getElementById("losses").innerHTML = workingLeague.looses
    document.getElementById("goals").innerHTML = workingLeague.goalsScored
    document.getElementById("goalsAgainst").innerHTML = workingLeague.goalsAgainst
    document.getElementById("goalsDiff").innerHTML = workingLeague.goalDifference
    document.getElementById("Home").classList.remove("activated")
    document.getElementById("teamInfo").classList.add("activated")
    document.getElementById("teamName").innerText = teamName
    document.getElementById("teamIconIn").src = teamImage
}

function goBackToHome() {
    document.getElementById("teamInfo").classList.remove("activated")
    document.getElementById("Home").classList.add("activated")
}

function setCircularProgress(el, percent) {
    setTimeout(function () {
        el.style.setProperty('--progress', percent);
        el.querySelector('.label').textContent = `${percent}%`;
    }, 1000) //Smoothness

}

function startInterval() {
    const connection = setInterval(function () {
        fetch('https://mikenug-server-new.onrender.com/')
            .then(response => response.text())
            .then(data => {
                clearInterval(connection)
                boot()
            })
    }, 500)
}
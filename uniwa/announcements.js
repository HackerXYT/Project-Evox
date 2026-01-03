let announcementsByCourse = null
let announcementsSorted = null
let coursesDictionary = null
async function getAnnouncements() {
    const token = await getToken();
    if (!token) {
        console.warn("Not logged in.");
        return null;
    }

    const data = await reach(
        "/getAllAnnouncements",
        true,
        null,
        "POST",
        null,
        {
            Authorization: `Bearer ${token}`,
        }
    );
    announcementsByCourse = data

    const sortedAnnouncements = data
        .flatMap(courseData =>
            courseData.announcements.map(ann => ({
                course: courseData.course,
                subject: ann.subject,
                message: ann.message,
                date: ann.created
            }))
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    announcementsSorted = sortedAnnouncements
    return sortedAnnouncements;
}

let allowSpawn = 10
function spawnMore() {
    allowSpawn = allowSpawn + 10
    spawnAnnouncements()
}
function spawnAnnouncements() {
    const announcementsContainer = document.getElementById("announcementsContainer");
    announcementsContainer.innerHTML = '';

    const MAX_ANNOUNCEMENTS = allowSpawn;

    announcementsSorted.forEach((announcement, i) => {
        if (i >= MAX_ANNOUNCEMENTS) return; // stop rendering

        const dictionaryItem = coursesDictionary.find(c => c.full === announcement.course);
        console.log(dictionaryItem)
        const shortName = dictionaryItem.short;
        const emoji = dictionaryItem.emoji;

        const announcement_div = document.createElement("div");
        announcement_div.className = "announcement";

        const emojiDiv = document.createElement("div");
        emojiDiv.className = "emoji";
        emojiDiv.textContent = emoji;

        const colDiv = document.createElement("div");
        colDiv.className = "col";

        const courseNameDiv = document.createElement("div");
        courseNameDiv.className = "courseName";
        courseNameDiv.innerHTML = `${shortName}<span class="farRight">${timeAgoInGreek(announcement.date)}</span>`;

        const annTextDiv = document.createElement("div");
        annTextDiv.className = "ann_text";
        annTextDiv.innerHTML = cleanHtml(announcement.message);

        colDiv.appendChild(courseNameDiv);
        colDiv.appendChild(annTextDiv);
        announcement_div.appendChild(emojiDiv);
        announcement_div.appendChild(colDiv);

        announcementsContainer.appendChild(announcement_div);
    });

    if (allowSpawn < announcementsSorted.length) {
        const loadmoreDiv = document.createElement("div");
        loadmoreDiv.className = 'loadMore';

        const button = document.createElement("div");
        button.className = "button";
        button.textContent = "Φόρτωση περισσότερων";

        button.addEventListener("click", () => {
            spawnMore()
        });

        loadmoreDiv.appendChild(button);
        announcementsContainer.appendChild(loadmoreDiv); // outside last announcement
    }
}


async function getCourses() {
    const token = await getToken();
    if (!token) {
        console.warn("Not logged in.");
        return;
    }
    reach("/getCourses", true, null, "POST", null, {
        Authorization: `Bearer ${token}`,
    }).then((data) => {
        console.log(data);
        coursesDictionary = data
        spawnAnnouncements()
        const coursesContainer = document.getElementById("coursesContainer")
        coursesContainer.innerHTML = ""
        data.forEach((course) => {
            const card = document.createElement("div");
            card.className = `card`;

            const emoji = Array.from(course.emoji)[0];
            card.style.backgroundColor = emojiDominantColor(emoji) + "c2";

            const iconWrapper = document.createElement("div");
            iconWrapper.className = "icon-wrapper";
            iconWrapper.textContent = course.emoji;

            const content = document.createElement("div");
            content.className = "card-content";

            const titleEl = document.createElement("span");
            titleEl.className = "title";
            titleEl.textContent = course.short;

            const subtitleEl = document.createElement("span");
            subtitleEl.className = "subtitle";
            const courseObj = announcementsByCourse.find(c => c.course === course.full);
            const courseAnnouncements = courseObj.announcements.length
            subtitleEl.innerHTML = courseAnnouncements > 0 ? `${courseAnnouncements} ${courseAnnouncements === 1 ? "Ανακοίνωση" : "Ανακοινώσεις"}` : "&nbsp;"

            content.appendChild(titleEl);
            content.appendChild(subtitleEl);

            card.appendChild(iconWrapper);
            card.appendChild(content);

            coursesContainer.appendChild(card);

            card.addEventListener("click", () => {
                openCourse(course)
            });
        });

    });
}
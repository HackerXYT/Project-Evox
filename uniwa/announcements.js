let announcementsByCourse = null
let announcementsSorted = null
let coursesDictionary = null
let activeCourse = null
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

        const aiInfo = document.createElement("div");
        aiInfo.className = "fullRow";
        aiInfo.innerHTML = `<div class="farRight"><div class="backButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
<path d="M5 16V20M6 4V8M7 18H3M8 6H4M13 4L14.7528 8.44437C14.9407 8.92083 15.0347 9.15906 15.1786 9.35994C15.3061 9.538 15.462 9.69391 15.6401 9.82143C15.8409 9.9653 16.0792 10.0593 16.5556 10.2472L21 12L16.5556 13.7528C16.0792 13.9407 15.8409 14.0347 15.6401 14.1786C15.462 14.3061 15.3061 14.462 15.1786 14.6401C15.0347 14.8409 14.9407 15.0792 14.7528 15.5556L13 20L11.2472 15.5556C11.0593 15.0792 10.9653 14.8409 10.8214 14.6401C10.6939 14.462 10.538 14.3061 10.3599 14.1786C10.1591 14.0347 9.92083 13.9407 9.44437 13.7528L5 12L9.44437 10.2472C9.92083 10.0593 10.1591 9.9653 10.3599 9.82143C10.538 9.69391 10.6939 9.538 10.8214 9.35994C10.9653 9.15906 11.0593 8.92083 11.2472 8.44437L13 4Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </div></div>`

        colDiv.appendChild(courseNameDiv);
        colDiv.appendChild(annTextDiv);
        colDiv.appendChild(aiInfo);
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

document.getElementById("search-course").addEventListener("input", (event) => {
    const value = event.target.value
    const container = document.getElementById("spawnCategoriesAndCourseInfo")
    if (value !== "") {
        spawnOnCourseElements(searchCourses(value), container)
    } else {
        spawnOnCourseElements(activeCourse, container)
    }
});

function spawnCoursesElements(data) {
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
        spawnCoursesElements(data)


    });
}
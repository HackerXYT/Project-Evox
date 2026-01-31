const projects = [
    // --- ACTIVE ---
    {
        name: "Epsilon Nexus",
        description: "Manage Evox apps, friends, and chats securely. Optimized for speed and enhanced security.",
        image: "./evox-epsilon-beta/epsilon-assets/apple-splash-dark-2360-1640.png",
        url: "./evox-epsilon-beta/",
        status: "active",
        badge: "BETA"
    },
    {
        name: "Jeanne D'Arc",
        description: "School Management PWA. Connect with classmates and discover yearbook insights.",
        image: "./jeanne/splashScreens/apple-splash-2160-1620.png",
        url: "./jeanne/",
        status: "active",
        badge: "STABLE"
    },
    {
        name: "OASA Mobile",
        description: "Reimagined transit app. Access timetables offline and receive real-time notifications.",
        image: "./oasaMobile/spoiler.png",
        url: "./oasaMobile/",
        status: "active",
        badge: "STABLE"
    },
    {
        name: "Evox Gateway",
        description: "An all-in-one solution for organization and secure communication (T50 Gateway).",
        image: "./t50-gateway-alpha/t50gatewayalpha.png",
        url: "./t50-gateway-alpha/",
        status: "active",
        badge: "STABLE"
    },

    // --- ONGOING ---
    {
        name: "Jeanne Beta",
        description: "Refined design and smoother UX. Warning: Early access may cause instability.",
        image: "./jeanneBeta/splashScreens/apple-splash-2160-1620.png",
        url: "./jeanneBeta/",
        status: "ongoing",
        badge: "BETA - ONGOING",
        year: "2025",
        warning: "Limited Access"
    },
    {
        name: "EduVox",
        description: "Access courses via Moodle API. Fast, simple, and privacy-focused university portal.",
        image: "./uniwa/index-splash.png",
        url: "./uniwa/",
        status: "ongoing",
        badge: "ALPHA - ONGOING",
        year: "2026"
    },

    // --- ABANDONED (Legacy) ---
    {
        name: "T50",
        description: "One of Evox's earliest projects. Originally named Evox App, it eventually evolved into the T50 Gateway.",
        image: "t50-app-thumbnail.png",
        url: "#",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2021"
    },
    {
        name: "ChatVia",
        description: "The first Evox project. A real-time chat app via Socket.io, succeeded by SecureLine®.",
        image: "chatvia-thumbnail.png",
        url: "#",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2020"
    },
    {
        name: "TwentyoneCore",
        description: "Predating Evox, designed for file/database management. Requires domain switch to access.",
        image: "twentyonecore-thumbnail.png",
        url: "https://twentyonecore.com", // Example external domain
        status: "abandoned",
        badge: "ABANDONED",
        year: "2020",
        external: true
    },
    {
        name: "HackerX Site",
        description: "Tutorials and community content for 'H A C K E R X' YouTube channel. Requires domain switch.",
        image: "hackerxsite-thumbnail.png",
        url: "https://hackerx.site", // Example external domain
        status: "abandoned",
        badge: "ABANDONED",
        year: "2019",
        external: true
    }
];

// Function to render cards
// Function to render cards
function renderProjects(filter = 'stable') { // Default to stable
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = ''; 

    const filtered = projects.filter(p => {
        if (filter === 'all') return true;
        
        // 1. Filter by specific Project Status
        if (filter === 'ongoing' || filter === 'abandoned') {
            return p.status === filter;
        }

        // 2. Filter by Release Type (Stable or Beta)
        // This looks at the "badge" property in your config
        const badgeText = p.badge.toLowerCase();
        if (filter === 'stable') {
            return badgeText.includes('stable') && p.status !== 'abandoned';
        }
        if (filter === 'beta') {
            return badgeText.includes('beta') && p.status !== 'abandoned';
        }

        return false;
    });

    filtered.forEach(proj => {
        const card = document.createElement('article');
        card.className = `card ${proj.status}`;
        
        const btnText = proj.external ? "Switch Domain" : "Launch";
        const targetAttr = proj.external ? 'target="_blank"' : '';

        card.innerHTML = `
            <div class="card-visual">
                <img src="${proj.image}" class="app-icon" onerror="this.src='https://via.placeholder.com/300x180/1c1c1e/333?text=Archive'">
            </div>
            <div class="card-content">
                <div class="meta-row">
                    <span class="badge ${proj.status}">${proj.badge}</span>
                    ${proj.warning ? `<span class="warning-tag">${proj.warning}</span>` : ''}
                </div>
                <h2>${proj.name}</h2>
                <p>${proj.description}</p>
            </div>
            <div class="card-footer">
                <a href="${proj.url}" ${targetAttr} class="btn-launch">
                    ${btnText}
                </a>
                <span class="year-label">${proj.year || ''}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initial render: show STABLE apps on startup
document.addEventListener('DOMContentLoaded', () => {
    renderProjects('stable');
});

// Filter Function
function filterProjects(filterType, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(filterType);
}
// Global variable to track current filter state for language switching
let currentActiveFilter = 'latest';

const projects = [
    // --- ACTIVE ---
    {
        name: "Epsilon Nexus",
        description: "Manage Evox apps, friends, and chats securely with the new Evox Epsilon Nexus. Enjoy a modern, optimized interface designed for speed and enhanced security, delivering the best user experience yet.",
        image: "./evox-epsilon-beta/epsilon-assets/apple-splash-dark-2360-1640.png",
        url: "./evox-epsilon-beta/",
        status: "active",
        badge: "BETA",
        sorting: "latest",
        translations: {
            el: {
                description: "Διαχειριστείτε τις εφαρμογές Evox, τους φίλους και τις συνομιλίες με ασφάλεια με το νέο Evox Epsilon Nexus. Απολαύστε μια σύγχρονη, βελτιστοποιημένη διεπαφή σχεδιασμένη για ταχύτητα και ενισχυμένη ασφάλεια.",
                badge: "BETA"
            }
        }
    },
    {
        name: "Jeanne D'Arc",
        description: "School Management App [PWA] Connect with friends and classmates, share your thoughts, and discover what they think of you with Jeanne D'Arc's yearbook app.",
        image: "./jeanne/splashScreens/apple-splash-2160-1620.png",
        url: "./jeanne/",
        status: "stable",
        badge: "STABLE",
        translations: {
            el: {
                description: "Εφαρμογή Διαχείρισης Σχολείου [PWA]. Συνδεθείτε με φίλους και συμμαθητές, μοιραστείτε τις σκέψεις σας και ανακαλύψτε τι σκέφτονται για εσάς με την εφαρμογή επετηρίδας Jeanne D'Arc.",
                badge: "ΣΤΑΘΕΡΟ"
            }
        }
    },
    {
        name: "OASA Mobile",
        description: "A refreshed version of the original Evox OASA Mobile app, now featuring interactive maps, location-based information, real-time bus tracking, and an enhanced Evox Florida notifications system.",
        image: "./oasaMobile/spoiler.png",
        url: "./oasaMobile/",
        status: "stable",
        badge: "STABLE",
        translations: {
            el: {
                description: "Μια ανανεωμένη έκδοση της αρχικής εφαρμογής Evox OASA Mobile, που πλέον διαθέτει διαδραστικούς χάρτες, πληροφορίες τοποθεσίας, παρακολούθηση λεωφορείων σε πραγματικό χρόνο και ενισχυμένο σύστημα ειδοποιήσεων.",
                badge: "ΣΤΑΘΕΡΟ"
            }
        }
    },
    {
        name: "OASA",
        description: "A refreshed version of the original Evox OASA Mobile app, now featuring interactive maps, location-based information, real-time bus tracking, and an enhanced Evox Florida notifications system.",
        image: "./oasaResign/splashScreens/apple-splash-2208-1242.png",
        url: "./oasaResign/",
        badge: "BETA",
        sorting: "latest",
        translations: {
            el: {
                description: "Μια ανανεωμένη έκδοση της αρχικής εφαρμογής Evox OASA Mobile, που πλέον διαθέτει διαδραστικούς χάρτες, πληροφορίες τοποθεσίας, παρακολούθηση λεωφορείων σε πραγματικό χρόνο και ενισχυμένο σύστημα ειδοποιήσεων.",
                badge: "BETA"
            }
        }
    },
    {
        name: "Evox Gateway",
        description: "Also known as T50 gateway, Evox gateway is an all-in-one solution for streamlined organization and secure communication",
        image: "./t50-gateway-alpha/t50gatewayalpha.png",
        url: "./t50-gateway-alpha/",
        status: "stable",
        badge: "STABLE",
        translations: {
            el: {
                description: "Γνωστό και ως T50 gateway, το Evox gateway είναι μια λύση 'όλα-σε-ένα' για βελτιωμένη οργάνωση και ασφαλή επικοινωνία.",
                badge: "ΣΤΑΘΕΡΟ"
            }
        }
    },
    {
        name: "Epsilon",
        description: "A new way of interacting with the Evox community, featuring enhanced connectivity and newly added features for a richer user experience.",
        image: "./evox-epsilon/nexusBeta.png",
        url: "./evox-epsilon/",
        status: "active",
        badge: "BETA",
        sorting: "latest",
        translations: {
            el: {
                description: "Ένας νέος τρόπος αλληλεπίδρασης με την κοινότητα Evox, με βελτιωμένη συνδεσιμότητα και πρόσφατα προστιθέμενες λειτουργίες για μια πλουσιότερη εμπειρία χρήστη.",
                badge: "BETA"
            }
        }
    },

    // --- ONGOING ---
    {
        name: "Jeanne d'Arc",
        description: "The Jeanne D'Arc app, now with a refined design, enhanced features, and a focus on delivering the smoothest user experience yet.",
        image: "./jeanneBeta/splashScreens/apple-splash-2160-1620.png",
        url: "./jeanneBeta/",
        status: "active",
        badge: "BETA",
        year: "2025",
        warning: "Limited Access",
        sorting: "latest",
        translations: {
            el: {
                description: "Η εφαρμογή Jeanne D'Arc, τώρα με εκλεπτυσμένο σχεδιασμό, βελτιωμένα χαρακτηριστικά και έμφαση στην παροχή της πιο ομαλής εμπειρίας χρήστη μέχρι σήμερα.",
                badge: "BETA",
                warning: "Περιορισμένη Πρόσβαση"
            }
        }
    },

    {
        name: "AIT",
        description: "Chat smarter with Evox AIT — your personal AI assistant. Start and manage conversations seamlessly in a sleek, fast, and secure environment built for clarity and control.",
        image: "./AIT/splash/apple-splash-2208-1242.png",
        url: "./AIT/",
        status: "ALPHA",
        badge: "ALPHA",
        year: "2025",
        warning: "Account instability",
        sorting: "latest",
        translations: {
            el: {
                description: "Συνομιλήστε εξυπνότερα με το Evox AIT — τον προσωπικό σας βοηθό AI. Ξεκινήστε και διαχειριστείτε συνομιλίες απρόσκοπτα σε ένα κομψό, γρήγορο και ασφαλές περιβάλλον.",
                badge: "ALPHA",
                warning: "Αστάθεια Λογαριασμού"
            }
        }
    },
    {
        name: "EduVox",
        description: "Το EduVox προσφέρει άμεση πρόσβαση σε μαθήματα, ανακοινώσεις και εργασίες σε ένα γρήγορο και απλό περιβάλλον. Η σύνδεση γίνεται μέσω το API της πλατφόρμας Moodle του πανεπιστημίου σας. Η επεξεργασία των δεδομένων σας πραγματοποιείται αυτόματα από το Evox, χωρίς να αποθηκεύονται προσωπικά δεδομένα στους διακομιστές μας.",
        image: "./uniwa/index-splash.png",
        url: "./uniwa/",
        status: "ALPHA",
        badge: "ALPHA",
        year: "2026",
        sorting: "latest",
        translations: {
            en: {
                description: "EduVox offers direct access to courses, announcements, and assignments in a fast and simple environment. Connection is made via your university's Moodle API. Data processing is handled automatically by Evox without storing personal data on our servers."
            },
            el: {
                description: "Το EduVox προσφέρει άμεση πρόσβαση σε μαθήματα, ανακοινώσεις και εργασίες σε ένα γρήγορο και απλό περιβάλλον. Η σύνδεση γίνεται μέσω το API της πλατφόρμας Moodle του πανεπιστημίου σας. Η επεξεργασία των δεδομένων σας πραγματοποιείται αυτόματα από το Evox, χωρίς να αποθηκεύονται προσωπικά δεδομένα στους διακομιστές μας.",
                badge: "ALPHA"
            }
        }
    },

    // --- ABANDONED (Legacy) ---
    {
        name: "T50",
        description: "The T50 App was one of Evox's earliest projects. Originally named Evox App, it was later rebranded as T50 App and eventually became T50 Gateway, which continues to operate today.",
        image: "t50-app-thumbnail.png",
        url: "./evox-app/",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2021",
        translations: {
            el: {
                description: "Η εφαρμογή T50 ήταν ένα από τα πρώτα έργα της Evox. Αρχικά ονομάστηκε Evox App, αργότερα μετονομάστηκε σε T50 App και τελικά έγινε T50 Gateway.",
                badge: "ΕΓΚΑΤΑΛΕΙΦΘΗΚΕ"
            }
        }
    },
    {
        name: "ChatVia",
        description: "ChatVia, the first Evox© project, was a simple real-time chat application powered by Socket.io. It was later succeeded by SecureLine®, which introduced more secure communication methods within the Evox© ecosystem. Today, SecureLine® is integrated into the Evox Epsilon Nexus, enhancing safe data exchange.",
        image: "chatvia-thumbnail.png",
        url: "./evox-app/ChatVia/",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2020",
        translations: {
            el: {
                description: "Το ChatVia, το πρώτο έργο της Evox©, ήταν μια απλή εφαρμογή συνομιλίας σε πραγματικό χρόνο. Σήμερα, η τεχνολογία του έχει ενσωματωθεί στο Evox Epsilon Nexus.",
                badge: "ΕΓΚΑΤΑΛΕΙΦΘΗΚΕ"
            }
        }
    },
    {
        name: "TwentyoneCore",
        description: "Predating the creation of Evox©, TwentyoneCore was designed as a secure, reliable, and efficient platform for file and database management. It was eventually discontinued in favor of Evox©, which remains active today. Since TwentyoneCore is not part of the Evox© ecosystem, accessing it will require switching domains.",
        image: "twentyonecore-thumbnail.png",
        url: "https://twentyonecore.evoxs.xyz/",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2020",
        external: true,
        translations: {
            el: {
                description: "Πριν από τη δημιουργία του Evox©, το TwentyoneCore σχεδιάστηκε ως μια πλατφόρμα διαχείρισης αρχείων. Τελικά διακόπηκε υπέρ του Evox©.",
                badge: "ΕΓΚΑΤΑΛΕΙΦΘΗΚΕ"
            }
        }
    },
    {
        name: "HackerX Site",
        description: "HackerX Site was a dynamic platform providing the latest updates, tutorials, and community-driven content on gaming and development, focused on the YouTube channel: 'H A C K E R X'.It was eventually discontinued in favor of the Evox© ecosystem. As the HackerX Site is a part of Twentyonecore and not within the Evox© ecosystem, accessing it will require switching domains.",
        image: "hackerxsite-thumbnail.png",
        url: "https://twentyonecore.evoxs.xyz/index2.html",
        status: "abandoned",
        badge: "ABANDONED",
        year: "2019",
        external: true,
        translations: {
            el: {
                description: "Το HackerX Site ήταν μια δυναμική πλατφόρμα με ενημερώσεις και σεμινάρια. Τελικά διακόπηκε υπέρ του οικοσυστήματος Evox©.",
                badge: "ΕΓΚΑΤΑΛΕΙΦΘΗΚΕ"
            }
        }
    }
];

// Helper object for UI buttons translation
const uiTranslations = {
    en: { launch: "Launch", switch: "Switch Domain" },
    el: { launch: "Άνοιγμα", switch: "Αλλαγή Τομέα" }
};

function filterProjects(filterType, btn) {
    // Update global state
    currentActiveFilter = filterType;

    const grid = document.getElementById('projectGrid');

    // Update Buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // If called via Lang Switcher, btn might be null/undefined, so check
    if (btn) btn.classList.add('active');
    else {
        // Find the button matching the filter and make active
        const matchingBtn = document.querySelector(`.tab-btn[onclick*="'${filterType}'"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }

    // 1. Trigger Fade Out
    grid.classList.add('switching');

    // 2. Wait for the fade-out to finish
    setTimeout(() => {
        // 3. Clear and Render content while invisible
        renderProjects(filterType);

        // 4. Force a browser "reflow" and then fade in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.classList.remove('switching');
            });
        });
    }, 200); // Matches the CSS 0.2s
}

function renderProjects(filter = 'latest') {
    currentActiveFilter = filter; // Ensure sync
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = '';

    // Detect current language
    const currentLang = localStorage.getItem('evoxLang') || 'en';

    const filtered = projects.filter(p => {
        if (filter === 'all') return true;
        const badgeText = p.badge.toLowerCase();

        if (filter === 'ongoing' || filter === 'abandoned') return p.status === filter;
        if (filter === 'stable') return badgeText.includes('stable') && p.status !== 'abandoned';
        if (filter === 'beta') return badgeText.includes('beta') && p.status !== 'abandoned' || badgeText.includes('alpha') && p.status !== 'abandoned';
        if (filter === 'latest') return p.sorting === 'latest';
        return false;
    });

    // Fragment improves performance by injecting all cards at once
    const fragment = document.createDocumentFragment();

    filtered.forEach((proj, index) => {
        // --- TRANSLATION LOGIC START ---
        // Default to English base data
        let displayDesc = proj.description;
        let displayBadge = proj.badge;
        let displayWarning = proj.warning;

        // Apply translations if language is not English and translation exists
        if (currentLang !== 'en' && proj.translations && proj.translations[currentLang]) {
            if (proj.translations[currentLang].description) displayDesc = proj.translations[currentLang].description;
            if (proj.translations[currentLang].badge) displayBadge = proj.translations[currentLang].badge;
            if (proj.translations[currentLang].warning) displayWarning = proj.translations[currentLang].warning;
        } else if (currentLang === 'en' && proj.translations && proj.translations.en) {
            // Edge case for EduVox where base description is Greek
            if (proj.translations.en.description) displayDesc = proj.translations.en.description;
        }

        // Translate Buttons
        const uiText = uiTranslations[currentLang] || uiTranslations['en'];
        const btnText = proj.external ? uiText.switch : uiText.launch;
        // --- TRANSLATION LOGIC END ---

        const card = document.createElement('article');
        card.className = `card ${proj.status}`;
        card.style.animationDelay = `${index * 0.03}s`; // Faster stagger

        const targetAttr = proj.external ? 'target="_blank"' : '';

        card.innerHTML = `
            <div class="card-visual">
                <img src="${proj.image}" class="app-icon" loading="lazy" onerror="this.src='https://via.placeholder.com/300x180/1c1c1e/333?text=Archive'">
            </div>
            <div class="card-content">
                <div class="meta-row">
                    <span class="badge ${proj.status}">${displayBadge}</span>
                    ${displayWarning ? `<span class="warning-label">${displayWarning}</span>` : ''}
                </div>
                <h2>${proj.name}</h2>
                <p>${displayDesc}</p>
            </div>
            <div class="card-footer">
                <a href="${proj.url}" ${targetAttr} class="btn-launch">${btnText}</a>
                
                <span class="year-label">${proj.year || ''}</span>
            </div>
        `;
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a saved state, if not default to latest
    renderProjects('latest');
});

// Select Dropdown Logic (Contact Form)
document.addEventListener('DOMContentLoaded', () => {
    const customSelect = document.getElementById('customSelect');
    if (!customSelect) return; // Guard clause

    const trigger = customSelect.querySelector('.select-trigger');
    const options = customSelect.querySelectorAll('.option');
    const hiddenInput = document.getElementById('subjectHidden');
    const displayValue = document.getElementById('selectValue');

    // Toggle Dropdown
    trigger.addEventListener('click', (e) => {
        customSelect.classList.toggle('active');
        e.stopPropagation();
    });

    // Select Option
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            const text = option.textContent;

            displayValue.textContent = text;
            hiddenInput.value = value;

            // UI Cleanup
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customSelect.classList.remove('active');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
        customSelect.classList.remove('active');
    });
});


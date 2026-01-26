document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');

    // 1. Search Filtering
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const description = card.querySelector('p').innerText.toLowerCase();
                
                if (title.includes(term) || description.includes(term)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }

    // 2. Navigation
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) {
                // Optional: Add a small fade-out effect before redirecting
                document.body.style.opacity = '0.5';
                window.location.href = url;
            }
        });
    });



});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.style.opacity = '1';
    }
});
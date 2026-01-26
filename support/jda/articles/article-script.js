document.addEventListener('DOMContentLoaded', () => {
    const article = document.querySelector('.article-container');

    article.style.opacity = '0';
    article.style.transition = 'opacity 0.8s ease-out';

    requestAnimationFrame(() => {
        article.style.opacity = '1';
    });
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const article = document.querySelector('.article-container');
        article.style.opacity = '1';
    }
});

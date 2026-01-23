document.addEventListener('DOMContentLoaded', () => {
    // Εφέ απαλής εμφάνισης του περιεχομένου
    const article = document.querySelector('.article-container');
    article.style.opacity = '0';
    article.style.transition = 'opacity 0.8s ease-out';
    
    setTimeout(() => {
        article.style.opacity = '1';
    }, 100);

    // Προαιρετικό: Logging για analytics
    console.log("Article loaded: " + document.title);
});
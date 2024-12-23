
// Global variables and initialization
let votes = [];
let submissions = [];
let chart = null;
let audioContext = null;
let analyser = null;
let filenameCases = {
    submissions: null,
    votes: null
};

// Add this function to handle README loading
async function loadReadme() {
    const readmeView = document.getElementById('readme-view');
    try {
        const response = await fetch('/rules/README.md');
        const readmeContent = await response.text();
        readmeView.innerHTML = marked.parse(readmeContent);
        console.log('README content loaded successfully');
    } catch (error) {
        console.error('Error loading README:', error);
    }
}
// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeMenu();
    fetchData();
});

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    
    if (!menuToggle || !sideMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        menuToggle.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
            menuToggle.classList.remove('menu-open');
        }
    });
}

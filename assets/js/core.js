
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

async function getAvailableEditions() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const baseUrl = isGitHubPages ? 
        'https://sunosongcontest.github.io/rules' : 
        '/rules';
    const csvPath = `${baseUrl}/assets/csv`;
    const editions = [];
    
    // Check for each SSC edition with proper path
    for(let i = 5; i <= 10; i++) {
        try {
            const response = await fetch(`${csvPath}/ssc${i}_Votes_list.csv`);
            if(response.ok) {
                editions.push(i);
            }
        } catch(e) {
            console.log(`Edition ${i} not available`);
            continue;
        }
    }
    
    return editions;
}
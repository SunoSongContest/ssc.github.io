
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
// Define initialization functions first
function initializeCore() {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for ui-handlers.js to load
        if (typeof initializeMenu === 'function') {
            initializeMenu();
            initializeMobileMenu();
            fetchData();
        } else {
            console.log('Waiting for UI handlers to load...');
            // Retry after a short delay
            setTimeout(initializeCore, 100);
        }
    });
}

// Start initialization
initializeCore();
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
    // Get base URL from current page location
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    const csvPath = `${basePath}/assets/csv`;
    const editions = [];
    
    console.log('Using CSV path:', csvPath);
    
    // Check for each SSC edition
    for(let i = 5; i <= 10; i++) {
        const filename = `ssc${i}_Votes_list.csv`;
        try {
            const response = await fetch(`${csvPath}/${filename}`);
            if(response.ok) {
                editions.push(i);
                console.log(`Found edition ${i}`);
            }
        } catch(e) {
            console.log(`Edition ${i} not available:`, e);
            continue;
        }
    }
    
    return editions;
}

// Helper function to get correct asset path
function getAssetPath(relativePath) {
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    return `${basePath}${relativePath}`;
}

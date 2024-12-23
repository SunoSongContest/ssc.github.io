
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

// Define known CSV files configuration
const SSC_EDITIONS = {
    6: {
        votes: 'ssc6_Votes_list.csv',
        submissions: 'ssc6_submissions.csv'
    }
    // Add more editions as needed
};

async function getAvailableEditions() {
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    const csvPath = `${basePath}/assets/csv`;
    const editions = [];

    // Use predefined editions instead of directory listing
    for (const edition in SSC_EDITIONS) {
        try {
            const response = await fetch(`${csvPath}/${SSC_EDITIONS[edition].votes}`);
            if (response.ok) {
                editions.push(parseInt(edition));
                console.log(`Edition ${edition} available`);
            }
        } catch (error) {
            console.log(`Edition ${edition} not available`);
        }
    }

    return editions.sort((a, b) => a - b);
}

async function loadEditionData(edition) {
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    const csvPath = `${basePath}/assets/csv`;
    
    if (!SSC_EDITIONS[edition]) {
        console.error(`Edition ${edition} not configured`);
        return null;
    }

    try {
        const [submissionsResponse, votesResponse] = await Promise.all([
            fetch(`${csvPath}/${SSC_EDITIONS[edition].submissions}`),
            fetch(`${csvPath}/${SSC_EDITIONS[edition].votes}`)
        ]);
        
        const submissionsText = await submissionsResponse.text();
        const votesText = await votesResponse.text();
        
        return {
            submissions: parseSubmissionsCSV(submissionsText),
            votes: parseVotesCSV(votesText)
        };
    } catch (error) {
        console.error(`Error loading SSC${edition} data:`, error);
        return null;
    }
}
// Helper function to get correct asset path
function getAssetPath(relativePath) {
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    return `${basePath}${relativePath}`;
}

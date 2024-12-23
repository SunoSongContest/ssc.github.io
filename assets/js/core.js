
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
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    const csvPath = `${basePath}/assets/csv`;
    const editions = [];

    try {
        // First fetch the directory listing
        const response = await fetch(csvPath);
        const files = await response.text();
        
        // Use regex to find all SSC edition files
        const sscPattern = /ssc(\d+)_[A-Za-z_]+\.csv/i;
        const matches = files.match(new RegExp(sscPattern.source, 'gi')) || [];
        
        // Extract unique edition numbers
        matches.forEach(filename => {
            const match = filename.match(sscPattern);
            if (match) {
                const edition = parseInt(match[1]);
                if (!editions.includes(edition)) {
                    editions.push(edition);
                }
            }
        });
        
        console.log('Found editions:', editions);
        return editions.sort((a, b) => a - b);
        
    } catch (error) {
        console.warn('Directory listing failed, using fallback method');
        return [];
    }
}

async function loadEditionData(edition) {
    const basePath = window.location.pathname.split('/rules')[0] + '/rules';
    const csvPath = `${basePath}/assets/csv`;
    
    try {
        // Get directory listing first
        const response = await fetch(csvPath);
        const files = await response.text();
        
        // Find the exact filenames for this edition
        const votesFile = files.match(new RegExp(`ssc${edition}_.*votes.*\.csv`, 'i'))?.[0];
        const submissionsFile = files.match(new RegExp(`ssc${edition}_.*submissions.*\.csv`, 'i'))?.[0];
        
        if (!votesFile || !submissionsFile) {
            throw new Error(`Files not found for SSC${edition}`);
        }
        
        // Load the files using exact names
        const [submissionsResponse, votesResponse] = await Promise.all([
            fetch(`${csvPath}/${submissionsFile}`),
            fetch(`${csvPath}/${votesFile}`)
        ]);
        
        // Process the data
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

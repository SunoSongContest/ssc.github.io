// Data fetching and parsing functions
async function fetchData() {
    try {
        const _assetsPath = window.location.origin + '/rules/assets/csv/';
        
        // First fetch available editions
        const editions = await getAvailableEditions(_assetsPath);
        populateEditionSelect(editions);
        
        // Add event listener for edition changes
        const editionSelect = document.getElementById('sscEditionSelect');
        editionSelect.addEventListener('change', (e) => {
            // Show menu items when edition is selected
            const menuItems = document.querySelectorAll('.menu-item[data-view]');
            menuItems.forEach(item => {
                if(e.target.value) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            loadEditionData(e);
        });
    } catch (error) {
        console.error('Error loading editions:', error);
    }
}
async function getAvailableEditions() {
    const csvPath = `${window.location.origin}/rules/assets/csv/`;
    const editions = new Set();
    
    try {
        const response = await fetch(csvPath);
        const files = await response.text();
        
        // Store the exact case pattern we find
        const sscMatch = files.match(/(?:SSC|ssc)\d+_[A-Za-z_]+\.csv/i);
        if (sscMatch) {
            const pattern = sscMatch[0];
            filenameCases.votes = pattern.includes('Votes') ? 'Votes' : 'votes';
            filenameCases.submissions = pattern.includes('Submissions') ? 'Submissions' : 'submissions';
        }

        const matches = files.match(/(?:SSC|ssc)(\d+)_/gi) || [];
        matches.forEach(match => {
            const edition = match.match(/\d+/)[0];
            editions.add(parseInt(edition));
        });

        return Array.from(editions).sort((a, b) => a - b);
    } catch(e) {
        console.warn('Directory listing failed:', e);
        return [];
    }
}
function parseSubmissionsCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        result.push({
            songTitle: values[4],
            sunoUsername: values[3],
            songUrl: values[5]
        });
    }
    
    return result;
}
function parseVotesCSV(csv) {
    const lines = csv.split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        result.push({
            id: values[0],
            songName: values[1],
            week: values[2],
            points: values[3],
            votes12: values[4],
            votes10: values[5],
            votes8: values[6],
            votes7: values[7],
            votes6: values[8],
            votes5: values[9],
            votes4: values[10],
            votes3: values[11],
            votes2: values[12],
            votes1: values[13],
            numVoters: values[14],
            avgPoints: values[15],
            weeklyRank: values[16],
            result: values[17]  // Add this line
        });
    }

    return result;
}
async function loadEditionData(event) {
    const edition = event.target.value;
    if(!edition) return;
    
    const csvPath = `${window.location.origin}/rules/assets/csv/`;
    
    try {
        const [submissionsResponse, votesResponse] = await Promise.all([
            fetch(`${csvPath}SSC${edition}_${filenameCases.submissions}.csv`),
            fetch(`${csvPath}SSC${edition}_${filenameCases.votes}_list.csv`)
        ]);

        const submissionsText = await submissionsResponse.text();
        const votesText = await votesResponse.text();
        
        submissions = parseSubmissionsCSV(submissionsText);
        votes = parseVotesCSV(votesText);
        
        // Initialize selects after data is loaded
        initializeSelects();
        initializeMenu(); // Re-initialize menu with new data
        
        // Reset views
        document.getElementById('songSelect').value = '';
        document.getElementById('weekSelect').value = '';
        document.getElementById('summaryWeekSelect').value = '';
        
        // Clear any existing visualizations
        const statsContainer = document.querySelector('.stats-container');
        statsContainer.style.display = 'none';
        
        if(chart) {
            chart.destroy();
        }
    } catch (error) {
        console.error('Error loading edition data:', error);
    }
}
async function tryPatterns(basePath, patterns) {
    for (const pattern of patterns) {
        try {
            const response = await fetch(`${basePath}${pattern}`);
            if (response.ok) return response;
        } catch (e) {
            continue;
        }
    }
    throw new Error('No matching file found');
}
function populateEditionSelect(editions) {
    const select = document.getElementById('sscEditionSelect');
    select.innerHTML = '<option value="">Select SSC Edition</option>';
    
    editions.forEach(edition => {
        const option = document.createElement('option');
        option.value = edition;
        option.textContent = `SSC${edition}`;
        select.appendChild(option);
    });
}
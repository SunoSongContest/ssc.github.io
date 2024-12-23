// First define the function
function setupMenuHandlers() {
    const menuItems = document.querySelectorAll('.menu-item[data-view]');
    const readmeView = document.getElementById('readme-view');
    const songVotesView = document.getElementById('song-votes-view');
    const weeklySummaryView = document.getElementById('weekly-summary-view');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Menu item clicked:', item.dataset.view);
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.dataset.view;
            readmeView.style.display = 'none';
            songVotesView.style.display = view === 'song-votes' ? 'block' : 'none';
            weeklySummaryView.style.display = view === 'weekly-summary' ? 'block' : 'none';
        });
    });
}

// UI initialization and event handlers
async function initializeMenu() {
    console.log('Initializing menu...');
    const menuItems = document.querySelectorAll('.menu-item[data-view]');
    const readmeView = document.getElementById('readme-view');
    const songVotesView = document.getElementById('song-votes-view');
    const weeklySummaryView = document.getElementById('weekly-summary-view');

    // Hide other views initially
    songVotesView.style.display = 'none';
    weeklySummaryView.style.display = 'none';
    readmeView.style.display = 'block';

    // Load README content
    try {
        const response = await fetch('/rules/ssc6/tools/README.md');
        const text = await response.text();
        console.log('Raw README content:', text);
        readmeView.innerHTML = marked.parse(text);
        console.log('README content loaded and parsed');
    } catch (err) {
        console.error('Error loading README:', err);
        readmeView.innerHTML = '<h1>Error loading documentation</h1>';
    }

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Menu item clicked:', item.dataset.view);
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.dataset.view;
            readmeView.style.display = 'none';
            songVotesView.style.display = view === 'song-votes' ? 'block' : 'none';
            weeklySummaryView.style.display = view === 'weekly-summary' ? 'block' : 'none';
        });
    });
}

// Export for use in visualization.js
window.setupMenuHandlers = setupMenuHandlers;
    const summaryWeekSelect = document.getElementById('summaryWeekSelect');
    summaryWeekSelect.innerHTML = '<option value="">Select Week</option>';
    
    // Get unique weeks from votes data
    const uniqueWeeks = [...new Set(votes.map(v => v.week))].sort((a, b) => {
        // Custom sort: numeric weeks first, then '2nd-chance', then 'Finals'
        if (!isNaN(a) && !isNaN(b)) return parseInt(a) - parseInt(b);
        if (!isNaN(a)) return -1;
        if (!isNaN(b)) return 1;
        if (a === '2nd-chance') return -1;
        if (b === '2nd-chance') return 1;
        return 0;
    });

    // Populate select with all available weeks
    uniqueWeeks.forEach(week => {
        const option = document.createElement('option');
        option.value = week;
        option.textContent = isNaN(week) ? week : `Week ${week}`;
        summaryWeekSelect.appendChild(option);
    });
    
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    
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

    // Close menu when clicking menu items on mobile
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sideMenu.classList.remove('open');
                menuToggle.classList.remove('menu-open');
            }
        });
    });
}
function initializeSelects() {
    const weekSelect = document.getElementById('weekSelect');
    const summaryWeekSelect = document.getElementById('summaryWeekSelect');
    
    weekSelect.innerHTML = '<option value="">Select Week</option>';
    summaryWeekSelect.innerHTML = '<option value="">Select Week</option>';
    
    const edition = document.getElementById('sscEditionSelect').value;
    const editionData = window.CSV_MANIFEST.getEditionFiles(parseInt(edition));
    
    if (editionData) {
        for (let week = 1; week <= editionData.weeks; week++) {
            const option1 = document.createElement('option');
            option1.value = week.toString();
            option1.textContent = `Week ${week}`;
            weekSelect.appendChild(option1.cloneNode(true));
            summaryWeekSelect.appendChild(option1);
        }
    }

    // Add all event listeners in one place
    weekSelect.addEventListener('change', updateSongSelect);
    document.getElementById('songSelect').addEventListener('change', updateVisualization);
    document.getElementById('summaryWeekSelect').addEventListener('change', updateWeeklySummary);
}function updateSongSelect() {
    const weekSelect = document.getElementById('weekSelect');
    const songSelect = document.getElementById('songSelect');
    const selectedWeek = weekSelect.value;

    songSelect.innerHTML = '<option value="">Select Song</option>';

    if (selectedWeek) {
        const weekSongs = votes.filter(s => s.week === selectedWeek && parseInt(s.points) > 0);
        
        weekSongs.sort((a, b) => parseInt(b.points) - parseInt(a.points));
        
        weekSongs.forEach(song => {
            const option = document.createElement('option');
            option.value = song.songName;
            option.textContent = song.songName;
            songSelect.appendChild(option);
        });
    }
}
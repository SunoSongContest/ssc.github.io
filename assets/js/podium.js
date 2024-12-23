// Podium display logic
async function updatePodium(weekVotes) {
    console.log('Updating podium with votes:', weekVotes);
    const podiumSection = document.querySelector('.top-songs-podium');
    const finalistsPodium = document.querySelector('.finalists-podium');
    const secondChancePodium = document.querySelector('.second-chance-podium');
    const secondChanceSection = document.querySelector('.second-chance-section');

    // Clear existing content
    finalistsPodium.innerHTML = '';
    secondChancePodium.innerHTML = '';

    // Sort and filter songs
    const sortedSongs = weekVotes.sort((a, b) => parseInt(b.points) - parseInt(a.points));
    console.log('Sorted songs:', sortedSongs);

    // Check if this is Finals week and log the first few entries to verify data
    if (weekVotes.some(vote => vote.week === 'Finals')) {
        console.log('First few entries:', sortedSongs.slice(0, 5));
        podiumSection.style.display = 'block';
        
        // Filter for different placements with more flexible matching
        const winner = sortedSongs.find(s => s.result?.toLowerCase().includes('winner'));
        const secondPlace = sortedSongs.find(s => s.result?.toLowerCase().includes('2nd'));
        const thirdPlace = sortedSongs.find(s => s.result?.toLowerCase().includes('3rd'));
        const bbn = sortedSongs.find(s => s.result?.toLowerCase().includes('bbn'));

        console.log('Finals positions with flexible matching:', { 
            winner, 
            secondPlace, 
            thirdPlace, 
            bbn,
            availableResults: [...new Set(sortedSongs.map(s => s.result))]
        });

        // Create Finals podium HTML
        const finalsHTML = `
            <div class="finals-podium">
                <div class="winners-row">
                    ${await createPodiumItem(secondPlace, 'medium')}
                    ${await createPodiumItem(winner, 'large')}
                    ${await createPodiumItem(thirdPlace, 'medium')}
                </div>
                ${bbn ? `
                    <div class="bbn-row">
                        <h3>Best Brand New</h3>
                        ${await createPodiumItem(bbn, 'medium')}
                    </div>
                ` : ''}
            </div>
        `;
        
        finalistsPodium.innerHTML = finalsHTML;
        console.log('Finals podium rendered');
    } else {
        console.log('Rendering regular week podium');
        const finalists = sortedSongs.filter(song => song.result && song.result.trim() === 'Finalist');
        const secondChance = sortedSongs.filter(song => song.result && song.result.trim() === '2nd Chance');
        
        // Update the HTML structure in data_analysis.md to include title elements
        const finalistsTitle = document.querySelector('.finalists-title');
        const secondChanceTitle = document.querySelector('.second-chance-title');
        
        // Handle Finalists section visibility
        if (finalists.length > 0) {
            podiumSection.style.display = 'block';
            finalistsTitle.style.display = 'block';
            
            // Create finalist podium items...
            for (let song of finalists) {
                const submission = submissions.find(s => s.songTitle === song.songName);
                if (!submission) continue;
              
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId).catch(err => {
                    console.warn(`Failed to fetch info for song ${songId}:`, err);
                    return {
                        id: songId,
                        imageUrl: 'https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'
                    };
                });

                const podiumItem = document.createElement('div');
                podiumItem.className = 'podium-item';
                podiumItem.innerHTML = `
                    <a href="${submission.songUrl}" target="_blank">
                        <img src="${songInfo.imageUrl}" alt="${song.songName}" onerror="this.src='https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'">
                    </a>
                    <div class="podium-rank"># ${song.weeklyRank}</div>
                    <div class="podium-title">
                        <a href="${submission.songUrl}" target="_blank">${song.songName}</a>
                    </div>
                    <div class="podium-artist">by ${submission.sunoUsername}</div>
                    <div class="podium-points">${song.points} points</div>
                `;
                finalistsPodium.appendChild(podiumItem);
            }
            
            // Handle Second Chance section visibility
            if (secondChance.length > 0) {
                secondChanceSection.style.display = 'block';
                secondChanceTitle.style.display = 'block';
                // Create second chance podium items...
                for (let song of secondChance) {
                    const submission = submissions.find(s => s.songTitle === song.songName);
                    if (!submission) continue;
                    
                    const songId = getSongIdFromUrl(submission.songUrl);
                        const songInfo = await getSongInfo(songId).catch(err => {
                            console.warn(`Failed to fetch info for song ${songId}:`, err);
                            return {
                                id: songId,
                                imageUrl: 'https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'
                            };
                        });
                
                    const podiumItem = document.createElement('div');
                    podiumItem.className = 'podium-item';
                    podiumItem.innerHTML = `
                        <a href="${submission.songUrl}" target="_blank">
                            <img src="${songInfo?.imageUrl || ''}" alt="${song.songName}">
                        </a>
                        <div class="podium-rank"># ${song.weeklyRank}</div>
                        <div class="podium-title">
                            <a href="${submission.songUrl}" target="_blank">${song.songName}</a>
                        </div>
                        <div class="podium-artist">by ${submission.sunoUsername}</div>
                        <div class="podium-points">${song.points} points</div>
                    `;
                
                    secondChancePodium.appendChild(podiumItem);
                }
            } else {
                secondChanceSection.style.display = 'none';
                secondChanceTitle.style.display = 'none';
            }
        } else {
            finalistsTitle.style.display = 'none';
        }
    }
}async function createPodiumItem(song, size = 'medium') {
    if (!song) return '';
    
    const submission = submissions.find(s => s.songTitle === song.songName);
    if (!submission) return '';
    
    const songId = getSongIdFromUrl(submission.songUrl);
    console.log('Creating podium item for song:', songId);

    // Get song info before creating HTML
    const songInfo = await getSongInfo(songId).catch(err => {
        console.warn(`Failed to fetch info for song ${songId}:`, err);
        return {
            id: songId,
            imageUrl: 'https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'
        };
    });

    const sizeClasses = {
        large: 'podium-item-large',
        medium: 'podium-item-medium',
        small: 'podium-item-small'
    };

    const rankLabels = {
        'Winner': '🏆 Winner',
        '2nd-place': '🥈 2nd Place',
        '3rd-place': '🥉 3rd Place',
        'BBN': '✨ Best Brand New',
        'Finalist': `#${song.weeklyRank}`,
        '2nd Chance': `#${song.weeklyRank}`
    };
    
    return `
        <div class="podium-item ${sizeClasses[size]}">
            <a href="${submission.songUrl}" target="_blank">
                <img src="${songInfo.imageUrl}" 
                     alt="${song.songName}" 
                     onerror="this.src='https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'">
            </a>
            <div class="podium-rank">${rankLabels[song.result] || `#${song.weeklyRank}`}</div>
            <div class="podium-title">
                <a href="${submission.songUrl}" target="_blank">${song.songName}</a>
            </div>
            <div class="podium-artist">by ${submission.sunoUsername}</div>
            <div class="podium-points">${song.points} points</div>
        </div>
    `;
}
// Podium display logic
async function updatePodium(weekVotes) {
    if (!weekVotes || weekVotes.length === 0) return;
    
    console.log('Updating podium with votes:', weekVotes);
    const podiumSection = document.querySelector('.top-songs-podium');
    const finalistsPodium = document.querySelector('.finalists-podium');
    const secondChancePodium = document.querySelector('.second-chance-podium');
    const secondChanceSection = document.querySelector('.second-chance-section');

    // Clear existing content
    finalistsPodium.innerHTML = '';
    secondChancePodium.innerHTML = '';

    // Sort and filter songs
    const sortedSongs = [...weekVotes].sort((a, b) => parseInt(b.points) - parseInt(a.points));
    console.log('Sorted songs:', sortedSongs);
    console.log('Sample song data:', sortedSongs[0]);

    // Check if this is Finals week
    if (sortedSongs[0]?.week === 'Finals') {
        console.log('Processing Finals week');
        podiumSection.style.display = 'block';
        secondChanceSection.style.display = 'none';

        const winner = sortedSongs.find(s => s.result?.trim() === 'Winner');
        const secondPlace = sortedSongs.find(s => s.result?.trim() === '2nd-place');
        const thirdPlace = sortedSongs.find(s => s.result?.trim() === '3rd-place');
        const bbn = sortedSongs.find(s => s.result?.trim() === 'BBN');

        console.log('Finals positions:', { winner, secondPlace, thirdPlace, bbn });

        let finalsHTML = '<div class="finals-podium"><div class="winners-row">';
        
        if (secondPlace) {
            const submission = window.submissions.find(s => s.songTitle === secondPlace.songName);
            if (submission) {
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId);
                finalsHTML += createPodiumHTML(secondPlace, submission, songInfo, 'medium');
            }
        }
        
        if (winner) {
            const submission = window.submissions.find(s => s.songTitle === winner.songName);
            if (submission) {
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId);
                finalsHTML += createPodiumHTML(winner, submission, songInfo, 'large');
            }
        }
        
        if (thirdPlace) {
            const submission = window.submissions.find(s => s.songTitle === thirdPlace.songName);
            if (submission) {
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId);
                finalsHTML += createPodiumHTML(thirdPlace, submission, songInfo, 'medium');
            }
        }
        
        finalsHTML += '</div>';
        
        if (bbn) {
            const submission = window.submissions.find(s => s.songTitle === bbn.songName);
            if (submission) {
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId);
                finalsHTML += `
                    <div class="bbn-row">
                        <h3>Best Brand New</h3>
                        ${createPodiumHTML(bbn, submission, songInfo, 'medium')}
                    </div>`;
            }
        }
        
        finalsHTML += '</div>';
        finalistsPodium.innerHTML = finalsHTML;
        return;
    }
    // Regular week handling
    const finalists = sortedSongs.filter(song => song.result?.trim() === 'Finalist');
    const secondChance = sortedSongs.filter(song => song.result?.trim() === '2nd Chance');
    
    console.log('Regular week songs:', { finalists, secondChance });
    if (finalists.length > 0) {
        podiumSection.style.display = 'block';
        let finalistsHTML = '<div class="podium-section"><h2>Finalists</h2><div class="podium-container">';
        
        for (const song of finalists) {
            const submission = window.submissions.find(s => s.songTitle === song.songName);
            if (!submission) continue;
            
            const songId = getSongIdFromUrl(submission.songUrl);
            const songInfo = await getSongInfo(songId);
            finalistsHTML += createPodiumHTML(song, submission, songInfo);
        }
        
        finalistsHTML += '</div></div>';
        finalistsPodium.innerHTML = finalistsHTML;

        if (secondChance.length > 0) {
            secondChanceSection.style.display = 'block';
            let secondChanceHTML = '<div class="podium-section"><h2>Second Chance</h2><div class="podium-container">';
            
            for (const song of secondChance) {
                const submission = window.submissions.find(s => s.songTitle === song.songName);
                if (!submission) continue;
                
                const songId = getSongIdFromUrl(submission.songUrl);
                const songInfo = await getSongInfo(songId);
                secondChanceHTML += createPodiumHTML(song, submission, songInfo);
            }
            
            secondChanceHTML += '</div></div>';
            secondChancePodium.innerHTML = secondChanceHTML;
        }
    } else {
        podiumSection.style.display = 'none';
    }
}function createPodiumHTML(song, submission, songInfo, size = '') {
    const sizeClass = size ? ` podium-item-${size}` : '';
    return `
        <div class="podium-item${sizeClass}">
            <a href="${submission.songUrl}" target="_blank">
                <img src="${songInfo.imageUrl}" alt="${song.songName}" onerror="this.src='https://cdn.glitch.global/1f7954fd-4779-4304-a1e0-16c4218d8634/ssc_coverart_logo.jpeg?v=1733688489365'">
            </a>
            <div class="podium-rank"># ${song.weeklyRank}</div>
            <div class="podium-title">
                <a href="${submission.songUrl}" target="_blank">${song.songName}</a>
            </div>
            <div class="podium-artist">by ${submission.sunoUsername}</div>
            <div class="podium-points">${song.points} points</div>
        </div>
    `;
}

async function createPodiumItem(song, size = 'medium') {
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
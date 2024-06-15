
import { fetchData, handleFetchError, addEventListenerToSelector } from './utils.js';

// Add Playlist functionality
document.getElementById('add-playlist-button').addEventListener('click', function () {
    const name = document.getElementById('new-playlist-name').value.trim();
    const description = document.getElementById('new-playlist-description').value.trim();
    const items = document.getElementById('new-playlist-items').value.trim().split(',');

    const newPlaylist = { name, description, items };

    fetchData('/admin/playlists/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlaylist)
    })
    .then(response => {
        console.log('Playlist added successfully!');
        console.log(response);
        location.reload();  // Reload the page to reflect the new playlist
    })
    .catch(error => handleFetchError(error, document.querySelector('.add-playlist')));
});

// Edit Playlist functionality
addEventListenerToSelector('.edit-playlist', 'click', function () {
    const playlistId = this.getAttribute('data-id');

    fetchData(`/admin/playlists/${playlistId}`)
        .then(data => {
            populatePlaylistForm(data);
            document.querySelector('#edit-playlist-modal').style.display = 'block';
        })
        .catch(error => handleFetchError(error));
});

// Delete Playlist functionality
addEventListenerToSelector('.delete-playlist', 'click', async function() {
    const playlistId = this.getAttribute('data-id');
    logToConsole(`Deleting playlist ID: ${playlistId}`);

    try {
        const response = await fetchData(`/admin/playlists/delete/${playlistId}`, { method: 'DELETE' });
        logToConsole(`Playlist ID: ${playlistId} deleted successfully.`);
        location.reload();
    } catch (error) {
        logToConsole(`Error: ${error.message}`);
    }
});

document.querySelector('#save-playlist-button').addEventListener('click', updatePlaylist);
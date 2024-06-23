import { fetchData, handleFetchError, addEventListenerToSelector } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-playlist-button').addEventListener('click', function () {
        const name = document.getElementById('edit-playlist-name').value.trim();
        //console.log('Name:', name); // Confirm name capture

        const description = document.getElementById('edit-playlist-description').value.trim();
        //console.log('Description:', description); // Confirm description capture

        // Capture and log all selected item IDs
        const itemIds = Array.from(document.getElementById('edit-playlist-content').selectedOptions).map(opt => opt.value);
        //console.log('Item IDs:', itemIds); // Confirm item ID capture

        const newPlaylist = {
            name: name,
            description: description,
            createDate: new Date().toISOString(),
            items: itemIds.map(mediaId => ({ mediaId }))
        };

        //console.log('New Playlist Object:', newPlaylist); // Log the entire playlist object to console

        fetch('/admin/playlists/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlaylist)
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Ensure the response is OK before parsing it as JSON
            } else {
                throw new Error('Failed to add playlist: ' + response.statusText);
            }
        })
        .then(data => {
            console.log('Playlist added successfully!', data);
            location.reload(); // Reload the page to reflect the new playlist
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
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
});    
document.addEventListener('DOMContentLoaded', function () {
    // Fetch media and populate the selection dropdown
    fetchMediaList();

    // Event listeners for media selection changes, if applicable
    const mediaSelect = document.getElementById('edit-playlist-content');
    if (mediaSelect) {
        mediaSelect.addEventListener('change', handleMediaSelectionChange);
    }
});

// Fetch media list from the server
function fetchMediaList() {
    fetch('/admin/media')
        .then(response => response.json())
        .then(mediaItems => populateMediaSelector(mediaItems))
        .catch(error => console.error('Failed to fetch media:', error));
}

// Populate the media selector dropdown with fetched media items
function populateMediaSelector(mediaItems) {
    const mediaSelector = document.getElementById('edit-playlist-content');
    // Clear existing options before adding new ones
    mediaSelector.innerHTML = '';
    mediaItems.forEach(media => {
        const option = new Option(`${media.name} (${media.type})`, media.id);
        mediaSelector.appendChild(option);
    });
}


// Handle changes in media selection
function handleMediaSelectionChange() {
    const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
    //updateMediaDetails(selectedOptions);
}

// Update details section based on selected media
function updateMediaDetails(selectedMediaIds) {
    const detailsContainer = document.getElementById('media-details-container');
    detailsContainer.innerHTML = ''; // Clear previous details

    selectedMediaIds.forEach(id => {
        const detailDiv = document.createElement('div');
        detailDiv.innerHTML = `
            <label for="media-duration-${id}">Duration (sec):</label>
            <input type="text" id="media-duration-${id}" name="duration" placeholder="Enter duration">
        `;
        detailsContainer.appendChild(detailDiv);
    });
}


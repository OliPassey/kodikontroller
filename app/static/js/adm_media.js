// media.js
import { fetchData, handleFetchError } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
/*

    // Fetch YouTube media
    fetchData('/admin/media/youtube')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const youtubeSelect = widget.querySelector('.youtube-media-select');
                youtubeSelect.innerHTML = '<option value="">Select a YouTube video</option>';
                data.forEach(media => {
                    const option = new Option(media.name, media.url);
                    youtubeSelect.appendChild(option);
                });
            });
        })
        .catch(error => handleFetchError(error));

    // Fetch Video media
    fetchData('/admin/media/video')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const videoSelect = widget.querySelector('.play-video-select');
                videoSelect.innerHTML = '<option value="">Select a video</option>';
                data.forEach(media => {
                    const option = new Option(media.name, media.url);
                    videoSelect.appendChild(option);
                });
            });
        })
        .catch(error => handleFetchError(error));

    // Fetch Audio media
    fetchData('/admin/media/audio')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const audioSelect = widget.querySelector('.play-audio-select');
                audioSelect.innerHTML = '<option value="">Select an audio file</option>';
                data.forEach(media => {
                    const option = new Option(media.name, media.url);
                    audioSelect.appendChild(option);
                });
            });
        })
        .catch(error => handleFetchError(error)); */


    // Add Media functionality
    document.getElementById('add-media-button').addEventListener('click', function () {
        const name = document.getElementById('edit-media-name').value.trim();
        const description = document.getElementById('edit-media-description').value.trim();
        const type = document.getElementById('edit-media-type').value.trim();
        const path = document.getElementById('edit-media-path').value.trim();
        const url = document.getElementById('edit-media-url').value.trim();

        const newMedia = { name, description, type, path, url };

        fetch('/admin/media/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMedia)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error); });
            }
        })
        .then(response => {
            console.log('Media added successfully!');
            console.log(response);
            location.reload();  // Reload the page to reflect the new media
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(document.querySelector('.add-media'), error.message);
        });
    });

    // Edit Media
    document.querySelectorAll('.edit-media').forEach(button => {
        button.addEventListener('click', async function() {
            const mediaId = button.getAttribute('data-id');
            logToConsole(`Editing media ID: ${mediaId}`);
    
            try {
                const response = await fetch(`/admin/media/${mediaId}`);
                if (response.ok) {
                    const mediaData = await response.json();
                    populateMediaForm(mediaData);
                    logToConsole(JSON.stringify(mediaData, null, 2)); // Convert object to string
                } else {
                    throw new Error('Failed to fetch media data.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });
    
    // Save Edit Media
    document.getElementById('save-media-button').addEventListener('click', async function() {
        const mediaId = document.getElementById('edit-media-id').value;
        const mediaData = {
            name: document.getElementById('edit-media-name').value,
            description: document.getElementById('edit-media-description').value,
            type: document.getElementById('edit-media-type').value,
            path: document.getElementById('edit-media-path').value,
            url: document.getElementById('edit-media-url').value
        };
    
        logToConsole(`Saving media ID: ${mediaId}`);
    
        try {
            const response = await fetch(`/admin/media/update/${mediaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mediaData)
            });
    
            if (response.ok) {
                logToConsole(`Media ID: ${mediaId} updated successfully.`);
                location.reload();
            } else {
                throw new Error('Failed to update media.');
            }
        } catch (error) {
            logToConsole(`Error: ${error.message}`);
        }
    });
    
    // Delete Media
    document.querySelectorAll('.delete-media').forEach(button => {
        button.addEventListener('click', async function() {
            const mediaId = button.getAttribute('data-id');
            logToConsole(`Deleting media ID: ${mediaId}`);
    
            try {
                const response = await fetch(`/admin/media/delete/${mediaId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    logToConsole(`Media ID: ${mediaId} deleted successfully.`);
                    location.reload();
                } else {
                    throw new Error('Failed to delete media.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

});

document.addEventListener('DOMContentLoaded', function () {
    //Welcome msg
    console.log('Connecting Console...');
    console.log('Kodi Kontroller v4 has loaded');

    //Fetch YouTube media
    fetch('/admin/media/youtube')  // Assuming this endpoint returns YouTube media
    .then(response => response.json())
    .then(data => {
        // Select all YouTube dropdowns in each host widget
        document.querySelectorAll('.host-widget').forEach(widget => {
            const youtubeSelect = widget.querySelector('.youtube-media-select');
            // Ensure the dropdown is cleared initially (important if this code runs more than once)
            youtubeSelect.innerHTML = '<option value="">Select a YouTube video</option>';
            // Populate the dropdown with new options
            data.forEach(media => {
                const option = new Option(media.name, media.url);
                youtubeSelect.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error loading YouTube media:', error));

    //Fetch Video media
    fetch('/admin/media/video')  // Assuming this endpoint returns YouTube media
    .then(response => response.json())
    .then(data => {
        // Select all YouTube dropdowns in each host widget
        document.querySelectorAll('.host-widget').forEach(widget => {
            const videoSelect = widget.querySelector('.play-video-select');
            // Ensure the dropdown is cleared initially (important if this code runs more than once)
            videoSelect.innerHTML = '<option value="">Select a video</option>';
            // Populate the dropdown with new options
            data.forEach(media => {
                const option = new Option(media.name, media.url);
                videoSelect.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error loading video media:', error));

    //Fetch Audio media
    fetch('/admin/media/audio')  // Assuming this endpoint returns YouTube media
    .then(response => response.json())
    .then(data => {
        // Select all YouTube dropdowns in each host widget
        document.querySelectorAll('.host-widget').forEach(widget => {
            const audioSelect = widget.querySelector('.play-audio-input');
            // Ensure the dropdown is cleared initially (important if this code runs more than once)
            audioSelect.innerHTML = '<option value="">Select an audio</option>';
            // Populate the dropdown with new options
            data.forEach(media => {
                const option = new Option(media.name, media.url);
                audioSelect.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error loading audio media:', error));

    //Fetch Image media
    fetch('/admin/media/image')  // Assuming this endpoint returns YouTube media
    .then(response => response.json())
    .then(data => {
        // Select all YouTube dropdowns in each host widget
        document.querySelectorAll('.host-widget').forEach(widget => {
            const imageSelect = widget.querySelector('.image-select-input');
            // Ensure the dropdown is cleared initially (important if this code runs more than once)
            imageSelect.innerHTML = '<option value="">Select a image</option>';
            // Populate the dropdown with new options
            data.forEach(media => {
                const option = new Option(media.name, media.url);
                imageSelect.appendChild(option);
            });
        });
    })
    .catch(error => console.error('Error loading YouTube media:', error));

    // Video Dropdown Play button
    document.querySelector('.play-video-button').addEventListener('click', function () {
        const select = this.closest('.host-widget').querySelector('.play-video-select');
        const url = select.value;
        const widget = this.closest('.host-widget');
        const hostId = widget.getAttribute('data-host-id');
    
        if (url) {
            fetch(`/ctrl/video/hosts/${hostId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ media_path: url })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Video sent successfully!');
                    return response.json();
                } else {
                    throw new Error('Failed to send Video URL');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(widget, error.message);
            });
        } else {
            console.error('No video selected');
            displayError(widget, 'Please select a video to play.');
        }
    });

    // Audio Dropdown Play button
    document.querySelector('.play-audio-button').addEventListener('click', function () {
        const select = this.closest('.host-widget').querySelector('.play-audio-input');
        const url = select.value;
        const widget = this.closest('.host-widget');
        const hostId = widget.getAttribute('data-host-id');
    
        if (url) {
            fetch(`/ctrl/audio/hosts/${hostId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ media_path: url })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Audio sent successfully!');
                    return response.json();
                } else {
                    throw new Error('Failed to send Audio URL');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(widget, error.message);
            });
        } else {
            console.error('No audio selected');
            displayError(widget, 'Please select a track to play.');
        }
    });

    // Image Dropdown Play button
    document.querySelector('.select-image-button').addEventListener('click', function () {
        const select = this.closest('.host-widget').querySelector('.image-select-input');
        const url = select.value;
        const widget = this.closest('.host-widget');
        const hostId = widget.getAttribute('data-host-id');
    
        if (url) {
            fetch(`/ctrl/image/hosts/${hostId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_url: url })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Image sent successfully!');
                    return response.json();
                } else {
                    throw new Error('Failed to send YouTube URL');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError(widget, error.message);
            });
        } else {
            console.error('No Image selected');
            displayError(widget, 'Please select an Image to play.');
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
        const youtubeGroup = document.querySelectorAll(".youtube-group");
        
        youtubeGroup.forEach(function (group) {
            const arrow = group.querySelector(".arrow");
    
            arrow.addEventListener("click", function () {
                const content = this.parentNode.nextElementSibling;
                content.classList.toggle("hidden");
            });
        });
    });
    

    // Existing play button functionality
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            const input = widget.querySelector('.youtube-url-input');
            const youtubeUrl = input.value.trim();

            if (youtubeUrl) {
                postYouTubeUrl(hostId, youtubeUrl);
            } else {
                displayError(widget, 'Please enter a valid YouTube URL.');
            }
        });
    });

    // Existing play button functionality
    document.querySelectorAll('.play-media-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            const input = widget.querySelector('.youtube-media-select');
            const youtubeUrl = input.value.trim();

            if (youtubeUrl) {
                postYouTubeUrl(hostId, youtubeUrl);
            } else {
                displayError(widget, 'Please enter a valid YouTube URL.');
            }
        });
    });

    // Existing notify button functionality
    document.querySelectorAll('.notify-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            const headline = widget.querySelector('.notification-headline-input').value.trim();
            const message = widget.querySelector('.notification-message-input').value.trim();
            const duration = parseInt(widget.querySelector('.notification-duration-select').value, 10);  // Ensure duration is an integer
            const image = widget.querySelector('.notification-image-select').value;

            if (headline && message) {
                postNotification(hostId, headline, message, duration, image);
            } else {
                displayError(widget, 'Please enter both a headline and a message for the notification.');
            }
        });
    });

    // Add an event listener for the stop button
    document.querySelectorAll('.stop-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            stopPlayback(hostId);
        });
    });

    // Add an event listener for the image button
    document.querySelectorAll('.image-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            const input = widget.querySelector('.image-url-input');
            const imageUrl = input.value.trim();

            if (imageUrl) {
                postImageUrl(hostId, imageUrl);
            } else {
                displayError(widget, 'Please enter a valid Image URL.');
            }
        });
    });

    // Admin button functionality
    const adminButton = document.querySelector('.admin-button');
    const adminOverlay = document.querySelector('.admin-overlay');
    const closeAdminButton = document.querySelector('.close-admin');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    adminButton.addEventListener('click', () => {
        adminOverlay.style.display = 'block';
    });

    closeAdminButton.addEventListener('click', () => {
        adminOverlay.style.display = 'none';
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === tab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Add Host functionality
    document.getElementById('add-host-button').addEventListener('click', function () {
        const name = document.getElementById('edit-host-name').value.trim();
        const ip = document.getElementById('edit-host-ip').value.trim();
        const port = parseInt(document.getElementById('edit-host-port').value, 10);
        const username = document.getElementById('edit-host-username').value.trim();
        const password = document.getElementById('edit-host-password').value.trim();
        const group = document.getElementById('edit-host-group').value.trim();
        const cec = document.getElementById('edit-host-cec').value.trim();
        const status = document.getElementById('edit-host-status').value.trim();
        const os = document.getElementById('edit-host-os').value.trim();
        const location = document.getElementById('edit-host-location').value.trim();

        const newHost = { name, ip, port, username, password, group, cec, status, os, location };

        fetch('/admin/hosts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHost)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error); });
            }
        })
        .then(response => {
            console.log('Host added successfully!');
            console.log(response);
            location.reload();  // Reload the page to reflect the new host
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(document.querySelector('.add-host'), error.message);
        });
    });

    // Edit Form populate form
    document.querySelectorAll('.edit-host').forEach(button => {
        button.addEventListener('click', async function() {
            const hostId = button.getAttribute('data-id');
            logToConsole(`Editing host ID: ${hostId}`);
    
            try {
                const response = await fetch(`/admin/hosts/${hostId}`);
                if (response.ok) {
                    const hostData = await response.json();
                    populateHostForm(hostData);
                    logToConsole(JSON.stringify(hostData, null, 2)); // Convert object to string
                } else {
                    throw new Error('Failed to fetch host data.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });
    
    // Save Edit Host
    document.getElementById('save-host-button').addEventListener('click', async function() {
        const hostId = document.getElementById('edit-host-id').value;
        const hostData = {
            name: document.getElementById('edit-host-name').value,
            ip: document.getElementById('edit-host-ip').value,
            port: document.getElementById('edit-host-port').value,
            username: document.getElementById('edit-host-username').value,
            password: document.getElementById('edit-host-password').value,
            group: document.getElementById('edit-host-group').value,
            cec: document.getElementById('edit-host-cec').value,
            status: document.getElementById('edit-host-status').value,
            os: document.getElementById('edit-host-os').value,
            location: document.getElementById('edit-host-location').value
        };
    
        logToConsole(`Saving host ID: ${hostId}`);
    
        try {
            const response = await fetch(`/admin/hosts/update/${hostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hostData)
            });
    
            if (response.ok) {
                logToConsole(`Host ID: ${hostId} updated successfully.`);
                location.reload();
            } else {
                throw new Error('Failed to update host.');
            }
        } catch (error) {
            logToConsole(`Error: ${error.message}`);
        }
    });
    
    // Delete Host Func
    document.querySelectorAll('.delete-host').forEach(button => {
        button.addEventListener('click', async function() {
            const hostId = button.getAttribute('data-id');
            logToConsole(`Deleting host ID: ${hostId}`);
    
            try {
                const response = await fetch(`/admin/hosts/delete/${hostId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    logToConsole(`Host ID: ${hostId} deleted successfully.`);
                    location.reload();
                } else {
                    throw new Error('Failed to delete host.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

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

    // Add Schedule functionality
    document.getElementById('add-schedule-button').addEventListener('click', function () {
        const name = document.getElementById('edit-schedule-name').value.trim();
        const description = document.getElementById('edit-schedule-description').value.trim();
        const startDate = document.getElementById('edit-schedule-start').value.trim();
        const endDate = document.getElementById('edit-schedule-end').value.trim();
        const playlist = document.getElementById('edit-schedule-playlist').value.trim().split(',').map(id => new ObjectId(id));
        const shuffle = document.getElementById('edit-schedule-shuffle').checked;

        const newSchedule = { name, description, startDate, endDate, playlist, shuffle };

        fetch('/admin/schedules/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSchedule)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error); });
            }
        })
        .then(response => {
            console.log('Schedule added successfully!');
            console.log(response);
            location.reload();  // Reload the page to reflect the new schedule
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(document.querySelector('.add-schedule'), error.message);
        });
    });


    // Edit Schedule 
    document.querySelectorAll('.edit-schedule').forEach(button => {
        button.addEventListener('click', async function() {
            const scheduleId = button.getAttribute('data-id');
            logToConsole(`Editing schedule ID: ${scheduleId}`);
    
            try {
                const response = await fetch(`/admin/schedules/${scheduleId}`);
                if (response.ok) {
                    const scheduleData = await response.json();
                    populateScheduleForm(scheduleData);
                    logToConsole(JSON.stringify(scheduleData, null, 2)); // Convert object to string
                } else {
                    throw new Error('Failed to fetch schedule data.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

    // Save Edit Schedule
    document.getElementById('save-schedule-button').addEventListener('click', async function() {
        const scheduleId = document.getElementById('edit-schedule-id').value;
        const scheduleData = {
            name: document.getElementById('edit-schedule-name').value,
            description: document.getElementById('edit-schedule-description').value,
            startDate: document.getElementById('edit-schedule-start-date').value,
            endDate: document.getElementById('edit-schedule-end-date').value,
            shuffle: document.getElementById('edit-schedule-shuffle').checked
        };
    
        logToConsole(`Saving schedule ID: ${scheduleId}`);
    
        try {
            const response = await fetch(`/admin/schedules/update/${scheduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scheduleData)
            });
    
            if (response.ok) {
                logToConsole(`Schedule ID: ${scheduleId} updated successfully.`);
                location.reload();
            } else {
                throw new Error('Failed to update schedule.');
            }
        } catch (error) {
            logToConsole(`Error: ${error.message}`);
        }
    });
    
    // Delete Schedule
    document.querySelectorAll('.delete-schedule').forEach(button => {
        button.addEventListener('click', async function() {
            const scheduleId = button.getAttribute('data-id');
            logToConsole(`Deleting schedule ID: ${scheduleId}`);
    
            try {
                const response = await fetch(`/admin/schedules/delete/${scheduleId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    logToConsole(`Schedule ID: ${scheduleId} deleted successfully.`);
                    location.reload();
                } else {
                    throw new Error('Failed to delete schedule.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

    // Add Group functionality
    document.getElementById('add-group-button').addEventListener('click', function () {
        const name = document.getElementById('new-group-name').value.trim();
        const description = document.getElementById('new-group-description').value.trim();
        const members = document.getElementById('new-group-members').value.trim().split(',');

        const newGroup = { name, description, members };

        fetch('/admin/groups/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGroup)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error); });
            }
        })
        .then(response => {
            console.log('Group added successfully!');
            console.log(response);
            location.reload();  // Reload the page to reflect the new group
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(document.querySelector('.add-group'), error.message);
        });
    });

    // Edit Group
    document.querySelectorAll('.edit-group').forEach(button => {
        button.addEventListener('click', function () {
            const groupId = button.getAttribute('data-id');

            // Fetch existing group data
            fetch(`/admin/groups/${groupId}`)
                .then(response => response.json())
                .then(data => {
                    populateGroupForm(data);
                    document.querySelector('#edit-group-modal').style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        });
    });

    // Delete Group
    document.querySelectorAll('.delete-group').forEach(button => {
        button.addEventListener('click', async function() {
            const groupId = button.getAttribute('data-id');
            logToConsole(`Deleting group ID: ${groupId}`);
    
            try {
                const response = await fetch(`/admin/groups/delete/${groupId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    logToConsole(`Group ID: ${groupId} deleted successfully.`);
                    location.reload();
                } else {
                    throw new Error('Failed to delete group.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

    // Add Playlist functionality
    document.getElementById('add-playlist-button').addEventListener('click', function () {
        const name = document.getElementById('edit-playlist-name').value.trim();
        const description = document.getElementById('edit-playlist-description').value.trim();
        const content = document.getElementById('edit-playlist-content').value.trim().split(',');
        const createDate = new Date().toISOString(); // Get current timestamp in ISO format

        const newPlaylist = { name, description, content, createDate };

        fetch('/admin/playlists/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlaylist)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error); });
            }
        })
        .then(response => {
            console.log('Playlist added successfully!');
            console.log(response);
            location.reload();  // Reload the page to reflect the new playlist
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(document.querySelector('.add-playlist'), error.message);
        });
    });


    // Edit Playlist
    document.querySelectorAll('.edit-playlist').forEach(button => {
        button.addEventListener('click', async function() {
            const playlistId = button.getAttribute('data-id');
            logToConsole(`Editing playlist ID: ${playlistId}`);
    
            try {
                const response = await fetch(`/admin/playlists/${playlistId}`);
                if (response.ok) {
                    const playlistData = await response.json();
                    populatePlaylistForm(playlistData);
                    logToConsole(JSON.stringify(playlistData, null, 2)); // Convert object to string
                } else {
                    throw new Error('Failed to fetch playlist data.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

    // Save Edit Playlist
    document.getElementById('save-playlist-button').addEventListener('click', async function() {
        const playlistId = document.getElementById('edit-playlist-id').value;
        const playlistData = {
            name: document.getElementById('edit-playlist-name').value,
            description: document.getElementById('edit-playlist-description').value,
            content: document.getElementById('edit-playlist-content').value.trim().split(',')
        };
    
        logToConsole(`Saving playlist ID: ${playlistId}`);
    
        try {
            const response = await fetch(`/admin/playlists/update/${playlistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playlistData)
            });
    
            if (response.ok) {
                logToConsole(`Playlist ID: ${playlistId} updated successfully.`);
                location.reload();
            } else {
                throw new Error('Failed to update playlist.');
            }
        } catch (error) {
            logToConsole(`Error: ${error.message}`);
        }
    });

    // Delete Playlist
    document.querySelectorAll('.delete-playlist').forEach(button => {
        button.addEventListener('click', async function() {
            const playlistId = button.getAttribute('data-id');
            logToConsole(`Deleting playlist ID: ${playlistId}`);
    
            try {
                const response = await fetch(`/admin/playlists/delete/${playlistId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    logToConsole(`Playlist ID: ${playlistId} deleted successfully.`);
                    location.reload();
                } else {
                    throw new Error('Failed to delete playlist.');
                }
            } catch (error) {
                logToConsole(`Error: ${error.message}`);
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.kodi-Image').forEach(kodiImage => {
            kodiImage.addEventListener('click', () => {
                // Extract the host ID from the data-host-id attribute of the parent element
                const hostId = kodiImage.closest('.host-widget').getAttribute('data-host-id');
                console.log('Host ID:', hostId);
    
                // Send a POST request to take a screenshot
                fetch('/admin/ctrl/kodi/screenshot/' + hostId, {
                    method: 'POST'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to take screenshot');
                    }
                    console.log('Screenshot request successful');
                    return response.json();
                })
                .then(data => {
                    // Once the screenshot is taken, construct the URL for the latest screenshot
                    fetch(`/admin/ctrl/kodi/screenshot/latest/${hostId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to retrieve latest screenshot');
                            }
                            console.log('Latest screenshot request successful');
                            return response.json();
                        })
                        .then(screenshotData => {
                            console.log('Received screenshot data:', screenshotData);
                            const latestScreenshotNumber = screenshotData.latestScreenshotNumber;
                            const baseURL = `${window.location.protocol}//${window.location.host}`;
                            const screenshotURL = `${baseURL}/screenshots/${hostId}/screenshot${latestScreenshotNumber}.png`;
                            console.log(latestScreenshotNumber);
                            console.log(screenshotURL);
    
                            // Attempt to load the image with retries
                            const loadImageWithRetries = (retryCount) => {
                                if (retryCount <= 0) {
                                    // Retry limit reached, replace the original image
                                    console.error('Retry limit reached, replacing original image');
                                    kodiImage.src = 'original_image_url.jpg'; // Replace with the original image URL
                                    return;
                                }
    
                                const img = new Image();
                                img.onload = () => {
                                    // Image loaded successfully, update the src attribute
                                    kodiImage.src = screenshotURL;
                                };
                                img.onerror = () => {
                                    // Error loading image, retry after a short delay
                                    console.error(`Error loading image, retrying... (Attempts left: ${retryCount})`);
                                    setTimeout(() => loadImageWithRetries(retryCount - 1), 1000); // Retry after 1 second
                                };
                                img.src = screenshotURL; // Start loading the image
                            };
    
                            // Initial attempt to load the image with retries
                            loadImageWithRetries(5); // Retry 5 times
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        });
    });
    
    
    // Event listeners for Update buttons in the edit forms
    document.querySelector('#save-host-button').addEventListener('click', updateHost);
    document.querySelector('#save-schedule-button').addEventListener('click', updateSchedule);
    document.querySelector('#save-group-button').addEventListener('click', updateGroup);
    document.querySelector('#save-playlist-button').addEventListener('click', updatePlaylist);
    // document.querySelector('#save-contentitem-button').addEventListener('click', updateContentItem);
    
    // Screenshots
    document.querySelectorAll('.kodi-image').forEach(image => {
        image.addEventListener('click', function() {
            // Extract the host ID from the data-host-id attribute of the parent element
            const hostId = this.closest('.host-widget').getAttribute('data-host-id');
            // console.log('Host ID:', hostId);
    
            // Send a POST request to take a screenshot
            fetch('/admin/ctrl/kodi/screenshot/' + hostId, {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to take screenshot');
                }
                console.log('Screenshot request successful');
                return response.json();
            })
            .then(data => {
                // Once the screenshot is taken, construct the URL for the latest screenshot
                fetch(`/admin/ctrl/kodi/screenshot/latest/${hostId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to retrieve latest screenshot');
                        }
                        // console.log('Latest screenshot request successful');
                        return response.json();
                    })
                    .then(screenshotData => {
                        const latestScreenshotNumber = screenshotData.latestScreenshotNumber;
                        const baseURL = `${window.location.protocol}//${window.location.host}`;
                        const screenshotURL = `${baseURL}/screenshots/${hostId}/screenshot${latestScreenshotNumber}.png`;
                        // console.log(latestScreenshotNumber);
                        // console.log(screenshotURL);
    
                        // Attempt to load the image with retries
                        const loadImageWithRetries = (retryCount) => {
                            if (retryCount <= 0) {
                                // Retry limit reached, replace the original image
                                console.error('Retry limit reached, replacing original image');
                                image.src = '/static/img/kodi.png'; // Replace with the original image URL
                                return;
                            }
    
                            const img = new Image();
                            img.onload = () => {
                                // Image loaded successfully, update the src attribute
                                image.src = screenshotURL;
                                // Reset the image back to default after 10 seconds
                                setTimeout(() => {
                                    image.src = '/static/img/kodi.png'; // Replace with the original image URL
                                }, 10000); // 10 seconds delay
                            };
                            img.onerror = () => {
                                // Error loading image, retry after a short delay
                                console.error(`Error loading image, retrying... (Attempts left: ${retryCount})`);
                                setTimeout(() => loadImageWithRetries(retryCount - 1), 1000); // Retry after 1 second
                            };
                            img.src = screenshotURL; // Start loading the image
                        };
    
                        // Initial attempt to load the image with retries
                        loadImageWithRetries(5); // Retry 5 times
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
    
    
    
});


setInterval(checkHostStatuses, 300000); // Check every 5 minutes
checkHostStatuses(); // Initial check

function checkHostStatuses() {
    let callCount = 0; // Counter to track the number of calls made

    // Function to fetch host statuses and update the UI
    const fetchHostStatuses = () => {
        fetch('/admin/host_status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const statuses = data;  // Assuming the data is an array of status objects
            statuses.forEach(status => {
                const widget = document.querySelector(`.host-widget[data-host-id="${status.host_id}"]`);
                if (widget) {
                    // Update the host status display
                    const statusElement = widget.querySelector('.host-status');
                    if (statusElement) {
                        statusElement.textContent = `Status: ${status.status}`;
                    }
                    
                    // Update the currently playing media display
                    const playingElement = widget.querySelector('.host-playing');
                    if (playingElement) {
                        playingElement.textContent = `Now Playing: ${status.playing}`;
                    }
                }
            });
            callCount++; // Increment the call count after each successful call

            // Check if the call count has reached the limit of 3
            if (callCount < 3) {
                // Schedule the next fetch after 5 seconds
                setTimeout(fetchHostStatuses, 5000);
            }
        })
        .catch(error => {
            logToConsole(`Error checking host statuses: ${error.message}`);
            callCount++; // Increment the call count even if an error occurs
            // Check if the call count has reached the limit of 3
            if (callCount < 3) {
                // Schedule the next fetch after 5 seconds
                setTimeout(fetchHostStatuses, 5000);
            }
        });
    };

    // Initial call to fetch host statuses
    fetchHostStatuses();
}


function postImageUrl(hostId, imageUrl) {
    console.log(`Sending Image URL: ${imageUrl} to host ID: ${hostId}`);
    fetch(`/ctrl/image/hosts/${hostId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_url: imageUrl })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .then(response => {
        console.log('Image URL sent successfully!');
        console.log(response);
        checkHostStatuses();
    })
    .catch(error => {
        console.error('Error:', error);
        const widget = document.querySelector(`.host-widget[data-host-id="${hostId}"]`);
        displayError(widget, error.message);
    });
}

function postYouTubeUrl(hostId, youtubeUrl) {
    console.log(`Sending YouTube URL: ${youtubeUrl} to host ID: ${hostId}`);
    fetch(`/ctrl/youtube/hosts/${hostId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtube_url: youtubeUrl })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .then(response => {
        console.log('YouTube video sent successfully!');
        console.log(response);
        checkHostStatuses();
    })
    .catch(error => {
        console.error('Error:', error);
        const widget = document.querySelector(`.host-widget[data-host-id="${hostId}"]`);
        displayError(widget, error.message);
    });
}

function postNotification(hostId, headline, message, duration, image) {
    console.log(`Sending notification to host ID: ${hostId}`);
    fetch(`/ctrl/notify/hosts/${hostId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ headline, message, duration, image })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .then(response => {
        console.log('Notification sent successfully!');
        console.log(response);
    })
    .catch(error => {
        console.error('Error:', error);
        const widget = document.querySelector(`.host-widget[data-host-id="${hostId}"]`);
        displayError(widget, error.message);
    });
}

function stopPlayback(hostId) {
    console.log(`Sending stop command to host ID: ${hostId}`);
    fetch(`/ctrl/stop/${hostId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .then(response => {
        console.log('Stop command sent successfully!');
        console.log(response);
        checkHostStatuses();
    })
    .catch(error => {
        console.error('Error:', error);
        const widget = document.querySelector(`.host-widget[data-host-id="${hostId}"]`);
        displayError(widget, error.message);
    });
}

function displayError(widget, message) {
    let errorDiv = widget.querySelector('.error-message');
    
    // If there's no existing error message div, create one
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        widget.appendChild(errorDiv);
    }

    errorDiv.textContent = message;

    // Optionally, remove the error message after a certain time
    setTimeout(() => {
        errorDiv.textContent = '';
    }, 3500);  // Adjust the time as needed
}


// Function to append messages to the console output textarea
function logToConsole(message) {
    const consoleOutput = document.getElementById('console-output');
    consoleOutput.value += message + '\n';
    consoleOutput.scrollTop = consoleOutput.scrollHeight;  // Auto-scroll to the bottom
}

// Override the default console.log function
const originalConsoleLog = console.log;
console.log = function(message) {
    originalConsoleLog(message);
    if (typeof message === 'object') {
        if (message.message) {
            logToConsole(message.message);
        } else {
            logToConsole(JSON.stringify(message, null, 2));  // Pretty-print JSON objects
        }
    } else {
        logToConsole(message);
    }
}

function populateHostForm(data) {
    const idField = document.getElementById('edit-host-id');
    const nameField = document.getElementById('edit-host-name');
    const ipField = document.getElementById('edit-host-ip');
    const portField = document.getElementById('edit-host-port');
    const usernameField = document.getElementById('edit-host-username');
    const passwordField = document.getElementById('edit-host-password');
    const groupField = document.getElementById('edit-host-group');
    const cecField = document.getElementById('edit-host-cec');
    const statusField = document.getElementById('edit-host-status');
    const osField = document.getElementById('edit-host-os');
    const locationField = document.getElementById('edit-host-location');

    if (idField) idField.value = data._id.$oid;
    if (nameField) nameField.value = data.name;
    if (ipField) ipField.value = data.ip;
    if (portField) portField.value = data.port;
    if (usernameField) usernameField.value = data.username;
    if (passwordField) passwordField.value = data.password;
    if (groupField) groupField.value = data.group;
    if (cecField) cecField.value = data.cec;
    if (statusField) statusField.value = data.status;
    if (osField) osField.value = data.os;
    if (locationField) locationField.value = data.location;

    logToConsole('Populating host form with data:');
    logToConsole(`ID: ${data._id.$oid}, Name: ${data.name}, IP: ${data.ip}, Port: ${data.port}`);
}



function updateHost() {
    const hostId = document.querySelector('#edit-host-id').value;

    const updatedHostData = {
        name: document.querySelector('#edit-host-name').value,
        ip: document.querySelector('#edit-host-ip').value,
        port: document.querySelector('#edit-host-port').value,
        username: document.querySelector('#edit-host-username').value,
        password: document.querySelector('#edit-host-password').value,
        //group: document.querySelector('#edit-host-group').value || null,
        cec: document.querySelector('#edit-host-cec').value,
        status: document.querySelector('#edit-host-status').value,
        schedule: document.querySelector('#edit-host-schedule').value,
        os: document.querySelector('#edit-host-os').value,
        location: document.querySelector('#edit-host-location').value
    };

    fetch(`/admin/hosts/update/${hostId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedHostData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update host');
        }
    })
    .then(data => {
        console.log('Host updated successfully:', data);
        document.querySelector('#edit-host-modal').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}


function populateScheduleForm(data) {
    document.querySelector('#edit-schedule-id').value = data.id;
    document.querySelector('#edit-schedule-name').value = data.name;
    document.querySelector('#edit-schedule-description').value = data.description;
    document.querySelector('#edit-schedule-start-date').value = data.startDate;
    document.querySelector('#edit-schedule-end-date').value = data.endDate;
    document.querySelector('#edit-schedule-shuffle').checked = data.shuffle;
}

function updateSchedule() {
    const scheduleId = document.querySelector('#edit-schedule-id').value;

    const updatedScheduleData = {
        name: document.querySelector('#edit-schedule-name').value,
        description: document.querySelector('#edit-schedule-description').value,
        startDate: document.querySelector('#edit-schedule-start-date').value,
        endDate: document.querySelector('#edit-schedule-end-date').value,
        shuffle: document.querySelector('#edit-schedule-shuffle').checked
    };

    fetch(`/schedules/update/${scheduleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedScheduleData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update schedule');
        }
    })
    .then(data => {
        console.log('Schedule updated successfully:', data);
        document.querySelector('#edit-schedule-modal').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function populateGroupForm(data) {
    document.querySelector('#edit-group-id').value = data.id;
    document.querySelector('#edit-group-name').value = data.name;
    document.querySelector('#edit-group-description').value = data.description;
}

function updateGroup() {
    const groupId = document.querySelector('#edit-group-id').value;

    const updatedGroupData = {
        name: document.querySelector('#edit-group-name').value,
        description: document.querySelector('#edit-group-description').value,
        members: Array.from(document.querySelectorAll('#edit-group-members option:checked')).map(option => option.value)
    };

    fetch(`/groups/update/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGroupData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update group');
        }
    })
    .then(data => {
        console.log('Group updated successfully:', data);
        document.querySelector('#edit-group-modal').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function populatePlaylistForm(data) {
    document.querySelector('#edit-playlist-id').value = data.id;
    document.querySelector('#edit-playlist-name').value = data.name;
    document.querySelector('#edit-playlist-description').value = data.description;
    document.querySelector('#edit-playlist-create-date').value = data.createDate;
}

function updatePlaylist() {
    const playlistId = document.querySelector('#edit-playlist-id').value;

    const updatedPlaylistData = {
        name: document.querySelector('#edit-playlist-name').value,
        description: document.querySelector('#edit-playlist-description').value,
        createDate: document.querySelector('#edit-playlist-create-date').value,
        content: Array.from(document.querySelectorAll('#edit-playlist-content option:checked')).map(option => option.value)
    };

    fetch(`/playlists/update/${playlistId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlaylistData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update playlist');
        }
    })
    .then(data => {
        console.log('Playlist updated successfully:', data);
        document.querySelector('#edit-playlist-modal').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function populateContentItemForm(data) {
    document.querySelector('#edit-contentitem-id').value = data.id;
    document.querySelector('#edit-contentitem-player').value = data.player;
    document.querySelector('#edit-contentitem-path').value = data.path;
    document.querySelector('#edit-contentitem-url').value = data.url;
}

function updateContentItem() {
    const contentItemId = document.querySelector('#edit-contentitem-id').value;

    const updatedContentItemData = {
        player: document.querySelector('#edit-contentitem-player').value,
        path: document.querySelector('#edit-contentitem-path').value,
        url: document.querySelector('#edit-contentitem-url').value
    };

    fetch(`/contentitems/update/${contentItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContentItemData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update content item');
        }
    })
    .then(data => {
        console.log('Content item updated successfully:', data);
        document.querySelector('#edit-contentitem-modal').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function populateMediaForm(data) {
    const idField = document.getElementById('edit-media-id');
    const nameField = document.getElementById('edit-media-name');
    const descriptionField = document.getElementById('edit-media-description');
    const typeField = document.getElementById('edit-media-type');
    const pathField = document.getElementById('edit-media-path');
    const urlField = document.getElementById('edit-media-url');

    if (idField) idField.value = data._id.$oid;
    if (nameField) nameField.value = data.name;
    if (descriptionField) descriptionField.value = data.description || ''; // Handle possible undefined values
    if (typeField) typeField.value = data.type;
    if (pathField) pathField.value = data.path || ''; // Handle possible undefined values
    if (urlField) urlField.value = data.url || '';

    logToConsole('Populating media form with data:');
    logToConsole(`ID: ${data._id.$oid}, Name: ${data.name}, Type: ${data.type}, Path: ${data.path}, URL: ${data.url}`);
}

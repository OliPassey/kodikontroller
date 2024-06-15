document.addEventListener('DOMContentLoaded', function () {

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

    // Event listeners for Update buttons in the edit forms
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

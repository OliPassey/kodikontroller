// Existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    console.log('Connecting Console...');
    console.log('Kodi Kontroller v4 has loaded');

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
        const name = document.getElementById('new-host-name').value.trim();
        const ip = document.getElementById('new-host-ip').value.trim();
        const port = parseInt(document.getElementById('new-host-port').value, 10);
        const username = document.getElementById('new-host-username').value.trim();
        const password = document.getElementById('new-host-password').value.trim();
        const group = document.getElementById('new-host-group').value.trim();
        const cec = document.getElementById('new-host-cec').value.trim();
        const status = document.getElementById('new-host-status').value.trim();
        const os = document.getElementById('new-host-os').value.trim();
        const location = document.getElementById('new-host-location').value.trim();

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

    // Add Media functionality
    document.getElementById('add-media-button').addEventListener('click', function () {
        const name = document.getElementById('new-media-name').value.trim();
        const description = document.getElementById('new-media-description').value.trim();
        const type = document.getElementById('new-media-type').value.trim();
        const path = document.getElementById('new-media-path').value.trim();
        const url = document.getElementById('new-media-url').value.trim();

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

    // Add Schedule functionality
    document.getElementById('add-schedule-button').addEventListener('click', function () {
        const name = document.getElementById('new-schedule-name').value.trim();
        const description = document.getElementById('new-schedule-description').value.trim();
        const startDate = document.getElementById('new-schedule-start').value.trim();
        const endDate = document.getElementById('new-schedule-end').value.trim();
        const playlist = document.getElementById('new-schedule-playlist').value.trim().split(',');
        const shuffle = document.getElementById('new-schedule-shuffle').checked;

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

    // Add Playlist functionality
    document.getElementById('add-playlist-button').addEventListener('click', function () {
        const name = document.getElementById('new-playlist-name').value.trim();
        const description = document.getElementById('new-playlist-description').value.trim();
        const content = document.getElementById('new-playlist-content').value.trim().split(',');

        const newPlaylist = { name, description, content };

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
});
setInterval(checkHostStatuses, 300000); // Check every 5 minutes
checkHostStatuses(); // Initial check

function checkHostStatuses() {
    fetch('/admin/hosts/check_status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statuses = data.host_statuses;
        statuses.forEach(status => {
            const widget = document.querySelector(`.host-widget[data-host-id="${status.id}"]`);
            if (widget) {
                widget.querySelector('.host-status').textContent = status.status;
            }
        });
        logToConsole('Host statuses updated');
    })
    .catch(error => {
        logToConsole(`Error checking host statuses: ${error.message}`);
    });
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
    })
    .catch(error => {
        console.error('Error:', error);
        const widget = document.querySelector(`.host-widget[data-host-id="${hostId}"]`);
        displayError(widget, error.message);
    });
}

function displayError(widget, message) {
    const errorDiv = widget.querySelector('.error-message');
    errorDiv.textContent = message;
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
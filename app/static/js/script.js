document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded!');

    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function () {
            const widget = button.closest('.host-widget');
            const hostId = widget.getAttribute('data-host-id');
            const input = widget.querySelector('.youtube-url-input');
            const youtubeUrl = input.value.trim();

            if (youtubeUrl) {
                postYouTubeUrl(hostId, youtubeUrl);
            } else {
                alert('Please enter a valid YouTube URL.');
            }
        });
    });

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
                alert('Please enter both a headline and a message for the notification.');
            }
        });
    });
});

function postYouTubeUrl(hostId, youtubeUrl) {
    console.log(`Sending YouTube URL: ${youtubeUrl} to host ID: ${hostId}`);
    fetch(`/youtube/hosts/${hostId}`, {
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
        // alert('YouTube video sent successfully!');
        console.log(response);
    })
    .catch(error => {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    });
}

function postNotification(hostId, headline, message, duration, image) {
    console.log(`Sending notification to host ID: ${hostId}`);
    fetch(`/notify/hosts/${hostId}`, {
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
        // alert('Notification sent successfully!');
        console.log(response);
    })
    .catch(error => {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    });
}

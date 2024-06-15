document.addEventListener('DOMContentLoaded', function () {
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
});
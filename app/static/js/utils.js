// utils.js

export function fetchData(url, options) {
    return fetch(url, options)
        .then(response => response.ok ? response.json() : response.json().then(err => { throw new Error(err.error); }));
}

export function handleFetchError(error, element) {
    console.error('Error:', error);
    if (element) {
        displayError(element, error.message);
    }
}

export function addEventListenerToSelector(selector, event, handler) {
    document.querySelectorAll(selector).forEach(element => element.addEventListener(event, handler));
}

// Load Media from DB into Front-End Host Controls
document.addEventListener('DOMContentLoaded', function () {
    // Fetch YouTube media
    fetchData('/admin/media/youtube')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const youtubeSelect = widget.querySelector('.youtube-media-select');
                youtubeSelect.innerHTML = '<option value="">Select a YouTube video</option>';
                if (data.length === 0) {
                    youtubeSelect.innerHTML = '<option value="">No media found</option>';
                } else {
                    data.forEach(media => {
                        const option = new Option(media.name, media.url);
                        youtubeSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => handleFetchError(error, document.querySelector('#error-container'))); // Assuming there is an error display container

    // Similar fetch for Video media
    fetchData('/admin/media/video')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const videoSelect = widget.querySelector('.play-video-select');
                videoSelect.innerHTML = '<option value="">Select a video</option>';
                if (data.length === 0) {
                    videoSelect.innerHTML = '<option value="">No media found</option>';
                } else {
                    data.forEach(media => {
                        const option = new Option(media.name, media.url);
                        videoSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => handleFetchError(error, document.querySelector('#error-container')));

    // Similar fetch for Audio media
    fetchData('/admin/media/audio')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const audioSelect = widget.querySelector('.play-audio-input');
                audioSelect.innerHTML = '<option value="">Select an audio file</option>';
                if (data.length === 0) {
                    audioSelect.innerHTML = '<option value="">No media found</option>';
                } else {
                    data.forEach(media => {
                        const option = new Option(media.name, media.url);
                        audioSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => handleFetchError(error, document.querySelector('#error-container')));

    // Fetch for Image media
    fetchData('/admin/media/image')
        .then(data => {
            document.querySelectorAll('.host-widget').forEach(widget => {
                const imageSelect = widget.querySelector('.image-select-input');
                imageSelect.innerHTML = '<option value="">Select an image</option>';
                if (data.length === 0) {
                    imageSelect.innerHTML = '<option value="">No media found</option>';
                } else {
                    data.forEach(media => {
                        const option = new Option(media.name, media.url);
                        imageSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Error loading YouTube media:', error));
});


// Show Hide Host Sections
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', function() {
            // Get the target class from the button's data-target attribute
            const targetClass = this.getAttribute('data-target');
            // Ensure the class name is correct (adding '.' only if not using IDs)
            const selector = targetClass.startsWith('#') ? targetClass : '.' + targetClass;
            // Find the closest host-widget parent to ensure we're only toggling within the same widget
            const hostWidget = this.closest('.host-widget');
            // Find the target section within this host widget using the class obtained from data-target
            const targetSection = hostWidget.querySelector(selector);

            if (targetSection) {
                // Toggle the 'hidden' class to show/hide the section
                targetSection.classList.toggle('hidden');
                // Update the button text based on visibility
                if (targetSection.classList.contains('hidden')) {
                    this.textContent = "Show " + this.textContent.split(' ')[1];
                } else {
                    this.textContent = "Hide " + this.textContent.split(' ')[1];
                }
            }
        });
    });
});




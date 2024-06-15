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

document.addEventListener('DOMContentLoaded', function () {
    console.log('Connecting Console...');
    console.log('Kodi Kontroller v4 has loaded');

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
        .catch(error => handleFetchError(error));

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

});
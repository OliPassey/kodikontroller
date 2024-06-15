// hosts.js
import { fetchData, handleFetchError, addEventListenerToSelector } from './utils.js';

// Add Host functionality
document.getElementById('add-host-button').addEventListener('click', function () {
    const name = document.getElementById('new-host-name').value.trim();
    const ip = document.getElementById('new-host-ip').value.trim();
    
    const newHost = { name, ip };

    fetchData('/admin/hosts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHost)
    })
    .then(response => {
        console.log('Host added successfully!');
        console.log(response);
        location.reload();  // Reload the page to reflect the new host
    })
    .catch(error => handleFetchError(error, document.querySelector('.add-host')));
});

// Edit Host functionality
addEventListenerToSelector('.edit-host', 'click', function () {
    const hostId = this.getAttribute('data-id');

    fetchData(`/admin/hosts/${hostId}`)
        .then(data => {
            populateHostForm(data);
            document.querySelector('#edit-host-modal').style.display = 'block';
        })
        .catch(error => handleFetchError(error));
});

// Delete Host functionality
addEventListenerToSelector('.delete-host', 'click', async function() {
    const hostId = this.getAttribute('data-id');
    logToConsole(`Deleting host ID: ${hostId}`);

    try {
        const response = await fetchData(`/admin/hosts/delete/${hostId}`, { method: 'DELETE' });
        logToConsole(`Host ID: ${hostId} deleted successfully.`);
        location.reload();
    } catch (error) {
        logToConsole(`Error: ${error.message}`);
    }
});

document.querySelector('#save-host-button').addEventListener('click', updateHost);
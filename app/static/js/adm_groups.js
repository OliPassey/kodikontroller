// groups.js
import { fetchData, handleFetchError, addEventListenerToSelector } from './utils.js';

// Add Group functionality
document.getElementById('add-group-button').addEventListener('click', function () {
    const name = document.getElementById('new-group-name').value.trim();
    const description = document.getElementById('new-group-description').value.trim();
    const members = document.getElementById('new-group-members').value.trim().split(',');

    const newGroup = { name, description, members };

    fetchData('/admin/groups/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
    })
    .then(response => {
        console.log('Group added successfully!');
        console.log(response);
        location.reload();  // Reload the page to reflect the new group
    })
    .catch(error => handleFetchError(error, document.querySelector('.add-group')));
});

// Edit Group functionality
addEventListenerToSelector('.edit-group', 'click', function () {
    const groupId = this.getAttribute('data-id');

    fetchData(`/admin/groups/${groupId}`)
        .then(data => {
            populateGroupForm(data);
            document.querySelector('#edit-group-modal').style.display = 'block';
        })
        .catch(error => handleFetchError(error));
});

// Delete Group functionality
addEventListenerToSelector('.delete-group', 'click', async function() {
    const groupId = this.getAttribute('data-id');
    logToConsole(`Deleting group ID: ${groupId}`);

    try {
        const response = await fetchData(`/admin/groups/delete/${groupId}`, { method: 'DELETE' });
        logToConsole(`Group ID: ${groupId} deleted successfully.`);
        location.reload();
    } catch (error) {
        logToConsole(`Error: ${error.message}`);
    }
});

document.querySelector('#save-group-button').addEventListener('click', updateGroup);
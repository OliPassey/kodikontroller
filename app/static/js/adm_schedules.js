import { fetchData, handleFetchError, addEventListenerToSelector } from './utils.js';
document.addEventListener('DOMContentLoaded', function () {

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
});
document.querySelector('#save-schedule-button').addEventListener('click', updateSchedule);
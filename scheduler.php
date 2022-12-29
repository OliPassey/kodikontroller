<?php
// Include the necessary libraries and dependencies
include 'kodi-api.php';
include 'youtube-api.php';

// Define the array of Kodi endpoints
// Read the JSON data from the file
$json = file_get_contents('kodi_endpoints.json');
$kodi_endpoints = json_decode($json, true);

// Loop through the array of endpoints and create the KodiAPI objects
foreach ($kodi_endpoints as $name => $endpoint) {
  $kodi_endpoints[$name] = new KodiAPI('http://' . $endpoint['username'] . ':' . $endpoint['password'] . '@' . $endpoint['host'] . ':' . $endpoint['port'] . '/jsonrpc');
}

// Check if the form has been submitted
if (isset($_POST['content_type']) && isset($_POST['content_url']) && isset($_POST['kodi_endpoint']) && isset($_POST['start_date']) && isset($_POST['start_time'])) {
  // Build the scheduled content array
  $scheduled_content = [
    'content_type' => $_POST['content_type'],
    'content_url' => $_POST['content_url'],
    'display_duration' => (int)$_POST['display_duration'],
    'kodi_endpoint' => $_POST['kodi_endpoint'],
    'start_date' => $_POST['start_date'] . ' ' . $_POST['start_time'],
    'end_date' => $_POST['end_date'] . ' ' . $_POST['end_time']
  ];

  // Add the scheduled content to the JSON file
  $scheduled_content_json = file_get_contents('scheduled_content.json');
  $scheduled_content_array = json_decode($scheduled_content_json, true);
  $scheduled_content_array[] = $scheduled_content;
  file_put_contents('scheduled_content.json', json_encode($scheduled_content_array));

  // Redirect back to the form
  header('Location: scheduler.php');
  exit;
}

// Display the GUI form for scheduling content
echo '
<html>
<head>
<title>Content Scheduler</title>
  <style>
    body {
      background-color: #333;
      color: #fff;
      }
    
    .form-section {
      width: 45%;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <h1>Content Scheduler</h1>
  <form action="scheduler.php" method="post">
    <div class="form-section">
      <h2>Scheduled Content</h2>
      <label for="content_type">Content Type:</label>
      <select name="content_type" id="content_type">
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="youtube">YouTube</option>
      </select>
      <label for="content_url">Content URL:</label>
      <input type="text" name="content_url" id="content_url" required>
      <label for="display_duration" id="display_duration_label">Display Duration (seconds):</label>
      <input type="number" name="display_duration" id="display_duration" min="1" required>
      <label for="kodi_endpoint">Kodi Endpoint:</label>
      <select name="kodi_endpoint" id="kodi_endpoint">';

// Loop through the array of Kodi endpoints and display them as options
foreach ($kodi_endpoints as $name => $endpoint) {
  echo '<option value="' . $name . '">' . $name . '</option>';
}

echo '
      </select>
      <label for="start_date">Start Date:</label>
      <input type="date" name="start_date" id="start_date" required>
      <label for="start_time">Start Time:</label>
      <input type="time" name="start_time" id="start_time" required>
      <label for="end_date">End Date:</label>
      <input type="date" name="end_date" id="end_date" required>
      <label for="end_time">End Time:</label>
      <input type="time" name="end_time" id="end_time" required>
      <input type="submit" value="Schedule">
    </div>
  </form>
</body>
</html>';
// Read the scheduled content JSON file
$scheduled_content_json = file_get_contents('scheduled_content.json');
$scheduled_content_array = json_decode($scheduled_content_json, true);
// Check if there are any scheduled content items
if (count($scheduled_content_array) > 0) {
  // Display the table of scheduled content items
  echo '<h2>Current Scheduled Content</h2>';
  echo '<table>';
  echo '<tr>';
  echo '<th>Content Type</th>';
  echo '<th>Content URL</th>';
  echo '<th>Display Duration</th>';
  echo '<th>Kodi Endpoint</th>';
  echo '<th>Start Date</th>';
  echo '<th>End Date</th>';
  echo '<th>Action</th>';
  echo '</tr>';

  // Loop through the scheduled content items
  foreach ($scheduled_content_array as $index => $scheduled_content) {
    echo '<tr>';
    echo '<td>' . $scheduled_content['content_type'] . '</td>';
    echo '<td>' . $scheduled_content['content_url'] . '</td>';
    echo '<td>' . $scheduled_content['display_duration'] . '</td>';
    echo '<td>' . $scheduled_content['kodi_endpoint'] . '</td>';
    echo '<td>' . $scheduled_content['start_date'] . '</td>';
    echo '<td>' . $scheduled_content['end_date'] . '</td>';
    echo '<td><a href="scheduler.php?delete=' . $index . '">Delete</a></td>';
    echo '</tr>';
  }
  echo '</table>';
} else {
  // Display a message if there are no scheduled content items
  echo '<p>There are no scheduled content items.</p>';
}

// Check if the delete parameter is set in the query string
if (isset($_GET['delete'])) {
  // Delete the scheduled content item from the array
  unset($scheduled_content_array[$_GET['delete']]);
  // Update the JSON file with the modified array
  file_put_contents('scheduled_content.json', json_encode($scheduled_content_array));
  // Redirect back to the page to refresh the display
  header('Location: scheduler.php');
  exit;
}

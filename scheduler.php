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

// Check if there is any scheduled content that needs to be played
$scheduled_content_json = file_get_contents('scheduled_content.json');
$scheduled_content_array = json_decode($scheduled_content_json, true);

foreach ($scheduled_content_array as $index => $scheduled_content) {
  // Check if the current time is within the start and end dates
  $current_time = new DateTime('now');
  $start_time = new DateTime($scheduled_content['start_date']);
  $end_time = new DateTime($scheduled_content['end_date']);

  if ($current_time >= $start_time && $current_time <= $end_time) {
    // Connect to the Kodi API endpoint
    $kodi = $kodi_endpoints[$scheduled_content['kodi_endpoint']];

    // Check the content type
    if ($scheduled_content['content_type'] == 'image') {
      // Display the image on Kodi
      $kodi->GUI->ShowPicture(['picture' => $scheduled_content['content_url'], 'displaytime' => $scheduled_content['display_duration']]);
    } elseif ($scheduled_content['content_type'] == 'video') {
      // Play the video on Kodi
      $kodi->Player->Open(['item' => ['file' => $scheduled_content['content_url']]]);
    } elseif ($scheduled_content['content_type'] == 'youtube') {
      // Extract the video ID from the URL
      $video_id = youtube_extract_video_id($scheduled_content['content_url']);

      // Check if the video ID is valid
      if ($video_id !== false) {
        // Play the YouTube video on Kodi
        $kodi->Player->Open(['item' => ['file' => 'plugin://plugin.video.youtube/?action=play_video&videoid=' . $video_id]]);
      }
    }

    // Remove the scheduled content from the JSON file
    unset($scheduled_content_array[$index]);
    file_put_contents('scheduled_content.json', json_encode($scheduled_content_array));
  }
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

   




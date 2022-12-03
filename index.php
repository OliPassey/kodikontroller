<?php
// Include the necessary libraries and dependencies
include 'kodi-api.php';
include 'youtube-api.php';

// Define the array of Kodi endpoints
$kodi_endpoints = array(
  'Office' => new KodiAPI('http://kodi:Southpark6279@10.0.0.7:8080/jsonrpc'),
  'Bedroom' => new KodiAPI('http://kodi:Southpark6279@10.0.0.170:8080/jsonrpc')
);




// Check if a YouTube URL was submitted
if (isset($_POST['youtube_url']) && isset($_POST['kodi_endpoint'])) {
  // Extract the video ID from the URL
  $video_id = youtube_extract_video_id($_POST['youtube_url']);

  // Check if the video ID is valid
  if ($video_id !== false) {
    // Connect to the selected Kodi API endpoint
    $kodi = $kodi_endpoints[$_POST['kodi_endpoint']];

    // Play the YouTube video on Kodi
    $kodi->Player->Open(['item' => ['file' => 'plugin://plugin.video.youtube/?action=play_video&videoid=' . $video_id]]);
  }

  // Check if a notification message was submitted
  if (isset($_POST['notification_message']) && isset($_POST['kodi_endpoint'])) {
    // Connect to the selected Kodi API endpoint
    $kodi = $kodi_endpoints[$_POST['kodi_endpoint']];

    // Send the notification to Kodi
    $kodi->GUI->ShowNotification(['title' => 'New Notification', 'message' => $_POST['notification_message']]);
  }
}

// Check if the "Stop Playback" button was clicked
if (isset($_POST['stop_playback'])) {
  // Loop through all Kodi endpoints
  foreach ($kodi_endpoints as $kodi_endpoint) {
    // Stop playback on the current Kodi endpoint
    $kodi_endpoint->Player->Stop();
  }
}


// Display the GUI form for controlling Kodi
echo '
<html>
<head>
<title>KodiKontroller</title>
  <style>
    body {
      background-color: #333;
      color: #fff;
      }
    
    .youtube-section, .notification-section {
      width: 45%;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: none;
      color: #333;
      background-color: #fff;
    }

    input[type="submit"] {
      background-color: #333;
      color: #fff;
      cursor: pointer;
    }
  </style>
</head>
<body>
<header>
  <h1>KodiKontroller</h1>
</header>
<form action="" method="post">
  <label>YouTube URL:</label>
  <input type="text" name="youtube_url" />

  <label>Notification Message:</label>
  <input type="text" name="notification_message" />

  <label>Kodi Endpoint:</label>
  <select name="kodi_endpoint">
  <option value="Office">Office</option>
  <option value="Bedroom">Bedroom</option>
</select>

<input type="submit" value="Play on Kodi" />
<input type="submit" value="Send Notification" />
</form>
<p>
<input type="submit" name="stop_playback" value="Stop Playback" />
</body>
</html>

';


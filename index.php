<?php
// Include the necessary libraries and dependencies
include 'kodi-api.php';
include 'youtube-api.php';

// Connect to the Kodi API
$kodi = new KodiAPI('http://kodi:Southpark6279@10.0.0.7:8080/jsonrpc');

// Check if a YouTube URL was submitted
if (isset($_POST['youtube_url'])) {
  // Extract the video ID from the URL
  $video_id = youtube_extract_video_id($_POST['youtube_url']);

  // Play the YouTube video on Kodi
  $kodi->Player->Open(['item' => ['file' => 'plugin://plugin.video.youtube/?action=play_video&videoid=' . $video_id]]);
}

// Check if a notification message was submitted
if (isset($_POST['notification_message'])) {
  // Send the notification to Kodi
  $kodi->GUI->ShowNotification(['title' => 'New Notification', 'message' => $_POST['notification_message']]);
}

// Display the GUI form for controlling Kodi
echo '
<html>
<head>
  <style>
    body {
      background-color: #333;
      color: #fff;
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
  <form action="" method="post">
    <label>YouTube URL:</label>
    <input type="text" name="youtube_url" />
    <input type="submit" value="Play on Kodi" />

    <label>Notification Message:</label>
    <input type="text" name="notification_message" />
    <input type="submit" value="Send Notification" />
  </form>
</body>
</html>
';

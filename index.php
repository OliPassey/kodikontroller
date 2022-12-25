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
if (isset($_POST['stop_playback']) && $_POST['stop_playback'] == "Stop Playback") {
  // Loop through all Kodi endpoints
  foreach ($kodi_endpoints as $kodi_endpoint) {
    // Get the active players for the current Kodi endpoint
    $active_players = $kodi_endpoint->GetActivePlayers();

    // Check if there are any active players
    if (!empty($active_players)) {
      // Loop through the active players
      foreach ($active_players as $player) {
        // Stop playback on the current player
        $kodi_endpoint->Player->Stop(['playerid' => $player['playerid']]);
      }
    }
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

    <!-- HTML !-->
    <button class="input" role="button">Button 5</button>
    
    /* CSS */
    .input {
      align-items: center;
      background-clip: padding-box;
      background-color: #fa6400;
      border: 1px solid transparent;
      border-radius: .25rem;
      box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
      box-sizing: border-box;
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
      font-size: 16px;
      font-weight: 600;
      justify-content: center;
      line-height: 1.25;
      margin: 0;
      min-height: 3rem;
      padding: calc(.875rem - 1px) calc(1.5rem - 1px);
      position: relative;
      text-decoration: none;
      transition: all 250ms;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      vertical-align: baseline;
      width: auto;
    }
    
    .input:hover,
    .input:focus {
      background-color: #fb8332;
      box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
    
    .input:hover {
      transform: translateY(-1px);
    }
    
    .input:active {
      background-color: #c85000;
      box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
      transform: translateY(0);
    }

    input[type="submit"] {
      background-color: #0067a9;
      color: #fff;
      cursor: pointer;
      border-radius: 3px;
      height: 31px;
      width: 130px;
    }
  </style>
</head>
<body>
<header>
  <img src="https://github.com/OliPassey/kodikontroller/raw/master/logo.PNG" height=120px>
</header>

<form action="" method="post">
    <h4>Usage: Enter a YouTube URL or Message to be sent, select your endpoint, and click the appropriate button</h4>
  <label>YouTube URL:</label>
  <input type="text" name="youtube_url" />

  <label>Notification Message:</label>
  <input type="text" name="notification_message" />

  <label>Kodi Endpoint:</label>
  <select name="kodi_endpoint">
  <option value="Office">Office</option>
  <option value="Bedroom">Bedroom</option>
</select>
<p>
<input type="submit" value="Play on Kodi" />
<input type="submit" value="Send Notification" />

</form>
<p>
<input type="submit" name="stop_playback" value="Stop Playback" />
</body>
</html>
';
// Loop through the Kodi endpoints
foreach ($kodi_endpoints as $name => $kodi_endpoint) {
  // Get the active players for the current Kodi endpoint
  $active_players = $kodi_endpoint->GetActivePlayers();

  // Print the name of the Kodi endpoint
  echo '<h1>' . $name . '</h1>';

  // Check if there are any active players
  if (!empty($active_players)) {
    // Loop through the active players
    foreach ($active_players as $player) {
      // Print the player type and ID
      echo 'Player type: ' . $player['type'] . '<br>';
      echo 'Player ID: ' . $player['playerid'] . '<br>';
    }
  } else {
    // Print a message if there are no active players
    echo 'There are no active players.';
  }
}
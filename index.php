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

 
// <link rel="stylesheet" type="text/css" href="style.css">
// Display the GUI form for controlling Kodi
echo '
<html>
<head>
<title>KodiKontroller</title>
<link rel="icon" type="image/x-icon" href="favicon.ico">
<style>
html {
  background-image: url("bg.jpg");
}

body {
  background: none;
}
.kodi-endpoint, .yt_input_form, .notify_input_form {
  display: inline-block;
  margin: 20px;
  border: 1px solid black;
  padding: 10px;
  background-color: rgba(241, 241, 241, .7);
  box-shadow: 5px 10px rgb(136, 136, 136, .5);
  border-radius: 6px;
}
.burger-menu {
  display: none;
}

select, input {
  border-radius: 6px;
  height: 30px;
  margin: 2px;
}

label{
  display:inline-block;
  width:200px;
  margin-right:30px;
  text-align:right;
  }
  
fieldset{
  border:none;
  width:500px;
  margin:0px auto;
  }

.burger-menu-icon {
  width: 25px;
  height: 3px;
  background-color: black;
  margin: 5px;
}

.navigation {
  display: flex;
  flex-direction: row;
  justify-content: left;
  list-style: none;
}

.navigation li {
  margin: 0 10px;
}

@media screen and (max-width: 768px) {
  .burger-menu {
    display: block;
  }

  .navigation {
    display: none;
  }
}

</style>
</head>
<body>

<script src="burger.js"></script>

<header>
  <img src="https://github.com/OliPassey/kodikontroller/raw/master/logo.PNG" height=120px>
</header>
<div class="burger-menu">
  <div class="burger-menu-icon"></div>
</div>

<nav class="navigation">
  <ul>
    <li><a href="https://olipassey.me.uk/kodi/">Home</a></li>
    <li><a href="https://olipassey.me.uk/kodi/hosts.php">Endpoints</a></li>
    <li><a href="https://olipassey.me.uk/kodi/scheduler.php">Scheduler</a></li>
    <li><a href="https://olipassey.me.uk/kodi/announcer/fullscreen.php">Img Generator</a></li>
    <li><a href="https://olipassey.me.uk/kodi/videoannouncer/ffmpeg-text-overlay.php">Video Generator</a></li>
  </ul>
</nav>
<div class="yt_input_form">
  <form action="" method="post">
    <h4>Usage: Enter a YouTube URL, select your endpoint, and click the Play on Kodi button</h4>
    <label>YouTube URL:</label>
    <input type="text" name="youtube_url" /><br>
    <label>Kodi Endpoint:</label>
    <select name="kodi_endpoint">';

    // Loop through the array of Kodi endpoints and display them as options
    foreach ($kodi_endpoints as $name => $endpoint) {
      echo '<option value="' . $name . '">' . $name . '</option>';
    }

    echo '
    </select>
    <p>
      <section>
        <br>
        <input type="submit" value="Play on Kodi" />
      </section>
    </p>
  </form>
</div>

<div class="notify_input_form">
  <form action="" method="post">
    <h4>Usage: Enter a notification message and select your endpoint, then click the Send Notification button</h4>
    <label>Notification Message:</label>
    <input type="text" name="notification_message" /><br>
    <label>Kodi Endpoint:</label>
    <select name="kodi_endpoint">';

    // Loop through the array of Kodi endpoints and display them as options
    foreach ($kodi_endpoints as $name => $endpoint) {
      echo '<option value="' . $name . '">' . $name . '</option>';
    }

    echo '
    </select>
    <p>
      <section>
        <br>
        <input type="submit" value="Send Notification" />
      </section>
    </p>
  </form>
</div>
<p>
</body>
</html>

<div>
';
// Display what is currently playing on what player for each Kodi endpoint
foreach ($kodi_endpoints as $name => $kodi_endpoint) {
  echo '<div class="kodi-endpoint">';
  // Get the active players for the current Kodi endpoint
  $active_players = $kodi_endpoint->GetActivePlayers();
  // Print the name of the Kodi endpoint
  echo '<h1><img src=kodiblk.png height="24" width="24"> ' . $name . '</h1>';

  // Check if there are any active players
  if (!empty($active_players)) {
    // Loop through the active players
    foreach ($active_players as $player) {
      // Print the player type and ID
      echo 'Player type: ' . $player['type'] . '<br>';
      echo 'Player ID: ' . $player['playerid'] . '<br>';

      // Call the Player.GetItem method to get the currently playing item
      $item = $kodi_endpoint->Player->GetItem(['playerid' => $player['playerid']]);

      // Print the title of the currently playing item
      echo 'Title: ' . $item['item'] . '<br>';
      echo '</div>';      
    }
  } else {
    // Print a message if there are no active players
    echo 'There are no active players.';
    echo '</div>';
  }
}
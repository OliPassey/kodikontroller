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
<style>
.kodi-endpoint {
  display: inline-block;
  margin: 20px;
  border: 1px solid black;
  padding: 10px;
}
.burger-menu {
  display: none;
}

select, input {
  border-radius: 6px;
  height: 30px;
  margin: 2px;
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
  </ul>
</nav>
<div class="input_form">
<form action="" method="post">

  <h4>Usage: Enter a YouTube URL or Message to be sent, select your endpoint, and click the appropriate button</h4>
  <label>YouTube URL:</label>
  <input type="text" name="youtube_url" /><br>
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
<input type="submit" value="Play on Kodi" />
<input type="submit" value="Send Notification" />
<input type="submit" name="stop_playback" value="Stop Playback" />
</section>
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
  echo '<h1><img src=kodiblk.png height="24" width="24">' . $name . '</h1>';

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

// Removed inline styling from HTML
  // <style>
  //   body {
  //     background-color: #333;
  //     color: #fff;
  //     background-image: url(https://olipassey.me.uk/kodi/bg.jpg);
  //     background-size: cover;
  //     }
    
  //   grad1 {
  //     background-color: #cccccc;
  //     opacity: .4; 
  //   }

  //   .youtube-section, .notification-section {
  //     width: 45%;
  //   }
  //   label {
  //     display: block;
  //     margin-bottom: 5px;
  //   }
  //   <!-- HTML !-->
  //   <button class="input" role="button">Button 5</button>
    
  //   /* CSS */
  //   .input {
  //     align-items: center;
  //     background-clip: padding-box;
  //     background-color: #fa6400;
  //     border: 1px solid transparent;
  //     border-radius: .25rem;
  //     box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  //     box-sizing: border-box;
  //     color: #fff;
  //     cursor: pointer;
  //     display: inline-flex;
  //     font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  //     font-size: 16px;
  //     font-weight: 600;
  //     justify-content: center;
  //     line-height: 1.25;
  //     margin: 0;
  //     min-height: 3rem;
  //     padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  //     position: relative;
  //     text-decoration: none;
  //     transition: all 250ms;
  //     user-select: none;
  //     -webkit-user-select: none;
  //     touch-action: manipulation;
  //     vertical-align: baseline;
  //     width: auto;
  //   }
    
  //   .input:hover,
  //   .input:focus {
  //     background-color: #fb8332;
  //     box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  //   }
    
  //   .input:hover {
  //     transform: translateY(-1px);
  //   }
    
  //   .input:active {
  //     background-color: #c85000;
  //     box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
  //     transform: translateY(0);
  //   }
  //   input[type="submit"] {
  //     background-color: #0067a9;
  //     color: #fff;
  //     cursor: pointer;
  //     border-radius: 3px;
  //     height: 31px;
  //     width: 130px;
  //   }
  // </style>
<?php

// Include the KodiAPI class
include_once 'kodi-api.php';

// Create a new instance of the KodiAPI class
$kodi = new KodiAPI('http://localhost:8080/jsonrpc');

// Set the path to the JSON file
$json_file = '/var/www/olipassey/kodi/scheduled-content.json';

// Check if the JSON file exists
if (file_exists($json_file)) {
  // Read the JSON file
  $scheduled_content = json_decode(file_get_contents($json_file), true);

  // Loop through each scheduled content item
  foreach ($scheduled_content as $content) {
    // Check if the current time is within the start and end dates for the content
    if (time() >= strtotime($content['start_date']) && time() <= strtotime($content['end_date'])) {
      // Check the content type
      switch ($content['type']) {
        case 'image':
          // Display the image
          $kodi->GUI->ShowPicture(array(
            'picture' => $content['url'],
            'recursive' => false
          ));
          
          // Sleep for the specified duration
          sleep($content['duration']);
          
          // Stop the image display
          $kodi->Player->Stop();
          break;
        case 'video':
          // Play the video
          $kodi->Player->Open(array(
            'item' => array(
              'file' => $content['url']
            )
          ));
          break;
        case 'youtube':
          // Play the YouTube video
          $kodi->Player->Open(array(
            'item' => array(
              'file' => 'plugin://plugin.video.youtube/play/?video_id=' . $content['url']
            )
          ));
          break;
      }
    }
  }
}


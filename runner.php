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

// Check if there is any scheduled content that needs to be played
$scheduled_content_json = file_get_contents('scheduled_content.json');
$scheduled_content_array = json_decode($scheduled_content_json, true);

foreach ($scheduled_content_array as $index => $scheduled_content) {
  // Check if the current time is within the start and end dates
  $current_time = new DateTime('now');
  $start_time = new DateTime($scheduled_content['start_date']);
  $end_time = new DateTime($scheduled_content['end_date']);
}
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
      $kodi->Player->Open(['item' => ['file' => 'plugin://plugin.video.youtube/play/?video_id=' . $video_id]]);
    }
  }
}


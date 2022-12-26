<?php
// Include the necessary libraries and dependencies
include 'kodi-api.php';

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

  // Encode the scheduled content as JSON
  $json_data = json_encode($scheduled_content);

  // Write the JSON data to a file
  file_put_contents('scheduled_content.json', $json_data);
}

// Read the JSON data from the file
$json = file_get_contents('scheduled_content.json');
$scheduled_content = json_decode($json, true);

// Check if there is any scheduled content
if (!empty($scheduled_content)) {
  // Get the current time
  $current_time = time();

  // Check if the current time is within the start and end dates of the scheduled content
  if ($current_time >= strtotime($scheduled_content['start_date']) && $current_time <= strtotime($scheduled_content['end_date'])) {
    // Connect to the Kodi API endpoint
    $kodi = new KodiAPI('http://' . $scheduled_content['kodi_endpoint']['username'] . ':' . $scheduled_content['kodi_endpoint']['password'] . '@' . $scheduled_content['kodi_endpoint']['host'] . ':' . $scheduled_content['kodi_endpoint']['port'] . '/jsonrpc');

    // Check the content type
    if ($scheduled_content['content_type'] == 'image') {
      // Display the image on Kodi for the specified duration
      $kodi->Player->Open(['item' => ['file' => $scheduled_content['content_url']]]);
      sleep($scheduled_content['display_duration']);
      $kodi->Player->Stop();
    } elseif ($scheduled_content['content_type'] == 'video') {
      // Play the video on Kodi
      $kodi->Player->Open(['item' => ['file' => $scheduled_content['content_url']]]);

<?php
function youtube_extract_video_id($youtube_url) {
  // Extract the host and query string from the URL
  $parsed_url = parse_url($youtube_url);

  // Check if the URL is in the short form (e.g. https://youtu.be/dQw4w9WgXcQ)
  if ($parsed_url['host'] === 'youtu.be') {
    // Extract the video ID from the path of the URL
    return trim($parsed_url['path'], '/');
  }

  // Check if the URL is in the long form (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
  if ($parsed_url['host'] === 'www.youtube.com') {
    // Extract the query string from the URL
    $query_string = $parsed_url['query'];

    // Remove the leading "?" character from the query string
    $query_string = ltrim($query_string, '?');

    // Parse the query string into an array
    parse_str($query_string, $query_params);

    // Return the "v" parameter from the query string
    return $query_params['v'];
  }

  // URL is in an invalid format
  return false;
}

<?php

// Define the function for extracting the video ID from a YouTube URL
function youtube_extract_video_id($url) {
  // Parse the URL and return the video ID
  $parsed_url = parse_url($url);
  if ($parsed_url['host'] === 'youtu.be') {
    // URL is in the short form (e.g. https://youtu.be/dQw4w9WgXcQ)
    return trim($parsed_url['path'], '/');
  } elseif ($parsed_url['host'] === 'www.youtube.com') {
    // URL is in the long form (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
    parse_str($parsed_url['query'], $query_string);
    return $query_string['v'];
  }
  // URL is in an invalid format
  return false;
}

<?php

// Check if the form has been submitted
if (isset($_POST['playlistName']) && isset($_POST['songList'])) {
  // Get the form data
  $playlistName = $_POST['playlistName'];
  $songList = $_POST['songList'];

  // Split the song list into an array of individual songs
  $songs = explode("\n", $songList);

  // Set the playlist file path
  $playlistFile = "playlist.xsp";

  // Open the playlist file for writing
  $fp = fopen($playlistFile, "w");

  // Write the playlist header
  fwrite($fp, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n");
  fwrite($fp, "<smartplaylist type=\"songs\">\n");
  fwrite($fp, "  <name>$playlistName</name>\n");
  fwrite($fp, "  <match>one</match>\n");

  // Add the songs to the playlist
  foreach ($songs as $song) {
    fwrite($fp, "  <rule field=\"artist\" operator=\"contains\">$song</rule>\n");
  }

  // Close the playlist
  fwrite($fp, "</smartplaylist>\n");
  fclose($fp);

  echo "Playlist created successfully!";
} else {
  // Display the HTML form
  ?>
  <form id="playlist-form">
    <label for="playlist-name">Playlist Name:</label><br>
    <input type="text" id="playlist-name" name="playlist-name"><br>
    <label for="song-list">Song List:</label><br>
    <textarea id="song-list" name="song-list"></textarea><br>
    <input type="submit" value="Create Playlist">
  </form>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script>
  // Handle the form submission
  $("#playlist-form").submit(function(e) {
    e.preventDefault(); // Prevent the form from submitting

    // Get the form data
    var playlistName = $("#playlist-name").val();
    var songList = $("#song-list").val();

    // Send an AJAX request to the PHP script with the form data
    $.ajax({
      url: '/path/to/playlist-script.php',
      type: 'POST',
      data: { playlistName: playlistName, songList: songList },
      success: function(response) {
        console.log(response);
      }
    });
  });
  </script>
  <?php
}

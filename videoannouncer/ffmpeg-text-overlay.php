<?php
// PHP code goes here

// Check if the form has been submitted
if (isset($_POST['input-video'])) {
  // Get the file path of the selected input video
  $inputFile = $_POST['input-video'];

  // Get the current date and time
  $timestamp = date("Ymd_His");

  // Set up the command to run FFMPEG.
  $ffmpeg = '/usr/bin/ffmpeg';

  // Set up the output file path.
  $outputFile = './video/out/video_' . $timestamp . '.mp4';

  // Set up the font and font size for the text.
  $font = './foe_display-webfont.ttf';
  $fontSize = 124;

  // Set the text to be added to the video.
  $text = $_POST['text'];;

  // Set the color of the text in hexadecimal format.
  $color = '#ff0000';

  // Set the position of the text on the video.
  $position = 'center';

  // Set the padding around the text in pixels.
  $padding = 10;

  // Set the duration of the text in seconds.
  $duration = 10;
  
  // Calculate the x and y coordinates of the text
  $x = (w - text_w) / 2;
  $y = (h - text_h) / 2;

  // Set up the command to run FFMPEG.
  $command = "$ffmpeg -i $inputFile -vf ";

  // Add the text to the video using the font, font size, color, position, padding, and duration.
  $command .= "drawtext=fontfile=$font:fontsize=$fontSize:fontcolor=$color:x=$x:y=$y:text='$text'";

  // Save the output video.
  $command .= " -y $outputFile";

  // Run the FFMPEG command.
  exec($command);
  echo $command;
}
?>
<!-- HTML code goes here -->
<!-- Create a form that will be submitted to the PHP script -->
<form action="ffmpeg-text-overlay.php" method="post">
  <!-- Create a drop-down list for selecting the input video -->
  <label for="input-video">Input Video:</label>
  <select id="input-video" name="input-video">
    <?php
    // Get an array of all files with the .mp4 extension in the input folder
    $inputFolder = './video/in/';
    $inputFiles = glob($inputFolder . '*.mp4');

    // Loop through the array of input files and create an option for each one
    foreach ($inputFiles as $inputFile) {
      // Get the file name from the file path
      $fileName = basename($inputFile);

      // Output an option for the current file
      echo '<option value="' . $inputFile . '">' . $fileName . '</option>';
    }
    ?>
  </select>

 <!-- Add an input field for the text to be added to the video -->
 <label for="text">Text:</label><br>
  <input type="text" id="text" name="text"><br><br>

  <!-- Add a submit button to the form -->
  <input type="submit" value="Submit">
</form>
<?php
// More PHP code can

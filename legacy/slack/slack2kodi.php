<?php

 # Grab some of the values from the slash command, create vars for post back to Slack
 $command = $_POST['command'];
 $text = $_POST['text'];
 $token = $_POST['token'];

 # Check the token and make sure the request is from our team
 if($token != 'SLACK-slash-command-token'){ #replace this with the token from your slash command configuration page
   $msg = "The token for the slash command doesn't match. Check your script.";
   die($msg);
   echo $msg;
 }

 if (substr($text, 0, 7) == 'youtube') {
      $code = substr($text, -11);
      $uniquepart = "plugin://plugin.video.youtube/?path=/root/video&action=play_video&videoid=";
      $uniquepart .= $code;
      #echo $uniquepart;
 } elseif (substr($text, 0, 5) == 'local') {
      $uniquepart = "smb://user:password@server_name/share/folder/";
      $filename = substr($text, 6);
      $uniquepart .= $filename;
 } elseif (substr($text, -4) == '.png') {
      $uniquepart = $text;
      #echo $uniquepart;
 } elseif (substr($text, -4) == '.jpg') {
      $uniquepart = $text;
      #echo $uniquepart;
 } elseif (substr($text, -5) == '.jpeg') {
      $uniquepart = $text;
      #echo $uniquepart;
 } elseif (substr($text, -4) == '.gif') {
      $uniquepart = $text;
      #echo $uniquepart;
 } else {
   $msg = "Usage:\n";
   $msg .= "To display an image (JPG, JPEG, PNG, GIF), just use the URL\n";
   $msg .= "To play a youtube, use _youtube <ID>_\n";
   $msg .= "To show a file from \\\\server_name\\share\\folder use _local <filename>_\n";
   die($msg);
   echo $msg;
 }

 #this is the URL of the Kodi box. Needs to be available via the internet.
 $url = "http://user:password@KODI-ENDPOIUNT:PORT/jsonrpc?request=";

 $data_string = "{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"Input.Home\"}";

 #first wake it from screensaver
 $ch = curl_init($url);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
 curl_setopt($ch, CURLOPT_HTTPHEADER, array(
     'Content-Type: application/json',
     'Content-Length: ' . strlen($data_string))
 );
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $ch_response = curl_exec($ch);

 echo "Your wish is my command...";

 #debug
 #echo "\n{ \"jsonrpc\": \"2.0\", \"method\": \"Player.Open\", \"params\": { \"item\": { \"file\": \"";
 #echo $uniquepart;
 #echo "\" } }, \"id\": 1 }";

 sleep(1);

 #now send the command
 $data_string = "{ \"jsonrpc\": \"2.0\", \"method\": \"Player.Open\", \"params\": { \"item\": { \"file\": \"";
 $data_string .= $uniquepart;
 $data_string .= "\" } }, \"id\": 1 }";

 $ch = curl_init($url);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
 curl_setopt($ch, CURLOPT_HTTPHEADER, array(
     'Content-Type: application/json',
     'Content-Length: ' . strlen($data_string))
 );
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $ch_response = curl_exec($ch);

 #echo 'Response: ';
 #echo $ch_response;

?>

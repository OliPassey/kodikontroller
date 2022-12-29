<?php

// Read the contents of the file into a string
$json = file_get_contents('kodi_endpoints.json');

// Convert the JSON string into a PHP array
$data = json_decode($json, true);

// Check if the form to add a new entry has been submitted
if (isset($_POST['add'])) {
// Add the new entry to the array
$new_entry = array(
    $_POST['name'] => array(
      "username" => $_POST['username'],
      "password" => $_POST['password'],
      "host" => $_POST['host'],
      "port" => $_POST['port']
    )
  );
  $data = array_merge($data, $new_entry);
  

  // Convert the modified array back into a JSON string
  $json = json_encode($data);

  // Write the JSON string back to the file
  file_put_contents('kodi_endpoints.json', $json);
}

// Check if the form to edit an existing entry has been submitted
if (isset($_POST['edit'])) {
  // Get the index of the entry to edit
  $index = $_POST['index'];

  // Update the values of the entry
  $data[$index]['username'] = $_POST['username'];
  $data[$index]['password'] = $_POST['password'];
  $data[$index]['host'] = $_POST['host'];
  $data[$index]['port'] = $_POST['port'];

  // Convert the modified array back into a JSON string
  $json = json_encode($data);

  // Write the JSON string back to the file
  file_put_contents('kodi_endpoints.json', $json);
}

// Check if the form to delete an existing entry has been submitted
if (isset($_POST['delete'])) {
  // Get the index of the entry to delete
  $index = $_POST['index'];

  // Remove the entry from the array
  unset($data[$index]);

  // Convert the modified array back into a JSON string
  $json = json_encode($data);

  // Write the JSON string back to the file
  file_put_contents('kodi_endpoints.json', $json);
}

// Display the current entries in the array
echo "<h1>Current Entries</h1>";
echo "<table>";
echo "<tr><th>Name</th><th>Username</th><th>Password</th><th>Host</th><th>Port</th><th></th></tr>";
foreach ($data as $index => $entry) {
  echo "<tr>";
  echo "<td>" . $index . "</td>";
  echo "<td>" . $entry['username'] . "</td>";
  echo "<td>" . $entry['password'] . "</td>";
  echo "<td>" . $entry['host'] . "</td>";
  echo "<td>" . $entry['port'] . "</td>";
  echo "<td>";
  echo "<form method='post'>";
  echo "<input type='hidden' name='index' value='" . $index . "'>";
  echo "<input type='submit' name='edit' value='Edit'>";
  echo "<input type='submit' name='delete' value='Delete'>";
  echo "</form>";
  echo "</td>";
  echo "</tr>";
  }
  echo "</table>";
  
  // Display the form to add a new entry
  echo "<h1>Add a New Entry</h1>";
  echo "<form method='post'>";
  echo "<label for='name'>Name:</label><br>";
  echo "<input type='text' id='name' name='name'><br>";
  echo "<label for='username'>Username:</label><br>";
  echo "<input type='text' id='username' name='username'><br>";
  echo "<label for='password'>Password:</label><br>";
  echo "<input type='text' id='password' name='password'><br>";
  echo "<label for='host'>Host:</label><br>";
  echo "<input type='text' id='host' name='host'><br>";
  echo "<label for='port'>Port:</label><br>";
  echo "<input type='text' id='port' name='port'><br><br>";
  echo "<input type='submit' name='add' value='Add'>";
  echo "</form>";
  
  
  ?>
  

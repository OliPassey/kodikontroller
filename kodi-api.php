<?php

// Define the KodiAPI class
class KodiAPI {
  // Define the class properties
  private $base_url;

  // Define the class constructor
  public function __construct($base_url) {
    // Store the base URL for the Kodi API
    $this->base_url = $base_url;

    // Instantiate the Player and GUI classes and assign them to the Player and GUI properties
    $this->Player = new Player($this->base_url);
    $this->GUI = new GUI($this->base_url);
    $this->ActivePlayers = new ActivePlayers($this->base_url);
  }
  
  // Define the magic method for calling Kodi API methods
  public function __call($method, $params) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => $method,
      'params' => $params,
      'id' => 1
    );

    // Encode the request data as JSON
    $request_json = json_encode($request_data);

    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);

    // Decode the response data
    $response_data = json_decode($response_json, true);

    // Return the response data
    return $response_data['result'];
  }

  public function GetActivePlayers() {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'Player.GetActivePlayers',
      'id' => 1
    );
  
    // Encode the request data as JSON
    $request_json = json_encode($request_data);
  
    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);
  
    // Decode the response data
    $response_data = json_decode($response_json, true);
  
    // Return the response data
    return $response_data['result'];
  }
  
  
}

class Player {
  // Define the class properties
  private $base_url;

  // Define the class constructor
  public function __construct($base_url) {
    // Store the base URL for the Kodi API
    $this->base_url = $base_url;
  }

  // Define the Open method
  public function Open($params) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'Player.Open',
      'params' => $params,
      'id' => 1
    );

    // Encode the request data as JSON
    $request_json = json_encode($request_data);

    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);

    // Decode the response data
    $response_data = json_decode($response_json, true);

    // Return the response data
    return $response_data['result'];
  }

  // Define the Stop method
  public function Stop($playerId) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'Player.Stop',
      'params' => array('playerid' => $playerId),
      'id' => 1
    );
  
    // Encode the request data as JSON
    $request_json = json_encode($request_data);
  
    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);
  
    // Decode the response data
    $response_data = json_decode($response_json, true);
  
    // Return the response data
    return $response_data['result'];
  }
  
  public function GetItem($playerid) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'Player.GetItem',
      'params' => array(
        'playerid' => $playerid,
        'properties' => array('title')
      ),
      'id' => 1
    );

    // Encode the request data as JSON
    $request_json = json_encode($request_data);

    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);

    // Decode the response data
    $response_data = json_decode($response_json, true);

    // Return the response data
    return $response_data['result']['item'];
  }

}


class GUI {
  // Define the class properties
  private $base_url;

  // Define the class constructor
  public function __construct($base_url) {
    // Store the base URL for the Kodi API
    $this->base_url = $base_url;
  }

  // Define the ShowNotification method
  public function ShowNotification($params) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'GUI.ShowNotification',
      'params' => $params,
      'id' => 1
    );

    // Encode the request data as JSON
    $request_json = json_encode($request_data);

    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);

    // Decode the response data
    $response_data = json_decode($response_json, true);

    // Return the response data
    return $response_data['result'];
  }
}


class ActivePlayers {
  // Define the class properties
  private $base_url;

  // Define the class constructor
  public function __construct($base_url) {
    // Store the base URL for the Kodi API
    $this->base_url = $base_url;
  }

  // Define the GetItem method
  public function GetItem($playerid) {
    // Build the request data
    $request_data = array(
      'jsonrpc' => '2.0',
      'method' => 'Player.GetItem',
      'params' => array(
        'playerid' => $playerid,
        'properties' => array('title')
      ),
      'id' => 1
    );

    // Encode the request data as JSON
    $request_json = json_encode($request_data);

    // Send the request to the Kodi API
    $ch = curl_init($this->base_url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Content-Length: ' . strlen($request_json)
    ));
    $response_json = curl_exec($ch);

    // Decode the response data
    $response_data = json_decode($response_json, true);

    // Return the title of the item
    return $response_data['result']['item']['title'];
  }
}


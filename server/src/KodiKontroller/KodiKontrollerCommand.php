<?php

namespace KodiKontroller;

class KodiKontrollerCommand {

    private $target;
    private $requestData;

    public function __construct($target, $requestData) {

        $this->target = $target;
        $this->requestData = $requestData;

    }

    
    public function exec() {

        $path = $this->target['host'] . '/jsonrpc';
        $data_string = json_encode($this->requestData);

        $curl = curl_init($path);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_POST, TRUE);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string),
        ]);

        $response = curl_exec($curl);

        return $response . '<br><br>' . $data_string;

    }

}

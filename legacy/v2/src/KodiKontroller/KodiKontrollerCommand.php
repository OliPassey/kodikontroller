<?php

namespace KodiKontroller;

class KodiKontrollerCommand {

    private $target;
    private $requestData;
    private $kontroller;

    public function __construct ($target, $requestData, $kontroller) {

        $this->kontroller = $kontroller;
        $this->target = $kontroller->getTarget($target);
        $this->requestData = $requestData;

        /* TODO: Accept requestData as assoc. array, e.g.:
         *      $requestData = [
         *          "jsonrpc" => "2.0",
         *          "id" => "1",
         *          "method" => "GUI.ShowNotification",
         *          "params" => [
         *              "title" => "Notification",
         *              "message" => "Hi",
         *              "displaytime" => 10000,
         *          ]
         *      ];
         */
        
    }

    public function exec () {

        return $this->target->send($this->requestData);

    }

}

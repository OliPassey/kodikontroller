<?php

namespace KodiKontroller;

class KodiKontrollerGroup {

    private $name;
    private $displayName;
    private $screens = [];

    public function __construct (Array $params) {

        $defaults = [
            'name'        => 'undefined',
            'displayName' => 'undefined',
        ];

        $params = array_merge($defaults, array_intersect_key($params, $defaults));

        $this->name = $params['name'];
        $this->displayName = $params['displayName'];

    }

    public function addScreen ($screen) {
        $this->screens[] = $screen;
    }

    public function toArray () {
        return [
            'name' => $this->name,
            'displayName' => $this->displayName,
            'screens' => $this->screens,
        ];
    }

    public function send ($requestData) {

        $errorCount = 0;
        $successCount = 0;

        foreach ($this->screens as $screen) {
            $return = $screen->send($requestData);
            if ($return == NULL) {
                $errorCount++;
            } else {
                $successCount++;
            }
        }

        // TODO: Better.
        return ['status' => $errorCount == 0 ? 'OK' : 'FAIL', 'successCount' => $successCount, 'errorCount' => $errorCount];
    }

}

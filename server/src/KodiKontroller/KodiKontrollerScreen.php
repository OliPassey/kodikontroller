<?php

namespace KodiKontroller;

class KodiKontrollerScreen {

    private $name;
    private $displayName;
    private $host;
    private $groups = [];

    public function __construct(Array $params) {

        $defaults = [
            'name'        => 'undefined',
            'displayName' => 'undefined',
            'host'        => 'undefined',
            'groups'      => [],
        ];

        $params = array_merge($defaults, array_intersect_key($params, $defaults));

        $this->name = $params['name'];
        $this->displayName = $params['displayName'];
        $this->host = $params['host'];
        $this->groups = $params['groups'];
    }

    public function test() {
        return('[' . $this->displayName . ']');
    }

}

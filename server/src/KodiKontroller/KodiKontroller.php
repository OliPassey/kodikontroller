<?php

namespace KodiKontroller;

class KodiKontroller {

    private $screens;
    private $groups;

    public static function getTargetType($target) {

        return('screen or group');

    }

    public static function getTarget($target) {

        return('[' . $this->text . ']');

    }

}

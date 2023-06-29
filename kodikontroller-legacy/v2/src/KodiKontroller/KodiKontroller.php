<?php

namespace KodiKontroller;

class KodiKontroller {

    private $groups  = [];
    private $screens = [];

    public function __construct () {

        // Parse and load in the screen and group definitions
        try {
            $config = \Symfony\Component\Yaml\Yaml::parseFile(__DIR__ . '/../../config.yml');
        } catch (\Symfony\Component\Yaml\Exception\ParseException $error) {
            // TODO: Improve this, and use HTTP error codes/messages to indicate issues
            die('ERROR: Your config YAML file could not be parsed. ' . $error->getMessage() . "\n");
        }

        foreach ($config['groups'] as $groupName => $group) {
            $params = [
                'name'        => $groupName,
                'displayName' => $group['displayName'],
            ];

            $this->groups[$groupName] = new \KodiKontroller\KodiKontrollerGroup($params);
        }

        // Add default "all' group
        $this->groups['all'] = new \KodiKontroller\KodiKontrollerGroup([
            'name' => 'all',
            'displayName' => 'All screens',
        ]);

        foreach ($config['screens'] as $screenName => $screen) {

            // Some basic sanity checking.
            // TODO: Improve this, and use HTTP error codes/messages to indicate issues
            if (array_key_exists($screenName, $this->groups)) {
                die('ERROR: Screen and group names must be unique. (Clash detected on "' . $screenName . '".)');
            }

            $params = [
                'name'        => $screenName,
                'displayName' => $screen['displayName'],
                'host'        => $screen['host'],
            ];

            $this->screens[$screenName] = new \KodiKontroller\KodiKontrollerScreen($params);

            // Add this screen to the default 'all' group, and any others needed
            $this->groups['all']->addScreen($this->screens[$screenName]);
            $this->screens[$screenName]->addGroup($this->groups['all']);

            foreach ($screen['groups'] as $group) {
                if (isset($this->groups[$group])) {
                    $this->groups[$group]->addScreen($this->screens[$screenName]);
                    $this->screens[$screenName]->addGroup($this->groups[$group]);
                }
            }

        }

    }

    public function getScreens () {
        return $this->screens;
    }

    public function getGroups () {
        return $this->groups;
    }

    public function getTargetType ($target) {

        if (isset($this->screens[$target])) {
            return('screen');
        } else if (isset($this->groups[$target])) {
            return('group');
        } else {
            return null;
        }

    }

    public function getTarget ($target) {

        if ($this->getTargetType($target) == 'screen') {
            return $this->screens[$target];
        } else if ($this->getTargetType($target) == 'group') {
            return $this->groups[$target];
        } else {
            return null;
        }

    }

}

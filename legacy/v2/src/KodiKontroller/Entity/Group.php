<?php

namespace KodiKontroller\Entity;

use Doctrine\ORM\Mapping as ORM;
use KodiKontroller\Entity;

/**
 * @ORM\Entity
 * @ORM\Table(name="group")
 */
class Group {

    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=32)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=64)
     */
    protected $displayName;

    /**
     * @ORM\Column(type="simple_array")
     */
    private $screens;

    public function __construct (Array $params) {

        $defaults = [
            'name'        => 'undefined',
            'displayName' => 'undefined',
        ];

        $params = array_merge($defaults, array_intersect_key($params, $defaults));

        $this->name = $params['name'];
        $this->displayName = $params['displayName'];
        $this->screens = [];

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

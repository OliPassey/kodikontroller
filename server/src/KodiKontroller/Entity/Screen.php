<?php

namespace KodiKontroller\Entity;

use Doctrine\ORM\Mapping as ORM;
use KodiKontroller\Entity;


/**
 * @ORM\Entity
 * @ORM\Table(name="screen")
 */
class Screen {

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
     * @ORM\Column(type="string", length=128)
     */
    protected $host;

    
    // Non-ORM properties
    private $groups;


    public function __construct (Array $params) {

        $defaults = [
            'name'        => 'undefined',
            'displayName' => 'undefined',
            'host'        => 'undefined',
        ];

        $params = array_merge($defaults, array_intersect_key($params, $defaults));

        $this->name = $params['name'];
        $this->displayName = $params['displayName'];
        $this->host = $params['host'];
        $this->groups = [];
    }

    public function addGroup ($group) {
        $this->groups[] = $group;
    }


    public function toArray () {
        return [
            'name' => $this->name,
            'displayName' => $this->displayName,
            'host' => $this->host,
            'groups' => $this->groups,
        ];
    }

    public function send ($requestData) {

        $path = $this->host . '/jsonrpc';
        // TODO: Pass request data as an assoc. array (then json_encode it here)
        $data_string = $requestData;

        $curl = curl_init($path);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_POST, TRUE);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string),
        ]);

        return json_decode(curl_exec($curl));
    }

}

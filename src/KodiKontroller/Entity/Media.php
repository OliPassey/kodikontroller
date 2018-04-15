<?php

namespace KodiKontroller\Entity;

use Doctrine\ORM\Mapping as ORM;
use KodiKontroller\Entity;


/**
 * @ORM\Entity
 * @ORM\Table(name="media")
 */
class Media {

    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=128)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $type;

    /**
     * @ORM\Column(type="string", length=150)
     */
    protected $location;
    
}

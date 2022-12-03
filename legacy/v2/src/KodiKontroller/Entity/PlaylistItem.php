<?php

namespace KodiKontroller\Entity;

use Doctrine\ORM\Mapping as ORM;
use KodiKontroller\Entity;


/**
 * @ORM\Entity
 * @ORM\Table(name="playlist_item")
 */
class PlaylistItem {

    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="KodiKontroller\Entity\Playlist")
     * @ORM\JoinColumn(name="playlist_id", referencedColumnName="id")
     */
    protected $playlistId;

    /**
     * @ORM\ManyToOne(targetEntity="KodiKontroller\Entity\Media")
     * @ORM\JoinColumn(name="media_id", referencedColumnName="id")
     */
    protected $mediaId;

    /**
     * @ORM\Column(type="integer")
     */
    protected $duration;

    /**
     * @ORM\Column(name="order_weight", type="integer")
     */
    protected $orderWeight;

}

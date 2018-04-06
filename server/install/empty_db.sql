USE kodikontroller;

-- MySQL dump 10.16 Distrib 10.1.28-MariaDB, for Linux (x86_64)
 --
 -- Host: localhost Database: kodikontroller
 -- ------------------------------------------------------
 -- Server version 10.1.28-MariaDB
 
 /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
 /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
 /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 /*!40101 SET NAMES utf8 */;
 /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
 /*!40103 SET TIME_ZONE='+00:00' */;
 /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
 /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
 /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
 /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
 
 --
 -- Table structure for table `group`
 --
 
 DROP TABLE IF EXISTS `group`;
 /*!40101 SET @saved_cs_client = @@character_set_client */;
 /*!40101 SET character_set_client = utf8 */;
 CREATE TABLE `group` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
 `displayName` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
 `screens` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:simple_array)',
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 /*!40101 SET character_set_client = @saved_cs_client */;
 
 --
 -- Dumping data for table `group`
 --
 
 LOCK TABLES `group` WRITE;
 /*!40000 ALTER TABLE `group` DISABLE KEYS */;
 /*!40000 ALTER TABLE `group` ENABLE KEYS */;
 UNLOCK TABLES;
 
 --
 -- Table structure for table `media`
 --
 
 DROP TABLE IF EXISTS `media`;
 /*!40101 SET @saved_cs_client = @@character_set_client */;
 /*!40101 SET character_set_client = utf8 */;
 CREATE TABLE `media` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
 `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `location` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 /*!40101 SET character_set_client = @saved_cs_client */;
 
 --
 -- Dumping data for table `media`
 --
 
 LOCK TABLES `media` WRITE;
 /*!40000 ALTER TABLE `media` DISABLE KEYS */;
 /*!40000 ALTER TABLE `media` ENABLE KEYS */;
 UNLOCK TABLES;
 
 --
 -- Table structure for table `playlist`
 --
 
 DROP TABLE IF EXISTS `playlist`;
 /*!40101 SET @saved_cs_client = @@character_set_client */;
 /*!40101 SET character_set_client = utf8 */;
 CREATE TABLE `playlist` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
 `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 /*!40101 SET character_set_client = @saved_cs_client */;
 
 --
 -- Dumping data for table `playlist`
 --
 
 LOCK TABLES `playlist` WRITE;
 /*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
 /*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
 UNLOCK TABLES;
 
 --
 -- Table structure for table `playlist_item`
 --
 
 DROP TABLE IF EXISTS `playlist_item`;
 /*!40101 SET @saved_cs_client = @@character_set_client */;
 /*!40101 SET character_set_client = utf8 */;
 CREATE TABLE `playlist_item` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `playlist_id` int(11) DEFAULT NULL,
 `media_id` int(11) DEFAULT NULL,
 `duration` int(11) NOT NULL,
 `order_weight` int(11) NOT NULL,
 PRIMARY KEY (`id`),
 KEY `IDX_BF02127C6BBD148` (`playlist_id`),
 KEY `IDX_BF02127CEA9FDD75` (`media_id`),
 CONSTRAINT `FK_BF02127C6BBD148` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`),
 CONSTRAINT `FK_BF02127CEA9FDD75` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 /*!40101 SET character_set_client = @saved_cs_client */;
 
 --
 -- Dumping data for table `playlist_item`
 --
 
 LOCK TABLES `playlist_item` WRITE;
 /*!40000 ALTER TABLE `playlist_item` DISABLE KEYS */;
 /*!40000 ALTER TABLE `playlist_item` ENABLE KEYS */;
 UNLOCK TABLES;
 
 --
 -- Table structure for table `screen`
 --
 
 DROP TABLE IF EXISTS `screen`;
 /*!40101 SET @saved_cs_client = @@character_set_client */;
 /*!40101 SET character_set_client = utf8 */;
 CREATE TABLE `screen` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
 `displayName` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
 `host` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 /*!40101 SET character_set_client = @saved_cs_client */;
 
 --
 -- Dumping data for table `screen`
 --
 
 LOCK TABLES `screen` WRITE;
 /*!40000 ALTER TABLE `screen` DISABLE KEYS */;
 /*!40000 ALTER TABLE `screen` ENABLE KEYS */;
 UNLOCK TABLES;
 /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
 
 /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
 /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
 /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
 /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
 /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
 /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
 /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
 
 -- Dump completed on 2018-04-03 23:47:27

DROP DATABASE IF EXISTS `firma_app`;
CREATE DATABASE IF NOT EXISTS `firma_app`;
USE `firma_app`;

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameUser` varchar(50) NOT NULL,
  `emailUser` varchar(50) NOT NULL,
  `passUser` varchar(50) NOT NULL,
  `rolUser` varchar(50) NOT NULL,
  `encryptKeyUser` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


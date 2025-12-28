DROP DATABASE IF EXISTS `firma_app`;
CREATE DATABASE IF NOT EXISTS `firma_app`;
USE `firma_app`;

DROP TABLE IF EXISTS `Movies`;

CREATE TABLE `Movies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prodId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `Movies` (prodId, price, quantity) VALUES
	(100,20,125),
	(101,10,234),
	(102,15,432),
	(103,17,320),
	(104,70,240),
  (105,21,125),
	(106,11,234),
	(107,16,432),
	(108,18,320),
	(109,71,240),
  (110,22,125),
	(111,12,234),
	(112,17,432),
	(113,19,320),
	(114,72,240),
  (115,23,125),
	(116,13,234),
	(117,18,432),
	(118,10,320),
	(119,73,240),
  (120,72,240),
  (121,23,125),
	(122,13,234),
	(123,18,432),
	(124,10,320),
	(125,73,240);


DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameUser` varchar(50) NOT NULL,
  `emailUser` varchar(50) NOT NULL,
  `passUser` varchar(50) NOT NULL,
  `rolUser` varchar(50) NOT NULL,
  `dniUser` varchar(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `Users` (nameUser, emailUser, passUser, rolUser, dniUser) VALUES
	('Steve','steve@gmail.com','qzYfGd_vSr6FhBtk5da5qP3JxIc_m_BReuKOFxpEVYU', 'ADMIN','12345678A'),
  ('David','david1@gmail.com','FnAN4mnrSDPZ8mGpaA1au-FriOlj07ShT7dKw4oNfPo','CLIENT','23456789B'),
  ('Luis','luis@gmail.com','WbYb3OwXLi6LV_B_llWFEneEC3kWwu7neWn4adYyqh0','CLIENT','34567891C'),
  ('Robert','robert@gmail.com','2QBEGnBB4phDK-mdIckWZ8yPVGRW4xaCo5F3XfC9diw','FIRMA','45678912D'),
  ('Firma','firma@gmail.com','EddHnILrgXm9mnVZOVUGHSJ6fudCcyGA2fOv-GqFX4Q', 'FIRMA','56789123E'),
  ('Anthony','anthony@email.com','mWhua-Kq7zPQAflNuyyxRzdfuugD-b09B-COBX-i-LY','ADMIN','12345678B'),
  ('Totoro1','totoro1@email.com','H2Rnrox2YTerRJnWHu_qKgs01MznwKN_jBBYBrOWe1Y','CLIENT','12345678C'),
  ('pruNombre1','pruebaMail1@email.com','JsxYvNr2CrutZpwEO5SbjvmYgGOTnaLkl1b22JipBoE','CLIENT','12345678D'),
  ('pruNombre2','pruebaMail2@email.com','Jk32q0viK1-1rUtci8wR_ArFUHoHNhhIMHT0ya61Zwo','CLIENT','12345678E'),
  ('pruNombre3','pruebaMail3@email.com','Sngtt9nCib9xSPZp2Lnd4GAAyD6mRsWtVgRqRIaA6LI','CLIENT','12345678F'),
  ('pruNombre4','pruebaMail4@email.com','B8Ht8MwGxrUZctrTJIGm93TfZSffg3Bhds6N3Db-0Hw','CLIENT','12345678G'),
  ('pruNombre5','pruebaMail5@email.com','T6y2BzBVQkL9Qq8lEXnSWDBbuVX1yQ-pdjIVKvB7mIs','CLIENT','12345678H'),
  ('pruNombre6','pruebaMail6@email.com','_OuNKBqZXJqRL4af0VQgRqSIjlOoMrvT5oYruKsZ9P4','CLIENT','12345678I'),
  ('pruNombre7','pruebaMail6@email.com','JsxYvNr2CrutZpwEO5SbjvmYgGOTnaLkl1b22JipBoE','CLIENT','12345678J'),
  ('pruNombre8','pruebaMail7@email.com','Jk32q0viK1-1rUtci8wR_ArFUHoHNhhIMHT0ya61Zwo','CLIENT','12345678K'),
  ('pruNombre9','pruebaMail8@email.com','Sngtt9nCib9xSPZp2Lnd4GAAyD6mRsWtVgRqRIaA6LI','CLIENT','12345678L'),
  ('pruNombre10','pruebaMail9@email.com','B8Ht8MwGxrUZctrTJIGm93TfZSffg3Bhds6N3Db-0Hw','CLIENT','12345678M'),
  ('pruNombre11','pruebaMail10@email.com','T6y2BzBVQkL9Qq8lEXnSWDBbuVX1yQ-pdjIVKvB7mIs','CLIENT','12345678N'),
  ('pruNombre12','pruebaMail11@email.com','_OuNKBqZXJqRL4af0VQgRqSIjlOoMrvT5oYruKsZ9P4','CLIENT','12345678O'),
  ('pruNombre20','pruebaMail20@email.com','jH2iDCjdq5R7_JDOWaBcZolCiPSH6RTB9HMAi9EF-DA','CLIENT','12345678P')
  ;



DROP TABLE IF EXISTS `pdfs`;

CREATE TABLE `pdfs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `urlCarpeta` varchar(255) NOT NULL,
  `estado` ENUM('PENDING','VALIDATED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `fileSize` bigint(20) NOT NULL DEFAULT 0,
  `numPages` int(11) NOT NULL DEFAULT 0,
  `sha256` varchar(128) DEFAULT NULL,
  `initialUploadTimestamp` DATETIME NOT NULL,
  `uploadTimestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `validatorId` int(11) DEFAULT NULL,
  `validationTimestamp` DATETIME DEFAULT NULL,
  `stampUserId` int(11) DEFAULT NULL,
  `stampTimestamp` DATETIME DEFAULT NULL,
  `signUserId` int(11) DEFAULT NULL,
  `signTimestamp` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Como son dentro de carpeta y no sacadas desde archivo, los valores los deje a dafault
INSERT INTO `pdfs` (userId, name, urlCarpeta, estado, fileSize, numPages, sha256, initialUploadTimestamp, uploadTimestamp, validatorId, validationTimestamp, stampUserId, stampTimestamp, signUserId, signTimestamp) VALUES
(2, 'pdfPrueba1', './pdfBBDD/2/pdfPrueba1_2025_12_11_21_30_00.pdf', 'VALIDATED', 0, 0, NULL, "2025-12-11 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'pdfPrueba2', './pdfBBDD/2/pdfPrueba2_2025_12_10_21_30_00.pdf', 'PENDING', 0, 0, NULL, "2025-12-10 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'pdfPrueba3', './pdfBBDD/2/pdfPrueba3_2025_12_09_21_30_00.pdf', 'PENDING', 0, 0, NULL, "2025-12-09 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'probandoPdf_4', './pdfBBDD/2/probandoPdf_4_2025_12_08_21_30_00.pdf', 'REJECTED', 0, 0, NULL, "2025-12-08 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'probandoPdf5', './pdfBBDD/3/probandoPdf5_2025_12_07_21_30_00.pdf', 'VALIDATED', 0, 0, NULL, "2025-12-07 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'probandoPdf6', './pdfBBDD/3/probandoPdf6_2025_12_06_21_30_00.pdf', 'PENDING', 0, 0, NULL, "2025-12-06 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'probandoPdf7', './pdfBBDD/3/probandoPdf7_2025_12_05_21_30_00.pdf', 'REJECTED', 0, 0, NULL, "2025-12-05 21:30:00", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(1, 'pruebaPdf8','./pdfBBDD/1/pruebaPdf8_2025_12_28_01_11_05.pdf', 'PENDING', 0, 0, NULL, "2025-12-28 01:11:05", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(1, 'pruebaPdf9','./pdfBBDD/1/pruebaPdf9_2025_12_28_01_11_26.pdf', 'PENDING', 0, 0, NULL, "2025-12-28 01:11:26", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(1, 'pruebaPdf10','./pdfBBDD/1/pruebaPdf10_2025_12_28_01_13_31.pdf', 'PENDING', 0, 0, NULL, "2025-12-28 01:13:31", NOW(), NULL, NULL, NULL, NULL, NULL, NULL),
(1, 'pruebaPdf11','./pdfBBDD/1/pruebaPdf11_2025_12_28_01_13_49.pdf', 'PENDING', 0, 0, NULL, "2025-12-28 01:13:49", NOW(), NULL, NULL, NULL, NULL, NULL, NULL)
;

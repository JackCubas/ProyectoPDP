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
	(104,70,240);


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

INSERT INTO `Users` (nameUser, emailUser, passUser, rolUser, encryptKeyUser) VALUES
	('Steve','steve@gmail.com','qzYfGd_vSr6FhBtk5da5qP3JxIc_m_BReuKOFxpEVYU', 'ADMIN','pruebaKey'),
  ('David','david1@gmail.com','FnAN4mnrSDPZ8mGpaA1au-FriOlj07ShT7dKw4oNfPo','CLIENT','davidKey'),
  ('Luis','luis@gmail.com','WbYb3OwXLi6LV_B_llWFEneEC3kWwu7neWn4adYyqh0','CLIENT','luisKey'),
  ('Robert','robert@gmail.com','2QBEGnBB4phDK-mdIckWZ8yPVGRW4xaCo5F3XfC9diw','FIRMA','robertKey'),
  ('firma','firma@gmail.com','EddHnILrgXm9mnVZOVUGHSJ6fudCcyGA2fOv-GqFX4Q', 'FIRMA','firmaKey'),
  ('anthony','anthony@email.com','mWhua-Kq7zPQAflNuyyxRzdfuugD-b09B-COBX-i-LY','ADMIN','pruebaKey'),
  ('Totoro1','totoro1@email.com','H2Rnrox2YTerRJnWHu_qKgs01MznwKN_jBBYBrOWe1Y','CLIENT','totoro1Key'),
  ('pruNombre1','pruebaMail1@email.com','JsxYvNr2CrutZpwEO5SbjvmYgGOTnaLkl1b22JipBoE','CLIENT','prueba1Key'),
  ('pruNombre2','pruebaMail2@email.com','Jk32q0viK1-1rUtci8wR_ArFUHoHNhhIMHT0ya61Zwo','CLIENT','prueba2Key'),
  ('pruNombre3','pruebaMail3@email.com','Sngtt9nCib9xSPZp2Lnd4GAAyD6mRsWtVgRqRIaA6LI','CLIENT','prueba3Key'),
  ('pruNombre4','pruebaMail4@email.com','B8Ht8MwGxrUZctrTJIGm93TfZSffg3Bhds6N3Db-0Hw','CLIENT','prueba4Key'),
  ('pruNombre5','pruebaMail5@email.com','T6y2BzBVQkL9Qq8lEXnSWDBbuVX1yQ-pdjIVKvB7mIs','CLIENT','prueba5Key'),
  ('pruNombre6','pruebaMail6@email.com','_OuNKBqZXJqRL4af0VQgRqSIjlOoMrvT5oYruKsZ9P4','CLIENT','prueba6Key');



DROP TABLE IF EXISTS `Pdfs`;

CREATE TABLE `Pdfs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `urlCarpeta` varchar(100),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `Pdfs` (userId, name, urlCarpeta) VALUES
(2, 'pdfPrueba1', './pdfBBDD/pdfPrueba1.pdf'),
(2, 'pdfPrueba2', './pdfBBDD/pdfPrueba2.pdf'),
(2, 'pdfPrueba3', './pdfBBDD/pdfPrueba3.pdf'),
(2, 'probandoPdf_4', './pdfBBDD/probandoPdf_4.pdf');

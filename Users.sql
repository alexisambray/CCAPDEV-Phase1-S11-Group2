CREATE DATABASE IF NOT EXISTS `mco2db`
USE `mco2db`
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `Username` varchar(20) NOT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL, 
  `ProfilePic`  BLOB DEFAULT NULL,
  `DisplayName` varchar(20) DEFAULT NULL, 
  `Bio` varchar(45) DEFAULT NULL
   PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `users` WRITE;

INSERT INTO `users` VALUES ('bry_lil','p4ssw0rD','brylil@gmail.com', profilepic, 'Bryan', 'Asian traveller'),('elliamae','password27','ellia@yahoo.com, profilepic,'),('emman','password32','emman@gmail.com'),('alexis','PassWerd455','alex23@hotmail.com'),('kevin32','password322','kev32@gmail.com');

UNLOCK TABLES;

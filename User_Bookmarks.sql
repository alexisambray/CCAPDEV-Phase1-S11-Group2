CREATE DATABASE IF NOT EXISTS `mco2db`
USE `mco2db`
DROP TABLE IF EXISTS `User_Bookmarks`;
CREATE TABLE `User_Bookmarks` (
  `Username` varchar(20) DEFAULT NULL,
  `PostID` int NOT NULL,   
  PRIMARY KEY (`PostID`)
  PRIMARY KEY (`Username`)
  FOREIGN KEY (`Username`)
  FOREIGN KEY (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `User_Posts` WRITE;

INSERT INTO `User_Posts` VALUES ();

UNLOCK TABLES;
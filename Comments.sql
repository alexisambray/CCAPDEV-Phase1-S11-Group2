CREATE DATABASE IF NOT EXISTS `mco2db`
USE `Comments`
DROP TABLE IF EXISTS `User_Bookmarks`;
CREATE TABLE `Comments` (
  `CommentID` int NOT NULL,   
  `PostID` int NOT NULL,  
  `Username` varchar(20) DEFAULT NULL,   
  `Comment` varchar(45) DEFAULT NULL,   
  `Date` varchar(15) DEFAULT NULL
  PRIMARY KEY (`CommentID`)
  FOREIGN KEY (`Post ID`)
  FOREIGN KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `comments` WRITE;

INSERT INTO `comments` VALUES ();

UNLOCK TABLES;
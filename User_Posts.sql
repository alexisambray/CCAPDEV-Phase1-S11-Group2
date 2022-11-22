CREATE DATABASE IF NOT EXISTS `mco2db`
USE `mco2db`
DROP TABLE IF EXISTS `User_Posts`;
CREATE TABLE `User_Posts` (
  `PostID` int NOT NULL,   
  `Title` varchar(20) DEFAULT NULL,  
  `Username` varchar(20) DEFAULT NULL,   
  `Photo` BLOB DEFAULT NULL,   
  `Date` varchar(15) DEFAULT NULL,
  `Tags` varchar(20) DEFAULT NULL,   
  `LikeCount` int DEFAULT NULL,   
  `BookmarkCount` int DEFAULT NULL,  
  `CommentKey` int DEFAULT NULL
  PRIMARY KEY (`PostID`)
  FOREIGN KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `User_Posts` WRITE;

INSERT INTO `User_Posts` VALUES ();

UNLOCK TABLES;
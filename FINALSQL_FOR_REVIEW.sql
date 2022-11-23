UNLOCK TABLES;

CREATE DATABASE IF NOT EXISTS `mco2db`;
USE `mco2db`;




-- users table ------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `Username` varchar(20) NOT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL, 
  `ProfilePic`  BLOB DEFAULT NULL,
  `DisplayName` varchar(20) DEFAULT NULL, 
  `Bio` varchar(45) DEFAULT NULL,
   PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES ('bry_lil','p4ssw0rD','brylil@gmail.com', profilepic, 'Bryan', 'Asian traveller'),
('elliamae','password27','ellia@yahoo.com', 'profilepic','',''),
('emman','password32','emman@gmail.com','','',''),
('alexis','PassWerd455','alex23@hotmail.com','','',''),
('kevin32','password322','kev32@gmail.com','','','');

LOCK TABLES `users` WRITE;



-- user_posts table ------
UNLOCK TABLES;
DROP TABLE IF EXISTS `User_Posts`;
CREATE TABLE `User_Posts` (
  `PostID` int NOT NULL,   
  `Title` varchar(20) DEFAULT NULL,  
  `Username` varchar(20) DEFAULT NULL,   
  `Photo` BLOB DEFAULT NULL,   
  `Date` varchar(30) DEFAULT NULL,
  `Tags` varchar(20) DEFAULT NULL,   
  `LikeCount` int DEFAULT NULL,   
  `BookmarkCount` int DEFAULT NULL,  
  `CommentKey` int DEFAULT NULL,
  PRIMARY KEY (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE User_Posts
	ADD FOREIGN KEY (Username) REFERENCES Users (Username);

INSERT INTO `User_Posts` VALUES ('0001','Greek Mythology','bry_lil','','November 20, 2022','','2',0,23),
('0002','Ehem Title','elliamae','','November 22, 2022','','100',2,50);

LOCK TABLES `User_Posts` WRITE;

-- Testing Purposes
-- SELECT * FROM User_Posts;
-- SELECT * FROM Users;



-- user_bookmarks table ------
UNLOCK TABLES;
DROP TABLE IF EXISTS `User_Bookmarks`;
CREATE TABLE `User_Bookmarks` (
  `Username` varchar(20) DEFAULT NULL,
  `PostID` int NOT NULL,   
  PRIMARY KEY (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UNLOCK TABLES;
ALTER TABLE User_Bookmarks
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
    ADD FOREIGN KEY (PostID) REFERENCES User_Posts (PostID);

INSERT INTO `User_Bookmarks` VALUES ('bry_lil',0001),
('elliamae',0002);

LOCK TABLES `User_Bookmarks` WRITE;


-- Testing Purposes
-- SELECT * FROM User_Bookmarks;
-- SELECT * FROM Users;
-- SELECT * FROM User_Posts;



-- comments table ------
UNLOCK TABLES;
DROP TABLE IF EXISTS `Comments`;
CREATE TABLE `Comments` (
  `CommentID` int NOT NULL,   
  `PostID` int NOT NULL,  
  `Username` varchar(20) DEFAULT NULL,   
  `Comment` varchar(45) DEFAULT NULL,   
  `Date` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE Comments
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
    ADD FOREIGN KEY (PostID) REFERENCES User_Posts(PostID);

LOCK TABLES `comments` WRITE;

INSERT INTO `comments` VALUES (0001,1,'bry_lil','You look good!','November 25, 2020'),
(0002,2,'elliamae','go girl!','November 26, 2020');

-- testing purposes
 -- sELECT * FROM comments;
-- SELECT * FROM User_Bookmarks;
-- SELECT * FROM Users;
-- SELECT * FROM User_Posts;


-- User_Notifications Table --
UNLOCK TABLES;
DROP TABLE IF EXISTS `User_Notifications`;
CREATE TABLE `User_Notifications` (
  `NotifID` int NOT NULL,    
  `Username` varchar(20) DEFAULT NULL,   
  `PostID` int NOT NULL, 
  `LikeCount` int NOT NULL,
  `BookmarkCount` int NOT NULL,
  `Photo` BLOB DEFAULT NULL,   
  PRIMARY KEY (`NotifID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE User_Notifications 
	ADD FOREIGN KEY (Username) REFERENCES Users (Username);

ALTER TABLE User_Notifications 
    ADD FOREIGN KEY (PostID) REFERENCES User_Posts (PostID);
    
INSERT INTO `User_Notifications` VALUES (0001,'bry_lil',1,2,5,''),
(0002,'elliamae',2,100,2,'');

-- testing purposes
 -- sELECT * FROM comments;
-- SELECT * FROM User_Bookmarks;
 -- SELECT * FROM Users;
-- SELECT * FROM User_Posts;
-- SELECT * FROM User_Notifications;

-- table end ----



-- testing purposes
SELECT * FROM Users;
-- DELETE FROM Users where Username='bry_lil';
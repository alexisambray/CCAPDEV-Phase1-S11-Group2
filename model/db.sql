UNLOCK TABLES;

CREATE DATABASE IF NOT EXISTS `mpdb`;
USE `mpdb`;

-- users table ------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `Username` varchar(20) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `Email` varchar(50) NOT NULL, 
  `ProfilePic`  BLOB NOT NULL,
  `DisplayName` varchar(20) NOT NULL, 
  `Bio` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES ('brylil','p4ssw0rD','brylil@gmail.com',LOAD_FILE('/images/icon.jpg'), 'Bryan', 'Asian traveller'),
('elliamae','password27','ellia@yahoo.com',LOAD_FILE('/images/icon.jpg'),'Ellia',''),
('emman','password32','emman@gmail.com',LOAD_FILE('/images/icon.jpg'),'Emman',''),
('alexis','PassWerd455','alex23@hotmail.com',LOAD_FILE('/images/icon.jpg'),'Alexis',''),
('ccapdev','password322','kev32@gmail.com',LOAD_FILE('/images/icon.jpg'),'Apdev','');

LOCK TABLES `users` WRITE;



-- user_posts table ------
UNLOCK TABLES;
DROP TABLE IF EXISTS `User_Posts`;
CREATE TABLE `User_Posts` (
  `PostID` int NOT NULL,   
  `Title` varchar(30) NOT NULL,  
  `Username` varchar(20) NOT NULL,   
  `Photo` BLOB NOT NULL,   
  `Date` DATE NOT NULL,
  `Tags` varchar(50) DEFAULT NULL,
  `Caption` varchar(280) DEFAULT NULL,   
  `LikeCount` int NOT NULL,   
  `BookmarkCount` int NOT NULL,  
  `CommentCount` int NOT NULL,
  PRIMARY KEY (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE User_Posts
	ADD FOREIGN KEY (Username) REFERENCES Users (Username);

INSERT INTO `User_Posts` VALUES (1,'Maldives','brylil',LOAD_FILE('/images/myPost1.jpg'),'2022-11-23','','Picture I took!','0','0','0'),
(2,'Philippines','elliamae',LOAD_FILE('/images/myPost2.jpg'),'2022-11-23','','Look at this place!','0','0','0'),
(3,'Sweden','emman',LOAD_FILE('/images/myPost3.jpg'),'2022-11-23','','What a dazzling view','0','0','0'),
(4,'NYC','alexis',LOAD_FILE('/images/myPost4.jpg'),'2022-11-23','','New York City','0','0','0'),
(5,'Toronto','ccapdev',LOAD_FILE('/images/myPost5.jpg'),'2022-11-23','','I am now in Canada wow','0','0','0');

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
  PRIMARY KEY (`Username`, `PostID`),
  FOREIGN KEY (`Username`) REFERENCES Users (`Username`),
  FOREIGN KEY (`PostID`) REFERENCES User_Posts (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UNLOCK TABLES;
/*ALTER TABLE User_Bookmarks
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
    ADD FOREIGN KEY (PostID) REFERENCES User_Posts (PostID);*/

INSERT INTO `User_Bookmarks` VALUES ('brylil',1),
('elliamae',2),
('emman',3),
('alexis',2),
('alexis',1);

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
  `Username` varchar(20) NOT NULL,   
  `Comment` varchar(280) NOT NULL,   
  `Date` DATE NOT NULL,
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE Comments
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
    ADD FOREIGN KEY (PostID) REFERENCES User_Posts(PostID);

LOCK TABLES `comments` WRITE;

INSERT INTO `comments` VALUES (1,1,'emman','This looks good!','2022-23-11'),
(2,2,'alexis','go girl!','2022-23-11'),
(3,3,'ellia','What a nice photo','2022-23-11'),
(4,4,'ccapdev','First comment','2022-23-11'),
(5,5,'brylil','First comment','2022-23-11');

-- testing purposes
-- SELECT * FROM comments;
-- SELECT * FROM User_Bookmarks;
-- SELECT * FROM Users;
-- SELECT * FROM User_Posts;


-- User_Notifications Table --
/* UNLOCK TABLES;
DROP TABLE IF EXISTS `User_Notifications`;
CREATE TABLE `User_Notifications` (
`NotifID` int NOT NULL,    
`Username` varchar(20) NOT NULL,   
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
  
INSERT INTO `User_Notifications` VALUES (1,'brylil',1,2,5,''),
(2,'elliamae',2,100,2,''); */

-- testing purposes
 -- sELECT * FROM comments;
-- SELECT * FROM User_Bookmarks;
 -- SELECT * FROM Users;
-- SELECT * FROM User_Posts;
-- SELECT * FROM User_Notifications;

-- table end ----



-- testing purposes
-- SELECT * FROM Users;
-- DELETE FROM Users where Username='brylil';
UNLOCK TABLES;

CREATE DATABASE IF NOT EXISTS `mpdb`;
USE `mpdb`;

DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `user_bookmarks`;
DROP TABLE IF EXISTS `user_posts`;
DROP TABLE IF EXISTS `users`;

-- users table ------
CREATE TABLE `users` (
  `Username` varchar(20) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `Email` varchar(50) NOT NULL, 
  `ProfilePic` varchar(100) NOT NULL,
  `DisplayName` varchar(20) NOT NULL, 
  `Bio` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Note: All sample passwords are "password" in md5 hash*/
INSERT INTO `users` VALUES ('brylil','$2a$10$J8G9AUA6MAOBa4292wCI0OHV5hXAt5vUHZZLLeloyIBPZK/u2Y9aq','brylil@gmail.com','/images/icons/user3.jpeg', 'Bryan', 'Asian traveller'),
('elliamae','$2a$10$J8G9AUA6MAOBa4292wCI0OHV5hXAt5vUHZZLLeloyIBPZK/u2Y9aq','ellia@yahoo.com','/images/icons/user1.jpg','Ellia','Hello world! This is my bio'),
('emman','$2a$10$J8G9AUA6MAOBa4292wCI0OHV5hXAt5vUHZZLLeloyIBPZK/u2Y9aq','emman@gmail.com','/images/icons/user4.jpg','Emman','Bon voyage!'),
('alexis','$2a$10$J8G9AUA6MAOBa4292wCI0OHV5hXAt5vUHZZLLeloyIBPZK/u2Y9aq','alex23@hotmail.com','/images/icons/user2.jpeg','Alexis','I like photography'),
('ccapdev','$2a$10$J8G9AUA6MAOBa4292wCI0OHV5hXAt5vUHZZLLeloyIBPZK/u2Y9aq','apdev@gmail.com','/images/icons/user5.jpg','Apdev','This is MP Phase 2.');

LOCK TABLES `users` WRITE;

-- user_posts table ------
UNLOCK TABLES;
CREATE TABLE `user_posts` (
  `PostID` int NOT NULL AUTO_INCREMENT,   
  `Title` varchar(30) NOT NULL,  
  `Username` varchar(20) NOT NULL,   
  `Photo` varchar(100) NOT NULL,
  `Date` DATE NOT NULL,
  `Tags` varchar(50) DEFAULT NULL,
  `Caption` varchar(280) DEFAULT NULL,   
  `LikeCount` int NOT NULL DEFAULT '0',   
  `BookmarkCount` int NOT NULL DEFAULT '0',  
  `CommentCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE user_posts
	ADD FOREIGN KEY (Username) REFERENCES users (Username);

INSERT INTO `user_posts` (`Title`, `Username`, `Photo`, `Date`, `Tags`, `Caption`, `LikeCount`, `BookmarkCount`, `CommentCount`)
VALUES ('Maldives','brylil','/images/posts/myPost1.jpg','2022-11-23','travel, photography, beach','Picture I took!','1','2','1'),
('Philippines','elliamae','/images/posts/myPost2.jpg','2022-11-23','photography, beach','Look at this place!','1','2','2'),
('Sweden','emman','/images/posts/myPost3.jpg','2022-11-23','travel','What a dazzling view','1','1','1'),
('NYC','alexis','/images/posts/myPost4.jpeg','2022-11-23','photo, travel, city','New York City','1','0','0'),
('Toronto','ccapdev','/images/posts/myPost5.jpeg','2022-11-23','city','I am now in Canada wow','1','0','1');

LOCK TABLES `user_posts` WRITE;

-- Testing Purposes
-- SELECT * FROM User_Posts;
-- SELECT * FROM Users;



-- user_bookmarks table ------
UNLOCK TABLES;
CREATE TABLE `user_bookmarks` (
  `Username` varchar(20) NOT NULL,
  `PostID` int NOT NULL,   
  PRIMARY KEY (`Username`, `PostID`),
  FOREIGN KEY (`Username`) REFERENCES users (`Username`),
  FOREIGN KEY (`PostID`) REFERENCES user_posts (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UNLOCK TABLES;
/*ALTER TABLE User_Bookmarks
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
  ADD FOREIGN KEY (PostID) REFERENCES User_Posts (PostID);*/

INSERT INTO `user_bookmarks` VALUES ('brylil',2),
('elliamae',1),
('emman',3),
('alexis',2),
('alexis',1);

LOCK TABLES `user_bookmarks` WRITE;


-- Testing Purposes
-- SELECT * FROM User_Bookmarks;
-- SELECT * FROM Users;
-- SELECT * FROM User_Posts;



-- comments table ------
UNLOCK TABLES;
CREATE TABLE `comments` (
  `CommentID` int NOT NULL AUTO_INCREMENT,   
  `PostID` int NOT NULL,  
  `Username` varchar(20) NOT NULL,   
  `Comment` varchar(280) NOT NULL,   
  `Date` DATE NOT NULL,
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE comments
	ADD FOREIGN KEY (Username) REFERENCES users (Username),
  ADD FOREIGN KEY (PostID) REFERENCES user_posts(PostID);

LOCK TABLES `comments` WRITE;

INSERT INTO `comments` (`PostID`, `Username`, `Comment`, `Date`) 
VALUES (1,'emman','This looks good!','2022-11-23'),
(2,'alexis','go girl!','2022-11-23'),
(3,'elliamae','What a nice photo','2022-11-23'),
(2,'ccapdev','I love this!!!','2022-11-23'),
(5,'brylil','First comment','2022-11-23');

-- testing purposes
-- SELECT * FROM comments;
-- SELECT * FROM User_Bookmarks;
-- SELECT * FROM Users;
-- SELECT * FROM User_Posts;

-- likes table ------
UNLOCK TABLES;
CREATE TABLE `likes` (
  `Username` varchar(20) NOT NULL,
  `PostID` int NOT NULL,   
  PRIMARY KEY (`Username`, `PostID`),
  FOREIGN KEY (`Username`) REFERENCES users (`Username`),
  FOREIGN KEY (`PostID`) REFERENCES user_posts (`PostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UNLOCK TABLES;
/*ALTER TABLE User_Bookmarks
	ADD FOREIGN KEY (Username) REFERENCES Users (Username),
  ADD FOREIGN KEY (PostID) REFERENCES User_Posts (PostID);*/

INSERT INTO `likes` VALUES ('brylil',5),
('elliamae',4),
('emman',3),
('alexis',2),
('alexis',1);

LOCK TABLES `user_bookmarks` WRITE;


-- User_Notifications Table --
UNLOCK TABLES;
/*DROP TABLE IF EXISTS `User_Notifications`;
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
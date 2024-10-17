DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Likes;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(64),
  password VARCHAR(64) NOT NULL,
  admin BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (username)
)ENGINE=INNODB;

CREATE TABLE Likes (
  user_id INT NOT NULL,
  meal_id INT NOT NULL,
  PRIMARY KEY (user_id, meal_id)
)ENGINE=INNODB;

ALTER TABLE Likes
  ADD FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(meal_id) REFERENCES Meals(id) ON DELETE CASCADE;

INSERT INTO Users VALUES (NULL, 'admin', 'admin@db.no', '$2b$10$iHzdxYVga/pflcRixayiTuzlcddXSTsyHcI2S9bkli9KFnRb.IlE6', 1);
-- Inserted password for admin: 'admin';
INSERT INTO Users VALUES (NULL, 'test', 'test@db.no', '$2b$10$gZNB46SSPkxxMrA2.m.oMuCxg18Su5E/oYqOVEp0NeSYllZK2Fi9m', 1);
-- Inserted password for test: 'test';

INSERT INTO Likes VALUES (1, 1);
INSERT INTO Likes VALUES (2, 1);
INSERT INTO Likes VALUES (2, 2);
INSERT INTO Likes VALUES (2, 3);

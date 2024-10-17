
DROP TABLE IF EXISTS Meals;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Area;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Measurements;
DROP TABLE IF EXISTS Meal_ingredient_measure;

CREATE TABLE Meals (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  drink VARCHAR(32),
  category INT NOT NULL,
  area INT NOT NULL,
  instructions TEXT NOT NULL,
  thumb TEXT,
  youtube TEXT,
  likes INT,
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE Category (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(32),
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE Area (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(32),
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE Ingredients (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64),
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE Measurements (
  id INT NOT NULL AUTO_INCREMENT,
  abbreviation VARCHAR(32),
  singular VARCHAR(32),
  plural VARCHAR(32),
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE Meal_ingredient_measure (
  meal_id INT NOT NULL,
  ingredient INT NOT NULL,
  number INT,
  measurement INT,
  PRIMARY KEY (meal_id, ingredient)
)ENGINE=INNODB;

ALTER TABLE Meals
  ADD FOREIGN KEY(category) REFERENCES Category(id),
  ADD FOREIGN KEY(area) REFERENCES Area(id);

ALTER TABLE Meal_ingredient_measure
  ADD FOREIGN KEY(meal_id) REFERENCES Meals(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(ingredient) REFERENCES Ingredients(id),
  ADD FOREIGN KEY(measurement) REFERENCES Measurements(id);
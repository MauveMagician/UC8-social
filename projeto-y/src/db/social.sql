CREATE DATABASE social;
USE social;
CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL);
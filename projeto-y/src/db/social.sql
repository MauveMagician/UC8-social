CREATE DATABASE social;
USE social;
DROP TABLE users;
CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) NOT NULL, password VARCHAR(512) NOT NULL, nome VARCHAR(50));
CREATE DATABASE social;
USE social;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pfp;
CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) NOT NULL, password VARCHAR(512) NOT NULL, nome VARCHAR(50));
CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) NOT NULL, password VARCHAR(512) NOT NULL, nome VARCHAR(50));
CREATE TABLE pfp(photo_id INT PRIMARY KEY auto_increment, user_id INT, photo VARCHAR(1024), FOREIGN KEY (user_id) REFERENCES users (user_id));

CREATE TABLE posts(post_id INT PRIMARY KEY auto_increment, user_id INT, content VARCHAR(140), FOREIGN KEY (user_id) REFERENCES users(user_id));
CREATE TABLE pfp(photo_id INT PRIMARY KEY auto_increment, user_id INT, photo VARCHAR(1024), FOREIGN KEY (user_id) REFERENCES users (user_id));
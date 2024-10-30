DROP DATABASE social;
CREATE DATABASE social;
USE social;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pfp;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS requacks;

CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(512) NOT NULL, arroba VARCHAR(25) UNIQUE NOT NULL, nome VARCHAR(50), bio VARCHAR(256));
CREATE TABLE posts(post_id INT PRIMARY KEY auto_increment, user_id INT, content VARCHAR(140), FOREIGN KEY (user_id) REFERENCES users(user_id), post_date DATETIME);
CREATE TABLE pfp(photo_id INT PRIMARY KEY auto_increment, user_id INT, photo VARCHAR(1024), FOREIGN KEY (user_id) REFERENCES users (user_id));
CREATE TABLE likes(
    likes_id INT PRIMARY KEY auto_increment,
    user_id INT,
    post_id INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE
);
CREATE TABLE requacks(requacks_id INT PRIMARY KEY auto_increment, user_id INT, post_id INT, FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE, FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE);
CREATE TABLE followers(followers_id INT PRIMARY KEY auto_increment, user_id INT, FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE, user_id2 INT, FOREIGN KEY (user_id2) REFERENCES users (user_id) ON DELETE CASCADE);

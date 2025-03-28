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
CREATE TABLE notifications(
    notification_id INT PRIMARY KEY auto_increment,
    user_id INT,
    type ENUM('curtida', 'requack', 'mencao') NOT NULL,
    post_id INT,
    actor_id INT,
    message VARCHAR(256),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
    DECLARE mentioned_user_id INT;
    DECLARE mention_position INT;
    DECLARE mention_end INT;
    DECLARE mentioned_arroba VARCHAR(25);
    DECLARE hashtag_text VARCHAR(140);
    DECLARE hashtag_position INT;
    DECLARE hashtag_end INT;
    DECLARE hashtag_id INT;

    -- Handle mentions
    SET mention_position = LOCATE('@', NEW.content);
    WHILE mention_position > 0 DO
        -- ... (existing mention handling code)
    END WHILE;

    -- Handle hashtags
    SET hashtag_position = LOCATE('#', NEW.content);
    WHILE hashtag_position > 0 DO
        -- Find the end of the hashtag (space or end of string)
        SET hashtag_end = LOCATE(' ', NEW.content, hashtag_position);
        IF hashtag_end = 0 THEN
            SET hashtag_end = LENGTH(NEW.content) + 1;
        END IF;
    
        -- Extract the hashtag
        SET hashtag_text = SUBSTRING(NEW.content, hashtag_position + 1, hashtag_end - hashtag_position - 1);
    
        -- Insert or get the hashtag ID
        INSERT IGNORE INTO hashtags (hashtag) VALUES (hashtag_text);
        SELECT hashtag_id INTO hashtag_id FROM hashtags WHERE hashtag = hashtag_text;
    
        -- Link the hashtag to the post
        INSERT INTO posts_hashtags (post_id, hashtag_id, hashtag) VALUES (NEW.post_id, hashtag_id, hashtag_text);
    
        -- Look for the next hashtag
        SET hashtag_position = LOCATE('#', NEW.content, hashtag_end);
    END WHILE;
END//

DELIMETER ;

-- Create table for hashtags
CREATE TABLE hashtags (
    hashtag_id INT PRIMARY KEY AUTO_INCREMENT,
    hashtag VARCHAR(140) UNIQUE NOT NULL
);

-- Create table for the many-to-many relationship between posts and hashtags
CREATE TABLE posts_hashtags (
    post_id INT,
    hashtag_id INT,
    hashtag VARCHAR(140) NOT NULL,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id) ON DELETE CASCADE
);
-- Create index on hashtag column for faster searches
CREATE INDEX idx_hashtag ON hashtags(hashtag);

DELIMITER ;
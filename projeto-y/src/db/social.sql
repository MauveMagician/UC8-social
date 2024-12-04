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

    -- Find the position of '@' in the post content
    SET mention_position = LOCATE('@', NEW.content);

    WHILE mention_position > 0 DO
        -- Find the end of the mention (space or end of string)
        SET mention_end = LOCATE(' ', NEW.content, mention_position);
        IF mention_end = 0 THEN
            SET mention_end = LENGTH(NEW.content) + 1;
        END IF;

        -- Extract the mentioned arroba
        SET mentioned_arroba = SUBSTRING(NEW.content, mention_position + 1, mention_end - mention_position - 1);

        -- Find the user_id of the mentioned user
        SELECT user_id INTO mentioned_user_id
        FROM users
        WHERE arroba = mentioned_arroba;

        -- If a valid user was mentioned, create a notification
        IF mentioned_user_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, type, post_id, actor_id, message)
            VALUES (mentioned_user_id, 'mencao', NEW.post_id, NEW.user_id, 
                    CONCAT('You were mentioned in a post by @', (SELECT arroba FROM users WHERE user_id = NEW.user_id)));
        END IF;

        -- Look for the next mention
        SET mention_position = LOCATE('@', NEW.content, mention_end);
    END WHILE;
END//

DELIMITER ;
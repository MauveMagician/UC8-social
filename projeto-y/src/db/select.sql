SELECT p.post_id, p.user_id, p.content, pfp.photo, u.nome, u.arroba, p.post_date
FROM posts p
JOIN followers f ON p.user_id = f.user_id2
JOIN users u ON p.user_id = u.user_id
LEFT JOIN pfp ON p.user_id = pfp.user_id 
WHERE f.user_id = 1
UNION
SELECT p.post_id, p.user_id, p.content, pfp.photo, u.nome, u.arroba, p.post_date
FROM requacks r
JOIN followers f ON r.user_id = f.user_id2
JOIN posts p ON r.post_id = p.post_id
JOIN users u ON r.user_id = u.user_id
LEFT JOIN pfp ON r.user_id = pfp.user_id
WHERE f.user_id = 1
ORDER BY post_date DESC
LIMIT 50;
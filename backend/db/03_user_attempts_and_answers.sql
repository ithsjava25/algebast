-- 1. Tabell för att spara övergripande provförsök
CREATE TABLE IF NOT EXISTS user_exam_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    time_spent_seconds INT COMMENT 'Tidsåtgång i sekunder',
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(id) ON DELETE CASCADE
);

-- 2. Tabell för enskilda svar (både för övningsläge och kopplat till helprov)
CREATE TABLE IF NOT EXISTS user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    attempt_id INT NULL COMMENT 'NULL vid enstaka övningsfrågor, länkat vid helprov',
    question_id INT NOT NULL,
    selected_position TINYINT COMMENT '1-5 eller NULL om obesvarad',
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (attempt_id) REFERENCES user_exam_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);
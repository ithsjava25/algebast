CREATE DATABASE IF NOT EXISTS algeBest_db;
USE algeBest_db;

CREATE TABLE exam (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  year      SMALLINT NOT NULL,
  semester  ENUM('VT','HT') NOT NULL,
  session   TINYINT NOT NULL,
  UNIQUE KEY uq_exam_year_semester_session (year, semester, session),
  CONSTRAINT ck_exam_session CHECK (session IN (1, 2))
);

CREATE TABLE question (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  exam_id         INT NOT NULL,
  question_order  TINYINT NOT NULL,
  category        ENUM('XYZ','KVA','NOG','DTK') NOT NULL,
  question_text   TEXT NOT NULL,
  image_url       VARCHAR(255) NULL,
  explanation     TEXT NULL,
  UNIQUE KEY uq_question_position (exam_id, question_order),
  CONSTRAINT ck_question_order CHECK (question_order BETWEEN 1 AND 40),
  CONSTRAINT fk_question_exam
    FOREIGN KEY (exam_id) REFERENCES exam(id)
    ON DELETE CASCADE
);

CREATE TABLE answer_option (
  question_id       INT NOT NULL,
  position          TINYINT NOT NULL,
  option_text       TEXT NULL,
  option_image_url  VARCHAR(255) NULL,
  is_correct        BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (question_id, position),
  CONSTRAINT ck_option_position CHECK (position BETWEEN 1 AND 5),
  CONSTRAINT ck_option_not_empty
    CHECK (option_text IS NOT NULL OR option_image_url IS NOT NULL),
  CONSTRAINT fk_option_question
    FOREIGN KEY (question_id) REFERENCES question(id)
    ON DELETE CASCADE
);
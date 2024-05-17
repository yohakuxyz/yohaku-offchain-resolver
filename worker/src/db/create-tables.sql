DROP TABLE IF EXISTS names;

CREATE TABLE IF NOT EXISTS names (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name TEXT UNIQUE,
	owner TEXT NOT NULL UNIQUE,
	texts TEXT,
	addresses TEXT,
	contenthash TEXT,
	status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
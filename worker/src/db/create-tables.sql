DROP TABLE IF EXISTS names;

CREATE TABLE IF NOT EXISTS names (
	name TEXT NOT NULL PRIMARY KEY,
	owner TEXT NOT NULL,
	texts TEXT,
	addresses TEXT,
	contenthash TEXT,
	status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS names;

CREATE TABLE IF NOT EXISTS names (
	id ROWID PRIMARY KEY,
	name TEXT UNIQUE,
	owner TEXT NOT NULL UNIQUE,
	texts TEXT,
	addresses TEXT,
	contenthash TEXT,
	status TEXT CHECK(status IN ('approved', 'pending', 'rejected')) DEFAULT 'pending',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
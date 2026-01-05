CREATE TABLE IF NOT EXISTS master(
    master_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	patronymic VARCHAR(50),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
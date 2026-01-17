CREATE TABLE IF NOT EXISTS client(
    client_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	patronymic VARCHAR(50),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE
);
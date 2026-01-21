CREATE TABLE IF NOT EXISTS service(
    service_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Стрижка', 'Окрашивание', 'Укладка', 
        'Маникюр', 'Педикюр', 'Визаж', 
        'Депиляция', 'Массаж', 'Косметология'
    ))
);
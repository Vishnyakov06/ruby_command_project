CREATE TABLE IF NOT EXISTS booking(
    booking_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
    master_id INTEGER NOT NULL REFERENCES master(master_id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES service(service_id) ON DELETE CASCADE,
    date_service TIMESTAMP NOT NULL,
    price INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Подтверждена' CHECK (status IN (
        'Подтверждена', 
        'Выполнена', 
        'Отменена', 
        'Неявка')
    ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE (master_id, date_service)
);
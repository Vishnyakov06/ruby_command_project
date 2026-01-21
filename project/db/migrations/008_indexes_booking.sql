CREATE INDEX idx_booking_client_id ON booking (client_id);
CREATE INDEX idx_booking_master_id ON booking (master_id);
CREATE INDEX idx_booking_service_id ON booking (service_id);
CREATE INDEX idx_booking_date_service ON booking (date_service);

CREATE INDEX idx_booking_master_date ON booking (master_id, date_service);
CREATE INDEX idx_booking_client_date ON booking (client_id, date_service);
CREATE INDEX idx_booking_client_status_date ON booking (client_id, status, date_service);
CREATE INDEX idx_booking_client_status_created ON booking (client_id, status, created_at);
class Booking < ApplicationRecord
    self.table_name = 'booking' 
    
    belongs_to :client, foreign_key: 'client_id'
    belongs_to :master, foreign_key: 'master_id'
    belongs_to :service, foreign_key: 'service_id'

    validates :client_id, :master_id, :service_id, :date_service, :price, presence: true
    validates :price, numericality: { greater_than: 0 }
    validates :status, inclusion: { in: %w[Подтверждена Выполнена Отменена Неявка], message: "%{value} не является допустимым статусом" }
    validates :master_id, uniqueness: { scope: :date_service, message: "Уже имеет запись на это время" }
    validate :master_is_active
    validate :date_service_in_future, on: :create

    STATUSES = ['Подтверждена', 'Выполнена', 'Отменена', 'Неявка'].freeze
   
    private
    
    def master_is_active
        if master && !master.is_active
            errors.add(:master_id, "Не активен и не может принимать записи")
        end
    end
    
    def date_service_in_future
        if date_service.present? && date_service <= Time.current
            errors.add(:date_service, "Должна быть в будущем")
        end
    end
end
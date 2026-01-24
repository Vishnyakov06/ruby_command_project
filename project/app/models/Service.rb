class Service < ApplicationRecord
    self.table_name = 'service'
    self.primary_key = 'service_id'

    has_many :bookings, foreign_key: 'service_id', dependent: :destroy
    
    validates :title,
        presence: true,
        length: { in: 1..100 },
        uniqueness: true
    validates :duration, 
        numericality: {
            greater_than_or_equal_to: 15,
            less_than_or_equal_to: 240
        }
    validates :base_price,
        numericality: {
            only_integer: true,
            greater_than_or_equal_to: 100,
            less_than_or_equal_to: 50_000
        }
    CATEGORIES = %w[
        Стрижка Окрашивание Укладка Маникюр 
        Педикюр Визаж Депиляция Массаж Косметология
    ]
    validates :category, 
        inclusion: { in: CATEGORIES }

    def to_h
        {
            service_id: service_id,
            title: title,
            duration: duration,
            base_price: base_price,
            category: category
        }
    end
end
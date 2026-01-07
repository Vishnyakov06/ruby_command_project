class Service < ApplicationRecord
    self.table_name = 'service'
    has_many :bookings, foreign_key: 'service_id', dependent: :destroy
    
    validates :title, :duration, :base_price, :category, presence: true
    validates :base_price, numericality: { greater_than: 0 }
    validates :category, inclusion: { in: %w[
        Cтрижка Окрашивание Укладка Маникюр Педикюр Визаж Депиляция Массаж Косметология
    ], message: "%{value} не является допустимой категорией" }
    
    CATEGORIES = [
        'Cтрижка', 'Окрашивание', 'Укладка', 
        'Маникюр', 'Педикюр', 'Визаж', 
        'Депиляция', 'Массаж', 'Косметология'
    ].freeze
end
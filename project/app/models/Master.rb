class Master < ApplicationRecord
    self.table_name = 'master'
    self.primary_key = 'master_id'
    
    has_many :bookings, foreign_key: 'master_id', dependent: :destroy
    
    validates :last_name, :first_name,
        presence: true,
        length: { in: 1..50 },
        format: { with: /\A[a-zA-Zа-яА-Я\-]+\z/ }
    validates :patronymic,
        length: { maximum: 50 },
        format: { with: /\A[a-zA-Zа-яА-Я\-]+\z/ },
        allow_blank: true
    validates :phone_number, 
        presence: true, 
        uniqueness: true, 
        format: { with: /\A(\+7|8)\d{10}\z/ }
    validates :is_active, inclusion: { in: [true, false] }
end
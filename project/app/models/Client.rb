class Client < ApplicationRecord
    self.table_name = 'client'
    self.primary_key = 'client_id'

    has_many :bookings, foreign_key: 'client_id', dependent: :destroy

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
        format: { 
            with: /\A(\+7|8)\d{10}\z/
        }
    
    validate :registration_date_valid
    
    def registration_date_valid
        return if registration_date.blank?

        if registration_date < Date.new(2020, 1, 1)
            errors.add(:registration_date, 'не может быть раньше 01.01.2020')
        end

        if registration_date > Date.today
            errors.add(:registration_date, 'не может быть в будущем')
        end
    end
end
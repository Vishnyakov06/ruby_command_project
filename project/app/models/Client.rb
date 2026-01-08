class Client < ApplicationRecord
    self.table_name = 'client'
    has_many :bookings,foreign_key: 'client_id',dependent: :destroy
    validates :last_name, :first_name, :phone_number, presence: true
    validates :phone_number, uniqueness: true
    validates :phone_number, format: { with: /\A\+?[\d\s\-\(\)]+\z/, message: "должен быть допустимым номером телефона" }
end
class Master < ApplicationRecord
    self.table_name = 'master'
     has_many :bookings, foreign_key: 'master_id', dependent: :destroy
    scope :active, -> { where(is_active: true) }
    scope :inactive, -> { where(is_active: false) }
    
    validates :last_name, :first_name, :phone_number, presence: true
    validates :phone_number, uniqueness: true
    validates :phone_number, format: { with: /\A\+?[\d\s\-\(\)]+\z/, message: "должен быть допустимым номером телефона" }
end
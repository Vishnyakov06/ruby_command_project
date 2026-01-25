require_relative "Base_json"

class MasterJson < BaseJson

    def self.model
        'masters'
    end

    def self.active
        where(is_active: true)
    end
  
    def self.inactive
        where(is_active: false)
    end

end
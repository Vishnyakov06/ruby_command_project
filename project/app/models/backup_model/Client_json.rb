require_relative "Base_json"

class ClientJson < BaseJson

    def self.model
        'clients'
    end

    def self.create_hook(hash)
        hash["registration_date"] = Date.today.strftime("%Y-%m-%d")
        hash
    end

end
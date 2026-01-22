class Request
    attr_reader :payload, :type, :message
    def initialize(type,message, payload = {})
        @type=type
        @message=message
        @payload=payload
    end
    def get_type
        @type
    end
    def get_message
        "#{@message} | Payload: #{@payload}"
    end
end
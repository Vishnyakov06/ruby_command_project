class Request
    def initialize(type,message)
        @type=type
        @message=message
    end
    def get_type
        @type
    end
    def get_message
        @message
    end
end
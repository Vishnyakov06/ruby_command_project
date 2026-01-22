class ApplicationError < StandardError
    attr_reader :original, :code, :details

    def initialize(message = nil, original = nil, code: nil, details: {})
        super(message)
        @original = original
        @code = code
        @details = details
    end
end
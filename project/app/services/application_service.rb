class ApplicationService
    def self.call(*args, **kwargs)
        new(*args, **kwargs).call
    end
    
    private 

    def log_info(message, payload = {})
        @logger.log(Request.new("INFO", message, payload))
    end

    def log_error(message, payload = {})
        @logger.log(Request.new("ERROR", message, payload))
    end

    def log_warn(message, payload = {})
        @logger.log(Request.new("WARN", message, payload))
    end

    def log_debug(message, payload = {})
        @logger.log(Request.new("DEBUG", message, payload))
    end
end
class ConsoleLogHandler < BaseHandler
    def log(request)
        if(handles?(request))
            Rails.logger.warn("CONSOLE LOG: #{request.get_type} - #{request.get_message}")
        end
        forward(request)
    end

    private

    def handles?(request)
        request.get_type == "WARN"
    end
end
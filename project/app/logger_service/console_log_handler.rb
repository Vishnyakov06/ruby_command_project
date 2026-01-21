class ConsoleLogHandler < BaseHandler
    def log(request)
        if(request.get_type=="WARN"||request.get_type=="ERROR")
            p "CONSOLE LOG: #{request.get_type} - #{request.get_message}"
        end
        forward(request)
    end
end
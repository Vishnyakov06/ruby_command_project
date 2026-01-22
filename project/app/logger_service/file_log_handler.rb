class FileLogHandler < BaseHandler
    def initialize(handler,file_path: Rails.root.join('app', 'logger_service', 'logs', 'app.log'))
        super(handler)
        @file_path= file_path
    end
    def log(request)
        if(handles?(request))
            File.open(@file_path, 'a') do |file|
                file.puts "FILE LOG: #{request.get_type} - #{request.get_message}"
            end
        end
        forward(request)
    end

    private

    def handles?(request)
        request.get_type != "WARN"
    end
end
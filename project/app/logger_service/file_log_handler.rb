class FileLogHandler < BaseHandler
    def initialize(request)
        super(request)
        @file_path= Rails.root.join('app',
                                'logger_service',
                                'logs',
                                'app.log')
    end
    def log(request)
        if(request.get_type=="DEBUG"||request.get_type=="INFO")
            File.open(@file_path, 'a') do |file|
                file.puts "FILE LOG: #{request.get_type} - #{request.get_message}"
            end
        end
        forward(request)
    end
end
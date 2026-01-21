class LogChainFactory
    @instance = nil
    private_class_method :new
    def self.instance
        @instance ||=new
    end
    def create_chain
        file_log=FileLogHandler.new(nil)
        console_log=ConsoleLogHandler.new(file_log)
        console_log
    end
end
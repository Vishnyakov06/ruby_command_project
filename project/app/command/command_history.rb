class CommandHistory
    #TODO Singleton pattern
    #TODO Session-based history
    @history = []
    def self.push(command)
        @history << command
        @history.shift if @history.size > 10
    end
    def self.pop
        @history.pop
    end
    def self.empty?
        @history.empty?
    end
end
class CommandHistory
    @history = []
    def self.push(command)
        p @history
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
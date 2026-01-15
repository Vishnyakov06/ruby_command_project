class CommandHistory
    def initialize
        @history = []
    end
    def push(command)
        @history << command
        @history.shift if @history.size > 10
    end
    def pop
        @history.pop
    end
    def empty?
        @history.empty?
    end
end
class Event
    def self.execute_command(command)
        entity=command.execute
        CommandHistory.push(command)
        entity
    end
    def self.undo_last_command
        return if CommandHistory.empty?
        command = CommandHistory.pop
        command.undo
    end
end
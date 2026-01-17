class Event
    def self.execute_command(command,session)
        entity=command.execute
        CommandHistory.new(session).push(command.description)
        entity
    end
    def self.undo_last_command(session)
        history=CommandHistory.new(session)
        return if history.empty?
        description = history.pop
        command=CommandFactory.create(description)
        command.undo
        description
    end
end
class EventMediator

    def self.execute_command(action:,model: nil,entity:nil,params:,session:)
        command = create_command(action: action,model:model,entity:entity,params:params)
        p command
        entity=command.execute
        CommandHistory.new(session).push(command.description)
        entity
    end

    def self.undo_last_command(session)
        history=CommandHistory.new(session)
        p history
        return if history.empty?
        description = history.pop
        command=CommandFactory.create(description)
        command.undo
        description
    end

    private 
    def self.create_command(action:, model:, entity:, params:)
        case action
        when :create
            CreateCommand.new(model,params)
        when :update
            UpdateCommand.new(entity,params)
        when :delete
            DeleteCommand.new(entity)
        else
            raise "Unknown action #{action}"
        end
    end
end
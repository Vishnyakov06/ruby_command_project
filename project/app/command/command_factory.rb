class CommandFactory
  def self.create(description)
    model = description["entity"].constantize
    pk = description["primary_key"]
    case description["type"]
      
    when "create"
      entity = model.find_by(pk => description["id"])
      cmd = CreateCommand.allocate
      cmd.instance_variable_set(:@entity, entity)
      cmd

    when "update"
      snapshot = description["snapshot"]
      entity= model.find_by(pk => snapshot[pk])

      cmd = UpdateCommand.allocate
      cmd.instance_variable_set(:@entity, entity)
      cmd.instance_variable_set(
        :@snapshot,
        Snapshot.new(entity,snapshot)
      )
      cmd

    when "delete"
      snapshot = description["snapshot"]
      entity=model.find_by(pk => description["id"])
      cmd = DeleteCommand.allocate
      cmd.instance_variable_set(
        :@snapshot,
        Snapshot.new(model,snapshot)
      )
      cmd
    end
  end
end
